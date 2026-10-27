// src/lib/parser.ts
// Ported from the Python backend services to pure TypeScript for the Electron desktop app.
// This module provides utilities to extract text from supported files, compute similarity
// against mock sources, run the AI‑generation likelihood analysis, and extract simple citations.

import JSZip from 'jszip';
import { mockData } from '../mock-data'; // mock sources used for similarity matching

// ---------- Helper for PDF plain text extraction fallback ----------
function extractPdfTextFallback(uint8: Uint8Array): string {
  let raw = '';
  const chunkSize = 8192;
  for (let i = 0; i < uint8.length; i += chunkSize) {
    const chunk = uint8.subarray(i, i + chunkSize);
    raw += String.fromCharCode.apply(null, Array.from(chunk));
  }

  const matches = raw.match(/\(([^)]+)\)/g) || [];
  const textChunks: string[] = [];

  for (const m of matches) {
    const content = m.slice(1, -1);
    if (content.length < 3) continue;
    if (/[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f-\xff]/.test(content)) continue;
    if (content.startsWith('/') || content.startsWith('%')) continue;

    const cleanChunk = content
      .replace(/\\([\(\)])/g, '$1')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t');

    textChunks.push(cleanChunk);
  }

  const cleanText = textChunks.join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleanText.length < 50) {
    return "[PDF contains compressed streams. Please convert it to DOCX or TXT for complete offline analysis.]";
  }

  return cleanText;
}

// ---------- Modern PDF text extraction using dynamically loaded PDF.js ----------
async function extractPdfText(uint8: Uint8Array): Promise<string> {
  // Check if we are running in browser context (Node.js build step doesn't have window/DOMMatrix)
  if (typeof window === 'undefined') {
    return "";
  }
  
  try {
    // Dynamic import of PDF.js to prevent crashes during Next.js static build-time prerendering
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configure the worker locally
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const loadingTask = pdfjsLib.getDocument({ data: uint8 });
    const pdf = await loadingTask.promise;
    const pagesText: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      pagesText.push(pageText);
    }

    const fullText = pagesText.join('\n\n').trim();
    if (fullText.length > 50) return fullText;
    
    return extractPdfTextFallback(uint8);
  } catch (error) {
    console.error('PDF.js extraction failed, using fallback:', error);
    return extractPdfTextFallback(uint8);
  }
}

// ---------- Text Extraction ----------
/**
 * Extract raw text from a File object.
 * Supports .txt, .md, .pdf (using PDF.js), and .docx via regex parsing.
 */
export async function extractText(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  if (ext === 'docx') {
    const zip = await JSZip.loadAsync(uint8);
    const docXml = await zip.file('word/document.xml')?.async('string');
    if (!docXml) return '';
    
    const paragraphs: string[] = [];
    const pMatches = docXml.match(/<w:p\b[^>]*>(.*?)<\/w:p>/g) || [];
    
    for (const p of pMatches) {
      const tMatches = p.match(/<w:t\b[^>]*>(.*?)<\/w:t>/g) || [];
      const pText = tMatches.map(t => {
        const rawText = t.replace(/<w:t\b[^>]*>/, '').replace(/<\/w:t>/, '');
        return rawText
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
      }).join('');
      
      if (pText.trim()) {
        paragraphs.push(pText);
      }
    }
    
    return paragraphs.join('\n\n');
  }

  if (ext === 'pdf') {
    return extractPdfText(uint8);
  }

  // For plain text based formats just decode the buffer.
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(uint8);
}

// ---------- Similarity Engine (ported from similarity.py) ----------
function ngrams(text: string, n: number = 3): Set<string> {
  const cleaned = text.toLowerCase().trim();
  const set = new Set<string>();
  for (let i = 0; i <= cleaned.length - n; i++) {
    set.add(cleaned.slice(i, i + n));
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);
  return intersection.size / union.size;
}

function wordVector(text: string): Map<string, number> {
  const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
  const stop = new Set([
    'the','a','an','is','are','was','were','be','been','being',
    'have','has','had','do','does','did','will','would','shall',
    'should','may','might','can','could','and','but','or','not',
    'in','on','at','to','for','of','with','by','from','as','this',
    'that','it','its','i','we','you','he','she','they','my','your'
  ]);
  const map = new Map<string, number>();
  for (const w of words) {
    if (stop.has(w)) continue;
    map.set(w, (map.get(w) ?? 0) + 1);
  }
  return map;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  if (!a.size || !b.size) return 0;
  const allKeys = new Set([...a.keys(), ...b.keys()]);
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const k of allKeys) {
    const av = a.get(k) ?? 0;
    const bv = b.get(k) ?? 0;
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export class SimilarityEngine {
  lexical(text1: string, text2: string): number {
    return jaccard(ngrams(text1, 4), ngrams(text2, 4));
  }
  semantic(text1: string, text2: string): number {
    return cosine(wordVector(text1), wordVector(text2));
  }
  /**
   * Compare a document against the mock sources and return the best matches.
   */
  analyze(document: string) {
    if (!document || document.trim().length < 10) return [];
    const results: any[] = [];
    for (const source of mockData) {
      const lex = this.lexical(document, source.text);
      const sem = this.semantic(document, source.text);
      const overall = lex * 0.4 + sem * 0.6;
      if (overall > 0.08) {
        results.push({
          source_url: source.url ?? 'Unknown',
          source_title: source.title ?? 'Unknown Source',
          matched_text_snippet: source.text.slice(0, 200) + (source.text.length > 200 ? '...' : ''),
          lexical_score: Math.round(lex * 100 * 100) / 100,
          semantic_score: Math.round(sem * 100 * 100) / 100,
          overall_similarity_percentage: Math.round(overall * 100 * 100) / 100,
        });
      }
    }
    results.sort((a, b) => b.overall_similarity_percentage - a.overall_similarity_percentage);
    return results;
  }
}

export const similarityEngine = new SimilarityEngine();

// ---------- AI‑Generation Likelihood (ported from ai_analysis.py) ----------
function splitSentences(text: string): string[] {
  const sentencePattern = /(?<!\b(Dr|Mr|Ms|Mrs|Jr|Sr|vs|etc|eg|ie|al)\.)(?<!\b[A-Z]\.)(?<=[.!?])\s+/g;
  return text.split(sentencePattern).filter(s => s && s.trim().length > 0);
}

export function analyzeAI(text: string) {
  if (!text || text.trim().length < 50 || text.includes("compressed streams")) {
    return {
      ai_likelihood_percentage: 0,
      confidence: 'Low',
      indicators: ['Text too short or unextractable for accurate AI analysis.'],
      suspicious_passages: []
    };
  }
  const sentences = splitSentences(text).filter(s => s.trim().length > 5);
  if (!sentences.length) {
    return {
      ai_likelihood_percentage: 0,
      confidence: 'Low',
      indicators: ['No valid sentences found'],
      suspicious_passages: []
    };
  }
  const lengths = sentences.map(s => s.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + (len - avg) ** 2, 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  
  let aiScore = 100 - (stdDev - 1.2) * 18;
  aiScore = Math.max(0, Math.min(100, aiScore));
  
  const suspicious: string[] = [];
  for (const s of sentences) {
    const sl = s.split(/\s+/).length;
    if (Math.abs(sl - avg) < 1.5 && aiScore > 50) {
      suspicious.push(s);
      if (suspicious.length >= 3) break;
    }
  }
  
  let confidence = sentences.length > 20 ? 'High' : 'Medium';
  if (sentences.length < 5) confidence = 'Low';
  
  const indicators: string[] = [];
  if (aiScore > 70) {
    indicators.push('Low sentence length variance (low burstiness), typical of AI writing.');
    indicators.push('Highly uniform syntax structure.');
  } else if (aiScore > 30) {
    indicators.push('Moderate burstiness and sentence length variance.');
  } else {
    indicators.push('High sentence length variance (natural burstiness), indicating human writing.');
  }
  
  return {
    ai_likelihood_percentage: Math.round(aiScore * 100) / 100,
    confidence,
    indicators,
    suspicious_passages: suspicious
  };
}

// ---------- Citation Counter ----------
export function countCitations(text: string): { inTextCount: number; hasBibliography: boolean; detectedList: string[] } {
  const parenthetical = text.match(/\([A-Z][a-z]+,?\s?\d{4}\)/g) || [];
  const bracketed = text.match(/\[\d+\]/g) || [];
  
  const allCitations = [...new Set([...parenthetical, ...bracketed])];
  const total = parenthetical.length + bracketed.length;
  
  const hasBibliography = /references|bibliography|works cited/i.test(text);
  
  return {
    inTextCount: total,
    hasBibliography,
    detectedList: allCitations.slice(0, 10)
  };
}

// Export a single helper that runs the full pipeline.
export async function analyzeDocument(file: File) {
  const raw = await extractText(file);
  const similarity = similarityEngine.analyze(raw);
  const ai = analyzeAI(raw);
  const citations = countCitations(raw);
  return { raw, similarity, ai, citations };
}

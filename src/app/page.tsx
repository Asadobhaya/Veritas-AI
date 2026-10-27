"use client";

import React, { useState, useRef } from 'react';
import { analyzeDocument, type AnalysisOutput, type SimilarityMatchResult } from '../lib/parser';
import styles from './page.module.css';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisOutput | null>(null);
  const [activeTab, setActiveTab] = useState<'ai' | 'similarity' | 'citations' | 'text'>('ai');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setAnalysisResult(null); // Clear previous results
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setAnalysisResult(null); // Clear previous results
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const result = await analyzeDocument(file);
      setAnalysisResult(result);
      setIsUploading(false);
    } catch (error) {
      console.error('Analysis failed', error);
      setIsUploading(false);
      alert('Failed to analyze document.');
    }
  };

  // Helper to get overall stats from raw text
  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const getSentenceCount = (text: string) => {
    if (!text) return 0;
    return text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0).length;
  };

  // Determine peak similarity percentage from sources
  const getPeakSimilarity = (similarityList: SimilarityMatchResult[]) => {
    if (!similarityList || similarityList.length === 0) return 0;
    return Math.max(...similarityList.map(s => s.overall_similarity_percentage));
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Veritas AI</h1>
        <p className={styles.subtitle}>
          The next-generation academic integrity platform. Uncover similarities, detect AI-assistance,
          and improve originality with ethical, transparent reporting.
        </p>
      </header>

      <section className={styles.uploadCard}>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileChange}
        />
        
        <div 
          className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <div className={styles.icon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <p className={styles.dropText}>
            {file ? file.name : "Drag & Drop your document here"}
          </p>
          <p className={styles.dropSubtext}>
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports PDF, DOCX, TXT, MD up to 50MB"}
          </p>
        </div>

        <button 
          className={styles.button} 
          disabled={!file || isUploading}
          onClick={handleUpload}
        >
          {isUploading ? (
            <>
              <span className={styles.loader}></span> Analyzing Document...
            </>
          ) : (
            "Generate Integrity Report"
          )}
        </button>
      </section>

      {analysisResult && (
        <section className={styles.resultSection}>
          <h2 className={styles.resultTitle}>Integrity Analysis Report</h2>
          
          <div className={styles.reportGrid}>
            {/* Sidebar gauges and meta info */}
            <div className={styles.sidebarCard}>
              <div className={styles.gaugeContainer}>
                <div 
                  className={styles.gaugeValue} 
                  style={{ color: analysisResult.ai.ai_likelihood_percentage > 50 ? '#f59e0b' : '#10b981' }}
                >
                  {analysisResult.ai.ai_likelihood_percentage}%
                </div>
                <div className={styles.gaugeLabel}>AI Likelihood</div>
              </div>

              <div className={styles.gaugeContainer}>
                <div 
                  className={styles.gaugeValue} 
                  style={{ color: getPeakSimilarity(analysisResult.similarity) > 30 ? '#ef4444' : '#10b981' }}
                >
                  {getPeakSimilarity(analysisResult.similarity)}%
                </div>
                <div className={styles.gaugeLabel}>Plagiarism Match</div>
              </div>

              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Words</div>
                  <div className={styles.metaValue}>{getWordCount(analysisResult.raw)}</div>
                </div>
                <div className={styles.metaItem}>
                  <div className={styles.metaLabel}>Sentences</div>
                  <div className={styles.metaValue}>{getSentenceCount(analysisResult.raw)}</div>
                </div>
              </div>
            </div>

            {/* Main Tabs interface */}
            <div className={styles.mainCard}>
              <div className={styles.tabsHeader}>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'ai' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('ai')}
                >
                  AI Writing Analysis
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'similarity' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('similarity')}
                >
                  Plagiarism Matches ({analysisResult.similarity.length})
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'citations' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('citations')}
                >
                  Citations
                </button>
                <button 
                  className={`${styles.tabBtn} ${activeTab === 'text' ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab('text')}
                >
                  Extracted Text
                </button>
              </div>

              {/* Tab 1: AI Writing Analysis */}
              {activeTab === 'ai' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
                    Writing Style Indicators (Confidence: {analysisResult.ai.confidence})
                  </h3>
                  
                  <div className={styles.indicatorList}>
                    {analysisResult.ai.indicators.map((ind: string, idx: number) => (
                      <div key={idx} className={styles.indicatorItem}>
                        <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>ℹ</span>
                        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{ind}</p>
                      </div>
                    ))}
                  </div>

                  {analysisResult.ai.suspicious_passages.length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
                        Suspicious (Unusually Uniform) Passages:
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {analysisResult.ai.suspicious_passages.map((p: string, idx: number) => (
                          <li key={idx} style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>
                            &ldquo;{p}&rdquo;
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Plagiarism Matches */}
              {activeTab === 'similarity' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
                    Matched Sources
                  </h3>
                  {analysisResult.similarity.length === 0 ? (
                    <p style={{ color: '#64748b', fontStyle: 'italic' }}>No matches found against database sources.</p>
                  ) : (
                    analysisResult.similarity.map((s: SimilarityMatchResult, idx: number) => (
                      <div key={idx} className={styles.sourceItem}>
                        <div className={styles.sourceHeader}>
                          <div>
                            <a 
                              href={s.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={styles.sourceName}
                            >
                              {s.source_title}
                            </a>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{s.source_url}</p>
                          </div>
                          <span className={styles.sourcePct}>{s.overall_similarity_percentage}% Match</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                          <span>Lexical match: {s.lexical_score}%</span>
                          <span>Semantic match: {s.semantic_score}%</span>
                        </div>
                        <p className={styles.snippet}>&ldquo;{s.matched_text_snippet}&rdquo;</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Citations */}
              {activeTab === 'citations' && (
                <div style={{ color: '#cbd5e1' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
                    Citation & Attribution
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>In-Text Citations</div>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa', marginTop: '0.25rem' }}>
                        {analysisResult.citations.inTextCount}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Bibliography Found</div>
                      <div 
                        style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 'bold', 
                          color: analysisResult.citations.hasBibliography ? '#10b981' : '#f59e0b', 
                          marginTop: '0.5rem' 
                        }}
                      >
                        {analysisResult.citations.hasBibliography ? 'Yes ✓' : 'No ⚠'}
                      </div>
                    </div>
                  </div>

                  {analysisResult.citations.detectedList.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
                        Detected References / In-Text Citations (Up to 10):
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {analysisResult.citations.detectedList.map((cit: string, idx: number) => (
                          <span 
                            key={idx} 
                            style={{ 
                              background: 'rgba(255,255,255,0.05)', 
                              padding: '0.4rem 0.8rem', 
                              borderRadius: '8px', 
                              fontSize: '0.85rem',
                              border: '1px solid rgba(255,255,255,0.08)' 
                            }}
                          >
                            {cit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Extracted Text */}
              {activeTab === 'text' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>
                    Document Plain Text
                  </h3>
                  <div 
                    style={{ 
                      maxHeight: '400px', 
                      overflowY: 'auto', 
                      background: 'rgba(0,0,0,0.2)', 
                      padding: '1.25rem', 
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      color: '#cbd5e1',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {analysisResult.raw}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className={styles.recentSection}>
        <h2 className={styles.recentTitle}>Recent Analyses</h2>
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>No recent documents analyzed.</p>
      </section>
    </main>
  );
}

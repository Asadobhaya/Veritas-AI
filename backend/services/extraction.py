import io
import re
from typing import Dict, Any, Tuple
from services.text_utils import split_sentences

try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

def calculate_readability(text: str) -> float:
    """Compute Flesch-Kincaid grade level (pure Python)."""
    words = text.split()
    sentences = split_sentences(text)
    if not words or not sentences:
        return 0.0
    syllable_count = 0
    for word in words:
        word = word.lower().strip(".,!?;:'\"")
        vowels = "aeiou"
        count = 0
        prev_vowel = False
        for ch in word:
            if ch in vowels:
                if not prev_vowel:
                    count += 1
                prev_vowel = True
            else:
                prev_vowel = False
        if word.endswith('e') and count > 1:
            count -= 1
        syllable_count += max(count, 1)
    asl = len(words) / len(sentences)
    asw = syllable_count / len(words)
    score = 206.835 - 1.015 * asl - 84.6 * asw
    return round(max(0.0, min(100.0, score)), 2)

def calculate_statistics(text: str) -> Dict[str, Any]:
    """Calculate document statistics from extracted text."""
    if not text or not text.strip():
        return {
            "word_count": 0,
            "character_count": 0,
            "sentence_count": 0,
            "paragraph_count": 0,
            "readability_score": 0.0
        }
    paragraphs = [p for p in text.split('\n\n') if p.strip()]
    sentences = split_sentences(text)
    words = text.split()
    return {
        "word_count": len(words),
        "character_count": len(text),
        "sentence_count": len(sentences),
        "paragraph_count": len(paragraphs),
        "readability_score": calculate_readability(text)
    }

async def extract_text_from_file(file) -> Tuple[str, Dict[str, Any]]:
    """Extract text from uploaded file. Supports DOCX, TXT, MD."""
    content = await file.read()
    filename = file.filename.lower()
    text = ""

    try:
        if filename.endswith('.docx') and HAS_DOCX:
            doc = docx.Document(io.BytesIO(content))
            paragraphs = [p.text for p in doc.paragraphs]
            text = "\n\n".join(paragraphs)
        elif filename.endswith('.pdf'):
            # Pure-python PDF fallback: extract printable ASCII
            raw = content.decode('latin-1', errors='ignore')
            # Very basic: grab text between BT/ET markers or just readable chars
            chunks = re.findall(r'\(([^)]+)\)', raw)
            text = " ".join(chunks) if chunks else raw
            # Clean up binary garbage
            text = re.sub(r'[^\x20-\x7E\n]', '', text)
            text = re.sub(r'\s+', ' ', text).strip()
            if len(text) < 50:
                text = "[PDF text extraction requires pdfplumber. Please upload DOCX or TXT for best results.]"
        elif filename.endswith(('.txt', '.md', '.html')):
            text = content.decode('utf-8', errors='ignore')
        else:
            text = content.decode('utf-8', errors='ignore')
    except Exception as e:
        text = f"[Extraction error: {e}]"

    await file.seek(0)
    stats = calculate_statistics(text)
    return text, stats

"""
Lightweight Similarity Engine — Pure Python, no ML dependencies.
Uses character n-gram Jaccard similarity and word-overlap cosine similarity.
"""
import re
import math
from typing import List, Dict, Any
from collections import Counter

def _ngrams(text: str, n: int = 3) -> set:
    """Generate character-level n-grams."""
    text = text.lower().strip()
    return {text[i:i+n] for i in range(len(text) - n + 1)}

def _jaccard(set_a: set, set_b: set) -> float:
    if not set_a or not set_b:
        return 0.0
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union)

def _word_vector(text: str) -> Counter:
    words = re.findall(r'\b[a-z]{2,}\b', text.lower())
    stop = {'the','a','an','is','are','was','were','be','been','being',
            'have','has','had','do','does','did','will','would','shall',
            'should','may','might','can','could','and','but','or','not',
            'in','on','at','to','for','of','with','by','from','as','this',
            'that','it','its','i','we','you','he','she','they','my','your'}
    return Counter(w for w in words if w not in stop)

def _cosine(vec_a: Counter, vec_b: Counter) -> float:
    if not vec_a or not vec_b:
        return 0.0
    all_keys = set(vec_a) | set(vec_b)
    dot = sum(vec_a.get(k, 0) * vec_b.get(k, 0) for k in all_keys)
    mag_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
    mag_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)

class SimilarityEngine:
    def compute_lexical_similarity(self, text1: str, text2: str) -> float:
        """Jaccard on character 4-grams (catches exact/near-exact copies)."""
        return _jaccard(_ngrams(text1, 4), _ngrams(text2, 4))

    def compute_semantic_similarity(self, text1: str, text2: str) -> float:
        """Word-overlap cosine (lightweight proxy for semantic similarity)."""
        return _cosine(_word_vector(text1), _word_vector(text2))

    def analyze_document_against_sources(self, document_text: str, sources: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        results = []
        for source in sources:
            source_text = source.get('text', '')
            lex = self.compute_lexical_similarity(document_text, source_text)
            sem = self.compute_semantic_similarity(document_text, source_text)
            overall = (lex * 0.4) + (sem * 0.6)
            if overall > 0.08:
                results.append({
                    "source_url": source.get("url", "Unknown"),
                    "source_title": source.get("title", "Unknown Source"),
                    "matched_text_snippet": source_text[:200] + ("..." if len(source_text) > 200 else ""),
                    "lexical_score": round(lex * 100, 2),
                    "semantic_score": round(sem * 100, 2),
                    "overall_similarity_percentage": round(overall * 100, 2)
                })
        results.sort(key=lambda x: x["overall_similarity_percentage"], reverse=True)
        return results

similarity_engine = SimilarityEngine()

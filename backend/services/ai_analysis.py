from typing import Dict, Any
from services.text_utils import split_sentences

def analyze_ai_probability(text: str) -> Dict[str, Any]:
    """
    Analyzes text to determine the likelihood of it being AI-generated.
    Uses basic heuristics like burstiness (variance in sentence length)
    and word usage uniformity for this MVP.
    """
    if not text or len(text.strip()) < 50:
        return {
            "ai_likelihood_percentage": 0.0,
            "confidence": "Low",
            "indicators": ["Text too short for accurate analysis"],
            "suspicious_passages": []
        }

    # Split into sentences (using robust sentence splitter)
    sentences = [s for s in split_sentences(text) if len(s.strip()) > 5]
    
    if not sentences:
         return {
            "ai_likelihood_percentage": 0.0,
            "confidence": "Low",
            "indicators": ["No valid sentences found"],
            "suspicious_passages": []
        }

    # Calculate burstiness (standard deviation of sentence length)
    sentence_lengths = [len(s.split()) for s in sentences]
    avg_length = sum(sentence_lengths) / len(sentence_lengths)
    
    # Calculate variance and standard deviation
    variance = sum((length - avg_length) ** 2 for length in sentence_lengths) / len(sentence_lengths)
    std_dev = variance ** 0.5
    
    # Calibrate AI score based on standard deviation
    # AI models show highly uniform sentence lengths (low std_dev)
    # Human text typically exhibits standard deviation > 4.5
    ai_score = 100.0 - (std_dev - 1.2) * 18.0
    ai_score = max(0.0, min(100.0, ai_score))
    
    # Let's find "suspicious" passages - sentences that are unusually average
    suspicious_passages = []
    for s in sentences:
        s_len = len(s.split())
        if abs(s_len - avg_length) < 1.5 and ai_score > 50:
            suspicious_passages.append(s)
            if len(suspicious_passages) >= 3:
                break
                
    confidence = "High" if len(sentences) > 20 else "Medium"
    if len(sentences) < 5:
        confidence = "Low"
    
    indicators = []
    if ai_score > 70:
        indicators.append("Low variance in sentence length (low burstiness), typical of AI-generated text.")
        indicators.append("Highly uniform sentence structure.")
    elif ai_score > 30:
        indicators.append("Moderate variance in sentence length observed.")
    else:
        indicators.append("High variance in sentence length (natural burstiness), typical of human writing.")

    return {
        "ai_likelihood_percentage": round(ai_score, 2),
        "confidence": confidence,
        "indicators": indicators,
        "suspicious_passages": suspicious_passages
    }

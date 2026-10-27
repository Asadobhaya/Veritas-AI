import re
from typing import Dict, Any, List

def analyze_citations(text: str) -> Dict[str, Any]:
    """
    Detects quotations, in-text citations, and bibliography sections.
    Uses regex for MVP; a robust version would use spaCy/NER.
    """
    # 1. Detect Quotations (text enclosed in "")
    quotations = re.findall(r'"([^"]*)"', text)
    quotations = [q for q in quotations if len(q.split()) > 3] # Filter out short quotes
    
    # 2. Detect In-Text Citations
    # Matches common parenthetical formats like (Smith, 2020), [1], etc.
    apa_parenthetical = re.findall(r'\([A-Za-z]+(?: et al\.)?, \d{4}\)', text)
    ieee_citations = re.findall(r'\[\d+\]', text)
    # Matches narrative citation formats like Smith (2020) or Johnson et al. (2021)
    apa_narrative = re.findall(r'\b[A-Z][A-Za-z]+(?:\s+et\s+al\.)?\s*\(\d{4}\)', text)
    
    all_in_text = apa_parenthetical + ieee_citations + apa_narrative
    
    # 3. Detect Bibliography / References section
    has_bibliography = False
    bib_indicators = ["References", "Bibliography", "Works Cited"]
    for ind in bib_indicators:
        # Check if the indicator appears near the end of the document
        if re.search(r'\n' + ind + r'\s*\n', text[-2000:], re.IGNORECASE):
            has_bibliography = True
            break
            
    # Calculate a rough "attribution score" based on presence of citations vs length
    words = len(text.split())
    expected_citations = max(0, (words // 250)) # Expect ~1 citation per page
    
    attribution_score = 0.0
    if expected_citations > 0:
        attribution_score = min(100.0, (len(all_in_text) / expected_citations) * 100)
    elif len(all_in_text) > 0:
        attribution_score = 100.0

    return {
        "quotation_count": len(quotations),
        "in_text_citation_count": len(all_in_text),
        "has_bibliography": has_bibliography,
        "attribution_score": round(attribution_score, 2),
        "detected_quotes": quotations[:5], # Return sample for UI
        "detected_citations": all_in_text[:5] # Return sample for UI
    }

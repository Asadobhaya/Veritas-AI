import re
from typing import List

def split_sentences(text: str) -> List[str]:
    """
    Split text into sentences, protecting common abbreviations and initials
    so that sentences are not split incorrectly.
    """
    if not text or not text.strip():
        return []
    
    # Temporarily hide dots in common abbreviations
    # We want to match case-insensitively for abbreviations, but keep the text unchanged
    # Use placeholder strings that won't occur in standard text
    placeholders = [
        ("Dr.", "Dr<DOT>"),
        ("Mr.", "Mr<DOT>"),
        ("Mrs.", "Mrs<DOT>"),
        ("Ms.", "Ms<DOT>"),
        ("Prof.", "Prof<DOT>"),
        ("et al.", "et al<DOT>"),
        ("e.g.", "e<DOT>g<DOT>"),
        ("i.e.", "i<DOT>e<DOT>"),
        ("vs.", "vs<DOT>"),
        ("A.M.", "A<DOT>M<DOT>"),
        ("P.M.", "P<DOT>M<DOT>"),
        ("a.m.", "a<DOT>m<DOT>"),
        ("p.m.", "p<DOT>m<DOT>"),
    ]
    
    temp_text = text
    for abbrev, placeholder in placeholders:
        # Use case-insensitive search if needed, or simple replace
        temp_text = re.sub(r'\b' + re.escape(abbrev), placeholder, temp_text, flags=re.IGNORECASE)
        
    # Protect initials (e.g., J. Smith -> J<DOT> Smith)
    temp_text = re.sub(r'\b([A-Z])\.', r'\1<DOT>', temp_text)
    
    # Split on periods, exclamation marks, and question marks followed by space/newline or end of string
    raw_sentences = re.split(r'[.!?]+\s*', temp_text)
    
    # Restore the hidden dots and filter out empty sentences
    sentences = []
    for s in raw_sentences:
        s = s.strip()
        if not s:
            continue
        # Restore dots
        s = s.replace("<DOT>", ".")
        sentences.append(s)
        
    return sentences

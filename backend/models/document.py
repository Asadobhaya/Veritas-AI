from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

class DocumentStatistics(BaseModel):
    word_count: int = 0
    character_count: int = 0
    sentence_count: int = 0
    paragraph_count: int = 0
    readability_score: Optional[float] = None

class SimilarityMatch(BaseModel):
    source_url: str
    source_title: str
    matched_text_snippet: str
    lexical_score: float
    semantic_score: float
    overall_similarity_percentage: float

class SimilarityReport(BaseModel):
    overall_similarity_percentage: float = 0.0
    matches: List[SimilarityMatch] = []

class AIAnalysisReport(BaseModel):
    ai_likelihood_percentage: float
    confidence: str
    indicators: List[str] = []
    suspicious_passages: List[str] = []

class CitationReport(BaseModel):
    quotation_count: int
    in_text_citation_count: int
    has_bibliography: bool
    attribution_score: float
    detected_quotes: List[str] = []
    detected_citations: List[str] = []

class DocumentResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    file_type: str
    language: Optional[str] = "en"
    statistics: DocumentStatistics
    similarity_report: Optional[SimilarityReport] = None
    ai_analysis: Optional[AIAnalysisReport] = None
    citation_report: Optional[CitationReport] = None
    upload_timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "processing"
    
    # In a real database, we wouldn't return the full text here, 
    # but for initial phase testing, it's useful.
    text_preview: Optional[str] = None

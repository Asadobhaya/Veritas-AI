from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# ─── Import services (same directory) ───
from services.extraction import extract_text_from_file
from services.similarity import similarity_engine
from services.source_retrieval import fetch_potential_sources
from services.ai_analysis import analyze_ai_probability
from services.citation import analyze_citations

# ═══════════════════════════════════════════
# MODELS
# ═══════════════════════════════════════════

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
    text_preview: Optional[str] = None

# ═══════════════════════════════════════════
# APP
# ═══════════════════════════════════════════

app = FastAPI(
    title="Veritas AI — Academic Integrity Platform API",
    description="Document analysis, similarity checking, and AI-writing detection.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store (MVP — replace with Postgres later)
DOCUMENTS_DB: dict = {}

# ═══════════════════════════════════════════
# ROUTES
# ═══════════════════════════════════════════

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.post("/", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload a document and run the full analysis pipeline."""
    allowed = ('.pdf', '.docx', '.txt', '.md', '.rtf', '.odt', '.html')
    if not file.filename.lower().endswith(allowed):
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(allowed)}")

    try:
        # 1 — Extract text
        text, stats = await extract_text_from_file(file)
        
        # Debug logs
        print(f"\n[DEBUG UPLOAD] Filename: {file.filename}")
        print(f"[DEBUG UPLOAD] Extracted text length: {len(text)} characters")
        print(f"[DEBUG UPLOAD] Extracted text preview: {repr(text[:200])}")

        # 2 — Source retrieval (mock)
        potential_sources = fetch_potential_sources(text)

        # 3 — Similarity
        matches = similarity_engine.analyze_document_against_sources(text, potential_sources)
        overall_sim = 0.0
        if matches:
            overall_sim = min(100.0, sum(m['overall_similarity_percentage'] for m in matches) / max(1, len(matches) / 2))
        similarity_report = SimilarityReport(
            overall_similarity_percentage=round(overall_sim, 2),
            matches=[SimilarityMatch(**m) for m in matches]
        )

        # 4 — AI analysis
        ai_data = analyze_ai_probability(text)
        ai_report = AIAnalysisReport(**ai_data)

        # 5 — Citation analysis
        cit_data = analyze_citations(text)
        cit_report = CitationReport(**cit_data)
        
        print(f"[DEBUG UPLOAD] Calculated Statistics: {stats}")
        print(f"[DEBUG UPLOAD] Calculated Similarity: {similarity_report.overall_similarity_percentage}% (matches: {len(matches)})")
        print(f"[DEBUG UPLOAD] Calculated AI Likelihood: {ai_report.ai_likelihood_percentage}%")

        # Build response
        doc = DocumentResponse(
            filename=file.filename,
            file_type=file.filename.rsplit('.', 1)[-1].lower(),
            statistics=DocumentStatistics(**stats),
            similarity_report=similarity_report,
            ai_analysis=ai_report,
            citation_report=cit_report,
            text_preview=text[:500] + ("..." if len(text) > 500 else ""),
            status="completed"
        )

        DOCUMENTS_DB[doc.id] = {"metadata": doc.model_dump(), "full_text": text}
        return doc

    except Exception as e:
        import traceback
        print("[DEBUG UPLOAD ERROR]")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """Retrieve a previously analyzed document."""
    if document_id not in DOCUMENTS_DB:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse(**DOCUMENTS_DB[document_id]["metadata"])


app.include_router(router)

# ═══════════════════════════════════════════
# HEALTH / ROOT
# ═══════════════════════════════════════════

@app.get("/")
def root():
    return {"message": "Veritas AI Academic Integrity Platform API"}

@app.get("/health")
def health():
    return {"status": "ok"}

from fastapi import APIRouter, UploadFile, File, HTTPException
from ...models.document import DocumentResponse, DocumentStatistics, SimilarityReport, SimilarityMatch, AIAnalysisReport, CitationReport
from ...services.extraction import extract_text_from_file
from ...services.similarity import similarity_engine
from ...services.source_retrieval import fetch_potential_sources
from ...services.ai_analysis import analyze_ai_probability
from ...services.citation import analyze_citations

router = APIRouter()

# Temporary in-memory storage for MVP
# In production, this would be a DB and S3 Object Storage
DOCUMENTS_DB = {}

@router.post("/", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document, extract text, calculate statistics, 
    and enqueue for similarity/AI analysis.
    """
    allowed_extensions = ('.pdf', '.docx', '.txt', '.md', '.rtf', '.odt', '.html')
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
        )
        
    try:
        # 1. Extract text and stats
        text, stats = await extract_text_from_file(file)
        
        # 2. Fetch Potential Sources (Mock)
        potential_sources = fetch_potential_sources(text)
        
        # 3. Compute Similarity Matches
        matches = similarity_engine.analyze_document_against_sources(text, potential_sources)
        
        overall_sim = 0.0
        if matches:
            overall_sim = min(100.0, sum(m['overall_similarity_percentage'] for m in matches) / max(1, len(matches) / 2))
            
        similarity_report = SimilarityReport(
            overall_similarity_percentage=round(overall_sim, 2),
            matches=[SimilarityMatch(**m) for m in matches]
        )
        
        # 4. AI Writing Analysis
        ai_data = analyze_ai_probability(text)
        ai_report = AIAnalysisReport(**ai_data)
        
        # 5. Citation Analysis
        citation_data = analyze_citations(text)
        citation_report = CitationReport(**citation_data)
        
        # Create response model
        doc = DocumentResponse(
            filename=file.filename,
            file_type=file.filename.split('.')[-1].lower(),
            statistics=DocumentStatistics(**stats),
            similarity_report=similarity_report,
            ai_analysis=ai_report,
            citation_report=citation_report,
            text_preview=text[:500] + "..." if len(text) > 500 else text,
            status="processed_all"
        )
        
        # Save to mock DB
        DOCUMENTS_DB[doc.id] = {
            "metadata": doc.model_dump(),
            "full_text": text
        }
        
        return doc
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document_status(document_id: str):
    """Retrieve document processing status."""
    if document_id not in DOCUMENTS_DB:
        raise HTTPException(status_code=404, detail="Document not found")
        
    return DocumentResponse(**DOCUMENTS_DB[document_id]["metadata"])


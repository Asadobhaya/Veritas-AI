import sys
import os
import asyncio
import io
import json
from fastapi import UploadFile

# Add the backend directory to system path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from main import upload_document

async def run_calibration():
    test_docs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend", "test_docs")
    if not os.path.exists(test_docs_dir):
        print(f"Error: test_docs directory not found at {test_docs_dir}")
        return

    files = [f for f in os.listdir(test_docs_dir) if os.path.isfile(os.path.join(test_docs_dir, f))]
    
    report_data = []
    
    for filename in sorted(files):
        # Skip hidden files or temporary files
        if filename.startswith('.') or filename.startswith('~$'):
            continue
            
        filepath = os.path.join(test_docs_dir, filename)
        ext = filename.split('.')[-1].lower()
        
        try:
            with open(filepath, "rb") as f:
                content = f.read()
                
            file_obj = io.BytesIO(content)
            upload_file = UploadFile(file=file_obj, filename=filename)
            
            result = await upload_document(upload_file)
            
            word_count = result.statistics.word_count
            sentence_count = result.statistics.sentence_count
            readability = result.statistics.readability_score
            similarity = result.similarity_report.overall_similarity_percentage if result.similarity_report else 0.0
            ai_score = result.ai_analysis.ai_likelihood_percentage if result.ai_analysis else 0.0
            citations = result.citation_report.in_text_citation_count if result.citation_report else 0
            
            report_data.append({
                "filename": filename,
                "type": ext,
                "word_count": word_count,
                "sentence_count": sentence_count,
                "readability": readability,
                "similarity_percentage": similarity,
                "ai_likelihood_percentage": ai_score,
                "citations": citations,
                "status": "Success",
                "error": None
            })
            print(f"Success: {filename} ({word_count} words)")
        except Exception as e:
            report_data.append({
                "filename": filename,
                "type": ext,
                "word_count": 0,
                "sentence_count": 0,
                "readability": 0.0,
                "similarity_percentage": 0.0,
                "ai_likelihood_percentage": 0.0,
                "citations": 0,
                "status": "Failed",
                "error": str(e)
            })
            print(f"Failed: {filename} - {str(e)}")
            
    # Generate the Markdown table
    md = "# Calibration and Test Document Analysis Report\n\n"
    md += f"This report lists the analysis statistics for all test files dropped by the user in `backend/test_docs` on **{len(report_data)} documents**.\n\n"
    md += "## Document Statistics Table\n\n"
    md += "| Filename | Type | Words | Sentences | Readability | Similarity % | AI Likelihood % | Citations | Status / Error |\n"
    md += "| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |\n"
    
    for r in report_data:
        err_msg = r["error"] if r["error"] else r["status"]
        md += f"| **{r['filename']}** | {r['type'].upper()} | {r['word_count']} | {r['sentence_count']} | {r['readability']}% | {r['similarity_percentage']}% | **{r['ai_likelihood_percentage']}%** | {r['citations']} | {err_msg} |\n"
        
    # Write the report to the artifact directory
    artifact_path = r"C:\Users\Malik Bahawal Shair\.gemini\antigravity\brain\91c24141-315f-4f2d-81f9-82577b06633f\calibration_report.md"
    with open(artifact_path, "w", encoding="utf-8") as f:
        f.write(md)
        
    print(f"\nReport written to {artifact_path}")

if __name__ == "__main__":
    asyncio.run(run_calibration())

import sys
import os
import asyncio
import io
from fastapi import UploadFile

# Add the current directory and its parent to system path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import upload_document

async def run_test_on_file(filename: str):
    filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_docs", filename)
    print(f"\n==================================================")
    print(f"TESTING FILE: {filename}")
    print(f"==================================================")
    
    if not os.path.exists(filepath):
        print(f"Error: File not found at {filepath}")
        return
        
    try:
        with open(filepath, "rb") as f:
            file_content = f.read()
            
        # Create a mock FastAPI UploadFile object
        file_obj = io.BytesIO(file_content)
        upload_file = UploadFile(file=file_obj, filename=filename)
        
        # Run the upload and analysis pipeline
        report = await upload_document(upload_file)
        
        # Output results
        print(f"Status: {report.status}")
        print(f"Filename: {report.filename}")
        print(f"File Type: {report.file_type}")
        print(f"Language: {report.language}")
        
        print("\n--- Statistics ---")
        print(f"  Word Count: {report.statistics.word_count}")
        print(f"  Char Count: {report.statistics.character_count}")
        print(f"  Sentence Count: {report.statistics.sentence_count}")
        print(f"  Paragraph Count: {report.statistics.paragraph_count}")
        print(f"  Readability Score: {report.statistics.readability_score}")
        
        if report.similarity_report:
            print("\n--- Similarity Report ---")
            print(f"  Overall Similarity: {report.similarity_report.overall_similarity_percentage}%")
            print(f"  Matches Found: {len(report.similarity_report.matches)}")
            for idx, match in enumerate(report.similarity_report.matches, 1):
                print(f"    Match {idx}:")
                print(f"      Source Title: {match.source_title}")
                print(f"      Source URL: {match.source_url}")
                print(f"      Overall Similarity: {match.overall_similarity_percentage}%")
                print(f"      Lexical Score: {match.lexical_score}%")
                print(f"      Semantic Score: {match.semantic_score}%")
                print(f"      Snippet: {match.matched_text_snippet}")
                
        if report.ai_analysis:
            print("\n--- AI Likelihood Analysis ---")
            print(f"  AI Likelihood: {report.ai_analysis.ai_likelihood_percentage}%")
            print(f"  Confidence: {report.ai_analysis.confidence}")
            print(f"  Indicators:")
            for ind in report.ai_analysis.indicators:
                print(f"    - {ind}")
            if report.ai_analysis.suspicious_passages:
                print(f"  Suspicious Passages:")
                for passg in report.ai_analysis.suspicious_passages:
                    print(f"    - \"{passg}\"")
                    
        if report.citation_report:
            print("\n--- Citation Report ---")
            print(f"  Quotation Count: {report.citation_report.quotation_count}")
            print(f"  In-Text Citation Count: {report.citation_report.in_text_citation_count}")
            print(f"  Has Bibliography: {report.citation_report.has_bibliography}")
            print(f"  Attribution Score: {report.citation_report.attribution_score}%")
            if report.citation_report.detected_citations:
                print(f"  Detected Citations: {report.citation_report.detected_citations}")
            if report.citation_report.detected_quotes:
                print(f"  Detected Quotes: {report.citation_report.detected_quotes}")
                
    except Exception as e:
        import traceback
        print(f"An error occurred while processing {filename}:")
        traceback.print_exc()

async def main():
    test_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_docs")
    if not os.path.exists(test_dir):
        print(f"Error: test_docs directory not found at {test_dir}")
        return
        
    test_files = [f for f in os.listdir(test_dir) if os.path.isfile(os.path.join(test_dir, f))]
    print(f"Found {len(test_files)} test files to process.")
    for filename in sorted(test_files):
        # Skip hidden files or temp files
        if filename.startswith('.') or filename.startswith('~$'):
            continue
        await run_test_on_file(filename)

if __name__ == "__main__":
    asyncio.run(main())

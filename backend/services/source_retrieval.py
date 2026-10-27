from typing import List, Dict

def fetch_potential_sources(document_text: str) -> List[Dict[str, str]]:
    """
    Mocks the retrieval of potential sources from an external API or Vector Database.
    In a real scenario, we would use the document's keywords or embeddings to query
    a database like OpenAlex, Wikipedia, or an internal Elasticsearch cluster.
    """
    
    # Mocking some sources for testing purposes
    mock_sources = [
        {
            "url": "https://en.wikipedia.org/wiki/Academic_integrity",
            "title": "Wikipedia: Academic Integrity",
            "text": "Academic integrity is the moral code or ethical policy of academia. This includes values such as avoidance of cheating or plagiarism; maintenance of academic standards; honesty and rigor in research and academic publishing."
        },
        {
            "url": "https://example.com/research_paper_123",
            "title": "A Study on Machine Learning Models",
            "text": "Machine learning models, particularly large language models, have shown significant capability in generating human-like text. However, they also pose challenges for academic integrity because students might use them to generate essays."
        },
        {
            "url": "https://example.com/generic_source",
            "title": "Generic Text Repository",
            "text": "The quick brown fox jumps over the lazy dog. This is a generic sentence used to test font rendering and text processing pipelines."
        }
    ]
    
    return mock_sources

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-15
### Added
- **Turnitin-style Report Card**: Modern dark-mode interface with gauges displaying AI Likelihood % and Plagiarism Similarity %.
- **Mozilla PDF.js Offline Integration**: Bundled the worker package locally inside Next.js/Electron for fully offline PDF text parsing.
- **Regex-based DOCX Parsing**: Fast XML text decoder bypassing system browser DOMParser sandboxing constraints.
- **WPS Format Support**: Automatic fallback support for `.wps` documents using the DOCX XML schema.
- **Dual Plagiarism Algorithms**: Added Jaccard coefficient n-gram matching (lexical) and Cosine similarity word vectors (semantic).
- **Setup Compiler**: Integrated `electron-builder` to package portable `.exe` installers for Windows.
- **Developer Guidelines**: Created `README.md`, `LICENSE` (MIT), `SECURITY.md`, and `CONTRIBUTING.md`.

### Fixed
- Fixed page rendering issues in Electron where Next.js absolute assets failed to load due to `file://` scheme locks (resolved via secure `app://local/` custom protocol).
- Patched the AI detection formula using standard deviation instead of raw variance to prevent false positive ratings on human documents.
- Fixed narrative citation parsing regex in academic papers.

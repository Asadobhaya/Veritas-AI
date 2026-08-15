# Veritas AI - Roadmap 🗺️

This document outlines the milestones, in-progress tasks, and future plans for Veritas AI.

---

## 🎯 Release Milestones

### Phase 1: Core Engine & Desktop App (v1.0.0) - *Completed*
- [x] Create standalone Windows portable package (`Veritas-AI-Setup.exe`).
- [x] Offline client-side parsing for DOCX, PDF, TXT, MD, WPS.
- [x] Dual Similarity engine (Jaccard lexical + Cosine semantic).
- [x] AI burstiness (sentence variance) signature detector.
- [x] Citation tracking and bibliography matcher.
- [x] Turnitin-style glassmorphic report dashboard UI.

### Phase 2: Refinements & Multilingual Support (v1.1.0) - *Planned*
- [ ] Support for non-English documents (e.g. Spanish, German, French) in semantic word vector models.
- [ ] Add direct highlighting of matching text source blocks inside the report UI.
- [ ] Introduce custom database seeding (allowing users to upload their own directories of reference articles to compare against).

### Phase 3: Platform Integration & APIs (v2.0.0) - *Proposed*
- [ ] **LMS Integrations**: Support for Canvas, Moodle, and Blackboard via LTI standards.
- [ ] **REST API Server**: Optional self-hosted server version allowing schools/universities to query the engine over HTTPS.
- [ ] **Chrome Extension**: Simple browser plugin to check selected text online.
- [ ] **Advanced OCR Integration**: Enable offline OCR text extraction for scanned PDF image layers.

# Privacy Policy

Veritas AI was built with a fundamental design principle: **your data belongs to you**. 

Because this application operates on academic documents, research drafts, and student synopses, maintaining privacy is our highest priority.

---

## 🔒 100% Offline Processing
* **Local Parsing**: All text extraction (DOCX, PDF, TXT, MD, WPS) runs directly inside your computer's local memory utilizing JavaScript and bundled modules.
* **No Server Storage**: Uploaded files are never stored, sent, or uploaded to any central server or database.
* **No Model Training**: Your documents are never used to train any AI, large language model, or plagiarism indexes.

## 💾 Local Cache & Data Storage
* **Temporary Files**: During analysis, file buffers are read into system memory and discarded as soon as the session window is closed or refreshed.
* **Recent Analyses**: The "Recent Analyses" cache uses standard browser `localStorage` locally on your device. You can clear this cache at any time inside the app settings.

## 🌐 External Connections
* Veritas AI operates entirely offline. It does not perform active network fetches or external API requests during analysis, guaranteeing that your draft documents cannot leak over public networks.

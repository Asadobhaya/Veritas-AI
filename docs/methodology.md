# Analysis Methodology

Veritas AI provides transparent, mathematical, and explainable models for plagiarism matching and AI likelihood detection.

---

## 1. Plagiarism & Similarity Detection
We utilize a dual lexical and semantic engine to compare documents against database records.

### A. Lexical Matching (Jaccard Index of N-grams)
* **Definition**: Extracts character n-grams (contiguous strings of length \(N=4\)) from the text.
* **Calculation**:
  \[J(A, B) = \frac{|A \cap B|}{|A \cup B|}\]
  Where \(A\) is the set of n-grams in the document, and \(B\) is the set of n-grams in the reference database source.
* **Purpose**: Identifies verbatim copy-pasting, even when minor spacing, capitalization, or punctuation shifts are introduced.

### B. Semantic Matching (Cosine Vector Similarity)
* **Definition**: Normalizes text into word-frequency vectors, excluding standard English stop words.
* **Calculation**:
  \[\text{Cosine Similarity} = \frac{\mathbf{v}_A \cdot \mathbf{v}_B}{\|\mathbf{v}_A\| \|\mathbf{v}_B\|}\]
  Where \(\mathbf{v}_A\) and \(\mathbf{v}_B\) are term frequency-inverse document frequency (TF-IDF) vectors representing document word tokens.
* **Purpose**: Identifies paraphrased matching where keywords are retained but sentence structure is changed.

---

## 2. AI Likelihood Analysis (Burstiness Metric)
Rather than relying on black-box probabilistic transformers (which are prone to false positives and change behaviors dynamically), Veritas AI measures writing complexity metrics:

### Sentence Length Variance (Burstiness)
* **Burstiness**: Human writing exhibits high variability in sentence structure (e.g., alternating between short, punchy statements and complex, multi-clause explanations). Large language models (LLMs) tend to generate highly uniform sentence structures with low length variance.
* **Algorithm**:
  1. Split text into clean sentences, bypassing academic abbreviations (e.g., `Dr.`, `et al.`).
  2. Compute average sentence word count (\(\mu\)).
  3. Calculate sentence length standard deviation (\(\sigma\)):
     \[\sigma = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (L_i - \mu)^2}\]
     Where \(L_i\) is the word count of sentence \(i\), and \(N\) is the total number of sentences.
  4. Evaluate AI score:
     * **High Standard Deviation (\(\sigma > 4.5\))**: Indicates natural human flow (AI score near 0%).
     * **Low Standard Deviation (\(\sigma < 2.0\))**: Indicates robotic, uniform writing (AI score near 100%).

---

## 3. Citation Counting
* **In-text matches**: Scans text using regex rules for:
  - APA parenthetical citations: `(Author, Year)`
  - IEEE bracketed citations: `[Number]`
* **Bibliography check**: Scans for the presence of keywords like `References`, `Bibliography`, or `Works Cited` at the end of the text.

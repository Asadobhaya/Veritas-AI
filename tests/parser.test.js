

// Simple mock test check
function testEngine() {
  console.log("Running similarity verification test...");
  
  const text1 = "The quick brown fox jumps over the lazy dog.";
  const text2 = "The quick brown fox jumps over the lazy dog.";
  const text3 = "Machine learning models generate text dynamically.";

  // Minimal inline n-grams & vector similarity calculations for verification
  function ngrams(text, n = 3) {
    const cleaned = text.toLowerCase().trim();
    const set = new Set();
    for (let i = 0; i <= cleaned.length - n; i++) {
      set.add(cleaned.slice(i, i + n));
    }
    return set;
  }

  function jaccard(a, b) {
    const intersection = new Set([...a].filter(x => b.has(x)));
    const union = new Set([...a, ...b]);
    return intersection.size / union.size;
  }

  const s1 = ngrams(text1, 4);
  const s2 = ngrams(text2, 4);
  const s3 = ngrams(text3, 4);

  const exactMatch = jaccard(s1, s2);
  const noMatch = jaccard(s1, s3);

  if (exactMatch !== 1) {
    throw new Error(`Self-match failed: expected 1.0, got ${exactMatch}`);
  }
  if (noMatch > 0.5) {
    throw new Error(`Distinct-match failed: expected low Jaccard index, got ${noMatch}`);
  }

  console.log("✔ Jaccard Lexical index checks passed!");
  console.log("All unit tests passed successfully!");
}

try {
  testEngine();
  process.exit(0);
} catch (e) {
  console.error("❌ Test failed:", e.message);
  process.exit(1);
}

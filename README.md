# Arabic AI Quality Lab

Two small tools around recurring AI-product questions: where did the evidence come from, and is the next action clear?

[Current search demo](https://huggingface.co/spaces/Deema9/arabic-retrieval-lab) · [Current action-review demo](https://huggingface.co/spaces/Deema9/action-review)

Version 0.3 adds a harder retrieval diagnostic, reproducible source-level metrics, and interaction fixes. [Failure analysis](docs/EVALUATION.md) · [Verification record](docs/VERIFY.md).

## Search workspace

A small text-ingestion and evidence-retrieval pipeline:

1. Validate a corpus of up to 60 documents / 80,000 characters.
2. Split into overlapping character chunks and retain exact source positions.
3. Compare normalized BM25, multilingual-e5 embeddings, or reciprocal-rank fusion.
4. Inspect the source and export the quoted passage with its location.
5. Run the visible synthetic cases and export per-query results.

Semantic mode uses the existing multilingual-e5-small model from intfloat, converted to ONNX by Xenova, via Transformers.js 3.8.1. Model weights currently resolve from the Hub's main revision. The first run downloads approximately 120 MB plus tokenizer/runtime files. Inference is intended to run in the browser without an inference API key; model loading and inference were verified in desktop Chrome. The interface reports loading errors rather than simulating successful inference.

The app retrieves passages. It does not generate an answer, classify entailment or treat similarity as a probability of truth.

## Meeting notebook

An editable task list with a focused editor: task, owner, date, review flags, deletion undo, and list export. Explicit rules flag missing fields, invalid/past dates, relative deadlines and selected broad wording. Passing the rules is not approval or proof of clarity. Data is memory-only until exported.

## Run

Node.js 20+; Python 3.9+ for the page builder. No dependencies are needed for offline engine tests.

```sh
npm test
npm run evaluate
npm run evaluate:challenge
python3 scripts/build_pages.py
python3 -m http.server 8080
```

Open /retrieval/ or /actions/. Lexical search and task rules require no model. Semantic search requires a compatible browser and initial network download.

## Evaluation

Start with the [40-case challenge and failure analysis](docs/EVALUATION.md). On its 32 cases with relevant sources, normalized BM25 reaches 87.5% Hit@3; paraphrase Hit@3 is 62.5%. These are synthetic diagnostics, not general accuracy. The earlier results below remain available for comparison.


The original fixture has 12 fictional documents and 30 visible synthetic development queries. Raw BM25 has 76.9% Hit@3 on the 26 answerable cases; normalized BM25 has 100%. Two of four unsupported cases still retrieve documents. This fixture was designed to exercise normalization, so these are not general Arabic-search accuracy figures. Labels are AI-assisted, not independently reviewed; there is no held-out set. Actual browser runs on this same fixture produced 100% Hit@3 and MRR 1.0 for semantic and hybrid retrieval, but both returned passages for all four unsupported queries. These results are development diagnostics, not general accuracy. Full reports: [semantic](evaluation-semantic.json) and [hybrid](evaluation-hybrid.json).

## Read the work

- [Design and engineering decisions](docs/DECISIONS.md)
- [Contribution record](https://github.com/cometeux/cometeux/blob/main/notes/CONTRIBUTIONS.md)
- [Independent review protocol](docs/REVIEW_PROTOCOL.md)
- [Verification record](docs/VERIFY.md)
- [Hands-on walkthrough](LEARNING_GUIDE.md)

| Code | Purpose |
|---|---|
| retrieval/engine.js | Arabic tokens, BM25, lexical evaluation |
| retrieval/pipeline.js | Corpus validation, chunks, cosine, fusion, source-span checks |
| ui/retrieval-app.js | Model lifecycle, results, input and report controls |
| actions/engine.js | Explicit action-review rules |
| ui/actions-app.js | Task-list interactions and export |
| ui/*.html | Readable layouts and CSS |
| scripts/build_pages.py | Standalone-page bundling |

## Credits and authorship

Created for Deema Alrafi with AI coding assistance in November 2026. Product direction and revision choices are documented; no independent implementation of every component is claimed. Synthetic fixtures are AI-assisted. These open experiments are separate from confidential work.

- [intfloat/multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small), MIT; mean pooling, normalized embeddings and query/passage retrieval prefixes.
- [Xenova ONNX conversion](https://huggingface.co/Xenova/multilingual-e5-small).
- [Hugging Face Transformers.js](https://github.com/huggingface/transformers.js), Apache-2.0, runtime pinned to 3.8.1.
- BM25 and reciprocal-rank fusion are established retrieval methods, implemented here in JavaScript.

## Limits

Small prototype; no PDF parsing, generated answers, database, authentication or document-access policy. Character splitting can cut a sentence. Similarity is not entailment. Desktop interaction and model inference were checked; mobile, full keyboard/screen-reader and cross-browser behavior remain unverified. Hosting/CDN/model downloads produce ordinary access logs even when text inference stays local.

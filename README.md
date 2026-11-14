# Arabic AI Quality Lab

Two small tools around recurring AI-product questions: where did the evidence come from, and is the next action clear?

[Current search demo](https://huggingface.co/spaces/Deema9/arabic-retrieval-lab) · [Current action-review demo](https://huggingface.co/spaces/Deema9/action-review)

**This branch is a v0.2 draft.** Its revised interfaces and semantic integration are not yet browser-verified or deployed. [Verification status](docs/VERIFY.md).

## Search workspace

A small text-ingestion and evidence-retrieval pipeline:

1. Validate a corpus of up to 60 documents / 80,000 characters.
2. Split into overlapping character chunks and retain exact source positions.
3. Compare normalized BM25, multilingual-e5 embeddings, or reciprocal-rank fusion.
4. Inspect the source and export the quoted passage with its location.
5. Run the visible synthetic cases and export per-query results.

Semantic mode uses the existing multilingual-e5-small model from intfloat, converted to ONNX by Xenova, via Transformers.js 3.8.1. Model weights currently resolve from the Hub's main revision. The first run downloads approximately 120 MB plus tokenizer/runtime files. Inference is intended to run in the browser without an inference API key; actual model loading remains unverified in this draft. The interface reports loading errors rather than simulating successful inference.

The app retrieves passages. It does not generate an answer, classify entailment or treat similarity as a probability of truth.

## Meeting notebook

An editable task list with a focused editor: task, owner, date, review flags, deletion undo, and list export. Explicit rules flag missing fields, invalid/past dates, relative deadlines and selected broad wording. Passing the rules is not approval or proof of clarity. Data is memory-only until exported.

## Run

Node.js 20+; Python 3.9+ for the page builder. No dependencies are needed for offline engine tests.

```sh
npm test
npm run evaluate
python3 scripts/build_pages.py
python3 -m http.server 8080
```

Open /retrieval/ or /actions/. Lexical search and task rules require no model. Semantic search requires a compatible browser and initial network download.

## Evaluation

The original fixture has 12 fictional documents and 30 visible synthetic development queries. Raw BM25 has 76.9% Hit@3 on the 26 answerable cases; normalized BM25 has 100%. Two of four unsupported cases still retrieve documents. This fixture was designed to exercise normalization, so these are not general Arabic-search accuracy figures. Labels are AI-assisted, not independently reviewed; there is no held-out set. No semantic/hybrid quality number is claimed without a completed model run.

## Read the work

- [Design and engineering decisions](docs/DECISIONS.md)
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

- [intfloat/multilingual-e5-small](https://huggingface.co/intfloat/multilingual-e5-small), MIT; mean pooling, normalized embeddings and query/passsage retrieval prefixes.
- [Xenova ONNX conversion](https://huggingface.co/Xenova/multilingual-e5-small).
- [Hugging Face Transformers.js](https://github.com/huggingface/transformers.js), Apache-2.0, runtime pinned to 3.8.1.
- BM25 and reciprocal-rank fusion are established retrieval methods, implemented here in JavaScript.

## Limits

Small prototype; no PDF parsing, generated answers, database, authentication or document-access policy. Character splitting can cut a sentence. Similarity is not entailment. Model quality, latency, download behavior and revised interaction quality need real browser verification. Hosting/CDN/model downloads produce ordinary access logs even when text inference stays local.

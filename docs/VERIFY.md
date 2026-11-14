# Verification — v0.2

14 November 2026. Desktop Chrome, macOS.

## Automated

The 20-test Node.js suite passed locally and in GitHub Actions (run 43611362285). It covers normalization, BM25, metrics, corpus bounds, chunks and overlap, cosine dimensions, fusion, source-span checks, missing fields and invalid dates. Synthetic vector tests check the ranking implementation, not model quality.

## Actual browser inference

- Downloaded and initialized Xenova/multilingual-e5-small (q8) with Transformers.js 3.8.1.
- Generated passage embeddings in the browser.
- The paraphrase “كم يوم أقدر أداوم من البيت؟” returned the remote-work source first; lexical search had no shared words for that query.
- Opened the source dialog and confirmed the source text and its exact span, remote#1 at 0–55.
- Ran all 30 visible synthetic cases in semantic mode and hybrid mode, then downloaded and parsed both reports.

| Metric, synthetic development fixture | Raw lexical baseline | Semantic | Hybrid |
|---|---:|---:|---:|
| Hit@3 on 26 answerable queries | 76.9% | 100% | 100% |
| MRR on 26 answerable queries | 0.769 | 1.000 | 1.000 |
| Unsupported queries returning results | 2/4 | 4/4 | 4/4 |

Full outputs are in evaluation-semantic.json and evaluation-hybrid.json. This is a small, visible, AI-assisted fixture, not independent ground truth or a held-out benchmark. The results do not establish general Arabic retrieval quality. Semantic/hybrid retrieval returning passages for every unsupported query is a failure mode, not successful support detection. No answer generation or calibrated refusal is implemented.

## Search interactions

Verified lexical search, semantic search, combined ranking, source dialog open/close, evaluation report export, and replacing the sample corpus with two public invented snippets. A books query returned the imported borrowing-policy snippet. Corpus replacement cleared the previous semantic index and selected lexical mode.

## Action-review interactions

Verified task editing, owner editing, explicit “after one week” deadline selection, required-field updates, adding a task, deleting and undoing deletion, and list export. Parsed the exported JSON: four records, the selected due date, review flags and approved=false. The native date-picker selection could not be reliably exercised through the automation surface; the explicit quick-date control and date validation were verified.

## Visual inspection

Inspected the desktop layouts in Chrome. Search uses a navy side rail and a two-column evidence comparison. The meeting notebook uses a task list and a focused editor. Corrected count wording, compacted the notebook heading, and changed the default search to one that shows a useful lexical result immediately.

Not verified: mobile viewport behavior, full keyboard traversal, screen-reader output, cross-browser behavior or production-scale performance. No accessibility-compliance or production-readiness claim is made.

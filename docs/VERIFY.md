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

## v0.3 follow-up — 14 November 2026

28 Node tests passed locally. Eight additions cover unique-source metrics, multiple relevant sources, empty sets, contradiction labels, fixture integrity, original whitespace preservation and invalid fractional overlap. The new 40-case challenge was executed with both lexical methods; its full outputs and fixture hash are committed. See [failure analysis](EVALUATION.md). No new semantic/hybrid score is claimed for that fixture.

Native Chrome's responsive preview was set to **320 CSS pixels**. Inspected both local bundled pages: headings, controls, results and the notebook's single-column owner/date fields. The task list intentionally scrolls horizontally within its own strip. Opened the search source dialog: it exposed its source title, focused its close button, closed with Escape and returned focus to its trigger. The new header SVG was also visually inspected in Chrome.

This is a targeted responsive and keyboard check, not full accessibility certification. Screen-reader speech, complete keyboard traversal, multiple physical phones, other browsers and production-scale performance remain unverified. UI source changes are included in this repository; hosted deployment verification is recorded separately when performed.

## v0.4 — local workspace and auditable exports

39 Node tests passed locally, including the versioned workspace contract, corpus fingerprints, citation tampering, source deduplication, invalid queries, UTF-16/emoji boundaries and offline CLI exit codes. Both bundled browser scripts pass syntax checking. The committed synthetic workspace/report pair also verifies without any model or network call.

Actual local Chrome session:

- Imported two invented public library snippets, changed the workspace name, and saved an IndexedDB snapshot.
- Reloaded the page, manually restored it, and observed the saved name and both documents. Evaluation was disabled for this custom corpus.
- Searched for an exact term, downloaded the workspace and evidence JSON, and ran the offline verifier against those actual downloads: valid=true, one quotation.
- Restored Challenge 1, loaded the actual q8 model, and ran all 40 cases in semantic and hybrid modes. Both reports were downloaded, parsed and committed. See evaluation-challenge-semantic.json and evaluation-challenge-hybrid.json.

The lexical engine does not stem Arabic words: “الكتب” does not match “كتب” by itself. This limitation was observed and remains explicit. The semantic model is optional; the app does not pretend that lexical matching understands synonyms.

Hosted validation, JSON-file restoration, multiple TXT upload and the final responsive check are recorded below when executed. No user-study or production-reliability result is inferred from these functional checks.

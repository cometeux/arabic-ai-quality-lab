# Arabic AI Quality Lab

Two small, offline tools for inspecting the quality of Arabic AI product workflows.

**[Try Arabic Retrieval Lab](https://huggingface.co/spaces/Deema9/arabic-retrieval-lab)** · **[Try Action Review](https://huggingface.co/spaces/Deema9/action-review)**

## 1. Arabic Retrieval Lab

**Problem:** an Arabic search demo can look convincing while missing spelling variants or retrieving a source that does not support the claim.

Compare the same BM25 lexical ranker before and after Arabic normalization. Inspect matched terms and sources, filter cases, and export a per-case evaluation. No LLM, embeddings, API key or external service is used.

The deliberately small development fixture contains 12 fictional policy snippets and 30 queries: 26 labeled retrieval cases and 4 unsupported/out-of-scope cases. Labels were authored with AI assistance for this demo and are not independently reviewed. They are not a production benchmark or a held-out test.

### Reproduce

```sh
npm test
npm run evaluate
```

Node.js 20+; no dependencies to install. Open `retrieval/index.html` directly in a browser. Rebuild bundled pages with `python3 scripts/build_pages.py` after changing engines or UI.

| Metric on the bundled development fixture | Raw text | Normalized |
|---|---:|---:|
| Hit@3, 26 answerable cases | 76.9% | 100% |
| MRR, 26 answerable cases | 0.769 | 1.000 |
| Unsupported cases that still retrieve a document | 2 / 4 | 2 / 4 |

These results demonstrate the fixture and implementation, not general Arabic retrieval accuracy. The fixture was designed to exercise normalization, so improvement is expected. Shared words can retrieve a misleading source. Retrieval score is not a probability of support; this tool does not implement a calibrated abstention policy. No stemming, synonym expansion, semantic understanding, dialect handling or answer generation is claimed.

## 2. Action Review

**Problem:** meeting tasks are hard to follow when nobody owns them, deadlines are relative, or the expected deliverable is vague.

Enter a task, owner and due date. Inspect missing fields, invalid or past dates, selected vague phrases, relative dates and possible multiple actions. Export the structured record and flags. Required fields and advisory flags are separated. The tool never guesses an owner or turns “tomorrow” into a date without confirmation.

Open `actions/index.html` directly in a browser. It is a heuristic workflow prototype, not an AI extraction model. Phrase rules can overflag or miss issues, and passing rules does not establish that a task is feasible, accepted or unambiguous.

## Design and implementation decisions

- Arabic-first RTL interface, visible labels, keyboard controls, accessible live status and responsive cards.
- Show evidence and failure cases, not just a success message.
- Keep data local: application code makes no network calls. Host providers may collect ordinary access logs.
- Render user text using `textContent`, never interpolated HTML.
- Dependency-free JavaScript engine reused by tests and browser bundles.
- No employer files, recordings, real identities or internal policies included.

## Provenance and authorship

Created in November 2026 as new portfolio experiments for Deema Alrafi, using AI coding assistance. The code, interface and synthetic fixtures in this repository were generated and refined in that collaboration. Deema's independent implementation or mastery of every line has **not** been verified. These are not historical employment achievements. See `LEARNING_GUIDE.md` for a practical walkthrough before presenting them.

BM25 is an established information-retrieval method, implemented here without copying a third-party codebase. Arabic normalization rules are deliberately limited and documented in `retrieval/engine.js`. No fine-tuned or trained model is claimed.

## Source map

- `retrieval/engine.js`: tokenization, BM25 and metrics.
- `retrieval/fixtures.json`, `queries.jsonl`: transparent synthetic cases and labels.
- `actions/engine.js`: explicit field and phrase rules.
- `tests/quality.test.cjs`: edge cases, ranking, metrics and action checks.
- `evaluation.json`: reproducible local report.
- `scripts/build.py`: regenerates fixture files.
- `scripts/build_pages.py`: bundles standalone demos.

## Next useful work

Collect independently labeled Arabic queries; freeze a held-out set before tuning; compare semantic retrieval; measure overflag/miss rates in action review using consented, de-identified examples. None of that work is completed in this release.

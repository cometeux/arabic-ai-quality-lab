# Decisions behind v0.2

Deema requested natural Arabic, distinct interfaces, stronger technical substance and clear protection of confidential work. She rejected the first shared beige-card layout and generic explanatory copy. This draft responds to that feedback. The directions below are grounded in the collaboration; they do not imply independent implementation of every line.

| Decision | Reason | Trade-off |
|---|---|---|
| Put the query and source passages first | Let someone try the task before reading documentation | Explanations move below results |
| Give the tools different structures | Evidence search needs comparison; meeting review needs a list and a focused editor | More UI maintenance |
| Use short, contextual Arabic | Say what happens next | Technical details stay in documentation |
| Preserve exact source positions | A citation must refer to actual text | Provenance does not establish that a claim is supported |
| Add an existing multilingual embedding model | Explore semantic retrieval without claiming model training | Around 120 MB download and browser CPU latency |
| Compare lexical, semantic and RRF ranking | Make differences inspectable | No method is assumed to win |
| Local inference | Avoid sending document text to an inference API | Model/CDN requests still produce ordinary network logs |
| Never label similarity as truth | A similar passage can contradict a query | People must inspect the evidence |
| Explicit owners and deadlines | Assignment should reflect an agreement | Manual input remains necessary |
| Advisory language flags | Broad phrases may be appropriate in context | False positives require judgment |
| Task list, deletion undo and list export | Make review a workflow | Data is memory-only |

## What this draft adds

Text ingestion with input limits; character chunks with overlap; cosine ranking; multilingual-e5 model lifecycle; reciprocal-rank fusion; source-span validation; per-query evaluation exports; and an editable action list.

## Provenance

New portfolio experiments created in November 2026 with AI coding assistance. User-provided direction is distinguished from implementation assistance. The bundled examples and labels are synthetic and AI-assisted. No independent annotation, user study, production deployment or personal implementation proficiency is inferred.

## Useful next contributions

Deema can add new queries and label their expected sources before tuning, document one failed search, and review a wording flag that overfires. Those activities have not been represented as completed work.

## v0.3: inspect the weakness instead of polishing the score

The portfolio review identified limited evaluation and weak contribution evidence. The follow-up adds a 40-case diagnostic, source-level recall and nDCG, and separates contradicted claims from irrelevant sources. No ranking weights were tuned to this fixture. [Failure analysis](EVALUATION.md).

Two implementation issues were also corrected: ingestion no longer trims the source text before preserving offsets, and noninteger chunk overlap is rejected. The source dialog has an accessible name; both pages have skip links and larger controls; task-list selection restores keyboard focus to the selected task. These changes need browser verification before accessibility claims.

## v0.4: make a result reproducible beyond the page

The follow-up prioritizes a complete public-document workflow over adding more disconnected demos. It adds versioned JSON import/export, explicit IndexedDB snapshots, SHA-256 corpus fingerprints, an offline quotation verifier, unique-source result selection, and the 40-case challenge in the live UI. Dataset replacement invalidates vectors and evaluation; method changes clear old evaluation results. The source dialog highlights the exact selected passage. [Architecture](ARCHITECTURE.md) · [Case study](CASE_STUDY.md).

A raw-text corpus is intentionally small and public: this remains a portfolio experiment, with no organizational access control, compliance claim or confidential data. The decision to retrieve inspectable passages instead of generating an answer follows the observed missing-information failures.

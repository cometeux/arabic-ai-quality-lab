# A search result is the start of a check

**Arabic Retrieval Lab** · Working browser experiment · November 2026  
[Open the workspace](https://huggingface.co/spaces/Deema9/arabic-retrieval-lab) · [Code](../retrieval) · [Actual evaluation outputs](../evaluation-challenge-hybrid.json)

## The problem

An Arabic search demo can return plausible text while missing a differently worded question, overlooking a second necessary source, or returning a related document that never answers the question. A polished interface can hide those failures.

The experiment makes the retrieved text and the comparison visible. Its purpose is to help someone inspect evidence across a small public document set, not to produce a confident answer from it.

## What someone can finish

Import public TXT files or pasted text → search → open the source with the matching passage highlighted → export the evidence and workspace → verify that the quotations still match. Save a browser snapshot when useful and restore it after reopening the page. No inference API key is required.

## Design direction and implementation

Deema's direction was to make the Arabic useful and natural, give the experiment its own task-focused layout, preserve confidentiality and expose the evidence behind the result. The public source, implementation, synthetic data, tests and documentation were developed with AI assistance. This case study does not claim independent authorship of each algorithm or an independently conducted user study.

| Choice | Reason | Cost or limitation |
|---|---|---|
| Search and source passages share the main workspace | Let people inspect the result while comparing methods | More reading than a single generated answer |
| Reuse an existing multilingual embedding model | Explore semantic retrieval without a private inference API | Initial model download and browser CPU/memory cost |
| Keep the best passage per source | One long document should not crowd out other sources | Other useful passages in that document are not shown in the top three |
| Save a versioned workspace and exact source spans | Let someone reproduce and audit a result | Text files contain the documents; exports need careful handling |
| Separate source relevance from claim support | A source can be useful precisely because it contradicts a claim | No automatic correctness or refusal judgment |
| Local snapshot only when requested | Make storage a deliberate choice | People must remember to save or download |

## What changed after the first evaluation

The first spelling-focused fixture reached 100% normalized Hit@3. A harder, visible diagnostic showed a more useful picture. It contains 18 fictional documents, 40 queries and AI-assisted labels. It is not independent or held out.

Actual desktop Chrome runs on the 32 cases with relevant sources:

| Method | Hit@3 | Source Recall@3 | MRR | nDCG@3 |
|---|---:|---:|---:|---:|
| Raw BM25 | 84.38% | 82.81% | 0.7604 | 0.7674 |
| Normalized BM25 | 87.50% | 85.94% | 0.7917 | 0.7986 |
| Semantic e5 | 96.88% | 92.19% | 0.8941 | 0.8793 |
| Hybrid RRF | 96.88% | 93.75% | 0.9219 | 0.9059 |

The semantic and hybrid runs each retrieved passages for **all eight missing-information queries**. That is a limitation, not evidence of answering those questions. Similarity is never displayed as a probability of truth. The semantic run also missed the diacritized permissions query within the first three sources. [Full failure analysis](EVALUATION.md).

## Evidence of working behavior

- Automated tests include failed imports, source and offset tampering, invalid modes, duplicate sources, exact whitespace and emoji preservation, and CLI exit codes.
- In an actual browser session, two invented library sources were imported and saved. After a reload, the saved name and texts were restored.
- A real workspace and evidence report were downloaded from the browser and checked by the offline verifier: one quotation matched its original source.
- Both 40-case model evaluations were run in the browser and downloaded as full per-query reports.

[Verification record](VERIFY.md) records the tested build and remaining checks. These are functional checks, not evidence of external adoption or independently measured usability.

## Next evidence to earn

Independent public-document review, labeling disagreements, an untouched final evaluation set, broader device/accessibility coverage and a calibrated missing-information policy. Those results will be added only when they exist.

---

## بالعربي

المشروع مساحة بحث عربية تتيح إدخال نصوص عامة ومقارنة البحث النصي والدلالي والهجين، ثم فتح المصدر وتنزيل الأدلة والتحقق من تطابق الاقتباسات مع الأصل. يدعم حفظ نسخة محلية واستعادتها ونقل المساحة بملف JSON. التقييم فعلي لكنه مبني على أمثلة مصطنعة؛ استرجاع نص مشابه لا يعني أن المعلومة صحيحة أو أن الإجابة موجودة.

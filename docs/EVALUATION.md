# When the first demo looked better than the harder test

The first fixture was built around Arabic spelling normalization. Its 100% normalized Hit@3 was useful for checking the implementation, but a poor headline for retrieval quality. A second diagnostic makes the difficult cases more visible.

## Two questions, two labels

“Working from home is allowed five days a week” may be contradicted by the remote-work document. Retrieving that document is useful for checking the claim; it does not make the claim true. The original fixture's empty labels for such claims mixed source relevance with support. Its reports are retained as historical development outputs, not evidence of a support detector.

Challenge 1 separates `relevant_source_ids` from `claim_relation`. Contradicted claims keep their checking sources. Missing facts have no relevant answer source, even when a related document exists. The app retrieves text; it does not infer the relation labels or generate answers.

## A harder, reproducible diagnostic

18 fictional documents; 40 visible queries: paraphrases (8), spelling variants (4), questions involving multiple sources (6), nearby-topic distractors (6), contradicted claims (8), and missing information (8). Labels are AI-assisted. This was authored after v0.2 and has not been used to tune the ranker. It is **not** an independent or held-out benchmark.

```sh
npm test
npm run evaluate:challenge
```

[Fixture](../retrieval/challenge.json) · [Full output](../evaluation-challenge.json) · [Metric implementation](../retrieval/metrics.cjs)

The output includes a SHA-256 of the exact fixture bytes, every query, expected sources, actual ranks and category summaries. Repeated chunks from one source cannot inflate source recall. CI regenerates the report and checks that the committed results match.

| Metric | Raw BM25 | Normalized BM25 |
|---|---:|---:|
| Hit@3, 32 cases with checking sources | 84.38% | 87.50% |
| Mean source Recall@3 | 82.81% | 85.94% |
| MRR | 0.7604 | 0.7917 |
| Binary nDCG@3 | 0.7674 | 0.7986 |
| Paraphrase Hit@3, 8 cases | 62.50% | 62.50% |
| Missing-fact queries returning text, 8 cases | 6 | 6 |

Normalization helps spelling. It does not solve paraphrases, missing facts or support judgments. Semantic/hybrid results from the original 30-case fixture are **not** transplanted to this new diagnostic. They need fresh runs before comparison.

## Three failures worth keeping

| Input | Observed normalized result | What it exposes |
|---|---|---|
| خلص شغلي، وين أسلم اللابتوب؟ | No results | No lexical overlap with the device-return source |
| ضاعت علي آلة العمل، مين أكلم؟ | Minutes and travel ahead of the relevant sources | Shared generic words can dominate the useful meaning |
| كم سعر اشتراك المكتبة؟ | Related library text is returned | Topic similarity cannot supply an absent price |

## What I would test next

Collect public, permissioned examples from independent reviewers; label relevant sources before tuning; report disagreements; split development and final evaluation; then compare retrieval methods on the same untouched set. Measure missing-information behavior separately. An abstention threshold would need calibration and a held-out set; a score cutoff added to make this table prettier would not establish safe refusal.

## Reading the numbers

Hit@3 asks whether any expected source appears among the first three unique sources. Recall@3 asks how many expected sources appear. MRR uses the rank of the first expected source across the returned list. nDCG@3 rewards expected sources appearing early, with binary relevance. These are retrieval measures, not factual-answer accuracy. Cases with no expected source are excluded from those averages and reported separately.

## v0.4 — actual semantic and hybrid runs on Challenge 1

Executed in desktop Chrome with Xenova/multilingual-e5-small q8 and Transformers.js 3.8.1. The browser bundled the same 18 documents and 40 cases. Reports include a corpus digest, model configuration, unique-source metrics and every row.

| Metric, 32 cases with relevant sources | Semantic | Hybrid RRF |
|---|---:|---:|
| Hit@3 | 96.875% | 96.875% |
| Mean Recall@3 | 92.1875% | 93.75% |
| MRR | 0.8941 | 0.9219 |
| nDCG@3 | 0.8793 | 0.9059 |
| Missing-information queries returning passages | 8/8 | 8/8 |

[Semantic report](../evaluation-challenge-semantic.json) · [Hybrid report](../evaluation-challenge-hybrid.json). Semantic retrieval misses c12, the diacritized permissions question, within the first three sources. Hybrid retrieval recovers that case but misses c03, the dialectal lost-device question. Fusion improves some ranks while introducing a different failure; it does not dominate every query. No ranking parameters were changed to optimize these reports. This is still a visible, AI-assisted synthetic diagnostic; it does not establish general Arabic retrieval quality.

The browser fixture hash is SHA-256 of `JSON.stringify` on its bundled object. The CLI diagnostic hashes the raw fixture-file bytes. The reports explicitly label these formats; their fixture hashes are not expected to match. Corpus fingerprints use the same validated document representation.

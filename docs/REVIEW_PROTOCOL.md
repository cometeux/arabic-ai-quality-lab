# Try a five-minute review

Use public or invented text only. You can report one finding without completing every task. No independent sessions have been recorded yet.

[Open the search tool](https://huggingface.co/spaces/Deema9/arabic-retrieval-lab) · [Open the notebook](https://huggingface.co/spaces/Deema9/action-review) · [Submit your finding](https://github.com/cometeux/arabic-ai-quality-lab/issues/new?template=independent-review.yml)

## Search: a reproducible starting point

Replace the example corpus with these two invented documents. They describe a fictional workplace.

**Document A — Borrowing a screen**

> تتيح المكتبة استعارة شاشة لمدة خمسة أيام. يتطلب تمديد الاستعارة موافقة مسؤول المكتبة.

**Document B — Meeting rooms**

> يمكن حجز غرفة الاجتماع من التقويم. إلغاء الحجز متاح لمن أنشأه.

Use lexical search first, so a model download is not part of the task.

1. Search: **كم يوم أقدر أستعير الشاشة؟** Open the source and check its passage.
2. Search: **كم غرامة التأخير؟** Decide whether either document supplies an answer.
3. Export both the workspace and the search evidence.
4. Save a local snapshot, reload and restore it.

For the first task, the source is Document A and the duration is five days. For the second, neither document specifies a fee: a returned passage is not confirmation. Compare your experience against these checks only after trying the tasks. Record any assistance you needed.

Optionally repeat with semantic or hybrid search, recording the selected mode and whether model loading succeeds.

## Task notebook

1. Add an invented task with a deliverable, owner and date.
2. Explain one review flag in your own words.
3. Delete the task and undo the deletion.
4. Export the list. Does the tool claim that anyone approved it?

Check whether the export describes the review state without implying approval. Record if you expected automatic saving; the notebook keeps data in memory until export.

## Record the observation

[Use the review form](https://github.com/cometeux/arabic-ai-quality-lab/issues/new?template=independent-review.yml). Include the page/build, date, browser, device, selected mode, exact public input, expected behavior before any explanation, what happened and whether you completed the task.

Do not put names, employer information, private files or personal data in an issue. A reviewer can use their GitHub handle; participant demographics are not needed. Submit screenshots only if they contain public test material.

## How findings become changes

1. Reproduce the finding against the specified build.
2. Classify it as functional failure, task difficulty, misleading interpretation or suggestion.
3. Record its effect and a proposed change, or explain why it is deferred.
4. Link the change and a regression check where useful.
5. Ask for or record an actual retest. Do not mark a retest successful without observing it.

Use the [review record](REVIEW_RESULTS.md) for session counts, dispositions and retests. Functional tests are not participant sessions. A convenience review is not a representative usability study.

## بالعربي

جرّب البحث بالنصين الخياليين، ثم اسأل عن مدة الاستعارة وعن غرامة غير مذكورة. افتح المصدر ونزّل مساحة العمل والأدلة. سجّل ما توقّعته وما حدث وأي مساعدة احتجتها في نموذج المراجعة. لا ترسل ملفات العمل أو بيانات شخصية.

"""Author a synthetic diagnostic fixture; this is not independent annotation."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
documents=[
('remote','العمل من المنزل','يمكن العمل من المنزل يومين في الأسبوع بموافقة مدير الفريق. لا يشمل ذلك فترة التدريب.'),
('training','تدريب الموظفين','يكون حضور الموظفين خلال فترة التدريب من المكتب طوال الأسبوع.'),
('leave','الإجازة السنوية','يرسل الموظف طلب الإجازة السنوية إلى المدير قبل الحجز. موافقة المدير شرط لتأكيد الطلب.'),
('travel','السفر للعمل','حجز تذاكر رحلة العمل يتطلب اعتماد الميزانية. تتولى الإدارة المالية مراجعة المصروفات بعد العودة.'),
('travel-cancel','إلغاء الرحلة','عند إلغاء رحلة العمل يجب إبلاغ منسق السفر لإلغاء التذاكر، وتقديم طلب استرداد للمالية.'),
('device','تسليم الأجهزة','بعد انتهاء التكليف يعاد الحاسب المحمول إلى فريق الدعم مع الشاحن. لا يرسل بالبريد الشخصي.'),
('device-loss','فقد الأجهزة','عند فقد الحاسب يجب إبلاغ أمن المعلومات فورًا. لا تنتظر موعد تسليم الأجهزة.'),
('access','صلاحيات الأنظمة','تمنح صلاحيات الأنظمة حسب دور الموظف وتراجع كل ثلاثة أشهر. ينتهي الوصول عند انتهاء التكليف.'),
('access-request','طلب صلاحية جديدة','طلب الوصول الجديد يرفع عبر بوابة الدعم ويحتاج موافقة مالك النظام.'),
('privacy','بيانات الاختبار','تخفى البيانات الشخصية قبل نقل الملفات إلى بيئة الاختبار. تستخدم أمثلة مصطنعة عندما تكفي للغرض.'),
('incident','الحوادث الأمنية','ترفع الحوادث الأمنية إلى أمن المعلومات عبر بوابة الدعم، مع وصف الوقت والأثر.'),
('minutes','مراجعة المحضر','يحتوي المحضر على القرارات والتكليفات وأسماء المسؤولين وتواريخ التسليم. يراجع المنظم المسودة قبل الاعتماد.'),
('recording','تسجيل الاجتماع','يبلغ المنظم جميع الحضور قبل بدء التسجيل. حفظ التسجيل لا يعني اعتماد محضر الاجتماع.'),
('backup','النسخ الاحتياطي','تنفذ نسخة احتياطية يوميًا وتختبر الاستعادة شهريًا. النسخ وحده لا يثبت إمكانية استرجاع الملفات.'),
('purchase','شراء البرمجيات','شراء البرمجيات يحتاج مراجعة الأمن والمشتريات قبل الدفع. هذه الوثيقة لا تحدد سقفًا ماليًا.'),
('support','الدعم الفني','تستقبل بوابة الدعم الأعطال الفنية. اذكر الجهاز والخطأ والخطوات التي سبقت المشكلة.'),
('library','إعارة الكتب','تتيح المكتبة إعارة ثلاثة كتب لمدة أسبوعين. التجديد متاح مرة واحدة إذا لم يحجز الكتاب شخص آخر.'),
('library-room','حجز قاعة المكتبة','تحجز قاعة المكتبة عبر التقويم لمدة ساعتين. حجز القاعة لا يتطلب استعارة كتاب.')]
cases=[]
def add(category,query,ids,claim='not_a_claim'):
 cases.append(dict(id=f'c{len(cases)+1:02}',category=category,query=query,relevant_source_ids=ids,claim_relation=claim))
for cat,q,ids in [
('paraphrase','كم يوم أقدر أداوم من البيت؟',['remote']),
('paraphrase','خلص شغلي، وين أسلم اللابتوب؟',['device']),
('paraphrase','ضاعت علي آلة العمل، مين أكلم؟',['device-loss','incident']),
('paraphrase','أبي أدخل نظام ما عندي عليه وصول',['access-request']),
('paraphrase','مين يشيك مسودة الاجتماع قبل تصير نهائية؟',['minutes']),
('paraphrase','الكتاب عندي وأبي أمدد المدة',['library']),
('paraphrase','كيف أتأكد أن الملفات ترجع بعد عطل؟',['backup']),
('paraphrase','اشترينا تذاكر وبعدين ألغينا السفر، وش نسوي؟',['travel-cancel']),
('normalization','اِجَازَة الموظف',['leave']),
('normalization','إعاده الاجهزه بعد انتهاء التكليف',['device']),
('normalization','إخفاء البيانات الشخصيه في الاختبار',['privacy']),
('normalization','صَلاحيّات الأَنْظِمَة',['access']),
('multi_source','من يوافق على السفر ومن يراجع المصروفات؟',['travel']),
('multi_source','هل أقدر أشتغل من المنزل وأنا في التدريب؟',['remote','training']),
('multi_source','قبل تسجيل الاجتماع وبعد إعداد المحضر، ماذا أفعل؟',['recording','minutes']),
('multi_source','انتهى التكليف، ماذا يحدث للجهاز وللوصول؟',['device','access']),
('multi_source','كيف أبلغ عن فقد الحاسب؟',['device-loss','incident']),
('multi_source','كيف أطلب صلاحية وما قواعد مراجعتها؟',['access-request','access']),
('distractor','كم مدة حجز قاعة المكتبة؟',['library-room']),
('distractor','كم مدة استعارة كتب المكتبة؟',['library']),
('distractor','هل حفظ التسجيل يعني اعتماد المحضر؟',['recording','minutes']),
('distractor','من يستقبل عطل الجهاز وليس فقده؟',['support']),
('distractor','من يلغي التذاكر بعد إلغاء رحلة العمل؟',['travel-cancel']),
('distractor','متى تختبر الاستعادة وليس متى تؤخذ النسخة؟',['backup']),
]: add(cat,q,ids)
for q,ids in [
('العمل من المنزل متاح خمسة أيام للجميع',['remote','training']),
('يمكن حضور فترة التدريب من المنزل',['training','remote']),
('أرسل الجهاز بالبريد الشخصي بعد انتهاء التكليف',['device']),
('أنتظر موعد التسليم إذا فقدت الحاسب',['device-loss']),
('النسخ اليومي يكفي لإثبات استرجاع الملفات',['backup']),
('يبدأ التسجيل دون إبلاغ الحضور',['recording']),
('موافقة المدير على الإجازة غير مطلوبة',['leave']),
('يمكن تجديد إعارة الكتاب دائمًا حتى مع وجود حجز',['library']),
]:add('contradictory_claim',q,ids,'contradicted')
for q in ['كم راتب المدير التنفيذي؟','ما لون كوكب نبتون؟','كم سعر اشتراك المكتبة؟','ما الحد المالي لشراء البرمجيات؟','هل تتوفر إعارة أجهزة لوحية؟','أين موقع مكتب فريق الدعم؟','ما مدة الاحتفاظ بتسجيلات الاجتماعات؟','كم عدد أيام الإجازة السنوية؟']:
 add('missing_information',q,[],'not_established')
fixture=dict(version='challenge-1',provenance='AI-assisted synthetic diagnostic authored after v0.2; not held-out or independently annotated. No ranking changes were tuned against it.',label_policy='Relevant source labels describe passages useful for checking a question, including contradictions. They do not label an answer as true. Empty labels mean the requested fact is absent, even if a related document exists.',documents=[dict(id=i,title=t,text=s)for i,t,s in documents],cases=cases)
(root/'retrieval/challenge.json').write_text(json.dumps(fixture,ensure_ascii=False,indent=2)+'\n')

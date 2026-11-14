from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
docs=[
('leave','إجازة الموظف','إجازة الموظف السنوية تتطلب موافقة المسؤول قبل تأكيد الحجز.'),
('remote','العمل عن بعد','العمل عن بعد متاح يومين أسبوعيا بعد موافقة مدير الفريق.'),
('travel','رحلات العمل','رحلات العمل تتطلب اعتماد الميزانية قبل حجز التذاكر.'),
('device','أجهزة العمل','أجهزة العمل تعاد لفريق الدعم عند انتهاء التكليف.'),
('access','صلاحيات النظام','صلاحيات النظام تمنح حسب دور المستخدم وتراجع كل ثلاثة أشهر.'),
('privacy','إخفاء البيانات','إخفاء البيانات الشخصية مطلوب في بيئة الاختبار قبل مشاركة الملفات.'),
('incident','الإبلاغ عن الحوادث','الإبلاغ عن الحوادث الأمنية يتم عبر بوابة الدعم مع وصف الأثر.'),
('minutes','محاضر الاجتماعات','محاضر الاجتماعات تحفظ القرارات والتكليفات والمسؤول وتاريخ التسليم.'),
('procurement','شراء البرمجيات','شراء البرمجيات يتطلب مراجعة الترخيص واعتماد مالك الميزانية.'),
('expense','استرداد المصروفات','استرداد المصروفات يتطلب إرفاق الفواتير وإرسال الطلب خلال ثلاثين يوما.'),
('training','طلب التدريب','طلب التدريب يوضح الهدف التعليمي والمدة وموافقة المدير.'),
('backup','النسخ الاحتياطي','النسخ الاحتياطي يتم يوميا وتختبر استعادة الملفات شهريا.')]
queries=[
('إجازة الموظف','leave','exact'),('اجازة','leave','alef'),('إِجازَة','leave','diacritics'),('إجـازة','leave','tatweel'),
('العمل عن بعد','remote','exact'),('أسبوعيا','remote','alef'),('رحلات العمل الميزانية','travel','exact'),('اعتماد الميزانية التذاكر','travel','multi_term'),
('أجهزة العمل','device','exact'),('اجهزة','device','alef'),('صلاحيات النظام','access','exact'),('تراجع دور المستخدم','access','multi_term'),
('إخفاء البيانات','privacy','exact'),('اخفاء','privacy','alef'),('الإبلاغ عن الحوادث','incident','exact'),('الابلاغ','incident','alef'),
('محاضر الاجتماعات','minutes','exact'),('القرارات والتكليفات','minutes','exact'),('شراء البرمجيات','procurement','exact'),('مراجعة الترخيص','procurement','multi_term'),
('استرداد المصروفات','expense','exact'),('إرفاق','expense','exact'),('طلب التدريب','training','exact'),('الهدف التعليمي','training','exact'),
('النسخ الاحتياطي','backup','exact'),('تختبر استعادة الملفات','backup','multi_term'),
('العمل عن بعد متاح خمسة أيام',None,'unsupported_claim'),('شراء البرمجيات بمبلغ مليون ريال',None,'unsupported_claim'),('ما لون كوكب نبتون',None,'out_of_scope'),('كم راتب الرئيس التنفيذي',None,'out_of_scope')]
data={'version':'0.1.0','provenance':'Synthetic fixtures authored with AI assistance for this demo; not real policies or independently validated ground truth.','documents':[{'id':i,'title':t,'text':s} for i,t,s in docs],'cases':[{'id':f'q{n:02}','query':q,'relevant_ids':[r] if r else [],'category':c} for n,(q,r,c) in enumerate(queries,1)]}
(root/'retrieval/fixtures.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
(root/'retrieval/data.js').write_text('window.FIXTURES='+json.dumps(data,ensure_ascii=False)+';\n')
(root/'retrieval/queries.jsonl').write_text('\n'.join(json.dumps(c,ensure_ascii=False) for c in data['cases'])+'\n')

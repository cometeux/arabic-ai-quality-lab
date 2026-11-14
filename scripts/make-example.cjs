const fs=require('node:fs');const W=require('../retrieval/workspace.js');const P=require('../retrieval/pipeline.js');
(async()=>{
 const documents=[{id:'library',title:'إعارة الكتب — مثال مصطنع',text:'تتيح المكتبة إعارة ثلاثة كتب لمدة أسبوعين. التجديد متاح مرة واحدة إذا لم يحجز الكتاب شخص آخر.'},
 {id:'room',title:'قاعة القراءة — مثال مصطنع',text:'تحجز قاعة القراءة عبر التقويم لمدة ساعتين. حجز القاعة لا يتطلب استعارة كتاب.'}];
 const w=W.create('مكتبة عامة — بيانات مصطنعة',documents);
 const report=await W.evidenceBundle('إعارة','lexical',P.retrieve('إعارة',P.chunkDocuments(documents)),documents);
 fs.writeFileSync('examples/public-workspace.json',W.serialize(w)+'\n');fs.writeFileSync('examples/evidence-search.json',JSON.stringify(report,null,2)+'\n');
})().catch(e=>{console.error(e.message);process.exitCode=1;});

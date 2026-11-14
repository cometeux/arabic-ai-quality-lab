const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const os=require('node:os');const path=require('node:path');const {spawnSync}=require('node:child_process');
const W=require('../retrieval/workspace.js');const P=require('../retrieval/pipeline.js');
const docs=[{id:'a',title:'سياسة عامة',text:'  يبدأ الاستقبال الساعة التاسعة.\n🌙 ينتهي الساعة الخامسة.  '},{id:'b',title:'المكتبة',text:'مدة إعارة الكتب أسبوعان.'}];
test('workspace export and import preserve Arabic, emoji and original whitespace',()=>{
 const w=W.create('مساحتي',docs);assert.deepEqual(W.parse(W.serialize(w)),w);assert.equal(w.documents[0].text,docs[0].text);
});
test('unknown schema versions and malformed JSON cannot become workspaces',()=>{
 const w=W.create('مساحتي',docs);assert.throws(()=>W.parse('{'));assert.throws(()=>W.validate({...w,version:2}));assert.throws(()=>W.validate({...w,schema:'other'}));assert.throws(()=>W.parse('x'.repeat(600001)));
});
test('workspace metadata and corpus limits are enforced before import',()=>{
 assert.throws(()=>W.create('',docs));assert.throws(()=>W.create('x'.repeat(81),docs));
 assert.throws(()=>W.create('A',[{id:'same',text:'a'},{id:'same',text:'b'}]));
 assert.throws(()=>W.create('A',[{text:'x'.repeat(80001)}]));
});
test('corpus fingerprints are deterministic and sensitive to exact source text and titles',async()=>{
 const one=await W.fingerprint(docs);assert.equal(one,await W.fingerprint(JSON.parse(JSON.stringify(docs))));
 assert.notEqual(one,await W.fingerprint([{...docs[0],text:docs[0].text.trim()},docs[1]]));
 assert.notEqual(one,await W.fingerprint([{...docs[0],title:'changed'},docs[1]]));
});
test('evidence round trip verifies exact source provenance',async()=>{
 const rows=P.retrieve('الاستقبال',P.chunkDocuments(docs));const report=await W.evidenceBundle('الاستقبال','lexical',rows,docs);
 const result=await W.verifyReport(report,W.create('أصل',docs));assert.equal(result.valid,true);assert.equal(result.citations,1);
 assert.equal(report.offsetUnit,'JavaScript UTF-16 code units');
});
test('tampered quotation, offsets, title and corpus fail integrity verification',async()=>{
 const report=await W.evidenceBundle('الاستقبال','lexical',P.retrieve('الاستقبال',P.chunkDocuments(docs)),docs);
 for(const patch of [{quote:'معلومة مخترعة'},{start:-1},{end:999},{title:'عنوان مخترع'}]){
  const altered=structuredClone(report);Object.assign(altered.citations[0],patch);await assert.rejects(W.verifyReport(altered,W.create('أصل',docs)));
 }
 const alteredDocs=structuredClone(docs);alteredDocs[0].text+=' تغيير';await assert.rejects(W.verifyReport(report,W.create('أصل',alteredDocs)),/fingerprint/);
});
test('top source selection prevents one long document crowding out other documents',()=>{
 const r=P.uniqueSources([{sourceId:'a',id:'a#1'},{sourceId:'a',id:'a#2'},{sourceId:'b',id:'b#1'},{sourceId:'c',id:'c#1'}]);
 assert.deepEqual(r.map(x=>x.sourceId),['a','b','c']);
});
test('unsupported retrieval modes and overlong queries fail explicitly',()=>{
 assert.throws(()=>P.retrieve('x',[],{mode:'pretend'}));assert.throws(()=>P.retrieve('x'.repeat(2001),[]));assert.throws(()=>P.retrieve(null,[]));
});
test('malformed citation spans never silently coerce into a source match',()=>{
 const d=[{id:'a',text:'text'}];for(const bad of [{start:null,end:4},{start:0,end:'4'},{start:4,end:4},{start:-4,end:4}])assert.throws(()=>P.quote({sourceId:'a',text:'text',...bad},d));
});
test('offline verifier returns success for a real export and failure for a modified one',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'evidence-check-'));
 try{
  const w=path.join(dir,'workspace.json'),r=path.join(dir,'report.json');fs.writeFileSync(w,W.serialize(W.create('أصل',docs)));
  const report=await W.evidenceBundle('الاستقبال','lexical',P.retrieve('الاستقبال',P.chunkDocuments(docs)),docs);fs.writeFileSync(r,JSON.stringify(report));
  const run=()=>spawnSync(process.execPath,['scripts/verify-evidence.cjs',w,r],{encoding:'utf8'});
  assert.equal(run().status,0);report.citations[0].quote='changed';fs.writeFileSync(r,JSON.stringify(report));assert.equal(run().status,1);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('chunk boundaries preserve astral characters such as emoji',()=>{
 const d=[{id:'a',text:'x'.repeat(19)+'🌙'+'y'.repeat(19)+'⭐'+'z'.repeat(30)}];
 for(const c of P.chunkDocuments(d,20,1)){
  assert.ok(!/^[\uDC00-\uDFFF]/.test(c.text));assert.ok(!/[\uD800-\uDBFF]$/.test(c.text));
  assert.equal(P.quote(c,d).quote,d[0].text.slice(c.start,c.end));
 }
});

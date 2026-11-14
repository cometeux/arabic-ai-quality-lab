'use strict';
const $=id=>document.getElementById(id);
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const save=(name,data)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=node('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
const MODEL_INFO={id:'Xenova/multilingual-e5-small',base:'intfloat/multilingual-e5-small',runtime:'@huggingface/transformers@3.8.1',dtype:'q8',device:'wasm',pooling:'mean',normalize:true,prefixes:['query: ','passage: ']};
const DATASETS={challenge:CHALLENGE,original:FIXTURES};
let docs=Evidence.validateDocuments(CHALLENGE.documents),chunks=Evidence.chunkDocuments(docs);
let mode='lexical',extractor=null,vectors=null,lastReport=null,evaluation=null,busy=false;
let activeFixture=CHALLENGE;
const message=s=>$('status').textContent=s;
const storageMessage=s=>$('storageStatus').textContent=s;
function setBusy(value){
  busy=value;$('main').setAttribute('aria-busy',String(value));
  for(const id of ['loadModel','evaluate','importText','reset','file','search','query','customText','loadFixture','fixturePicker','saveLocal','restoreLocal','clearLocal','workspaceDownload','workspaceFile','workspaceName','export','exportEval'])$(id).disabled=value;
  $('evaluate').disabled=value||!activeFixture;$('exportEval').disabled=value||!evaluation;
  document.querySelectorAll('[data-mode],[data-query]').forEach(b=>b.disabled=value);
}
function showCitation(r){
  try{
    const c=Evidence.quote(r,docs),source=docs.find(d=>d.id===c.sourceId);
    $('citeTitle').textContent=c.title;
    $('citeText').replaceChildren(document.createTextNode(source.text.slice(0,c.start)),node('mark',source.text.slice(c.start,c.end)),document.createTextNode(source.text.slice(c.end)));
    $('citeSpan').textContent=c.chunkId+' · الموضع '+c.start+'–'+c.end+' (UTF-16)';
    $('citation').showModal();
  }catch(e){message(e.message);}
}
function display(target,rows){
  target.replaceChildren();const unique=Evidence.uniqueSources(rows,3);
  if(!unique.length){target.append(node('p','ما لقيت كلمات مشتركة. جرّب صياغة ثانية أو البحث بالمعنى.','empty'));return;}
  unique.forEach((r,i)=>{
    const article=node('article',undefined,'result');
    article.append(node('span',String(i+1).padStart(2,'0')+' / '+r.sourceId,'order'),node('h4',r.title),node('p',r.text));
    article.append(node('small',(r.channels?'RRF':'Score')+' '+r.score.toFixed(4)+(r.terms?.length?' · '+r.terms.join('، '):'')));
    const button=node('button','افتح المصدر');button.setAttribute('aria-label','افتح المصدر: '+r.title);button.onclick=()=>showCitation(r);article.append(button);target.append(article);
  });
}
async function queryRank(query){
  let queryVector=null;
  if(mode!=='lexical'){
    if(!extractor||!vectors)throw Error('حمّل النموذج أولًا، أو اختر البحث النصي.');
    queryVector=(await extractor('query: '+query,{pooling:'mean',normalize:true})).tolist()[0];
  }
  return Evidence.retrieve(query,chunks,{mode,vectors,queryVector});
}
async function search(){
  if(busy)return;const query=$('query').value.trim();
  if(!query){message('اكتب سؤالًا أولًا.');$('results').replaceChildren();$('baseline').replaceChildren();lastReport=null;return;}
  setBusy(true);message('أبحث في النصوص…');lastReport=null;const start=performance.now();
  try{
    const rows=await queryRank(query),baseline=Retrieval.rank(query,chunks,false);
    const report=await Workspace.evidenceBundle(query,mode,rows,docs,mode==='lexical'?null:MODEL_INFO);
    report.elapsedMs=Math.round(performance.now()-start);report.appVersion='0.4.0';
    report.baselineIds=Evidence.uniqueSources(baseline,3).map(r=>r.sourceId);
    display($('results'),rows);display($('baseline'),baseline);lastReport=report;
    message('المقاطع: '+chunks.length+' · '+report.elapsedMs+' مللي ثانية · '+(mode==='lexical'?'بحث نصي محلي':'استدلال محلي بالنموذج'));
  }catch(e){message(e.message);$('results').replaceChildren(node('p','تعذر البحث بهذه الطريقة. تقدر ترجع للبحث النصي.','empty'));$('baseline').replaceChildren();}
  finally{setBusy(false);}
}
async function buildVectors(){
  vectors=null;const next=[];
  for(let i=0;i<chunks.length;i++){
    message('تجهيز النصوص '+(i+1)+'/'+chunks.length+'…');
    next.push((await extractor('passage: '+chunks[i].text,{pooling:'mean',normalize:true})).tolist()[0]);
  }
  vectors=next;
}
$('loadModel').onclick=async()=>{
  if(busy)return;setBusy(true);message('تنزيل مكتبة التشغيل والنموذج. قد يستغرق هذا بعض الوقت…');
  try{
    if(!extractor){
      const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
      env.allowLocalModels=false;env.backends.onnx.wasm.numThreads=1;
      extractor=await pipeline('feature-extraction',MODEL_INFO.id,{dtype:'q8',device:'wasm',progress_callback:p=>{if(p.status==='progress')message('تنزيل '+p.file+': '+Math.round(p.progress||0)+'%');}});
    }
    await buildVectors();$('loadModel').textContent='إعادة تجهيز النصوص';message('النموذج جاهز لهذه النصوص. اختر البحث بالمعنى.');
  }catch(e){vectors=null;message('ما اكتمل تجهيز النموذج. البحث النصي ما زال متاحًا. '+String(e.message).slice(0,160));}
  finally{setBusy(false);}
};
$('searchForm').onsubmit=e=>{e.preventDefault();search();};
document.querySelectorAll('[data-query]').forEach(b=>b.onclick=()=>{if(!busy){$('query').value=b.dataset.query;search();}});
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{
  if(busy)return;mode=b.dataset.mode;evaluation=null;$('metrics').textContent='';$('evalRows').replaceChildren();$('exportEval').disabled=true;
  document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));search();
});
$('closeCitation').onclick=()=>$('citation').close();
$('export').onclick=()=>lastReport?save('evidence-search.json',lastReport):message('شغّل البحث أولًا.');
function matchingFixture(documents){
  return Object.values(DATASETS).find(f=>JSON.stringify(Evidence.validateDocuments(f.documents))===JSON.stringify(documents))||null;
}
function renderSources(){
  $('sources').replaceChildren();
  docs.forEach(d=>{const e=node('div',undefined,'source');e.append(node('strong',d.id+' / '+d.title),node('p',d.text));$('sources').append(e);});
  $('sourceCount').textContent='مصادرك ومساحة العمل · المصادر: '+docs.length;
  $('evaluationContext').textContent=activeFixture?activeFixture.cases.length+' حالة مصطنعة معلنة تخص النصوص الحالية. ليست تقييمًا مستقلًا.':'لا توجد تسميات تقييم لهذه النصوص. اختر مجموعة أمثلة لتشغيل تقييم قابل للمقارنة.';
  $('evaluate').disabled=!activeFixture;
}
function replaceDocuments(input,name='مساحة جديدة'){
  // Validate and chunk first: malformed imports cannot destroy current state.
  const next=Evidence.validateDocuments(input),nextChunks=Evidence.chunkDocuments(next);
  docs=next;chunks=nextChunks;vectors=null;lastReport=null;evaluation=null;activeFixture=matchingFixture(next);
  $('workspaceName').value=name;$('metrics').textContent='';$('evalRows').replaceChildren();$('exportEval').disabled=true;
  mode='lexical';document.querySelectorAll('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mode===mode)));
  renderSources();storageMessage('التغييرات الحالية غير محفوظة محليًا. فهرس المعنى يحتاج إعادة تجهيز.');return search();
}
function parseText(text){return text.split(/\n\s*\n/u).filter(s=>s.trim()).map((s,i)=>({id:'custom-'+(i+1),title:'نص '+(i+1),text:s}));}
$('importText').onclick=()=>{if(busy)return;try{replaceDocuments(parseText($('customText').value),'نصوصي');}catch(e){message(e.message);}};
$('reset').onclick=()=>{if(!busy)replaceDocuments(CHALLENGE.documents,'تجربة البحث العربي');};
$('file').onchange=async e=>{
  if(busy)return;const files=Array.from(e.target.files||[]);if(!files.length)return;
  setBusy(true);try{
    if(files.length>60||files.some(f=>f.size>200000))throw Error('اختر حتى 60 ملف TXT، كل ملف أقل من 200 كيلوبايت.');
    const next=await Promise.all(files.map(async(f,i)=>({id:'file-'+(i+1),title:f.name,text:await f.text()})));
    // Release the lock only after all reads; the replacement itself is atomic.
    setBusy(false);await replaceDocuments(next,'مستنداتي');
  }catch(err){message(err.message);}finally{setBusy(false);e.target.value='';}
};
$('workspaceName').oninput=()=>storageMessage('اسم المساحة تغيّر؛ احفظ التغييرات أو نزّل نسخة.');
const currentWorkspace=()=>Workspace.create($('workspaceName').value,docs);
$('workspaceDownload').onclick=()=>{try{save('arabic-workspace.json',currentWorkspace());storageMessage('نُزّلت نسخة المساحة. تشمل النصوص ولا تشمل النموذج أو الفهرس.');}catch(e){storageMessage(e.message);}};
$('workspaceFile').onchange=async e=>{
  if(busy)return;const file=e.target.files?.[0];if(!file)return;setBusy(true);
  try{if(file.size>600000)throw Error('ملف المساحة أكبر من الحد المسموح.');const w=Workspace.parse(await file.text());setBusy(false);await replaceDocuments(w.documents,w.name);}
  catch(err){message(err.message);}finally{setBusy(false);e.target.value='';}
};
$('saveLocal').onclick=async()=>{
  if(busy)return;setBusy(true);
  try{await LocalWorkspace.save(currentWorkspace());storageMessage('حُفظت المساحة على هذا المتصفح. لا يوجد حفظ تلقائي للتعديلات التالية.');}
  catch(e){storageMessage(e.message);}finally{setBusy(false);}
};
$('restoreLocal').onclick=async()=>{
  if(busy)return;setBusy(true);
  try{const w=await LocalWorkspace.load();if(!w){storageMessage('ما فيه نسخة محفوظة على هذا المتصفح.');return;}setBusy(false);await replaceDocuments(w.documents,w.name);storageMessage('استُعيدت النسخة المحلية. تغييرات النموذج والفهرس لا تُحفظ.');}
  catch(e){storageMessage(e.message);}finally{setBusy(false);}
};
$('clearLocal').onclick=async()=>{
  if(busy)return;setBusy(true);
  try{await LocalWorkspace.clear();storageMessage('حُذفت النسخة المحلية. النصوص المفتوحة حاليًا ما زالت موجودة.');}
  catch(e){storageMessage(e.message);}finally{setBusy(false);}
};
$('loadFixture').onclick=()=>{if(!busy){const f=DATASETS[$('fixturePicker').value];replaceDocuments(f.documents,f===CHALLENGE?'تجربة البحث العربي':'أمثلة التهجئة');}};
$('evaluate').onclick=async()=>{
  if(busy||!activeFixture)return;setBusy(true);evaluation=null;const out=[];
  try{
    for(const [i,c]of activeFixture.cases.entries()){
      message('مراجعة الحالة '+(i+1)+'/'+activeFixture.cases.length+'…');
      const current=await queryRank(c.query),baseline=Retrieval.rank(c.query,chunks,false),relevant=c.relevant_source_ids||c.relevant_ids;
      out.push({id:c.id,query:c.query,category:c.category,relevant_source_ids:relevant,labelRelation:c.claim_relation||'legacy-label',
        baseline:RetrievalMetrics.scoreRanking(baseline,relevant),current:RetrievalMetrics.scoreRanking(current,relevant)});
    }
    const summary=key=>RetrievalMetrics.summarize(out.map(r=>({...r,...r[key]})));
    evaluation={schema:'arabic-retrieval-evaluation',version:1,appVersion:'0.4.0',fixture:activeFixture.version,mode,
      model:mode==='lexical'?null:MODEL_INFO,corpusSha256:await Workspace.fingerprint(docs),
      fixtureSha256:await Workspace.digest(JSON.stringify(activeFixture)),fixtureHashFormat:'JSON.stringify of the bundled object; differs from the CLI raw-file-byte hash',
      scope:'Visible synthetic diagnostic; labels are AI-assisted, not independent or held-out. Source relevance is separate from claim support.',baseline:summary('baseline'),current:summary('current'),rows:out};
    const pct=n=>n===null?'—':(100*n).toFixed(1)+'%';const m=evaluation.current;
    $('metrics').textContent='Hit@3 '+pct(m.hitAtK)+' · Recall@3 '+pct(m.recallAtK)+' · MRR '+(m.mrr??0).toFixed(3)+' · nDCG@3 '+(m.ndcgAtK??0).toFixed(3)+' · أسئلة بلا مصدر إجابة أعادت نصوصًا '+m.unrelatedWithResults+'/'+m.unrelated;
    $('evalRows').replaceChildren();
    out.forEach(r=>{const tr=node('tr');[r.query,r.relevant_source_ids.join(', ')||'المعلومة غير موجودة',r.baseline.top_ids[0]||'—',r.current.top_ids[0]||'—',r.labelRelation==='contradicted'?'الادعاء يناقض المصدر':r.labelRelation==='not_established'?'المعلومة غير مثبتة':'—'].forEach(t=>tr.append(node('td',t)));$('evalRows').append(tr);});
    message('اكتمل التقييم. عمود الادعاء تسمية مسبقة في الأمثلة، وليس حكمًا استنتجه النموذج.');
  }catch(e){message(e.message);}finally{setBusy(false);}
};
$('exportEval').onclick=()=>evaluation&&save('retrieval-evaluation.json',evaluation);
renderSources();search();

(function(root){
  'use strict';
  const P=typeof module==='undefined'?root.Evidence:require('./pipeline.js');
  const MAX_JSON=600000;
  function validate(input){
    if(!input||input.schema!=='arabic-evidence-workspace'||input.version!==1)throw Error('ملف مساحة العمل غير معروف أو إصداره غير مدعوم.');
    if(typeof input.name!=='string'||!input.name.trim()||input.name.length>80)throw Error('اسم المساحة يجب أن يكون من 1 إلى 80 حرفًا.');
    return {schema:'arabic-evidence-workspace',version:1,name:input.name.trim(),documents:P.validateDocuments(input.documents)};
  }
  function create(name,documents){return validate({schema:'arabic-evidence-workspace',version:1,name,documents});}
  function parse(json){if(typeof json!=='string'||json.length>MAX_JSON)throw Error('ملف مساحة العمل أكبر من الحد المسموح.');let x;try{x=JSON.parse(json);}catch{throw Error('تعذر قراءة JSON. لم تتغير النصوص الحالية.');}return validate(x);}
  function serialize(workspace){return JSON.stringify(validate(workspace),null,2);}
  async function digest(text){
    if(!globalThis.crypto?.subtle)throw Error('البصمة تحتاج متصفحًا يدعم Web Crypto في سياق آمن.');
    const bytes=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
    return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');
  }
  async function fingerprint(documents){return digest(JSON.stringify(P.validateDocuments(documents)));}
  async function evidenceBundle(query,mode,rows,documents,model=null){
    const docs=P.validateDocuments(documents);
    return {schema:'arabic-evidence-report',version:1,query,mode,model,
      corpusSha256:await fingerprint(docs),offsetUnit:'JavaScript UTF-16 code units',
      citations:P.uniqueSources(rows,3).map(r=>P.quote(r,docs)),
      limitation:'Retrieved passages only; neither similarity nor a matching source proves a claim.'};
  }
  async function verifyReport(report,workspace){
    const w=validate(workspace);
    if(!report||report.schema!=='arabic-evidence-report'||report.version!==1||!Array.isArray(report.citations)||report.citations.length>3)throw Error('Unknown evidence report');
    if(report.corpusSha256!==await fingerprint(w.documents))throw Error('Corpus fingerprint mismatch');
    for(const c of report.citations){
      const checked=P.quote({sourceId:c.sourceId,id:c.chunkId,text:c.quote,start:c.start,end:c.end},w.documents);
      if(c.title!==checked.title)throw Error('Source title mismatch');
    }
    return {valid:true,citations:report.citations.length,scope:'Source-text integrity only, not claim support or author authenticity'};
  }
  const api={validate,create,parse,serialize,digest,fingerprint,evidenceBundle,verifyReport};
  if(typeof module!=='undefined')module.exports=api;root.Workspace=api;
})(typeof window==='undefined'?globalThis:window);

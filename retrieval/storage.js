(function(root){
  'use strict';
  // A single optional local snapshot. No auto-save and no remote storage.
  const W=typeof module==='undefined'?root.Workspace:require('./workspace.js');
  function open(){return new Promise((resolve,reject)=>{
    if(!root.indexedDB){reject(Error('الحفظ المحلي غير متاح. نزّل نسخة JSON بدلًا منه.'));return;}
    const request=root.indexedDB.open('deema-arabic-evidence',1);
    let settled=false;
    const timer=setTimeout(()=>{settled=true;reject(Error('تعذر فتح الحفظ المحلي. نزّل نسخة JSON.'));},8000);
    request.onupgradeneeded=()=>request.result.createObjectStore('snapshots');
    request.onerror=()=>{clearTimeout(timer);reject(Error('تعذر فتح الحفظ المحلي. نزّل نسخة JSON.'));};
    request.onblocked=()=>{clearTimeout(timer);settled=true;reject(Error('أغلق النسخ الأخرى من الأداة وأعد المحاولة.'));};
    request.onsuccess=()=>{clearTimeout(timer);const db=request.result;if(settled){db.close();return;}db.onversionchange=()=>db.close();resolve(db);};
  });}
  async function transact(mode,action){
    const db=await open();
    try{return await new Promise((resolve,reject)=>{
      const tx=db.transaction('snapshots',mode);let value;
      const request=action(tx.objectStore('snapshots'));
      request.onsuccess=()=>{value=request.result;};
      tx.oncomplete=()=>resolve(value);
      tx.onabort=tx.onerror=()=>reject(Error('لم يكتمل الحفظ المحلي. النسخة الحالية في الصفحة لم تتغير.'));
    });}finally{db.close();}
  }
  async function save(workspace){const json=W.serialize(workspace);await transact('readwrite',s=>s.put(json,'current'));}
  async function load(){const json=await transact('readonly',s=>s.get('current'));return json?W.parse(json):null;}
  async function clear(){await transact('readwrite',s=>s.delete('current'));}
  const api={save,load,clear};if(typeof module!=='undefined')module.exports=api;root.LocalWorkspace=api;
})(typeof window==='undefined'?globalThis:window);

const test=require('node:test');const assert=require('node:assert/strict');const f=require('../retrieval/challenge.json');
test('challenge labels refer to real sources and case IDs are unique',()=>{
 const ids=new Set(f.documents.map(x=>x.id));assert.equal(ids.size,f.documents.length);
 assert.equal(new Set(f.cases.map(x=>x.id)).size,f.cases.length);
 for(const c of f.cases)for(const id of c.relevant_source_ids)assert.ok(ids.has(id),c.id+': '+id);
});
test('contradictions retain relevant checking sources separately from truth labels',()=>{
 const rows=f.cases.filter(x=>x.category==='contradictory_claim');assert.equal(rows.length,8);
 for(const c of rows){assert.equal(c.claim_relation,'contradicted');assert.ok(c.relevant_source_ids.length);}
 assert.equal(f.cases.filter(x=>x.category==='missing_information').length,8);
});

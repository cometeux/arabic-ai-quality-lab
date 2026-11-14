const fs=require('node:fs');const crypto=require('node:crypto');
const R=require('../retrieval/engine.js');const {scoreRanking,summarize}=require('../retrieval/metrics.cjs');
const bytes=fs.readFileSync('retrieval/challenge.json');const f=JSON.parse(bytes);
const methods={raw:q=>R.rank(q,f.documents,false),normalized:q=>R.rank(q,f.documents,true)};
const report={fixtureVersion:f.version,fixtureSha256:crypto.createHash('sha256').update(bytes).digest('hex'),k:3,
 scope:f.provenance,labelPolicy:f.label_policy,methods:{}};
for(const [name,rank]of Object.entries(methods)){
 const rows=f.cases.map(c=>({...c,...scoreRanking(rank(c.query),c.relevant_source_ids,3)}));
 report.methods[name]={summary:summarize(rows),byCategory:Object.fromEntries([...new Set(rows.map(r=>r.category))].map(c=>[c,summarize(rows.filter(r=>r.category===c))])),rows};
}
fs.writeFileSync('evaluation-challenge.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.methods).map(([n,r])=>[n,{summary:r.summary,byCategory:r.byCategory}])),null,2));

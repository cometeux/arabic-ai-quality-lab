const fs=require('node:fs');const R=require('../retrieval/engine.js');const f=require('../retrieval/fixtures.json');
const report={fixtureVersion:f.version,scope:'Small synthetic development fixture; no held-out evaluation',baseline:R.evaluate(f.documents,f.cases,false),normalized:R.evaluate(f.documents,f.cases,true)};
for(const x of [report.baseline,report.normalized])delete x.rows;
fs.writeFileSync('evaluation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));

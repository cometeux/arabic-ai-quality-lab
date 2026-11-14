const test=require('node:test');const assert=require('node:assert/strict');
const {scoreRanking, summarize}=require('../retrieval/metrics.cjs');const P=require('../retrieval/pipeline.js');
test('duplicate chunks do not inflate source recall or consume source ranks',()=>{
 const r=scoreRanking([{sourceId:'a'},{sourceId:'a'},{sourceId:'b'}],['a','b'],2);
 assert.deepEqual(r.top_ids,['a','b']);assert.equal(r.recallAtK,1);assert.equal(r.ndcgAtK,1);
});
test('recall distinguishes one relevant source from all relevant sources',()=>{
 const r=scoreRanking([{id:'wrong'},{id:'a'}],['a','b'],2);
 assert.equal(r.hit,true);assert.equal(r.recallAtK,.5);assert.equal(r.reciprocalRank,.5);
 assert.ok(r.ndcgAtK>0&&r.ndcgAtK<1);
});
test('unrelated questions are excluded from relevance averages',()=>{
 const rows=[{relevant_source_ids:['a'],...scoreRanking([{id:'a'}],['a'])},
 {relevant_source_ids:[],...scoreRanking([{id:'b'}],[])}];
 const s=summarize(rows);assert.equal(s.hitAtK,1);assert.equal(s.unrelatedWithResults,1);
});
test('empty labels and empty result sets have defined metrics',()=>{
 assert.equal(scoreRanking([],[]).hit,null);assert.equal(scoreRanking([],['a']).recallAtK,0);
 assert.equal(summarize([]).mrr,null);assert.throws(()=>scoreRanking([],[],0));
});
test('original whitespace survives ingestion and citation export',()=>{
 const text='  إجازة\nمتاحة.  ';const docs=P.validateDocuments([{id:'a',text}]);
 const c=P.chunkDocuments(docs)[0];assert.equal(docs[0].text,text);
 assert.equal(P.quote(c,docs).quote,text);assert.equal(c.start,0);assert.equal(c.end,text.length);
});
test('fractional overlap is rejected before indexing',()=>assert.throws(()=>P.chunkDocuments([],30,1.5)));

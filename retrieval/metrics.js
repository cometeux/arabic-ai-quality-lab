(function(root){
'use strict';
// Source relevance and claim support are deliberately separate labels.
function scoreRanking(results, relevantIds, k=3) {
  if (!Number.isInteger(k) || k < 1) throw Error('k must be a positive integer');
  const expected = new Set(relevantIds);
  const ids = [...new Set(results.map(r => r.sourceId || r.id))];
  const top = ids.slice(0,k);
  const found = top.filter(id => expected.has(id)).length;
  const first = ids.findIndex(id => expected.has(id));
  const ideal = Array.from({length: Math.min(k,expected.size)}, (_,i) => 1/Math.log2(i+2)).reduce((a,b)=>a+b,0);
  const dcg = top.reduce((n,id,i)=>n+(expected.has(id)?1/Math.log2(i+2):0),0);
  return {top_ids:top,hit:expected.size ? found>0 : null,
    recallAtK:expected.size ? found/expected.size : null,
    reciprocalRank:expected.size && first>=0 ? 1/(first+1) : 0,
    ndcgAtK:expected.size ? dcg/ideal : null,returned:ids.length>0};
}
function summarize(rows) {
  const relevant=rows.filter(r=>r.relevant_source_ids.length);
  const unrelated=rows.filter(r=>!r.relevant_source_ids.length);
  const mean=key=>relevant.length?relevant.reduce((n,r)=>n+Number(r[key]),0)/relevant.length:null;
  return {cases:rows.length,withRelevantSources:relevant.length,hitAtK:mean('hit'),
    recallAtK:mean('recallAtK'),mrr:mean('reciprocalRank'),ndcgAtK:mean('ndcgAtK'),
    unrelated:unrelated.length,unrelatedWithResults:unrelated.filter(r=>r.returned).length};
}
const api={scoreRanking,summarize};if(typeof module!=='undefined')module.exports=api;root.RetrievalMetrics=api;
})(typeof window==='undefined'?globalThis:window);

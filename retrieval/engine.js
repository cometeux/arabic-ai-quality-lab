(function(root){
  'use strict';
  function tokens(text, normalized=true){
    let s=String(text).normalize('NFKC').toLowerCase();
    if(normalized) s=s.replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي');
    return s.match(/[\p{L}\p{N}\p{M}]+/gu)||[];
  }
  function rank(query,docs,normalized=true){
    const corpus=docs.map(d=>tokens(d.text,normalized));
    const q=[...new Set(tokens(query,normalized))];
    const avg=corpus.reduce((n,t)=>n+t.length,0)/(corpus.length||1);
    return docs.map((d,i)=>{
      let score=0; const terms=[];
      for(const term of q){
        const tf=corpus[i].filter(t=>t===term).length;
        if(!tf)continue;
        const df=corpus.filter(t=>t.includes(term)).length;
        const idf=Math.log(1+(docs.length-df+0.5)/(df+0.5));
        score+=idf*(tf*2.2)/(tf+1.2*(0.25+0.75*corpus[i].length/(avg||1)));
        terms.push(term);
      }
      return {...d,score,terms};
    }).filter(d=>d.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  }
  function evaluate(docs,cases,normalized=true,k=3){
    const rows=cases.map(c=>{
      const results=rank(c.query,docs,normalized);
      const relevant=c.relevant_ids||[];
      const pos=results.findIndex(d=>relevant.includes(d.id));
      return {...c,top_ids:results.slice(0,k).map(d=>d.id),hit:relevant.length?pos>=0&&pos<k:null,rr:relevant.length&&pos>=0?1/(pos+1):0,returned:results.length>0};
    });
    const answerable=rows.filter(r=>r.relevant_ids.length);
    const unanswerable=rows.filter(r=>!r.relevant_ids.length);
    return {k,answerable:answerable.length,hitAtK:answerable.length?answerable.filter(r=>r.hit).length/answerable.length:null,mrr:answerable.length?answerable.reduce((n,r)=>n+r.rr,0)/answerable.length:null,unanswerable:unanswerable.length,unanswerableWithResults:unanswerable.filter(r=>r.returned).length,rows};
  }
  const api={tokens,rank,evaluate};
  if(typeof module!=='undefined')module.exports=api;
  root.Retrieval=api;
})(typeof window==='undefined'?globalThis:window);

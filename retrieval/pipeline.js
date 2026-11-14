(function(root){
'use strict';
const R=typeof module==='undefined'?root.Retrieval:require('./engine.js');
function validateDocuments(input){
if(!Array.isArray(input)||!input.length||input.length>60)throw Error('أضيفي من 1 إلى 60 نصًا.');
const seen=new Set();let total=0;
return input.map((x,i)=>{
if(!x||typeof x.text!=='string'||!x.text.trim())throw Error('كل مصدر يحتاج إلى نص.');
const id=String(x.id||`source-${i+1}`).slice(0,80);
if(seen.has(id))throw Error('معرّفات المصادر مكررة.');seen.add(id);
total+=x.text.length;if(total>80000)throw Error('حجم النصوص يتجاوز 80 ألف حرف.');
return {id,title:String(x.title||`نص ${i+1}`).slice(0,160),text:x.text};
});}
function chunkDocuments(docs,size=500,overlap=80){
if(!Number.isInteger(size)||size<20||!Number.isInteger(overlap)||overlap<0||overlap>=size)throw Error('Invalid chunk settings');
return docs.flatMap(d=>{const chunks=[];let start=0,n=1;while(start<d.text.length){const end=Math.min(start+size,d.text.length);chunks.push({id:`${d.id}#${n++}`,sourceId:d.id,title:d.title,text:d.text.slice(start,end),start,end});if(end===d.text.length)break;start=end-overlap;}return chunks;});}
function cosine(a,b){if(!a||!b||a.length!==b.length||!a.length)throw Error('Embedding dimensions do not match');let dot=0,aa=0,bb=0;for(let i=0;i<a.length;i++){if(!Number.isFinite(a[i])||!Number.isFinite(b[i]))throw Error('Non-finite embedding');dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}return aa&&bb?dot/Math.sqrt(aa*bb):0;}
function semanticRank(queryVector,vectors,chunks){if(vectors.length!==chunks.length)throw Error('Index and corpus do not match');return chunks.map((c,i)=>({...c,score:cosine(queryVector,vectors[i]),terms:[]})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));}
function fuse(lexical,semantic,k=60){const scores=new Map();for(const [channel,list]of [['lexical',lexical],['semantic',semantic]])list.slice(0,20).forEach((x,i)=>{let r=scores.get(x.id);if(!r){r={...x,score:0,channels:[]};scores.set(x.id,r);}r.score+=1/(k+i+1);r.channels.push(channel);});return [...scores.values()].sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));}
function retrieve(query,chunks,{vectors=null,queryVector=null,mode='lexical'}={}){if(!query.trim())return [];const lex=R.rank(query,chunks,true);if(mode==='lexical')return lex;if(!vectors||!queryVector)throw Error('Semantic model is not ready');const sem=semanticRank(queryVector,vectors,chunks);return mode==='semantic'?sem:fuse(lex,sem);}
function quote(result,docs){const d=docs.find(x=>x.id===result.sourceId);if(!d||d.text.slice(result.start,result.end)!==result.text)throw Error('Citation does not match source');return {sourceId:d.id,chunkId:result.id,title:d.title,quote:result.text,start:result.start,end:result.end};}
const api={validateDocuments,chunkDocuments,cosine,semanticRank,fuse,retrieve,quote};if(typeof module!=='undefined')module.exports=api;root.Evidence=api;
})(typeof window==='undefined'?globalThis:window);

const fs=require('node:fs');const W=require('../retrieval/workspace.js');
async function main(){
 const [workspacePath,reportPath]=process.argv.slice(2);
 if(!workspacePath||!reportPath)throw Error('Usage: node scripts/verify-evidence.cjs workspace.json evidence-search.json');
 const workspace=W.parse(fs.readFileSync(workspacePath,'utf8'));
 const report=JSON.parse(fs.readFileSync(reportPath,'utf8'));
 console.log(JSON.stringify(await W.verifyReport(report,workspace),null,2));
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});

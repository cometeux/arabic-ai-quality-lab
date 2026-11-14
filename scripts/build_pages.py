"""Build the standalone pages from readable UI sources."""
from pathlib import Path
p=Path(__file__).resolve().parents[1]
for app in ["retrieval","actions"]:
    engine=(p/app/"engine.js").read_text()
    if app=="retrieval":
        for part in ["pipeline.js","workspace.js","storage.js","metrics.js","data.js"]:
            engine+=(p/app/part).read_text()+"\n"
        import json
        engine+="const CHALLENGE="+json.dumps(json.loads((p/app/"challenge.json").read_text()),ensure_ascii=False)+";\n"
    template=(p/"ui"/f"{app}.html").read_text()
    result=template.replace("/* ENGINES */",engine).replace("/* APP */",(p/"ui"/f"{app}-app.js").read_text())
    (p/app/"index.html").write_text(result)

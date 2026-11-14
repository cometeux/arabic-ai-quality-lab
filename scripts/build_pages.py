"""Build the standalone pages from readable UI sources."""
from pathlib import Path
p=Path(__file__).resolve().parents[1]
for app in ["retrieval","actions"]:
    engine=(p/app/"engine.js").read_text()
    if app=="retrieval":
        engine+=(p/app/"pipeline.js").read_text()+(p/app/"data.js").read_text()
    template=(p/"ui"/f"{app}.html").read_text()
    result=template.replace("/* ENGINES */",engine).replace("/* APP */",(p/"ui"/f"{app}-app.js").read_text())
    (p/app/"index.html").write_text(result)

# Arma la versión demo: misma app + datos de ejemplo en memoria.
import sys
link = sys.argv[1] if len(sys.argv) > 1 else ""
app = open("hecho-en-mi-pueblo.html", encoding="utf-8").read()
data = open("demo-data.js", encoding="utf-8").read().replace("__DEMO_LINK__", link)
app = app.replace("<title>Hecho en mi Pueblo · Servicio</title>", "", 1)
out = "<title>Hecho en mi Pueblo · Demo</title>\n<script>\n" + data + "\n</script>\n" + app
open("hecho-en-mi-pueblo-demo.html", "w", encoding="utf-8").write(out)
print("ok", len(out))

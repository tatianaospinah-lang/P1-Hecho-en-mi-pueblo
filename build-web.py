# Arma la carpeta "web" lista para subir a un servidor, y el .zip.
import os, re, shutil, zipfile
FB = "10.12.2"
HEAD = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="Hecho en mi Pueblo · Antojos colombianos y cafetería. Pide a domicilio o desde tu mesa.">
<meta property="og:title" content="Hecho en mi Pueblo">
<meta property="og:description" content="Antojos colombianos y café de origen. Pide a domicilio por WhatsApp.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#341709">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23341709'/%3E%3Ctext x='32' y='41' font-size='26' text-anchor='middle' fill='%23F6E9DA' font-family='Georgia' font-weight='bold'%3EH%3C/text%3E%3C/svg%3E">
<style>:root{{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0;font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
{extra}
</head>
<body>
"""
def body(src):
    s = open(src, encoding="utf-8").read()
    s = re.sub(r"<title>.*?</title>\n?", "", s, count=1)
    s = re.sub(r'<meta name="claude:viewport-fit-sides"[^>]*>\n?', "", s, count=1)
    return s
os.makedirs("web", exist_ok=True)
fb = "\n".join('<script src="https://www.gstatic.com/firebasejs/%s/firebase-%s-compat.js"></script>' % (FB, m) for m in ("app", "auth", "firestore"))
extra = '<script src="config.js"></script>\n' + fb + '\n<script src="hmp-host.js"></script>'
open("web/index.html", "w", encoding="utf-8").write(HEAD.format(title="Hecho en mi Pueblo", extra=extra) + body("hecho-en-mi-pueblo.html") + "\n</body>\n</html>\n")
demo = body("hecho-en-mi-pueblo-demo.html")
open("web/demo.html", "w", encoding="utf-8").write(HEAD.format(title="Hecho en mi Pueblo · Demo", extra="") + demo + "\n</body>\n</html>\n")
for f in ("config.js", "hmp-host.js", "firestore.rules"):
    shutil.copy(os.path.join("web-src", f), os.path.join("web", f))
if os.path.exists("web-src/LEEME.md"): shutil.copy("web-src/LEEME.md", "web/LEEME.md")
z = "hecho-en-mi-pueblo-web.zip"
with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
    for f in sorted(os.listdir("web")):
        zf.write(os.path.join("web", f), "hecho-en-mi-pueblo-web/" + f)
# Demo para GitHub Pages (carpeta docs/)
os.makedirs("docs", exist_ok=True)
shutil.copy("web/demo.html", "docs/index.html")
open("docs/.nojekyll", "w").close()
print("ok", sorted(os.listdir("web")))

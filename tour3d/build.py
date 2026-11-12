#!/usr/bin/env python3
"""Builds the 3D tour of the house from tour3d/ into one self-contained HTML file.

    python3 tour3d/build.py            write public/3d/index.html (what the site serves at /3d)
    python3 tour3d/build.py --check    exit 1 when public/3d/index.html is not what the sources build
    python3 tour3d/build.py --light    write tour3d/dist/ilbuco-3d-light.html: under 2 MiB, lighter
                                       photos, no walk-through video (for hosts that block media files)

Standard library only. Details: tour3d/README.md.
"""
import base64, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SITE = HERE.parent / "public" / "3d" / "index.html"
LIGHT = HERE / "dist" / "ilbuco-3d-light.html"
LIGHT_LIMIT = 2 * 1024 * 1024


def read(rel):
    return (HERE / rel).read_text(encoding="utf-8")


def photos(folder):
    """`const PH={"key":"data:image/jpeg;base64,…"}` from NN-key.jpg files, in file-name order."""
    files = sorted((HERE / folder).glob("*.jpg"))
    assert files, f"no photos in {folder}"
    items = ",".join(
        '"%s":"data:image/jpeg;base64,%s"' % (f.stem.split("-", 1)[1], base64.b64encode(f.read_bytes()).decode())
        for f in files
    )
    return "const PH={" + items + "};\n"


def site():
    model = read("src/scene.js") + photos("photos") + read("src/i18n.js") + read("src/app.js")
    return (
        read("src/head.html") + "<script>\n" + read("vendor/three.min.js") + "</script><script>\n"
        + read("vendor/OrbitControls.js") + "</script><script>\n" + model + "</script></body></html>\n"
    )


def swap(text, old, new):
    assert text.count(old) == 1, f"expected exactly one {old!r}"
    return text.replace(old, new)


def strip(js):
    """Drops whole-line comments; code lines stay untouched."""
    return "\n".join(line for line in js.split("\n") if not re.match(r"^\s*//", line))


def light():
    head = swap(read("src/head.html"), "Video y fotos", "Fotos")
    head = re.sub(r'<link rel="(?:canonical|alternate)"[^>]*>\n?', "", head)  # the copy is not a page of the site
    model = "\n".join([strip(read("src/scene.js")), photos("photos-light"), strip(read("src/i18n.js")), strip(read("src/app.js"))])
    key = "  'Video y fotos': ["
    model = swap(model, key, "  'Fotos': ['Photos', 'Fotos', 'Фото'],\n" + key)
    return (
        head + "<script>window.NOVID=1</script><script>" + read("vendor/three.min.js") + "</script><script>"
        + read("vendor/OrbitControls.js") + "</script><script>" + model + "</script></body></html>"
    )


def main(argv):
    if "--check" in argv:
        if SITE.read_text(encoding="utf-8") != site():
            print("public/3d/index.html differs from what tour3d/ builds: run python3 tour3d/build.py", file=sys.stderr)
            return 1
        print("public/3d/index.html matches tour3d/")
        return 0
    if "--light" in argv:
        html = light()
        size = len(html.encode("utf-8"))
        if size > LIGHT_LIMIT:
            print(f"light copy is {size} bytes, over {LIGHT_LIMIT}", file=sys.stderr)
            return 1
        LIGHT.parent.mkdir(exist_ok=True)
        LIGHT.write_text(html, encoding="utf-8")
        print(f"{LIGHT.relative_to(HERE.parent)}: {size} bytes")
        return 0
    html = site()
    SITE.write_text(html, encoding="utf-8")
    print(f"{SITE.relative_to(HERE.parent)}: {len(html.encode('utf-8'))} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

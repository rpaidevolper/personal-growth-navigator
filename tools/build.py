"""把 data/*.json 注入 output/個人成長導航系統.html 的 DATA 區塊。

用法：
  python tools/build.py          驗證資料並更新 HTML
  python tools/build.py --check  只檢查，HTML 與 data/ 不一致或資料有錯時回傳 1（給 CI / PR 用）

HTML 維持單一檔案、離線可用；data/ 是唯一的資料來源，不要直接改 HTML 裡的 DATA 區塊。
"""
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(ROOT, "output", "個人成長導航系統.html")
DATA_DIR = os.path.join(ROOT, "data")
FILES = ["frameworks", "recommendations", "rolemodels", "templates", "site"]
BEGIN = "/*@@DATA-BEGIN"
END = "/*@@DATA-END*/"
TYPES = {"c", "s", "a", "o"}


def load():
    data = {}
    for name in FILES:
        with io.open(os.path.join(DATA_DIR, name + ".json"), encoding="utf-8") as f:
            data[name] = json.load(f)
    return data


def validate(d):
    """回傳錯誤清單；空清單代表通過。"""
    err = []
    fw = d["frameworks"]
    core_ids = [c["id"] for c in fw["core"]]
    for c in fw["core"]:
        if len(c.get("lvd", [])) != 5:
            err.append("core.%s：lvd 必須剛好 5 級" % c["id"])
    track_comp_ids = {}
    for fid, f in fw["frameworks"].items():
        for k in ("source", "contributor", "updated"):
            if not f.get(k):
                err.append("frameworks.%s：缺少 %s 欄位" % (fid, k))
        comps = f["comps"] if f.get("full") else fw["core"] + f["comps"]
        ids = [c["id"] for c in comps]
        track_comp_ids[fid] = set(ids)
        if len(ids) != len(set(ids)):
            err.append("frameworks.%s：能力 id 重複" % fid)
        for c in f["comps"]:
            if len(c.get("lvd", [])) != 5:
                err.append("frameworks.%s.%s：lvd 必須剛好 5 級" % (fid, c["id"]))
        for rn, r in f["roles"].items():
            missing = [i for i in ids if i not in r["tgt"]]
            if missing:
                err.append("frameworks.%s 角色「%s」缺少目標等級：%s" % (fid, rn, ",".join(missing)))
            bad = [k for k, v in r["tgt"].items() if not (isinstance(v, int) and 1 <= v <= 5)]
            if bad:
                err.append("frameworks.%s 角色「%s」目標等級需為 1–5：%s" % (fid, rn, ",".join(bad)))
    rec = d["recommendations"]
    ids = set()
    for it in rec["catalog"]:
        if it["type"] not in TYPES:
            err.append("catalog.%s：type 必須是 c/s/a/o" % it["id"])
        ids.add(it["id"])
    for track, items in rec["byTrack"].items():
        if track not in track_comp_ids:
            err.append("byTrack.%s：沒有對應的框架" % track)
            continue
        for it in items:
            if it["id"] in ids:
                err.append("byTrack.%s.%s：id 重複" % (track, it["id"]))
            ids.add(it["id"])
            bad = [k for k in it["comps"] if k not in track_comp_ids[track]]
            if bad:
                err.append("byTrack.%s.%s：能力 id 不在框架中：%s" % (track, it["id"], ",".join(bad)))
    rm = d["rolemodels"]
    dims = set(rm["dimensions"].keys())
    for fid, m in rm["traitMap"].items():
        if fid in track_comp_ids:
            bad = [v for v in m.values() if v not in track_comp_ids[fid]]
            if bad:
                err.append("traitMap.%s：對應到不存在的能力：%s" % (fid, ",".join(sorted(set(bad)))))
    for p in rm["people"]:
        if not p.get("source"):
            err.append("people.%s：缺少 source（請註明資料來源）" % p["id"])
        bad = [k for k in p["w"] if k not in dims]
        if bad:
            err.append("people.%s：未知的特質維度：%s" % (p["id"], ",".join(bad)))
        if any(v not in (1, 2) for v in p["w"].values()):
            err.append("people.%s：加權只能是 1 或 2" % p["id"])
    site = d["site"]
    for k in ("copyright", "license", "contrib"):
        if not site.get(k):
            err.append("site.json：缺少 %s" % k)
    if site.get("contrib") and not (site["contrib"].get("consent") and site["contrib"].get("declaration")):
        err.append("site.json：contrib 需要 consent 與 declaration 文字")
    url = (site.get("contrib") or {}).get("formUrl", "")
    if url and not url.startswith("https://"):
        err.append("site.json：contrib.formUrl 必須是 https 網址")
    # 組織內語境（主管、跨部門）要有獨立專家版本 tx / dx（#14）
    org = ("主管", "跨部門")
    for it in rec["catalog"] + [x for v in rec["byTrack"].values() for x in v]:
        if any(w in it["t"] + it.get("d", "") for w in org) and not (it.get("tx") or it.get("dx")):
            err.append("推薦 %s：含「主管／跨部門」，需提供獨立專家版本 tx 或 dx" % it["id"])
    for t, steps in d["templates"]["steps"].items():
        for st in steps:
            if any(w in st[0] for w in org) and len(st) < 3:
                err.append("templates.steps.%s「%s」：含組織語境，需提供第 3 欄的獨立專家版本" % (t, st[0]))
    for t, steps in d["templates"]["steps"].items():
        if t not in TYPES:
            err.append("templates.steps.%s：type 必須是 c/s/a/o" % t)
        if not steps:
            err.append("templates.steps.%s：至少要有一步" % t)
    return err


def render_block(d):
    lines = [json.dumps(n, ensure_ascii=False) + ":" + json.dumps(d[n], ensure_ascii=False, separators=(",", ":")) for n in FILES]
    return "const DATA={\n" + ",\n".join(lines) + "\n};\n"


def main():
    check = "--check" in sys.argv
    d = load()
    errors = validate(d)
    if errors:
        print("資料驗證失敗：")
        for e in errors:
            print("  - " + e)
        return 1
    with io.open(HTML, encoding="utf-8") as f:
        html = f.read()
    m = re.search(re.escape(BEGIN) + r"[^\n]*\*/\n(.*?)" + re.escape(END), html, re.S)
    if not m:
        print("找不到 HTML 中的 DATA 區塊標記")
        return 1
    block = render_block(d)
    if m.group(1) == block:
        print("HTML 已是最新")
        return 0
    if check:
        print("HTML 與 data/ 不一致，請執行 python tools/build.py")
        return 1
    html = html[: m.start(1)] + block + html[m.end(1):]
    with io.open(HTML, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("已更新 HTML（%d 字元）" % len(block))
    return 0


if __name__ == "__main__":
    sys.exit(main())

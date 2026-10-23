# data/ — 框架資料（唯一資料來源）

`output/個人成長導航系統.html` 裡的 `DATA` 區塊是由這個資料夾產生的。**要改能力框架、推薦、role model、模板，請改這裡的 JSON，不要改 HTML。**

```bash
python tools/build.py            # 驗證資料並更新 HTML
python tools/build.py --check    # 只檢查（資料有錯或 HTML 沒同步時回傳 1）
```

HTML 仍是單一檔案、可離線使用；`build.py` 只是把 JSON 注入 HTML 的 `/*@@DATA-BEGIN … @@DATA-END*/` 之間。

## 檔案

| 檔案 | 內容 | 主要欄位 |
|---|---|---|
| `frameworks.json` | 能力框架 | `core`（4 項共通核心）、`tracks`、`stages`、`frameworks.{tech,biz,ops,pro,creative,automation}` |
| `recommendations.json` | 推薦目錄 | `catalog`（舊 14 項 id 的通用目錄，tech / automation 用）、`byTrack.{biz,ops,pro,creative}`、`catalogMap` |
| `rolemodels.json` | Role model | `note`（免責）、`dimensions`（11 個特質維度）、`traitMap.{框架}`（維度 → 能力 id）、`people` |
| `site.json` | 網站設定 | `copyright`、`license`、`repo`、`contrib.{formUrl,entryId,consent,declaration}`（投稿表單網址與同意文字） |
| `templates.json` | 模板 | `steps.{c,s,a,o}`（起步清單 `[步驟, 時數權重]`）、`oppScenes`（機會型態的職類用語） |
| `packs/` | 可在 App 內「匯入框架包」的範例 | 見下方「框架包格式」 |

每個檔案都有 `meta`：`schema`、`updated`、`description`、`contributors`、`sources`、`license`。

## 資料格式重點

**框架**（`frameworks.json` → `frameworks.<id>`）
```json
{
  "id": "biz", "name": "業務與行銷", "eg": "業務、BD…",
  "comps": [{"id": "market", "n": "市場與客戶洞察", "cat": "專業", "lvd": ["1 級", "2 級", "3 級", "4 級", "5 級"]}],
  "roles": {"業務主管": {"d": "一句定位", "st": ["lead", "exec"], "tgt": {"comm": 4, "market": 4}}},
  "certs": ["常見證照"],
  "source": "資料來源", "contributor": "貢獻者", "updated": "YYYY-MM-DD"
}
```
- 非 `full` 的框架，實際能力 = `core` 4 項 + 自己的 `comps` 6 項；`full: true`（automation）則只用自己的 `comps`。
- `roles.*.tgt` 必須涵蓋該框架**全部**能力，值 1–5。

**推薦項目**：`{id, type: c|s|a|o, t, d, comps: [能力 id], h: 預估小時, lv: 難度 1–4}`；機會（o）另有 `req: {能力 id: 門檻}`。

**Role model**：`{id, n, org, img, traits: [], w: {維度: 1|2}, tracks: [], act, source}`。

## 框架包格式（App 內匯入 / 匯出）

使用者可以在「① 現況 → 第 1 步」匯入別人分享的框架包，或在現況總覽「⬇ 匯出我的框架」把自己的版本（含 AI／自訂調整）分享出去。

```json
{
  "format": "growth-nav-framework", "version": 1,
  "meta": {"source": "資料來源", "contributor": "作者", "updated": "YYYY-MM-DD"},
  "framework": {
    "name": "框架名稱", "eg": "適用職務",
    "comps": [{"id": "comm", "n": "溝通與說服", "cat": "核心", "lvd": ["…5 級…"]}],
    "roles": {"角色名": {"d": "一句定位", "st": ["senior"], "tgt": {"comm": 4}}},
    "certs": ["常見證照"]
  },
  "recs": [{"type": "s", "t": "名稱", "d": "說明", "comps": ["comm"], "h": 20, "lv": 2}]
}
```
規則：能力 4–14 項、id 不重複、每項 5 級描述；每個角色要有全部能力的目標等級。核心能力建議沿用 `comm / solve / exec / learn` 這 4 個 id，role model 與機會生成才對得上。範例：`packs/hr-example.json`。

## 貢獻方式（GitHub PR）

1. 修改或新增 JSON（新職類框架、推薦項目、role model…）。
2. **必填來源**：框架填 `source` / `contributor` / `updated`；role model 每位填 `source`；推薦項目若有特定來源可加 `src`。
3. 執行 `python tools/build.py`，確認驗證通過並把更新後的 HTML 一起提交。
4. PR 說明：改了什麼、依據為何（實務經驗、官方職能標準、公開報導），擁有者審核後合併。

授權：所有資料採 CC BY-NC-SA 4.0（© RPAI 數位優化器、Eddy Wu 吳宗賢），提交 PR 即表示你同意以相同條款授權，並授予 RPAI 數位優化器與 Eddy Wu 吳宗賢包含商業用途的使用權（見根目錄 `LICENSE`）。一般使用者請改用 App 內「🤝 分享經驗」投稿。

審核標準：描述具體可觀察（「能獨立交付 X」優於「熟悉 X」）、5 級有明確遞進、不含特定公司機密、人物描述只用公開可查證的資訊。

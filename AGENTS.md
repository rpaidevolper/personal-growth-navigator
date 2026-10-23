# AGENTS.md — 給所有 AI 協作者的交接文件

> 任何 AI（Claude、GPT、Gemini…）或人類接手這個專案前，**先讀完這一份**，再讀 `docs/SPEC.md`。
> 這份文件回答：這是什麼、現在做到哪、規矩是什麼、下一步該誰做什麼、做完要留下什麼。

## 1. 專案一句話

「個人成長導航系統」：一個單一 HTML 檔的職涯規劃工具。使用者盤點**現況** → 選擇**目標角色 / role model** → 看到**能力差距**與推薦 → 建立**成長計畫** → 用**職涯模擬器**試走未來 5 年。
先服務專案擁有者本人（Eddy，自動化 / AI 顧問講師），再擴展給任何工作者。

## 2. 檔案地圖

```
personal-growth-system-for-career-2026-10-12/
├── AGENTS.md            ← 你正在讀的交接文件（入口）
├── CLAUDE.md            ← 只是指向 AGENTS.md
├── README.md            ← GitHub 首頁說明（給使用者與貢獻者）
├── LICENSE              ← CC BY-NC-SA 4.0，© RPAI 數位優化器、Eddy Wu 吳宗賢；含社群投稿授權條款
├── .github/workflows/check-data.yml  ← 每次 push / PR 跑 build.py --check
├── .github/workflows/deploy-pages.yml ← main 更新後發佈到 GitHub Pages（index.html = App）
├── .gitignore / .gitattributes       ← 排除使用者匯出的個資檔；統一 LF 換行
├── docs/
│   ├── SPEC.md          ← 產品規格（願景、模組、資料模型、演算法、路線圖）
│   ├── DECISIONS.md     ← 決策紀錄（為什麼這樣做；新決策往下追加）
│   ├── BACKLOG.md       ← 待辦看板（認領 / 進行中 / 完成；交接時更新）
│   ├── contribution-form.md  ← 社群投稿：Google 表單題目、接回 App、審核標準
│   ├── frameworks-draft.md / rolemodels-draft.md  ← 給擁有者審閱用的草稿
├── data/                ← 框架資料的唯一來源（改資料只改這裡）
│   ├── README.md        ← 資料格式、框架包規格、貢獻流程
│   ├── frameworks.json / recommendations.json / rolemodels.json / templates.json
│   ├── site.json        ← 版權、授權、投稿表單網址（formUrl / entryId）
│   └── packs/           ← 可在 App 內匯入的框架包範例
├── tools/
│   └── build.py         ← 驗證 data/ 並注入 HTML 的 DATA 區塊（--check 只檢查）
└── output/
    └── 個人成長導航系統.html   ← 唯一的程式產物，HTML+CSS+JS 全在裡面（資料由 build.py 注入）
```

## 3. 現況快照（2026-10-23）

| 模組 | 狀態 | 備註 |
|---|---|---|
| 總覽 + 5 階段導覽（進度條、鎖定） | ✅ 完成 | 新用戶空白起始、載入範例、舊資料自動升級 |
| ① 現況精靈（基本資料 → 自評 → 證照 → 經歷） | ✅ 完成 | 自評是一次一項卡片，附 5 級描述 |
| ② 目標與差距（角色卡 → 差距表 → 機會 → 說帖） | ✅ 完成 | 機會由 `genOpps()` 依差距生成並附理由；AI 可改寫成使用者情境（#6） |
| ③ 成長計畫（本週要做 → 看板＋起步清單 → 推薦 → 紀錄＋季度回顧） | ✅ 完成 | 各職類推薦 `FW_RECS`；AI 補推薦、AI 拆解步驟（#7） |
| ④ 職涯模擬（20 季、4 狀態值、事件、紀錄卡、並排比較） | ✅ 完成 | 規則引擎可離線；Claude / Jev 為選配 |
| AI 設定（Claude / Jev / 純規則） | ✅ 完成 | Claude 直連已實作未用真 key 驗證；Jev 為 early access 預留 |
| Persona × 10 項通用能力框架（5 套 + 擁有者 14 項） | ✅ 完成 | `FRAMEWORKS` / `applyFramework()` |
| AI 框架客製 + AI grill 追問 | ✅ 完成 | `customizeAI()` / `grill*()`；有 Claude key 才出現；未用真 key 實測（#8） |
| Role model 原型庫（20 位 + AI 自訂） | ✅ 完成，待擁有者驗收 | `ROLE_MODELS` / `TRAIT_MAP` / `applyTargets()`（#4） |
| 框架資料外部化 + 匯入／匯出框架包 | ✅ 完成 | `data/*.json` + `tools/build.py`；GitHub repo 待擁有者建立（#5） |
| 授權 CC BY-NC-SA 4.0 + 頁尾聲明 | ✅ 完成 | `LICENSE`、`data/site.json`、`rFoot()` |
| 🤝 分享經驗（App 內投稿表單） | ✅ 完成，Google 表單待擁有者建立 | `rShare()` / `shSubmit()`；投稿格式 `growth-nav-contribution`（#11） |
| GitHub Pages 部署 | ✅ 上線 https://rpaidevolper.github.io/personal-growth-navigator/ | `.github/workflows/deploy-pages.yml`；push 到 main 自動發佈（#10） |
| 測試回饋修正 #12–#16（表單儲存、舊計畫處理、獨立專家語境、準備度部分計分、模擬提示） | ✅ 完成 | 回歸測試 `tools/regression.js` |
| 機會卡去重 + 職稱、AI 擴充機會與角色 | ✅ 完成 | `genOpps()` / `aiNewOpps()` / `aiRole()`（#18） |
| 外部資料來源與誠實標示 | ✅ 第一階段 | `docs/sources.md`、框架 `maturity`／`refs`、`fwBasis()`；逐項對照 iCAP 待做（#19） |
| 遊戲化（闖關地圖、XP、等級、成就） | ✅ 完成 | `xpTotal()` / `BADGES` / `rHud()` / `checkProgress()`（#20） |
| Role model 推薦相關度與目標合理化 | 🔜 | BACKLOG #17 |
| 真 key 實測（Claude / Jev） | 🔜 | BACKLOG #8 |

## 4. 技術約定（改程式前必讀）

- **單一檔案**：`output/個人成長導航系統.html`，無套件、無後端，瀏覽器直接開就能用。唯一的建置步驟是 `python tools/build.py`（把 `data/*.json` 注入 HTML）。
- **資料與程式分開**：框架、推薦、role model、模板都在 `data/*.json`，程式透過 `DATA.*` 讀取（例：`const FRAMEWORKS=DATA.frameworks.frameworks`）。**不要手改 HTML 裡 `@@DATA-BEGIN … @@DATA-END` 之間的內容**；改 JSON 後執行 `python tools/build.py`。新增資料欄位時，同步更新 `build.py` 的 `validate()` 與 `data/README.md`。含函式的 `OPP_TPL`、`EVENTS` 仍在程式內。
- **匯入的框架包**：存在 `S.extFws`，載入時由 `registerExt()` 註冊回 `FRAMEWORKS` / `FW_RECS`（`fw.ext=true`、`full=true`）；`translateCat`、`roleId` 對 `ext` 有特別處理。
- **程式風格**：IIFE + `"use strict"`；ES5 風格 `function(){}`（配合現有程式，不要混 arrow function / class）；字串拼 HTML，所有使用者輸入經 `esc()`。
- **框架**：能力清單不是常數。`S.fw` 指向 `FRAMEWORKS` 的一套，`applyFramework(S)` 派生全域 `COMPS / ROLES / ROLE_D / CATX / TECH / BIZ / SOFT`；任何重建 `S` 的地方（載入、匯入、重設、範例）都要跟著呼叫。推薦來源：biz / ops / pro / creative 用各自的 `FW_RECS[track]`（用新框架的能力 id）；tech 與 automation 用舊目錄 `CAT`（舊 14 項 id，經 `CMAP` 翻譯）；再疊上 `S.aiRecs`，合成 `CATX`。機會（type o）不在 `CATX` 裡（擁有者框架的 16 個精選除外），而是每次由 `genOpps(lv)` 依差距生成，id 為 `g_型態_能力`；**要用 id 找項目時一律呼叫 `findItem(id)`**，不要直接 `CATX.find`。`FW_RECS` / `STEP_TPL` 必須定義在 `KEY` 之前（載入時 `migrate()` 就會用到）。
- **目標等級**：一律透過 `applyTargets()` 計算（角色目標 + role model 加權，上限 5），不要直接寫 `S.lv[k].tgt = ROLES[...]`；使用者在差距表手動改的目標會在下次換角色或 role model 時被覆蓋。
- **AI 忙碌狀態**：`aiBusy` 是字串（"custom" / "rec" / "opp" / "rm" / 計畫項目 id），同一時間只跑一個 AI 動作。
- **投稿**：「🤝 分享經驗」是不在導覽列的分頁（`tab="share"`），草稿存 `S.share`；投稿只送出、不寫回框架，審核通過後由人／AI 手動整理進 `data/`。投稿頁的聲明與同意文字一律讀 `DATA.site.contrib`，不要寫死在程式裡。
- **狀態**：全域 `S` 物件，`save()` 寫 localStorage key `growth-nav-v8`。**改資料結構時**：(1) bump key 版本，(2) 把舊 key 加進 `OLDKEYS`，(3) 在 `migrate()` 補預設值。永遠不要讓舊資料載入時炸掉。
- **畫面**：每個分頁一個 `rXxx()` 渲染函式，寫入 `#tab-xxx`；事件統一委派到 `main` 的 click / change / input / keydown 監聽器，用 `data-*` 屬性分派。
- **表單欄位一律「邊打邊存」**：新增文字欄位時，要同時在 `input` 監聽器寫入 `S`，並讓 `flushInputs()` 涵蓋它；不要只靠 `change`（重畫前不一定會觸發，見 D-026）。必填錯誤用欄位旁提示，不要用 toast。
- **獨立專家語境**：顯示給使用者的文字若含「主管、跨部門」等組織內說法，要提供 expert 版本（資料用 `tx`／`dx`／步驟第 3 欄，程式用 `isExpert()` 分支）；`build.py` 會擋資料中缺少的。
- **AI 呼叫**：只在 `claudeCall()` / `jevCall()` 兩個地方發請求；任何 AI 功能都必須有**無 key 的 fallback**，失敗不可中斷流程（`aiFail()` 只 toast 一次）。
- **金鑰**：只存 localStorage；`匯出` 時一律清空 `ai.claudeKey` / `ai.jevKey`。
- **模型 ID**：`claude-haiku-5-5`（預設）、`claude-sonnet-5-5`、`claude-opus-5-5`；API 版本 header `anthropic-version: 2026-10-21`；瀏覽器直連需 `anthropic-dangerous-direct-browser-access: true`；結構化輸出用 `output_config.format.json_schema`。
- **語言**：介面與文件皆繁體中文（台灣用語）。程式註解中文，簡短。
- **設計原則**：資訊不過載——預設只顯示前 N 項、能收合就收合；每頁底部一個「下一步 →」；新用戶永遠知道自己在第幾步。

## 5. 驗證方式

沒有測試框架。每次改完：
0. 動到 `data/` 時：`python tools/build.py`，最後再跑一次 `python tools/build.py --check` 確認一致。
0.5 **回歸測試**：開 App 後在 console 執行 `eval(await (await fetch('../tools/regression.js',{cache:'no-store'})).text()); await runRegression()`，必須全數通過（會清除該瀏覽器的 App 資料）。修 bug 時把重現步驟加進去。注意瀏覽器快取：改完 HTML 請用 `?v=…` 或強制重新整理，確認跑的是新版。
1. 用本機 http 伺服器開檔案（例：在專案根目錄 `python -m http.server 8765`，開 `/output/個人成長導航系統.html`；這樣也能讀到 `data/packs/` 測匯入），`file://` 下 localStorage 行為不同。
2. `localStorage.clear()` 後走一次**全新用戶流程**：總覽 → ① 四步 → ② 選角色 → ③ 加入計畫 → ④ 開一局跑完 20 季。
3. 載入範例、匯出再匯入、手機寬度（375px）無橫向捲動、console 無錯誤。
4. 若動到模擬引擎：同 seed + 同選擇結果必須一致。

## 6. 協作規則（多 AI / 多人）

1. **認領再做**：到 `docs/BACKLOG.md` 把項目狀態改成「進行中（誰、日期）」。同一時間一個檔案只有一位寫入者（目前只有一個 HTML，所以**同時只能有一個人改程式**；文件可以並行）。
2. **先讀決策**：改任何已決定的事之前，先看 `docs/DECISIONS.md` 有沒有相反的決定；要推翻就新增一筆決策，不要默默改。
3. **做完要留下**：(a) BACKLOG 狀態更新，(b) 若有新決策寫入 DECISIONS，(c) 若改了資料模型或流程，更新 SPEC 對應章節與本文件 §3 快照，(d) 在 BACKLOG 的項目下留 3 行交接摘要：改了什麼 / 怎麼驗證的 / 還沒做什麼。
4. **不確定就問擁有者**，不要猜產品方向。Eddy 的偏好：先討論規格再動手、分階段、每輪可驗證、避免資訊過載。
5. **不要**：加外部套件、拆檔案、接後端、改掉單一 HTML 約定——除非 DECISIONS 有新決策。
6. **版控**：本資料夾是 git repo，遠端為公開的 https://github.com/rpaidevolper/personal-growth-navigator （分支 `main`，每次 push / PR 會跑 Action「檢查框架資料」）。repo 內的 git 作者已設為 rpaidevolper 的 GitHub 匿名信箱，不要改成真實 email。一個 BACKLOG 項目一個 commit 或一條分支；commit 前先跑 `python tools/build.py --check`。不要提交使用者匯出的個人資料檔（`.gitignore` 已排除 `我的成長系統_*.json`）。
7. **資料可以並行改**：`data/*.json` 與程式是不同檔案，一人改資料、一人改程式可以同時進行；但最後只能有一個人執行 `build.py` 寫入 HTML，並在寫入前先同步對方的變更。

## 7. 擁有者與背景

- 擁有者：Eddy。流程自動化 / AI 應用顧問與講師，有企業顧問、授課、上雲、資安評估經驗。
- 靈感來源：1in8b.life（人生模擬）、grill-me（一題題追問到沒有未說出口的假設）、Jev / TypeSafe System One（封閉式判斷模型）。
- 專案起始：2026-10-12；模擬器 MVP：2026-10-22；介面重構與本文件：2026-10-23。

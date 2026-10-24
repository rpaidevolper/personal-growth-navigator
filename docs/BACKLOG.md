# 待辦看板（BACKLOG）

規則：認領時把狀態改成「🔧 進行中（誰 / 日期）」；做完改「✅ 完成（日期）」並在項目下留 3 行交接摘要（改了什麼 / 怎麼驗證 / 還沒做什麼）。同一時間只有一位寫入者改 `output/個人成長導航系統.html`。
優先序：P0 下一輪必做、P1 接著做、P2 有空再做。

---

## 🔜 待認領

### #1 ｜P0｜Persona + 10 項通用能力框架（SPEC §4）｜✅ 完成（Claude / 2026-10-23）
- [x] 框架內容草稿 → `docs/frameworks-draft.md`（擁有者已核可，內容即程式中的 `FRAMEWORKS`）
- [x] ① 第 1 步加「工作類型」「職涯階段」兩題（單選卡片）；tech × expert 時可勾選擁有者 14 項框架
- [x] 5 套框架 + `automation`（擁有者原版）寫進 `FRAMEWORKS`；共通核心在 `CORE`
- [x] `S.fw` + `applyFramework()` 派生全域 `COMPS / ROLES / ROLE_D / CATX / TECH / BIZ / SOFT`；localStorage 升到 `growth-nav-v5`，舊資料自動視為 `automation`
- [x] 角色卡依階段排序並標「適合你的階段」；階段微調目標等級（junior −1、exec/expert 核心 +1）
- [x] 推薦目錄用 `CMAP` 翻譯到新框架（`translateCat`）
- 交接摘要：
  - 改了什麼：能力清單不再寫死；框架資料塊在 `// ===== 能力框架` 區；`setFramework()` 在精靈第 1 步按下一步時呼叫
  - 驗證：舊 v4 資料載入為 automation（6 角色）；清除後新用戶 biz × lead 流程：10 項、框架證照 chips、角色排序、機會、模擬 20 季跑完；載入範例正常；console 無錯
  - 還沒做 / 已知限制：非技術框架的推薦清單仍是舊目錄翻譯過來的（偏自動化題材，數量少）→ 由 #6 機會生成與「依框架的推薦清單」補；`frameworks-draft.md` 可在 #5 抽成 `data/frameworks.json`

### #2 ｜P0｜AI 框架客製（SPEC §4.3）｜✅ 完成（Claude / 2026-10-23）
- [x] 有 key 時，自評頁頂部出現 `.aibar`「讓 AI 依你的職務與自介調整」；無 key 隱藏
- [x] `customizeAI()`：JSON schema 回傳改名 + 5 級描述 + 最多 2 項自訂能力；存 `S.custom={by:"ai",comps,extra}`，`applyFramework()` 合併；「退回預建」清空
- [x] 換 track 時自動清掉 `S.custom`
- 交接摘要：
  - 驗證：無 key 無按鈕；假 key → HTTP 401 toast、維持預建；mock 回應 → 14 項改名 + 第 15 項自訂、退回正常
  - 未做：真 key 實測（→ #8）；自訂能力不在任何角色的目標等級內（預設目標 3）

### #3 ｜P0｜AI 追問（grill 模式）（SPEC §5）｜✅ 完成（Claude / 2026-10-23）
- [x] 全部自評完後出現「✨ 讓 AI 問幾題，校正自評」→ `nowStep=5` 對話畫面
- [x] 一次一題、進度 n/12、「不知道／沒做過」、「夠了直接產生結果」、放棄；對話只在記憶體 `grill`，不落地
- [x] final：各能力自評→建議（差異預設勾選）+ 理由 + 證據；新發現能力（≤3，存成 `S.custom.extra`，接著引導自評）；可存成經歷並寫入佐證
- [x] `S.grill={at,n,applied}` 只記摘要，總覽卡顯示「AI 追問於 日期」
- 交接摘要：
  - 驗證：mock 4 次呼叫（問→答→不知道→final）：表格 3 列、勾選 2 項套用（rpa 4→5、pm 3→4）、經歷 +1、新能力成第 15 項並跳回自評
  - 未做：真 key 實測問題品質（→ #8）；system prompt 在 `grillSystem()`，可調

### #4 ｜P1｜Role model 原型庫（SPEC §6）｜✅ 完成，待擁有者驗收（Claude / 2026-10-23）
- [x] 草稿 `docs/rolemodels-draft.md`（擁有者指示「先一路寫完再驗收」，未經審閱即實作）
- [x] 20 位人物寫進 `ROLE_MODELS`（內嵌；#5 再抽到 `data/rolemodels.json`）：特質、維度加權、適合 track、「你現在就能做的事」
- [x] 11 個特質維度 `DIM_N` + `TRAIT_MAP[框架]` 對應到各框架能力；`applyTargets()` = 角色目標 + 加權（上限 5），換角色時保留 role model
- [x] ② 選好角色後出現「🌟 向一位 Role model 看齊」：預設 6 位（適合你職類的排前）、可展開全部；選後顯示特質 → 能力 → 目前 / 角色→加權後目標對照表；「你現在就能做的事」可一鍵加入計畫；每處附免責
- [x] 有 key：輸入任何人物 → AI 產生同格式條目（標「AI 生成，請自行查證」），存 `S.customRM`（最多 10 位）
- 交接摘要：
  - 驗證：範例（automation）選黃仁勳、換角色後加權保留（生成式 AI 4→5）、取消回原值、行動加入計畫帶 5 步；biz × junior 選貝佐斯（客戶關係 3→5、溝通 3→4）；mock AI 產生稻盛和夫（無效維度過濾、加權壓到 ≤ 2）；375px 無橫向捲動；console 無錯
  - 待擁有者驗收：名單、特質、加權、維度對應（見 draft §D）；真 key 實測 AI 產生人物的準確度（→ #8）

### #5 ｜P1｜框架資料外部化 + 匯入匯出（SPEC §7）｜✅ 完成（Claude / 2026-10-23）
- [x] 載入方式定案（D-022）：`data/*.json` 為唯一來源，`tools/build.py` 注入 HTML 的 `DATA` 區塊；HTML 仍單檔離線
- [x] 抽出 `frameworks.json`、`recommendations.json`、`rolemodels.json`、`templates.json`，每檔 `meta`（sources / contributors / updated / license 待定），每個框架 `source/contributor/updated`、每位人物 `source`
- [x] `build.py` 驗證：lvd 5 級、角色目標涵蓋所有能力且 1–5、推薦能力 id 存在、traitMap 對應存在、人物 source 必填、加權 1–2；`--check` 給 CI / PR
- [x] App 內「⬆ 匯入框架包」（① 第 1 步，可選、可移除，重設時保留）、「⬇ 匯出我的框架」（① 總覽，含 AI／自訂調整）；`validatePack()` 擋錯並說明原因
- [x] `data/README.md`：格式、框架包規格、PR 貢獻流程與審核標準；範例 `data/packs/hr-example.json`
- [x] 本機 git repo（`main`）、`.gitignore`、`.gitattributes`、根目錄 `README.md`、GitHub Action `.github/workflows/check-data.yml`（2026-10-23）
- [x] **推上 GitHub**（2026-10-23）：公開 repo https://github.com/rpaidevolper/personal-growth-navigator ，Action「檢查框架資料」首次執行通過；repo 內 git 作者設為 `rpaidevolper <264352534+rpaidevolper@users.noreply.github.com>`（只設在本 repo）
- [x] 授權（2026-10-23）：CC BY-NC-SA 4.0，© RPAI 數位優化器、Eddy Wu 吳宗賢；`LICENSE`、README、`data/*.json` 的 `meta.license`、App 頁尾
- 交接摘要：
  - 改了什麼：14 個資料常數改成讀 `DATA`；`OPP_TPL` / `EVENTS` 含函式邏輯，留在程式內不外部化；新增 `S.extFws` + `registerExt()`（載入時註冊回 `FRAMEWORKS` / `FW_RECS`）
  - 驗證：抽出後 `--check` 一致；舊 v7 資料正常載入；匯入 HR 範例 → 10 項自評、證照、3 角色、生成機會、role model（無對應維度顯示提示）、5 項推薦；缺目標等級的壞檔被擋；匯出 automation（14 項 / 6 角色 / 42 推薦）再匯入成功；移除框架包；故意改壞 rolemodels.json → `--check` 列出 2 個錯誤並回傳 1
  - 未做：匯入框架的 role model 對應暫用 tech 的 `traitMap`（只有同名核心能力對得上）；框架包可再加 `traitMap` 欄位

### #6 ｜P1｜機會規則生成 + 理由（SPEC §8）｜✅ 完成（Claude / 2026-10-23）
- [x] 推薦清單改為各職類自己的 `FW_RECS`（biz / ops / pro / creative 各 12 項；tech、automation 沿用 `CAT`）——隨 #7 一起做
- [x] 有 key：「✨ AI 依我的差距再推薦」3–5 項，存 `S.aiRecs`
- [x] 機會改由 `genOpps(lv)` 生成：差距 × 重要度前 3 能力 × `tplsFor(k)` 的 2 種型態（`OPP_TPL`：lead / share / mentor / pitch / showcase），場景用語依 track（`OPP_SCENE`）；核心能力透過 `roleId()` 對應到擁有者框架的 id
- [x] 每張卡附理由 `oppWhy()`：主要練哪項、差幾級、門檻達標或還差多少；排序：已準備好 > 生成 > 精選，再依差距排名
- [x] 非擁有者框架不再顯示手寫機會；automation 保留 16 個「精選機會」
- [x] 有 key：「✨ AI 改寫成我的情境」改寫前 5–6 個生成機會的標題與說明，存 `S.oppText`
- [x] 模擬器 `dealCards()` 的機會改吃 `genOpps(run.lv)`；`findItem()` 能由 id（`g_型態_能力`）重建生成機會，加入計畫、匯出、說帖都通
- 交接摘要：
  - 驗證：biz / ops / creative 三種 persona 的機會題材與理由正確；不夠格的卡顯示「還差：X 目前 1，需要 2」；生成機會加入計畫帶 5 步、可產說帖；20 季模擬完成 4 個生成機會並匯出；automation 範例 6 生成 + 16 精選；mock AI 改寫只套用有效 id
  - 未做：真 key 實測改寫品質（→ #8）；機會型態只有 5 種，未來可在 #5 外部化後由社群擴充

### #7 ｜P1｜計畫的下一步（SPEC §9）｜✅ 完成（Claude / 2026-10-23）
- [x] 每項目 `steps[{id,t,h,done}]`：加入時依類型套 `STEP_TPL`，時數依權重分配；可勾選、新增（含時數）、刪除；勾選即重算進度，全部完成自動移到「已完成」並記紀錄
- [x] 「📅 本週要做」：進行中優先、截止日近優先，每項取下一步，排到每週時數（最多 3 件）；出現在 ③ 頂部與總覽
- [x] 季度回顧：總覽在距上次回顧 ≥ 90 天時顯示提醒卡；「🔁 做季度回顧」開啟預填 5 題的紀錄表單，送出即更新 `S.lastReview`
- [x] 有 key：每個項目「✨ AI 依我的背景重新拆解步驟」（保留已完成步驟）
- 交接摘要：
  - 改了什麼：③ 整段重寫（`rPlan / planCard / weekCard / weekTasks / syncPg / completeItem`）；`aiBusy` 改字串（"custom" / "rec" / 項目 id）；localStorage 升 `growth-nav-v6`，舊項目依進度補 steps
  - 驗證：biz × senior 新用戶 → 推薦為業務題材；加入 2 項自動產生 5 步；勾步驟→進行中、全勾→已完成+紀錄、移回→最後一步取消；新增 / 刪除步驟；mock AI 推薦（無效能力 id 過濾）、mock AI 拆解（保留已完成）、401 退回；季度回顧表單；v5 舊資料 40% → 2/5 步；100 天提醒卡
  - 未做：真 key 實測 AI 推薦與拆解品質（→ #8）；步驟沒有排序 / 拖曳；本週視圖每項只取一步

### #10 ｜P1｜GitHub Pages 部署｜✅ 上線（Claude / 2026-10-23）
- [x] `.github/workflows/deploy-pages.yml`：main 更新 → `build.py --check` → `index.html` + `LICENSE.txt` + `packs/` → 發佈
- [x] 擁有者已在 Settings → Pages 選「GitHub Actions」（第一次設定沒存到，部署報 Pages Not Found；重設後成功）
- [x] 上線確認：https://rpaidevolper.github.io/personal-growth-navigator/ 、`LICENSE.txt`、`packs/hr-example.json` 皆 200；線上載入範例、跑 4 季模擬、開投稿頁，console 無錯誤
- [x] CI 套件升級：`actions/checkout@v5`、`actions/setup-python@v6`（Node.js 24）
- [ ] 之後可綁 RPAI 自有網域（Settings → Pages → Custom domain）

### #11 ｜P1｜社群分享：一鍵分享 + Supabase 收件審核｜✅ 完成（Claude / 2026-10-24；原 Google 表單方案已取代）
- [x] 2026-10-24 改版：分享頁改成勾選要分享的區塊（自動打包已填內容）、關於你全選填、進階能力定義收合；預覽後送出到 Supabase `submissions`（只能新增、待審核、限頻）；失敗時自動下載檔案；`supabase/schema.sql`、`docs/contribution-review.md`；回歸測試 S×3
- [x] 擁有者已執行 `supabase/schema.sql`（2026-10-24）；從線上網站實際送出一筆 → 201。安全檢查：匿名讀取、修改、刪除、未勾授權、自填 reviewer_note 皆被擋（401/RLS）；自填 status=approved 會被觸發器改回 pending
- [x] App「🤝 分享經驗」頁（標頭按鈕、② 頁提示、頁尾連結）：投稿者資料、職業、3–10 項能力（每項需要等級＋≥ 15 字親身例子，可從框架帶入）、證照資源、親身經驗聲明與授權同意；草稿存 `S.share`
- [x] 送出：表單未設定 → 下載 JSON；已設定 → 開啟 Google 表單並預填（精簡 JSON 編碼 < 6000 字元）或複製到剪貼簿；複製失敗 → 下載
- [x] `docs/contribution-review.md`：表單題目、取得 entryId、審核標準
- [ ] **擁有者**：用 RPAI 帳號建立 Google 表單與試算表，把 `formUrl` / `entryId` 給 Claude 填進 `data/site.json`
- [ ] `tools/import_contributions.py`：試算表 CSV → 依職業彙整的草稿（≥ 3 份再整理成框架包）
- 交接摘要：驗證過未填阻擋、缺勾選阻擋、未開放時下載、測試網址下預填（3 項約 3000 字元，解碼回原內容）、長內容改剪貼簿、375px 無橫向捲動；投稿格式見 `shPayload()`

### #12 ｜P0｜表單資料可靠儲存與驗證訊息（測試回饋 1、2、5）｜✅ 完成（Claude / 2026-10-23）
- 根因：基本資料只在 `change` 事件寫入 `S`，而點工作類型卡片、導覽列等會立即 `render()` 重畫表單。在某些環境下（行動版 Safari 點非輸入元素不會失焦、自動化測試只送 `input` 事件、輸入法組字中），`change` 不會在重畫前觸發，未提交的輸入就被舊值蓋掉。桌面 Chrome 實際打字無法重現，但這是設計上的漏洞，必須修。
- [x] 所有 `data-p` 欄位改聽 `input` 事件即時寫入（不重畫）；使用者互動當下先 flush 目前分頁的欄位（不在 `render()` 裡做，見 D-026）
- [x] 第 1 步必填改為欄位旁的即時提示，補齊即消失；移除「請先填…」toast
- [x] 回歸測試腳本 `tools/regression.js`：只送 `input` 事件／完全不送事件 → 點卡片 → 換頁，值必須保留

- 交接摘要（#12）：`main` 新增 `input` 監聽即時寫入；`flushInputs()` 在使用者互動當下（main／導覽／標頭按鈕 click）把目前分頁未寫入的欄位寫回——刻意不在 `render()` 裡做，避免把隱藏分頁的舊畫面蓋回新資料；必填改 `.fhint` 欄位提示（`profileMissing()`／`updateHints()`）；toast 計時器改為新訊息覆蓋舊的。驗證：`tools/regression.js` 12/12 通過（只送 input、完全無事件、編輯後換頁、提示消失）。

### #13 ｜P0｜切換框架／目標時處理舊計畫，導覽狀態一致（測試回饋 3、導覽 ✓＋🔒）｜✅ 完成（Claude / 2026-10-23）
- [x] 計畫項目記錄建立時的框架與目標（`p.fw`、`p.role`）
- [x] 切換能力框架後（只換目標角色不詢問，見 D-027），③ 頂部出現一次性選擇：清空並重建／保留但標示「來自舊角色」／重新評估（能力對應不到新框架的標出、可一鍵移除）
- [x] 導覽列：鎖定的階段只顯示 🔒，不顯示 ✓；解鎖後才恢復完成狀態

- 交接摘要（#13）：計畫項目新增 `fw`／`role`；`planStale()` 判斷「來自舊框架或能力對應不到」，③ 頂部 `planStaleCard()` 三選一（重新評估用 `CMAP` 對應、對應不到標 `unmapped`；保留標 `keepOld`；清空只刪未完成的舊項目）；只換目標角色不詢問（能力不變）。導覽列鎖定時不顯示 ✓。驗證：ops→tech 重新評估（1 項更新、1 項標出）、保留、清空重建皆正確。

### #14 ｜P1｜依職涯階段切換語境：獨立專家／自由工作者（測試回饋 4）｜✅ 完成（Claude / 2026-10-23）
- [x] 說帖：expert 改為「給潛在客戶的提案」（客戶痛點、服務範圍、報價區間、交付與成功指標）
- [x] 機會模板：expert 時「跨部門提案」→「客戶提案／售前」、「帶人／內訓」→「開一堂付費課程或工作坊」、新增「服務產品化與報價」「穩定案源與個人品牌」
- [x] 資料中組織語境的推薦（7 項）與起步步驟（2 步）加獨立專家版本 `tx`／`dx`／第 3 欄；`build.py` 檢查含「主管／跨部門」者必須有獨立專家版本（框架等級描述中的「主管」屬一般描述，保留）

- 交接摘要（#14）：`isExpert()`；`OPP_TPL.*.x` 為獨立專家版本，另有 `productize`（服務產品化與報價）、`pipeline`（穩定案源與個人品牌）兩型態只在 expert 出現；`pitchClient()` 客戶提案（痛點、做法、案例、範圍、報價、成功指標）；`applyFramework()` 依階段套 `tx`／`dx`；`mkSteps()` 用第 3 欄。驗證：tech×expert 的 ② 頁不含「向主管爭取」「跨部門提案」、說帖含報價且無「主管」。

### #15 ｜P1｜機會準備度不再全有全無，附「最小下一步」（新鮮人 0%）｜✅ 完成（Claude / 2026-10-23）
- [x] 準備度改為部分計分：每個門檻依 `目前 ÷ 需要` 計分（上限 1），不再只看是否達標
- [x] 有對應能力的經歷，該能力的準備度視同 +0.5 級（目前經歷完全不影響準備度，測試表格的描述與實作不符）
- [x] 每個機會型態附「下一個能做到的最小任務」（例：主導改善專案 →「先記錄一個每週重複發生的問題，量一次它花多少時間」），準備度 < 70% 時顯示

- 交接摘要（#15）：`readinessIn(lv,o,useExp)` 改部分計分並回傳 `ready`；`expBonus()` 經歷 +0.5；UI 以 `r.ready` 判斷「已準備好」；準備度 < 70% 顯示 `.mini` 最小下一步（模板 `mini`，精選機會用 `MINI_GENERIC`）；模擬抽牌門檻由 60 提高到 70 以維持難度。驗證：biz×junior 前 5 個機會無 0%、有最小下一步。

### #16 ｜P1｜模擬器：精力不足要說清楚、事件要符合職類｜✅ 完成（Claude / 2026-10-23）
- [x] 精力不足的卡片：明確禁用樣式＋「還差 N 精力」；點擊時提示原因，不再靜默無反應（目前點了沒選上，直接結算就被記成休養）
- [x] 隨機事件文字依職類調整或改中性（例：「AI 技術大躍進：市場重新定義『自動化專家』」→「AI 改寫了你這一行的工作方式」）；技術淘汰事件只對 tech／automation 觸發
- 交接摘要（#16）：卡片 `offMsg`（最多 2 項／精力不足還差 N）、`data-offmsg` 點擊即 toast、卡上「🔒 還差 N 精力」；`obsolete` 事件僅 tech／automation；`aishift` 用 `tf()` 依框架換文字。驗證：每週 1 小時時選一張後其他卡顯示差額並提示；biz 20 季無技術淘汰與「自動化專家」字樣。

### #17 ｜P2｜Role model 推薦可信度與目標合理性
- [ ] 「適合你」改依「人物加權 × 你差距最大的能力」計算相關度，只標前 3 名，徽章改為「最能補你的差距」
- [ ] 加權調整：目標最多比角色目標高 1 級（不再 +2），另把對應能力的重要度提高一級，避免目標被推到不切實際
- [ ] 對照表加一句「這是長期方向，不是 12 個月內的目標」

### #18 ｜P1｜機會卡去重、帶入職稱；AI 依職務擴充選項｜✅ 完成（Claude / 2026-10-23）
- [x] 同一型態只出一張卡（多項能力合併成「也練到」）；標題帶入職稱（≤12 字）；專業服務場景改為實務用語
- [x] 有 key：「✨ AI 依我的職務新增機會」（存 `S.aiOpps`，無效能力 id 自動剔除）、「✨ AI 產生角色」（存 `S.customRoles`，可刪除）；加入計畫時記錄 `src`（ai／rule／preset）
- 交接摘要（#18）：`makeOpp()` / `genOpps()` byTpl 分組、`aiNewOpps()`、`aiRole()`、`roleOrder()`；回歸測試 A×3、B×3（模擬 AI 回應，不需真 key）。

### #19 ｜P1｜外部資料來源與誠實標示｜✅ 第一階段完成（Claude / 2026-10-23）
- [x] 調查可用的官方職能／職業資料與授權 → `docs/sources.md`（主計總處職業分類、iCAP、勞動部薪資、O*NET 可用；SFIA 不可用）
- [x] 更正 `frameworks.json`：移除「參考 SFIA 8 與 O*NET」的誇大說法；每個框架加 `maturity`（草擬版／實務版／已對照官方）與 `refs`；`build.py` 檢查
- [x] App ② 目標頁顯示「📚 這套能力框架的依據」與可對照的公開資料連結、「不代表官方標準」
- [ ] 每個職類挑 3–5 份 iCAP 基準逐項對照，升級為「已對照官方」（先從 pro 的會計主管／企業財務人員開始）
- [ ] 角色卡加主計總處職業代碼，串勞動部職類別薪資（開放資料，須依格式顯名）
- [ ] iCAP 子站 PDF 是否適用政府資料開放授權，逐字收錄前寫信向勞動力發展署確認

### #20 ｜P1｜遊戲化：闖關、經驗值、等級、成就｜✅ 完成（Claude / 2026-10-23）
- [x] 經驗值、10 個等級與稱號、14 個成就全部由目前資料推導（`xpTotal()` / `BADGES`），取消勾選會扣回，不另存分數
- [x] 右上角 HUD（頭像、等級、XP 條、成就數），點開成就面板（稱號之路、成就、經驗值規則）
- [x] 總覽改成冒險地圖（4 關、目前關卡脈動、鎖定關卡）、圖示 KPI、本週任務、最近成就；導覽改成關卡膠囊（基地／認識自己／鎖定目標／修煉計畫／未來模擬）
- [x] 新成就與升級彈出慶祝卡＋彩帶；勾步驟浮出「+15 XP」；第一次載入、載入範例、清除、匯入只記錄不慶祝；支援 `prefers-reduced-motion`
- [x] 手機：導覽橫向捲動、地圖縮小、KPI 兩欄；深色模式檢查
- 交接摘要（#20）：`S.gx={seen,lv}` 只用來判斷要不要慶祝；`checkProgress()` 在 `render()` 尾端呼叫；`clearCele()` 在換資料時清空排隊中的慶祝。回歸測試 G×3。

### #22 ｜P1｜版面：置中 + 左側角色欄（身分卡、狀態、成長地圖）｜✅ 完成（Claude / 2026-10-24）
- [x] 寬螢幕內容置中（最寬 1440px），左側 300px 角色欄固定跟隨；原本靠左、右邊大片空白的問題解決
- [x] 身分卡：職類、頭像與等級、職務、階段、目標、典範、每週投入、開始日期、XP 條、成就數、護照式代碼列（點等級開成就面板）
- [x] 狀態 0–100：目標達成、核心能力、專業能力、行動力（近 4 週有行動的週數 × 25），附說明
- [x] 成長地圖：近 52 週，一格一週，依行動筆數（成長紀錄 + 勾完的步驟）上色；步驟勾選時開始記 `at` 日期
- [x] 手機：頁首工具列橫向捲動、副標隱藏；基地頁角色欄精簡（狀態兩欄、檔案與地圖可展開）；其他分頁只留一條等級列
- 交接摘要（#22）：`rSide()`（由 `rHud()` 呼叫）、`sideStats()`、`actDates()`；HUD 改在角色欄內，事件掛在 `#side`。舊資料沒有 `at` 的步驟不計入地圖與行動力。

### #21 ｜P2｜分享我的路徑（使用者紀錄回饋）
- [ ] 使用者可把自己的計畫與完成紀錄（含 AI 產生的機會／角色）匿名送出，經審核成為選項；三層可信度：親身經驗／使用者認可／使用者完成
- [ ] 收件已就緒（#11）；累積約 30 筆通過的分享後，開 `approved_paths` 檢視表並在「目標」頁顯示相似路徑

### #8 ｜P2｜Claude / Jev 真實連線驗證
- [ ] 用真 key 跑一局含敘事；確認 JSON schema 回傳；記錄 Jev 是否能從瀏覽器呼叫（CORS）

### #9 ｜P2｜小型打磨
- [x] 總覽「本週」摘要（隨 #7 完成）
- [ ] 深色模式下雷達圖固定色改 CSS 變數；鍵盤操作自評卡（1–5 數字鍵）；計畫步驟排序

---

## 🔧 進行中
（無）

---

## ✅ 完成
- 2026-10-22｜職涯模擬器 MVP（引擎、事件、紀錄卡、並排比較、AI 設定、匯出成計畫）
  - 改了什麼：新增 ⑦ 分頁與規則引擎；`radar()` 支援兩組等級；HELD 誤判修正
  - 驗證：本機跑 20 季 ×2、同 seed 重現、匯出計畫 17 項、手機寬度
  - 未做：真 key 連線驗證（→ #8）
- 2026-10-23｜介面重構：5 階段導覽、現況精靈、空白起始 + 範例、資料 v4 遷移
  - 改了什麼：全檔重寫（資料與引擎不變）；`S.certs/exps/setup` 新增；`growth-nav-v4`
  - 驗證：新用戶全流程、鎖定解鎖、載入範例、匯入舊檔、375px 無橫向捲動、console 無錯
  - 未做：#1–#7 全部
- 2026-10-23｜建立 AGENTS.md / SPEC / DECISIONS / BACKLOG

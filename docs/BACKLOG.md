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
- [ ] 授權（license）待擁有者決定，決定後更新 `README.md` 與 `data/*.json` 的 `meta.license`
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

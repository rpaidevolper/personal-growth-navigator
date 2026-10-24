# 使用者分享：Supabase 收件與審核流程

對應 DECISIONS D-032（取代 D-024 的 Google 表單）。使用者在 App 的「🤝 分享路徑」頁，勾選要分享的區塊（預設全勾，成長紀錄預設不勾），勾選親身經驗聲明與授權同意後送出。App 直接把內容寫進 Supabase 的 `submissions` 表，狀態一律是「待審核」。

## 1. 一次性設定（擁有者）

1. Supabase 後台 → **SQL Editor** → New query → 貼上 [`supabase/schema.sql`](../supabase/schema.sql) 全部內容 → **Run**。可重複執行。
2. `data/site.json` 的 `contrib.supabase` 已填好 Project URL 與 **anon** 金鑰。anon 金鑰本來就是給網頁用的公開值，安全性靠資料表的權限規則：
   - 訪客只能新增，不能讀取、修改、刪除（連自己送的也讀不到）。
   - 新增時強制為 `pending`，必須勾聲明與授權。
   - 同一分享編號每小時最多 5 次，全站每小時最多 300 筆。
3. **絕對不要**把 `service_role` 金鑰放進 `data/` 或程式碼；`tools/build.py` 會擋。

## 2. 收到的資料

| 欄位 | 說明 |
| --- | --- |
| `share_id` | 使用者的分享編號（存在他自己的瀏覽器）。同一人多次分享會是同一個編號；要撤回時對方會提供它。 |
| `role` / `track` / `stage` / `target` / `industry` / `years` | 方便篩選的摘要欄位。 |
| `contact_email` | 選填，只供審核聯繫，**不放進 payload、之後也不公開**。 |
| `payload` | 完整內容（`format: growth-nav-path`）：profile、skills、certs、exps、goal、plan（含步驟與完成日期）、log、ai、sims、note、detail（進階能力定義）。 |
| `status` | `pending` → 擁有者改成 `approved` 或 `rejected`。 |
| `reviewer_note` / `reviewed_at` | 審核備註與時間。 |

## 3. 審核（擁有者在 Supabase 的 Table Editor 操作）

1. 篩選 `status = pending`。
2. 看 `payload`：
   - 能力自評、計畫、經歷是否合理（年資、職務與等級是否相符）。
   - 文字裡有沒有公司名稱、人名、客戶名或營業秘密；有的話退件或聯繫對方修改。
   - 有沒有灌水、廣告、測試資料。
3. 通過改 `approved`，不通過改 `rejected`，必要時寫 `reviewer_note`。
4. 有人要求撤回：用 `share_id` 找到該人所有資料並刪除。

## 4. 之後（BACKLOG #21）

- 已通過的資料累積約 30 筆後，開啟 `schema.sql` 最下方的 `approved_paths` 檢視表（不含 email 與署名），App 在「目標」頁顯示「和你相似的人」的匿名路徑。
- 再下一步做整體統計（例如選這個目標的人，各能力平均花多久升一級）。
- `detail`（進階能力定義）累積到同一職業 ≥ 3 份時，整理成框架包放進 `data/`。

# 免費 AI 額度（Gemini 經 Supabase 代理）

對應 DECISIONS D-033。使用者沒填自己的 Claude key 時，規劃類 AI 功能（AI 追問、調整能力描述、新增機會、改寫機會、產生角色與 role model、依差距推薦、拆解步驟）改走網站提供的免費額度。職涯模擬的成功率判斷與敘事仍只用規則引擎或使用者自己的 key，因為一局最多要呼叫約 60 次。

```
瀏覽器（anon key） → Supabase Edge Function「ai」 → Gemini API
                         │  GEMINI_API_KEY 只在這裡（Secrets）
                         └→ ai_take()：每人／每 IP／全站每日次數
```

## 部署步驟（擁有者，約 10 分鐘）

1. **取得 Gemini 金鑰**：到 Google AI Studio（https://aistudio.google.com/）→ Get API key → 建立金鑰。**不要貼到聊天、程式碼或 repo**。
2. **建立額度表**：Supabase → SQL Editor → 貼上 [`supabase/ai_quota.sql`](../supabase/ai_quota.sql) → Run。
3. **設定 Secret**：Supabase → Edge Functions → Secrets → 新增 `GEMINI_API_KEY` = 你的金鑰。
4. **部署函式**：Supabase → Edge Functions → Deploy a new function → Via Editor → 名稱填 **`ai`** → 把 [`supabase/functions/ai/index.ts`](../supabase/functions/ai/index.ts) 全部內容貼上 → Deploy。保持「Verify JWT」開啟（網頁會帶 anon key）。
   - 用 CLI 的話：`supabase functions deploy ai --project-ref qtrqkrgzmewkvtzebopt`
5. 通知 Claude（或其他協作 AI）實測，通過後把 `data/site.json` 的 `ai.enabled` 改成 `true` 並重新 build、推上線。

## 可調整的設定（Edge Functions → Secrets，選填）

| 名稱 | 預設 | 說明 |
| --- | --- | --- |
| `GEMINI_MODEL` | `gemini-3.5-flash-lite` | 免費方案可用的模型以 AI Studio 顯示為準；模型下架時改這裡即可 |
| `AI_LIMIT_CLIENT` | 30 | 每個瀏覽器每天次數（同時改 `site.json` 的 `ai.limit`，畫面才會一致） |
| `AI_LIMIT_IP` | 60 | 每個 IP 每天次數（IP 只存加鹽雜湊） |
| `AI_LIMIT_GLOBAL` | 800 | 全站每天上限，請設在 Gemini 免費方案每日上限以下 |
| `ALLOWED_ORIGINS` | `https://rpaidevolper.github.io,http://localhost:8765` | 允許呼叫的網域，逗號分隔 |
| `AI_SALT` | `growth-nav` | IP 雜湊用的鹽，建議改成一串隨機字 |

每日計數以台北時間 0 點重算；Gemini 失敗時次數會退回。

## 防濫用與限制（誠實說明）

- 金鑰不在網頁裡；只接受允許網域的請求；輸入限 30,000 字、輸出限 4,096 tokens；系統提示固定為「職涯規劃助手、婉拒無關請求」。
- 「每個瀏覽器」用的是瀏覽器裡的隨機編號，清除資料就會重置，所以另外有 IP 與全站上限。有心人仍可能繞過網域限制或換 IP，但最多用完當天的全站額度；免費方案不會產生費用。
- **資料使用**：依 Google 條款，免費方案送出的內容可能被用於改善其產品。App 的 AI 設定面板會顯示這段說明，並讓使用者關閉免費額度、改填自己的 Claude key。

## 監看

- Supabase → Table Editor → `ai_usage`：每天各使用者、IP 與全站的次數。
- Supabase → Edge Functions → ai → Logs：Gemini 錯誤（例如模型名稱錯誤、額度用完）。

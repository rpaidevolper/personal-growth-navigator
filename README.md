# 個人成長導航系統

一個單一 HTML 檔的職涯規劃工具：盤點**現況** → 選擇**目標角色 / role model** → 看到**能力差距**與推薦 → 建立**成長計畫** → 用**職涯模擬器**試走未來 5 年。

- 下載 `output/個人成長導航系統.html`，用瀏覽器直接開啟即可使用，不需安裝、可離線。
- 資料只存在你自己的瀏覽器（localStorage），可用「匯出」備份。
- AI 功能（能力描述客製、AI 追問、推薦、拆解步驟、機會改寫、自訂 role model、模擬敘事）是選配，需自備 Claude API key；不設定也能完整使用。

## 給貢獻者

| 想做的事 | 看這裡 |
|---|---|
| 了解專案、接手開發（人或 AI） | [`AGENTS.md`](AGENTS.md) |
| 產品規格 | [`docs/SPEC.md`](docs/SPEC.md) |
| 為什麼這樣設計 | [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| 待辦與認領 | [`docs/BACKLOG.md`](docs/BACKLOG.md) |
| 貢獻能力框架、推薦、role model | [`data/README.md`](data/README.md) |

框架資料在 `data/*.json`，修改後執行：

```bash
python tools/build.py          # 驗證並把資料注入 HTML
python tools/build.py --check  # 只檢查（GitHub Action 會在每個 PR 執行）
```

## 授權

待擁有者決定。

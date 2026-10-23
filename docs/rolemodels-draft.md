# Role model 原型庫草稿（BACKLOG #4）— 待擁有者審閱

狀態：草稿 v0.1（2026-10-23）。審閱通過後寫進程式（之後在 #5 抽到 `data/rolemodels.json`）。
對應 SPEC §6、DECISIONS D-011。

---

## A. 設計：為什麼要「特質維度」這一層

人物不能直接對應到某一套框架的能力：例如黃仁勳的「技術深度」，對技術職類應該加在「程式與工具」，對業務職類則該加在「產品與解決方案知識」。所以中間多一層**特質維度**：人物 → 3–4 個特質 → 特質維度 → 依你的框架對應到具體能力。

### 8 個特質維度與各框架的對應

| 維度 | 意思 | tech | biz | ops | pro | creative | automation（擁有者） |
|---|---|---|---|---|---|---|---|
| comm 溝通說服 | 說故事、寫作、演講 | comm | comm | comm | comm | comm | comm |
| solve 判斷決策 | 第一原理、理性決策 | solve | solve | solve | solve | solve | biz |
| exec 執行交付 | 紀律、可靠交付、速度 | exec | exec | exec | exec | exec | pm |
| learn 學習適應 | 成長心態、自我顛覆 | learn | learn | learn | learn | learn | change |
| people 帶人文化 | 同理、培育、坦誠回饋 | comm* | relation | people | stakeholder | comm* | lead |
| vision 策略遠見 | 長期押注、商業模式 | design | market | strategy | advisory | concept | biz |
| customer 顧客體驗 | 顧客至上、體驗設計 | quality | relation | process | stakeholder | ux | process |
| craft 專業深度 | 技術或工藝的極致 | code | product | process | domain | craft | genai |
| innovate 創新科技 | 敢用新科技、高速迭代 | ai | growth | digital | digital | tooling | genai |
| discipline 紀律治理 | 風險、誠信、標準 | security | pitch* | risk | deliverable | visual* | gov |
| brand 影響力品牌 | 個人品牌、公眾能見度 | comm* | pitch | strategy | advisory | portfolio | change |

\* 該框架沒有更貼切的能力時的替代對應。同一項能力被多個特質加權時取最大值，不疊加。

### 套用規則
- 選了 role model 後：**目標等級 = 目前角色的目標 + 特質加權（+1 或 +2），上限 5**。
- 可以同時保留原本的目標角色（role model 是「加味」，不是取代）。
- 畫面顯示「他的特質 → 你框架裡對應的能力 → 你目前 / 加權後目標」對照表。
- 每個人物附一句「**你現在就能做的事**」：把名人特質縮小成一個本週可執行的小動作，避免「我又不是 CEO」的距離感。
- 每張卡固定顯示免責：「依公開報導與訪談整理的公眾形象，非本人背書，也不代表其真實能力或全部面貌。」

---

## B. 人物名單（18 位）

加權欄：維度 +n。「適合」為建議的 track，不限制選擇。

| # | 人物 | 一句公眾形象 | 3–4 個特質 | 加權 | 適合 | 你現在就能做的事 |
|---|---|---|---|---|---|---|
| 1 | 薩蒂亞·納德拉 Satya Nadella（微軟） | 用成長心態與同理心重塑微軟文化，帶領雲端與 AI 轉型 | 成長心態、同理心領導、平台思維、夥伴合作 | learn+2、people+2、vision+1 | 全部 | 這週問一位同事「你最近卡在哪？」只聽不給建議 |
| 2 | 黃仁勳 Jensen Huang（NVIDIA） | 數十年押注加速運算，以技術深度與直接溝通著稱 | 長期技術押注、技術深度、扁平直接溝通、韌性 | vision+2、craft+2、comm+1 | tech、automation | 選一個你看好的技術方向，寫下「三年後它會怎樣改變我的工作」 |
| 3 | 張忠謀（台積電） | 開創晶圓代工模式，以誠信、紀律與長期策略建立客戶信任 | 商業模式創新、誠信紀律、長期策略、客戶信任 | vision+2、discipline+2、customer+1 | ops、pro、biz | 把一個承諾寫下期限並準時交付，讓「說到做到」成為你的標籤 |
| 4 | 蘇姿丰 Lisa Su（AMD） | 工程師出身，以聚焦的產品路線圖與可靠執行帶領公司翻轉 | 工程深度、聚焦路線圖、可靠交付、穩健領導 | exec+2、craft+2、vision+1 | tech、ops | 把手上的工作砍到只剩最重要的 3 件，寫成你的季度路線圖 |
| 5 | 史蒂夫·賈伯斯 Steve Jobs（Apple） | 以產品品味、極致聚焦與發表會說故事聞名 | 產品品味、極致聚焦、說故事、高標準 | customer+2、comm+2、craft+1 | creative、biz、tech | 下次簡報只留一個重點，用一個故事開場 |
| 6 | 伊隆·馬斯克 Elon Musk（Tesla、SpaceX） | 以第一原理思考、極大膽目標與高速迭代聞名，風格具爭議 | 第一原理、極大膽目標、高速迭代、工程投入 | solve+2、innovate+2、exec+1 | tech、automation | 挑一個「大家都這樣做」的流程，從零問：如果重新設計會長怎樣？ |
| 7 | 傑夫·貝佐斯 Jeff Bezos（Amazon） | 顧客至上、長期主義，以六頁敘事備忘錄取代投影片 | 顧客至上、長期主義、寫作文化、決策機制 | customer+2、comm+1、solve+1、vision+1 | biz、ops、pro | 下次提案先寫一頁敘事文件，從顧客的問題寫起 |
| 8 | 英德拉·努伊 Indra Nooyi（前 PepsiCo） | 推動長期策略轉型，重視跨文化領導與人才 | 策略轉型、長期規劃、跨文化領導、重視人才 | vision+2、people+1、comm+1 | ops、biz、pro | 寫下你部門五年後的樣子，並找主管聊 15 分鐘 |
| 9 | 瑪麗·巴拉 Mary Barra（GM） | 在傳統產業推動文化與電動化轉型，強調當責與安全 | 文化變革、當責、安全與誠信、產業轉型 | discipline+2、people+1、vision+1 | ops、pro | 主動認領一個大家都在推的問題，公開承擔結果 |
| 10 | 華倫·巴菲特 Warren Buffett（波克夏） | 以長期思維、理性決策與淺白的股東信聞名 | 長期思維、理性決策、淺白溝通、紀律 | solve+2、discipline+1、comm+1 | pro、ops | 把一份複雜的報告改寫成國中生也看得懂的一頁 |
| 11 | 里德·哈斯廷斯 Reed Hastings（Netflix） | 建立「自由與責任」文化，敢於自我顛覆商業模式 | 自由與責任、坦誠回饋、自我顛覆、高人才密度 | people+2、innovate+1、learn+1 | tech、ops、creative | 給一位同事具體、真誠的回饋，也請他回饋你一件事 |
| 12 | 提姆·庫克 Tim Cook（Apple） | 以營運與供應鏈卓越著稱，穩健且重視價值觀 | 營運卓越、供應鏈思維、穩健紀律、價值觀領導 | exec+2、discipline+1、customer+1 | ops、biz | 找出你流程中最常延誤的一步，量出它平均花多久 |
| 13 | 布萊恩·切斯基 Brian Chesky（Airbnb） | 設計背景的創辦人，親自投入體驗細節 | 設計思維、體驗至上、投入細節、社群 | customer+2、craft+1、brand+1 | creative、biz | 用使用者身分完整走一次你的產品或服務，記下 5 個卡點 |
| 14 | 歐普拉 Oprah Winfrey | 以同理、說故事與真誠建立跨媒體的個人品牌 | 說故事、同理傾聽、個人品牌、真誠 | comm+2、brand+2、people+1 | creative、pro、biz | 寫一篇 300 字的「我為什麼做這份工作」，發在你習慣的平台 |
| 15 | 嚴長壽（前亞都麗緻） | 以服務精神、說故事與人才培育聞名台灣服務業 | 服務精神、說故事、人才培育、在地關懷 | customer+2、people+1、comm+1 | ops、biz、pro | 記住一位客戶或同事的一個小細節，下次見面時用上 |
| 16 | 瑞·達利歐 Ray Dalio（橋水） | 把決策原則化、系統化，倡導徹底透明 | 原則化、系統化決策、徹底透明、從錯誤學習 | solve+2、learn+1、discipline+1 | pro、ops | 寫下你最近一次決策失誤，以及下次的一條原則 |
| 17 | 蓋瑞·范納洽 Gary Vaynerchuk | 以內容行銷、社群經營與高產量個人品牌著稱 | 內容為王、社群經營、執行速度、個人品牌 | brand+2、innovate+1、exec+1 | biz、creative | 這週發 3 篇和你專業相關的短內容，不求完美 |
| 18 | 強尼·艾夫 Jony Ive | 以極致工藝與簡約設計語言聞名 | 極致工藝、簡約、跨團隊協作、材質與細節 | craft+2、customer+1、discipline+1 | creative、tech | 把一件作品再刪掉 30%，看看是不是更好 |
| 19 | 梅蘭妮·珀金斯 Melanie Perkins（Canva） | 讓設計人人可用，創業初期被大量投資人拒絕仍持續提案 | 設計民主化、堅持被拒、產品導向、使命感 | customer+2、comm+1、learn+1 | creative、biz、tech | 把你最常被拒絕的提案改寫一次，再找一個人提 |
| 20 | 莎拉·布雷克莉 Sara Blakely（Spanx） | 自學起家的創業者，以說故事行銷與擁抱失敗聞名 | 自學創業、說故事行銷、擁抱失敗、勇於開口 | learn+2、brand+1、comm+1 | biz、creative | 每天晚上寫下一件今天「失敗但學到」的事，持續一週 |

### 名單組成說明
- 地區：美國 14、台灣／華人 4（黃仁勳、張忠謀、蘇姿丰、嚴長壽）、印度裔 2（Nadella、Nooyi）。
- 性別：女性 6（蘇姿丰、Nooyi、Barra、Oprah、Perkins、Blakely），男性 14。初稿只有 4 位女性，擁有者指示先寫完再驗收，已補上 Perkins、Blakely。
- 職類覆蓋：每個 track 至少 5 位「適合」。
- 刻意排除：政治立場高度爭議或有重大訴訟、刑事爭議的人物。Elon Musk 因擁有者明確提出而保留，並在形象句標註「風格具爭議」。

---

## C. 畫面草案（② 目標與差距）

```
🎯 你想成為誰？  [ 角色 ]  [ 或選一位 Role model ]   ← 分頁切換
┌ Role model 卡（3 欄）────────────────┐
│ 黃仁勳                     適合技術   │
│ 數十年押注加速運算…                    │
│ 長期技術押注｜技術深度｜直接溝通｜韌性  │
│ → 加權：系統設計 +2、程式與工具 +2…    │
│ [選這位]                              │
└──────────────────────────────────────┘
選了之後：
  ✨ 你選擇向「黃仁勳」看齊（疊加在目標角色「架構師」上）
  特質 → 你的能力 → 目前 / 目標（原 → 加權後）
  你現在就能做的事：選一個你看好的技術方向…
  [取消 role model]
  小字免責
有 key：輸入任何人物 → AI 產生同格式條目（標「AI 生成，請自行查證」）
```

---

## D. 請擁有者確認
- [ ] 特質維度（11 個）與各框架對應是否合理？
- [ ] 18 位名單要增刪誰？女性與台灣人物要不要多補？
- [ ] 每位的特質與加權是否貼切？
- [ ] 「你現在就能做的事」這個設計要不要保留？
- [ ] role model 是「疊加在目標角色上」而非取代，可以嗎？

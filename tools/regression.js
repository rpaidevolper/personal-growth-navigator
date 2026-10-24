/* 回歸測試：在瀏覽器開啟 App 後，於 DevTools console 執行
 *   await (await fetch("../tools/regression.js")).text().then(eval); await runRegression();
 * （本機以專案根目錄起 http server，開 /output/個人成長導航系統.html）
 * 會清除這個瀏覽器的 App 資料。每項回傳 {name, ok, detail}。
 * 涵蓋 BACKLOG #12–#16 的測試回饋情境；之後修 bug 請把重現步驟加進來。
 */
window.runRegression = async function () {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const S = () => JSON.parse(localStorage.getItem(Object.keys(localStorage).filter((k) => /^growth-nav-v\d+$/.test(k)).sort().pop()) || "null");
  const results = [];
  const check = (name, ok, detail) => results.push({ name, ok: !!ok, detail });
  window.confirm = () => true;
  // 只送 input 事件、不送 change，模擬行動版 Safari / 自動化工具 / 輸入法情境
  const typeOnly = (el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); };
  // 完全不送事件，只改 value（最嚴苛：靠互動前的 flush）
  const silent = (el, v) => { el.value = v; };
  const nav = async (t) => { $('nav button[data-tab="' + t + '"]').click(); await sleep(60); };
  const wizardBasic = async (role, hours, horizon, track, stage) => {
    await nav("now"); $('[data-ns="0"]').click(); await sleep(40);
    typeOnly($('[data-p=role]'), role); silent($('[data-p=hours]'), hours); typeOnly($('[data-p=horizon]'), horizon);
    $('.rolecard[data-track="' + track + '"]').click(); await sleep(40);
    $('.rolecard[data-stage="' + stage + '"]').click(); await sleep(40);
  };
  const finishWizard = async (rateIdx) => {
    $("#btnNow0").click(); await sleep(50);
    for (let i = 0; i < 16 && !$("#btnNow1"); i++) { $$(".lvopt")[rateIdx]?.click(); await sleep(15); }
    $("#btnNow1").click(); await sleep(30); $("#btnNow2").click(); await sleep(30); $("#btnNow3").click(); await sleep(40);
    await nav("goal"); $$(".rolecard[data-role]")[0].click(); await sleep(60);
  };

  localStorage.clear(); location.hash = ""; await nav("dash");
  if ($("#btnReset")) { $("#btnReset").click(); await sleep(60); }

  // #12-1 只送 input、點卡片後重畫，值不能被舊值蓋掉
  await wizardBasic("行銷助理", "2", "12", "biz", "junior");
  check("#12 點工作類型卡片後保留輸入", $('[data-p=role]').value === "行銷助理" && S().profile.role === "行銷助理", { dom: $('[data-p=role]').value, saved: S().profile.role });
  check("#12 完全無事件的欄位在互動時被寫回", S().profile.hours === "2", { hours: S().profile.hours });
  // #12-2 必填提示：缺欄位按下一步 → 欄位旁提示；補齊後消失、不出現舊 toast
  typeOnly($('[data-p=role]'), ""); $("#btnNow0").click(); await sleep(40);
  const hintShown = $('.fhint[data-hint="role"]').textContent;
  typeOnly($('[data-p=role]'), "行銷助理"); await sleep(20);
  check("#12 必填提示出現後補齊即消失", hintShown && !$('.fhint[data-hint="role"]').textContent, { hintShown });
  await finishWizard(0);
  // #12-3 編輯基本資料 → 換頁 → 回來，值要是新的
  await nav("now"); $('[data-ns="0"]').click(); await sleep(40);
  typeOnly($('[data-p=role]'), "資深自動化工程師"); silent($('[data-p=hours]'), "8"); silent($('[data-p=horizon]'), "18");
  await nav("dash"); await nav("now"); $('[data-ns="4"]').click(); await sleep(40);
  const sum = $("#tab-now").innerText;
  check("#12 編輯後換頁再回來顯示新值", S().profile.role === "資深自動化工程師" && S().profile.hours === "8" && S().profile.horizon === "18" && sum.indexOf("資深自動化工程師") >= 0, { role: S().profile.role, hours: S().profile.hours, horizon: S().profile.horizon });

  // #13 先在行銷框架加入計畫，再切到技術框架
  await nav("plan"); $("#tab-plan [data-add]").click(); await sleep(50);
  const oldTitle = S().plan[0].t;
  await nav("now"); $('[data-ns="0"]').click(); await sleep(40);
  $('.rolecard[data-track="tech"]').click(); await sleep(30); $('.rolecard[data-stage="expert"]').click(); await sleep(30);
  await finishWizard(2);
  await nav("plan");
  check("#13 切換框架後出現舊計畫處理選項", $("#btnPlanKeep") && $("#btnPlanRebuild") && $("#btnPlanReeval"), { oldTitle });
  const navTxt = $("#nav").innerText;
  check("#13 導覽列沒有同時出現 ✓ 與 🔒", !$$("nav button.lock.done").length, { navTxt });
  $("#btnPlanKeep").click(); await sleep(50);
  check("#13 保留後標示「來自舊角色」且不再詢問", S().plan[0].keepOld && !$("#btnPlanKeep") && $("#tab-plan").innerText.indexOf("來自舊角色") >= 0, {});

  // #14 獨立專家：說帖與機會改用客戶語境
  await nav("goal");
  const goalTxt = $("#tab-goal").innerText;
  check("#14 獨立專家看不到「向主管爭取」「跨部門提案」", goalTxt.indexOf("向主管爭取") < 0 && goalTxt.indexOf("跨部門提案") < 0, {});
  $("#tab-goal [data-pitch]").click(); await sleep(40);
  const pt = $("#pitchTxt").textContent;
  check("#14 說帖是客戶提案（含報價、無主管）", pt.indexOf("報價") >= 0 && pt.indexOf("主管") < 0, { head: pt.split("\n")[0] });

  // #15 新鮮人：部分計分、最小下一步
  await nav("dash"); $("#btnReset").click(); await sleep(60);
  await wizardBasic("行銷助理", "3", "12", "biz", "junior"); await finishWizard(0);
  await nav("goal");
  const pcts = $$("#tab-goal .rec:not(.rolecard) b").map((b) => b.textContent);
  check("#15 新鮮人不再一排 0%", pcts.filter((x) => x === "準備度 0%").length === 0, { pcts: pcts.slice(0, 5) });
  check("#15 未準備好的機會顯示最小下一步", $$("#tab-goal .mini").length > 0, {});

  // #16 精力不足：禁用、顯示差額、點擊說明原因（每週 1 小時 → 每張行動卡耗精力很高，選一張後其他卡就不夠）
  await nav("now"); $('[data-ns="0"]').click(); await sleep(40); typeOnly($('[data-p=hours]'), "1");
  await nav("sim"); $("#btnNewSim").click(); await sleep(60);
  $$(".pick[data-pick]:not(.off)").find((c) => c.dataset.pick !== "rest")?.click(); await sleep(40);
  const off = $$(".pick.off").find((c) => c.innerText.indexOf("還差") >= 0);
  off?.click(); await sleep(30);
  check("#16 精力不足的卡片顯示差額並說明原因", off && off.innerText.indexOf("還差") >= 0 && $("#toast").textContent.indexOf("精力不足") >= 0, { toast: $("#toast").textContent });

  // A：同一型態只出一張機會卡；標題帶入職稱；專業服務不出現「客戶交付」
  await nav("dash"); $("#btnReset").click(); await sleep(60);
  await wizardBasic("財務主管", "5", "12", "pro", "lead"); await finishWizard(1);
  await nav("goal"); if ($("#btnOppAll")) { $("#btnOppAll").click(); await sleep(40); }
  const oppCards = $$("#tab-goal .rec:not(.rolecard)").filter((r) => r.querySelector(".chip.o"));
  const genTn = oppCards.map((r) => r.querySelector(".chip.o").textContent).filter((t) => t !== "精選機會");
  check("A 同一型態只出一張機會卡", genTn.length === new Set(genTn).size, { genTn });
  const titles = oppCards.map((r) => r.querySelector(".t").textContent);
  check("A 機會標題帶入職稱", titles.some((t) => t.indexOf("財務主管") >= 0), { first: titles[0] });
  check("A 專業服務不出現「客戶交付」", titles.every((t) => t.indexOf("客戶交付") < 0), {});

  // B：AI 新增機會、AI 產生角色（模擬 AI 回應，不需要真的 key）
  $("#btnAI").click(); await sleep(40);
  $("#aiProv").value = "claude"; $("#aiClaudeKey").value = "sk-ant-test"; $("#btnAISave").click(); await sleep(60);
  const realFetch = window.fetch;
  const mock = (obj) => Promise.resolve({ ok: true, json: () => Promise.resolve({ content: [{ type: "text", text: JSON.stringify(obj) }] }) });
  window.fetch = (u, o) => {
    const q = JSON.parse(o.body).messages[0].content;
    if (q.indexOf("爭取或主動發起") >= 0) return mock({ items: [
      { tn: "結帳流程", t: "把月結從 8 天縮到 5 天", d: "盤點月結步驟，找出等待最久的兩步先自動化。", comps: ["domain", "analysis", "bogus"], req: [{ id: "domain", level: 3 }], mini: "記錄這個月每個結帳步驟花幾小時", h: 40 },
      { tn: "預算管理", t: "主導下年度部門預算編列", d: "整理三年實績，提出有依據的預算與假設。", comps: ["analysis"], req: [], mini: "下載過去三年的實際數", h: 30 },
      { tn: "無效", t: "x", d: "x", comps: ["bogus"], req: [], mini: "x", h: 5 }] });
    if (q.indexOf("想成為「") >= 0) return mock({ name: "財務長", d: "負責公司財務策略、資金與風險", tgt: [{ id: "domain", level: 5 }, { id: "comm", level: 5 }] });
    return realFetch(u, o);
  };
  await nav("goal"); $("#btnAINewOpp").click(); await sleep(200);
  const aiCards = $$("#tab-goal .rec").filter((r) => r.innerText.indexOf("✨ AI 產生") >= 0 && r.querySelector(".chip.o"));
  check("B AI 新增機會：有效的才加入並標示", aiCards.length === 2 && S().aiOpps.items.length === 2, { n: aiCards.length });
  aiCards[0].querySelector("[data-add]").click(); await sleep(50);
  check("B AI 機會加入計畫時記錄來源", S().plan.some((p) => p.src === "ai"), {});
  $("#aiRoleName").value = "財務長"; $("#btnAIRole").click(); await sleep(200);
  check("B AI 產生角色卡並設為目標", S().profile.target === "財務長" && S().lv.domain.tgt === 5 && $$(".rolecard[data-role]")[0].innerText.indexOf("AI 產生") >= 0, { target: S().profile.target });
  window.fetch = realFetch;

  // F：免費 AI 額度（site.json 的 ai.enabled 為 true 時才測）。沒填 key 也能用；額度用完時說明清楚
  $("#btnAI").click(); await sleep(40);
  if ($("#aiFree")) {
    $("#aiClaudeKey").value = ""; $("#aiFree").checked = true; $("#btnAISave").click(); await sleep(60);
    await nav("goal");
    const aiBtn = !!$("#btnAINewOpp");
    let req = null, mode = "ok";
    window.fetch = (u, o) => {
      if (String(u).indexOf("/functions/v1/ai") >= 0) {
        req = { u, o };
        if (mode === "quota") return Promise.resolve({ ok: false, status: 429, json: () => Promise.resolve({ error: "quota", scope: "client", limit: 30, message: "今天的免費 AI 次數（30 次）已用完" }) });
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ used: 3, limit: 30, text: "```json\n" + JSON.stringify({ items: [{ tn: "結帳流程", t: "把月結從 8 天縮到 5 天", d: "盤點月結步驟。", comps: ["domain"], req: [], mini: "記錄每個步驟花幾小時", h: 40 }] }) + "\n```" }) });
      }
      return realFetch(u, o);
    };
    const n0 = (S().aiOpps && S().aiOpps.items.length) || 0;
    $("#btnAINewOpp").click(); await sleep(200);
    const fb = req ? JSON.parse(req.o.body) : {};
    check("F 沒填 key 也能用免費額度（不送 Claude key、帶 schema 與瀏覽器編號）", aiBtn && req && !req.o.headers["x-api-key"] && fb.schema && fb.client && S().aiOpps && S().aiOpps.items.length === n0 + 1 && S().ai.freeUse.used === 3, { aiBtn, n0, n: S().aiOpps && S().aiOpps.items.length });
    mode = "quota"; $("#btnAINewOpp").click(); await sleep(200);
    window.fetch = realFetch;
    $("#btnAI").click(); await sleep(40);
    check("F 額度用完時提示改用自己的 key，面板顯示剩 0 次", $("#toast").textContent.indexOf("Claude key") >= 0 && $("#aiPanel").innerText.indexOf("還剩 0 次") >= 0, { toast: $("#toast").textContent });
    $("#btnAIClose").click();
  } else { $("#btnAIClose").click(); }

  // G：遊戲化。載入範例只記錄不慶祝；勾一個步驟 XP +15；取消勾選扣回
  await nav("dash"); $("#btnReset").click(); await sleep(60);
  $("#btnSample").click(); await sleep(120);
  const xpOf = () => Number(($(".hud .ttl")?.textContent || "").split(" ")[0]);
  check("G 載入範例不跳慶祝且有 HUD", !$(".cele") && S().gx && /Lv\.\d/.test($(".hud").textContent), { hud: $(".hud")?.textContent });
  await nav("plan"); $("#tab-plan [data-add]").click(); await sleep(50); await nav("dash");
  $$(".cele").forEach((c) => c.remove());
  const x0 = xpOf(), box = $$('#tab-dash input[data-step]').find((b) => !b.checked);
  box.click(); await sleep(60);
  const x1 = xpOf();
  await nav("plan");
  const doneBox = () => $$('#tab-plan input[data-step]').find((b) => b.dataset.step === box.dataset.step && b.checked);
  for (let i = 0; i < 2 && !doneBox(); i++) { $("#tab-plan [data-openitem]").click(); await sleep(40); }
  doneBox().click(); await sleep(60);
  check("G 勾步驟 +15 XP、取消扣回", x1 - x0 === 15 && xpOf() === x0, { x0, x1, x2: xpOf() });
  $("#btnHud").click(); await sleep(40);
  check("G 點 HUD 開啟成就面板", !$("#gamePanel").classList.contains("hide") && $$("#gamePanel .badge").length === 14, {});
  $$(".cele").forEach((c) => c.remove());
  $("#gamePanel").classList.add("hide");

  // S：一鍵分享。不勾聲明不能送；送到 Supabase 時 email 不在公開內容裡、只送 INSERT（return=minimal）
  $("#btnShare").click(); await sleep(60);
  check("S 分享頁不需要另外填表就能預覽", $("#tab-share").innerText.indexOf("能力自評") >= 0 && $$("[data-shi]").length === 8, {});
  const realFetch2 = window.fetch; let sent = null;
  window.fetch = (u, o) => { if (String(u).indexOf("/rest/v1/") >= 0) { sent = { u, o }; return Promise.resolve({ ok: true, text: () => Promise.resolve("") }); } return realFetch2(u, o); };
  $("#btnShSubmit").click(); await sleep(60);
  const blocked = !sent && $("#toast").textContent.indexOf("聲明") >= 0;
  $('[data-sh="email"]').value = "me@example.com"; $('[data-sh="email"]').dispatchEvent(new Event("input", { bubbles: true }));
  $('[data-shc="decl"]').click(); await sleep(20); $('[data-shc="consent"]').click(); await sleep(20);
  $("#btnShSubmit").click(); await sleep(150);
  window.fetch = realFetch2;
  const body = sent ? JSON.parse(sent.o.body) : {};
  check("S 未勾聲明時擋下", blocked, { toast: $("#toast").textContent });
  check("S 送出到 Supabase：格式正確、email 不進公開內容", sent && sent.o.headers.Prefer === "return=minimal" && body.payload.format === "growth-nav-path" && body.contact_email === "me@example.com" && JSON.stringify(body.payload).indexOf("me@example.com") < 0 && S().share.sentAt, { keys: Object.keys(body) });

  localStorage.clear();
  const failed = results.filter((r) => !r.ok);
  console.table(results.map((r) => ({ 項目: r.name, 結果: r.ok ? "✓" : "✗" })));
  return { passed: results.length - failed.length, failed: failed.length, results };
};

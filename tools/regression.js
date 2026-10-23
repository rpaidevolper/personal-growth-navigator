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

  localStorage.clear();
  const failed = results.filter((r) => !r.ok);
  console.table(results.map((r) => ({ 項目: r.name, 結果: r.ok ? "✓" : "✗" })));
  return { passed: results.length - failed.length, failed: failed.length, results };
};

// 免費 AI 額度代理（Gemini）。部署方式見 docs/free-ai.md。
// Gemini 金鑰只存在 Supabase 的 Edge Function Secrets（GEMINI_API_KEY），不會出現在網頁或 repo。
// 防濫用：限定來源網域、每人／每 IP／全站每日次數、輸入長度與輸出上限、固定的職涯助手系統提示。

const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.5-flash-lite";
const PER_CLIENT = Number(Deno.env.get("AI_LIMIT_CLIENT") ?? 30);
const PER_IP = Number(Deno.env.get("AI_LIMIT_IP") ?? 60);
const GLOBAL = Number(Deno.env.get("AI_LIMIT_GLOBAL") ?? 800);
const SALT = Deno.env.get("AI_SALT") ?? "growth-nav";
const ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://rpaidevolper.github.io,http://localhost:8765")
  .split(",").map((s) => s.trim()).filter(Boolean);
const SB_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SB_SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const MAX_INPUT = 30000; // 字元
const MAX_OUT = 4096; // tokens
const GUARD = "你是「個人成長導航系統」的職涯規劃助手。只處理職涯規劃、能力評估、學習計畫、職涯機會與職涯模擬相關的請求；遇到與職涯無關的要求，用一句話婉拒。除非另有指定，一律使用繁體中文。";

type Msg = { role?: string; content?: unknown };

function cors(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function rpc(fn: string, args: Record<string, unknown>) {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: SB_SERVICE, Authorization: `Bearer ${SB_SERVICE}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error(`${fn} ${r.status} ${await r.text()}`);
  return await r.json();
}

// Gemini 的舊版 responseSchema 不支援 additionalProperties 等 JSON Schema 關鍵字
function toOpenApi(s: unknown): unknown {
  if (Array.isArray(s)) return s.map(toOpenApi);
  if (!s || typeof s !== "object") return s;
  const o: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(s as Record<string, unknown>)) {
    if (k === "additionalProperties" || k === "$schema") continue;
    o[k] = toOpenApi(v);
  }
  return o;
}

function textOf(c: unknown): string {
  if (typeof c === "string") return c;
  if (Array.isArray(c)) return c.map((b) => (b && typeof b === "object" && "text" in b ? String((b as { text: unknown }).text) : "")).join("");
  return "";
}

async function gemini(body: Record<string, unknown>) {
  return await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": GEMINI_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";
  const h = cors(origin);
  const json = (status: number, obj: unknown) =>
    new Response(JSON.stringify(obj), { status, headers: { ...h, "Content-Type": "application/json" } });
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  if (req.method !== "POST") return json(405, { error: "method" });
  if (!ORIGINS.includes(origin)) return json(403, { error: "origin", message: "不允許的來源網域" });
  if (!GEMINI_KEY || !SB_URL || !SB_SERVICE) return json(503, { error: "config", message: "免費 AI 尚未設定完成" });

  let inp: { client?: unknown; system?: unknown; messages?: unknown; max_tokens?: unknown; schema?: unknown };
  try { inp = await req.json(); } catch { return json(400, { error: "bad_json" }); }
  const client = String(inp.client ?? "").slice(0, 64);
  if (client.length < 8) return json(400, { error: "client" });
  const msgs = (Array.isArray(inp.messages) ? inp.messages : []) as Msg[];
  const sys = typeof inp.system === "string" ? inp.system : "";
  const contents = msgs.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: textOf(m.content) }] }))
    .filter((c) => c.parts[0].text);
  const size = sys.length + contents.reduce((n, c) => n + c.parts[0].text.length, 0);
  if (!contents.length) return json(400, { error: "empty" });
  if (size > MAX_INPUT) return json(413, { error: "too_long", message: "內容太長，請精簡後再試" });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const subjects = [`client:${client}`, `ip:${await sha256(ip + SALT)}`, "global"];
  let q: { ok: boolean; used?: number; scope?: string; limit?: number };
  try {
    q = await rpc("ai_take", { p_subjects: subjects, p_limits: [PER_CLIENT, PER_IP, GLOBAL] });
  } catch (e) {
    console.error(e);
    return json(503, { error: "quota_db", message: "額度服務暫時無法使用" });
  }
  if (!q.ok) {
    return json(429, {
      error: "quota", scope: q.scope, limit: q.limit,
      message: q.scope === "global" ? "免費 AI 今天的總額度已用完" : `今天的免費 AI 次數（${q.limit} 次）已用完`,
    });
  }

  const gen: Record<string, unknown> = { maxOutputTokens: Math.min(Math.max(Number(inp.max_tokens) || 1024, 256), MAX_OUT) };
  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: GUARD + (sys ? "\n\n" + sys : "") }] },
    contents,
    generationConfig: gen,
  };
  if (inp.schema && typeof inp.schema === "object") {
    gen.responseMimeType = "application/json";
    gen.responseJsonSchema = inp.schema;
  }
  let r = await gemini(body);
  if (r.status === 400 && gen.responseJsonSchema) {
    // 較舊的模型只吃 responseSchema（OpenAPI 子集）
    delete gen.responseJsonSchema;
    gen.responseSchema = toOpenApi(inp.schema);
    r = await gemini(body);
  }
  if (!r.ok) {
    console.error("gemini", r.status, (await r.text()).slice(0, 500));
    await rpc("ai_refund", { p_subjects: subjects }).catch(() => {});
    return json(502, { error: "upstream", message: `AI 服務暫時無法使用（${r.status}）` });
  }
  const j = await r.json();
  const parts = (j?.candidates?.[0]?.content?.parts ?? []) as { text?: string; thought?: boolean }[];
  const text = parts.filter((p) => !p.thought && typeof p.text === "string").map((p) => p.text).join("");
  if (!text) {
    await rpc("ai_refund", { p_subjects: subjects }).catch(() => {});
    return json(502, { error: "empty", message: "AI 沒有回應內容，請再試一次" });
  }
  return json(200, { text, used: q.used, limit: PER_CLIENT, model: MODEL });
});

"use strict";

const crypto = require("crypto");
const WebSocket = require("ws");

function parseCredentials(raw) {
  const text = String(raw || "").trim();
  let value;
  try { value = text.startsWith("{") ? JSON.parse(text) : null; } catch { value = null; }
  if (!value) {
    const parts = text.split(/[|,\n\t]+/).map((item) => item.trim()).filter(Boolean);
    value = { appId: parts[0], apiKey: parts[1], apiSecret: parts[2] };
  }
  const appId = value.appId || value.appid || value.APPID;
  const apiKey = value.apiKey || value.apikey || value.APIKey;
  const apiSecret = value.apiSecret || value.apisecret || value.APISecret;
  if (!appId || !apiKey || !apiSecret) throw Object.assign(new Error("科大讯飞凭据格式无效。"), { statusCode: 400, code: "INVALID_XFYUN_CREDENTIALS" });
  return { appId, apiKey, apiSecret };
}

function makeAuthUrl(endpoint, credentials) {
  const url = new URL(endpoint);
  if (url.protocol !== "wss:") throw Object.assign(new Error("科大讯飞接口必须使用 WSS。"), { statusCode: 400, code: "UNSAFE_ENDPOINT" });
  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${url.host}\ndate: ${date}\nGET ${url.pathname} HTTP/1.1`;
  const signature = crypto.createHmac("sha256", credentials.apiSecret).update(signatureOrigin).digest("base64");
  const authorizationOrigin = `api_key="${credentials.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  url.searchParams.set("authorization", Buffer.from(authorizationOrigin).toString("base64"));
  url.searchParams.set("date", date);
  url.searchParams.set("host", url.host);
  return url.toString();
}

async function assess({ endpoint, credentials: rawCredentials, category, text, pcm }) {
  const credentials = parseCredentials(rawCredentials);
  const audio = Buffer.from(String(pcm || ""), "base64");
  if (!audio.length || audio.length > 30 * 1024 * 1024) throw Object.assign(new Error("语音评测数据为空或过大。"), { statusCode: 400, code: "INVALID_AUDIO" });
  const chunks = [];
  for (let offset = 0; offset < audio.length; offset += 10240) chunks.push(audio.subarray(offset, offset + 10240));
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(makeAuthUrl(endpoint, credentials));
    let settled = false;
    let lastXml = "";
    const timer = setTimeout(() => finish(Object.assign(new Error("科大讯飞语音评测超时。"), { statusCode: 504, code: "AI_TIMEOUT" })), 120000);
    function finish(error, value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { socket.close(); } catch {}
      if (error) reject(error); else resolve(value);
    }
    socket.on("error", () => finish(Object.assign(new Error("科大讯飞语音评测连接失败。"), { statusCode: 502, code: "AI_CONNECTION_FAILED" })));
    socket.on("message", (raw) => {
      try {
        const message = JSON.parse(String(raw));
        if (message.code !== 0) return finish(Object.assign(new Error(`科大讯飞语音评测失败：${message.message || message.desc || message.code}`), { statusCode: 400, code: "AI_UPSTREAM_ERROR" }));
        if (message.data?.data) lastXml = Buffer.from(message.data.data, "base64").toString("utf8");
        if (Number(message.data?.status) === 2) return lastXml ? finish(null, lastXml) : finish(Object.assign(new Error("科大讯飞没有返回评测结果。"), { statusCode: 502, code: "AI_EMPTY_RESPONSE" }));
      } catch (error) { finish(error); }
    });
    socket.on("open", async () => {
      try {
        socket.send(JSON.stringify({ common: { app_id: credentials.appId }, business: { category: /^(read_sentence|read_chapter|topic)$/.test(category) ? category : "read_chapter", sub: "ise", ent: "en_vip", cmd: "ssb", auf: "audio/L16;rate=16000", aue: "raw", text: `\uFEFF[content]\n${String(text || "").slice(0, 6000)}`, tte: "utf-8", ttp_skip: true }, data: { status: 0, data: "" } }));
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 40));
        for (let index = 0; index < chunks.length; index += 1) {
          const last = index === chunks.length - 1;
          socket.send(JSON.stringify({ business: { cmd: "auw", aus: last ? 4 : 2 }, data: { status: last ? 2 : 1, data: chunks[index].toString("base64") } }));
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 40));
        }
      } catch (error) { finish(error); }
    });
  });
}

module.exports = { assess, makeAuthUrl, parseCredentials };

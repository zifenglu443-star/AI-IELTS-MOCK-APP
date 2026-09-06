"use strict";

function sendJson(res, status, value, headers = {}) {
  const body = Buffer.from(JSON.stringify(value));
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Content-Length": body.length, "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function sendError(res, error) {
  const status = Number(error?.statusCode || 500);
  if (status >= 500) console.error(error);
  sendJson(res, status, { error: { code: error?.code || "SERVER_ERROR", message: status >= 500 ? "服务器暂时无法完成请求。" : String(error.message || "请求失败。") } });
}

async function readBody(req, maxBytes = 10 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw Object.assign(new Error("请求内容过大。"), { statusCode: 413, code: "PAYLOAD_TOO_LARGE" });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readJson(req, maxBytes) {
  const body = await readBody(req, maxBytes);
  if (!body.length) return {};
  try {
    return JSON.parse(body.toString("utf8"));
  } catch {
    throw Object.assign(new Error("JSON 格式无效。"), { statusCode: 400, code: "INVALID_JSON" });
  }
}

function getClientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
}

module.exports = { getClientIp, readBody, readJson, sendError, sendJson };

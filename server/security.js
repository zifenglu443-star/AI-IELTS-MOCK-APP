"use strict";

const crypto = require("crypto");
const dns = require("dns/promises");
const net = require("net");

const COOKIE_NAME = "ieltsmock_session";

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function hashToken(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function validateUsername(value) {
  const username = String(value || "").trim();
  if (!/^[A-Za-z0-9_.-]{3,40}$/.test(username)) {
    throw Object.assign(new Error("用户名需为 3–40 位字母、数字、点、下划线或连字符。"), { statusCode: 400, code: "INVALID_USERNAME" });
  }
  return username;
}

function validatePassword(value) {
  const password = String(value || "");
  if (password.length < 12 || password.length > 200) {
    throw Object.assign(new Error("密码长度需为 12–200 位。"), { statusCode: 400, code: "WEAK_PASSWORD" });
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    throw Object.assign(new Error("密码需同时包含大写字母、小写字母、数字和符号。"), { statusCode: 400, code: "WEAK_PASSWORD" });
  }
  return password;
}

function parseCookies(header = "") {
  return Object.fromEntries(String(header).split(";").map((item) => item.trim()).filter(Boolean).map((item) => {
    const index = item.indexOf("=");
    return index < 0 ? [item, ""] : [item.slice(0, index), decodeURIComponent(item.slice(index + 1))];
  }));
}

function sessionCookie(token, maxAgeSeconds = 30 * 24 * 60 * 60) {
  const secure = process.env.COOKIE_SECURE === "false" ? "" : "; Secure";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

function clearSessionCookie() {
  const secure = process.env.COOKIE_SECURE === "false" ? "" : "; Secure";
  return `${COOKIE_NAME}=; Path=/; HttpOnly${secure}; SameSite=Strict; Max-Age=0`;
}

function getMasterKey() {
  const raw = String(process.env.ENCRYPTION_MASTER_KEY || "");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("ENCRYPTION_MASTER_KEY must decode to exactly 32 bytes");
  return key;
}

function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getMasterKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

function decryptJson(value) {
  if (!value) return {};
  const [version, iv, tag, ciphertext] = String(value).split(".");
  if (version !== "v1" || !iv || !tag || !ciphertext) throw new Error("Unsupported encrypted value");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getMasterKey(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64url")), decipher.final()]).toString("utf8"));
}

function isPrivateAddress(address) {
  if (!address) return true;
  if (net.isIPv4(address)) {
    const parts = address.split(".").map(Number);
    return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 ||
      (parts[0] === 169 && parts[1] === 254) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) || parts[0] >= 224;
  }
  const normalized = address.toLowerCase();
  return normalized === "::1" || normalized === "::" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}

async function validateExternalUrl(rawUrl, configuredBaseUrl) {
  const url = new URL(String(rawUrl));
  const base = new URL(String(configuredBaseUrl));
  if (url.protocol !== "https:" || base.protocol !== "https:") throw Object.assign(new Error("AI 接口必须使用 HTTPS。"), { statusCode: 400, code: "UNSAFE_ENDPOINT" });
  if (url.hostname.toLowerCase() !== base.hostname.toLowerCase()) throw Object.assign(new Error("请求地址与已保存的模型服务不一致。"), { statusCode: 400, code: "ENDPOINT_MISMATCH" });
  const records = await dns.lookup(url.hostname, { all: true, verbatim: true });
  if (!records.length || records.some((record) => isPrivateAddress(record.address))) {
    throw Object.assign(new Error("AI 接口不能指向本机或内网地址。"), { statusCode: 400, code: "UNSAFE_ENDPOINT" });
  }
  return url;
}

function maskSecret(value) {
  const text = String(value || "");
  if (!text) return "";
  return text.length <= 8 ? "••••••••" : `${text.slice(0, 3)}••••${text.slice(-3)}`;
}

module.exports = {
  COOKIE_NAME,
  clearSessionCookie,
  decryptJson,
  encryptJson,
  hashToken,
  isPrivateAddress,
  maskSecret,
  normalizeUsername,
  parseCookies,
  randomToken,
  sessionCookie,
  validateExternalUrl,
  validatePassword,
  validateUsername,
};

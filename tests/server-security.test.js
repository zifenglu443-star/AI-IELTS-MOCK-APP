"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  decryptJson,
  encryptJson,
  hashToken,
  isPrivateAddress,
  normalizeUsername,
  parseCookies,
  sessionCookie,
  validatePassword,
  validateUsername,
} = require("../server/security");
const { makeAuthUrl, parseCredentials } = require("../server/xfyun");

test("server secrets round-trip through authenticated encryption", () => {
  const previous = process.env.ENCRYPTION_MASTER_KEY;
  process.env.ENCRYPTION_MASTER_KEY = Buffer.alloc(32, 7).toString("base64");
  try {
    const encrypted = encryptJson({ writing: "secret-value" });
    assert.doesNotMatch(encrypted, /secret-value/);
    assert.deepEqual(decryptJson(encrypted), { writing: "secret-value" });
    const parts = encrypted.split(".");
    parts[3] = `${parts[3][0] === "A" ? "B" : "A"}${parts[3].slice(1)}`;
    assert.throws(() => decryptJson(parts.join(".")));
  } finally {
    if (previous === undefined) delete process.env.ENCRYPTION_MASTER_KEY;
    else process.env.ENCRYPTION_MASTER_KEY = previous;
  }
});

test("account validation enforces stable usernames and strong passwords", () => {
  assert.equal(validateUsername("Admin.user-1"), "Admin.user-1");
  assert.equal(normalizeUsername(" Admin.User-1 "), "admin.user-1");
  assert.equal(validatePassword("LongEnough!Password9"), "LongEnough!Password9");
  assert.throws(() => validateUsername("a"), /3–40/);
  assert.throws(() => validatePassword("onlylowercase"), /大写字母/);
});

test("sessions use an opaque hash and strict cookie attributes", () => {
  assert.equal(hashToken("one"), hashToken("one"));
  assert.notEqual(hashToken("one"), hashToken("two"));
  const cookie = sessionCookie("token value");
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /SameSite=Strict/);
  assert.equal(parseCookies("a=1; ieltsmock_session=token%20value").ieltsmock_session, "token value");
});

test("SSRF guard classifies local and public addresses", () => {
  for (const address of ["127.0.0.1", "10.0.0.2", "172.20.1.2", "192.168.1.4", "169.254.169.254", "::1", "fd00::1"]) assert.equal(isPrivateAddress(address), true, address);
  assert.equal(isPrivateAddress("8.8.8.8"), false);
  assert.equal(isPrivateAddress("2606:4700:4700::1111"), false);
});

test("XFYun credentials are parsed and signed without exposing the secret", () => {
  const credentials = parseCredentials("app|key|secret");
  assert.deepEqual(credentials, { appId: "app", apiKey: "key", apiSecret: "secret" });
  const url = makeAuthUrl("wss://ise-api.xfyun.cn/v2/open-ise", credentials);
  assert.match(url, /^wss:\/\/ise-api\.xfyun\.cn/);
  assert.doesNotMatch(url, /secret/);
});

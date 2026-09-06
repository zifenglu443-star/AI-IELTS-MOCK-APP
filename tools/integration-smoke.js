"use strict";

const assert = require("node:assert/strict");
const unzipper = require("unzipper");

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:18080";
const bootstrapPassword = process.env.SMOKE_ADMIN_PASSWORD;
const changedAdminPassword = process.env.SMOKE_ADMIN_CHANGED_PASSWORD;
if (!bootstrapPassword || !changedAdminPassword) throw new Error("Smoke-test passwords are required.");

const suffix = Date.now().toString(36);
const passwords = {
  userATemp: `Tmp!A9-${suffix}-Strong`, userAFinal: `Final!A9-${suffix}-Strong`,
  userBTemp: `Tmp!B9-${suffix}-Strong`, userBFinal: `Final!B9-${suffix}-Strong`,
};

function session() {
  return { cookie: "", csrf: "" };
}

async function call(client, pathname, options = {}) {
  const headers = new Headers(options.headers || {});
  if (client.cookie) headers.set("Cookie", client.cookie);
  if (client.csrf && !["GET", "HEAD"].includes(options.method || "GET")) headers.set("X-CSRF-Token", client.csrf);
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(options.json);
  }
  const response = await fetch(`${baseUrl}${pathname}`, { ...options, headers });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) client.cookie = setCookie.split(";", 1)[0];
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : Buffer.from(await response.arrayBuffer());
  if (payload?.csrfToken) client.csrf = payload.csrfToken;
  return { response, payload };
}

async function expect(client, pathname, status, options) {
  const result = await call(client, pathname, options);
  assert.equal(result.response.status, status, `${options?.method || "GET"} ${pathname}: ${JSON.stringify(result.payload)}`);
  return result.payload;
}

async function login(username, password) {
  const client = session();
  const payload = await expect(client, "/api/auth/login", 200, { method: "POST", json: { username, password } });
  return { client, payload };
}

async function main() {
  const adminLogin = await login("admin", bootstrapPassword);
  assert.equal(adminLogin.payload.user.mustChangePassword, true);
  const blocked = await expect(adminLogin.client, "/api/library", 403);
  assert.equal(blocked.error.code, "PASSWORD_CHANGE_REQUIRED");
  await expect(adminLogin.client, "/api/auth/change-password", 200, { method: "POST", json: { currentPassword: bootstrapPassword, newPassword: changedAdminPassword } });

  const lastAdmin = await expect(adminLogin.client, `/api/admin/users/${adminLogin.payload.user.id}`, 409, { method: "PATCH", json: { role: "user" } });
  assert.equal(lastAdmin.error.code, "LAST_ADMIN");

  const userAName = `smokea_${suffix}`;
  const userBName = `smokeb_${suffix}`;
  const userA = (await expect(adminLogin.client, "/api/admin/users", 201, { method: "POST", json: { username: userAName, displayName: "Smoke A", password: passwords.userATemp } })).user;
  const userB = (await expect(adminLogin.client, "/api/admin/users", 201, { method: "POST", json: { username: userBName, displayName: "Smoke B", password: passwords.userBTemp } })).user;
  await expect(adminLogin.client, `/api/admin/users/${userB.id}`, 200, { method: "PATCH", json: { quotaBytes: 3 } });

  const aLogin = await login(userAName, passwords.userATemp);
  const bLogin = await login(userBName, passwords.userBTemp);
  await expect(aLogin.client, "/api/auth/change-password", 200, { method: "POST", json: { currentPassword: passwords.userATemp, newPassword: passwords.userAFinal } });
  await expect(bLogin.client, "/api/auth/change-password", 200, { method: "POST", json: { currentPassword: passwords.userBTemp, newPassword: passwords.userBFinal } });
  assert.equal((await expect(aLogin.client, "/api/admin/status", 403)).error.code, "ADMIN_REQUIRED");

  const libraryId = `smoke-lib-${suffix}`;
  const test = { testType: "reading", title: "Isolation test", durationMinutes: 1, sections: [{ title: "Passage 1", passage: "Text", groups: [{ title: "Questions", questionType: "blank", template: "Answer {{1}}", questions: [{ id: 1, text: "Answer ___", answer: ["yes"] }] }] }] };
  await expect(aLogin.client, "/api/library", 200, { method: "POST", json: { id: libraryId, test, source: "smoke" } });
  assert.equal((await expect(bLogin.client, "/api/library", 200)).entries.length, 0);

  const upload = await expect(aLogin.client, "/api/files/uploads", 201, { method: "POST", json: { name: "sample.txt", mimeType: "text/plain", sizeBytes: 4, totalChunks: 1, libraryEntryId: libraryId } });
  await expect(aLogin.client, `/api/files/uploads/${upload.uploadId}/chunks/0`, 200, { method: "PUT", headers: { "Content-Type": "application/octet-stream" }, body: Buffer.from("test") });
  await expect(aLogin.client, `/api/files/uploads/${upload.uploadId}/complete`, 200, { method: "POST", json: {} });
  assert.equal((await expect(bLogin.client, `/api/files/${upload.fileId}`, 404)).error.code, "NOT_FOUND");
  assert.equal((await call(aLogin.client, `/api/files/${upload.fileId}`, { headers: { Range: "bytes=1-2" } })).response.status, 206);
  assert.equal((await expect(bLogin.client, "/api/files/uploads", 413, { method: "POST", json: { name: "too-big.txt", mimeType: "text/plain", sizeBytes: 4, totalChunks: 1 } })).error.code, "QUOTA_EXCEEDED");

  const settingKey = `sk-smoke-${suffix}-NeverExport`;
  await expect(aLogin.client, "/api/settings", 200, { method: "PUT", json: { settings: { features: { merge: { providerKey: "glm", baseUrl: "https://api.example.com/v1/chat/completions", model: "model", apiKey: settingKey } } } } });
  const settings = await expect(aLogin.client, "/api/settings", 200);
  assert.equal(settings.settings.features.merge.apiKey, "");
  assert.equal(settings.settings.features.merge.secretConfigured, true);
  const backup = await call(aLogin.client, "/api/backup/export");
  assert.equal(backup.response.status, 200);
  const zip = await unzipper.Open.buffer(backup.payload);
  const manifest = await zip.files.find((file) => file.path === "backup.json").buffer();
  assert.equal(manifest.includes(settingKey), false);

  const attempt = await expect(aLogin.client, "/api/attempts", 201, { method: "POST", json: { libraryEntryId: libraryId, test, mode: "practice", durationSeconds: 60, idempotencyKey: `smoke-${suffix}` } });
  const secondA = await login(userAName, passwords.userAFinal);
  const takeover = await expect(secondA.client, `/api/attempts/${attempt.attempt.id}/takeover`, 200, { method: "POST", json: {} });
  assert.equal((await expect(aLogin.client, `/api/attempts/${attempt.attempt.id}`, 409, { method: "PATCH", json: { version: attempt.attempt.version, leaseToken: attempt.leaseToken, answers: { 1: "no" } } })).error.code, "LEASE_LOST");
  const saved = await expect(secondA.client, `/api/attempts/${attempt.attempt.id}`, 200, { method: "PATCH", json: { version: takeover.attempt.version, leaseToken: takeover.leaseToken, answers: { 1: "yes" }, remainingSeconds: 30 } });
  const submitted = await expect(secondA.client, `/api/attempts/${attempt.attempt.id}/submit`, 200, { method: "POST", json: { version: saved.attempt.version, leaseToken: takeover.leaseToken, answers: { 1: "yes" }, result: { title: "Isolation test", testType: "reading", mode: "practice", score: 1, total: 1, percent: 100 } } });
  const duplicate = await expect(secondA.client, `/api/attempts/${attempt.attempt.id}/submit`, 200, { method: "POST", json: {} });
  assert.equal(submitted.attempt.status, "submitted");
  assert.equal(duplicate.duplicate, true);

  await expect(adminLogin.client, "/api/admin/revoke-sessions", 200, { method: "POST", json: { userId: userA.id } });
  await expect(secondA.client, "/api/auth/me", 401);
  await expect(adminLogin.client, `/api/admin/users/${userB.id}`, 200, { method: "PATCH", json: { disabled: true } });
  await expect(session(), "/api/auth/login", 401, { method: "POST", json: { username: userBName, password: passwords.userBFinal } });

  const status = await expect(adminLogin.client, "/api/admin/status", 200);
  assert.ok(status.users >= 3);
  console.log("Integration smoke test passed: auth, admin guard, isolation, quota, encrypted settings, backup, files, leases, idempotent submit, revoke and disable.");
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

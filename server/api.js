"use strict";

const crypto = require("crypto");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const argon2 = require("argon2");
const archiver = require("archiver");
const unzipper = require("unzipper");
const xfyun = require("./xfyun");
const { pool, transaction } = require("./db");
const { getClientIp, readBody, readJson, sendError, sendJson } = require("./http");
const {
  COOKIE_NAME,
  clearSessionCookie,
  decryptJson,
  encryptJson,
  hashToken,
  maskSecret,
  normalizeUsername,
  parseCookies,
  randomToken,
  sessionCookie,
  validateExternalUrl,
  validatePassword,
  validateUsername,
} = require("./security");

const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(process.cwd(), "data"));
const FILES_DIR = path.join(DATA_DIR, "files");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const MAX_FILE_BYTES = Number(process.env.MAX_FILE_BYTES || 200 * 1024 * 1024);
const DEFAULT_QUOTA_BYTES = Number(process.env.DEFAULT_QUOTA_BYTES || 2 * 1024 * 1024 * 1024);
const SESSION_IDLE_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_ABSOLUTE_MS = 30 * 24 * 60 * 60 * 1000;
const LEASE_MS = 90 * 1000;
const loginAttempts = new Map();
const runningAiJobs = new Map();

function normalizeAnswer(value) {
  return String(value ?? "").trim().toLowerCase().replace(/[’‘]/g, "'").replace(/&/g, " and ").replace(/[-‐‑‒–—]/g, "").replace(/[.,;:!?()[\]{}"']/g, "").replace(/\s+/g, " ");
}

function gradeExpiredAttempt(row) {
  const test = row.test_snapshot || {};
  const answers = row.answers || {};
  if (test.testType === "writing") {
    const tasks = (test.sections || []).map((section, index) => ({ id: String(index + 1), title: section.title || `Writing Task ${index + 1}`, prompt: section.prompt || "", instructions: section.instructions || "", minWords: Number(section.minWords || 0), answer: answers[String(index + 1)] || "", words: String(answers[String(index + 1)] || "").trim().split(/\s+/).filter(Boolean).length }));
    return { title: test.title || "Writing Test", testType: "writing", mode: row.mode, score: "-", total: "-", percent: "-", tasks, words: tasks.reduce((sum, task) => sum + task.words, 0), autoSubmitted: true, completedAt: new Date().toISOString() };
  }
  if (test.testType === "speaking") {
    const recordings = row.audio_state?.recordings || {};
    const parts = (test.sections || []).map((section, index) => ({ id: String(index + 1), title: section.title || `Speaking Part ${index + 1}`, questions: section.questions || [], cueCard: section.cueCard || "", prompts: section.prompts || [], transcript: answers[String(index + 1)] || "", recording: recordings[String(index)] || null }));
    return { title: test.title || "Speaking Test", testType: "speaking", mode: row.mode, score: "-", total: "-", percent: "-", parts, recorded: parts.filter((part) => part.recording).length, autoSubmitted: true, completedAt: new Date().toISOString() };
  }
  const rows = [];
  for (const [sectionIndex, section] of (test.sections || []).entries()) {
    for (const [groupIndex, group] of (section.groups || []).entries()) {
      for (const question of (group.questions || [])) {
        const id = String(question.id);
        const expected = Array.isArray(question.answer) ? question.answer : [question.answer];
        const actual = answers[id];
        const points = Math.max(1, Number(question.points || (/^\d+\s*[-–]\s*\d+$/.test(id) ? Number(id.split(/[-–]/)[1]) - Number(id.split(/[-–]/)[0]) + 1 : 1)));
        const expectedSet = expected.map(normalizeAnswer).filter(Boolean);
        const actualSet = (Array.isArray(actual) ? actual : String(actual || "").split(/[;,|/、\s]+/)).map(normalizeAnswer).filter(Boolean);
        const awarded = group.questionType === "multi_choice" || points > 1
          ? [...new Set(actualSet)].filter((answer) => expectedSet.includes(answer)).length
          : (expectedSet.includes(normalizeAnswer(actual)) ? points : 0);
        rows.push({ id, sectionTitle: section.title || `Section ${sectionIndex + 1}`, sectionIndex, groupIndex, correct: awarded === points, awarded: Math.min(points, awarded), points, userAnswer: Array.isArray(actual) ? actual.join(", ") : String(actual || "-"), correctAnswer: expected.join(" / "), questionText: question.text || group.template || "", instructions: group.instructions || "", groupTitle: group.title || "" });
      }
    }
  }
  const score = rows.reduce((sum, item) => sum + item.awarded, 0);
  const total = rows.reduce((sum, item) => sum + item.points, 0);
  return { title: test.title || "IELTS Test", testType: test.testType, mode: row.mode, score, total, percent: total ? Math.round(score / total * 100) : 0, rows, autoSubmitted: true, completedAt: new Date().toISOString() };
}

async function expireDueAttempts() {
  const due = (await pool.query("SELECT * FROM attempts WHERE mode='mock' AND status='active' AND deadline_at IS NOT NULL AND deadline_at<=now() ORDER BY deadline_at LIMIT 100")).rows;
  for (const row of due) {
    if (row.test_snapshot?.testType === "listening" && !row.audio_state?.reviewStarted) {
      const audioState = { ...(row.audio_state || {}), reviewStarted: true, reviewStartedByServer: true };
      await pool.query("UPDATE attempts SET audio_state=$2,deadline_at=now()+interval '3 minutes',remaining_seconds=180,version=version+1,updated_at=now() WHERE id=$1 AND status='active' AND version=$3", [row.id, audioState, row.version]);
      continue;
    }
    await pool.query("UPDATE attempts SET status='expired',result_json=$2,submitted_at=now(),lease_token_hash=null,lease_expires_at=null,version=version+1,updated_at=now() WHERE id=$1 AND status='active' AND version=$3", [row.id, gradeExpiredAttempt(row), row.version]);
  }
}

async function recoverInterruptedAiJobs() {
  await pool.query("UPDATE ai_jobs SET status='failed',error_code='SERVICE_RESTARTED',error_message='服务重启中断了任务，可从该阶段重试。',completed_at=now(),updated_at=now() WHERE status='running'");
}

function newId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function routePath(url) {
  return new URL(url, "http://localhost").pathname;
}

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    disabled: row.disabled,
    mustChangePassword: row.must_change_password,
    quotaBytes: Number(row.quota_bytes),
    usedBytes: Number(row.used_bytes),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureDirectories() {
  await Promise.all([fsp.mkdir(FILES_DIR, { recursive: true }), fsp.mkdir(UPLOADS_DIR, { recursive: true })]);
}

async function audit(req, actorId, action, targetUserId = null, metadata = {}) {
  await pool.query(
    "INSERT INTO audit_logs(actor_user_id, action, target_user_id, metadata, ip_address) VALUES ($1,$2,$3,$4,$5)",
    [actorId, action, targetUserId, metadata, getClientIp(req)],
  );
}

async function ensureBootstrapAdmin() {
  const usernameRaw = process.env.ADMIN_BOOTSTRAP_USERNAME;
  const passwordRaw = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!usernameRaw || !passwordRaw) return false;
  const count = await pool.query("SELECT count(*)::int AS count FROM users");
  if (count.rows[0].count > 0) return false;
  const username = validateUsername(usernameRaw);
  const password = validatePassword(passwordRaw);
  await pool.query(
    "INSERT INTO users(id, username, username_normalized, display_name, password_hash, role, must_change_password, quota_bytes) VALUES ($1,$2,$3,$4,$5,'admin',true,$6)",
    [newId("usr"), username, normalizeUsername(username), "Administrator", await argon2.hash(password, { type: argon2.argon2id }), DEFAULT_QUOTA_BYTES],
  );
  return true;
}

function rateLimitLogin(req) {
  const key = getClientIp(req) || "unknown";
  const now = Date.now();
  const current = loginAttempts.get(key) || { attempts: [], blockedUntil: 0 };
  current.attempts = current.attempts.filter((time) => now - time < 15 * 60 * 1000);
  if (current.blockedUntil > now || current.attempts.length >= 10) {
    current.blockedUntil = Math.max(current.blockedUntil, now + 15 * 60 * 1000);
    loginAttempts.set(key, current);
    throw Object.assign(new Error("登录尝试过多，请稍后再试。"), { statusCode: 429, code: "LOGIN_RATE_LIMITED" });
  }
  current.attempts.push(now);
  loginAttempts.set(key, current);
  return () => loginAttempts.delete(key);
}

async function authenticate(req) {
  const token = parseCookies(req.headers.cookie || "")[COOKIE_NAME];
  if (!token) throw Object.assign(new Error("请先登录。"), { statusCode: 401, code: "UNAUTHENTICATED" });
  const result = await pool.query(
    `SELECT s.*, u.username, u.display_name, u.role, u.disabled, u.must_change_password, u.quota_bytes, u.used_bytes, u.updated_at AS user_updated_at
       FROM sessions s JOIN users u ON u.id=s.user_id
      WHERE s.token_hash=$1 AND s.expires_at > now() AND s.absolute_expires_at > now()`,
    [hashToken(token)],
  );
  const row = result.rows[0];
  if (!row || row.disabled) throw Object.assign(new Error("登录已失效。"), { statusCode: 401, code: "SESSION_EXPIRED" });
  const expiresAt = new Date(Math.min(Date.now() + SESSION_IDLE_MS, new Date(row.absolute_expires_at).getTime()));
  await pool.query("UPDATE sessions SET last_seen_at=now(), expires_at=$2 WHERE id=$1", [row.id, expiresAt]);
  return {
    session: row,
    user: publicUser({
      id: row.user_id,
      username: row.username,
      display_name: row.display_name,
      role: row.role,
      disabled: row.disabled,
      must_change_password: row.must_change_password,
      quota_bytes: row.quota_bytes,
      used_bytes: row.used_bytes,
      created_at: row.created_at,
      updated_at: row.user_updated_at,
    }),
  };
}

function requireCsrf(req, auth) {
  if (String(req.headers["x-csrf-token"] || "") !== auth.session.csrf_token) {
    throw Object.assign(new Error("请求校验失败，请刷新页面后重试。"), { statusCode: 403, code: "CSRF_FAILED" });
  }
}

function requireAdmin(auth) {
  if (auth.user.role !== "admin") throw Object.assign(new Error("需要管理员权限。"), { statusCode: 403, code: "ADMIN_REQUIRED" });
}

async function login(req, res) {
  const clearRateLimit = rateLimitLogin(req);
  const body = await readJson(req, 32 * 1024);
  const result = await pool.query("SELECT * FROM users WHERE username_normalized=$1", [normalizeUsername(body.username)]);
  const user = result.rows[0];
  const valid = user ? await argon2.verify(user.password_hash, String(body.password || "")).catch(() => false) : false;
  if (!user || !valid || user.disabled) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    throw Object.assign(new Error("用户名或密码错误。"), { statusCode: 401, code: "INVALID_CREDENTIALS" });
  }
  clearRateLimit();
  const token = randomToken();
  const csrfToken = randomToken(24);
  const sessionId = newId("ses");
  const absolute = new Date(Date.now() + SESSION_ABSOLUTE_MS);
  const idle = new Date(Date.now() + SESSION_IDLE_MS);
  await pool.query(
    "INSERT INTO sessions(id,user_id,token_hash,csrf_token,user_agent,ip_address,expires_at,absolute_expires_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
    [sessionId, user.id, hashToken(token), csrfToken, String(req.headers["user-agent"] || "").slice(0, 500), getClientIp(req), idle, absolute],
  );
  await audit(req, user.id, "auth.login", user.id, { sessionId });
  sendJson(res, 200, { user: publicUser(user), csrfToken, sessionId }, { "Set-Cookie": sessionCookie(token) });
}

async function authRoutes(req, res, pathname) {
  if (req.method === "POST" && pathname === "/api/auth/login") return login(req, res);
  const auth = await authenticate(req);
  if (req.method === "GET" && pathname === "/api/auth/me") return sendJson(res, 200, { user: auth.user, csrfToken: auth.session.csrf_token, sessionId: auth.session.id });
  if (req.method === "POST" && pathname === "/api/auth/logout") {
    requireCsrf(req, auth);
    await pool.query("DELETE FROM sessions WHERE id=$1", [auth.session.id]);
    await audit(req, auth.user.id, "auth.logout", auth.user.id);
    return sendJson(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
  }
  if (req.method === "POST" && pathname === "/api/auth/change-password") {
    requireCsrf(req, auth);
    const body = await readJson(req, 32 * 1024);
    const row = (await pool.query("SELECT password_hash FROM users WHERE id=$1", [auth.user.id])).rows[0];
    if (!await argon2.verify(row.password_hash, String(body.currentPassword || "")).catch(() => false)) {
      throw Object.assign(new Error("当前密码不正确。"), { statusCode: 400, code: "CURRENT_PASSWORD_INVALID" });
    }
    const password = validatePassword(body.newPassword);
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    await transaction(async (client) => {
      await client.query("UPDATE users SET password_hash=$2,must_change_password=false,updated_at=now() WHERE id=$1", [auth.user.id, passwordHash]);
      await client.query("DELETE FROM sessions WHERE user_id=$1 AND id<>$2", [auth.user.id, auth.session.id]);
    });
    await audit(req, auth.user.id, "auth.password_changed", auth.user.id);
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === "GET" && pathname === "/api/auth/sessions") {
    const rows = (await pool.query("SELECT id,user_agent,ip_address,created_at,last_seen_at,expires_at FROM sessions WHERE user_id=$1 ORDER BY last_seen_at DESC", [auth.user.id])).rows;
    return sendJson(res, 200, { sessions: rows.map((row) => ({ ...row, current: row.id === auth.session.id })) });
  }
  const sessionMatch = pathname.match(/^\/api\/auth\/sessions\/([^/]+)$/);
  if (req.method === "DELETE" && sessionMatch) {
    requireCsrf(req, auth);
    await pool.query("DELETE FROM sessions WHERE id=$1 AND user_id=$2", [sessionMatch[1], auth.user.id]);
    await audit(req, auth.user.id, "auth.session_revoked", auth.user.id, { sessionId: sessionMatch[1] });
    return sendJson(res, 200, { ok: true }, sessionMatch[1] === auth.session.id ? { "Set-Cookie": clearSessionCookie() } : {});
  }
  return false;
}

async function adminRoutes(req, res, pathname, auth) {
  requireAdmin(auth);
  if (!["GET", "HEAD"].includes(req.method)) requireCsrf(req, auth);
  if (req.method === "GET" && pathname === "/api/admin/users") {
    const query = new URL(req.url, "http://localhost").searchParams.get("q") || "";
    const rows = (await pool.query("SELECT * FROM users WHERE username ILIKE $1 OR display_name ILIKE $1 ORDER BY created_at DESC LIMIT 200", [`%${query}%`])).rows;
    return sendJson(res, 200, { users: rows.map(publicUser) });
  }
  if (req.method === "POST" && pathname === "/api/admin/users") {
    const body = await readJson(req, 64 * 1024);
    const username = validateUsername(body.username);
    const password = validatePassword(body.password);
    const role = body.role === "admin" ? "admin" : "user";
    const id = newId("usr");
    try {
      const row = (await pool.query(
        "INSERT INTO users(id,username,username_normalized,display_name,password_hash,role,must_change_password,quota_bytes) VALUES ($1,$2,$3,$4,$5,$6,true,$7) RETURNING *",
        [id, username, normalizeUsername(username), String(body.displayName || username).slice(0, 100), await argon2.hash(password, { type: argon2.argon2id }), role, Number(body.quotaBytes || DEFAULT_QUOTA_BYTES)],
      )).rows[0];
      await audit(req, auth.user.id, "admin.user_created", id, { role });
      return sendJson(res, 201, { user: publicUser(row) });
    } catch (error) {
      if (error.code === "23505") throw Object.assign(new Error("用户名已存在。"), { statusCode: 409, code: "USERNAME_EXISTS" });
      throw error;
    }
  }
  const userMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (req.method === "PATCH" && userMatch) {
    const body = await readJson(req, 32 * 1024);
    const targetId = userMatch[1];
    const row = await transaction(async (client) => {
      await client.query("SELECT pg_advisory_xact_lock(hashtext('ieltsmock-active-admin-guard'))");
      const target = (await client.query("SELECT * FROM users WHERE id=$1 FOR UPDATE", [targetId])).rows[0];
      if (!target) throw Object.assign(new Error("用户不存在。"), { statusCode: 404, code: "NOT_FOUND" });
      const nextRole = body.role === undefined ? target.role : body.role === "admin" ? "admin" : "user";
      const nextDisabled = body.disabled === undefined ? target.disabled : Boolean(body.disabled);
      if (target.role === "admin" && (nextRole !== "admin" || nextDisabled)) {
        const count = (await client.query("SELECT count(*)::int AS count FROM users WHERE role='admin' AND disabled=false AND id<>$1", [targetId])).rows[0].count;
        if (!count) throw Object.assign(new Error("不能禁用或降级最后一个有效管理员。"), { statusCode: 409, code: "LAST_ADMIN" });
      }
      const requestedQuota = body.quotaBytes === undefined ? Number(target.quota_bytes) : Math.floor(Number(body.quotaBytes));
      if (!Number.isFinite(requestedQuota) || requestedQuota < Number(target.used_bytes)) {
        throw Object.assign(new Error("容量必须是有效数字，且不能小于当前已用空间。"), { statusCode: 400, code: "INVALID_QUOTA" });
      }
      const updated = (await client.query(
        "UPDATE users SET display_name=$2,role=$3,disabled=$4,quota_bytes=$5,updated_at=now() WHERE id=$1 RETURNING *",
        [targetId, String(body.displayName ?? target.display_name).slice(0, 100), nextRole, nextDisabled, requestedQuota],
      )).rows[0];
      if (nextDisabled) await client.query("DELETE FROM sessions WHERE user_id=$1", [targetId]);
      return updated;
    });
    const nextRole = row.role;
    const nextDisabled = row.disabled;
    const quota = Number(row.quota_bytes);
    await audit(req, auth.user.id, "admin.user_updated", targetId, { role: nextRole, disabled: nextDisabled, quotaBytes: quota });
    return sendJson(res, 200, { user: publicUser(row) });
  }
  const resetMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)\/reset-password$/);
  if (req.method === "POST" && resetMatch) {
    const body = await readJson(req, 32 * 1024);
    const password = validatePassword(body.password);
    const result = await pool.query("UPDATE users SET password_hash=$2,must_change_password=true,updated_at=now() WHERE id=$1 RETURNING id", [resetMatch[1], await argon2.hash(password, { type: argon2.argon2id })]);
    if (!result.rowCount) throw Object.assign(new Error("用户不存在。"), { statusCode: 404, code: "NOT_FOUND" });
    await pool.query("DELETE FROM sessions WHERE user_id=$1", [resetMatch[1]]);
    await audit(req, auth.user.id, "admin.password_reset", resetMatch[1]);
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === "POST" && pathname === "/api/admin/revoke-sessions") {
    const body = await readJson(req, 32 * 1024);
    await pool.query("DELETE FROM sessions WHERE user_id=$1", [body.userId]);
    await audit(req, auth.user.id, "admin.sessions_revoked", body.userId);
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === "GET" && pathname === "/api/admin/audit") {
    const rows = (await pool.query("SELECT a.*,u.username AS actor_username,t.username AS target_username FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_user_id LEFT JOIN users t ON t.id=a.target_user_id ORDER BY a.created_at DESC LIMIT 300")).rows;
    return sendJson(res, 200, { audit: rows });
  }
  if (req.method === "GET" && pathname === "/api/admin/status") {
    const [users, attempts, files, jobs] = await Promise.all([
      pool.query("SELECT count(*)::int AS count FROM users"),
      pool.query("SELECT count(*)::int AS count FROM attempts WHERE status IN ('active','paused')"),
      pool.query("SELECT count(*)::int AS count,coalesce(sum(size_bytes),0)::bigint AS bytes FROM stored_files WHERE complete=true"),
      pool.query("SELECT count(*)::int AS count FROM ai_jobs WHERE status IN ('queued','running')"),
    ]);
    return sendJson(res, 200, { users: users.rows[0].count, activeAttempts: attempts.rows[0].count, files: files.rows[0].count, fileBytes: Number(files.rows[0].bytes), activeAiJobs: jobs.rows[0].count, version: process.env.APP_VERSION || "development" });
  }
  return false;
}

function libraryRow(row) {
  return { id: row.id, version: row.version, title: row.title, testType: row.test_type, source: row.source, test: row.test_json, generatedAssets: row.generated_assets, importedAt: row.imported_at, updatedAt: row.updated_at };
}

async function libraryRoutes(req, res, pathname, auth) {
  if (req.method === "GET" && pathname === "/api/library") {
    const rows = (await pool.query("SELECT * FROM library_entries WHERE user_id=$1 ORDER BY updated_at DESC", [auth.user.id])).rows;
    return sendJson(res, 200, { entries: rows.map(libraryRow) });
  }
  if (req.method === "POST" && pathname === "/api/library") {
    requireCsrf(req, auth);
    const body = await readJson(req, 12 * 1024 * 1024);
    const id = String(body.id || newId("lib"));
    const test = body.test;
    if (!test || typeof test !== "object") throw Object.assign(new Error("缺少有效考试数据。"), { statusCode: 400, code: "INVALID_TEST" });
    const row = (await pool.query(
      `INSERT INTO library_entries(id,user_id,title,test_type,source,test_json,generated_assets,imported_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,coalesce($8::timestamptz,now()))
       ON CONFLICT (user_id,id) DO UPDATE SET version=library_entries.version+1,title=excluded.title,test_type=excluded.test_type,source=excluded.source,test_json=excluded.test_json,generated_assets=excluded.generated_assets,updated_at=now()
       RETURNING *`,
      [id, auth.user.id, String(test.title || body.title || ""), String(test.testType || body.testType || ""), String(body.source || ""), test, JSON.stringify(body.generatedAssets || []), body.importedAt || null],
    )).rows[0];
    return sendJson(res, 200, { entry: libraryRow(row) });
  }
  const match = pathname.match(/^\/api\/library\/([^/]+)$/);
  if (req.method === "DELETE" && match) {
    requireCsrf(req, auth);
    const files = (await pool.query("SELECT id,storage_path,size_bytes,complete FROM stored_files WHERE library_entry_id=$1 AND user_id=$2", [match[1], auth.user.id])).rows;
    await transaction(async (client) => {
      await client.query("DELETE FROM stored_files WHERE library_entry_id=$1 AND user_id=$2", [match[1], auth.user.id]);
      await client.query("DELETE FROM library_entries WHERE id=$1 AND user_id=$2", [match[1], auth.user.id]);
      const bytes = files.reduce((sum, row) => sum + (row.complete ? Number(row.size_bytes || 0) : 0), 0);
      await client.query("UPDATE users SET used_bytes=greatest(0,used_bytes-$2),updated_at=now() WHERE id=$1", [auth.user.id, bytes]);
    });
    await Promise.all(files.map((row) => fsp.unlink(path.join(FILES_DIR, row.storage_path)).catch(() => {})));
    return sendJson(res, 200, { ok: true });
  }
  return false;
}

function attemptRow(row, includeLease = false) {
  const result = {
    id: row.id, libraryEntryId: row.library_entry_id, test: row.test_snapshot, mode: row.mode, status: row.status,
    version: row.version, startedAt: row.started_at, deadlineAt: row.deadline_at, pausedAt: row.paused_at,
    remainingSeconds: row.remaining_seconds, answers: row.answers, reviewIds: row.review_ids,
    currentQuestionId: row.current_question_id, currentSectionIndex: row.current_section_index,
    audioState: row.audio_state, fullMockState: row.full_mock_state, result: row.result_json, submittedAt: row.submitted_at, updatedAt: row.updated_at,
  };
  if (includeLease) result.leaseExpiresAt = row.lease_expires_at;
  return result;
}

async function verifyAttemptLease(id, userId, leaseToken, version) {
  const row = (await pool.query("SELECT * FROM attempts WHERE id=$1 AND user_id=$2", [id, userId])).rows[0];
  if (!row) throw Object.assign(new Error("考试记录不存在。"), { statusCode: 404, code: "NOT_FOUND" });
  if (row.lease_token_hash !== hashToken(leaseToken || "") || !row.lease_expires_at || new Date(row.lease_expires_at).getTime() < Date.now()) {
    throw Object.assign(new Error("这场考试已在其他设备打开，请先接管。"), { statusCode: 409, code: "LEASE_LOST", attempt: attemptRow(row) });
  }
  if (Number(version) !== Number(row.version)) throw Object.assign(new Error("服务器已有更新的答案，请重新加载。"), { statusCode: 409, code: "VERSION_CONFLICT", attempt: attemptRow(row) });
  return row;
}

async function attemptRoutes(req, res, pathname, auth) {
  if (req.method === "GET" && pathname === "/api/attempts/active") {
    const row = (await pool.query("SELECT * FROM attempts WHERE user_id=$1 AND status IN ('active','paused') ORDER BY updated_at DESC LIMIT 1", [auth.user.id])).rows[0];
    return sendJson(res, 200, { attempt: row ? attemptRow(row, true) : null });
  }
  if (req.method === "GET" && pathname === "/api/attempts/history") {
    const rows = (await pool.query("SELECT * FROM attempts WHERE user_id=$1 AND status IN ('submitted','expired') ORDER BY coalesce(submitted_at,updated_at) DESC", [auth.user.id])).rows;
    return sendJson(res, 200, { attempts: rows.map((row) => attemptRow(row)) });
  }
  if (req.method === "POST" && pathname === "/api/attempts") {
    requireCsrf(req, auth);
    const body = await readJson(req, 12 * 1024 * 1024);
    const mode = body.mode === "practice" ? "practice" : "mock";
    const duration = Math.max(60, Math.min(8 * 60 * 60, Number(body.durationSeconds || 3600)));
    const id = String(body.id || newId("att"));
    const idempotencyKey = String(body.idempotencyKey || id);
    const leaseToken = randomToken();
    const deadline = mode === "mock" ? new Date(Date.now() + duration * 1000) : null;
    const result = await pool.query(
      `INSERT INTO attempts(id,user_id,library_entry_id,test_snapshot,mode,idempotency_key,lease_token_hash,lease_expires_at,deadline_at,remaining_seconds,full_mock_state)
       VALUES ($1,$2,$3,$4,$5,$6,$7,now()+interval '90 seconds',$8,$9,$10)
       ON CONFLICT (user_id,idempotency_key) DO NOTHING RETURNING *`,
      [id, auth.user.id, body.libraryEntryId || null, body.test, mode, idempotencyKey, hashToken(leaseToken), deadline, duration, body.fullMockState || {}],
    );
    if (!result.rowCount) {
      const existing = (await pool.query("SELECT * FROM attempts WHERE user_id=$1 AND idempotency_key=$2", [auth.user.id, idempotencyKey])).rows[0];
      return sendJson(res, 200, { attempt: attemptRow(existing), leaseToken: null, existing: true });
    }
    return sendJson(res, 201, { attempt: attemptRow(result.rows[0]), leaseToken });
  }
  const takeover = pathname.match(/^\/api\/attempts\/([^/]+)\/takeover$/);
  if (req.method === "POST" && takeover) {
    requireCsrf(req, auth);
    const leaseToken = randomToken();
    const row = (await pool.query("UPDATE attempts SET lease_token_hash=$3,lease_expires_at=now()+interval '90 seconds',version=version+1,updated_at=now() WHERE id=$1 AND user_id=$2 AND status IN ('active','paused') RETURNING *", [takeover[1], auth.user.id, hashToken(leaseToken)])).rows[0];
    if (!row) throw Object.assign(new Error("没有可接管的考试。"), { statusCode: 404, code: "NOT_FOUND" });
    return sendJson(res, 200, { attempt: attemptRow(row), leaseToken });
  }
  const abandon = pathname.match(/^\/api\/attempts\/([^/]+)\/abandon$/);
  if (req.method === "POST" && abandon) {
    requireCsrf(req, auth);
    await pool.query("UPDATE attempts SET status='abandoned',lease_token_hash=null,lease_expires_at=null,updated_at=now() WHERE id=$1 AND user_id=$2 AND status IN ('active','paused')", [abandon[1], auth.user.id]);
    return sendJson(res, 200, { ok: true });
  }
  const submit = pathname.match(/^\/api\/attempts\/([^/]+)\/submit$/);
  if (req.method === "POST" && submit) {
    requireCsrf(req, auth);
    const body = await readJson(req, 12 * 1024 * 1024);
    const current = (await pool.query("SELECT * FROM attempts WHERE id=$1 AND user_id=$2", [submit[1], auth.user.id])).rows[0];
    if (!current) throw Object.assign(new Error("考试记录不存在。"), { statusCode: 404, code: "NOT_FOUND" });
    if (current.status === "submitted" || current.status === "expired") return sendJson(res, 200, { attempt: attemptRow(current), duplicate: true });
    await verifyAttemptLease(submit[1], auth.user.id, body.leaseToken, body.version);
    const expired = current.mode === "mock" && current.deadline_at && new Date(current.deadline_at).getTime() < Date.now();
    const row = (await pool.query(
      "UPDATE attempts SET status=$3,result_json=$4,answers=$5,review_ids=$6,submitted_at=now(),version=version+1,lease_token_hash=null,lease_expires_at=null,updated_at=now() WHERE id=$1 AND user_id=$2 RETURNING *",
      [submit[1], auth.user.id, expired ? "expired" : "submitted", body.result || {}, body.answers || current.answers, JSON.stringify(body.reviewIds || current.review_ids)],
    )).rows[0];
    return sendJson(res, 200, { attempt: attemptRow(row) });
  }
  const resultMatch = pathname.match(/^\/api\/attempts\/([^/]+)\/result$/);
  if (req.method === "PATCH" && resultMatch) {
    requireCsrf(req, auth);
    const body = await readJson(req, 12 * 1024 * 1024);
    const row = (await pool.query("UPDATE attempts SET result_json=$3,version=version+1,updated_at=now() WHERE id=$1 AND user_id=$2 AND status IN ('submitted','expired') RETURNING *", [resultMatch[1], auth.user.id, body.result || {}])).rows[0];
    if (!row) throw Object.assign(new Error("考试记录不存在。"), { statusCode: 404, code: "NOT_FOUND" });
    return sendJson(res, 200, { attempt: attemptRow(row) });
  }
  const match = pathname.match(/^\/api\/attempts\/([^/]+)$/);
  if (req.method === "DELETE" && match) {
    requireCsrf(req, auth);
    const files = (await pool.query("SELECT storage_path,size_bytes,complete FROM stored_files WHERE attempt_id=$1 AND user_id=$2", [match[1], auth.user.id])).rows;
    await transaction(async (client) => {
      await client.query("DELETE FROM stored_files WHERE attempt_id=$1 AND user_id=$2", [match[1], auth.user.id]);
      const deleted = await client.query("DELETE FROM attempts WHERE id=$1 AND user_id=$2", [match[1], auth.user.id]);
      if (!deleted.rowCount) throw Object.assign(new Error("考试记录不存在。"), { statusCode: 404, code: "NOT_FOUND" });
      const bytes = files.reduce((sum, row) => sum + (row.complete ? Number(row.size_bytes || 0) : 0), 0);
      await client.query("UPDATE users SET used_bytes=greatest(0,used_bytes-$2),updated_at=now() WHERE id=$1", [auth.user.id, bytes]);
    });
    await Promise.all(files.map((row) => fsp.unlink(path.join(FILES_DIR, row.storage_path)).catch(() => {})));
    return sendJson(res, 200, { ok: true });
  }
  if (req.method === "PATCH" && match) {
    requireCsrf(req, auth);
    const body = await readJson(req, 12 * 1024 * 1024);
    const current = await verifyAttemptLease(match[1], auth.user.id, body.leaseToken, body.version);
    const status = body.status === "paused" && current.mode === "practice" ? "paused" : "active";
    const requestedDeadline = current.mode === "mock" && body.deadlineAt
      ? new Date(body.deadlineAt)
      : current.deadline_at;
    if (requestedDeadline && Number.isNaN(requestedDeadline.getTime())) {
      throw Object.assign(new Error("考试截止时间无效。"), { statusCode: 400, code: "INVALID_DEADLINE" });
    }
    const row = (await pool.query(
      `UPDATE attempts SET answers=$3,review_ids=$4,current_question_id=$5,current_section_index=$6,audio_state=$7,full_mock_state=$8,
       remaining_seconds=$9,status=$10,paused_at=CASE WHEN $10='paused' THEN now() ELSE null END,version=version+1,
       deadline_at=$11,lease_expires_at=now()+interval '90 seconds',updated_at=now() WHERE id=$1 AND user_id=$2 RETURNING *`,
      [match[1], auth.user.id, body.answers || {}, JSON.stringify(body.reviewIds || []), body.currentQuestionId || null, Number(body.currentSectionIndex || 0), body.audioState || {}, body.fullMockState || {}, Number(body.remainingSeconds ?? current.remaining_seconds), status, requestedDeadline],
    )).rows[0];
    return sendJson(res, 200, { attempt: attemptRow(row) });
  }
  return false;
}

async function fileRoutes(req, res, pathname, auth) {
  if (req.method === "POST" && pathname === "/api/files/uploads") {
    requireCsrf(req, auth);
    const body = await readJson(req, 64 * 1024);
    const size = Math.max(0, Math.floor(Number(body.sizeBytes)));
    if (!size || size > MAX_FILE_BYTES) throw Object.assign(new Error(`单个文件不能超过 ${Math.floor(MAX_FILE_BYTES / 1024 / 1024)} MiB。`), { statusCode: 413, code: "FILE_TOO_LARGE" });
    if (auth.user.usedBytes + size > auth.user.quotaBytes) throw Object.assign(new Error("服务器存储空间不足，请删除旧附件或联系管理员。"), { statusCode: 413, code: "QUOTA_EXCEEDED" });
    const fileId = newId("fil");
    const uploadId = newId("upl");
    const totalChunks = Math.max(1, Math.min(10000, Number(body.totalChunks || 1)));
    const relativePath = path.join(auth.user.id, `${fileId}.bin`);
    await fsp.mkdir(path.join(UPLOADS_DIR, uploadId), { recursive: true });
    await transaction(async (client) => {
      await client.query("INSERT INTO stored_files(id,user_id,attempt_id,library_entry_id,purpose,original_name,mime_type,size_bytes,storage_path) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", [fileId, auth.user.id, body.attemptId || null, body.libraryEntryId || null, String(body.purpose || "attachment"), String(body.name || "file").slice(0, 255), String(body.mimeType || "application/octet-stream").slice(0, 150), size, relativePath]);
      await client.query("INSERT INTO upload_sessions(id,user_id,file_id,total_chunks,expires_at) VALUES ($1,$2,$3,$4,now()+interval '24 hours')", [uploadId, auth.user.id, fileId, totalChunks]);
    });
    return sendJson(res, 201, { uploadId, fileId, chunkSize: 2 * 1024 * 1024 });
  }
  const chunkMatch = pathname.match(/^\/api\/files\/uploads\/([^/]+)\/chunks\/(\d+)$/);
  if (req.method === "PUT" && chunkMatch) {
    requireCsrf(req, auth);
    const upload = (await pool.query("SELECT * FROM upload_sessions WHERE id=$1 AND user_id=$2 AND expires_at>now()", [chunkMatch[1], auth.user.id])).rows[0];
    const index = Number(chunkMatch[2]);
    if (!upload || index < 0 || index >= upload.total_chunks) throw Object.assign(new Error("上传会话无效。"), { statusCode: 404, code: "UPLOAD_NOT_FOUND" });
    const body = await readBody(req, 3 * 1024 * 1024);
    await fsp.writeFile(path.join(UPLOADS_DIR, upload.id, String(index).padStart(6, "0")), body, { flag: "wx" }).catch(async (error) => {
      if (error.code !== "EEXIST") throw error;
    });
    const received = Array.from(new Set([...(upload.received_chunks || []), index])).sort((a, b) => a - b);
    await pool.query("UPDATE upload_sessions SET received_chunks=$2 WHERE id=$1", [upload.id, JSON.stringify(received)]);
    return sendJson(res, 200, { received: received.length, total: upload.total_chunks });
  }
  const finalizeMatch = pathname.match(/^\/api\/files\/uploads\/([^/]+)\/complete$/);
  if (req.method === "POST" && finalizeMatch) {
    requireCsrf(req, auth);
    const upload = (await pool.query("SELECT us.*,sf.size_bytes,sf.storage_path FROM upload_sessions us JOIN stored_files sf ON sf.id=us.file_id WHERE us.id=$1 AND us.user_id=$2 FOR UPDATE", [finalizeMatch[1], auth.user.id])).rows[0];
    if (!upload || (upload.received_chunks || []).length !== upload.total_chunks) throw Object.assign(new Error("文件分块尚未上传完整。"), { statusCode: 409, code: "UPLOAD_INCOMPLETE" });
    const target = path.join(FILES_DIR, upload.storage_path);
    await fsp.mkdir(path.dirname(target), { recursive: true });
    const handle = await fsp.open(target, "w", 0o600);
    try {
      for (let index = 0; index < upload.total_chunks; index += 1) {
        await handle.writeFile(await fsp.readFile(path.join(UPLOADS_DIR, upload.id, String(index).padStart(6, "0"))));
      }
    } finally {
      await handle.close();
    }
    const stat = await fsp.stat(target);
    if (stat.size !== Number(upload.size_bytes)) {
      await fsp.unlink(target).catch(() => {});
      throw Object.assign(new Error("上传文件大小校验失败。"), { statusCode: 409, code: "SIZE_MISMATCH" });
    }
    try {
      await transaction(async (client) => {
        const owner = (await client.query("SELECT used_bytes,quota_bytes FROM users WHERE id=$1 FOR UPDATE", [auth.user.id])).rows[0];
        if (!owner || Number(owner.used_bytes) + stat.size > Number(owner.quota_bytes)) {
          throw Object.assign(new Error("服务器存储空间不足，请删除旧附件或联系管理员。"), { statusCode: 413, code: "QUOTA_EXCEEDED" });
        }
        await client.query("UPDATE stored_files SET complete=true,updated_at=now() WHERE id=$1", [upload.file_id]);
        await client.query("UPDATE users SET used_bytes=used_bytes+$2,updated_at=now() WHERE id=$1", [auth.user.id, stat.size]);
        await client.query("DELETE FROM upload_sessions WHERE id=$1", [upload.id]);
      });
    } catch (error) {
      await fsp.unlink(target).catch(() => {});
      throw error;
    }
    await fsp.rm(path.join(UPLOADS_DIR, upload.id), { recursive: true, force: true });
    return sendJson(res, 200, { fileId: upload.file_id, sizeBytes: stat.size });
  }
  const fileMatch = pathname.match(/^\/api\/files\/([^/]+)$/);
  if (fileMatch && ["GET", "HEAD"].includes(req.method)) {
    const row = (await pool.query("SELECT * FROM stored_files WHERE id=$1 AND user_id=$2 AND complete=true", [fileMatch[1], auth.user.id])).rows[0];
    if (!row) throw Object.assign(new Error("文件不存在。"), { statusCode: 404, code: "NOT_FOUND" });
    const target = path.join(FILES_DIR, row.storage_path);
    const size = Number(row.size_bytes);
    const commonHeaders = { "Content-Type": row.mime_type, "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(row.original_name)}`, "Cache-Control": "private, no-store", "Accept-Ranges": "bytes" };
    const range = String(req.headers.range || "").match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || start >= size) {
        res.writeHead(416, { ...commonHeaders, "Content-Range": `bytes */${size}` });
        return res.end();
      }
      res.writeHead(206, { ...commonHeaders, "Content-Length": end - start + 1, "Content-Range": `bytes ${start}-${end}/${size}` });
      return req.method === "HEAD" ? res.end() : fs.createReadStream(target, { start, end }).pipe(res);
    }
    res.writeHead(200, { ...commonHeaders, "Content-Length": size });
    return req.method === "HEAD" ? res.end() : fs.createReadStream(target).pipe(res);
  }
  if (fileMatch && req.method === "DELETE") {
    requireCsrf(req, auth);
    const row = (await pool.query("DELETE FROM stored_files WHERE id=$1 AND user_id=$2 RETURNING *", [fileMatch[1], auth.user.id])).rows[0];
    if (row) {
      await fsp.unlink(path.join(FILES_DIR, row.storage_path)).catch(() => {});
      await pool.query("UPDATE users SET used_bytes=greatest(0,used_bytes-$2),updated_at=now() WHERE id=$1", [auth.user.id, Number(row.size_bytes)]);
    }
    return sendJson(res, 200, { ok: true });
  }
  return false;
}

function splitSettings(input) {
  const settings = structuredClone(input || {});
  const secrets = {};
  for (const [feature, config] of Object.entries(settings.features || {})) {
    if (config && Object.prototype.hasOwnProperty.call(config, "apiKey")) {
      const secret = String(config.apiKey || "").trim();
      if (secret && secret !== "server-stored") secrets[feature] = secret;
      delete config.apiKey;
    }
  }
  return { settings, secrets };
}

function exposedSettings(row) {
  const settings = structuredClone(row?.settings_json || {});
  const secrets = decryptJson(row?.encrypted_secrets);
  for (const [feature, config] of Object.entries(settings.features || {})) {
    config.apiKey = "";
    config.secretConfigured = Boolean(secrets[feature]);
    config.secretMask = maskSecret(secrets[feature]);
  }
  return settings;
}

async function settingsRoutes(req, res, pathname, auth) {
  if (req.method === "GET" && pathname === "/api/settings") {
    const row = (await pool.query("SELECT * FROM model_settings WHERE user_id=$1", [auth.user.id])).rows[0];
    return sendJson(res, 200, { settings: exposedSettings(row) });
  }
  if (req.method === "PUT" && pathname === "/api/settings") {
    requireCsrf(req, auth);
    const body = await readJson(req, 512 * 1024);
    const existing = (await pool.query("SELECT * FROM model_settings WHERE user_id=$1", [auth.user.id])).rows[0];
    const previousSecrets = decryptJson(existing?.encrypted_secrets);
    const { settings, secrets } = splitSettings(body.settings);
    const mergedSecrets = body.clearSecrets ? secrets : { ...previousSecrets, ...secrets };
    await pool.query(
      `INSERT INTO model_settings(user_id,settings_json,encrypted_secrets,updated_at) VALUES ($1,$2,$3,now())
       ON CONFLICT (user_id) DO UPDATE SET settings_json=excluded.settings_json,encrypted_secrets=excluded.encrypted_secrets,updated_at=now()`,
      [auth.user.id, settings, encryptJson(mergedSecrets)],
    );
    return sendJson(res, 200, { settings: exposedSettings({ settings_json: settings, encrypted_secrets: encryptJson(mergedSecrets) }) });
  }
  if (req.method === "POST" && pathname === "/api/settings/test") {
    requireCsrf(req, auth);
    const body = await readJson(req, 64 * 1024);
    const feature = String(body.feature || "merge");
    const row = (await pool.query("SELECT * FROM model_settings WHERE user_id=$1", [auth.user.id])).rows[0];
    const config = row?.settings_json?.features?.[feature];
    const secret = decryptJson(row?.encrypted_secrets)[feature];
    if (!config || !secret) throw Object.assign(new Error("请先保存该功能的模型设置和 API Key。"), { statusCode: 400, code: "MODEL_NOT_CONFIGURED" });
    if (config.providerKey === "xfyun") return sendJson(res, 200, { ok: true, message: "科大讯飞凭据格式已保存；完整连接将在语音评测时验证。" });
    await validateExternalUrl(config.baseUrl, config.baseUrl);
    let response;
    try {
      response = await fetchValidated(config.baseUrl, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` }, body: JSON.stringify({ model: config.model, max_tokens: 1, messages: [{ role: "user", content: "ping" }] }), signal: AbortSignal.timeout(20000) }, config.baseUrl);
    } catch (error) {
      if (error.name === "TimeoutError") throw Object.assign(new Error("模型连接测试超时。"), { statusCode: 504, code: "AI_TIMEOUT" });
      throw error;
    }
    if (!response.ok) throw Object.assign(new Error(`模型服务返回 HTTP ${response.status}。`), { statusCode: 400, code: response.status === 401 || response.status === 403 ? "AI_AUTH_FAILED" : response.status === 429 ? "AI_RATE_LIMITED" : "AI_CONNECTION_FAILED" });
    return sendJson(res, 200, { ok: true, message: "连接成功。" });
  }
  return false;
}

async function fetchValidated(url, options, configuredBaseUrl) {
  let current = await validateExternalUrl(url, configuredBaseUrl);
  for (let redirect = 0; redirect < 4; redirect += 1) {
    const response = await fetch(current, { ...options, redirect: "manual" });
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get("location");
    if (!location) return response;
    current = await validateExternalUrl(new URL(location, current).toString(), configuredBaseUrl);
  }
  throw Object.assign(new Error("AI 接口重定向次数过多。"), { statusCode: 400, code: "TOO_MANY_REDIRECTS" });
}

async function aiRoutes(req, res, pathname, auth) {
  if (req.method === "GET" && pathname === "/api/ai-jobs") {
    const rows = (await pool.query("SELECT id,feature,stage,status,input_hash,request_meta,error_code,error_message,retry_count,created_at,updated_at,completed_at FROM ai_jobs WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100", [auth.user.id])).rows;
    return sendJson(res, 200, { jobs: rows });
  }
  const cancelMatch = pathname.match(/^\/api\/ai-jobs\/([^/]+)\/cancel$/);
  if (req.method === "POST" && cancelMatch) {
    requireCsrf(req, auth);
    await pool.query("UPDATE ai_jobs SET cancel_requested=true,status=CASE WHEN status='queued' THEN 'cancelled' ELSE status END,updated_at=now() WHERE id=$1 AND user_id=$2", [cancelMatch[1], auth.user.id]);
    runningAiJobs.get(cancelMatch[1])?.abort(new Error("AI_JOB_CANCELLED"));
    return sendJson(res, 200, { ok: true });
  }
  const jobMatch = pathname.match(/^\/api\/ai-jobs\/([^/]+)$/);
  if (req.method === "GET" && jobMatch) {
    const row = (await pool.query("SELECT * FROM ai_jobs WHERE id=$1 AND user_id=$2", [jobMatch[1], auth.user.id])).rows[0];
    if (!row) throw Object.assign(new Error("AI 任务不存在。"), { statusCode: 404, code: "NOT_FOUND" });
    return sendJson(res, 200, { job: row });
  }
  if (req.method === "POST" && pathname === "/api/ai-jobs/proxy") {
    requireCsrf(req, auth);
    const feature = String(req.headers["x-ai-feature"] || "merge");
    const upstreamUrl = String(req.headers["x-upstream-url"] || "");
    const row = (await pool.query("SELECT * FROM model_settings WHERE user_id=$1", [auth.user.id])).rows[0];
    const config = row?.settings_json?.features?.[feature];
    const secret = decryptJson(row?.encrypted_secrets)[feature];
    if (!config || !secret) throw Object.assign(new Error("该 AI 功能尚未配置。"), { statusCode: 400, code: "MODEL_NOT_CONFIGURED" });
    await validateExternalUrl(upstreamUrl, config.baseUrl);
    const body = await readBody(req, 80 * 1024 * 1024);
    const jobId = String(req.headers["x-ai-job-id"] || newId("job"));
    await pool.query("INSERT INTO ai_jobs(id,user_id,feature,stage,status,input_hash,request_meta) VALUES ($1,$2,$3,$4,'running',$5,$6) ON CONFLICT (id) DO UPDATE SET stage=excluded.stage,status='running',updated_at=now()", [jobId, auth.user.id, feature, String(req.headers["x-ai-stage"] || "request"), crypto.createHash("sha256").update(body).digest("hex"), { upstreamHost: new URL(upstreamUrl).hostname, contentType: req.headers["content-type"] || "" }]);
    let response;
    let retries = 0;
    const controller = new AbortController();
    runningAiJobs.set(jobId, controller);
    req.once("aborted", () => controller.abort(new Error("AI_JOB_CANCELLED")));
    try {
      while (true) {
        const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(125000)]);
        response = await fetchValidated(upstreamUrl, { method: String(req.headers["x-upstream-method"] || "POST"), headers: { "Content-Type": String(req.headers["content-type"] || "application/json"), Authorization: `Bearer ${secret}` }, body, signal }, config.baseUrl);
        if (![429, 500, 502, 503, 504].includes(response.status) || retries >= 2) break;
        retries += 1;
        await new Promise((resolve) => setTimeout(resolve, 400 * (2 ** retries)));
      }
      const responseBody = Buffer.from(await response.arrayBuffer());
      let stageResult = { status: response.status, bytes: responseBody.length };
      if (response.ok && responseBody.length <= 10 * 1024 * 1024 && (response.headers.get("content-type") || "").includes("application/json")) {
        try { stageResult = { ...stageResult, body: JSON.parse(responseBody.toString("utf8")) }; } catch {}
      }
      await pool.query("UPDATE ai_jobs SET status=$2,retry_count=$3,result_json=$4,error_code=$5,error_message=$6,completed_at=now(),updated_at=now() WHERE id=$1", [jobId, response.ok ? "succeeded" : "failed", retries, stageResult, response.ok ? null : `HTTP_${response.status}`, response.ok ? null : responseBody.toString("utf8", 0, 500)]);
      res.writeHead(response.status, { "Content-Type": response.headers.get("content-type") || "application/octet-stream", "Content-Length": responseBody.length, "Cache-Control": "no-store", "X-AI-Job-Id": jobId });
      return res.end(responseBody);
    } catch (error) {
      const cancelled = controller.signal.aborted && String(controller.signal.reason?.message || "").includes("AI_JOB_CANCELLED");
      await pool.query("UPDATE ai_jobs SET status=$2,retry_count=$3,error_code=$4,error_message=$5,completed_at=now(),updated_at=now() WHERE id=$1", [jobId, cancelled ? "cancelled" : "failed", retries, cancelled ? "CANCELLED" : error.name === "TimeoutError" ? "TIMEOUT" : "UPSTREAM_FAILED", String(error.message || error).slice(0, 1000)]);
      if (cancelled) throw Object.assign(new Error("AI 任务已取消。"), { statusCode: 409, code: "AI_CANCELLED" });
      if (error.name === "TimeoutError") throw Object.assign(new Error("AI 请求超时。"), { statusCode: 504, code: "AI_TIMEOUT" });
      throw error;
    } finally {
      runningAiJobs.delete(jobId);
    }
  }
  if (req.method === "POST" && pathname === "/api/ai-jobs/xfyun-ise") {
    requireCsrf(req, auth);
    const body = await readJson(req, 45 * 1024 * 1024);
    const row = (await pool.query("SELECT * FROM model_settings WHERE user_id=$1", [auth.user.id])).rows[0];
    const config = row?.settings_json?.features?.fluency;
    const secret = decryptJson(row?.encrypted_secrets).fluency;
    if (!config || !secret) throw Object.assign(new Error("流利度评测尚未配置。"), { statusCode: 400, code: "MODEL_NOT_CONFIGURED" });
    const endpoint = String(config.baseUrl || "");
    const validationUrl = endpoint.replace(/^wss:/, "https:");
    await validateExternalUrl(validationUrl, validationUrl);
    const jobId = newId("job");
    await pool.query("INSERT INTO ai_jobs(id,user_id,feature,stage,status) VALUES ($1,$2,'fluency','xfyun-ise','running')", [jobId, auth.user.id]);
    try {
      const xml = await xfyun.assess({ endpoint, credentials: secret, category: body.category, text: body.text, pcm: body.pcm });
      await pool.query("UPDATE ai_jobs SET status='succeeded',result_json=$2,completed_at=now(),updated_at=now() WHERE id=$1", [jobId, { bytes: Buffer.byteLength(xml) }]);
      return sendJson(res, 200, { xml, jobId });
    } catch (error) {
      await pool.query("UPDATE ai_jobs SET status='failed',error_code=$2,error_message=$3,completed_at=now(),updated_at=now() WHERE id=$1", [jobId, error.code || "AI_UPSTREAM_FAILED", String(error.message || error)]);
      throw error;
    }
  }
  return false;
}

async function reviewRoutes(req, res, pathname, auth) {
  if (req.method === "GET" && pathname === "/api/reviews") {
    const rows = (await pool.query("SELECT * FROM review_records WHERE user_id=$1 ORDER BY updated_at DESC", [auth.user.id])).rows;
    return sendJson(res, 200, { reviews: rows });
  }
  if (req.method === "POST" && pathname === "/api/reviews") {
    requireCsrf(req, auth);
    const body = await readJson(req, 512 * 1024);
    const row = (await pool.query("INSERT INTO review_records(id,user_id,attempt_id,question_id,kind,data_json) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [newId("rev"), auth.user.id, body.attemptId || null, body.questionId || null, String(body.kind || "mistake"), body.data || {}])).rows[0];
    return sendJson(res, 201, { review: row });
  }
  return false;
}

async function documentRoutes(req, res, pathname, auth) {
  const match = pathname.match(/^\/api\/user-data\/([A-Za-z0-9_.-]{1,80})$/);
  if (!match) return false;
  if (req.method === "GET") {
    const row = (await pool.query("SELECT version,data_json,updated_at FROM user_documents WHERE user_id=$1 AND document_key=$2", [auth.user.id, match[1]])).rows[0];
    return sendJson(res, 200, { document: row ? { key: match[1], version: row.version, data: row.data_json, updatedAt: row.updated_at } : null });
  }
  if (req.method === "PUT") {
    requireCsrf(req, auth);
    const body = await readJson(req, 12 * 1024 * 1024);
    const row = (await pool.query("INSERT INTO user_documents(user_id,document_key,data_json) VALUES ($1,$2,$3) ON CONFLICT (user_id,document_key) DO UPDATE SET version=user_documents.version+1,data_json=excluded.data_json,updated_at=now() RETURNING version,data_json,updated_at", [auth.user.id, match[1], body.data || {}])).rows[0];
    return sendJson(res, 200, { document: { key: match[1], version: row.version, data: row.data_json, updatedAt: row.updated_at } });
  }
  return false;
}

async function accountDataRoutes(req, res, pathname, auth) {
  if (req.method !== "DELETE" || pathname !== "/api/account/data") return false;
  requireCsrf(req, auth);
  const [files, uploads] = await Promise.all([
    pool.query("SELECT storage_path FROM stored_files WHERE user_id=$1", [auth.user.id]),
    pool.query("SELECT id FROM upload_sessions WHERE user_id=$1", [auth.user.id]),
  ]);
  await transaction(async (client) => {
    await client.query("DELETE FROM review_records WHERE user_id=$1", [auth.user.id]);
    await client.query("DELETE FROM ai_jobs WHERE user_id=$1", [auth.user.id]);
    await client.query("DELETE FROM upload_sessions WHERE user_id=$1", [auth.user.id]);
    await client.query("DELETE FROM stored_files WHERE user_id=$1", [auth.user.id]);
    await client.query("DELETE FROM attempts WHERE user_id=$1", [auth.user.id]);
    await client.query("DELETE FROM library_entries WHERE user_id=$1", [auth.user.id]);
    await client.query("DELETE FROM user_documents WHERE user_id=$1", [auth.user.id]);
    await client.query("DELETE FROM migration_receipts WHERE user_id=$1", [auth.user.id]);
    await client.query("UPDATE users SET used_bytes=0,updated_at=now() WHERE id=$1", [auth.user.id]);
  });
  await Promise.all([
    ...files.rows.map((row) => fsp.unlink(path.join(FILES_DIR, row.storage_path)).catch(() => {})),
    ...uploads.rows.map((row) => fsp.rm(path.join(UPLOADS_DIR, row.id), { recursive: true, force: true }).catch(() => {})),
  ]);
  await audit(req, auth.user.id, "account.learning_data_cleared", auth.user.id);
  return sendJson(res, 200, { ok: true });
}

function remapJsonIds(value, maps) {
  if (Array.isArray(value)) return value.map((item) => remapJsonIds(item, maps));
  if (typeof value === "string") {
    const match = value.match(/^\/api\/files\/([^/?#]+)(.*)$/);
    if (match && maps.files.has(match[1])) return `/api/files/${maps.files.get(match[1])}${match[2]}`;
    return value;
  }
  if (!value || typeof value !== "object") return value;
  const next = {};
  for (const [key, item] of Object.entries(value)) {
    if (key === "fileId" && maps.files.has(item)) next[key] = maps.files.get(item);
    else if ((key === "libraryEntryId" || key === "library_entry_id") && maps.library.has(item)) next[key] = maps.library.get(item);
    else if ((key === "attemptId" || key === "attempt_id") && maps.attempts.has(item)) next[key] = maps.attempts.get(item);
    else next[key] = remapJsonIds(item, maps);
  }
  return next;
}

async function backupRoutes(req, res, pathname, auth) {
  if (req.method === "GET" && pathname === "/api/backup/export") {
    const [library, attempts, reviews, files, documents] = await Promise.all([
      pool.query("SELECT * FROM library_entries WHERE user_id=$1", [auth.user.id]),
      pool.query("SELECT * FROM attempts WHERE user_id=$1", [auth.user.id]),
      pool.query("SELECT * FROM review_records WHERE user_id=$1", [auth.user.id]),
      pool.query("SELECT * FROM stored_files WHERE user_id=$1 AND complete=true", [auth.user.id]),
      pool.query("SELECT document_key,version,data_json,updated_at FROM user_documents WHERE user_id=$1", [auth.user.id]),
    ]);
    const manifest = { format: "ielts-mock-backup", version: 1, exportedAt: new Date().toISOString(), library: library.rows, attempts: attempts.rows, reviews: reviews.rows, documents: documents.rows, files: files.rows.map((row) => ({ ...row, storage_path: undefined })) };
    res.writeHead(200, { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="ielts-mock-backup-${new Date().toISOString().slice(0, 10)}.zip"`, "Cache-Control": "no-store" });
    const archive = archiver("zip", { zlib: { level: 6 } });
    archive.on("error", (error) => res.destroy(error));
    archive.pipe(res);
    archive.append(JSON.stringify(manifest), { name: "backup.json" });
    for (const row of files.rows) {
      const target = path.join(FILES_DIR, row.storage_path);
      if (fs.existsSync(target)) archive.file(target, { name: `files/${row.id}` });
    }
    await archive.finalize();
    return true;
  }
  if (req.method === "POST" && pathname === "/api/backup/import-legacy") {
    requireCsrf(req, auth);
    const body = await readJson(req, 20 * 1024 * 1024);
    const key = String(body.migrationKey || "");
    if (!key) throw Object.assign(new Error("缺少迁移标识。"), { statusCode: 400, code: "MIGRATION_KEY_REQUIRED" });
    const existing = (await pool.query("SELECT result_json FROM migration_receipts WHERE user_id=$1 AND migration_key=$2", [auth.user.id, key])).rows[0];
    if (existing) return sendJson(res, 200, { ...existing.result_json, duplicate: true });
    let importedLibrary = 0;
    let importedHistory = 0;
    await transaction(async (client) => {
      for (const entry of Array.isArray(body.library) ? body.library : []) {
        if (!entry?.test) continue;
        const id = newId("lib");
        await client.query("INSERT INTO library_entries(id,user_id,title,test_type,source,test_json,generated_assets,imported_at) VALUES ($1,$2,$3,$4,$5,$6,$7,coalesce($8::timestamptz,now()))", [id, auth.user.id, String(entry.test.title || ""), String(entry.test.testType || ""), String(entry.source || "legacy"), entry.test, JSON.stringify(entry.generatedAssets || []), entry.importedAt || null]);
        importedLibrary += 1;
      }
      for (const item of Array.isArray(body.history) ? body.history : []) {
        const id = newId("att");
        await client.query("INSERT INTO attempts(id,user_id,test_snapshot,mode,status,idempotency_key,answers,result_json,submitted_at) VALUES ($1,$2,$3,$4,'submitted',$5,$6,$7,coalesce($8::timestamptz,now()))", [id, auth.user.id, item.test || { title: item.title, testType: item.testType, sections: [] }, item.mode === "practice" ? "practice" : "mock", `legacy:${String(item.id || id)}`, {}, item, item.completedAt || null]);
        importedHistory += 1;
      }
      const result = { importedLibrary, importedHistory };
      await client.query("INSERT INTO migration_receipts(id,user_id,migration_key,result_json) VALUES ($1,$2,$3,$4)", [newId("mig"), auth.user.id, key, result]);
    });
    return sendJson(res, 200, { importedLibrary, importedHistory });
  }
  if (req.method === "POST" && pathname === "/api/backup/import") {
    requireCsrf(req, auth);
    const body = await readBody(req, 1024 * 1024 * 1024);
    const zip = await unzipper.Open.buffer(body);
    const manifestFile = zip.files.find((file) => file.path === "backup.json");
    if (!manifestFile) throw Object.assign(new Error("备份中缺少 backup.json。"), { statusCode: 400, code: "INVALID_BACKUP" });
    const manifest = JSON.parse((await manifestFile.buffer()).toString("utf8"));
    if (manifest.format !== "ielts-mock-backup" || manifest.version !== 1) throw Object.assign(new Error("不支持的备份格式。"), { statusCode: 400, code: "INVALID_BACKUP" });
    const maps = { library: new Map(), attempts: new Map(), files: new Map() };
    for (const item of manifest.library || []) maps.library.set(item.id, newId("lib"));
    for (const item of manifest.attempts || []) maps.attempts.set(item.id, newId("att"));
    for (const item of manifest.files || []) maps.files.set(item.id, newId("fil"));
    const totalFileBytes = (manifest.files || []).reduce((sum, row) => sum + Number(row.size_bytes || 0), 0);
    if (auth.user.usedBytes + totalFileBytes > auth.user.quotaBytes) throw Object.assign(new Error("备份文件超过账户剩余存储空间。"), { statusCode: 413, code: "QUOTA_EXCEEDED" });
    const writtenFiles = [];
    try {
      for (const row of manifest.files || []) {
        const source = zip.files.find((file) => file.path === `files/${row.id}`);
        if (!source) throw Object.assign(new Error(`备份缺少文件：${row.original_name || row.id}`), { statusCode: 400, code: "INVALID_BACKUP" });
        const content = await source.buffer();
        if (content.length !== Number(row.size_bytes)) throw Object.assign(new Error(`备份文件大小不匹配：${row.original_name || row.id}`), { statusCode: 400, code: "INVALID_BACKUP" });
        const newIdValue = maps.files.get(row.id);
        const relative = path.join(auth.user.id, `${newIdValue}.bin`);
        const target = path.join(FILES_DIR, relative);
        await fsp.mkdir(path.dirname(target), { recursive: true });
        await fsp.writeFile(target, content, { mode: 0o600, flag: "wx" });
        writtenFiles.push(target);
        row._restoredPath = relative;
      }
      await transaction(async (client) => {
        for (const row of manifest.library || []) await client.query("INSERT INTO library_entries(id,user_id,title,test_type,source,test_json,generated_assets,imported_at) VALUES ($1,$2,$3,$4,$5,$6,$7,coalesce($8::timestamptz,now()))", [maps.library.get(row.id), auth.user.id, row.title, row.test_type, row.source, remapJsonIds(row.test_json, maps), JSON.stringify(remapJsonIds(row.generated_assets || [], maps)), row.imported_at || null]);
        for (const row of manifest.attempts || []) await client.query("INSERT INTO attempts(id,user_id,library_entry_id,test_snapshot,mode,status,idempotency_key,answers,review_ids,result_json,submitted_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [maps.attempts.get(row.id), auth.user.id, maps.library.get(row.library_entry_id) || null, remapJsonIds(row.test_snapshot || {}, maps), row.mode === "practice" ? "practice" : "mock", ["submitted", "expired"].includes(row.status) ? row.status : "abandoned", `restore:${crypto.randomUUID()}`, remapJsonIds(row.answers || {}, maps), JSON.stringify(row.review_ids || []), remapJsonIds(row.result_json || null, maps), row.submitted_at || null]);
        for (const row of manifest.files || []) await client.query("INSERT INTO stored_files(id,user_id,attempt_id,library_entry_id,purpose,original_name,mime_type,size_bytes,storage_path,complete,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true,coalesce($10::timestamptz,now()))", [maps.files.get(row.id), auth.user.id, maps.attempts.get(row.attempt_id) || null, maps.library.get(row.library_entry_id) || null, row.purpose, row.original_name, row.mime_type, Number(row.size_bytes), row._restoredPath, row.created_at || null]);
        for (const row of manifest.reviews || []) await client.query("INSERT INTO review_records(id,user_id,attempt_id,question_id,kind,data_json,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,coalesce($7::timestamptz,now()),coalesce($8::timestamptz,now()))", [newId("rev"), auth.user.id, maps.attempts.get(row.attempt_id) || null, row.question_id, row.kind, remapJsonIds(row.data_json || {}, maps), row.created_at || null, row.updated_at || null]);
        for (const row of manifest.documents || []) {
          const key = String(row.document_key || "");
          if (!/^[A-Za-z0-9_.-]{1,80}$/.test(key)) continue;
          await client.query("INSERT INTO user_documents(user_id,document_key,data_json,updated_at) VALUES ($1,$2,$3,coalesce($4::timestamptz,now())) ON CONFLICT (user_id,document_key) DO UPDATE SET version=user_documents.version+1,data_json=excluded.data_json,updated_at=excluded.updated_at", [auth.user.id, key, remapJsonIds(row.data_json || {}, maps), row.updated_at || null]);
        }
        await client.query("UPDATE users SET used_bytes=used_bytes+$2,updated_at=now() WHERE id=$1", [auth.user.id, totalFileBytes]);
      });
    } catch (error) {
      await Promise.all(writtenFiles.map((target) => fsp.unlink(target).catch(() => {})));
      throw error;
    }
    return sendJson(res, 200, { importedLibrary: (manifest.library || []).length, importedAttempts: (manifest.attempts || []).length, importedFiles: (manifest.files || []).length });
  }
  return false;
}

async function handleApi(req, res) {
  const pathname = routePath(req.url);
  try {
    if (req.method === "GET" && pathname === "/api/health") {
      await pool.query("SELECT 1");
      await fsp.access(FILES_DIR, fs.constants.R_OK | fs.constants.W_OK);
      return sendJson(res, 200, { ok: true, version: process.env.APP_VERSION || "development" });
    }
    if (pathname.startsWith("/api/auth/")) {
      const handled = await authRoutes(req, res, pathname);
      if (handled !== false) return handled;
    }
    const auth = await authenticate(req);
    if (auth.user.mustChangePassword) {
      throw Object.assign(new Error("首次登录必须先修改临时密码。"), { statusCode: 403, code: "PASSWORD_CHANGE_REQUIRED" });
    }
    if (pathname.startsWith("/api/admin/")) {
      const handled = await adminRoutes(req, res, pathname, auth);
      if (handled !== false) return handled;
    }
    for (const handler of [accountDataRoutes, libraryRoutes, attemptRoutes, fileRoutes, settingsRoutes, aiRoutes, reviewRoutes, documentRoutes, backupRoutes]) {
      const handled = await handler(req, res, pathname, auth);
      if (handled !== false) return handled;
    }
    throw Object.assign(new Error("接口不存在。"), { statusCode: 404, code: "NOT_FOUND" });
  } catch (error) {
    if (!res.headersSent) sendError(res, error);
    else res.destroy(error);
  }
}

module.exports = { ensureBootstrapAdmin, ensureDirectories, expireDueAttempts, handleApi, recoverInterruptedAiJobs };

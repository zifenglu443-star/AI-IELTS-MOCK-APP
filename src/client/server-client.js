(function exposeIeltsServer(globalScope) {
  "use strict";

  const client = {
    authenticated: false,
    csrfToken: "",
    user: null,
    sessionId: "",
    history: [],
    activeAttempt: null,
    recoveryDraft: null,
    leaseToken: "",
    saveTimer: null,
    saveInFlight: null,
    libraryTimer: null,
    knownLibraryIds: new Set(),
  };

  function makeError(status, payload) {
    const error = new Error(payload?.error?.message || `服务器请求失败（${status}）`);
    error.status = status;
    error.code = payload?.error?.code || "REQUEST_FAILED";
    error.details = payload?.error || {};
    return error;
  }

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.json !== undefined) {
      headers.set("Content-Type", "application/json");
      options.body = JSON.stringify(options.json);
    }
    if (client.csrfToken && !["GET", "HEAD"].includes(String(options.method || "GET").toUpperCase())) {
      headers.set("X-CSRF-Token", client.csrfToken);
    }
    const response = await fetch(path, { credentials: "include", ...options, headers });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json().catch(() => ({})) : await response.text();
    if (!response.ok) throw makeError(response.status, payload);
    return payload;
  }

  function setSaveStatus(text, state = "") {
    const node = document.getElementById("serverSaveStatus");
    if (!node) return;
    node.textContent = text;
    node.dataset.state = state;
  }

  function injectUi() {
    const app = document.querySelector(".app-shell");
    if (app) app.hidden = true;
    document.body.insertAdjacentHTML("afterbegin", `
      <section class="auth-shell" id="authShell">
        <div class="auth-card">
          <div class="auth-brand"><span>IELTS</span><small>Mock Lab</small></div>
          <div>
            <p class="auth-eyebrow">欢迎回来</p>
            <h1>登录学习空间</h1>
            <p class="auth-copy">题库、作答、录音和学习记录将安全保存在服务器。</p>
          </div>
          <form id="loginForm" class="auth-form">
            <label><span>用户名</span><input id="loginUsername" name="username" autocomplete="username" required autofocus /></label>
            <label><span>密码</span><span class="password-field"><input id="loginPassword" name="password" type="password" autocomplete="current-password" required /><button type="button" id="toggleLoginPassword">显示</button></span></label>
            <p class="auth-error" id="loginError" role="alert"></p>
            <button class="primary-button auth-submit" type="submit">登录</button>
          </form>
          <p class="auth-help">忘记密码？请联系管理员重置。</p>
        </div>
      </section>
      <dialog class="settings-dialog account-dialog" id="accountDialog">
        <div class="dialog-head"><h2>账户与数据</h2><button class="icon-button" id="closeAccountDialog" aria-label="关闭账户设置">×</button></div>
        <div class="settings-body account-body">
          <section class="account-summary" id="accountSummary"></section>
          <section><h3>修改密码</h3><form id="changePasswordForm" class="compact-form">
            <input name="currentPassword" type="password" autocomplete="current-password" placeholder="当前密码" required />
            <input name="newPassword" type="password" autocomplete="new-password" placeholder="新密码（至少 12 位，含大小写、数字和符号）" required />
            <button class="primary-button" type="submit">修改密码</button><span class="form-status" id="passwordStatus"></span>
          </form></section>
          <section><div class="section-heading"><h3>登录设备</h3><button class="secondary-button" id="refreshSessions">刷新</button></div><div id="sessionList" class="session-list"></div></section>
          <section><h3>数据备份</h3><div class="setup-actions"><button class="secondary-button" id="exportBackup">导出完整备份</button><label class="secondary-button file-button">导入备份<input id="importBackup" type="file" accept=".zip,application/zip" /></label></div><p class="muted-note" id="backupStatus">备份不包含模型 API Key。</p></section>
          <section><button class="secondary-button danger-button" id="logoutButton">退出登录</button></section>
        </div>
      </dialog>
      <dialog class="settings-dialog admin-dialog" id="adminDialog">
        <div class="dialog-head"><h2>管理员控制台</h2><button class="icon-button" id="closeAdminDialog" aria-label="关闭管理员控制台">×</button></div>
        <div class="settings-body admin-body">
          <div class="admin-metrics" id="adminMetrics"></div>
          <section><h3>创建账户</h3><form id="createUserForm" class="admin-create-form">
            <input name="username" placeholder="用户名" required /><input name="displayName" placeholder="显示名称" />
            <input name="password" type="password" placeholder="临时密码" required />
            <select name="role"><option value="user">普通用户</option><option value="admin">管理员</option></select>
            <button class="primary-button" type="submit">创建</button><span class="form-status" id="createUserStatus"></span>
          </form></section>
          <section><div class="section-heading"><h3>账户</h3><input id="adminUserSearch" placeholder="搜索用户名或名称" /></div><div id="adminUserList" class="admin-user-list"></div></section>
          <details><summary>管理操作审计</summary><div id="adminAudit" class="audit-list"></div></details>
        </div>
      </dialog>
    `);
    const topbar = document.querySelector(".topbar");
    topbar?.insertAdjacentHTML("beforeend", `<div class="topbar-account"><span id="serverSaveStatus" data-state="">连接服务器…</span><button id="accountButton" type="button">账户</button><button id="adminButton" type="button" hidden>管理</button></div>`);
    bindUi();
  }

  function bindUi() {
    document.getElementById("toggleLoginPassword").addEventListener("click", () => {
      const input = document.getElementById("loginPassword");
      input.type = input.type === "password" ? "text" : "password";
      document.getElementById("toggleLoginPassword").textContent = input.type === "password" ? "显示" : "隐藏";
    });
    document.getElementById("loginForm").addEventListener("submit", loginFromForm);
    document.getElementById("accountButton").addEventListener("click", () => openAccount(false));
    document.getElementById("adminButton").addEventListener("click", openAdmin);
    document.getElementById("closeAccountDialog").addEventListener("click", () => document.getElementById("accountDialog").close());
    document.getElementById("accountDialog").addEventListener("cancel", (event) => {
      if (client.user?.mustChangePassword) event.preventDefault();
    });
    document.getElementById("closeAdminDialog").addEventListener("click", () => document.getElementById("adminDialog").close());
    document.getElementById("changePasswordForm").addEventListener("submit", changePassword);
    document.getElementById("refreshSessions").addEventListener("click", loadSessions);
    document.getElementById("logoutButton").addEventListener("click", logout);
    document.getElementById("exportBackup").addEventListener("click", exportBackup);
    document.getElementById("importBackup").addEventListener("change", importBackup);
    document.getElementById("createUserForm").addEventListener("submit", createUser);
    document.getElementById("adminUserSearch").addEventListener("input", debounce(loadAdminUsers, 250));
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
  }

  let resolveLogin;
  let resolveForcedPasswordChange;
  async function loginFromForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const errorNode = document.getElementById("loginError");
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    errorNode.textContent = "";
    try {
      const result = await request("/api/auth/login", { method: "POST", json: { username: form.username.value, password: form.password.value } });
      applyAuth(result);
      showApplication();
      resolveLogin?.();
      resolveLogin = null;
    } catch (error) {
      errorNode.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  }

  function applyAuth(result) {
    client.authenticated = true;
    client.user = result.user;
    client.csrfToken = result.csrfToken;
    client.sessionId = result.sessionId;
  }

  function showApplication() {
    document.getElementById("authShell").hidden = true;
    document.querySelector(".app-shell").hidden = false;
    document.getElementById("adminButton").hidden = client.user.role !== "admin";
    setSaveStatus("已连接服务器", "saved");
  }

  async function bootstrap() {
    injectUi();
    try {
      applyAuth(await request("/api/auth/me"));
      showApplication();
    } catch (error) {
      if (error.status !== 401) document.getElementById("loginError").textContent = `服务器连接失败：${error.message}`;
      await new Promise((resolve) => { resolveLogin = resolve; });
    }
    if (client.user.mustChangePassword) {
      await openAccount(true);
      await new Promise((resolve) => { resolveForcedPasswordChange = resolve; });
    }
    await prepareServerData();
    await migrateLegacyData();
    return client.user;
  }

  async function prepareServerData() {
    try {
      const [history, active] = await Promise.all([request("/api/attempts/history"), request("/api/attempts/active")]);
      client.history = history.attempts.map((attempt) => ({ ...(attempt.result || {}), id: attempt.id, historyId: attempt.id, completedAt: attempt.submittedAt || attempt.updatedAt, _test: attempt.test }));
      client.activeAttempt = active.attempt;
      const cached = readAttemptCache();
      if (client.activeAttempt && !cached?.synced && cached?.attemptId === client.activeAttempt.id && new Date(cached.savedAt).getTime() > new Date(client.activeAttempt.updatedAt || 0).getTime()) {
        Object.assign(client.activeAttempt, cached.snapshot || {});
        setSaveStatus("已恢复本机待同步草稿", "pending");
      } else if (!client.activeAttempt && !cached?.synced && cached?.test && cached?.snapshot) {
        client.recoveryDraft = cached;
        setSaveStatus("发现本机未同步草稿", "pending");
      }
    } catch (error) {
      setSaveStatus("服务器同步失败", "error");
      throw error;
    }
  }

  async function migrateLegacyData() {
    const libraryRaw = localStorage.getItem("ielts-mock-library");
    const historyRaw = localStorage.getItem("ielts-mock-history");
    if ((!libraryRaw || libraryRaw === "[]") && (!historyRaw || historyRaw === "[]")) return;
    let library = [];
    let history = [];
    try { library = JSON.parse(libraryRaw || "[]"); } catch {}
    try { history = JSON.parse(historyRaw || "[]"); } catch {}
    if (!library.length && !history.length) return;
    const accepted = confirm(`检测到本机旧数据：${library.length} 套题目、${history.length} 条记录。是否导入当前服务器账户？`);
    if (!accepted) return;
    const migrationKey = `legacy-v1:${client.user.id}`;
    const result = await request("/api/backup/import-legacy", { method: "POST", json: { migrationKey, library, history } });
    setSaveStatus(`已迁移 ${result.importedLibrary || 0} 套题目`, "saved");
    localStorage.removeItem("ielts-mock-library");
    localStorage.removeItem("ielts-mock-history");
    await prepareServerData();
  }

  async function loadLibrary() {
    const result = await request("/api/library");
    client.knownLibraryIds = new Set(result.entries.map((entry) => entry.id));
    return result.entries.map((entry) => ({ id: entry.id, test: entry.test, source: entry.source, importedAt: entry.importedAt, generatedAssets: entry.generatedAssets }));
  }

  function saveLibrary(entries) {
    clearTimeout(client.libraryTimer);
    setSaveStatus("等待同步", "pending");
    client.libraryTimer = setTimeout(async () => {
      try {
        const currentIds = new Set(entries.map((entry) => entry.id));
        await Promise.all(entries.map((entry) => request("/api/library", { method: "POST", json: entry })));
        await Promise.all([...client.knownLibraryIds].filter((id) => !currentIds.has(id)).map((id) => request(`/api/library/${encodeURIComponent(id)}`, { method: "DELETE" })));
        client.knownLibraryIds = currentIds;
        setSaveStatus("已保存到服务器", "saved");
      } catch (error) {
        console.error(error);
        setSaveStatus("服务器保存失败", "error");
      }
    }, 500);
  }

  async function loadSettings() {
    const result = await request("/api/settings");
    return result.settings;
  }

  async function saveSettings(settings, clearSecrets = false) {
    const result = await request("/api/settings", { method: "PUT", json: { settings, clearSecrets } });
    return result.settings;
  }

  async function testSetting(feature) {
    return request("/api/settings/test", { method: "POST", json: { feature } });
  }

  async function beginAttempt(snapshot) {
    const idempotencyKey = snapshot.idempotencyKey || `${client.user.id}:${Date.now()}:${cryptoRandom()}`;
    const result = await request("/api/attempts", { method: "POST", json: { ...snapshot, idempotencyKey } });
    client.activeAttempt = result.attempt;
    client.leaseToken = result.leaseToken || "";
    return result;
  }

  function cryptoRandom() {
    return globalScope.crypto?.randomUUID?.() || Math.random().toString(16).slice(2);
  }

  function scheduleAttemptSave(snapshot, immediate = false) {
    clearTimeout(client.saveTimer);
    writeAttemptCache(snapshot);
    setSaveStatus("等待同步", "pending");
    const run = async () => {
      if (!client.activeAttempt || !client.leaseToken) return;
      if (client.saveInFlight) await client.saveInFlight.catch(() => {});
      client.saveInFlight = request(`/api/attempts/${encodeURIComponent(client.activeAttempt.id)}`, { method: "PATCH", json: { ...snapshot, version: client.activeAttempt.version, leaseToken: client.leaseToken } });
      try {
        const result = await client.saveInFlight;
        client.activeAttempt = result.attempt;
        writeAttemptCache(snapshot, true);
        setSaveStatus("已保存到服务器", "saved");
      } catch (error) {
        setSaveStatus(error.code === "LEASE_LOST" ? "已在其他设备接管" : "保存失败，等待重试", "error");
        throw error;
      } finally {
        client.saveInFlight = null;
      }
    };
    if (immediate) return run();
    client.saveTimer = setTimeout(() => run().catch(console.error), 500);
  }

  async function takeoverAttempt(id) {
    const result = await request(`/api/attempts/${encodeURIComponent(id)}/takeover`, { method: "POST", json: {} });
    client.activeAttempt = result.attempt;
    client.leaseToken = result.leaseToken;
    return result.attempt;
  }

  async function abandonAttempt(id) {
    await request(`/api/attempts/${encodeURIComponent(id)}/abandon`, { method: "POST", json: {} });
    if (client.activeAttempt?.id === id) {
      client.activeAttempt = null;
      clearAttemptCache();
    }
  }

  async function submitAttempt(result, snapshot) {
    if (!client.activeAttempt || !client.leaseToken) return null;
    if (client.saveInFlight) await client.saveInFlight.catch(() => {});
    const response = await request(`/api/attempts/${encodeURIComponent(client.activeAttempt.id)}/submit`, { method: "POST", json: { ...snapshot, result, version: client.activeAttempt.version, leaseToken: client.leaseToken } });
    client.activeAttempt = null;
    client.leaseToken = "";
    clearAttemptCache();
    client.history.unshift({ ...result, id: response.attempt.id, historyId: response.attempt.id });
    setSaveStatus("成绩已保存", "saved");
    return response.attempt;
  }

  async function uploadBlob(blob, metadata = {}) {
    const chunkSize = 2 * 1024 * 1024;
    const totalChunks = Math.max(1, Math.ceil(blob.size / chunkSize));
    const start = await request("/api/files/uploads", { method: "POST", json: { ...metadata, sizeBytes: blob.size, mimeType: blob.type || metadata.mimeType, totalChunks } });
    for (let index = 0; index < totalChunks; index += 1) {
      await request(`/api/files/uploads/${encodeURIComponent(start.uploadId)}/chunks/${index}`, { method: "PUT", headers: { "Content-Type": "application/octet-stream" }, body: blob.slice(index * chunkSize, Math.min(blob.size, (index + 1) * chunkSize)) });
    }
    return request(`/api/files/uploads/${encodeURIComponent(start.uploadId)}/complete`, { method: "POST", json: {} });
  }

  async function proxyFetch(feature, url, init = {}, stage = "request") {
    const headers = new Headers(init.headers || {});
    headers.delete("Authorization");
    headers.set("X-AI-Feature", feature);
    headers.set("X-AI-Stage", stage);
    headers.set("X-Upstream-URL", url);
    headers.set("X-Upstream-Method", init.method || "POST");
    headers.set("X-CSRF-Token", client.csrfToken);
    return fetch("/api/ai-jobs/proxy", { method: "POST", credentials: "include", headers, body: init.body, signal: init.signal });
  }

  async function assessXfyun(payload) {
    return request("/api/ai-jobs/xfyun-ise", { method: "POST", json: payload });
  }

  function getHistory() { return client.history; }

  async function removeHistory(id) {
    await request(`/api/attempts/${encodeURIComponent(id)}`, { method: "DELETE" });
    client.history = client.history.filter((item) => String(item.historyId || item.id) !== String(id));
  }

  async function updateHistory(result) {
    const id = result?.historyId || result?.id;
    if (!id) return;
    await request(`/api/attempts/${encodeURIComponent(id)}/result`, { method: "PATCH", json: { result } });
  }

  async function saveReview(review) {
    return request("/api/reviews", { method: "POST", json: review });
  }

  async function loadDocument(key) {
    const result = await request(`/api/user-data/${encodeURIComponent(key)}`);
    return result.document?.data ?? null;
  }

  async function saveDocument(key, data) {
    const result = await request(`/api/user-data/${encodeURIComponent(key)}`, { method: "PUT", json: { data } });
    return result.document;
  }

  async function clearLearningData() {
    const result = await request("/api/account/data", { method: "DELETE" });
    client.history = [];
    client.activeAttempt = null;
    client.leaseToken = "";
    client.knownLibraryIds.clear();
    clearAttemptCache();
    return result;
  }

  async function openAccount(forcePasswordChange = false) {
    document.getElementById("accountSummary").innerHTML = `<strong>${escapeHtml(client.user.displayName || client.user.username)}</strong><span>@${escapeHtml(client.user.username)} · ${client.user.role === "admin" ? "管理员" : "普通用户"}</span><span>已使用 ${formatBytes(client.user.usedBytes)} / ${formatBytes(client.user.quotaBytes)}</span>${client.user.mustChangePassword ? '<em>请先修改临时密码</em>' : ''}`;
    const closeButton = document.getElementById("closeAccountDialog");
    closeButton.hidden = forcePasswordChange || client.user.mustChangePassword;
    document.getElementById("accountDialog").showModal();
    await loadSessions();
  }

  async function changePassword(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById("passwordStatus");
    try {
      await request("/api/auth/change-password", { method: "POST", json: { currentPassword: form.currentPassword.value, newPassword: form.newPassword.value } });
      client.user.mustChangePassword = false;
      form.reset();
      status.textContent = "密码已修改，其他设备已退出。";
      document.getElementById("closeAccountDialog").hidden = false;
      document.getElementById("accountDialog").close();
      resolveForcedPasswordChange?.();
      resolveForcedPasswordChange = null;
    } catch (error) { status.textContent = error.message; }
  }

  async function loadSessions() {
    const result = await request("/api/auth/sessions");
    document.getElementById("sessionList").innerHTML = result.sessions.map((session) => `<div><span><strong>${session.current ? "当前设备" : "其他设备"}</strong><small>${escapeHtml(session.user_agent || "未知客户端")} · ${escapeHtml(session.ip_address || "")}</small></span>${session.current ? "" : `<button class="secondary-button" data-revoke-session="${escapeHtml(session.id)}">撤销</button>`}</div>`).join("") || '<p class="muted-note">没有活动会话。</p>';
    document.querySelectorAll("[data-revoke-session]").forEach((button) => button.addEventListener("click", async () => { await request(`/api/auth/sessions/${encodeURIComponent(button.dataset.revokeSession)}`, { method: "DELETE" }); await loadSessions(); }));
  }

  async function logout() {
    await request("/api/auth/logout", { method: "POST", json: {} }).catch(() => {});
    clearAttemptCache();
    sessionStorage.clear();
    location.reload();
  }

  function exportBackup() { location.href = "/api/backup/export"; }

  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const status = document.getElementById("backupStatus");
    status.textContent = "正在校验并导入…";
    try {
      const result = await request("/api/backup/import", { method: "POST", headers: { "Content-Type": "application/zip" }, body: file });
      status.textContent = `已导入 ${result.importedLibrary} 套题目和 ${result.importedAttempts} 条考试记录。刷新页面后显示。`;
    } catch (error) { status.textContent = error.message; }
    event.target.value = "";
  }

  async function openAdmin() {
    document.getElementById("adminDialog").showModal();
    const [status, audit] = await Promise.all([request("/api/admin/status", { headers: { "X-CSRF-Token": client.csrfToken } }), request("/api/admin/audit", { headers: { "X-CSRF-Token": client.csrfToken } })]);
    document.getElementById("adminMetrics").innerHTML = `<div><strong>${status.users}</strong><span>账户</span></div><div><strong>${status.activeAttempts}</strong><span>进行中考试</span></div><div><strong>${formatBytes(status.fileBytes)}</strong><span>文件存储</span></div><div><strong>${status.activeAiJobs}</strong><span>AI 任务</span></div>`;
    document.getElementById("adminAudit").innerHTML = audit.audit.map((item) => `<div><strong>${escapeHtml(item.action)}</strong><span>${escapeHtml(item.actor_username || "system")} → ${escapeHtml(item.target_username || "-")}</span><time>${new Date(item.created_at).toLocaleString()}</time></div>`).join("");
    await loadAdminUsers();
  }

  async function createUser(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = document.getElementById("createUserStatus");
    try {
      await request("/api/admin/users", { method: "POST", json: Object.fromEntries(new FormData(form)) });
      status.textContent = "账户已创建。";
      form.reset();
      await loadAdminUsers();
    } catch (error) { status.textContent = error.message; }
  }

  async function loadAdminUsers() {
    const q = document.getElementById("adminUserSearch").value;
    const result = await request(`/api/admin/users?q=${encodeURIComponent(q)}`, { headers: { "X-CSRF-Token": client.csrfToken } });
    document.getElementById("adminUserList").innerHTML = result.users.map((user) => `<article data-admin-user="${escapeHtml(user.id)}"><div><strong>${escapeHtml(user.displayName || user.username)}</strong><span>@${escapeHtml(user.username)} · ${user.role === "admin" ? "管理员" : "普通用户"}</span><small>${formatBytes(user.usedBytes)} / ${formatBytes(user.quotaBytes)}${user.disabled ? " · 已禁用" : ""}</small></div><div class="admin-user-actions"><button class="secondary-button" data-admin-quota>调整容量</button><button class="secondary-button" data-admin-toggle>${user.disabled ? "启用" : "禁用"}</button><button class="secondary-button" data-admin-role>${user.role === "admin" ? "改为普通用户" : "设为管理员"}</button><button class="secondary-button" data-admin-reset>重置密码</button><button class="secondary-button" data-admin-revoke>撤销会话</button></div></article>`).join("");
    document.querySelectorAll("[data-admin-user]").forEach((card) => bindAdminUser(card, result.users.find((user) => user.id === card.dataset.adminUser)));
  }

  function bindAdminUser(card, user) {
    card.querySelector("[data-admin-quota]").addEventListener("click", async () => {
      const gib = prompt(`设置 ${user.username} 的总容量（GiB）：`, String((user.quotaBytes / 1024 ** 3).toFixed(2)));
      if (gib === null) return;
      const quotaBytes = Math.round(Number(gib) * 1024 ** 3);
      if (!Number.isFinite(quotaBytes) || quotaBytes < user.usedBytes) return alert("容量必须是数字，且不能小于当前已用空间。");
      await request(`/api/admin/users/${encodeURIComponent(user.id)}`, { method: "PATCH", json: { quotaBytes } });
      await loadAdminUsers();
    });
    card.querySelector("[data-admin-toggle]").addEventListener("click", async () => { await request(`/api/admin/users/${encodeURIComponent(user.id)}`, { method: "PATCH", json: { disabled: !user.disabled } }); await loadAdminUsers(); });
    card.querySelector("[data-admin-role]").addEventListener("click", async () => { await request(`/api/admin/users/${encodeURIComponent(user.id)}`, { method: "PATCH", json: { role: user.role === "admin" ? "user" : "admin" } }); await loadAdminUsers(); });
    card.querySelector("[data-admin-reset]").addEventListener("click", async () => { const password = prompt(`输入 ${user.username} 的新临时密码：`); if (!password) return; await request(`/api/admin/users/${encodeURIComponent(user.id)}/reset-password`, { method: "POST", json: { password } }); alert("密码已重置，该用户的所有设备已退出。"); });
    card.querySelector("[data-admin-revoke]").addEventListener("click", async () => { await request("/api/admin/revoke-sessions", { method: "POST", json: { userId: user.id } }); alert("活动会话已撤销。"); });
  }

  function formatBytes(value) {
    const bytes = Number(value || 0);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GiB`;
  }

  function attemptCacheKey() {
    return client.user?.id ? `ielts-server-draft:${client.user.id}` : "";
  }

  function readAttemptCache() {
    try {
      const key = attemptCacheKey();
      if (!key) return null;
      const cached = JSON.parse(localStorage.getItem(key) || "null");
      if (!cached || Date.now() - new Date(cached.savedAt).getTime() > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(key);
        return null;
      }
      return cached;
    } catch {
      return null;
    }
  }

  function writeAttemptCache(snapshot, synced = false) {
    const key = attemptCacheKey();
    if (!key || !client.activeAttempt) return;
    try {
      localStorage.setItem(key, JSON.stringify({
        attemptId: client.activeAttempt.id,
        savedAt: new Date().toISOString(),
        synced,
        snapshot,
        test: client.activeAttempt.test,
        mode: client.activeAttempt.mode,
        libraryEntryId: client.activeAttempt.libraryEntryId,
      }));
    } catch {}
  }

  function clearAttemptCache() {
    const key = attemptCacheKey();
    if (key) localStorage.removeItem(key);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  Object.assign(client, {
    beginAttempt,
    abandonAttempt,
    bootstrap,
    getHistory,
    loadLibrary,
    loadDocument,
    loadSettings,
    removeHistory,
    proxyFetch,
    request,
    saveLibrary,
    saveSettings,
    saveReview,
    saveDocument,
    scheduleAttemptSave,
    submitAttempt,
    takeoverAttempt,
    testSetting,
    uploadBlob,
    updateHistory,
    assessXfyun,
    clearLearningData,
  });
  globalScope.IeltsServer = client;
})(globalThis);

(function exposeIeltsCore(globalScope) {
  "use strict";

  const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);
  const MAX_JSON_DEPTH = 80;
  const MAX_JSON_NODES = 100000;

  function assertSafeJsonValue(value) {
    const seen = new WeakSet();
    let visited = 0;

    function visit(current, path, depth) {
      visited += 1;
      if (visited > MAX_JSON_NODES) {
        throw new Error("JSON 内容过大，已拒绝导入。");
      }
      if (depth > MAX_JSON_DEPTH) {
        throw new Error("JSON 嵌套层级过深，已拒绝导入。");
      }
      if (!current || typeof current !== "object") return;
      if (seen.has(current)) {
        throw new Error(`JSON 包含循环引用：${path}`);
      }

      seen.add(current);
      for (const key of Object.keys(current)) {
        if (DANGEROUS_KEYS.has(key)) {
          throw new Error(`JSON 包含不安全字段：${path}.${key}`);
        }
        visit(current[key], `${path}.${key}`, depth + 1);
      }
      seen.delete(current);
    }

    visit(value, "$", 0);
    return value;
  }

  function parseSafeJson(text) {
    return assertSafeJsonValue(JSON.parse(text));
  }

  function validateFeatureConfig(config) {
    const errors = {};
    const providerKey = String(config?.providerKey || "");
    const baseUrl = String(config?.baseUrl || "").trim();
    const apiKey = String(config?.apiKey || "").trim();
    const model = String(config?.model || "").trim();

    if (!baseUrl) {
      errors.baseUrl = "请输入接口地址。";
    } else {
      try {
        const url = new URL(baseUrl);
        const allowed = providerKey === "xfyun"
          ? ["https:", "wss:"]
          : ["http:", "https:"];
        if (!allowed.includes(url.protocol)) {
          errors.baseUrl = `接口地址仅支持 ${allowed.join(" / ")}。`;
        }
      } catch {
        errors.baseUrl = "请输入完整、有效的接口地址。";
      }
    }

    if (!model) errors.model = "请输入模型名称。";
    if (apiKey && apiKey.length < 8) {
      errors.apiKey = "API Key 看起来过短，请检查后再保存。";
    }
    if (providerKey === "xfyun" && apiKey && !isValidXfyunCredential(apiKey)) {
      errors.apiKey = "请使用 APPID|APIKey|APISecret，或填写包含这三项的 JSON。";
    }
    return errors;
  }

  function isValidXfyunCredential(value) {
    const text = String(value || "").trim();
    const parts = text.split("|").map((part) => part.trim()).filter(Boolean);
    if (parts.length === 3) return true;
    try {
      const parsed = JSON.parse(text);
      return Boolean(parsed?.appId && parsed?.apiKey && parsed?.apiSecret);
    } catch {
      return false;
    }
  }

  function combineAbortSignals(signals) {
    const active = (signals || []).filter(Boolean);
    if (!active.length) return undefined;
    if (active.length === 1) return active[0];
    if (typeof AbortSignal.any === "function") return AbortSignal.any(active);

    const controller = new AbortController();
    const abort = (event) => {
      const source = event?.target;
      controller.abort(source?.reason);
    };
    for (const signal of active) {
      if (signal.aborted) {
        controller.abort(signal.reason);
        break;
      }
      signal.addEventListener("abort", abort, { once: true });
    }
    return controller.signal;
  }

  const api = {
    assertSafeJsonValue,
    combineAbortSignals,
    parseSafeJson,
    validateFeatureConfig,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (globalScope) {
    globalScope.IeltsCore = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  combineAbortSignals,
  parseSafeJson,
  validateFeatureConfig,
} = require("../src/core/security.js");

test("parseSafeJson accepts normal exam data", () => {
  const value = parseSafeJson('{"testType":"reading","sections":[{"title":"One"}]}');
  assert.equal(value.sections[0].title, "One");
});

test("parseSafeJson rejects prototype-related keys at any depth", () => {
  assert.throws(
    () => parseSafeJson('{"sections":[{"__proto__":{"polluted":true}}]}'),
    /不安全字段/,
  );
  assert.throws(
    () => parseSafeJson('{"constructor":{"prototype":{"polluted":true}}}'),
    /不安全字段/,
  );
});

test("validateFeatureConfig rejects malformed endpoints and credentials", () => {
  assert.deepEqual(
    validateFeatureConfig({
      providerKey: "glm",
      baseUrl: "javascript:alert(1)",
      apiKey: "short",
      model: "",
    }),
    {
      baseUrl: "接口地址仅支持 http: / https:。",
      apiKey: "API Key 看起来过短，请检查后再保存。",
      model: "请输入模型名称。",
    },
  );
});

test("validateFeatureConfig accepts supported HTTPS settings", () => {
  assert.deepEqual(
    validateFeatureConfig({
      providerKey: "glm",
      baseUrl: "https://example.com/v1/chat/completions",
      apiKey: "a-valid-key",
      model: "example-model",
    }),
    {},
  );
});

test("combineAbortSignals provides a fallback-compatible combined signal", () => {
  const first = new AbortController();
  const second = new AbortController();
  const combined = combineAbortSignals([first.signal, second.signal]);
  second.abort("cancelled");
  assert.equal(combined.aborted, true);
  assert.equal(combined.reason, "cancelled");
});

"use strict";

const http = require("http");
const { migrate, pool } = require("./db");
const { ensureBootstrapAdmin, ensureDirectories, expireDueAttempts, handleApi, recoverInterruptedAiJobs } = require("./api");

const port = Number(process.env.PORT || 8080);

async function start() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await ensureDirectories();
  await migrate();
  await ensureBootstrapAdmin();
  await recoverInterruptedAiJobs();
  await expireDueAttempts();
  const server = http.createServer(handleApi);
  server.requestTimeout = 140000;
  server.headersTimeout = 150000;
  server.listen(port, "0.0.0.0", () => console.log(`IELTS Mock API listening on ${port}`));
  const expiryTimer = setInterval(() => expireDueAttempts().catch((error) => console.error("Attempt expiry sweep failed", error)), 15000);
  expiryTimer.unref();
  const shutdown = async () => {
    clearInterval(expiryTimer);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});

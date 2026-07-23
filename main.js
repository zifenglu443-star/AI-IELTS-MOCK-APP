const path = require("path");
const fs = require("fs/promises");
const { app, BrowserWindow, ipcMain, safeStorage, shell, session } = require("electron");

const SECURE_SETTINGS_FILE = "secure-ai-settings.bin";

function getSecureSettingsPath() {
  return path.join(app.getPath("userData"), SECURE_SETTINGS_FILE);
}

ipcMain.handle("secure-ai-settings:load", async () => {
  if (!safeStorage.isEncryptionAvailable()) return null;
  try {
    const encrypted = await fs.readFile(getSecureSettingsPath());
    return JSON.parse(safeStorage.decryptString(encrypted));
  } catch (error) {
    if (error?.code !== "ENOENT") console.warn("Secure AI settings could not be loaded.", error);
    return null;
  }
});

ipcMain.handle("secure-ai-settings:save", async (_event, settings) => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("系统安全存储当前不可用。");
  }
  const target = getSecureSettingsPath();
  const temporary = `${target}.tmp`;
  const encrypted = safeStorage.encryptString(JSON.stringify(settings));
  await fs.writeFile(temporary, encrypted, { mode: 0o600 });
  await fs.rename(temporary, target);
  return true;
});

ipcMain.handle("secure-ai-settings:clear", async () => {
  try {
    await fs.unlink(getSecureSettingsPath());
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  return true;
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1320,
    height: 880,
    minWidth: 360,
    minHeight: 600,
    title: "IELTS Mock Lab",
    backgroundColor: "#f4f6f8",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, "index.html"));

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(permission === "media");
  });
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

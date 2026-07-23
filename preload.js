"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("secureSettings", {
  load: () => ipcRenderer.invoke("secure-ai-settings:load"),
  save: (settings) => ipcRenderer.invoke("secure-ai-settings:save", settings),
  clear: () => ipcRenderer.invoke("secure-ai-settings:clear"),
});

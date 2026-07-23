const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const electronRoot = path.join(projectRoot, "node_modules", "electron");
const electronPackagePath = path.join(electronRoot, "package.json");
const installScriptPath = path.join(electronRoot, "install.js");
const distPath = path.join(electronRoot, "dist");
const pathFile = path.join(electronRoot, "path.txt");

if (!fs.existsSync(electronPackagePath) || !fs.existsSync(installScriptPath)) {
  throw new Error("Electron package is missing. Run npm install again.");
}

const electronPackage = JSON.parse(fs.readFileSync(electronPackagePath, "utf8"));
const executableRelativePath = getExecutableRelativePath();
const executablePath = path.join(distPath, executableRelativePath);
const installedVersion = readTrimmed(path.join(distPath, "version")).replace(/^v/, "");

if (installedVersion !== electronPackage.version || !fs.existsSync(executablePath)) {
  run(process.execPath, [installScriptPath], "Electron binary download failed.");
}

fs.writeFileSync(pathFile, executableRelativePath);

if (process.platform === "darwin") {
  const runtimePath = prepareMacRuntime(electronPackage.version);
  prepareMacApp(path.join(runtimePath, "Electron.app"));
  linkRuntime(runtimePath);
}

function getExecutableRelativePath() {
  if (process.platform === "darwin") return "Electron.app/Contents/MacOS/Electron";
  if (process.platform === "win32") return "electron.exe";
  return "electron";
}

function prepareMacApp(appPath) {
  if (!fs.existsSync(appPath)) {
    throw new Error(`Electron app is missing at ${appPath}.`);
  }

  // File-provider metadata is not executable content and must be removed before signing.
  [
    "com.apple.FinderInfo",
    "com.apple.ResourceFork",
    "com.apple.provenance",
  ].forEach((attribute) => {
    spawnSync("xattr", ["-dr", attribute, appPath], { stdio: "ignore" });
  });

  const verified = spawnSync("codesign", ["--verify", "--deep", "--strict", appPath], {
    stdio: "ignore",
  });
  if (verified.status !== 0) {
    run(
      "codesign",
      ["--force", "--deep", "--sign", "-", appPath],
      "Electron local code signing failed.",
    );
  }

  run(
    "codesign",
    ["--verify", "--deep", "--strict", appPath],
    "Electron code signature verification failed.",
  );
}

function prepareMacRuntime(version) {
  const configuredPath = process.env.IELTS_ELECTRON_RUNTIME_DIR;
  const runtimePath = path.resolve(
    configuredPath || path.join(
      os.homedir(),
      "Library",
      "Caches",
      "ielts-mock-lab",
      `electron-${version}-${process.arch}`,
    ),
  );
  const runtimeVersion = readTrimmed(path.join(runtimePath, "version")).replace(/^v/, "");
  const runtimeExecutable = path.join(runtimePath, executableRelativePath);

  if (
    runtimeVersion === version
    && fs.existsSync(runtimeExecutable)
    && hasPortableFrameworkLinks(runtimePath)
  ) {
    return runtimePath;
  }

  fs.rmSync(runtimePath, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(runtimePath), { recursive: true });

  const sourceStats = fs.lstatSync(distPath);
  if (!sourceStats.isSymbolicLink()) {
    try {
      fs.renameSync(distPath, runtimePath);
      return runtimePath;
    } catch {
      // Cross-volume and file-provider moves may require a regular copy.
    }
  }

  fs.cpSync(fs.realpathSync(distPath), runtimePath, {
    recursive: true,
    dereference: false,
    verbatimSymlinks: true,
  });
  return runtimePath;
}

function hasPortableFrameworkLinks(runtimePath) {
  const links = [
    path.join(
      runtimePath,
      "Electron.app",
      "Contents",
      "Frameworks",
      "Mantle.framework",
      "Mantle",
    ),
    path.join(
      runtimePath,
      "Electron.app",
      "Contents",
      "Frameworks",
      "Electron Framework.framework",
      "Electron Framework",
    ),
  ];
  return links.every((linkPath) => {
    try {
      return fs.lstatSync(linkPath).isSymbolicLink()
        && !path.isAbsolute(fs.readlinkSync(linkPath));
    } catch {
      return false;
    }
  });
}

function linkRuntime(runtimePath) {
  let alreadyLinked = false;
  try {
    alreadyLinked = fs.lstatSync(distPath).isSymbolicLink()
      && fs.realpathSync(distPath) === fs.realpathSync(runtimePath);
  } catch {
    alreadyLinked = false;
  }
  if (alreadyLinked) return;

  fs.rmSync(distPath, { recursive: true, force: true });
  fs.symlinkSync(runtimePath, distPath, "dir");
}

function readTrimmed(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").trim();
  } catch {
    return "";
  }
}

function run(command, args, failureMessage) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(failureMessage);
  }
}

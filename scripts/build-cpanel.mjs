/**
 * build-cpanel.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Builds the full project and assembles a ready-to-upload cPanel package at
 *   cpanel-deploy/
 *
 * Usage (from project root):
 *   node scripts/build-cpanel.mjs
 *
 * What it does:
 *   1. Builds the React frontend  →  artifacts/banha-realestate/dist/public/
 *   2. Builds the Express server  →  artifacts/api-server/dist/
 *   3. Copies both into          →  cpanel-deploy/
 *   4. Writes package.json + .env.example + .htaccess for cPanel
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { execSync }                      from "node:child_process";
import fs                                from "node:fs";
import path                              from "node:path";
import { fileURLToPath }                 from "node:url";

const ROOT       = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DEPLOY_DIR = path.join(ROOT, "cpanel-deploy");

// ─── Helpers ──────────────────────────────────────────────────────────────────
function run(cmd, cwd = ROOT) {
  console.log(`\n▶  ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

function cp(src, dest) {
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

// ─── Clean output dir ─────────────────────────────────────────────────────────
console.log("🧹  Cleaning cpanel-deploy/ ...");
fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// ─── 1. Build frontend ────────────────────────────────────────────────────────
console.log("\n📦  Building React frontend ...");
run(
  "pnpm --filter @workspace/banha-realestate run build",
  ROOT
);

// ─── 2. Build backend ─────────────────────────────────────────────────────────
console.log("\n🔧  Building Express API server ...");
run(
  "pnpm --filter @workspace/api-server run build",
  ROOT
);

// ─── 3. Copy server bundle ────────────────────────────────────────────────────
console.log("\n📂  Copying server files ...");
const serverDist = path.join(ROOT, "artifacts/api-server/dist");
cp(serverDist, DEPLOY_DIR);

// ─── 4. Copy frontend into public/ ───────────────────────────────────────────
console.log("📂  Copying frontend files ...");
const frontendDist = path.join(ROOT, "artifacts/banha-realestate/dist/public");
cp(frontendDist, path.join(DEPLOY_DIR, "public"));

// ─── 5. Write package.json (minimal – only runtime deps) ─────────────────────
console.log("📝  Writing package.json ...");
write(
  path.join(DEPLOY_DIR, "package.json"),
  JSON.stringify(
    {
      name:    "banha-realestate",
      version: "1.0.0",
      type:    "module",
      scripts: {
        start: "node --enable-source-maps ./index.mjs",
      },
      engines: { node: ">=20" },
      dependencies: {
        pg: "^8.20.0",
      },
    },
    null,
    2
  )
);

// ─── 6. Write .env.example ────────────────────────────────────────────────────
write(
  path.join(DEPLOY_DIR, ".env.example"),
  `# انسخ هذا الملف إلى .env واملأ القيم الحقيقية
# Copy this file to .env and fill in the real values

# رابط قاعدة البيانات PostgreSQL
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/banha_realestate

# البورت الذي يشتغل عليه السيرفر (عادةً cPanel بيحدده تلقائياً)
PORT=3001
`
);

// ─── 7. Write .htaccess (cPanel Apache proxy) ────────────────────────────────
write(
  path.join(DEPLOY_DIR, ".htaccess"),
  `# Proxy all requests to the Node.js app
# (Passenger / cPanel Node.js App handles this automatically)
# This file is only needed if you're using a manual Apache reverse proxy

Options -MultiViews
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:%PORT%/$1 [P,L]
`
);

// ─── 8. Write startup.js (cPanel Passenger entry) ────────────────────────────
write(
  path.join(DEPLOY_DIR, "startup.js"),
  `// cPanel Passenger / Node.js App entry point
// Make sure the Application Startup File in cPanel is set to: startup.js

import("./index.mjs");
`
);

// ─── Done ─────────────────────────────────────────────────────────────────────
const files = fs.readdirSync(DEPLOY_DIR);
console.log(`
✅  Build complete!  cpanel-deploy/ contains:
${files.map(f => "   • " + f).join("\n")}

Next steps:
  1. Copy cpanel-deploy/ to your server (ZIP & upload via File Manager)
  2. In cPanel → Node.js App:
       • Application root  : /home/<USER>/<upload-folder>
       • Application URL   : your domain
       • Startup file      : startup.js
       • Node.js version   : 20 or higher
  3. Set environment variable:  DATABASE_URL = <your postgres URL>
  4. Click "Run NPM Install" inside cPanel Node.js App
  5. Start / Restart the app
`);

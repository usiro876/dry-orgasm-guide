const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "docs");
const SRC_DIR = path.join(__dirname, "src");

// パスワード取得（引数 or 環境変数）
const password = process.argv[2] || process.env.STATICRYPT_PASSWORD;
if (!password) {
  console.error("Usage: node build.js <password>");
  console.error("Or set STATICRYPT_PASSWORD environment variable");
  process.exit(1);
}

// 1. docs/ をクリーンアップ
console.log("Cleaning docs/...");
if (fs.existsSync(DOCS_DIR)) {
  fs.rmSync(DOCS_DIR, { recursive: true });
}

// 2. src/ を docs/ にコピー
console.log("Copying src/ -> docs/...");
copyDirSync(SRC_DIR, DOCS_DIR);

// 3. HTML ファイルを検索（docs/ からの相対パスで取得）
const htmlFiles = findFiles(DOCS_DIR, ".html");
const relativeFiles = htmlFiles.map((f) => path.relative(DOCS_DIR, f));
console.log(`Found ${relativeFiles.length} HTML files to encrypt:`);
relativeFiles.forEach((f) => console.log(`  - ${f}`));

// 4. StatiCrypt で各HTMLファイルを個別に暗号化
console.log("\nEncrypting with StatiCrypt...");
const configPath = path.join(__dirname, ".staticrypt.json");
const templateOptions = [
  "--short",
  "--remember 30",
  '--template-title "Protected Page"',
  '--template-instructions "ガイド購入者向けページです。パスワードを入力してください。"',
  '--template-button "認証"',
  '--template-placeholder "パスワード"',
  '--template-remember "ログイン状態を保持（30日間）"',
  '--template-error "パスワードが違います"',
].join(" ");

for (const relFile of relativeFiles) {
  const outDir = path.dirname(relFile) === "." ? "." : path.dirname(relFile);
  console.log(`  Encrypting: ${relFile} -> ${outDir}/`);
  execSync(
    `npx staticrypt "${relFile}" -p "${password}" -d "${outDir}" --config "${path.relative(DOCS_DIR, configPath)}" ${templateOptions}`,
    { stdio: "inherit", cwd: DOCS_DIR }
  );
}

console.log("\nBuild complete! Encrypted files are in docs/");

// --- Helper functions ---

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function findFiles(dir, ext) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

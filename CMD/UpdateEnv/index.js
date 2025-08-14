// updateEnv.mjs or updateEnv.js (with "type": "module" in package.json)

import chalk from "chalk";
import fs from "fs";
import path from "path";

function UpdateEnv() {
  const envPath = path.join(process.cwd(), ".env");

  const requiredKeys = [
    "POSTMANAPIKEY",
    "POSTMANWORKSPACE",
    "BEARER",
    "COUCHDBURL",
    "TAJIRIBASEURL",
    "ENVIRONMENT",
  ];

  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }

  const lines = envContent.split("\n").map((line) => line.trim());
  const existingKeys = new Set(
    lines
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => line.split("=")[0])
  );

  const missingKeys = requiredKeys.filter((key) => !existingKeys.has(key));

  if (missingKeys.length > 0) {
    const toAppend =
      "\n" + missingKeys.map((key) => `${key}=""`).join("\n") + "\n";
    fs.appendFileSync(envPath, toAppend);
    console.log(`✅ Added missing keys: ${missingKeys.join(", ")}`);
  } else {
    console.log("✅ All required keys are present in .env");
  }

  console.log(chalk.green("Added .env requirements"));
}

export default UpdateEnv;

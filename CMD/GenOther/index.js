import getConfig from "../Util/getConfig.js";
import path, { dirname } from "path";

import { fileURLToPath } from "url";

import { promises as fs } from "fs";
import chalk from "chalk";

import { confirm } from "@inquirer/prompts";

import { copyDirContents } from "../Util/copyDirContents.js";

function getCurrentDirectory() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return __dirname;
}
async function GenOther() {
  let baseDir = getCurrentDirectory();
  let cwd = process.cwd();
  let config = getConfig();
  if (!config) {
    console.log(chalk.red("Exiting process run init first"));
    console.log(chalk.red("Run init first"));
    return;
  }

  const shouldGenerate = await confirm({
    message: "Generate Base Directories",
    default: true,
  });

  if (!shouldGenerate) {
    console.log(chalk.yellow("Base directories required to link files"));
    console.log(chalk.grey("To run this cmd again run: tajiri generate base"));
    return;
  }

  let fromDir = path.join(
    baseDir,
    config?.type === "module" ? "modulejs" : "commonjs"
  );

  let toDir = path.join(cwd, config.base, "Controller");

  let copyResult = await copyDirContents(fromDir, toDir);

  // console.log(copyResult);

  if (!copyResult) {
    console.log(chalk.red("Error Generating Prisma and Business logic folder"));
    return;
  }
}

export default GenOther;

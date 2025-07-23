import fs from "fs";
import path from "path";

import { select, input, confirm } from "@inquirer/prompts";
import chalk from "chalk";

import getPrismaFile from "./../Util/getPrismaFilePath.js";
import GenFolderStructure from "../GenFolderStructure/index.js";

import getConfigPath from "../Util/getConfigPath.js";

async function Init() {
  const config = getConfigPath();

  let basePath = config?.base;
  let prismaPath = config?.prisma;

  if (basePath || prismaPath) {
    console.log(
      chalk.red(
        `❌ Initialization already done. Delete config file to reinitialize.`
      )
    );
    return;
  }

  const baseFolder = await input({
    message: "Enter the base folder name:",
    default: "APP",
  });

  if (!baseFolder) {
    throw { custom: true, message: "Base folder name is required." };
  }

  const targetPath = path.resolve(baseFolder);
  const relativePath = path.relative(process.cwd(), targetPath);

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
    console.log(`✅ Folder created at: ${targetPath}`);
  } else {
    console.log(`📂 Folder already exists: ${targetPath}`);
  }

  console.log(chalk.grey("..............................."));
  console.log(chalk.grey("..............................."));

  let prismaFilePath = getPrismaFile(cwd);

  if (!prismaFilePath) {
    console.log(
      chalk.red(
        `❌ Prisma file not found. Project needs to be a Node.js project using Prisma.`
      )
    );
    return;
  }

  prismaFilePath = `./${path.relative(cwd, prismaFilePath)}`;

  // Prompt user for each field to skip
  const defaultFields = ["id", "created_at", "updated_at"];
  const fieldSkip = [];

  for (const field of defaultFields) {
    const shouldSkip = await confirm({
      message: `Do you want to skip field "${field}" from generation?`,
      default: true,
    });

    if (shouldSkip) {
      fieldSkip.push(field);
    }
  }

  const configJson = {
    base: `./${relativePath}`,
    prisma: prismaFilePath,
    fieldSkip,
  };

  fs.writeFileSync(config, JSON.stringify(configJson, null, 2));
  console.log(chalk.green(`✅ tajiri.json config created.`));

  await GenFolderStructure();
}

export default Init;

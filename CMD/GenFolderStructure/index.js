import getPrismaModels from "./../Util/getPrismaModels.js";

import { select, confirm } from "@inquirer/prompts";

import SmartFolders from "./smartFolders.js";

import getConfig from "../Util/getConfig.js";

import getConfigPath from "../Util/getConfigPath.js";
import chalk from "chalk";

import fs from "fs";

async function GenFolderStructure() {
  const shouldGenerate = await confirm({
    message: "Generate Folder Structure?",
    default: true,
  });

  if (!shouldGenerate) {
    console.log("Folder generation skipped.");
    return;
  }

  let config = getConfig();

  if (!config) {
    chalk.red(`❌ tajiri.config file not found run tajiri init`);
    return;
  }

  if (config?.structure) {
    const shouldContinue = await confirm({
      message:
        "A folder structure already exists. Would you like to regenerate it?",
      default: true,
    });
    if (!shouldContinue) {
      return;
    }
  }

  const folderType = await select({
    message: "Choose folder structure type:",
    choices: [
      { name: "Smart (recommended)", value: "smart" },
      { name: "General", value: "General" },
    ],
  });

  //   let models = await getPrismaModels();

  let folderStructure = {};

  if (folderType === "smart") {
    let structure = await SmartFolders();

    if (!structure) {
      return;
    }
    folderStructure = structure;
  } else {
    let models = await getPrismaModels();

    if (!models) {
      chalk.red(`❌ Failed to get prisma models`);
      return;
    }
    let ModelKeys = Object.keys(models);
    for (let model of ModelKeys) {
      folderStructure[model] = model;
    }
  }

  config.structure = folderStructure;

  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2));

  chalk.green("Completed generating folder structure. Check tajiri.json");
}

export default GenFolderStructure;

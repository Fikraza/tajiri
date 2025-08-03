// working on generating crud models

import chalk from "chalk";
import genStructureArray from "./../Util/genStructureArray.js";
import getPrismaModels from "../Util/getPrismaModels.js";

import path from "path";

import pdf from "./pdf.js";
import permission from "./permission.js";
import csv from "./csv.js";

import getConfig from "./../Util/getConfig.js";

import { select, input, confirm } from "@inquirer/prompts";

import fs from "fs";

async function genCrudModels() {
  const config = getConfig();
  const cwd = process.cwd();

  if (!config) {
    console.log(chalk.red(`Failed to read tajiri.config file.Check your path`));
    return;
  }

  const structureArray = genStructureArray();

  if (!structureArray) {
    console.log(chalk.red(`❌ Failed to gen strcture array. Run initialize`));
    return;
  }

  let models = await getPrismaModels();

  // q1
  const toOverite = await select({
    message: "Choose folder structure type:",
    choices: [
      { name: "Skip Created (recommended)", value: false },
      { name: "Overite existing", value: true },
    ],
  });

  const doPrompt = await select({
    message: "Choose folder structure type:",
    choices: [
      { name: "No Prompt", value: false },
      { name: "Get a prompt for each model", value: true },
    ],
  });

  for (let folderArr of structureArray) {
    let folderPath = folderArr.join("/");

    let pathToCreate = path.join(
      cwd,
      config.base,
      "Controller/Scheme/Models",
      folderPath
    );

    let modelName = folderArr[folderArr?.length - 1];

    const model = models[modelName];

    if (!model) {
      console.log(chalk.grey(`Model ${modelName} not found skipping...`));
      return;
    }

    const include = model.include || {};
    const field = model.model || {};
    const search = {
      fuzzy: [],
      pg: [],
    };

    ensureFolderExists(pathToCreate);

    const fieldPath = path.join(pathToCreate, "field.json");
    const inludePath = path.join(pathToCreate, "include.json");
    const permissionPath = path.join(pathToCreate, "permission.js");
    const csvPath = path.join(pathToCreate, "csv.js");
    const pdfPath = path.join(pathToCreate, "pdf.js");
    const searchPath = path.join(pathToCreate, "search.json");

    if (!fs.existsSync(fieldPath)) {
      fs.writeFileSync(fieldPath, JSON.stringify(field, null, 2));
    } else {
      console.log(chalk.grey(`Skipping field.json ${fieldPath}`));
    }

    if (!fs.existsSync(inludePath)) {
      fs.writeFileSync(inludePath, JSON.stringify(include, null, 2));
    } else {
      console.log(chalk.grey(`Skipping Permission.json ${inludePath}`));
    }

    if (!fs.existsSync(permissionPath)) {
      fs.writeFileSync(permissionPath, permission(config?.type), "utf8");
    } else {
      console.log(chalk.grey(`Skipping Permission.js ${permissionPath}`));
    }

    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, csv(config?.type), "utf8");
    } else {
      console.log(chalk.grey(`Skipping csv.js ${csvPath}`));
    }

    if (!fs.existsSync(pdfPath)) {
      fs.writeFileSync(pdfPath, pdf(config.type), "utf8");
    } else {
      console.log(chalk.grey(`Skipping pdf.js ${csvPath}`));
    }

    if (!fs.existsSync(searchPath)) {
      fs.writeFileSync(searchPath, JSON.stringify(search, null, 2));
    } else {
      console.log(chalk.grey(`Skipping Permission.json ${searchPath}`));
    }
  }
}

function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    //console.log(`✅ Created folder: ${folderPath}`);
  }
}

export default genCrudModels;

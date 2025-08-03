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

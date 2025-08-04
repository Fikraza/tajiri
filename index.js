#!/usr/bin/env node

const args = process.argv.slice(2);

import init from "./CMD/Init/index.js";
import util from "./CMD/GenCrudModel/index.js";
import testmodel from "./CMD/Util/getPrismaModels.js";

import GenCrudModel from "./CMD/GenCrudModel/index.js";
import GenMiddleWare from "./CMD/GenMiddleWare/index.js";
import GenBase from "./CMD/GenOther/index.js";
import GenRoutes from "./CMD/GenRoutes/index.js";
import GenScheme from "./CMD/GenScheme/index.js";

import UpdateEnv from "./CMD/UpdateEnv/index.js";
import genCrudModels from "./CMD/GenCrudModel/index.js";

if (args[0]?.toLowerCase() === "init") {
  init();
} else if (
  args[0]?.toLowerCase() === "generate" &&
  args[1]?.toLowerCase() === "crud"
) {
  GenCrudModel();
} else if (
  args[0]?.toLowerCase() === "generate" &&
  args[1]?.toLowerCase() === "middleware"
) {
  GenMiddleWare();
} else if (
  args[0]?.toLowerCase() === "generate" &&
  args[1]?.toLowerCase() === "base"
) {
  GenBase();
} else if (
  args[0]?.toLowerCase() === "generate" &&
  args[1]?.toLowerCase() === "route"
) {
  GenRoutes();
} else if (
  args[0]?.toLowerCase() === "generate" &&
  args[1]?.toLowerCase() === "scheme"
) {
  GenScheme();
} else if (args[0]?.toLowerCase() === "util") {
  UpdateEnv();
}

if (args[0]?.toLocaleLowerCase() === "test") {
  testmodel();
}

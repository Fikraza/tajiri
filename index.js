#!/usr/bin/env node

const args = process.argv.slice(2);

import init from "./CMD/Init/index.js";
import util from "./CMD/GenCrudModel/index.js";
import testmodel from "./CMD/Util/getPrismaModels.js";

if (args[0]?.toLowerCase() === "init") {
  init();
}

if (args[0]?.toLowerCase() === "util") {
  util();
}

if (args[0]?.toLocaleLowerCase() === "test") {
  testmodel();
}

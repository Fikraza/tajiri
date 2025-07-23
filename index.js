#!/usr/bin/env node

const args = process.argv.slice(2);

import init from "./CMD/Init/index.js";
import util from "./CMD/GenFolderStructure/index.js";

if (args[0]?.toLowerCase() === "init") {
  init();
}

if (args[0]?.toLowerCase() === "util") {
  util();
}

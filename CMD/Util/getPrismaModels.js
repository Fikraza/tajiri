import fs from "fs";
import path from "path";
import getConfig from "./getConfig.js";

let dictionary = {
  String: {
    transform: ["str"],
    validation: {
      str: true,
    },
  },
  Int: {
    transform: ["int"],
    validation: {
      number: true,
    },
  },
  BigInt: {
    transform: ["int"],
    validation: {
      number: true,
    },
  },
  Float: {
    transform: ["float"],
    validation: {
      number: true,
    },
  },
  Decimal: {
    transform: [],
    validation: {
      number: true,
    },
  },
  Boolean: {
    transform: [],
    validation: {
      bool: true,
    },
  },
  DateTime: {
    transform: ["dateTime"],
    validation: {
      dateTime: true,
    },
  },
  Bytes: {
    transform: [],
    validation: {},
  },
  Json: { transform: [], validation: {} },
};

async function getPrismaModels() {
  try {
    const cwd = process.cwd();
    const config = getConfig();

    if (!config || !config?.prisma) {
      return null;
    }

    let prismaPath = path.join(cwd, config.prisma);

    if (!fs.existsSync(prismaPath)) {
      return null;
    }

    const data = fs.readFileSync(prismaPath, "utf8");

    const lines = data.split("\n");

    const models = {};
    let foundModel = false;
    let model = null;
    let include = null;
    let modelName = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim()?.replace(/\s+/g, " ");

      if (line.startsWith("model ")) {
        let lineArr = line.split(" ");
        modelName = lineArr[1]
          ?.trim()
          ?.replace(/[\s{}]/g, "")
          ?.toLowerCase();
        if (!modelName) {
          foundModel = false;
          modelName = null;
          model = {};
          include = {};
          continue;
        }

        foundModel = true;
        model = {};
        include = {};
        continue;
      }

      if (foundModel && modelName && model && include) {
        if (line?.includes("}")) {
          models[modelName] = {
            model: structuredClone(model),
            include: structuredClone(include),
          };

          foundModel = false;
          modelName = null;
          model = null;
          include = null;
          continue;
        }
        let lineArr = line?.split(" ");
        let notRequired = lineArr[1]?.includes("?");
        let pos1 = lineArr[0];
        let pos2 = lineArr[1]?.replace(/\?/g, "");
        let pos3 = lineArr[2]?.toLowerCase();

        if (dictionary[pos2] || dictionary[pos2]?.includes("_enum")) {
          model[pos1] = dictionary[pos2] || {};
          notRequired
            ? (model[pos1].required = false)
            : (model[pos1].required = true);
          pos3?.includes("unique")
            ? (model[pos1].validation.unique = true)
            : null;
          continue;
        }

        include[pos1] = true;
      }
    }

    // console.log(models);
    return models;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default getPrismaModels;

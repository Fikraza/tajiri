import fs from "fs";
import path from "path";
import getConfig from "./getConfig.js";
import dictionary from "./prisma_dict.js";

function parseRelation(line, modelName) {
  try {
    const regex =
      /^\s*(\w+)\s+(\w+)\??\s+@relation(?:\("([^"]+)"\))?\s*\(([^)]*)\)/;
    const match = line.match(regex);
    if (!match) return null;

    const [, key, relatedModel, relationName, body] = match;

    // Parse fields from the body
    const fieldMatch = body.match(/fields:\s*\[([^\]]+)\]/);
    const field = fieldMatch ? fieldMatch[1].trim().split(",")[0].trim() : null;

    // If relatedModel is the same as modelName, it's likely a self-relation or pointing outward.
    // Use modelName to determine the related model (other than self)
    const actualRelatedModel = relatedModel === modelName ? key : relatedModel;

    return {
      key,
      field: field || "",
      model: actualRelatedModel,
      to_include: relationName || actualRelatedModel,
    };
  } catch (e) {
    return null;
  }
}

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

    let allRelations = {};

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

      if (foundModel && modelName && model && include) {
        let lineArr = line?.split(" ");

        let notRequired = lineArr[1]?.includes("?");
        let pos1 = lineArr[0];
        let pos2 = lineArr[1]?.replace(/\?/g, "");
        let pos3 = lineArr[2]?.toLowerCase();

        if (dictionary[pos2] || pos2?.includes("_enum")) {
          model[pos1] = dictionary[pos2] || {};
          notRequired
            ? (model[pos1].required = false)
            : (model[pos1].required = true);

          continue;
        }

        if (!pos1.includes("@") && pos1?.trim() !== "") {
          include[pos1] = true;
        }

        let relations = parseRelation(line, modelName);

        if (relations) {
          if (Array.isArray(allRelations[modelName])) {
            allRelations[modelName].push(structuredClone(relations));
            continue;
          }
          allRelations[modelName] = [structuredClone(relations)];
        }
      }
    }
    /// Relation failed
    return models;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default getPrismaModels;

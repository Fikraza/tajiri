import getPrismaModels from "../Util/getPrismaModels.js";
import chalk from "chalk";

async function SmartFolders() {
  let models = await getPrismaModels();
  if (!models) {
    chalk.red(`❌ Failed to get prisma models`);
    return;
  }

  let modelNames = Object.keys(models).sort();

  let modelArray = groupRelatedModels(modelNames);

  return modelArray;
}

function groupRelatedModels(models) {
  const output = {};

  for (const model of models) {
    const root = models.find(
      (base) => model === base || model.startsWith(base + "_")
    );
    if (!output[root]) output[root] = [];

    const subRoot = output[root];
    const parts = model.split("_");

    if (parts.length === 2) {
      // Check if another entry with this prefix exists
      const prefix = parts.slice(0, 2).join("_");
      const index = subRoot.findIndex(
        (item) => Array.isArray(item) && item[0] === prefix
      );

      if (index > -1) {
        subRoot[index].push(model);
      } else {
        // Start new subarray
        const base = parts[0] + "_" + parts[1];
        if (base !== model && models.includes(base)) {
          // Only start a group if the base is present in the models
          const existingIndex = subRoot.findIndex((x) => x === base);
          if (existingIndex > -1) {
            subRoot.splice(existingIndex, 1);
          }
          subRoot.push([base, model]);
        } else {
          subRoot.push(model);
        }
      }
    } else if (parts.length > 2) {
      const base = parts.slice(0, 2).join("_");
      const index = subRoot.findIndex(
        (item) => Array.isArray(item) && item[0] === base
      );

      if (index > -1) {
        subRoot[index].push(model);
      } else {
        if (models.includes(base)) {
          const existingIndex = subRoot.findIndex((x) => x === base);
          if (existingIndex > -1) {
            subRoot.splice(existingIndex, 1);
          }
          subRoot.push([base, model]);
        } else {
          subRoot.push(model);
        }
      }
    } else {
      subRoot.push(model);
    }
  }

  return output;
}

export default SmartFolders;

// [{name:"",path:""},{}]

import getConfig from "./getConfig.js";

function structureArray() {
  try {
    const config = getConfig();

    if (!config?.structure) {
      return null;
    }

    const structure = config.structure;
    const result = [];

    function process(key, items) {
      for (const item of items) {
        if (Array.isArray(item)) {
          process(key, item);
        } else {
          result.push([key, item]);
        }
      }
    }

    for (const [key, items] of Object.entries(structure)) {
      if (items.length === 1) {
        result.push([key]);
        continue;
      }
      process(key, items);
    }

    return result;
  } catch (e) {
    return null;
  }
}

export default structureArray;

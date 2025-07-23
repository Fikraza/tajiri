import fs from "fs";
import path from "path";

function findPrismaFile(startDir) {
  const skipDirs = ["node_modules", ".git"];

  function search(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        if (skipDirs.includes(item.name)) continue;
        const found = search(fullPath);
        if (found) return found;
      }

      if (item.isFile() && item.name === "schema.prisma") {
        return fullPath;
      }
    }

    return null;
  }

  return search(startDir);
}

export default findPrismaFile;

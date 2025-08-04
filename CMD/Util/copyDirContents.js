// copyDirContents.js
import { promises as fs } from "fs";
import path from "path";

/**
 * Recursively copies the contents of one directory into another.
 * @param {string} fromDir - Source directory path
 * @param {string} toDir - Destination directory path
 */
export async function copyDirContents(fromDir, toDir) {
  try {
    await fs.mkdir(toDir, { recursive: true });
    const entries = await fs.readdir(fromDir, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(fromDir, entry.name);
      const destPath = path.join(toDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirContents(srcPath, destPath); // recursive call
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
    return true;
  } catch (e) {
    return null;
  }
}

import path from "path";
import fs from "fs";
function isModuleBased() {
  try {
    const cwd = process.cwd();

    let packagePath = path.join(cwd, "package.json");

    if (!fs.existsSync(packagePath)) {
      //console.log(chalk.yellow(`⚠️  Run mycli-app init before scheme`));
      return null;
    }
    const jsonContent = fs.readFileSync(packagePath, "utf-8");

    if (jsonContent.type === "module") {
      return "module";
    }

    return "commonjs";
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default isModuleBased;

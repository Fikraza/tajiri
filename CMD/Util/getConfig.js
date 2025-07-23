import fs from "fs";
import path from "path";

function getConfig() {
  try {
    const cwd = process.cwd();
    const configPath = path.join(cwd, "tajiri.json");
    ///console.log("configPAth", configPath);

    if (!fs.existsSync(configPath)) {
      //console.log(chalk.yellow(`⚠️  Run mycli-app init before scheme`));
      return null;
    }

    const jsonContent = fs.readFileSync(configPath, "utf-8");
    let config = JSON.parse(jsonContent);

    return config;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export default getConfig;

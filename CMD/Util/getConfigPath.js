import path from "path";

function getConfigPath() {
  const cwd = process.cwd();
  const config = path.join(cwd, "tajiri.json");

  return config;
}

export default getConfigPath;

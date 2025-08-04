import { dirname } from "path";
import { fileURLToPath } from "url";

function getCurrentDirectory() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return __dirname;
}

export default getCurrentDirectory;

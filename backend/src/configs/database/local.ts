import fs from "fs";
import path from "path";

export function loadLocalJson(filename: string) {
  const file = path.join(__dirname, "../../configs/sample_data", filename);

  if (!fs.existsSync(file)) throw new Error(`JSON file missing: ${file}`);

  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log("Using local JSON source:", filename);

  return data;
}

import path from "node:path";

export const TENANT = {
  slug: "apollonia",
  name: "Apollonia Dental Practice",
} as const;

export const INITIAL_DATA_PATH = path.resolve(
  process.cwd(),
  "src/seed/initialData.json",
);

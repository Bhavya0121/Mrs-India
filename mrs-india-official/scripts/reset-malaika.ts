/**
 * One-time maintenance script: remove the DB "malaika" override.
 *
 * The public site merges DB-stored content OVER the code defaults
 * (see src/lib/site-content.ts). The DB currently has a "malaika"
 * override that hides the code default. This script $unsets ONLY the
 * "malaika" field on the singleton site-content document so the merge
 * falls back to DEFAULT_SITE_CONTENT.malaika.
 *
 * It touches nothing else.
 *
 * Run with:  npx tsx scripts/reset-malaika.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// --- Load env the same way the app relies on (.env then .env.local override),
// BEFORE importing the connection helper, which reads process.env.MONGODB_URI
// at module-eval time and throws if it is missing.
function loadEnvFile(filename: string): void {
  let raw: string;
  try {
    raw = readFileSync(resolve(process.cwd(), filename), "utf8");
  } catch {
    return; // file may not exist; that's fine
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    // strip surrounding single or double quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // .env.local overrides .env (loaded second wins)
    process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

async function main(): Promise<void> {
  // Dynamic imports so env is populated before mongodb.ts is evaluated.
  const { connectToDatabase } = await import("../src/lib/mongodb");
  const { default: SiteContent } = await import("../src/models/SiteContent");

  const mongoose = await connectToDatabase();

  const before = await SiteContent.findOne({ key: "singleton" }).lean();
  if (!before) {
    console.log('No site content document found (key: "singleton"). Nothing to do.');
    await mongoose.connection.close();
    return;
  }

  console.log("=== Document BEFORE ===");
  console.dir(before, { depth: null });

  const result = await SiteContent.updateOne(
    { key: "singleton" },
    { $unset: { malaika: "" } }
  );
  console.log("\n$unset malaika result:", result);

  const after = await SiteContent.findOne({ key: "singleton" }).lean();
  console.log("\n=== Document AFTER ===");
  console.dir(after, { depth: null });

  await mongoose.connection.close();
  console.log("\nDone. Connection closed.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("reset-malaika failed:", err);
    process.exit(1);
  });

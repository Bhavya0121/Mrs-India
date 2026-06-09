#!/usr/bin/env node
// Usage: node scripts/create-agent.mjs <email> <password> [name]
// Upserts an Agent document with a bcrypt-hashed password.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawVal] = match;
    if (process.env[key]) continue;
    let val = rawVal.trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

function die(msg, code = 1) {
  console.error(`✖ ${msg}`);
  process.exit(code);
}

async function main() {
  loadDotEnv();

  const [, , emailArg, passwordArg, ...nameParts] = process.argv;
  if (!emailArg || !passwordArg) {
    die(
      "Usage: node scripts/create-agent.mjs <email> <password> [name]"
    );
  }

  const email = emailArg.toLowerCase().trim();
  const password = String(passwordArg);
  const name = nameParts.length ? nameParts.join(" ").trim() : undefined;

  if (password.length < 8) {
    die("Password must be at least 8 characters.");
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    die("MONGODB_URI is not set in environment or .env.");
  }

  const agentSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password_hash: { type: String, required: true },
      name: { type: String },
      role: { type: String, default: "agent" },
    },
    { timestamps: true, collection: "agents" }
  );

  const Agent =
    mongoose.models.Agent || mongoose.model("Agent", agentSchema);

  await mongoose.connect(uri);

  const password_hash = await bcrypt.hash(password, 12);

  const update = { password_hash };
  if (name) update.name = name;

  const doc = await Agent.findOneAndUpdate(
    { email },
    { $set: update, $setOnInsert: { role: "agent" } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(
    `✓ Upserted agent: ${doc.email} (id ${doc._id}${
      doc.name ? `, name "${doc.name}"` : ""
    })`
  );

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("✖ Failed to create agent.");
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});

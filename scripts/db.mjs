// Runs the Supabase CLI against the hosted database.
//
//   npm run db:push          apply every migration the database has not seen
//   npm run db:push -- --dry-run
//   npm run db:status        which migrations are applied, which are pending
//   npm run db:new <name>    create an empty timestamped migration file
//
// Exists for one reason: the connection string contains the database password,
// so it must come from .env.local (gitignored) rather than from package.json or
// a shell history. Node loads that file itself via --env-file-if-exists in the
// npm script; this wrapper reads SUPABASE_DB_URL out of the environment and
// hands it to the CLI as --db-url, then forwards everything else untouched.
//
// The CLI is not a dependency of the app, so it comes from npx on demand.

import { spawnSync } from "node:child_process";

const [command, ...rest] = process.argv.slice(2);

if (!command) {
  console.error("Usage: node scripts/db.mjs <push|status|new|diff> [args]");
  process.exit(1);
}

// `migration new` only writes a file. Everything else here talks to the
// database — `migration list` included, since it compares local against remote.
const needsDatabase = !(command === "migration" && rest[0] === "new");

const url = process.env.SUPABASE_DB_URL;

if (needsDatabase && !url) {
  console.error(
    [
      "SUPABASE_DB_URL is not set.",
      "",
      "Add the session-mode pooler connection string to .env.local:",
      "",
      "  SUPABASE_DB_URL=postgresql://postgres.<project-ref>:<password>" +
        "@aws-0-<region>.pooler.supabase.com:5432/postgres",
      "",
      "Dashboard -> Project Settings -> Database -> Connection string.",
      "Port 5432 (session mode), not 6543: the transaction pooler is for the",
      "app's queries and does not support the statements a migration runs.",
    ].join("\n"),
  );
  process.exit(1);
}

const result = spawnSync(
  "npx",
  [
    "-y",
    "supabase@latest",
    command,
    ...rest,
    ...(needsDatabase ? ["--db-url", url] : []),
  ],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);

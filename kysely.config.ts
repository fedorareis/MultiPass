import { defineConfig } from "kysely-ctl";
import { db } from "./utils/database";
import { FileMigrationProvider, Migrator } from "kysely";
import * as path from "path";
import { promises as fs } from "fs";

export default defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  dialect: db,
  migrations: {
    migrator: new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        // This needs to be an absolute path.
        migrationFolder: path.join(__dirname, "utils/migrations"),
      }),
    }),
  },
  //   migrations: {
  //     migrationFolder: "migrations",
  //   },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});

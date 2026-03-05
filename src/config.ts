import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

/**
 * Resolves the absolute path to the config file in the user's home directory.
 *
 * @returns Full path to the `.gatorconfig.json` file.
 */
function getConfigFilePath(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, ".gatorconfig.json");
}

/**
 * Writes the config object to the config file as JSON with snake_case keys.
 *
 * @param cfg - Config object with camelCase keys to persist.
 * @returns void
 */
function writeConfig(cfg: Config): void {
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  const configPath = getConfigFilePath();
  const fileContents = JSON.stringify(rawConfig, null, 2);

  fs.writeFileSync(configPath, fileContents, { encoding: "utf-8" });
}

/**
 * Validates and normalizes a raw config object into a typed Config.
 *
 * @param rawConfig - Untrusted raw configuration object, typically parsed from JSON.
 * @returns Normalized Config object with validated properties.
 * @throws {Error} When db_url is missing or not a non-empty string.
 */
function validateConfig(rawConfig: any): Config {
  if (rawConfig === null || typeof rawConfig !== "object") {
    throw new Error("Invalid config: expected an object.");
  }

  const dbUrl = rawConfig.db_url;

  if (typeof dbUrl !== "string" || dbUrl.trim().length === 0) {
    throw new Error("Invalid config: 'db_url' must be a non-empty string.");
  }

  // TODO: to be reviewed
  const currentUserNameRaw = rawConfig.current_user_name;
  const currentUserName =
    typeof currentUserNameRaw === "string" &&
    currentUserNameRaw.trim().length > 0
      ? currentUserNameRaw
      : os.userInfo().username;

  return {
    dbUrl: dbUrl.trim(),
    currentUserName,
  };
}

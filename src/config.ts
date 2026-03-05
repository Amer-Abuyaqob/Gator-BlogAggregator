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

function validateConfig(rawConfig: any): Config {
  // TODO: checks that rawConfig has a valid db_url string, then maps it into a Config object and returns it.
}

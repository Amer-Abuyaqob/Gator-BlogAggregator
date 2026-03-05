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

function writeConfig(cfg: Config): void {
  // TODO: converts the Config object back to snake_case keys and writes it to the file as JSON.
}

function validateConfig(rawConfig: any): Config {
  // TODO: checks that rawConfig has a valid db_url string, then maps it into a Config object and returns it.
}

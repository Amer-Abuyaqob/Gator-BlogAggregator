import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath(): string {
  // TODO: joins the home directory with the filename .gatorconfig.json and returns the full path as a string.

}

function writeConfig(cfg: Config): void {
  // TODO: converts the Config object back to snake_case keys and writes it to the file as JSON.

}

function validateConfig(rawConfig: any): Config {
  // TODO: checks that rawConfig has a valid db_url string, then maps it into a Config object and returns it.
  
}
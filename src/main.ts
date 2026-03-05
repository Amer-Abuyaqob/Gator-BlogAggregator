import { readConfig, setUser } from "./config.js";

/**
 * Entry point for the CLI application.
 *
 * @returns void
 */
function main(): void {
  setUser("Amer Abuyaqob");
  const config = readConfig();
  console.log(config);
}

main();

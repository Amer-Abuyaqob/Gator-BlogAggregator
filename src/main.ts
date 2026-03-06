import {
  registerCommand,
  runCommand,
  type CommandsRegistry,
} from "./commands/commands.js";
import { handlerLogin, handlerRegister } from "./commands/users.js";

/**
 * Creates the command registry and registers all CLI commands.
 *
 * @returns The populated CommandsRegistry.
 */
function createRegistry(): CommandsRegistry {
  const registry: CommandsRegistry = {};
  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  return registry;
}

/**
 * Prints a message to stderr and exits with code 1.
 *
 * @param message - The message to print before exiting.
 */
function printErrorAndExit(message: string): never {
  console.error(message);
  process.exit(1);
}

/**
 * Parses CLI arguments into command name and args. Exits with usage if none provided.
 *
 * @returns Tuple of [cmdName, cmdArgs].
 */
function parseCliArgs(): [string, string[]] {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    printErrorAndExit("Usage: gator <command> [args]");
  }
  const [cmdName, ...cmdArgs] = args;
  return [cmdName, cmdArgs];
}

/**
 * Runs a command with error handling; exits with code 1 on failure.
 *
 * @param registry - The commands registry.
 * @param cmdName - The command name to run.
 * @param args - Arguments for the command.
 * @returns Promise that resolves when the command completes.
 */
async function executeCommand(
  registry: CommandsRegistry,
  cmdName: string,
  args: string[],
): Promise<void> {
  try {
    await runCommand(registry, cmdName, ...args);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    printErrorAndExit(`Error: ${message}`);
  }
}

/**
 * Entry point for the CLI application.
 *
 * @returns Promise that resolves when the CLI finishes.
 */
async function main(): Promise<void> {
  const registry = createRegistry();
  const [cmdName, cmdArgs] = parseCliArgs();
  await executeCommand(registry, cmdName, cmdArgs);
  process.exit(0);
}

main().catch((e) => {
  const message = e instanceof Error ? e.message : String(e);
  printErrorAndExit(`Error: ${message}`);
});

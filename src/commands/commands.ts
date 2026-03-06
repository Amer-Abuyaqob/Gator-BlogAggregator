/**
 * Function type for handling CLI commands.
 *
 * @param cmdName - The command name to execute.
 * @param args - Variadic list of string arguments passed to the command.
 * @returns Promise that resolves when the command completes.
 */
export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

/**
 * Registry mapping command names to their handler functions.
 *
 * @property [key: string] - Command name as key; CommandHandler as value.
 */
export type CommandsRegistry = Record<string, CommandHandler>;

/**
 * Registers a command handler in the registry.
 *
 * @param registry - The commands registry to update.
 * @param cmdName - The command name to register.
 * @param handler - The handler function for the command.
 * @returns void
 */
export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

/**
 * Looks up and runs a command handler from the registry.
 *
 * @param registry - The commands registry to query.
 * @param cmdName - The command name to run.
 * @param args - Variadic list of string arguments for the command.
 * @returns Promise that resolves when the command handler completes.
 * @throws {Error} When the command is not registered (e.g., "Unknown command: xyz").
 */
export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (handler === undefined) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  await handler(cmdName, ...args);
}

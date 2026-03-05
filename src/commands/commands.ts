/**
 * Function type for handling CLI commands.
 *
 * @param cmdName - The command name to execute.
 * @param args - Variadic list of string arguments passed to the command.
 * @returns void
 */
export type CommandHandler = (cmdName: string, ...args: string[]) => void;

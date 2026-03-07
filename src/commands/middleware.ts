import { readConfig } from "../config.js";
import { getUser } from "../lib/db/queries/users.js";
import { User } from "./feeds.js";
import type { CommandHandler } from "./commands.js";

/**
 * Handler type for commands that require a logged-in user.
 *
 * @param cmdName - The command name.
 * @param user - The authenticated user from the database.
 * @param args - Variadic list of string arguments passed to the command.
 * @returns Promise that resolves when the command completes.
 */
export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

/**
 * Wraps a UserCommandHandler with logged-in checks. Resolves the current user
 * from config and database before invoking the handler; throws if not logged in
 * or user not found.
 *
 * @param handler - The handler that requires an authenticated user.
 * @returns A CommandHandler that can be registered.
 */
export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig();
    const userName = config.currentUserName?.trim() ?? "";
    if (userName.length === 0) {
      throw new Error("Must be logged in. Use 'login' or 'register' first.");
    }
    const user = await getUser(userName);
    if (!user) {
      throw new Error(`User ${userName} not found`);
    }
    await handler(cmdName, user, ...args);
  };
}

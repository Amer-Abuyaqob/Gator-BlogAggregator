import { getUser } from "../lib/db/queries/users.js";
import { setUser } from "../config.js";

/**
 * Ensures a user exists in the database; throws if not found.
 *
 * @param userName - The display name to look up.
 * @returns Promise that resolves when the user exists.
 * @throws {Error} When the user does not exist in the database.
 */
async function ensureUserExists(userName: string): Promise<void> {
  const user = await getUser(userName);
  if (user === undefined) {
    throw new Error("Invalid login: User does not exist.");
  }
}

/**
 * Persists the username to config and prints a success message.
 *
 * @param userName - The username to set.
 * @returns void
 */
function persistUserAndNotify(userName: string): void {
  setUser(userName);
  console.log(`User set to: ${userName}.`);
}

/**
 * Handles the login command. Verifies the user exists in the database, then sets the current user in the config.
 *
 * @param _cmdName - The command name (unused).
 * @param args - Variadic list of arguments; first element is the username.
 * @returns Promise that resolves when the login completes.
 * @throws {Error} When no username is provided or the user does not exist in the database.
 */
export async function handlerLogin(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error("Invalid login: username is required for login.");
  }

  const userName = args[0];
  await ensureUserExists(userName);
  persistUserAndNotify(userName);
}

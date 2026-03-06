import { setUser } from "../config.js";

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
 * Handles the login command. Sets the current user in the config.
 *
 * @param _cmdName - The command name (unused).
 * @param args - Variadic list of arguments; first element is the username.
 * @returns Promise that resolves when the login completes.
 */
export async function handlerLogin(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  if (args.length === 0) {
    throw new Error(
      "Invalid login credentials: username is required for login.",
    );
  }

  const userName = args[0];
  persistUserAndNotify(userName);
}

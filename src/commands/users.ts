import { createUser, getUsers, getUser } from "../lib/db/queries/users.js";
import { readConfig, setUser } from "../config.js";

/**
 * Formats a single user line for the list output.
 *
 * @param userName - The user's display name.
 * @param isCurrent - Whether this user is the currently logged-in user.
 * @returns A line in the form "* name" or "* name (current)".
 */
function formatUserLine(userName: string, isCurrent: boolean): string {
  const suffix = isCurrent ? " (current)" : "";
  return `* ${userName}${suffix}`;
}

/**
 * Returns the currently logged-in user name from config, or empty string if unset or config read fails.
 *
 * @returns The current user name, or "" when none is set or config is unavailable.
 */
function getCurrentUserName(): string {
  try {
    const config = readConfig();
    return config.currentUserName ?? "";
  } catch {
    return "";
  }
}

/**
 * Handles the users command. Lists all users from the database and marks the current user.
 *
 * @param _cmdName - The command name (unused).
 * @param _args - Unused for this command.
 * @returns Promise that resolves when the list has been printed.
 */
export async function handlerListUsers(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const allUsers = await getUsers();
  const currentUserName = getCurrentUserName();

  for (const user of allUsers) {
    const line = formatUserLine(user.name, user.name === currentUserName);
    console.log(line);
  }
}

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
  const userName = parseUserName(args, "login");
  await ensureUserExists(userName);
  persistUserAndNotify(userName);
}

/**
 * Parses and validates the username from command args; throws if missing.
 *
 * @param args - Raw command arguments.
 * @param context - Command context for error message ("login" or "register").
 * @returns The trimmed username.
 * @throws {Error} When args is empty or the first element is empty/whitespace.
 */
function parseUserName(args: string[], context: "login" | "register"): string {
  if (args.length === 0 || !args[0]?.trim()) {
    const message =
      context === "login"
        ? "Invalid login: username is required."
        : "Invalid register: username is required.";
    throw new Error(message);
  }
  return args[0].trim();
}

/**
 * Handles the register command. Creates a new user in the database and sets them as current.
 *
 * @param _cmdName - The command name (unused).
 * @param args - Variadic list of arguments; first element is the username.
 * @returns Promise that resolves when registration completes.
 * @throws {Error} When no username is provided or the username already exists (unique constraint).
 */
export async function handlerRegister(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  const userName = parseUserName(args, "register");
  const user = await createUser(userName);
  persistUserAndNotify(user.name);
  console.log(`User ${user.name} was created successfully!`);
}

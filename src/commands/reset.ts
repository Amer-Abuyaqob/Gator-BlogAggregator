import { deleteAllUsers } from "../lib/db/queries/users.js";

/**
 * Logs a success message for the reset command.
 *
 * @param deletedCount - Number of users that were deleted.
 * @returns void
 */
function reportResetSuccess(deletedCount: number): void {
  const message =
    deletedCount === 0
      ? "Database reset. No users were in the database."
      : `Database reset. Deleted ${deletedCount} user(s).`;
  console.log(message);
}

/**
 * Handles the reset command. Deletes all users from the database and reports the outcome.
 *
 * @param _cmdName - The command name (unused).
 * @param _args - Variadic list of arguments (unused for reset).
 * @returns Promise that resolves when the reset completes.
 * @throws {Error} When the database operation fails (propagates to main for exit code 1).
 */
export async function handlerReset(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const deletedCount = await deleteAllUsers();
  reportResetSuccess(deletedCount);
}

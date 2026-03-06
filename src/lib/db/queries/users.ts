import { db } from "../index.js";
import { users } from "../schema.js";

/**
 * Inserts a new user into the database and returns the created row.
 *
 * @param name - The unique display name for the user.
 * @returns The inserted user object with id, createdAt, updatedAt, and name.
 * @throws {Error} When the name violates uniqueness or other DB constraints.
 */
export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name }).returning();
  return result;
}

import { eq, asc } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";

/**
 * Returns all users from the database, ordered by name ascending.
 *
 * @returns Promise resolving to an array of user rows (id, createdAt, updatedAt, name).
 * @throws {Error} When the database operation fails.
 */
export async function getUsers() {
  return db.select().from(users).orderBy(asc(users.name));
}

/**
 * Deletes all rows from the users table.
 *
 * @returns The number of users that were deleted.
 * @throws {Error} When the database operation fails.
 */
export async function deleteAllUsers(): Promise<number> {
  const deleted = await db.delete(users).returning({ id: users.id });
  return deleted.length;
}

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

/**
 * Looks up a user by display name.
 *
 * @param name - The display name to search for.
 * @returns The user object if found, or undefined if no user matches.
 */
export async function getUser(name: string) {
  const [user] = await db.select().from(users).where(eq(users.name, name));
  return user;
}

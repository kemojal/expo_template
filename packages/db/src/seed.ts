import { config } from "dotenv";
config({ path: "../../.env" });

async function seed() {
  const { db } = await import("./index");
  const { users, todos } = await import("./schema");

  console.log("Seeding database...");

  // Clear existing data
  await db.delete(todos);
  await db.delete(users);

  // Create demo user
  const [user] = await db
    .insert(users)
    .values({
      id: "user-1",
      name: "Demo User",
      email: "demo@example.com",
    })
    .returning();

  // Create sample todos
  await db.insert(todos).values([
    {
      id: "todo-1",
      title: "Set up the project",
      completed: true,
      userId: user.id,
    },
    {
      id: "todo-2",
      title: "Build the API",
      completed: false,
      userId: user.id,
    },
    {
      id: "todo-3",
      title: "Add authentication",
      completed: false,
      userId: user.id,
    },
  ]);

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

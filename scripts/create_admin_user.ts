import { db } from "../server/db";
import { users } from "../shared/schema";
import { hashPassword } from "../server/auth";

async function createAdminUser() {
  try {
    console.log("Checking if admin user already exists...");
    const existingUsers = await db.select().from(users).where(users.username === "jefe");
    
    if (existingUsers.length > 0) {
      console.log("Admin user 'jefe' already exists");
      process.exit(0);
    }
    
    const hashedPassword = await hashPassword("instacabo");
    
    console.log("Creating admin user 'jefe'...");
    const [user] = await db.insert(users).values({
      username: "jefe",
      password: hashedPassword,
      email: "admin@cabosanlucas.com",
      role: "admin",
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log("Admin user created successfully:", user);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
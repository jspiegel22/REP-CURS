import { db } from "../server/db";
import { users } from "../shared/schema";
import { hashPassword } from "../server/auth";
import { eq } from "drizzle-orm";

/**
 * This script ensures that the admin user 'jefe' exists with password 'instacabo'
 * It either creates the user if it doesn't exist, or updates the password if it does
 */
async function ensureAdminUser() {
  try {
    console.log("Checking for admin user 'jefe'...");
    
    const existingUsers = await db.select().from(users).where(eq(users.username, "jefe"));
    const hashedPassword = await hashPassword("instacabo");
    
    if (existingUsers.length === 0) {
      // Create the admin user
      console.log("Admin user 'jefe' doesn't exist, creating...");
      
      const result = await db.insert(users).values({
        username: "jefe",
        password: hashedPassword,
        role: "admin",
        points: 0
      }).returning();
      
      console.log("Admin user created with ID:", result[0].id);
    } else {
      // Update the admin user's password
      console.log("Admin user 'jefe' exists, updating password...");
      
      const result = await db.update(users)
        .set({ password: hashedPassword })
        .where(eq(users.username, "jefe"))
        .returning();
      
      console.log("Admin user password updated for ID:", result[0].id);
    }
    
    // Verify the user exists with correct role
    const [adminUser] = await db.select().from(users).where(eq(users.username, "jefe"));
    
    if (adminUser && adminUser.role === "admin") {
      console.log("✅ Admin user 'jefe' is set up correctly with role:", adminUser.role);
    } else if (adminUser) {
      console.log("⚠️ Admin user exists but has incorrect role:", adminUser.role);
      
      // Update the role to admin
      await db.update(users)
        .set({ role: "admin" })
        .where(eq(users.username, "jefe"));
      
      console.log("✅ Admin user role updated to 'admin'");
    }
    
    console.log("\nAdmin login credentials:");
    console.log("Username: jefe");
    console.log("Password: instacabo");
    
    process.exit(0);
  } catch (error) {
    console.error("Error in ensure_admin_user script:", error);
    process.exit(1);
  }
}

ensureAdminUser();
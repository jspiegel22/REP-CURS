import { db } from "../server/db";
import { users } from "../shared/schema";
import { hashPassword } from "../server/auth";
import { eq } from "drizzle-orm";

async function updateAdminPassword() {
  try {
    console.log("Updating admin user password...");
    
    // Hash the new password
    const hashedPassword = await hashPassword("instacabo");
    
    // Update the user's password
    const [updatedUser] = await db.update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.username, "jefe"))
      .returning();
    
    if (updatedUser) {
      console.log("Admin user password updated successfully for user:", updatedUser.username);
    } else {
      console.log("No admin user found with username 'jefe'");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error updating admin user password:", error);
    process.exit(1);
  }
}

updateAdminPassword();
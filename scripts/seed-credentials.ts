import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_TOKEN,
});

const CREDENTIALS = [
  { username: "employee",   password: "employee123",   role: "employee",    name: "Employee User" },
  { username: "supervisor", password: "supervisor123", role: "supervisor",  name: "Supervisor User" },
  { username: "hrdd_admin", password: "hrddadmin123",  role: "hrdd_admin",  name: "HRDD Admin User" },
  { username: "signatory",  password: "signatory123",  role: "signatory",   name: "Authorized Signatory" },
];

async function main() {
  for (const cred of CREDENTIALS) {
    const passwordHash = await bcrypt.hash(cred.password, 10);

    const result = await client.execute({
      sql: `INSERT INTO users (username, full_name, role, is_active, updated_at)
            VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
            ON CONFLICT(username) DO UPDATE SET
              full_name = excluded.full_name,
              role = excluded.role,
              is_active = excluded.is_active,
              updated_at = CURRENT_TIMESTAMP
            RETURNING id`,
      args: [cred.username, cred.name, cred.role],
    });

    const userId = result.rows[0]?.id;
    if (userId) {
      await client.execute({
        sql: `INSERT INTO auth_accounts (user_id, username, password_hash, password_hint)
              VALUES (?, ?, ?, ?)
              ON CONFLICT(username) DO UPDATE SET
                user_id = excluded.user_id,
                password_hash = excluded.password_hash,
                password_hint = excluded.password_hint`,
        args: [userId, cred.username, passwordHash, cred.password],
      });
      console.log(`✓ Seeded: ${cred.username} (${cred.name}) - Role: ${cred.role}`);
    }
  }
  console.log("\n✓ Done.");
}

main().catch(console.error);

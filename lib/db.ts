import { createClient } from "@libsql/client";

// Database client singleton - uses environment variables
let dbClient: ReturnType<typeof createClient> | null = null;

export function getDbClient() {
  if (!dbClient) {
    const databaseUrl = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_TOKEN;

    if (!databaseUrl) {
      throw new Error("Missing TURSO_DATABASE_URL environment variable");
    }

    dbClient = createClient({
      url: databaseUrl,
      authToken: authToken || undefined,
    });
  }

  return dbClient;
}

export async function closeDbClient() {
  if (dbClient) {
    await dbClient.close();
    dbClient = null;
  }
}

// Helper to execute a query
export async function executeQuery(sql: string, args: any[] = []) {
  const client = getDbClient();
  return await client.execute({ sql, args });
}

// Helper to get a single row
export async function getOne<T = any>(sql: string, args: any[] = []): Promise<T | null> {
  const result = await executeQuery(sql, args);
  return (result.rows[0] as T) || null;
}

// Helper to get all rows
export async function getAll<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const result = await executeQuery(sql, args);
  return result.rows as T[];
}

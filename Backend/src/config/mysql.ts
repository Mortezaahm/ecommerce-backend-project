import mysql from "mysql2/promise";
import {env} from "./env";

const pool = mysql.createPool({
  host: env.MYSQL_HOST!,
  port: Number(env.MYSQL_PORT) || 3306,
  user: env.MYSQL_USER!,
  password: env.MYSQL_PASSWORD!,
  database: env.MYSQL_DATABASE!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testMySQLConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error);
  }
}

export default pool;

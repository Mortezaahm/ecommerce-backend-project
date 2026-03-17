// user model mysql
import pool from "../../config/mysql";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
export interface DBUser extends RowDataPacket {
    id: number,
    name: string,
    email: string,
    password: string,
    address?: string | null,
    phone?: string | null,
    role: "user" | "admin"
}

// Separate type for just Creating User Input and omit "any" in whole code
export type CreateUserInput = {
  name: string,
  email: string,
  password: string,
  address?: string | null,
  phone?: string | null,
  role: "user" | "admin"
}

// insert into database users in mysql
export const createUser = async (user: CreateUserInput) => {
  const { name, email, password, address, phone, role } = user;

  const [result] = await pool.execute<ResultSetHeader> (
    `
    INSERT INTO users (name, email, password, address, phone, role)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [name, email, password, address ?? null, phone ?? null, role || "user"]
  );

  return result.insertId;
};

// find user by email
export const findUserByEmail = async (email: string) => {
  const [rows] = await pool.execute<DBUser[]>(
    `
    SELECT id, name, email, password, role FROM users
    WHERE email = ?
    `,
    [email]
  );

  return rows[0];
};

// find user by id
export const findUserById = async (id: number) => {
  const [rows]: any = await pool.execute(
    `
    SELECT id, name, email, role
    FROM users
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};

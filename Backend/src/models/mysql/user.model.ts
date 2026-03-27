// user model mysql
import pool from "../../config/mysql";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

// Define correct types for CRUD functions
// 1) Type for full data from DB (internal use only)
export interface DBUser extends RowDataPacket {
    id: number,
    name: string,
    email: string,
    password: string,
    address?: string | null,
    phone?: string | null,
    role: "user" | "admin"
}

// 2) Separate type for just Creating User Input and delete "any" - Type for Create
export type CreateUserInput = {
  name: string,
  email: string,
  password: string,
  address?: string | null,
  phone?: string | null,
  role: "user" | "admin"
}

// 3) define a type for just find user by id and delete "any" in function - Type for get by id
export interface SafeUser extends RowDataPacket {
  id: number,
  name: string,
  email: string,
  role: "user" | "admin"
}

// 4) define a type for update
export interface UpdateUserInput {
  name: string,
  email: string,
  role: "user" | "admin"
}


// CRUD => Create , GET + GET by ID, Update , and DELETE
// 1) insert into database users in mysql Create USER
export const createUser = async (user: CreateUserInput) => {
  try {
    const { name, email, password, address, phone, role } = user;

    const [result] = await pool.execute<ResultSetHeader> (
      `
      INSERT INTO users (name, email, password, address, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, password, address ?? null, phone ?? null, role || "user"]
    );

    return result.insertId;
  } catch (error) {
    throw new Error (`Failed to create user: ${(error as Error).message}`)
  }
};

// Get all users / for admin panel - not used in this project but can be useful for future
export const getAllUsers = async (): Promise<SafeUser[]> => {
  try {
    const [rows] = await pool.execute<SafeUser[]>(
      `
      SELECT id, name, email, role
      FROM users
      `
    );

    return rows;
  } catch (error) {
    throw new Error(`Failed to get users: ${(error as Error).message}`);
  }
};


// 2) Get = find user by email
export const findUserByEmail = async (email: string) => {
  try {

    const [rows] = await pool.execute<DBUser[]>(
      `
      SELECT id, name, email, password, role FROM users
      WHERE email = ?
      `,
      [email]
    );

    return rows[0];
  } catch (error) {
    throw new Error(`Failed to find user by email: ${error as Error}.message`);
  }
};

// 3) Get by ID = find user by id
export const findUserById = async (id: number):Promise<SafeUser | undefined> => {
  try {

    const [rows] = await pool.execute<SafeUser[]>(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    return rows[0];
  } catch (error) {
    throw new Error(`Failed to find user by id: ${error as Error}.message`);
  }
};

// 4) Update User
export const updateUser = async (id:number, user:UpdateUserInput): Promise<boolean> => {
  try {
    const { name, email, role } = user;

    const [result] = await pool.execute<ResultSetHeader>(
      `
      UPDATE users
      SET name = ?, email = ?, role = ?
      WHERE id = ?
      `,
      [name, email, role, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Failed to update user: ${error as Error}.message`);
  }
}

// 5) Delete User
export const deleteUser = async (id:number):Promise<boolean> => {
  try {

    const [result] = await pool.execute<ResultSetHeader>(
      `
      DELETE FROM users WHERE id = ?
      ` ,
      [id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Failed to delete user: ${(error as Error).message}`);
  }
}

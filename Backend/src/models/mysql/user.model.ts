// user model mysql
import pool from "../../config/mysql";
export interface User {
    id?: number,
    name: string,
    email: string,
    password: string,
    role?: "user" | "admin"
}

// insert into database users in mysql
export const createUser = async (user: User) => {
  const { name, email, password, role } = user;

  const [result]: any = await pool.execute(
    `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
    `,
    [name, email, password, role || "user"]
  );

  return result.insertId;
};

// find user by email
export const findUserByEmail = async (email: string) => {
  const [rows]: any = await pool.execute(
    `
    SELECT * FROM users
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

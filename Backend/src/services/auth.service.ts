// logic for authentication and authorization
import {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    deleteUser,
    type CreateUserInput
} from "../models/mysql/user.model";
import { hashPassword, comparePassword} from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import type { RegisterInput, LoginInput } from "../validations/auth.validation";

// create a type for register input without confirm email and confirm password
type CleanRegisterInput = Omit<RegisterInput, "confirmEmail" | "confirmPassword">;

// create a type for update user
type UpdateUserInput = {
    name?: string,
    email?: string,
    role?: "user" | "admin"
}


//  *******=======********* Register function *******=======*********
export const registerUser = async (data: CleanRegisterInput) => {
    // deconstruct user
    const { name, email, password, address, phone } = data;
    // check if user exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exist");
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    const userData: CreateUserInput = {
        name,
        email,
        password: hashedPassword,
        role: "user",
        address: address ?? null,
        phone: phone ?? null
    };

    // check optional fields
    if (address) userData.address = address;
    if (phone) userData.phone = phone;

    //create user
    const userId = await createUser (userData);

    //generate Token
    const token = generateToken(userId);
    return {
        token,
        userId
    };
};

//  *******=======********* Login function *******=======*********
export const loginUser = async (data: LoginInput) => {
    const { email, password } = data;
    //find user
    const user = await findUserByEmail(email);
    if (!user) {
    throw new Error("Invalid credentials");
    }

  // compare password
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  //generate token
  const token = generateToken(user.id);

  return {
    token,
    userId: user.id
 };
}


// ONLY ADMIN MUST USE THESE FUNCTIONS
//  *******=======********* Update function *******=======*********
export const updateUserService = async (id: number, data: UpdateUserInput) => {
    // 1) Check if user exists
    const existingUser = await findUserById(id);
    if (!existingUser) {
        throw new Error ("User not found");
    }

    // 2)email check
    if (data.email) {
        const userWithEmail = await findUserByEmail(data.email);
        if (userWithEmail && userWithEmail.id !== id) {
            throw new Error ("Email already in use");
        }
    }

    // 3) update
    const updated = await updateUser(id, {
        name: data.name ?? existingUser.name,
        email: data.email ?? existingUser.email,
        role: data.role ?? existingUser.role
    });

    if (!updated) {
        throw new Error ("Failed to update user");
    }

    return {message: "User updated successfully"}
}

//  *******=======********* Delete function *******=======*********
export const deleteUserService = async(id:number) => {
    // 1) check if user exists
    const existingUser = await findUserById(id);

    if (!existingUser) {
        throw new Error ("User not found")
    }

    // 2)delete
    const deleted = await findUserById(id);

    if (!deleted) {
        throw new Error ("Failed to delete user");
    }

    return {message: "User deleted successfully"};
}

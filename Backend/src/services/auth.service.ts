// logic for authentication and authorization
import {
    createUser,
    findUserByEmail,
    type CreateUserInput
} from "../models/mysql/user.model";
import { hashPassword, comparePassword} from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import type { RegisterInput, LoginInput } from "../validations/auth.validation";

// create a type for register input without confirm email and confirm password
type CleanRegisterInput = Omit<RegisterInput, "confirmEmail" | "confirmPassword">;

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
    const token = generateToken(userId, "user");
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
  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
 };
}

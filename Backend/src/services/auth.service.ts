// logic for authentication and authorization
import { createUser, findUserByEmail } from "../models/mysql/user.model";
import { hashPassword, comparePassword} from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";


export const registerUser = async (name: string, email: string, password: string) => {
    // check if user exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exist");
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    //create user
    const userId = await createUser ({
        name,
        email,
        password: hashedPassword,
    });

    //generate Token
    const token = generateToken(userId);
    return {
        token,
        userId
    };
};

export const loginUser = async (email: string, password:string) => {
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
}
}

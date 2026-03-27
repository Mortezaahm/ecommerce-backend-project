import * as userModel from '../models/mysql/user.model';

// create a type for update user -- ADMIN ONLY
type UpdateUserInput = {
    name?: string,
    email?: string,
    role?: "user" | "admin"
}

export const getUsersService = async () => {
  return await userModel.getAllUsers();
};


// ONLY ADMIN MUST USE THESE FUNCTIONS
//  *******=======********* Update function *******=======*********
export const updateUserService = async (id: number, data: UpdateUserInput) => {
    // 1) Check if user exists
    const existingUser = await userModel.findUserById(id);
    if (!existingUser) {
        throw new Error ("User not found");
    }

    // 2)email check
    if (data.email) {
        const userWithEmail = await userModel.findUserByEmail(data.email);
        if (userWithEmail && userWithEmail.id !== id) {
            throw new Error ("Email already in use");
        }
    }

    // 3) update
    const updated = await userModel.updateUser(id, {
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
    const existingUser = await userModel.findUserById(id);

    if (!existingUser) {
        throw new Error ("User not found")
    }

    // 2)delete
    const deleted = await userModel.deleteUser(id);

    if (!deleted) {
        throw new Error ("Failed to delete user");
    }

    return {message: "User deleted successfully"};
}

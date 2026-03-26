import * as userService from '../services/user.service';
import type { Request, Response } from 'express';
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsersService();

    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message
    });
  }
};



// ========== **************************************** ==========
// ========== Update Controllers Function - ADMIN ONLY ==========
// ========== **************************************** ==========
export const updateUserController = async (req: Request, res:Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({message: "Invalid user id"})
    }

    try {
        const result = await userService.updateUserService(id, req.body);
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch (error) {
        res.status(400).json({
            message: (error as Error).message
        })
    }
}

// ========== **************************************** ==========
// ========== Delete Controllers Function - ADMIN ONLY ==========
// ========== **************************************** ==========

export const deleteUserController = async (req:Request, res:Response) => {
    const id = Number(req.params.id);

    try {
        const result = await userService.deleteUserService(id);
        res.status(200).json({
            success: true,
            message: result.message
        })
    } catch (error) {
        res.status(400).json({
            message: (error as Error).message
        })
    }
}

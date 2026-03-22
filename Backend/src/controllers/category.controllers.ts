import type { Request, Response } from "express";
import { getAllCategoriesService, getCategoryByIdService } from "../services/category.service";

export const getAllCategoriesController = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategoriesService();

        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch categories"
        });
    }
}

export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid category id"
      });
    }

    const category = await getCategoryByIdService(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    return res.status(200).json(category);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch category",
      error
    });
  }
};

import type { Request, Response } from "express";
import {
    getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service";

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

// Admin only part
// 1 create
export const createCategoryController = async (req: Request, res: Response) => {
    try {
        const { title } = req.body;
        const id = await createCategoryService(title);
        return res.status(201).json({
            message: "Category created",
            category_id: id
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create category",
            error
        })
    }
}

// 2 update
export const updateCategoryController = async(req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { title } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({message: "Invalid id"})
        }

        const updated = await updateCategoryService(id, title);

        if (!updated) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            message: "Category updated successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update category",
            error
        })
    }
}

// 3 delete
export const deleteCategoryController = async(req: Request, res: Response) => {

    try {

        const id = Number(req.params.id)

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid id"
            })
        }

        const deleted = await deleteCategoryService(id);

        if (!deleted) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        return res.status(200).json({
            message: "Category deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete category",
            error
        })
    }
}

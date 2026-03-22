import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../models/mysql/category.model";

export const getAllCategoriesService = async () => {
    return await getAllCategories();
}

export const getCategoryByIdService = async (id:number) => {
    if (!id || id <= 0) {
        throw new Error ("Invalid category id");
    }

    return await getCategoryById(id);
}


// Added only admin part
// 1 create
export const createCategoryService = async (title: string) => {
    if (!title || title.trim() === "") {
        throw new Error("Title is required")
    }

    return await createCategory(title);
}

// 2 update
export const updateCategoryService = async (id:number , title: string) => {
    if (!title || title.trim() === "") {
        throw new Error("Title is required")
    }

    return await updateCategory(id, title);
}

// 3 delete
export const deleteCategoryService = async (id: number) => {
    return await deleteCategory(id);
}

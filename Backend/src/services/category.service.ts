import { getAllCategories, getCategoryById } from "../models/mysql/category.model";

export const getAllCategoriesService = async () => {
    return await getAllCategories();
}

export const getCategoryByIdService = async (id:number) => {
    if (!id || id <= 0) {
        throw new Error ("Invalid category id");
    }

    return await getCategoryById(id);
}

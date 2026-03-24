import ReviewModel from '../models/mongodb/review.model'
import { findUserById } from '../models/mysql/user.model'
import { getProductById } from '../models/mysql/product.model'

interface CreateReviewInput {
    userId: number
    productId: number
    rating: number
    comment: string
}

interface UpdateReviewInput {
    reviewId: string
    userId: number
    rating?: number
    comment?: string
}

export const createReviewService = async ({
    userId,
    productId,
    rating,
    comment
}: CreateReviewInput) => {
    if (!productId || !rating || !comment) {
        throw new Error('productId, rating and comment are required')
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('Rating must be an integer between 1 and 5')
    }

    if (!comment.trim()) {
        throw new Error('Comment cannot be empty')
    }

    const user = await findUserById(userId)
    if (!user) {
        throw new Error('User not found')
    }

    const product = await getProductById(productId)
    if (!product) {
        throw new Error('Product not found')
    }

    const review = await ReviewModel.create({
        userId,
        productId,
        rating,
        comment: comment.trim()
    })

    return review
}

export const getReviewsByProductService = async (
    productId: number,
    sort?: string
) => {
    if (!productId) {
        throw new Error('ProductId is required')
    }

    let sortOption: any = { createdAt: -1 }

    switch (sort) {
        case 'highest':
            sortOption = { rating: -1 }
            break
        case 'lowest':
            sortOption = { rating: 1 }
            break
        case 'oldest':
            sortOption = { createdAt: 1 }
            break
        case 'newest':
        default:
            sortOption = { createdAt: -1 }
    }

    return await ReviewModel.find({ productId }).sort(sortOption)
}

export const getReviewsByUserService = async (
    userId: number,
    sort?: string
) => {
    if (!userId) {
        throw new Error('UserId is required')
    }

    let sortOption: any = { createdAt: -1 }

    switch (sort) {
        case 'highest':
            sortOption = { rating: -1 }
            break
        case 'lowest':
            sortOption = { rating: 1 }
            break
        case 'oldest':
            sortOption = { createdAt: 1 }
            break
        case 'newest':
        default:
            sortOption = { createdAt: -1 }
    }

    return await ReviewModel.find({ userId }).sort(sortOption)
}

export const updateReviewService = async ({
    reviewId,
    userId,
    rating,
    comment
}: UpdateReviewInput) => {
    const review = await ReviewModel.findById(reviewId)

    if (!review) {
        throw new Error('Review not found')
    }

    if (review.userId !== userId) {
        throw new Error('Forbidden')
    }

    if (rating !== undefined) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new Error('Rating must be an integer between 1 and 5')
        }
        review.rating = rating
    }

    if (comment !== undefined) {
        if (!comment.trim()) {
            throw new Error('Comment cannot be empty')
        }
        review.comment = comment.trim()
    }

    await review.save()
    return review
}

export const deleteReviewService = async (reviewId: string, userId: number) => {
    const review = await ReviewModel.findById(reviewId)

    if (!review) {
        throw new Error('Review not found')
    }

    if (review.userId !== userId) {
        throw new Error('Forbidden')
    }

    await ReviewModel.findByIdAndDelete(reviewId)

    return { message: 'Review deleted successfully' }
}

export const getAverageRatingByProductService = async (productId: number) => {
    const result = await ReviewModel.aggregate([
        { $match: { productId } },
        {
            $group: {
                _id: '$productId',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ])

    if (result.length === 0) {
        return {
            productId,
            averageRating: 0,
            totalReviews: 0
        }
    }

    return {
        productId,
        averageRating: Number(result[0].averageRating.toFixed(1)),
        totalReviews: result[0].totalReviews
    }
}

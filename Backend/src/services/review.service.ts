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
    const user = await findUserById(userId)
    if (!user) throw new Error('User not found')

    const product = await getProductById(productId)
    if (!product) throw new Error('Product not found')

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
    const sortOptions: Record<string, any> = {
        highest: { rating: -1 },
        lowest: { rating: 1 },
        oldest: { createdAt: 1 },
        newest: { createdAt: -1 }
    }
    return await ReviewModel.find({ productId }).sort(
        sortOptions[sort || 'newest']
    )
}

export const getReviewsByUserService = async (
    userId: number,
    sort?: string
) => {
    const sortOptions: Record<string, any> = {
        highest: { rating: -1 },
        lowest: { rating: 1 },
        oldest: { createdAt: 1 },
        newest: { createdAt: -1 }
    }
    return await ReviewModel.find({ userId }).sort(
        sortOptions[sort || 'newest']
    )
}

export const updateReviewService = async ({
    reviewId,
    userId,
    rating,
    comment
}: UpdateReviewInput) => {
    const review = await ReviewModel.findById(reviewId)
    if (!review) throw new Error('Review not found')
    if (review.userId !== userId) throw new Error('Forbidden')

    if (rating !== undefined) review.rating = rating
    if (comment !== undefined) review.comment = comment.trim()

    await review.save()
    return review
}

export const deleteReviewService = async (reviewId: string, userId: number) => {
    const review = await ReviewModel.findById(reviewId)
    if (!review) throw new Error('Review not found')
    if (review.userId !== userId) throw new Error('Forbidden')

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

    if (!result.length) return { productId, averageRating: 0, totalReviews: 0 }
    return {
        productId,
        averageRating: Number(result[0].averageRating.toFixed(1)),
        totalReviews: result[0].totalReviews
    }
}

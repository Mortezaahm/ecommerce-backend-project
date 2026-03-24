import type { Request, Response } from 'express'
import {
    createReviewService,
    deleteReviewService,
    getAverageRatingByProductService,
    getReviewsByProductService,
    updateReviewService
} from '../services/review.service'

export const createReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id
        const { productId, rating, comment } = req.body

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        const review = await createReviewService({
            userId,
            productId: Number(productId),
            rating: Number(rating),
            comment
        })

        res.status(201).json({
            message: 'Review created successfully',
            review
        })
        return
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({
                message: 'You have already reviewed this product'
            })
            return
        }

        if (
            error.message === 'productId, rating and comment are required' ||
            error.message === 'Rating must be an integer between 1 and 5' ||
            error.message === 'Comment cannot be empty'
        ) {
            res.status(400).json({ message: error.message })
            return
        }

        if (
            error.message === 'User not found' ||
            error.message === 'Product not found'
        ) {
            res.status(404).json({ message: error.message })
            return
        }

        console.error('Create review error:', error)
        res.status(500).json({ message: 'Failed to create review' })
        return
    }
}

export const getReviewsByProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const productId = Number(req.params.productId)
        const sort = req.query.sort as string

        const reviews = await getReviewsByProductService(productId, sort)

        res.status(200).json(reviews)
        return
    } catch (error: any) {
        if (error.message === 'ProductId is required') {
            res.status(400).json({ message: error.message })
            return
        }

        console.error('Get reviews error:', error)
        res.status(500).json({ message: 'Failed to fetch reviews' })
        return
    }
}

export const updateReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id
        const id = req.params.id
        const { rating, comment } = req.body

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        if (!id) {
            res.status(400).json({ message: 'Review id is required' })
            return
        }

        const review = await updateReviewService({
            reviewId: id,
            userId,
            rating: rating !== undefined ? Number(rating) : undefined,
            comment
        })

        res.status(200).json({
            message: 'Review updated successfully',
            review
        })
        return
    } catch (error: any) {
        if (
            error.message === 'Rating must be an integer between 1 and 5' ||
            error.message === 'Comment cannot be empty'
        ) {
            res.status(400).json({ message: error.message })
            return
        }

        if (error.message === 'Review not found') {
            res.status(404).json({ message: error.message })
            return
        }

        if (error.message === 'Forbidden') {
            res.status(403).json({ message: error.message })
            return
        }

        console.error('Update review error:', error)
        res.status(500).json({ message: 'Failed to update review' })
        return
    }
}

export const deleteReview = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id
        const id = req.params.id

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }

        if (!id) {
            res.status(400).json({ message: 'Review id is required' })
            return
        }

        const result = await deleteReviewService(id, userId)

        res.status(200).json(result)
        return
    } catch (error: any) {
        if (error.message === 'Review not found') {
            res.status(404).json({ message: error.message })
            return
        }

        if (error.message === 'Forbidden') {
            res.status(403).json({ message: error.message })
            return
        }

        console.error('Delete review error:', error)
        res.status(500).json({ message: 'Failed to delete review' })
        return
    }
}

export const getAverageRatingByProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const productId = Number(req.params.productId)
        const result = await getAverageRatingByProductService(productId)

        res.status(200).json(result)
        return
    } catch (error) {
        console.error('Average rating error:', error)
        res.status(500).json({ message: 'Failed to fetch average rating' })
        return
    }
}

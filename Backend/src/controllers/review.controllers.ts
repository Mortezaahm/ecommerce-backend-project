import type { Request, Response } from 'express'
import {
    createReviewService,
    deleteReviewService,
    getAverageRatingByProductService,
    getReviewsByProductService,
    getReviewsByUserService,
    updateReviewService
} from '../services/review.service'

export const createReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })

        const { productId, rating, comment } = req.body
        const review = await createReviewService({
            userId,
            productId: Number(productId),
            rating: Number(rating),
            comment
        })

        res.status(201).json({ message: 'Review created successfully', review })
    } catch (error: any) {
        console.error('Create review error:', error)
        res.status(500).json({ message: 'Failed to create review' })
    }
}

export const getReviewsByProduct = async (req: Request, res: Response) => {
    try {
        const productId = Number(req.params.productId)
        const sort = req.query.sort as string
        const reviews = await getReviewsByProductService(productId, sort)
        res.status(200).json(reviews)
    } catch (error) {
        console.error('Get reviews error:', error)
        res.status(500).json({ message: 'Failed to fetch reviews' })
    }
}

export const getReviewsByUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId)
        const sort = req.query.sort as string
        const reviews = await getReviewsByUserService(userId, sort)
        res.status(200).json(reviews)
    } catch (error) {
        console.error('Get user reviews error:', error)
        res.status(500).json({ message: 'Failed to fetch user reviews' })
    }
}

export const updateReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const id = req.params.id
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })
        if (!id)
            return res.status(400).json({ message: 'Review id is required' })

        const review = await updateReviewService({
            reviewId: id,
            userId,
            rating: req.body.rating ? Number(req.body.rating) : undefined,
            comment: req.body.comment
        })

        res.status(200).json({ message: 'Review updated successfully', review })
    } catch (error) {
        console.error('Update review error:', error)
        res.status(500).json({ message: 'Failed to update review' })
    }
}

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id
        const id = req.params.id
        if (!userId) return res.status(401).json({ message: 'Unauthorized' })
        if (!id)
            return res.status(400).json({ message: 'Review id is required' })

        const result = await deleteReviewService(id, userId)
        res.status(200).json(result)
    } catch (error) {
        console.error('Delete review error:', error)
        res.status(500).json({ message: 'Failed to delete review' })
    }
}

export const getAverageRatingByProduct = async (
    req: Request,
    res: Response
) => {
    try {
        const productId = Number(req.params.productId)
        const result = await getAverageRatingByProductService(productId)
        res.status(200).json(result)
    } catch (error) {
        console.error('Average rating error:', error)
        res.status(500).json({ message: 'Failed to fetch average rating' })
    }
}

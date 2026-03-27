import { Router } from 'express'
import {
    createReview,
    deleteReview,
    getAverageRatingByProduct,
    getAverageRatingAllProducts,
    getReviewsByProduct,
    getReviewsByUser,
    updateReview
} from '../controllers/review.controllers'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/product/:productId', getReviewsByProduct)
router.get('/product/:productId/average', getAverageRatingByProduct)
router.get('/user/:userId', authMiddleware, getReviewsByUser)
router.post('/', authMiddleware, createReview)
router.put('/:id', authMiddleware, updateReview)
router.delete('/:id', authMiddleware, deleteReview)
router.get('/average/all', getAverageRatingAllProducts)

export default router

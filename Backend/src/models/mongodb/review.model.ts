import { Schema, model } from 'mongoose'

export interface Review {
  productId: number
  userId: number
  rating: number
  comment: string
  createdAt?: Date
  updatedAt?: Date
}

const reviewSchema = new Schema<Review>(
  {
    productId: {
      type: Number,
      required: true,
      index: true,
    },
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true })

const ReviewModel = model<Review>('Review', reviewSchema)

export default ReviewModel

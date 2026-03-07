import mongoose, {Document, Schema} from "mongoose";

export interface Review extends Document {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
  );

  export default mongoose.model<Review>("Review", reviewSchema);

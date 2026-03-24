import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env

        await mongoose.connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`
        )

        console.log('MongoDB connected')
    } catch (err) {
        console.log('MongoDB error:', err)
        throw err
    }
}

export default connectDB

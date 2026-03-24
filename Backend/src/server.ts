import app from './app'
import pool from './config/mysql'
import dotenv from 'dotenv'
import connectDB from './config/mongoDB'

dotenv.config()
const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        // mysql test
        const connection = await pool.getConnection()
        console.log('MySQL connected')
        connection.release()

        // MongoDB test
        await connectDB()

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.log('Server failed to start', error)
    }
}

startServer()
console.log('Server starting...')

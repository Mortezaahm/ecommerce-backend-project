import express from 'express'
import reviewRoutes from './routes/review.routes'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/reviews', reviewRoutes)

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'BackEnd working'
    })
})

app.get('/', (req, res) => {
    res.send('Backend API is running!!!')
})

export default app

import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'

import cartRoutes from './routes/cart.routes' // Cart endpoints
import cartItemRoutes from './routes/cartItem.routes' // CartItem endpoints

import reviewRoutes from './routes/review.routes'

import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Frontend/index.html'))
})

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../../Frontend')))

// Auth, Products, Categories
app.use('/api/auth', authRoutes) // login and register include update and delete user
app.use('/api/products', productRoutes) // routes for product whole CRUD
app.use('/api/categories', categoryRoutes) // routes for categories

// Cart & CartItems
app.use('/api/cart', cartRoutes) // endpoints för Cart
app.use('/api/cart/items', cartItemRoutes) // endpoints för CartItem

app.use('/api/reviews', reviewRoutes)

// Health check

export default app

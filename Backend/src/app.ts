import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import categoryRoutes from './routes/category.routes'

import cartRoutes from './routes/cart.routes'
import cartItemRoutes from './routes/cartItem.routes'

import orderRoutes from './routes/order.routes'
import orderItemRoutes from './routes/orderItem.routes'

import productImageRoutes from './routes/productImage.routes'

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
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)

// Cart & CartItems
app.use('/api/cart', cartRoutes)
app.use('/api/cart/items', cartItemRoutes)

// Orders & OrderItems
app.use('/api/orders', orderRoutes)
app.use('/api/order-items', orderItemRoutes)

// ProductImages
app.use('/api/product-images', productImageRoutes)

// Reviews
app.use('/api/reviews', reviewRoutes)

export default app

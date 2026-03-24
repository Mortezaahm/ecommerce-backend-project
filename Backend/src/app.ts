import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import reviewRoutes from "./routes/review.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/health", (req,res) =>{
    res.json({
        status: 'OK',
        message: 'BackEnd working'
    })
})

app.get('/', (req, res) => {
    res.send('Backend API is running!!!')
})

export default app

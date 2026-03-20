import express from "express";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes); // login and register include update and delete user
app.use("/api/products", productRoutes); // routes for product whole CRUD

app.get("/health", (req,res) =>{
    res.json({
        status: "OK",
        message:"BackEnd working"
    })
})

app.get("/",(req,res) =>{
    res.send("Backend API is running!!!");
})

export default app;

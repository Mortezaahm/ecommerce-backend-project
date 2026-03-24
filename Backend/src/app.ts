import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";           // Cart endpoints
import cartItemRoutes from "./routes/cartItem.routes";   // CartItem endpoints

const app = express();
app.use(cors());
app.use(express.json());

// Auth, Products, Categories
app.use("/api/auth", authRoutes); // login and register include update and delete user
app.use("/api/products", productRoutes); // routes for product whole CRUD
app.use("/api/categories", categoryRoutes);

// Cart & CartItems
app.use("/api/cart", cartRoutes);           // endpoints för Cart
app.use("/api/cart/items", cartItemRoutes); // endpoints för CartItem

// Health check
app.get("/health", (req,res) =>{
    res.json({
        status: "OK",
        message:"BackEnd working"
    });
});

// Root
app.get("/",(req,res) =>{
    res.send("Backend API is running!!!");
});

export default app;

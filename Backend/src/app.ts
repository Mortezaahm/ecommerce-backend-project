import express from "express";
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";

const app = express();

app.use(express.json());
app.use("/api/cart", cartRoutes); // just for testing, can be removed later
app.use("/api/auth", authRoutes);
//app.use("/api/products", productRoutes);
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

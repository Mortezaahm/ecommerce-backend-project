<<<<<<< HEAD
import app from "./app";
import mongoose from "mongoose";
import pool from "./config/mysql";
import dotenv from "dotenv";
// import { testMySQLConnection } from "./config/mysql";
// import connectMongoDB from "./config/mongoDB";
// import connectionMySQL from "./config/mysql";

dotenv.config();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // mysql test
    const connection = await pool.getConnection();
    console.log("MySQL connected");
    connection.release();

    // MongoDB test
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch(error) {
    console.log("Server failed to start", error);
  }
}

startServer();
console.log("Server starting...");
=======
import app from "./app";
import mongoose from "mongoose";
import pool from "./config/mysql";
import dotenv from "dotenv";
// import { testMySQLConnection } from "./config/mysql";
// import connectMongoDB from "./config/mongoDB";
// import connectionMySQL from "./config/mysql";

dotenv.config();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // mysql test
    const connection = await pool.getConnection();
    console.log("MySQL connected");
    connection.release();

    // MongoDB test
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch(error) {
    console.log("Server failed to start", error);
  }
}

startServer();
console.log("Server starting...");
>>>>>>> origin/dev

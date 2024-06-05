import express from "express"
import dotenv from "dotenv"
dotenv.config()
// import connectDB from "./db/connectDB.js"
import connectDB from "./db/init.mongodb.js"

import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoutes.js"
import postRoutes  from "./routes/postRoutes.js"
import messageRoutes  from "./routes/messageRoutes.js"

import {v2 as cloudinary} from 'cloudinary';
      
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


dotenv.config()
const app = express()

//init db
connectDB()
// import { checkOverload } from './helpers/check.connect.js';
// checkOverload();



// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes );


export default app;

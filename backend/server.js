import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoutes.js"
import postRoutes  from "./routes/postRoutes.js"
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


dotenv.config()
const app = express()
connectDB()

const PORT = process.env.PORT || 5000

app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
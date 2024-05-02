import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/userRoutes.js"
import postRoutes  from "./routes/postRoutes.js"


dotenv.config()
const app = express()
connectDB()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
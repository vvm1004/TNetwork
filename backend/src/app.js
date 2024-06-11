import express from "express"
import dotenv from "dotenv"
import helmet from 'helmet'
import compression from 'compression'
import path from "path";



dotenv.config()
// import connectDB from "./db/connectDB.js"
import connectDB from "./db/init.mongodb.js"

import cookieParser from "cookie-parser"
import Routes from "./routes/index.js"

import {v2 as cloudinary} from 'cloudinary';
// import job from "./cron/cron.js";

const __dirname = path.resolve();

      
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


// job.start();


// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(helmet({
	contentSecurityPolicy: {
		// useDefaults: false,
		directives: { 
			defaultSrc: ["'self'"], 
			scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], 
			//styleSrc: ["'self'", "'unsafe-inline'"], 
			connectSrc: ["'self'", "*"],
			"img-src": ["'self'", "data:", "res.cloudinary.com"],
		},
	}
		//contentSecurityPolicy: false,
  }));

app.use(compression())


// Routes
app.use("/api", Routes)


// http://localhost:5000 => backend,frontend

if (process.env.NODE_ENV === "pro") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

export default app;

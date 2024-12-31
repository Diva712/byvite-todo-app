import dotenv from "dotenv"
import connectDB from "./db/config.js";


//dotenv configuration
dotenv.config({
  path: './env'
})

//DB connection 
connectDB();
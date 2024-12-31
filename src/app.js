import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//middleware configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN
}))

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())





export default app
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



//routes import
import userRouter from "./routes/user.routes.js"
import taskRouter from "./routes/task.routes.js"


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tasks")



export default app
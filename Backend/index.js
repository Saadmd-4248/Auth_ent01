import express  from "express";
import cors from "cors";
import 'dotenv/config';
import connectdb from './config/mongodb.js'
import authRoutes from './routes/auth.routes.js'
import cookieParser from "cookie-parser";

const app = express()
const PORT = 8000
connectdb()

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

// API ENDPOINTS

app.use('/api/auth', authRoutes)


app.listen(PORT, () => {console.log(`Server is running on PORT:${PORT}`)})
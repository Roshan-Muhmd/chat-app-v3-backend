import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import { MongoClient,ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import { UserModal } from "./modals/common.js";
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import { chatEvents } from "./sockets/chatSocket.js";


dotenv.config()

const app = express()
const uri = "mongodb+srv://roshanmuhmdnavas:8S1mpHYn2QaJyaMU@chatappv3db.p8zhs.mongodb.net/?retryWrites=true&w=majority&appName=chatappv3DB";

//json parse middleware
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173',  // Your frontend URL
    credentials: true,}))
// Use cookie-parser middleware to parse cookies
app.use(cookieParser());


  mongoose.connect(uri)
    .then(() => {
      console.log('Connected to MongoDB successfully!');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
    });

//realtime chat websocket events
const server = chatEvents(app)

app.use("/auth", authRoutes)

app.get("/",(req,res)=>{
    res.send("Test success")
})

server.listen('8080',()=>{
    console.log("app running succesfully in port 8080")
})
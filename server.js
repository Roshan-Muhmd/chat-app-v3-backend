import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { chatEvents } from "./sockets/chatSocket.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// WebSockets
const server = chatEvents(app);

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Test success");
});

// ✅ Use dynamic PORT
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`App running successfully on port ${PORT}`);
});

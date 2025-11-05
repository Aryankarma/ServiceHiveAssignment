import express, { type Request, type Response } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { WebSocketServer } from "ws"
import http from "http"
import authRoutes from "./routes/auth.tsx"
import eventRoutes from "./routes/events.tsx"
import swapRoutes from "./routes/swaps.tsx"
import jwt from "jsonwebtoken"
import { verifyToken } from "./middleware/auth.tsx"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/slot-swapper"

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }))

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", verifyToken, eventRoutes)
app.use("/api/swaps", verifyToken, swapRoutes)

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "Server is running" })
})

// Create HTTP server for WebSocket
const server = http.createServer(app)

// WebSocket setup
const wss = new WebSocketServer({ server, path: "/ws" })

interface UserSocket {
  userId: string
  ws: any
}

const userSockets: Map<string, UserSocket> = new Map()

wss.on("connection", (ws, req) => {
  const query = new URL(req.url!, `http://${req.headers.host}`).searchParams
  const userId = query.get("userId")
  const token = query.get("token")

  // Verify token before accepting connection
  if (!token || !userId) {
    ws.close()
    return
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret")
    if (decoded.userId !== userId) {
      ws.close()
      return
    }

    userSockets.set(userId, { userId, ws })
    console.log(`User ${userId} connected via WebSocket`)

    ws.on("message", (data) => {
      console.log(`Message from ${userId}:`, data)
    })

    ws.on("close", () => {
      userSockets.delete(userId)
      console.log(`User ${userId} disconnected`)
    })

    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${userId}:`, error)
    })
  } catch (error) {
    console.error("WebSocket auth error:", error)
    ws.close()
  }
})

// Broadcast notification to user
export const notifyUser = (userId: string, notification: any) => {
  const userSocket = userSockets.get(userId)
  if (userSocket && userSocket.ws.readyState === 1) {
    userSocket.ws.send(JSON.stringify(notification))
    console.log(`Notified user ${userId}:`, notification.type)
  } else {
    console.log(`User ${userId} not connected or socket not ready`)
  }
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export { app, wss, userSockets }

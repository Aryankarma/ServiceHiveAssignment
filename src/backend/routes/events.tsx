import express, { type Request, type Response } from "express"
import Event from "../models/Event.tsx"

interface AuthRequest extends Request {
  userId?: string
}

const router = express.Router()

// Get all events for logged-in user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const events = await Event.find({ userId: req.userId })
    res.json(events)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Create event
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startTime, endTime } = req.body
    const event = new Event({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId: req.userId,
      status: "BUSY",
    })
    await event.save()
    res.json(event)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Update event
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startTime, endTime, status } = req.body
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, startTime, endTime, status },
      { new: true },
    )
    res.json(event)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Delete event
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: "Event deleted" })
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

export default router

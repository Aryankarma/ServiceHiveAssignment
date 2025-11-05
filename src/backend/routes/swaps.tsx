import express, { type Request, type Response } from "express"
import Event from "../models/Event.tsx"
import SwapRequest from "../models/SwapRequest.tsx"
import { notifyUser } from "../server.tsx"

interface AuthRequest extends Request {
  userId?: string
}

const router = express.Router()

// Get swappable slots from other users
router.get("/swappable-slots", async (req: AuthRequest, res: Response) => {
  try {
    const slots = await Event.find({
      status: "SWAPPABLE",
      userId: { $ne: req.userId },
    }).populate("userId", "name email")
    res.json(slots)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Request swap
router.post("/request", async (req: AuthRequest, res: Response) => {
  try {
    const { mySlotId, theirSlotId } = req.body

    const mySlot = await Event.findById(mySlotId)
    const theirSlot = await Event.findById(theirSlotId)

    if (!mySlot || !theirSlot) {
      return res.status(404).json({ error: "Slot not found" })
    }

    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE") {
      return res.status(400).json({ error: "Slots are not swappable" })
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      requesterId: req.userId,
      receiverId: theirSlot.userId,
      requesterSlotId: mySlotId,
      receiverSlotId: theirSlotId,
      status: "PENDING",
    })
    await swapRequest.save()

    // Update slots to SWAP_PENDING
    await Event.updateMany({ _id: { $in: [mySlotId, theirSlotId] } }, { status: "SWAP_PENDING" })

    // Notify receiver
    notifyUser(theirSlot.userId.toString(), {
      type: "SWAP_REQUEST_RECEIVED",
      swapRequestId: swapRequest._id,
      requesterSlot: mySlot,
      message: `New swap request received for ${theirSlot.title}`,
    })

    res.json(swapRequest)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Get incoming swap requests
router.get("/incoming", async (req: AuthRequest, res: Response) => {
  try {
    const requests = await SwapRequest.find({ receiverId: req.userId })
      .populate("requesterId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId")
    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Get outgoing swap requests
router.get("/outgoing", async (req: AuthRequest, res: Response) => {
  try {
    const requests = await SwapRequest.find({ requesterId: req.userId })
      .populate("receiverId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId")
    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Respond to swap request
router.post("/respond/:requestId", async (req: AuthRequest, res: Response) => {
  try {
    const { accepted } = req.body
    const swapRequest = await SwapRequest.findById(req.params.requestId)

    if (!swapRequest) {
      return res.status(404).json({ error: "Swap request not found" })
    }

    if (accepted) {
      // Accept swap - exchange slots
      const requesterSlot = await Event.findById(swapRequest.requesterSlotId)
      const receiverSlot = await Event.findById(swapRequest.receiverSlotId)

      if (requesterSlot && receiverSlot) {
        // Swap owners
        const tempUserId = requesterSlot.userId
        requesterSlot.userId = receiverSlot.userId
        receiverSlot.userId = tempUserId
        requesterSlot.status = "BUSY"
        receiverSlot.status = "BUSY"

        await requesterSlot.save()
        await receiverSlot.save()
      }

      swapRequest.status = "ACCEPTED"
      await swapRequest.save()

      // Notify requester
      notifyUser(swapRequest.requesterId.toString(), {
        type: "SWAP_ACCEPTED",
        swapRequestId: swapRequest._id,
        message: "Your swap request was accepted!",
      })

      res.json({ message: "Swap accepted", swapRequest })
    } else {
      // Reject swap - revert slots to SWAPPABLE
      await Event.updateMany(
        { _id: { $in: [swapRequest.requesterSlotId, swapRequest.receiverSlotId] } },
        { status: "SWAPPABLE" },
      )

      swapRequest.status = "REJECTED"
      await swapRequest.save()

      // Notify requester
      notifyUser(swapRequest.requesterId.toString(), {
        type: "SWAP_REJECTED",
        swapRequestId: swapRequest._id,
        message: "Your swap request was rejected.",
      })

      res.json({ message: "Swap rejected", swapRequest })
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

export default router

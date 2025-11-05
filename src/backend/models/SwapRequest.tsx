import mongoose, { Schema, type Document } from "mongoose"

export type SwapStatus = "PENDING" | "ACCEPTED" | "REJECTED"

export interface ISwapRequest extends Document {
  requesterId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  requesterSlotId: mongoose.Types.ObjectId
  receiverSlotId: mongoose.Types.ObjectId
  status: SwapStatus
  createdAt: Date
  updatedAt: Date
}

const SwapRequestSchema = new Schema<ISwapRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requesterSlotId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    receiverSlotId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
  },
  { timestamps: true },
)

export default mongoose.model<ISwapRequest>("SwapRequest", SwapRequestSchema)

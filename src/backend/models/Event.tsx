import mongoose, { Schema, type Document } from "mongoose"

export type EventStatus = "BUSY" | "SWAPPABLE" | "SWAP_PENDING"

export interface IEvent extends Document {
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status: EventStatus
  userId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"], default: "BUSY" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
)

export default mongoose.model<IEvent>("Event", EventSchema)

"use client"

import "../styles/slot-card.css"

interface SlotCardProps {
  slot: any
  onRequestSwap: () => void
}

export default function SlotCard({ slot, onRequestSwap }: SlotCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="slot-card">
      <div className="slot-header">
        <h3>{slot.title}</h3>
        <span className="owner">{slot.userId.name}</span>
      </div>
      <p className="time">{formatDate(slot.startTime)}</p>
      {slot.description && <p className="desc">{slot.description}</p>}
      <button className="btn-request-swap" onClick={onRequestSwap}>
        Request Swap
      </button>
    </div>
  )
}

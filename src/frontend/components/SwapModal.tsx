"use client"

import "../styles/swap-modal.css"

interface SwapModalProps {
  selectedSlot: any
  mySlots: any[]
  onSwapRequest: (mySlotId: string, theirSlotId: string) => void
  onClose: () => void
}

export default function SwapModal({ selectedSlot, mySlots, onSwapRequest, onClose }: SwapModalProps) {
  const handleSwap = (mySlotId: string) => {
    onSwapRequest(mySlotId, selectedSlot._id)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select Your Slot to Swap</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="swap-info">
            You're requesting to swap for <strong>{selectedSlot.title}</strong>
          </p>

          {mySlots.length === 0 ? (
            <p className="empty">You have no swappable slots</p>
          ) : (
            <div className="my-slots-list">
              {mySlots.map((slot) => (
                <div key={slot._id} className="my-slot-item">
                  <div className="slot-details">
                    <h4>{slot.title}</h4>
                    <p>{new Date(slot.startTime).toLocaleString()}</p>
                  </div>
                  <button className="btn-select" onClick={() => handleSwap(slot._id)}>
                    Swap with This
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

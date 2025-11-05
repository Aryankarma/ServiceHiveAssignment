"use client"

import { useState, useEffect } from "react"
import Navigation from "../components/Navigation.tsx"
import SlotCard from "../components/SlotCard.tsx"
import SwapModal from "../components/SwapModal.tsx"
import "../styles/marketplace.css"

interface MarketplaceProps {
  user: any
  token: string
}

export default function Marketplace({ user, token }: MarketplaceProps) {
  const [slots, setSlots] = useState<any[]>([])
  const [mySlots, setMySlots] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlots()
    fetchMySlots()
  }, [])

  const fetchSlots = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/swaps/swappable-slots", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setSlots(data)
    } catch (error) {
      console.error("Error fetching slots:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMySlots = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setMySlots(data.filter((e: any) => e.status === "SWAPPABLE"))
    } catch (error) {
      console.error("Error fetching my slots:", error)
    }
  }

  const handleSwapRequest = async (mySlotId: string, theirSlotId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/swaps/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mySlotId, theirSlotId }),
      })
      if (response.ok) {
        setSelectedSlot(null)
        fetchSlots()
      }
    } catch (error) {
      console.error("Error requesting swap:", error)
    }
  }

  return (
    <div className="page">
      <Navigation user={user} currentPage="marketplace" />
      <main className="page-content">
        <h1>Swappable Slots Marketplace</h1>

        {loading ? (
          <p>Loading slots...</p>
        ) : slots.length === 0 ? (
          <p className="empty-state">No swappable slots available right now</p>
        ) : (
          <div className="slots-grid">
            {slots.map((slot) => (
              <SlotCard key={slot._id} slot={slot} onRequestSwap={() => setSelectedSlot(slot)} />
            ))}
          </div>
        )}

        {selectedSlot && (
          <SwapModal
            selectedSlot={selectedSlot}
            mySlots={mySlots}
            onSwapRequest={handleSwapRequest}
            onClose={() => setSelectedSlot(null)}
          />
        )}
      </main>
    </div>
  )
}

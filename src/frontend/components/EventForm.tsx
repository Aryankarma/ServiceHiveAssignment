"use client"

import type React from "react"

import { useState } from "react"
import "../styles/event-form.css"

interface EventFormProps {
  onEventAdded: (event: any) => void
}

export default function EventForm({ onEventAdded }: EventFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, startTime, endTime }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      onEventAdded(data)
      setTitle("")
      setDescription("")
      setStartTime("")
      setEndTime("")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  )
}

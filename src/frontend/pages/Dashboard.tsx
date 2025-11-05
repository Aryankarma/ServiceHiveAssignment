"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navigation from "../components/Navigation.tsx"
import EventForm from "../components/EventForm.tsx"
import EventList from "../components/EventList.tsx"
import "../styles/dashboard.css"

interface DashboardProps {
  user: any
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [events, setEvents] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = (event: any) => {
    setEvents([...events, event])
    setShowForm(false)
  }

  const handleUpdateEventStatus = async (eventId: string, newStatus: string) => {
    try {
      const event = events.find((e) => e._id === eventId)
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...event, status: newStatus }),
      })
      const updatedEvent = await response.json()
      setEvents(events.map((e) => (e._id === eventId ? updatedEvent : e)))
    } catch (error) {
      console.error("Error updating event:", error)
    }
  }

  return (
    <div className="page">
      <Navigation user={user} onLogout={onLogout} currentPage="dashboard" />
      <main className="page-content">
        <div className="dashboard-header">
          <h1>Your Calendar</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ New Event"}
          </button>
        </div>

        {showForm && <EventForm onEventAdded={handleAddEvent} />}

        {loading ? <p>Loading events...</p> : <EventList events={events} onStatusChange={handleUpdateEventStatus} />}
      </main>
    </div>
  )
}

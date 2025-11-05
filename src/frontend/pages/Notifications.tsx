"use client"

import { useState, useEffect } from "react"
import Navigation from "../components/Navigation.tsx"
import "../styles/notifications.css"

interface NotificationsProps {
  user: any
  token: string
  notifications?: any[]
}

export default function Notifications({ user, token, notifications = [] }: NotificationsProps) {
  const [incoming, setIncoming] = useState<any[]>([])
  const [outgoing, setOutgoing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [realtimeNotifications, setRealtimeNotifications] = useState<any[]>(notifications)

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setRealtimeNotifications(notifications)
      const latestNotification = notifications[notifications.length - 1]
      if (latestNotification.type === "SWAP_REQUEST_RECEIVED") {
        fetchRequests()
      } else if (latestNotification.type === "SWAP_ACCEPTED" || latestNotification.type === "SWAP_REJECTED") {
        fetchRequests()
      }
    }
  }, [notifications])

  const fetchRequests = async () => {
    try {
      const [inRes, outRes] = await Promise.all([
        fetch("http://localhost:5000/api/swaps/incoming", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/swaps/outgoing", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      setIncoming(await inRes.json())
      setOutgoing(await outRes.json())
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (requestId: string, accepted: boolean) => {
    try {
      await fetch(`http://localhost:5000/api/swaps/respond/${requestId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accepted }),
      })
      fetchRequests()
    } catch (error) {
      console.error("Error responding to request:", error)
    }
  }

  return (
    <div className="page">
      <Navigation user={user} currentPage="notifications" />
      <main className="page-content">
        <h1>Swap Requests</h1>

        {realtimeNotifications.length > 0 && (
          <section className="notifications-banner">
            <div className="notification-alert">
              <p>{realtimeNotifications[realtimeNotifications.length - 1].message}</p>
            </div>
          </section>
        )}

        <section className="requests-section">
          <h2>Incoming Requests</h2>
          {loading ? (
            <p>Loading...</p>
          ) : incoming.length === 0 ? (
            <p className="empty">No incoming requests</p>
          ) : (
            <div className="requests-list">
              {incoming.map((req) => (
                <div key={req._id} className="request-card">
                  <div className="request-info">
                    <p>
                      <strong>{req.requesterId.name}</strong> wants to swap
                    </p>
                    <p>
                      {req.requesterSlotId.title} → {req.receiverSlotId.title}
                    </p>
                  </div>
                  <div className="request-actions">
                    <button className="btn-accept" onClick={() => handleResponse(req._id, true)}>
                      Accept
                    </button>
                    <button className="btn-reject" onClick={() => handleResponse(req._id, false)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="requests-section">
          <h2>Outgoing Requests</h2>
          {outgoing.length === 0 ? (
            <p className="empty">No outgoing requests</p>
          ) : (
            <div className="requests-list">
              {outgoing.map((req) => (
                <div key={req._id} className="request-card pending">
                  <div className="request-info">
                    <p>
                      Pending with <strong>{req.receiverId.name}</strong>
                    </p>
                    <p>
                      {req.requesterSlotId.title} ↔ {req.receiverSlotId.title}
                    </p>
                  </div>
                  <span className="status">{req.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

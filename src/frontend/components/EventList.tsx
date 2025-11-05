"use client"

import "../styles/event-list.css"

interface EventListProps {
  events: any[]
  onStatusChange: (id: string, status: string) => void
}

export default function EventList({ events, onStatusChange }: EventListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="events-container">
      {events.length === 0 ? (
        <p className="empty">No events yet</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className={`event-card status-${event.status}`}>
              <h3>{event.title}</h3>
              {event.description && <p className="desc">{event.description}</p>}
              <p className="time">
                {formatDate(event.startTime)} - {formatDate(event.endTime)}
              </p>
              <div className="status-badge">{event.status}</div>
              {event.status === "BUSY" && (
                <button className="btn-make-swappable" onClick={() => onStatusChange(event._id, "SWAPPABLE")}>
                  Make Swappable
                </button>
              )}
              {event.status === "SWAPPABLE" && (
                <button className="btn-make-busy" onClick={() => onStatusChange(event._id, "BUSY")}>
                  Make Busy
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

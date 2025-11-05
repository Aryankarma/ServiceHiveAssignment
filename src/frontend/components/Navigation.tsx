"use client"

import { Link } from "react-router-dom"
import "../styles/navigation.css"

interface NavigationProps {
  user: any
  currentPage?: string
  onLogout?: () => void
}

export default function Navigation({ user, currentPage, onLogout }: NavigationProps) {
  return (
    <nav className="navbar">
      <div className="nav-brand">SlotSwapper</div>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard" className={currentPage === "dashboard" ? "active" : ""}>
            My Calendar
          </Link>
        </li>
        <li>
          <Link to="/marketplace" className={currentPage === "marketplace" ? "active" : ""}>
            Marketplace
          </Link>
        </li>
        <li>
          <Link to="/notifications" className={currentPage === "notifications" ? "active" : ""}>
            Requests
          </Link>
        </li>
        <li className="user-info">
          <span>{user?.name}</span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

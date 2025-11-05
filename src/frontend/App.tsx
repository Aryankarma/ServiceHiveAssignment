"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.tsx"
import Signup from "./pages/Signup.tsx"
import Dashboard from "./pages/Dashboard.tsx"
import Marketplace from "./pages/Marketplace.tsx"
import Notifications from "./pages/Notifications.tsx"
import "./App.css"

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [user, setUser] = useState<any>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (token && user) {
      connectWebSocket(token, user.id)
    }
  }, [token, user])

  const connectWebSocket = (token: string, userId: string) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const ws = new WebSocket(`${protocol}//${window.location.hostname}:5000/ws?userId=${userId}&token=${token}`)

    ws.onopen = () => {
      console.log("[v0] WebSocket connected")
    }

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      console.log("[v0] Notification received:", notification)
      setNotifications((prev) => [...prev, notification])
    }

    ws.onerror = (error) => {
      console.error("[v0] WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("[v0] WebSocket disconnected")
    }

    return ws
  }

  const handleLogin = (token: string, userData: any) => {
    setToken(token)
    setUser(userData)
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={token ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/marketplace"
          element={token ? <Marketplace user={user} token={token} /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={
            token ? <Notifications user={user} token={token} notifications={notifications} /> : <Navigate to="/login" />
          }
        />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

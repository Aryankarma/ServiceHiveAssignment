"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white">SlotSwapper</h1>
          <p className="text-xl text-slate-300">
            Peer-to-peer time-slot scheduling. Swap your availability with others in real-time.
          </p>

          <div className="space-y-4 pt-8">
            <p className="text-slate-400">
              This is the Next.js landing page. The full application runs separately with React frontend and Express
              backend.
            </p>

            <div className="flex gap-4 justify-center pt-6">
              <Link href="https://localhost:3000" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Access Application
                </Button>
              </Link>
              <Link href="https://localhost:5000/health">
                <Button size="lg" variant="outline">
                  Backend Health
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="bg-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">React Frontend</h3>
              <p className="text-slate-400 text-sm">Modern React UI with real-time updates</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Express Backend</h3>
              <p className="text-slate-400 text-sm">RESTful API with WebSocket support</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">MongoDB</h3>
              <p className="text-slate-400 text-sm">Persistent data storage and management</p>
            </div>
          </div>

          <div className="pt-12 text-slate-500 text-sm">
            <p>
              Frontend: <span className="text-slate-300">http://localhost:3000</span>
            </p>
            <p>
              Backend: <span className="text-slate-300">http://localhost:5000</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

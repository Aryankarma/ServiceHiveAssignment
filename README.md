# SlotSwapper

A peer-to-peer time-slot scheduling application built with React, Express, Node.js, and MongoDB.

## Features

- **User Authentication**: Sign up and login with JWT tokens
- **Calendar Management**: Create and manage your own events
- **Swappable Slots**: Mark events as swappable for others to request
- **Marketplace**: Browse and request swaps with other users
- **Real-time Notifications**: WebSocket-based instant notifications for swap requests
- **Request Management**: Accept or reject swap requests
- **Docker Support**: Easy containerization with Docker Compose

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Express.js + Node.js + TypeScript
- **Database**: MongoDB
- **Real-time**: WebSockets
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Docker (optional)

### Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create `.env` file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Start MongoDB:
   \`\`\`bash
   mongod
   \`\`\`

5. Start the backend:
   \`\`\`bash
   npm run dev
   \`\`\`

6. In a new terminal, start the frontend:
   \`\`\`bash
   npm run dev:frontend
   \`\`\`

### Docker Setup

Run with Docker Compose:
\`\`\`bash
docker-compose up --build
\`\`\`

The application will be available at:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Swaps
- `GET /api/swaps/swappable-slots` - Get available slots to swap
- `POST /api/swaps/request` - Request a swap
- `GET /api/swaps/incoming` - Get incoming swap requests
- `GET /api/swaps/outgoing` - Get outgoing swap requests
- `POST /api/swaps/respond/:requestId` - Accept or reject a swap request

## WebSocket Events

- Connect: `/ws?userId=<userId>&token=<token>`
- Events:
  - `SWAP_REQUEST_RECEIVED` - New swap request received
  - `SWAP_ACCEPTED` - Your swap request was accepted
  - `SWAP_REJECTED` - Your swap request was rejected

## License

ISC

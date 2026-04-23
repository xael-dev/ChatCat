#CHATCAT

This is a chat application/client to replace reliance on discord, the end goal is to make a working production application that can host various servers for groups of friends and communities.

Developer Note: This project is a work in progress.

#Getting Started

- This application is not ready for users just yet, this section will update in the future.

Stay tuned!

#Current State  

- This application is a work in progress, the developer is currently building websocket functionality for user chat

#Frontend

- A React/Vite frontend scaffold now lives in `frontend/`
- It is designed around a FastAPI backend with:
  - `GET /api/chat/bootstrap` for initial room/user/message data
  - `WS /ws/chat/{room_id}` for real-time messages
- Environment variables:
  - `VITE_API_BASE_URL`
  - `VITE_WS_URL`

#Run Frontend

- `cd frontend`
- `npm install`
- `npm run dev`

# mock-ecom

Simple full-stack Mock E-Commerce Cart app prepared for internship submission.

## What is included
- Frontend: React (Vite) + TailwindCSS (client/)
- Backend: Node + Express + SQLite (server/)
- Features: GET /api/products, POST /api/cart, GET /api/cart, PATCH /api/cart/:id, DELETE /api/cart/:id, POST /api/checkout
- Cart persistence stored locally in SQLite (no external DB required)

## Quick run (locally)
1. Open two terminals.

2. Start server:
```bash
cd server
npm install
npm start
```
Server runs at http://localhost:5000

3. Start client:
```bash
cd client
npm install
npm run dev
```
Client runs on http://localhost:5173 (Vite default)

## Notes
- Tailwind is configured for the client. If your environment blocks PostCSS/Tailwind install, you can use the plain CSS fallback in `client/src/index.css` (already included).
- The server will seed sample products automatically on first run.
  

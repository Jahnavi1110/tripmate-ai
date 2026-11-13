# TripMate AI — Full-stack starter

A travel-booking MVP with a React/Vite frontend, Node/Express REST API, and MongoDB.
It uses clearly labelled mock train/flight inventory and mock payment status. It does
not purchase real tickets or connect to railway/airline inventory.

## Requirements
- Node.js 20 or newer (LTS recommended)
- npm
- MongoDB Community running locally OR a MongoDB Atlas connection string

## Project structure
- `backend/` Express API, Mongoose models, seed data
- `frontend/` React + Vite UI
- `docs/API.md` endpoint reference

## 1. Configure MongoDB
Option A — local MongoDB:
1. Install and start MongoDB Community Server.
2. The default connection string in `backend/.env` is:
   `mongodb://127.0.0.1:27017/tripmate_ai`

Option B — MongoDB Atlas:
1. Create a free cluster and database user.
2. Copy the Node.js connection string.
3. Put it in `backend/.env` as `MONGODB_URI`.
4. In Atlas Network Access, allow your current IP. Avoid opening access to everyone for production.

## 2. Start the backend
Open a terminal in the `backend` folder:

```bash
npm install
```

Copy `.env.example` to `.env` (Windows PowerShell):
```powershell
Copy-Item .env.example .env
```

Then seed the sample inventory:
```bash
npm run seed
```

Start the API:
```bash
npm run dev
```

API health check: http://localhost:5000/api/health

## 3. Start the frontend
Open a SECOND terminal in the `frontend` folder:

```bash
npm install
```

Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

Start:
```bash
npm run dev
```

Open the local URL Vite prints (normally http://localhost:5173).

## 4. Try the application
- Search trains or flights using the tabs.
- Select a result and enter passenger details.
- Create a mock booking.
- Open My Bookings to see it.
- Cancel a booking.
- Use the API logs panel to inspect recent backend requests.

## API base URL
The frontend uses `VITE_API_URL` from `frontend/.env`.
Default: `http://localhost:5000/api`

## API endpoints
See `docs/API.md`. The key endpoints are:
- `GET /api/health`
- `GET /api/trains?from=...&to=...&date=YYYY-MM-DD`
- `GET /api/flights?from=...&to=...&date=YYYY-MM-DD`
- `POST /api/bookings`
- `GET /api/bookings?email=...`
- `GET /api/bookings/:bookingRef`
- `PATCH /api/bookings/:bookingRef/cancel`
- `GET /api/logs`

## Important scope and safety
- This is a portfolio/demo MVP. All inventory is mock data.
- Payments are simulated; no card details are collected.
- Do not add real payment credentials or expose secrets in frontend code.
- Do not put Vobiz Auth Token, SIP password, LiveKit API secret, or AI provider keys in this repo.
- `.env` files are ignored by Git. Only `.env.example` files are included.
- Vobiz + LiveKit phone integration is a separate next milestone because it requires
  provisioned SIP resources and provider credentials. The booking API is designed to be
  reusable by that voice agent without changing the booking business logic.

## Troubleshooting checklist
1. Backend won't start: check Node version with `node -v` and install dependencies with `npm install`.
2. MongoDB connection error: confirm MongoDB is running or verify Atlas URI/network access.
3. Frontend cannot reach API: ensure backend is running on port 5000 and frontend `.env` has the correct URL.
4. Port in use: change `PORT` in backend `.env`, then update `VITE_API_URL` if needed.
5. If you see a CORS error, verify `CLIENT_ORIGIN` in backend `.env` matches the Vite URL.

## Before a public deployment
Add authentication/authorization, stronger validation, audit logging, rate limits at the edge,
production secrets management, real provider inventory integration, real payment provider
integration, and privacy/legal review. Do not use this demo as a production booking service.

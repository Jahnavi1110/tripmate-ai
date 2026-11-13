# TripMate AI API reference

Base URL: `http://localhost:5000/api`

All responses are JSON. `success` indicates whether the request succeeded.
All inventory and payment behaviour in this starter is mock/demo only.

## Health
`GET /health`

## Search trains
`GET /trains?from=Bengaluru&to=Delhi&date=YYYY-MM-DD`

## Search flights
`GET /flights?from=Bengaluru&to=Mumbai&date=YYYY-MM-DD`

The date for seeded sample inventory is tomorrow's date when `npm run seed` is run.
The API returns `source: "MOCK_INVENTORY"`.

## Create booking
`POST /bookings`

```json
{
  "optionId": "MongoDB travel option _id",
  "passenger": { "name": "Asha Rao", "age": 22 },
  "email": "asha@example.com",
  "phone": "optional"
}
```

## List bookings
`GET /bookings?email=asha@example.com`

## Get booking
`GET /bookings/TM-BOOKINGREF`

## Cancel booking
`PATCH /bookings/TM-BOOKINGREF/cancel`

## Recent API request logs
`GET /logs`

## Voice-agent integration contract (future)
The LiveKit agent should call these same HTTP endpoints using server-side credentials/configuration:
- Search: `GET /trains` or `GET /flights`
- Book: `POST /bookings` only after collecting passenger details and explicit confirmation
- Lookup: `GET /bookings/:bookingRef`
- Cancel: `PATCH /bookings/:bookingRef/cancel` only after caller confirmation

Never let an LLM invent an option ID or booking reference. It must use IDs returned by the API.

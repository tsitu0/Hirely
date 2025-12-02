# Hirely — Proctored Technical Interview Scheduling (Prototype)
Hirely is a prototype backend for running consistent, fair technical interviews. Today’s remote interviews suffer from easy cheating, uneven hardware, and noisy environments; Hirely moves the session to a monitored testing center with standardized equipment and connectivity.

Candidates check in at a proctored workstation, while interviewers can stay remote or attend in person. The interview format stays familiar, but the environment is controlled and cheating becomes far harder.

The roadmap is a network of testing centers across major hubs, similar to SAT test sites, so companies can schedule remote or on-site rounds with predictable conditions.

This repo contains the scheduling foundation built with Express.js and MongoDB: interview blocks, generated time slots, reservations, check-ins, and live status. It will later connect to a full MERN platform with proctoring and monitoring features.

## Local setup

1) Prereqs: Node.js 18+ and access to a MongoDB database (Atlas or local).
2) Install deps: `cd server && npm install`.
3) Configure environment: create `server/.env` with at least  
   ```
   MONGO_URI=your-mongodb-connection-string
   PORT=3001            # optional; defaults to 3001
   ```
4) Run the API: `npm start` from `server/`. The server will exit if `MONGO_URI` is missing.
5) Hit the endpoints: defaults to `http://localhost:3001/api/blocks` and `/api/slots`.

## Planned features

- Role-based access with auditing: restrict scheduling actions to staff/admin and record who created or edited blocks, slots, and check-ins.
- Location modeling: represent centers, rooms, and seats (with hardware details) so slot generation only uses real desks with known capacity.
- Candidate lifecycle tracking: store status changes (arrived → seated → in-progress → completed/no-show) with timestamps and notes.
- Proctor hooks: endpoints for monitoring tools to send ID verification results or screen/audio alerts into the system.
- Reliability tooling: add a health check route, structured logs that include a request id, and rate limiting on public routes to prevent abuse.

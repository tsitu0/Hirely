# Hirely — Secure Technical Interview Platform (Prototype)
Hirely is a prototype built around a simple idea: technical interviews should be fair, secure, and consistent, but today’s remote interviews make that almost impossible. Cheating is extremely easy through hidden devices, remote helpers, or off-screen tools. Hardware quality is different for every candidate, and a noisy home environment can ruin someone’s performance. Remote interviews are convenient, but they do not create a level playing field.

Hirely keeps the interview exactly the same but changes where it happens. Instead of interviewing from home, the candidate checks in at a secure, proctored testing center. They sit at a monitored workstation with controlled hardware, stable internet, and a quiet space. The interviewer can stay remote or show up in person, and the interview format stays the same. The only difference is that cheating becomes extremely difficult and every candidate gets the same testing conditions.

The long term vision is simple. Imagine these testing centers existing across the country and in major tech hubs. Companies could send candidates to the nearest site and run interviews remotely, or they could visit the center in person for on-site rounds. It would work like taking the SAT, but for technical interviews, and it would finally give everyone the same environment.

This project is the backend foundation for that idea. I am building the scheduling system using Express.js and MongoDB to handle interview blocks, generated time slots, reservations, check-ins, and live interview status. This backend will later connect to a full MERN platform with proctor tools and monitoring features.

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

# Pastebin-Lite

A minimal Pastebin-like web application that allows users to create, store, and share text pastes via a unique URL. Pastes can optionally expire based on time (TTL) or number of views.

This project was built as part of a backend-focused take-home exercise.

---

## 🚀 Tech Stack

- Next.js (App Router)
- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Vercel (recommended for deployment)

---

## ✨ Features

- Create a text paste via API
- Generate a shareable URL for each paste
- Optional expiration:
  - Time-based (TTL in seconds)
  - View-count based
- View paste content through an HTML page
- Automatic invalidation after expiration or max views
- Backend-first design with clean API contracts

---

## 📁 Project Structure (Key Parts)

app/
├── api/
│ └── pastes/
├── p/
│ └── [id]/
│ └── page.tsx
└── layout.tsx
prisma/
└── schema.prisma
lib/
└── db.ts



---

## 🛠️ Local Setup


```bash
npm install

DATABASE_URL=<your_neon_postgresql_connection_string>

npx prisma db push

npm run dev

http://localhost:3000

🔌 API Endpoints
➤ Create a Paste

POST /api/pastes

{
  "content": "Hello World",
  "ttl_seconds": 300,
  "max_views": 5
}

➤ Fetch Paste (API)

GET /api/pastes/:id

Returns paste content along with remaining views and expiration information.
Returns 404 if the paste has expired or exceeded the view limit.

GET /p/:id
Renders paste content as an HTML page

Increments view count on each access

Automatically returns 404 when:

TTL expires

View limit is reached

Paste does not exist

🧠 Implementation Notes

Dynamic route parameters in Next.js App Router are asynchronous and must be awaited.

View count is incremented only after validating expiration conditions.

In development mode, clearing the .next folder may be required after testing 404 cases.

In production deployments (e.g., Vercel), this behavior is stable and consistent.

🚀 Deployment

The project can be deployed using Vercel.

Steps:

Push the code to GitHub

Import the repository into Vercel

Add the DATABASE_URL environment variable

Deploy

📄 License

MIT
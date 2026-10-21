<div align="center">

# ⚡ SyncSpace
### *Real-Time Collaborative Code & Markdown Workspace with Live Presence*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://sync-space-gray-sigma.vercel.app/)
[![Backend](https://img.shields.io/badge/API%20Status-Render%20Live-brightgreen?style=for-the-badge&logo=render)](https://syncspace-backend-zt44.onrender.com/api/rooms)
[![GitHub stars](https://img.shields.io/github/stars/utkarshkulkarni45/SyncSpace?style=for-the-badge)](https://github.com/utkarshkulkarni45/SyncSpace)

<p align="center">
  <b>A cloud-native, low-latency collaborative IDE that recreates Google Docs and CodePen in real time. Multiple developers can write code, edit markdown, view each other's cursor positions, save document snapshots, and chat over WebSockets.</b>
</p>

[Explore Live Demo](https://sync-space-gray-sigma.vercel.app/) · [Report Bug](https://github.com/utkarshkulkarni45/SyncSpace/issues) · [Request Feature](https://github.com/utkarshkulkarni45/SyncSpace/issues)

</div>

---

## 📸 Screenshots & Preview

| Real-Time Collaborative Workspace | Instant Room Creation & Joining |
| :---: | :---: |
| Monaco Editor + Live Peer Cursors + Instant Chat | Shareable Room IDs & Multi-language Support |

> **Live Deployment:** [https://sync-space-gray-sigma.vercel.app/](https://sync-space-gray-sigma.vercel.app/)  
> **Backend Service:** [https://syncspace-backend-zt44.onrender.com](https://syncspace-backend-zt44.onrender.com)

---

## 💡 The Problem & The Solution

- **The Problem:** Distributed engineering teams, interviewers, and study groups often struggle with disjointed pair-programming tools that suffer from high latency, complex setups, or heavy subscription costs.
- **The Solution:** **SyncSpace** provides an instant, zero-login workspace. Users create or join rooms via a simple room ID and can immediately start collaborative coding with synchronized keystrokes, remote cursor positions, persistent database snapshots, and peer presence.

---

## 🛠️ Tech Stack & Technical Rationale

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Backend Core** | **Java 21 + Spring Boot 3.3.4** | Enterprise-grade reliability. Utilizes **Project Loom Virtual Threads** (`spring.threads.virtual.enabled=true`) to handle thousands of concurrent WebSocket client connections with minimal CPU overhead. |
| **Real-Time Protocol** | **Spring WebSocket + STOMP** | Pub/Sub messaging over persistent full-duplex TCP connections (`/app` destinations routed to `/topic/room/{roomId}`). Fallback to SockJS for networks with restrictive firewalls. |
| **Distributed Cache & State** | **Redis Pub/Sub** | Ultra-low latency tracking of active users in rooms (`syncspace:room:{roomId}`) with fallback to concurrent thread-safe in-memory maps when standalone. |
| **Persistence Database** | **PostgreSQL (HikariCP)** | ACID-compliant relational storage for workspace metadata and timestamped document version history via Spring Data JPA. |
| **Frontend Editor** | **React 19 + Monaco Editor** | Embeds the engine powering VS Code directly in the browser with full syntax highlighting, autocompletion, and multi-user cursor decorations. |
| **Styling** | **Tailwind CSS v4** | Clean, modern dark-mode interface with customized scrollbars, glowing gradients, and responsive layout. |
| **DevOps & Cloud** | **Docker, Render & Vercel** | Multi-stage Docker containerization deployed on Render with automated health checks, paired with Vercel's global CDN for the frontend. |

---

## 🏗️ Architecture & Pub/Sub Message Flow

```
                      ┌──────────────────────────────────────────────┐
                      │        Client Frontend (React / Monaco)      │
                      └──────────────────────┬───────────────────────┘
                                             │  STOMP / SockJS (TCP)
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │    Spring Boot 3 Broker (Virtual Threads)    │
                      ├──────────────────────┬───────────────────────┤
                      │  WebSocketController │    RoomRestController │
                      └──────────┬───────────┴───────────┬───────────┘
                                 │                       │
                ┌────────────────┴───────────────┐       │
                ▼                                ▼       ▼
    ┌──────────────────────┐          ┌──────────────────────┐
    │  Redis Cache/Store   │          │  PostgreSQL (Render) │
    │  (Active Presence)   │          │  (Rooms & Snapshots) │
    └──────────────────────┘          └──────────────────────┘
                │
                ▼
    [Broadcast to /topic/room/{roomId}] ──► [All Connected Peers in Room]
```

---

## ✨ Key Features

- ⚡ **Real-Time Code Synchronization:** Low-latency STOMP messaging broadcasts text edits to all room participants without screen refreshes.
- 🎯 **Live Remote Cursor Indicators:** Monaco decorations dynamically show collaborator cursor positions with custom names and colored flags (e.g. *"Utkarsh is typing here"*).
- 👥 **Live Room Presence & Avatars:** Active user avatars appear in the navigation bar with automatic join and disconnect detection.
- 💬 **Integrated Workspace Chat:** Built-in team messaging directly inside the collapsible workspace sidebar.
- 📸 **Document Snapshots & Version History:** Take instant timestamped snapshots of current document states and restore previous versions with one click.
- 🌐 **Multi-Language Support:** Instant syntax highlighting for JavaScript, Python, Java, Markdown, and HTML/CSS.
- 📋 **One-Click Room Sharing:** Copy your unique Room ID and share it with peers for instant collaboration.
- 💛 **Handcrafted Signature:** Golden *"Made with ❤️ by UK"* watermark badge.

---

## 🚀 Step-by-Step Usage Guide

### 1. Launch a New Workspace
1. Visit [SyncSpace](https://sync-space-gray-sigma.vercel.app/).
2. Enter your **Display Name** (e.g. `Utkarsh`).
3. Under **Create a New Room**, enter a room title, choose your desired programming language (e.g. `Python`, `JavaScript`, `Markdown`), and click **Launch Workspace**.

### 2. Invite Collaborators
1. Inside the workspace, click the **Share Room** button in the top navigation bar.
2. Send the copied Room ID to your teammate, student, or candidate.

### 3. Join an Existing Room
1. Collaborators visit [SyncSpace](https://sync-space-gray-sigma.vercel.app/).
2. Enter their name, paste the Room ID into the **Join via Room ID** box, and click **Join**.
3. Collaborators will immediately see the room document, active user badges, and each other's live cursor tags.

### 4. Chat & Take Snapshots
1. Switch to the **Room Chat** tab in the right sidebar to exchange messages in real-time.
2. Switch to the **Snapshots** tab and click **Take Snapshot** to save a milestone version to PostgreSQL. Click **Restore** on any saved snapshot to roll back changes.

---

## 💻 Local Development Setup

### Prerequisites
- **Java 21+**
- **Node.js 18+ & npm**
- **Maven 3.9+**
- **Docker & Docker Compose** (optional for local PostgreSQL & Redis)

### 1. Clone the Repository
```bash
git clone https://github.com/utkarshkulkarni45/SyncSpace.git
cd SyncSpace
```

### 2. Start PostgreSQL & Redis via Docker (Optional)
```bash
docker-compose up -d
```
*(Note: If Docker is not running, the application automatically defaults to in-memory H2 database and in-memory presence caching for zero-friction local testing).*

### 3. Run Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`.

### 4. Run Frontend (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📡 API & STOMP Endpoints Reference

### REST Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/rooms` | Service health check |
| `POST` | `/api/rooms` | Create a new room with language & starter template |
| `GET` | `/api/rooms/{roomId}` | Fetch room metadata and current document content |
| `GET` | `/api/rooms/{roomId}/users` | Fetch active online users in a room |
| `POST` | `/api/rooms/{roomId}/snapshots` | Save a timestamped document snapshot |
| `GET` | `/api/rooms/{roomId}/snapshots` | Retrieve all historical snapshots for a room |

### STOMP WebSocket Channels
| Channel Destination | Type | Description |
| :--- | :--- | :--- |
| `/ws` | Endpoint | Handshake and SockJS fallback endpoint |
| `/app/room/{roomId}/edit` | Inbound | Client sends incremental/debounced document text edits |
| `/topic/room/{roomId}/edit` | Outbound | Server broadcasts document updates to peers |
| `/app/room/{roomId}/cursor` | Inbound | Client sends cursor line & column position |
| `/topic/room/{roomId}/cursor` | Outbound | Server broadcasts peer cursor movement |
| `/app/room/{roomId}/presence` | Inbound | Client announces `JOIN` or `LEAVE` state |
| `/topic/room/{roomId}/users` | Outbound | Server broadcasts updated connected user roster |
| `/app/room/{roomId}/chat` | Inbound | Client sends chat messages |
| `/topic/room/{roomId}/chat` | Outbound | Server broadcasts team chat messages |

---

## 👨‍💻 Author

**Utkarsh Kulkarni (UK)**  
- GitHub: [@utkarshkulkarni45](https://github.com/utkarshkulkarni45)  
- Project Repository: [SyncSpace on GitHub](https://github.com/utkarshkulkarni45/SyncSpace)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

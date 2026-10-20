# 🚀 SyncSpace

> **Real-Time Collaborative Code & Markdown Workspace with Live Presence**

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-blueviolet.svg)](https://stomp.github.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)

---

## 🌟 Overview

**SyncSpace** is an enterprise-grade cloud collaborative workspace recreating the core interactive real-time experience of platforms like Google Docs, CodePen, and live technical interview environments. It is architected for low-latency, bidirectional state synchronization and high concurrency across distributed backends.

---

## 🛠️ Tech Stack & Architecture

### **Backend**
* **Java 21 + Spring Boot 3.3.4** (leveraging Project Loom Virtual Threads for lightweight, high-concurrency socket handling)
* **Spring WebSocket + STOMP Protocol**: persistent full-duplex TCP connections routing topic channels (`/topic/room/{roomId}`)
* **Redis Pub/Sub & Caching**: fast presence lookup for active user sessions (`syncspace:room:{roomId}`) and horizontal scalability
* **PostgreSQL / Spring Data JPA**: persistent storage for room metadata and document snapshot history (with H2 in-memory dev fallback)

### **Frontend**
* **React 19 + Vite**: ultra-fast modern frontend build
* **Monaco Editor** (`@monaco-editor/react`): the VS Code browser engine supporting syntax highlighting, line numbering, and remote cursor decorations
* **STOMP / SockJS Client**: resilient WebSocket client reconnecting automatically with heartbeat mechanisms
* **Tailwind CSS**: sleek modern dark-mode UI with live presence indicator pills and responsive layout

---

## 📐 Pub/Sub Message Flow

```
[Client Frontend (React/Monaco)]
         │ (STOMP over WebSocket)
         ▼
  [Spring Boot Broker]
         │
         ├─► Updates Redis Cache / Store (Active Users / Room State)
         │
         ▼
[Broadcast to /topic/room/{roomId}] ──► [All Other Connected Collaborators]
```

---

## 🚀 Features

- [x] **Room Creation & Joining**: Instant room generation with UUIDs, language selection (JavaScript, Python, Java, Markdown, HTML), and shareable room IDs.
- [x] **Real-Time Collaborative Code & Text Sync**: Low-latency STOMP broadcasting of edits across all active room peers.
- [x] **Live Cursor Tracking & Avatars**: Dynamic Monaco decorations showing collaborator cursor positions and online user pills with custom avatar colors.
- [x] **Room Chat**: Integrated real-time team messaging directly within the workspace sidebar.
- [x] **Document Snapshots & History**: Persist and restore document versions on demand to PostgreSQL.
- [x] **Docker & Compose**: Pre-configured `docker-compose.yml` for PostgreSQL 16 and Redis 7.

---

## 🏁 Quickstart

### 1. Prerequisites
- **Java 21+**
- **Node.js 18+ & npm**
- **Docker & Docker Compose** (optional for local Redis & PostgreSQL)

### 2. Run Database & Cache (Optional)
```bash
docker-compose up -d
```
*(If Docker is not running, SyncSpace automatically runs with in-memory H2 database and in-memory presence tracking out-of-the-box!)*

### 3. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`.

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## 📁 Repository Structure

```text
SyncSpace/
├── backend/
│   ├── src/main/java/com/example/syncspace/
│   │   ├── config/          # WebSocketConfig, RedisConfig, WebConfig
│   │   ├── controller/      # RoomRestController & WebSocketMessageController
│   │   ├── dto/             # TextEdit, Cursor, Presence, and Chat records
│   │   ├── model/           # Room & DocumentSnapshot JPA Entities
│   │   ├── repository/      # RoomRepository & DocumentSnapshotRepository
│   │   ├── service/         # RoomService & PresenceService
│   │   └── websocket/       # WebSocketEventListener (Disconnect handling)
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # MonacoWorkspace, Navbar, Sidebar, Lobby
│   │   ├── services/        # websocket.js (STOMP Client service)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml        # PostgreSQL & Redis infrastructure
└── README.md
```

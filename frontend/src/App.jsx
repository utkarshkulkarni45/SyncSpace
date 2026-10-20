import React, { useState, useEffect, useRef } from 'react';
import MonacoWorkspace from './components/MonacoWorkspace';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Lobby from './components/Lobby';
import { wsService } from './services/websocket';

const USER_COLORS = [
  '#f43f5e', '#ec4899', '#d946ef', '#a855f7',
  '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9',
  '#06b6d4', '#14b8a6', '#10b981', '#f59e0b'
];

function getRandomColor() {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

export default function App() {
  const [room, setRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [cursors, setCursors] = useState({});
  const [messages, setMessages] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [copied, setCopied] = useState(false);

  const cursorDebounceRef = useRef(null);

  const handleCreateRoom = async ({ name, language, username }) => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, language })
      });
      const data = await res.json();
      joinActiveRoom(data, username);
    } catch (err) {
      console.error('Error creating room:', err);
      alert('Could not create room. Ensure backend server is running on port 8080.');
    }
  };

  const handleJoinRoom = async ({ roomId, username }) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`);
      if (!res.ok) {
        alert('Room not found. Check the ID and try again.');
        return;
      }
      const data = await res.json();
      joinActiveRoom(data, username);
    } catch (err) {
      console.error('Error joining room:', err);
      alert('Could not connect to room server.');
    }
  };

  const joinActiveRoom = (roomData, username) => {
    const userId = 'usr_' + Math.random().toString(36).substr(2, 9);
    const userColor = getRandomColor();
    const userObj = { userId, username, color: userColor };

    setRoom(roomData);
    setCurrentUser(userObj);
    setContent(roomData.content || '');

    // Connect to STOMP WebSocket
    wsService.connect(
      () => {
        // Subscriptions
        wsService.subscribe(`/topic/room/${roomData.id}/edit`, (payload) => {
          if (payload.userId !== userId) {
            setContent(payload.content);
          }
        });

        wsService.subscribe(`/topic/room/${roomData.id}/cursor`, (cursor) => {
          if (cursor.userId !== userId) {
            setCursors((prev) => ({
              ...prev,
              [cursor.userId]: cursor
            }));
          }
        });

        wsService.subscribe(`/topic/room/${roomData.id}/users`, (userList) => {
          setUsers(userList || []);
        });

        wsService.subscribe(`/topic/room/${roomData.id}/presence`, (presence) => {
          if (presence.type === 'LEAVE') {
            setCursors((prev) => {
              const updated = { ...prev };
              delete updated[presence.userId];
              return updated;
            });
          }
        });

        wsService.subscribe(`/topic/room/${roomData.id}/chat`, (chatMsg) => {
          setMessages((prev) => [...prev, chatMsg]);
        });

        // Broadcast Presence JOIN
        wsService.publish(`/app/room/${roomData.id}/presence`, {
          roomId: roomData.id,
          userId,
          username,
          color: userColor,
          type: 'JOIN'
        });

        // Fetch Snapshots
        fetchSnapshots(roomData.id);
      },
      (err) => {
        console.error('STOMP error:', err);
      }
    );
  };

  const fetchSnapshots = async (roomId) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}/snapshots`);
      if (res.ok) {
        const data = await res.json();
        setSnapshots(data);
      }
    } catch (e) {
      console.error('Failed to load snapshots:', e);
    }
  };

  const handleEditorChange = (newVal) => {
    setContent(newVal);
    if (!room || !currentUser) return;

    // Send edit over STOMP
    wsService.publish(`/app/room/${room.id}/edit`, {
      roomId: room.id,
      userId: currentUser.userId,
      username: currentUser.username,
      content: newVal,
      timestamp: Date.now()
    });
  };

  const handleCursorChange = (pos) => {
    if (!room || !currentUser) return;
    if (cursorDebounceRef.current) clearTimeout(cursorDebounceRef.current);

    cursorDebounceRef.current = setTimeout(() => {
      wsService.publish(`/app/room/${room.id}/cursor`, {
        roomId: room.id,
        userId: currentUser.userId,
        username: currentUser.username,
        color: currentUser.color,
        lineNumber: pos.lineNumber,
        column: pos.column
      });
    }, 50);
  };

  const handleSendMessage = (msg) => {
    if (!room || !currentUser) return;
    wsService.publish(`/app/room/${room.id}/chat`, {
      roomId: room.id,
      userId: currentUser.userId,
      username: currentUser.username,
      message: msg,
      color: currentUser.color,
      timestamp: Date.now()
    });
  };

  const handleSaveSnapshot = async () => {
    if (!room || !currentUser) return;
    try {
      const res = await fetch(`/api/rooms/${room.id}/snapshots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          savedBy: currentUser.username
        })
      });
      if (res.ok) {
        fetchSnapshots(room.id);
      }
    } catch (e) {
      console.error('Save snapshot failed:', e);
    }
  };

  const handleRestoreSnapshot = (restoredContent) => {
    handleEditorChange(restoredContent);
  };

  const handleCopyLink = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!room) {
    return <Lobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      <Navbar
        room={room}
        users={users}
        onCopyLink={handleCopyLink}
        copied={copied}
      />
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 relative h-full">
          <MonacoWorkspace
            content={content}
            language={room.language}
            onChange={handleEditorChange}
            onCursorChange={handleCursorChange}
            remoteCursors={cursors}
          />
        </main>
        <Sidebar
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUser={currentUser}
          snapshots={snapshots}
          onSaveSnapshot={handleSaveSnapshot}
          onRestoreSnapshot={handleRestoreSnapshot}
        />
      </div>
    </div>
  );
}

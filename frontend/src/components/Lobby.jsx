import React, { useState } from 'react';
import { Plus, ArrowRight, Code, Sparkles, Heart } from 'lucide-react';

export default function Lobby({ onCreateRoom, onJoinRoom }) {
  const [roomName, setRoomName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [joinId, setJoinId] = useState('');
  const [username, setUsername] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!roomName.trim() || !username.trim()) return;
    onCreateRoom({ name: roomName, language, username });
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinId.trim() || !username.trim()) return;
    onJoinRoom({ roomId: joinId.trim(), username });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 select-none relative overflow-y-auto">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 z-10 my-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-Time Collaborative Code & Markdown Workspace</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            SyncSpace
          </h1>
          <p className="text-slate-400 text-sm">
            Instant multi-user code editing with live cursor presence and chat.
          </p>
        </div>

        {/* Global Username Input */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Your Display Name
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Utkarsh"
            className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Cards for Create / Join */}
        <div className="grid grid-cols-1 gap-4">
          {/* Create Room Form */}
          <form
            onSubmit={handleCreate}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Create a New Room</span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                required
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Workspace Name (e.g. Algo Practice)"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="javascript">JavaScript / Node.js</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="markdown">Markdown</option>
                <option value="html">HTML / CSS</option>
              </select>

              <button
                type="submit"
                disabled={!roomName.trim() || !username.trim()}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-40"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Join Room Form */}
          <form
            onSubmit={handleJoin}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm">
              <Code className="w-4 h-4 text-purple-400" />
              <span>Join via Room ID</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={joinId}
                onChange={(e) => setJoinId(e.target.value)}
                placeholder="Paste Room ID..."
                className="flex-1 bg-slate-800/90 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={!joinId.trim() || !username.trim()}
                className="flex items-center gap-1 py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-40"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Golden Watermark */}
      <footer className="z-10 py-4 mt-6 flex items-center gap-1.5 text-xs font-medium tracking-wide text-amber-400/90 drop-shadow-[0_0_10px_rgba(251,191,36,0.25)] select-none">
        <span>Made with</span>
        <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse inline" />
        <span>by</span>
        <span className="font-bold text-amber-300 tracking-wider">UK</span>
      </footer>
    </div>
  );
}

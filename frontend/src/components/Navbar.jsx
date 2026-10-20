import React from 'react';
import { Users, Code, Copy, Check, Heart } from 'lucide-react';

export default function Navbar({ room, users = [], onCopyLink, copied }) {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between z-20">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          <Code className="w-6 h-6 text-indigo-400" />
          <span>SyncSpace</span>
        </div>
        {room && (
          <div className="flex items-center gap-2 ml-4 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs">
            <span className="text-slate-400 font-medium">Room:</span>
            <span className="font-semibold text-slate-200">{room.name}</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px] uppercase">
              {room.language || 'code'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Golden Watermark Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.25)] select-none">
          <span>Made with</span>
          <Heart className="w-3 h-3 fill-amber-400 text-amber-400 animate-pulse" />
          <span>by</span>
          <span className="font-bold text-amber-300">UK</span>
        </div>

        {/* Active Connected Avatars */}
        <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/50">
          <Users className="w-4 h-4 text-emerald-400 animate-pulse mr-1" />
          <div className="flex -space-x-2 overflow-hidden">
            {users.map((u, i) => (
              <div
                key={u.userId || i}
                title={u.username}
                style={{ backgroundColor: u.color || '#3b82f6' }}
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold ring-2 ring-slate-900 uppercase shadow"
              >
                {u.username ? u.username.substring(0, 2) : 'U'}
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-400 ml-1 font-mono font-medium">
            {users.length} online
          </span>
        </div>

        {/* Share Room Button */}
        {room && (
          <button
            onClick={onCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied Room ID!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Share Room</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

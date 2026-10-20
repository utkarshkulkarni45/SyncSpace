import React, { useState } from 'react';
import { Send, MessageSquare, History, Camera, Check } from 'lucide-react';

export default function Sidebar({
  messages = [],
  onSendMessage,
  currentUser,
  snapshots = [],
  onSaveSnapshot,
  onRestoreSnapshot
}) {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'history'
  const [inputMsg, setInputMsg] = useState('');
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    onSendMessage(inputMsg);
    setInputMsg('');
  };

  const handleSave = () => {
    onSaveSnapshot();
    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 2000);
  };

  return (
    <aside className="w-80 h-full border-l border-slate-800 bg-slate-900/95 flex flex-col z-10">
      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'chat'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Room Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition ${
            activeTab === 'history'
              ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Snapshots</span>
        </button>
      </div>

      {/* Tab: Chat */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs text-slate-500 px-4">
                No chat messages yet. Say hello to your collaborators!
              </div>
            ) : (
              messages.map((m, idx) => {
                const isMe = m.userId === currentUser.userId;
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                      <span
                        className="font-semibold"
                        style={{ color: m.color || '#818cf8' }}
                      >
                        {m.username}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs break-words ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send message..."
              className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
              disabled={!inputMsg.trim()}
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tab: Snapshots */}
      {activeTab === 'history' && (
        <div className="flex-1 flex flex-col overflow-hidden p-3">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition mb-3"
          >
            {snapshotSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Saved Snapshot!</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Take Snapshot</span>
              </>
            )}
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            {snapshots.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-6">
                No snapshots saved yet. Click above to save the current document state to the database.
              </div>
            ) : (
              snapshots.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/50 flex flex-col gap-1 hover:border-slate-600 transition"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">
                      by {s.savedBy || 'User'}
                    </span>
                    <button
                      onClick={() => onRestoreSnapshot(s.content)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium underline"
                    >
                      Restore
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(s.savedAt).toLocaleTimeString()} · {s.content ? s.content.length : 0} chars
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

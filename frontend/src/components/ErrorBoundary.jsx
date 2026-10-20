import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SyncSpace caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-900 border border-red-500/30 p-6 rounded-xl max-w-md w-full space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-red-400">Application Error</h2>
            <p className="text-xs text-slate-400 font-mono break-words">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg transition"
            >
              Reload SyncSpace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

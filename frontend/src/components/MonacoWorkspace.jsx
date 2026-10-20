import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function MonacoWorkspace({
  content,
  language = 'javascript',
  onChange,
  onCursorChange,
  remoteCursors = {}
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Track cursor movement
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        onCursorChange({
          lineNumber: e.position.lineNumber,
          column: e.position.column
        });
      }
    });
  };

  // Render remote user cursors using Monaco Editor Decorations
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const newDecorations = Object.entries(remoteCursors).map(([userId, cursor]) => {
      return {
        range: new monaco.Range(
          cursor.lineNumber,
          cursor.column,
          cursor.lineNumber,
          cursor.column + 1
        ),
        options: {
          className: `remote-cursor-${userId}`,
          beforeContentClassName: 'remote-cursor-indicator',
          hoverMessage: { value: `**${cursor.username || 'User'}** is typing here` },
          overviewRuler: {
            color: cursor.color || '#ec4899',
            position: monaco.editor.OverviewRulerLane.Right
          }
        }
      };
    });

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [remoteCursors]);

  return (
    <div className="relative w-full h-full bg-[#1e1e2e]">
      <Editor
        height="100%"
        language={language}
        value={content}
        theme="vs-dark"
        onChange={(value) => {
          if (onChange) onChange(value || '');
        }}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontLigatures: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          padding: { top: 16 }
        }}
      />
    </div>
  );
}

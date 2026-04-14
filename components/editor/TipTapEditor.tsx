'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback } from 'react';
import EditorToolbar from './EditorToolbar';

interface Props {
  content: string;                          // TipTap JSON string (or empty)
  onChange: (json: string, text: string) => void;
  onSelectionChange: (text: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function TipTapEditor({
  content,
  onChange,
  onSelectionChange,
  placeholder = '설교문을 작성하세요...\n\n성경 본문에서 출발하여, 하나님의 말씀을 깊이 탐구하세요.',
  readOnly = false,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { HTMLAttributes: { class: 'code-block' } } }),
      Underline,
      Typography,
      Placeholder.configure({ placeholder }),
    ],
    content: (() => {
      try { return content ? JSON.parse(content) : ''; }
      catch { return content || ''; }
    })(),
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()), editor.getText());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const selected = editor.state.doc.textBetween(from, to, ' ');
      onSelectionChange(selected.trim());
    },
    editorProps: {
      attributes: { class: 'px-8 py-6 focus:outline-none' },
    },
  });

  // Sync external content changes (e.g. initial load)
  const syncContent = useCallback(
    (newContent: string) => {
      if (!editor || editor.isDestroyed) return;
      const currentJson = JSON.stringify(editor.getJSON());
      if (currentJson !== newContent && newContent) {
        try {
          editor.commands.setContent(JSON.parse(newContent), false);
        } catch {
          editor.commands.setContent(newContent, false);
        }
      }
    },
    [editor]
  );

  useEffect(() => {
    if (content) syncContent(content);
  }, [content, syncContent]);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      {!readOnly && <EditorToolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}

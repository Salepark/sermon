'use client';

import type { Editor } from '@tiptap/react';

interface Props { editor: Editor }

interface ToolButton {
  label: string;
  action: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
}

function Btn({ label, action, isActive, icon }: ToolButton) {
  return (
    <button
      type="button"
      onClick={action}
      title={label}
      className={`p-2 rounded-lg text-sm transition-colors ${
        isActive
          ? 'bg-brand-100 text-brand-700'
          : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'
      }`}
    >
      {icon}
    </button>
  );
}

export default function EditorToolbar({ editor }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-stone-200 bg-white sticky top-0 z-10">
      {/* Text style */}
      <Btn label="굵게" action={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}
        icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>}
      />
      <Btn label="기울임" action={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>}
      />
      <Btn label="밑줄" action={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>}
      />

      <div className="w-px h-5 bg-stone-200 mx-1" />

      {/* Headings */}
      <Btn label="제목 1" action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}
        icon={<span className="text-xs font-bold w-4 text-center">H1</span>}
      />
      <Btn label="제목 2" action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}
        icon={<span className="text-xs font-bold w-4 text-center">H2</span>}
      />
      <Btn label="제목 3" action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}
        icon={<span className="text-xs font-bold w-4 text-center">H3</span>}
      />

      <div className="w-px h-5 bg-stone-200 mx-1" />

      {/* Lists */}
      <Btn label="글머리 목록" action={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></svg>}
      />
      <Btn label="번호 목록" action={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>}
      />
      <Btn label="인용구" action={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}
        icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>}
      />

      <div className="w-px h-5 bg-stone-200 mx-1" />

      {/* Code + HR */}
      <Btn label="코드 블록" action={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>}
      />
      <Btn label="구분선" action={() => editor.chain().focus().setHorizontalRule().run()} isActive={false}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/></svg>}
      />

      <div className="w-px h-5 bg-stone-200 mx-1" />

      {/* Undo / Redo */}
      <Btn label="실행 취소" action={() => editor.chain().focus().undo().run()}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>}
      />
      <Btn label="다시 실행" action={() => editor.chain().focus().redo().run()}
        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>}
      />
    </div>
  );
}

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import AiPanel from './AiPanel';
import { STATUS_LABELS, THEOLOGY_TAGS, CHURCH_CALENDAR_TAGS, type SermonStatus } from '@/lib/types';

// TipTap must be client-side only
const TipTapEditor = dynamic(() => import('./TipTapEditor'), { ssr: false, loading: () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="flex gap-1.5">
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
)});

interface InitialData {
  id?: string;
  title?: string;
  content?: string;
  scripture?: string;
  summary?: string;
  status?: string;
  tags?: string;
}

interface Props {
  initialData?: InitialData;
  userId: string;
  userName: string;
}

const ALL_TAGS = [...THEOLOGY_TAGS, ...CHURCH_CALENDAR_TAGS];

type SaveState = 'saved' | 'unsaved' | 'saving' | 'error';

export default function EditorPage({ initialData, userId, userName }: Props) {
  const router = useRouter();
  const [sermonId, setSermonId] = useState(initialData?.id ?? null);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [scripture, setScripture] = useState(initialData?.scripture ?? '');
  const [summary, setSummary] = useState(initialData?.summary ?? '');
  const [status, setStatus] = useState<SermonStatus>((initialData?.status as SermonStatus) ?? 'DRAFT');
  const [tags, setTags] = useState<string[]>(() => {
    try { return initialData?.tags ? JSON.parse(initialData.tags) : []; }
    catch { return []; }
  });
  const [wordCount, setWordCount] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [aiOpen, setAiOpen] = useState(true);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  const handleContentChange = useCallback((json: string, text: string) => {
    setContent(json);
    setWordCount(text.length);
    isDirty.current = true;
    setSaveState('unsaved');
  }, []);

  const handleInsertFromAi = useCallback((text: string) => {
    // Appended as a new paragraph via the content state; TipTapEditor re-renders
    // For production, use editor.commands.insertContent directly
    setContent((prev) => {
      try {
        const doc = prev ? JSON.parse(prev) : { type: 'doc', content: [] };
        doc.content.push({ type: 'paragraph', content: [{ type: 'text', text }] });
        return JSON.stringify(doc);
      } catch {
        return prev;
      }
    });
    isDirty.current = true;
    setSaveState('unsaved');
  }, []);

  const save = useCallback(async () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    const payload = {
      title: title || '제목 없음',
      content,
      scripture,
      summary,
      status,
      tags: JSON.stringify(tags),
      wordCount,
    };

    try {
      let id = sermonId;
      if (!id) {
        const res = await fetch('/api/sermons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        id = data.id;
        setSermonId(id);
        router.replace(`/editor/${id}`);
      } else {
        const res = await fetch(`/api/sermons/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
      }
      setSaveState('saved');
      isDirty.current = false;
    } catch {
      setSaveState('error');
    }
  }, [title, content, scripture, summary, status, tags, wordCount, sermonId, saveState, router]);

  // Auto-save every 30s
  useEffect(() => {
    if (!isDirty.current) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => { if (isDirty.current) save(); }, 30_000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [content, title, save]);

  // Ctrl+S
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);

  const toggleTag = (tag: string) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const saveLabel = {
    saved: '저장됨',
    unsaved: '저장 필요',
    saving: '저장 중...',
    error: '저장 실패',
  }[saveState];

  const saveLabelColor = {
    saved:   'text-green-600',
    unsaved: 'text-amber-600',
    saving:  'text-brand-600',
    error:   'text-red-600',
  }[saveState];

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Main editor area */}
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${aiOpen ? 'mr-96' : ''}`}>
        {/* Top bar */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-stone-200 shrink-0">
          <Link href="/dashboard" className="text-stone-400 hover:text-stone-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="flex-1 flex items-center gap-3 min-w-0">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); isDirty.current = true; setSaveState('unsaved'); }}
              placeholder="설교 제목을 입력하세요"
              className="flex-1 font-serif text-xl font-semibold text-stone-900 bg-transparent border-none outline-none placeholder-stone-300 truncate"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Status */}
            <span className={`text-xs font-medium ${saveLabelColor}`}>{saveLabel}</span>

            {/* Visibility selector */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as SermonStatus); isDirty.current = true; setSaveState('unsaved'); }}
              className="text-sm border border-stone-200 rounded-lg px-2 py-1.5 bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              {(Object.keys(STATUS_LABELS) as SermonStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>

            <button
              onClick={save}
              disabled={saveState === 'saving'}
              className="bg-brand-700 hover:bg-brand-800 disabled:bg-brand-400 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
            >
              저장
            </button>
          </div>
        </div>

        {/* Metadata bar */}
        <div className="flex items-center gap-4 px-6 py-2.5 bg-white border-b border-stone-100 text-sm">
          <div className="flex items-center gap-2 flex-1">
            <svg className="w-4 h-4 text-brand-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            <input
              type="text"
              value={scripture}
              onChange={(e) => { setScripture(e.target.value); isDirty.current = true; setSaveState('unsaved'); }}
              placeholder="성경 본문 (예: 요한복음 3:16)"
              className="text-sm text-stone-700 bg-transparent border-none outline-none placeholder-stone-300 flex-1"
            />
          </div>

          <div className="w-px h-4 bg-stone-200" />

          {/* Tags */}
          <div className="relative flex items-center gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-100">
                {tag}
                <button onClick={() => toggleTag(tag)} className="hover:text-red-500">&times;</button>
              </span>
            ))}
            <button
              onClick={() => setShowTagPicker(!showTagPicker)}
              className="text-xs text-stone-400 hover:text-brand-600 px-2 py-0.5 rounded-full border border-dashed border-stone-300 hover:border-brand-300 transition-colors"
            >
              + 태그
            </button>

            {showTagPicker && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTagPicker(false)} />
                <div className="absolute top-8 left-0 z-20 bg-white rounded-xl shadow-xl border border-stone-200 p-3 w-72">
                  <p className="text-xs font-medium text-stone-500 mb-2">신학 주제 태그</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                          tags.includes(tag)
                            ? 'bg-brand-700 text-white border-brand-700'
                            : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-brand-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-px h-4 bg-stone-200" />
          <span className="text-xs text-stone-400 shrink-0">{wordCount.toLocaleString()}자</span>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden bg-white">
          <TipTapEditor
            content={content}
            onChange={handleContentChange}
            onSelectionChange={setSelectedText}
          />
        </div>

        {/* Summary bar (optional) */}
        <div className="px-6 py-2.5 bg-white border-t border-stone-100 shrink-0">
          <input
            type="text"
            value={summary}
            onChange={(e) => { setSummary(e.target.value); isDirty.current = true; setSaveState('unsaved'); }}
            placeholder="설교 요약 (선택사항 · 목록에서 미리보기로 표시됩니다)"
            className="w-full text-sm text-stone-600 bg-transparent border-none outline-none placeholder-stone-300"
          />
        </div>
      </div>

      {/* AI Panel */}
      <AiPanel
        selectedText={selectedText}
        onInsert={handleInsertFromAi}
        isOpen={aiOpen}
        onToggle={() => setAiOpen(!aiOpen)}
      />
    </div>
  );
}

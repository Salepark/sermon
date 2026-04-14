'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  prompt?: string;
}

interface Props {
  selectedText: string;
  onInsert: (text: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PRESET_PROMPTS = [
  { label: '신학적 논거 보완', icon: '✦', prompt: '다음 설교 단락의 신학적 논거를 더 깊이 있게 보완해 주세요. 관련 신학자의 견해나 교부들의 가르침도 포함해 주세요.' },
  { label: '성경 구절 추천', icon: '📖', prompt: '다음 내용과 관련된 성경 구절들을 추천해 주세요. 구약과 신약 모두에서 찾아 주시고, 각 구절이 어떻게 연결되는지 설명해 주세요.' },
  { label: '설교 구조 제안', icon: '📐', prompt: '다음 내용을 바탕으로 더 효과적인 설교 구조를 제안해 주세요. 서론-본론-결론의 흐름을 포함해 주세요.' },
  { label: '교부·신학자 인용', icon: '🏛️', prompt: '다음 신학적 주제와 관련된 교부들(어거스틴, 칼뱅, 루터 등)이나 현대 신학자들의 견해와 인용구를 찾아 주세요.' },
  { label: '적용점 발굴', icon: '🌱', prompt: '다음 설교 내용에서 현대 한국 교회 성도들이 실제로 적용할 수 있는 구체적인 삶의 적용점들을 제안해 주세요.' },
  { label: '히브리어·헬라어 분석', icon: 'α', prompt: '다음 본문에서 핵심 히브리어나 헬라어 단어의 원어적 의미와 신학적 함의를 분석해 주세요.' },
];

export default function AiPanel({ selectedText, onInsert, isOpen, onToggle }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const sendPrompt = async (prompt: string) => {
    if (isStreaming) return;

    const userMsg: Message = { role: 'user', content: prompt, prompt };
    setMessages((prev) => [...prev, userMsg]);
    setCustomPrompt('');
    setIsStreaming(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, selectedText }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || '요청 실패');
      }

      if (!res.body) throw new Error('스트림 없음');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingText(full);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: full }]);
      setStreamingText('');
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ ${errMsg}` }]);
      setStreamingText('');
    } finally {
      setIsStreaming(false);
    }
  };

  const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <>
      {/* Toggle button (always visible) */}
      <button
        onClick={onToggle}
        title={isOpen ? 'AI 패널 닫기' : 'AI 패널 열기'}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-8 h-16 bg-brand-700 hover:bg-brand-800 text-white rounded-l-xl shadow-lg transition-all ${
          isOpen ? 'right-[384px]' : 'right-0'
        }`}
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
          fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white border-l border-stone-200 flex flex-col z-20 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-stone-200 bg-brand-950">
            <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm text-white">신학 어시스턴트</h2>
              <p className="text-xs text-brand-300">Kerygma AI · Claude 기반</p>
            </div>
          </div>

          {/* Selected text banner */}
          {selectedText && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
              <p className="text-xs text-amber-700 font-medium mb-1">선택된 텍스트</p>
              <p className="text-xs text-amber-800 line-clamp-3 leading-relaxed">"{selectedText}"</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {messages.length === 0 && !isStreaming && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✦</span>
                </div>
                <p className="text-sm font-medium text-stone-700 mb-1">신학 어시스턴트</p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  설교문의 텍스트를 선택하거나<br/>아래 빠른 도움 버튼을 눌러보세요
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-700 text-white rounded-tr-sm'
                      : 'bg-stone-100 text-stone-800 rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => onInsert(msg.content)}
                      className="mt-2 text-xs text-brand-600 hover:text-brand-800 underline underline-offset-2"
                    >
                      에디터에 삽입
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Streaming */}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-stone-100 text-stone-800 rounded-xl rounded-tl-sm px-3 py-2.5 text-sm leading-relaxed">
                  {streamingText ? (
                    <p className="whitespace-pre-wrap">{streamingText}<span className="inline-block w-0.5 h-4 bg-brand-500 ml-0.5 animate-pulse align-middle" /></p>
                  ) : (
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset prompts */}
          {messages.length === 0 && (
            <div className="px-3 pb-2 grid grid-cols-2 gap-1.5">
              {PRESET_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => sendPrompt(p.prompt)}
                  disabled={isStreaming}
                  className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-brand-50 hover:text-brand-700 border border-stone-200 hover:border-brand-200 rounded-lg transition-all text-left disabled:opacity-50"
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Insert last response (shortcut) */}
          {lastAssistantMsg && !isStreaming && (
            <div className="px-3 pb-1">
              <button
                onClick={() => onInsert(lastAssistantMsg.content)}
                className="w-full text-xs font-medium text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 py-1.5 rounded-lg transition-colors"
              >
                마지막 응답을 에디터에 삽입
              </button>
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-1">
            <div className="flex gap-2 bg-stone-100 rounded-xl px-3 py-2.5 items-end">
              <textarea
                ref={textareaRef}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && customPrompt.trim()) {
                    e.preventDefault();
                    sendPrompt(customPrompt.trim());
                  }
                }}
                placeholder="신학적 질문을 입력하세요... (Enter로 전송)"
                rows={2}
                disabled={isStreaming}
                className="flex-1 bg-transparent resize-none text-sm text-stone-800 placeholder-stone-400 focus:outline-none leading-relaxed"
              />
              <button
                onClick={() => customPrompt.trim() && sendPrompt(customPrompt.trim())}
                disabled={!customPrompt.trim() || isStreaming}
                className="shrink-0 w-8 h-8 bg-brand-700 hover:bg-brand-800 disabled:bg-stone-300 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-stone-400 mt-1.5 text-center">
              Shift+Enter로 줄바꿈 · Enter로 전송
            </p>
          </div>
        </div>
      )}
    </>
  );
}

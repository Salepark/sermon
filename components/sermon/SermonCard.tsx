import Link from 'next/link';
import { STATUS_LABELS, type SermonStatus } from '@/lib/types';

interface SermonCardProps {
  sermon: {
    id: string;
    title: string;
    scripture?: string | null;
    summary?: string | null;
    status: string;
    tags?: string | null;
    wordCount: number;
    createdAt: Date | string;
    updatedAt: Date | string;
    author?: { name: string; church?: string | null };
  };
  showAuthor?: boolean;
  editable?: boolean;
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT:   'bg-stone-100 text-stone-600',
  PRIVATE: 'bg-amber-100 text-amber-700',
  PUBLIC:  'bg-green-100 text-green-700',
};

export default function SermonCard({ sermon, showAuthor = false, editable = false }: SermonCardProps) {
  const tags: string[] = sermon.tags ? JSON.parse(sermon.tags) : [];

  return (
    <div className="bg-white rounded-xl border border-stone-200 hover:border-brand-300 hover:shadow-sm transition-all p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Link
            href={editable ? `/editor/${sermon.id}` : `/sermons/${sermon.id}`}
            className="block font-serif text-lg font-semibold text-stone-900 hover:text-brand-700 transition-colors line-clamp-2 leading-snug"
          >
            {sermon.title || '(제목 없음)'}
          </Link>
          {sermon.scripture && (
            <p className="text-sm text-brand-600 mt-1 font-medium">{sermon.scripture}</p>
          )}
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[sermon.status] ?? STATUS_COLORS.DRAFT}`}
        >
          {STATUS_LABELS[sermon.status as SermonStatus] ?? sermon.status}
        </span>
      </div>

      {/* Summary */}
      {sermon.summary && (
        <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">{sermon.summary}</p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-100">
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-xs text-stone-400">+{tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs text-stone-400">
        <div className="flex items-center gap-3">
          {showAuthor && sermon.author && (
            <span className="font-medium text-stone-600">{sermon.author.name}</span>
          )}
          {sermon.author?.church && showAuthor && (
            <span>{sermon.author.church}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>{sermon.wordCount.toLocaleString()}자</span>
          <span>{formatDate(sermon.updatedAt)}</span>
        </div>
      </div>

      {/* Edit button */}
      {editable && (
        <Link
          href={`/editor/${sermon.id}`}
          className="text-center text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 py-1.5 rounded-lg transition-colors border border-brand-200"
        >
          편집하기
        </Link>
      )}
    </div>
  );
}

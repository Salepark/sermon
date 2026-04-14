export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface SermonAuthor {
  id: string;
  name: string;
  church?: string | null;
  bio?: string | null;
}

export interface Sermon {
  id: string;
  title: string;
  content: string;
  scripture?: string | null;
  summary?: string | null;
  status: 'DRAFT' | 'PRIVATE' | 'PUBLIC';
  tags?: string[] | null;
  wordCount: number;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
  author?: SermonAuthor;
}

export type SermonStatus = 'DRAFT' | 'PRIVATE' | 'PUBLIC';

export const STATUS_LABELS: Record<SermonStatus, string> = {
  DRAFT:   '초안',
  PRIVATE: '비공개',
  PUBLIC:  '공개',
};

export const THEOLOGY_TAGS = [
  '구원론', '기독론', '성령론', '교회론', '종말론',
  '성경론', '창조론', '인간론', '죄론', '은혜론',
  '기도', '믿음', '사랑', '소망', '전도',
  '제자도', '예배', '성례전', '선교', '윤리',
] as const;

export const CHURCH_CALENDAR_TAGS = [
  '대강절', '성탄절', '주현절', '사순절',
  '종려주일', '고난주간', '부활절', '승천일',
  '오순절', '추수감사절', '맥추절',
] as const;

export const SERMON_TYPE_TAGS = [
  '강해설교', '주제설교', '내러티브설교', '교리설교',
] as const;

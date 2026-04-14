import type { Metadata } from 'next';
import { Noto_Serif_KR, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Kerygma — 목회자의 글쓰기 플랫폼', template: '%s | Kerygma' },
  description:
    '목회자의 서재를 기독교의 공공 도서관으로. 설교문을 쓰고, 신학적으로 탐구하며, 공동체와 나누세요.',
  keywords: ['설교', '목회', '신학', '기독교', '설교문', '강해설교'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSerifKr.variable} ${notoSansKr.variable}`}>
      <body>{children}</body>
    </html>
  );
}

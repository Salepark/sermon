'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  user?: { id: string; name: string; email: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const isEditor = pathname.startsWith('/editor');

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif text-sm font-bold">K</span>
            </div>
            <span className="font-serif text-xl font-bold text-brand-900 group-hover:text-brand-700 transition-colors">
              Kerygma
            </span>
          </Link>

          {/* Center nav (hidden on editor) */}
          {!isEditor && (
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/sermons"
                className="text-sm text-stone-600 hover:text-brand-700 transition-colors font-medium"
              >
                설교 둘러보기
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-sm text-stone-600 hover:text-brand-700 transition-colors font-medium"
                >
                  내 서재
                </Link>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {!isEditor && (
                  <Link
                    href="/editor/new"
                    className="hidden sm:inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    새 설교문
                  </Link>
                )}

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center">
                      <span className="text-brand-700 text-xs font-bold">{user.name[0]}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-stone-700">{user.name}</span>
                    <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {menuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20">
                        <Link
                          href="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          내 서재
                        </Link>
                        <hr className="my-1 border-stone-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          로그아웃
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-stone-600 hover:text-brand-700 transition-colors px-3 py-2"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  시작하기
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

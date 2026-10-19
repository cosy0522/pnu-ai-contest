import Link from "next/link";
import Image from "next/image";
import { FileEdit, BarChart3, Home } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-900 via-blue-600 to-sky-400" />
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex shrink-0 items-center justify-center">
            <Image
              src="/pnu-logo.svg"
              alt="부산대학교 로고"
              width={48}
              height={48}
              priority
              className="h-9 w-9 sm:h-11 sm:w-11 object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-wider text-blue-700 uppercase">
              Pusan National University
            </p>
            <p className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
              창의융합 AI 해커톤 아이디어 공모전
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>공모 안내</span>
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-white shadow-xs hover:bg-blue-800 transition-colors"
          >
            <FileEdit className="h-4 w-4" />
            <span>아이디어 응모하기</span>
          </Link>
          <Link
            href="/status"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-900 transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            <span>접수 현황</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

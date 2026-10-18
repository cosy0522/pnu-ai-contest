"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTEST_CATEGORIES, ContestCategoryName } from "@/lib/contest-config";
import {
  RefreshCw,
  BarChart3,
  AlertTriangle,
  ShieldCheck,
  FileEdit,
  Clock,
  Layers,
} from "lucide-react";

interface PublicSubmissionItem {
  id: string;
  teamName: string;
  title: string;
  category: ContestCategoryName;
  submittedAt: string;
}

interface StatusResponseData {
  totalCount: number;
  categoryCounts: Record<ContestCategoryName, number>;
  submissions: PublicSubmissionItem[];
  fetchedAt: string;
}

export default function StatusPage() {
  // 조건 준수: 화면을 열 때 자동으로 불러오지 않고(useEffect 미사용), 새로고침 버튼을 눌렀을 때만 조회!
  const [statusData, setStatusData] = useState<StatusResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 조건 준수: 실패해도 자동 반복 재시도하지 않음
      const res = await fetch("/api/status", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(
          data.error || "현황 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setStatusData({
        totalCount: data.totalCount,
        categoryCounts: data.categoryCounts,
        submissions: data.submissions,
        fetchedAt: data.fetchedAt,
      });
    } catch {
      setErrorMessage(
        "네트워크 오류가 발생했습니다. (자동 재시도 없음 — 새로고침 버튼을 다시 눌러주세요.)"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <Badge className="bg-blue-900 text-white">실시간 통계 조회</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            아이디어 공모전 접수 현황
          </h1>
          <p className="text-sm text-slate-600">
            불필요한 API 호출을 줄이기 위해 우측의{" "}
            <strong className="text-blue-900">[현황 새로고침]</strong> 버튼을
            눌렀을 때만 최신 데이터를 불러옵니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 h-11 gap-2 shadow-sm"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{isLoading ? "불러오는 중..." : "현황 새로고침"}</span>
          </Button>
          <Link
            href="/apply"
            className="inline-flex h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <FileEdit className="h-4 w-4" />
            <span>응모하기</span>
          </Link>
        </div>
      </div>

      {/* 필수 고지 문구 1: AI 초안 및 인간 심사 고지 + 개인정보 비공개 안내 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm">
              AI 분류·평점·심사평은 초안이며, 최종 심사는 사람이 합니다.
            </p>
            <p className="leading-relaxed">
              아래 분야별 집계는 Gemini AI의 1차 분류 초안을 기준으로 집계되며, 최종 심사와 수상작 선정은 심사위원(사람)이 직접 진행합니다.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-slate-700 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-700 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-blue-950">
              응모자 이름 및 연락처 비공개 원칙 준수
            </p>
            <p className="leading-relaxed">
              개인정보 보호를 위해 <strong>구성원 이름, 전화번호, 이메일 주소</strong>는 서버에서 제외되어 본 공개 화면에 절대 표시되지 않습니다.
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-bold">조회 오류 안내</p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}

      {!statusData ? (
        <Card className="border-dashed border-2 border-slate-300 bg-white/70 py-14 text-center shadow-none">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-800">
              <BarChart3 className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-slate-900">
                아직 현황 데이터를 불러오지 않았습니다
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                화면을 열 때 자동으로 조회하지 않도록 설계되었습니다. 아래{" "}
                <strong>[현황 새로고침]</strong> 버튼을 클릭하여 분야별 접수 건수를 확인해 보세요.
              </p>
            </div>
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-6 h-11 gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>
                  {isLoading ? "데이터 조회 중..." : "현황 새로고침 클릭"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* 전체 건수 및 조회 시각 요약 */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900 px-6 py-5 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-400/20 text-sky-300">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">
                  전체 누적 접수 건수
                </p>
                <p className="text-2xl font-extrabold text-white">
                  총 {statusData.totalCount}건
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Clock className="h-4 w-4 text-sky-400" />
              <span>마지막 조회 시각: {statusData.fetchedAt}</span>
            </div>
          </div>

          {/* 5개 분야별 접수 건수 카드 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">
              분야별 접수 건수 (5개 분야)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {CONTEST_CATEGORIES.map((cat, idx) => {
                const count = statusData.categoryCounts[cat.name] ?? 0;
                return (
                  <Card
                    key={cat.name}
                    className={`border-slate-200 shadow-xs ${
                      count > 0 ? "border-blue-300 bg-white" : "bg-slate-50/80"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <Badge
                        variant="secondary"
                        className="w-fit text-[11px] bg-blue-50 text-blue-800"
                      >
                        분야 {idx + 1}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-slate-800 leading-snug pt-1">
                        {cat.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-extrabold text-blue-900">
                        {count}
                        <span className="ml-1 text-sm font-semibold text-slate-500">
                          건
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 공개 가능한 접수 목록 요약 (이름·연락처 제외) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                접수 아이디어 목록 (이름·연락처 비공개)
              </h2>
              <span className="text-xs text-slate-500">
                최근 접수순 표시
              </span>
            </div>

            {statusData.submissions.length === 0 ? (
              <Card className="border-slate-200 py-10 text-center text-sm text-slate-500">
                <CardContent>아직 접수된 아이디어가 없습니다.</CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {statusData.submissions.map((item) => (
                  <Card
                    key={item.id}
                    className="border-slate-200 bg-white shadow-2xs"
                  >
                    <CardHeader className="py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-blue-900 text-white text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-xs font-semibold text-slate-600">
                            팀명: {item.teamName}
                          </span>
                        </div>
                        <CardTitle className="text-base font-bold text-slate-900">
                          {item.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs text-slate-400 shrink-0">
                        접수: {item.submittedAt}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

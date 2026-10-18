"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
  BarChart3,
  RotateCcw,
} from "lucide-react";

interface AiReviewResponse {
  category: string;
  score: number;
  scoreReason: string;
  reviewDraft: string;
}

const SAMPLE_IDEAS = [
  {
    label: "예시 1 (캠퍼스 혁신)",
    teamName: "효원AI랩(가상팀)",
    members: "김효원, 박금정",
    title: "부산대 강의실 빈자리 및 학습 공간 실시간 AI 혼잡도 예측 도우미",
    summary:
      "시험 기간마다 도서관과 단과대 열람실, 빈 강의실을 찾아 헤매는 부산대 학우들의 불편을 해결하기 위해 학사 시간표 데이터와 교내 와이파이/출입 혼잡도 패턴을 AI로 학습하여 시간대별 여유 학습 공간을 추천하고 공강 시간 최적 동선을 안내하는 서비스입니다.",
    expectedEffect:
      "학생들의 학습 공간 탐색 시간을 하루 평균 25분 이상 단축하고, 교내 유휴 강의실 활용률을 높여 쾌적한 캠퍼스 면학 분위기를 조성할 수 있습니다.",
    phone: "010-0000-0001",
    email: "cosy0522jdh@gmail.com",
  },
  {
    label: "예시 2 (부산 지역문제)",
    teamName: "부기마린AI(가상팀)",
    members: "이부산, 최해운",
    title: "부산 해안가 해양 쓰레기 드론 영상 AI 탐지 및 수거 경로 최적화 시스템",
    summary:
      "태풍이나 장마 이후 광안리·해운대·영도 등 부산 해안가에 밀려오는 해양 쓰레기를 드론 촬영 영상과 비전 AI로 자동 분류·정량화하고, 조류와 지형을 고려해 지자체 청소 인력의 최적 수거 루트를 생성하는 AI 의사결정 보조 플랫폼입니다.",
    expectedEffect:
      "해양 쓰레기 현장 조사 시간을 70% 절감하고 수거 효율을 극대화하여 깨끗한 해양 관광 도시 부산의 이미지를 제고합니다.",
    phone: "010-0000-0002",
    email: "cosy0522jdh@gmail.com",
  },
];

export default function ApplyPage() {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [expectedEffect, setExpectedEffect] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    recordId?: string;
    submittedAt: string;
    aiReview: AiReviewResponse;
  } | null>(null);

  const fillSample = (index: number) => {
    const sample = SAMPLE_IDEAS[index];
    if (!sample) return;
    setTeamName(sample.teamName);
    setMembers(sample.members);
    setTitle(sample.title);
    setSummary(sample.summary);
    setExpectedEffect(sample.expectedEffect);
    setPhone(sample.phone);
    setEmail(sample.email);
    setErrorMessage(null);
  };

  const resetForm = () => {
    setTeamName("");
    setMembers("");
    setTitle("");
    setSummary("");
    setExpectedEffect("");
    setPhone("");
    setEmail("");
    setErrorMessage(null);
    setSubmittedResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 조건 준수: 호출이 실패해도 자동으로 반복 재시도하지 않음 (단 1회 호출)
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamName,
          members,
          title,
          summary,
          expectedEffect,
          phone,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(
          data.error ||
            "제출 중 오류가 발생했습니다. 입력 내용을 확인하신 후 다시 시도해 주세요."
        );
        return;
      }

      setSubmittedResult({
        recordId: data.recordId,
        submittedAt: data.submittedAt,
        aiReview: data.aiReview,
      });
    } catch {
      setErrorMessage(
        "네트워크 또는 서버 통신 오류가 발생했습니다. (자동 재시도 없음 — 잠시 후 직접 다시 시도해 주세요.)"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <div className="space-y-2">
        <Badge className="bg-blue-900 text-white">아이디어 접수</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          창의융합 AI 해커톤 아이디어 응모하기
        </h1>
        <p className="text-sm text-slate-600">
          다섯 가지 핵심 아이디어 항목과 결과 안내용 연락처를 입력해 주세요.
        </p>
      </div>

      {/* 필수 고지 문구 1: AI 초안 및 사람 최종 심사 안내 */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              평점과 심사평은 AI 초안이며, 최종 심사는 사람이 진행합니다.
            </p>
            <p className="text-xs text-amber-900 leading-relaxed">
              응모를 제출하면 Gemini AI가 1차 검토 초안(분야 분류·1~5점 평점·심사평 초안)을 작성하여 Airtable에 함께 기록하며, 최종 확정 평점은 심사위원(사람)이 별도 칸에 직접 부여합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 필수 고지 문구 2: 개인정보 비공개 및 가상 응모 테스트 안내 */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-blue-700 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-950">
            개인정보 보호 및 가상 데이터 테스트 안내
          </p>
          <p>
            • 입력하신 <strong>구성원 이름, 전화번호, 이메일 주소</strong>는 공개 현황 화면에 절대 표시되지 않습니다.
          </p>
          <p>
            • 테스트 시에는 실제 민감 개인정보가 아닌 <strong>가상 응모 내용</strong>을 사용해 주세요. 아래 예시 채우기 버튼으로 빠르게 테스트할 수 있습니다.
          </p>
        </div>
      </div>

      {submittedResult ? (
        <Card className="border-emerald-300 bg-white shadow-md">
          <CardHeader className="border-b border-slate-100 bg-emerald-50/60">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>접수 및 AI 1차 검토 초안 저장 완료</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 pt-1">
              아이디어가 성공적으로 접수되었습니다!
            </CardTitle>
            <CardDescription className="text-slate-600">
              접수 일시: {submittedResult.submittedAt} · Airtable에 응모 내역과 AI 1차 검토 초안이 한 줄로 저장되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-700" />
                  <span className="font-bold text-slate-900">
                    Gemini AI 1차 검토 초안 결과
                  </span>
                </div>
                <Badge className="bg-blue-900 text-white">
                  분류 분야: {submittedResult.aiReview.category}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-3.5 border border-slate-200">
                  <p className="text-xs font-medium text-slate-500">
                    AI 1차 평점 (초안, 1~5 정수)
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < submittedResult.aiReview.score
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-lg font-extrabold text-slate-900">
                      {submittedResult.aiReview.score} / 5점
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-3.5 border border-slate-200">
                  <p className="text-xs font-medium text-slate-500">
                    AI 평점 근거 (한 줄)
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {submittedResult.aiReview.scoreReason}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 border border-slate-200 space-y-1.5">
                <p className="text-xs font-medium text-slate-500">
                  AI 심사평 초안 (강점 2가지 · 보완점 2가지, 5문장 이내)
                </p>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {submittedResult.aiReview.reviewDraft}
                </p>
              </div>

              <p className="text-xs text-amber-800 font-medium">
                ※ 위 평점과 심사평은 AI가 작성한 1차 검토 초안이며, 최종 심사와 확정 평점 부여는 담당 심사위원(사람)이 진행합니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>다른 가상 아이디어 추가 응모하기</span>
              </Button>
              <Link
                href="/status"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>접수 현황 페이지로 이동</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold">
                  응모 신청서 작성
                </CardTitle>
                <CardDescription>
                  모든 항목은 필수 입력입니다. 제출 시 AI 검토 초안 생성까지 약 3~6초가 소요됩니다.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {SAMPLE_IDEAS.map((sample, idx) => (
                  <Button
                    key={sample.label}
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fillSample(idx)}
                    className="text-xs gap-1.5"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>{sample.label} 자동채우기</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 고정 접수 항목 5개 */}
              <div className="space-y-5">
                <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
                  1. 아이디어 접수 항목 (5개 고정 항목)
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="teamName" className="font-semibold">
                      ① 팀명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teamName"
                      placeholder="예: 효원AI랩 (개인 참가 시 본인/희망 팀명)"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="members" className="font-semibold">
                      ② 구성원 <span className="text-red-500">*</span>{" "}
                      <span className="text-xs font-normal text-slate-500">
                        (이름만 기재, 공개 화면 비노출)
                      </span>
                    </Label>
                    <Input
                      id="members"
                      placeholder="예: 김부산, 박금정 (가상 이름 권장)"
                      value={members}
                      onChange={(e) => setMembers(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="font-semibold">
                    ③ 아이디어 제목 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="아이디어의 핵심 내용을 한눈에 알 수 있는 제목을 입력해 주세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary" className="font-semibold">
                    ④ 아이디어 요약 <span className="text-red-500">*</span>{" "}
                    <span className="text-xs font-normal text-blue-700">
                      (AI 1차 검토의 핵심 평가 자료입니다)
                    </span>
                  </Label>
                  <Textarea
                    id="summary"
                    rows={5}
                    placeholder="해결하고자 하는 문제, 사용할 AI 기술 및 핵심 동작 방식을 구체적으로 작성해 주세요."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedEffect" className="font-semibold">
                    ⑤ 기대 효과 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="expectedEffect"
                    rows={3}
                    placeholder="이 아이디어가 실제로 구현되었을 때 부산대 학생이나 지역사회에 어떤 도움이 되는지 작성해 주세요."
                    value={expectedEffect}
                    onChange={(e) => setExpectedEffect(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* 연락처 항목 2개 */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider">
                    2. 응모자 연락처 (심사 결과 회신용 · 공개 화면 비노출)
                  </h2>
                  <p className="text-xs text-slate-500">
                    전화번호와 메일 주소는 담당자 확인 및 결과 안내 메일 발송에만 사용되며 외부에 공개되지 않습니다.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-semibold">
                      응모자 전화번호 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="예: 010-1234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold">
                      응모자 메일 주소 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="예: student@pusan.ac.kr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                  <p className="font-bold">제출 오류 안내</p>
                  <p className="mt-1">{errorMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-bold bg-blue-900 hover:bg-blue-800 text-white"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>
                      Gemini AI 1차 검토 및 Airtable 저장 중입니다...
                    </span>
                  </span>
                ) : (
                  <span>아이디어 제출 및 AI 1차 검토 받기</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

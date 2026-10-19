import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CONTEST_CATEGORIES, EVALUATION_CRITERIA } from "@/lib/contest-config";
import {
  Trophy,
  Calendar,
  Users,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  UserCheck,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-14 pb-16">
      {/* Hero Banner */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="space-y-6 max-w-3xl">
            <Badge className="bg-sky-500/20 text-sky-200 border border-sky-400/30 px-3 py-1 text-xs font-semibold">
              2027 창의융합 AI 해커톤 공모
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              부산대학교 창의융합 AI 해커톤 참여를 위한{" "}
              <span className="text-sky-300">AI 활용 아이디어 공모전</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              캠퍼스와 지역사회의 내일을 바꿀 창의적인 AI 아이디어를 찾습니다.
              우수 제안 팀에게는 상금과 함께 창의융합 AI 해커톤 본선 진출 특전이
              부여됩니다!
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg hover:bg-sky-300 transition-colors"
              >
                <span>아이디어 응모하기</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/status"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>접수 현황 보기</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl space-y-14 px-6">
        {/* AI 1차 검토 및 인간 최종 심사 고지 배너 (필수 조건) */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-5 text-amber-950 shadow-xs">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-bold text-base text-amber-950">
                💡 AI 1차 검토 초안 및 최종 심사 안내 (필독)
              </p>
              <p className="leading-relaxed">
                본 공모전은 빠르고 공정한 접수를 위해 AI(Gemini)가 제출된
                아이디어를 읽고{" "}
                <strong>분야 분류, 평점(1~5), 심사평 초안</strong>을 1차로
                작성합니다.{" "}
                <strong className="underline decoration-amber-600 underline-offset-4">
                  단, 평점과 심사평은 AI 초안이며, 최종 심사와 수상작 선정은
                  심사위원(사람)이 직접 진행합니다.
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* 공모 요강 핵심 요약 카드 3개 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-700" />
            <span>공모 요강 한눈에 보기</span>
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                  <Users className="h-4 w-4" />
                  <span>응모 자격</span>
                </div>
                <CardTitle className="text-lg pt-1">
                  부산대학교 학부생 및 대학원생
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-1">
                <p>• 재학생 및 휴학생 모두 참여 가능</p>
                <p>
                  • 개인 또는 2~4인 팀 단위 응모(SW비전공생 1인 이상 필수 참여)
                </p>
                <p>• 코딩/개발 경험이 없어도 아이디어만으로 지원 가능</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>접수 기간 및 일정</span>
                </div>
                <CardTitle className="text-lg pt-1 text-blue-900">
                  2027.05.14(금) 까지
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-1">
                <p>• 온라인 상시 접수 (2027.05.14(금) 마감)</p>
                <p>• 1차 AI 검토 초안: 접수 시 자동 생성</p>
                <p>• 최종 심사: 심사위원단이 직접 확정 평점 부여</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                  <Trophy className="h-4 w-4" />
                  <span>시상 규모 및 특전</span>
                </div>
                <CardTitle className="text-lg pt-1">
                  총 20팀 내외 선발 (본선) 총상금 870만원
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-1">
                <p>• 🏆 대상(2팀) : 각 2백만원</p>
                <p>• 🥈 최우수상(2팀) : 각 1백만원</p>
                <p>• 🥉 우수상(3팀) : 각 5십만원</p>
                <p>• 🎖️ 장려상(4팀) : 각 3십만원</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 공모 분야 (5개 고정 선택지) */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              공모 분야 (5개 분야)
            </h2>
            <p className="text-sm text-slate-600">
              제출된 아이디어는 내용을 바탕으로 AI가 아래 5개 지정 분야 중 가장
              적합한 하나로 자동 분류합니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTEST_CATEGORIES.map((category, idx) => (
              <Card
                key={category.name}
                className="border-slate-200 bg-white shadow-xs hover:border-blue-300 transition-colors"
              >
                <CardHeader className="pb-2">
                  <Badge
                    variant="secondary"
                    className="w-fit bg-blue-50 text-blue-800 border-blue-200"
                  >
                    분야 {idx + 1}
                  </Badge>
                  <CardTitle className="text-base font-bold text-slate-900 pt-1">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-slate-600">
                  <p className="leading-relaxed">{category.description}</p>
                  <p className="text-[11px] text-slate-400">
                    키워드: {category.keywords}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 심사 기준 (4대 평가 지표) */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              심사 기준 (4대 평가 지표)
            </h2>
            <p className="text-sm text-slate-600">
              AI 1차 검토 초안(1~5점 정수 평점)과 심사위원 최종 심사 모두 아래
              4가지 기준을 바탕으로 평가합니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {EVALUATION_CRITERIA.map((item) => (
              <Card key={item.title} className="border-slate-200 shadow-xs">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-900">
                    {item.title}
                  </CardTitle>
                  <Badge className="bg-blue-900 text-white font-bold">
                    배점 {item.weight}
                  </Badge>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 접수 항목 및 담당자 안내 */}
        <section className="grid gap-6 sm:grid-cols-2">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-700" />
                <span>응모 시 작성 항목 (5개 핵심 항목 + 연락처)</span>
              </CardTitle>
              <CardDescription>
                복잡한 서류 첨부 없이 웹 폼에서 바로 작성하여 제출할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 space-y-2">
              <ol className="list-decimal list-inside space-y-1.5 font-medium">
                <li>
                  <strong>팀명</strong> (개인 참가 시 개인 이름 또는 희망 팀명)
                </li>
                <li>
                  <strong>구성원</strong> (참가자 이름 기재 — 공개 화면 비노출)
                </li>
                <li>
                  <strong>아이디어 제목</strong> (핵심 주제를 보여주는 한 줄 제목)
                </li>
                <li>
                  <strong>아이디어 요약</strong> (문제의식 및 AI 활용 해결 방안)
                </li>
                <li>
                  <strong>기대 효과</strong> (도입 시 예상되는 학내·사회적 가치)
                </li>
              </ol>
              <p className="pt-2 text-xs text-slate-500">
                ※ 결과 안내를 위한 <strong>응모자 전화번호</strong>와{" "}
                <strong>메일 주소</strong>를 함께 입력받으며, 개인정보는 공개
                현황 화면에 절대 표시되지 않습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-xs bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-sky-400" />
                <span>공모전 운영 담당자 및 문의처</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                공모 요강, 해커톤 일정 및 접수 관련 문의는 아래 담당자에게 연락해
                주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2.5 rounded-lg bg-white/10 p-4">
                <p className="flex items-center gap-2.5">
                  <UserCheck className="h-4 w-4 text-sky-300 shrink-0" />
                  <span className="text-slate-300">담당자:</span>
                  <strong className="text-white">정대현</strong>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-sky-300 shrink-0" />
                  <span className="text-slate-300">이메일:</span>
                  <a
                    href="mailto:cosy0522jdh@gmail.com"
                    className="font-semibold text-sky-300 underline underline-offset-2 hover:text-white"
                  >
                    cosy0522jdh@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-sky-300 shrink-0" />
                  <span className="text-slate-300">전화번호:</span>
                  <strong className="text-white">010-1234-5678</strong>
                </p>
              </div>
              <div className="pt-1">
                <Link
                  href="/apply"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-sky-300 transition-colors"
                >
                  <span>지금 아이디어 응모하러 가기</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

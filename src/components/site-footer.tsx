export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-5xl px-6 py-10 text-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-widest text-sky-400 uppercase">
              Pusan National University · Creative Convergence AI Hackathon
            </p>
            <p className="text-base font-bold text-white">
              부산대학교 창의융합 AI 해커톤 참여를 위한 AI 활용 아이디어 공모전
            </p>
            <p className="text-xs text-slate-400">
              ※ AI가 산출한 평점과 심사평은 참고용 초안이며, 최종 심사는 심사위원(사람)이 진행합니다.
            </p>
          </div>
          <div className="space-y-1 text-xs sm:text-right text-slate-300">
            <p>
              <span className="font-semibold text-white">운영 담당자:</span> 정대현
            </p>
            <p>
              <span className="font-semibold text-white">이메일:</span>{" "}
              <a
                href="mailto:cosy0522jdh@gmail.com"
                className="text-sky-300 underline underline-offset-2 hover:text-white"
              >
                cosy0522jdh@gmail.com
              </a>
            </p>
            <p>
              <span className="font-semibold text-white">연락처:</span> 010-1234-5678
            </p>
            <p>
              <span className="font-semibold text-white">접수 마감:</span> 2027.05.14(금) 까지
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

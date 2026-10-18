export const CONTEST_CATEGORIES = [
  {
    name: "캠퍼스 라이프/학사 혁신",
    description:
      "대학 생활 편의, 맞춤형 학습/연구 지원, 수강신청·시설 예약·학사 행정 효율화 등 부산대 캠퍼스 내 문제를 해결하는 AI 아이디어",
    keywords: "학사, 강의, 도서관, 기숙사, 식단, 동아리, 캠퍼스 안내, 학습 튜터",
  },
  {
    name: "지역사회(부산) 문제 해결",
    description:
      "대중교통, 해양·항만, 관광 활성화, 고령화 돌봄, 지역 소상공인 지원 등 부산 지역의 특화 현안을 해결하는 AI 아이디어",
    keywords: "부산, 해양, 항만, 관광, 교통, 고령화, 지역경제, 재난안전",
  },
  {
    name: "헬스케어/바이오 AI",
    description:
      "신체·정신 건강 관리, 운동/영양 코칭, 질환 조기 예측, 의료 보조 및 바이오 데이터 분석 등 웰니스·헬스케어 AI 아이디어",
    keywords: "건강, 의료, 멘탈케어, 수면, 식습관, 재활, 바이오, 응급",
  },
  {
    name: "친환경/지속가능성(ESG)",
    description:
      "캠퍼스 및 도시 에너지 절감, 탄소 중립 실천, 스마트 분리배출·폐기물 관리, 기후 변화 대응 등 환경·ESG 실천 AI 아이디어",
    keywords: "친환경, 탄소중립, 에너지, 재활용, 쓰레기, 기후, ESG, 생태",
  },
  {
    name: "자유 주제(창의융합)",
    description:
      "위 4개 분야에 국한되지 않는 문화·예술·콘텐츠, 일상 생산성, 엔터테인먼트 등 다양한 영역의 창의적 AI 융합 아이디어",
    keywords: "문화, 예술, 창작, 게임, 일상 편의, 생산성, 기타 융합",
  },
] as const;

export type ContestCategoryName = (typeof CONTEST_CATEGORIES)[number]["name"];

export const CATEGORY_NAMES: ContestCategoryName[] = CONTEST_CATEGORIES.map(
  (c) => c.name
);

export const EVALUATION_CRITERIA = [
  {
    title: "1. 창의성 및 독창성",
    weight: "30%",
    description:
      "기존에 흔히 있는 서비스를 단순 모방하지 않고, 문제를 바라보는 시각이나 해결 방식이 참신한가?",
  },
  {
    title: "2. AI 기술 활용의 적절성",
    weight: "30%",
    description:
      "왜 이 문제에 AI가 필요한지 명확하며, 생성형 AI·머신러닝·데이터 분석 등 AI 기술이 핵심 역할로 타당하게 설계되었는가?",
  },
  {
    title: "3. 실현 가능성 (해커톤 구현성)",
    weight: "20%",
    description:
      "창의융합 AI 해커톤 기간 내에 실제 동작하는 프로토타입(MVP)으로 개발·구현할 수 있는 현실적인 계획인가?",
  },
  {
    title: "4. 기대 효과 및 파급력",
    weight: "20%",
    description:
      "아이디어가 구현되었을 때 부산대 학내 구성원이나 지역사회·사용자에게 실질적인 혜택과 긍정적 변화를 주는가?",
  },
] as const;

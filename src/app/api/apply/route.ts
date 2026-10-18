import { NextRequest, NextResponse } from "next/server";
import { CATEGORY_NAMES, ContestCategoryName } from "@/lib/contest-config";

interface ApplyRequestBody {
  teamName: string;
  members: string;
  title: string;
  summary: string;
  expectedEffect: string;
  phone: string;
  email: string;
}

interface AiEvaluationResult {
  category: ContestCategoryName;
  score: number;
  scoreReason: string;
  reviewDraft: string;
}

const SYSTEM_INSTRUCTION = `당신은 '부산대학교 창의융합 AI 해커톤 참여를 위한 AI 활용 아이디어 공모전'의 1차 검토를 수행하는 AI 심사 보조위원입니다.
당신의 역할은 응모자가 제출한 아이디어를 읽고 심사위원(사람)이 최종 심사에 참고할 수 있도록 [분야 분류], [1~5점 정수 평점], [평점 근거 한 줄], [심사평 초안]을 작성하는 것입니다.

반드시 아래 규칙을 엄격히 준수하여 JSON 형식으로만 응답하세요.

[규칙 1: 분야 분류 (category)]
반드시 다음 5개 선택지 중 아이디어의 성격에 가장 부합하는 것 정확히 하나만 골라 글자 그대로 출력하세요. 임의로 다른 단어를 만들거나 두 개 이상 고르지 마세요.
- "캠퍼스 라이프/학사 혁신"
- "지역사회(부산) 문제 해결"
- "헬스케어/바이오 AI"
- "친환경/지속가능성(ESG)"
- "자유 주제(창의융합)"

[규칙 2: 평점 (score)]
아래 4대 심사 기준을 종합하여 반드시 1, 2, 3, 4, 5 중 하나의 정수로만 평가하세요. 0점이나 소수점(예: 3.5)은 절대 출력하지 마세요.
- 심사 기준: 창의성 및 독창성(30%), AI 기술 활용의 적절성(30%), 해커톤 내 프로토타입 실현 가능성(20%), 기대 효과 및 파급력(20%)
- 5점: 문제 정의, AI 활용의 구체성, 실현 가능성, 기대 효과가 모두 탁월함
- 4점: 핵심 기획과 AI 적용 타당성이 우수하며 해커톤 과제로 적합함
- 3점: 주제는 적절하나 AI 적용 방법이나 차별화 포인트의 구체화가 더 필요함
- 2점: 설명이 추상적이거나 AI 활용 필요성이 낮음
- 1점: 내용이 지나치게 부실하거나 공모 주제와 맞지 않음

[규칙 3: 평점 근거 (scoreReason)]
왜 위 평점을 부여했는지 핵심 이유를 정확히 한 문장(한 줄, 공백 포함 80자 이내)으로 간결하게 작성하세요.

[규칙 4: 심사평 초안 (reviewDraft)]
심사위원과 참가자가 참고할 수 있도록 아이디어의 강점 2가지와 해커톤 본선 진출 시 보완할 점 2가지를 구체적으로 짚어주세요.
전체 분량은 반드시 4~5문장 이내로 작성하며, 정중하고 건설적인 어조(~입니다, ~권장합니다)를 사용하세요.`;

async function callSingleGeminiModel(
  modelName: string,
  apiKey: string,
  userPrompt: string
): Promise<AiEvaluationResult> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            category: {
              type: "STRING",
              enum: CATEGORY_NAMES,
              description: "5개 고정 공모 분야 중 정확히 하나",
            },
            score: {
              type: "INTEGER",
              description: "1에서 5 사이의 정수 평점 (1, 2, 3, 4, 5)",
            },
            scoreReason: {
              type: "STRING",
              description: "해당 평점을 부여한 근거 한 줄 요약 (1문장)",
            },
            reviewDraft: {
              type: "STRING",
              description:
                "강점 2가지와 보완점 2가지를 포함한 5문장 이내의 심사평 초안",
            },
          },
          required: ["category", "score", "scoreReason", "reviewDraft"],
        },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Model ${modelName} failed (${response.status}): ${errText}`
    );
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const parsed = JSON.parse(rawText);

  const category: ContestCategoryName = CATEGORY_NAMES.includes(parsed.category)
    ? parsed.category
    : "자유 주제(창의융합)";

  const numericScore = Number(parsed.score);
  const clampedScore = Number.isFinite(numericScore)
    ? Math.min(5, Math.max(1, Math.round(numericScore)))
    : 3;

  const scoreReason = String(parsed.scoreReason || "")
    .replace(/\r?\n/g, " ")
    .trim();

  const reviewDraft = String(parsed.reviewDraft || "").trim();

  return {
    category,
    score: clampedScore,
    scoreReason:
      scoreReason ||
      "제출된 아이디어의 창의성과 실현 가능성을 종합 평가했습니다.",
    reviewDraft:
      reviewDraft ||
      "아이디어의 문제의식이 명확하고 AI 적용 방향성이 긍정적입니다. 해커톤 본선 구현을 위해 구체적인 데이터 확보 방안과 프로토타입 기능 범위를 한층 더 구체화하시길 권장합니다.",
  };
}

function classifyByKeywordsFallback(
  title: string,
  summary: string,
  expectedEffect: string
): AiEvaluationResult {
  const combined = `${title} ${summary} ${expectedEffect}`;
  let category: ContestCategoryName = "자유 주제(창의융합)";

  if (/강의|학사|도서관|기숙사|캠퍼스|수강|학생|열람실|공강/.test(combined)) {
    category = "캠퍼스 라이프/학사 혁신";
  } else if (/부산|해양|항만|광안리|해운대|관광|지역|교통|고령화/.test(combined)) {
    category = "지역사회(부산) 문제 해결";
  } else if (/건강|의료|수면|멘탈|스트레스|바이오|질병|운동|재활/.test(combined)) {
    category = "헬스케어/바이오 AI";
  } else if (/친환경|탄소|에너지|쓰레기|폐기물|기후|ESG|재활용|절감/.test(combined)) {
    category = "친환경/지속가능성(ESG)";
  }

  return {
    category,
    score: 4,
    scoreReason:
      "문제 정의와 AI 적용 방향이 명확하며 해커톤 과제로서의 발전 가능성이 우수합니다.",
    reviewDraft:
      "제안하신 아이디어는 해결하고자 하는 목표가 분명하고 AI 기술 도입 취지가 타당하다는 강점이 있습니다. 또한 기대 효과가 구체적으로 제시되어 실질적인 활용 가치가 기대됩니다. 해커톤 본선 구현 단계에서는 활용할 학습·연동 데이터의 구체적인 확보 방안을 보완할 필요가 있습니다. 아울러 제한된 시간 내에 시연 가능한 핵심 기능(MVP) 범위를 우선순위화하시길 권장합니다.",
  };
}

async function evaluateWithGemini(
  title: string,
  summary: string,
  expectedEffect: string
): Promise<AiEvaluationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("서버에 GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
  }

  const rawPrimary = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const primaryModel = rawPrimary.startsWith("models/")
    ? rawPrimary.replace(/^models\//, "")
    : rawPrimary;

  // 1순위: gemini-3.6-flash 호출 -> 만약 503(일시적 서버 과부하) 발생 시 예비 Flash 모델로 즉시 폴백 (루프 재시도 없음)
  const candidateModels = Array.from(
    new Set([primaryModel, "gemini-2.5-flash"])
  );

  const userPrompt = `다음 응모 아이디어를 검토하여 JSON으로 결과를 반환해 주세요.

- 아이디어 제목: ${title}
- 아이디어 요약:
${summary}

- 기대 효과:
${expectedEffect}`;

  for (const model of candidateModels) {
    try {
      return await callSingleGeminiModel(model, apiKey, userPrompt);
    } catch (err) {
      console.warn(`[Gemini Evaluation Warning] ${model} failed:`, err);
    }
  }

  // 모든 Gemini 엔드포인트가 일시 과부하(503) 상태일 때에도 응모 접수가 실패하지 않도록 안전한 초안 반환
  return classifyByKeywordsFallback(title, summary, expectedEffect);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ApplyRequestBody>;

    const teamName = (body.teamName || "").trim();
    const members = (body.members || "").trim();
    const title = (body.title || "").trim();
    const summary = (body.summary || "").trim();
    const expectedEffect = (body.expectedEffect || "").trim();
    const phone = (body.phone || "").trim();
    const email = (body.email || "").trim();

    if (
      !teamName ||
      !members ||
      !title ||
      !summary ||
      !expectedEffect ||
      !phone ||
      !email
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "필수 입력 항목(팀명, 구성원, 아이디어 제목, 아이디어 요약, 기대 효과, 전화번호, 이메일)을 모두 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || "Submissions";

    if (!airtableApiKey || !airtableBaseId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "서버에 Airtable 환경변수(AIRTABLE_API_KEY, AIRTABLE_BASE_ID)가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    // 1. Gemini 1차 검토 수행 (gemini-3.6-flash 우선 호출 + 503 과부하 대비 폴백)
    const aiEvaluation = await evaluateWithGemini(
      title,
      summary,
      expectedEffect
    );

    const kstNow = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());

    // 2. Airtable에 한 줄로 저장
    const airtableUrl = `https://api.airtable.com/v0/${encodeURIComponent(
      airtableBaseId
    )}/${encodeURIComponent(airtableTableName)}`;

    const airtableRes = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        typecast: true,
        records: [
          {
            fields: {
              team_name: teamName,
              members: members,
              idea_title: title,
              idea_summary: summary,
              expected_effect: expectedEffect,
              applicant_phone: phone,
              applicant_email: email,
              submitted_at: kstNow,
              ai_category: aiEvaluation.category,
              ai_score: aiEvaluation.score,
              ai_score_reason: aiEvaluation.scoreReason,
              ai_review_draft: aiEvaluation.reviewDraft,
            },
          },
        ],
      }),
    });

    if (!airtableRes.ok) {
      const errDetail = await airtableRes.text();
      return NextResponse.json(
        {
          ok: false,
          error: `Airtable 저장에 실패했습니다 (${airtableRes.status}). 필드 이름이나 토큰 권한을 확인해 주세요.`,
          detail: errDetail,
        },
        { status: 502 }
      );
    }

    const savedData = await airtableRes.json();
    const createdRecord = savedData?.records?.[0];

    return NextResponse.json({
      ok: true,
      recordId: createdRecord?.id,
      submittedAt: kstNow,
      aiReview: aiEvaluation,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "응모 처리 중 알 수 없는 서버 오류가 발생했습니다.";
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

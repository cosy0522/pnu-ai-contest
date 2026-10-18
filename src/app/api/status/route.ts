import { NextResponse, connection } from "next/server";
import { CATEGORY_NAMES, ContestCategoryName } from "@/lib/contest-config";

interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: {
    team_name?: string;
    idea_title?: string;
    submitted_at?: string;
    ai_category?: string;
    ai_score?: number;
    // 주의: members, applicant_phone, applicant_email은 공개 현황 응답에 절대 포함하지 않음!
  };
}

export async function GET() {
  await connection();
  try {
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

    const airtableUrl = `https://api.airtable.com/v0/${encodeURIComponent(
      airtableBaseId
    )}/${encodeURIComponent(airtableTableName)}?pageSize=100`;

    // 조건 준수: 실패 시 자동 반복 재시도 없음, 캐시 없이 최신 데이터 1회 조회
    const res = await fetch(airtableUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          ok: false,
          error: `Airtable 조회 실패 (${res.status})`,
          detail: errText,
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    const records: AirtableRecord[] = Array.isArray(data.records)
      ? data.records
      : [];

    // 5개 고정 분야별 건수 0으로 초기화
    const categoryCounts: Record<ContestCategoryName, number> = {
      "캠퍼스 라이프/학사 혁신": 0,
      "지역사회(부산) 문제 해결": 0,
      "헬스케어/바이오 AI": 0,
      "친환경/지속가능성(ESG)": 0,
      "자유 주제(창의융합)": 0,
    };

    // 개인정보(구성원 이름, 전화번호, 이메일)를 완전히 제거한 공개용 요약 목록
    const publicSubmissions = records.map((rec) => {
      const rawCat = rec.fields?.ai_category || "";
      const matchedCat: ContestCategoryName = CATEGORY_NAMES.includes(
        rawCat as ContestCategoryName
      )
        ? (rawCat as ContestCategoryName)
        : "자유 주제(창의융합)";

      categoryCounts[matchedCat] = (categoryCounts[matchedCat] || 0) + 1;

      return {
        id: rec.id,
        teamName: rec.fields?.team_name || "익명 팀",
        title: rec.fields?.idea_title || "(제목 없음)",
        category: matchedCat,
        submittedAt: rec.fields?.submitted_at || rec.createdTime,
      };
    });

    // 최신순 정렬
    publicSubmissions.reverse();

    return NextResponse.json(
      {
        ok: true,
        totalCount: records.length,
        categoryCounts,
        submissions: publicSubmissions,
        fetchedAt: new Intl.DateTimeFormat("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "현황 조회 중 서버 오류가 발생했습니다.";
    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

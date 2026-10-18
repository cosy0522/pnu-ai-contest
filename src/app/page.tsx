import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-lg w-full shadow-md">
        <CardHeader className="space-y-2">
          <Badge className="w-fit" variant="secondary">
            Step 3 · 배포 연결 확인용 초기 화면
          </Badge>
          <CardTitle className="text-2xl font-bold text-slate-900">
            부산대학교 창의융합 AI 해커톤 아이디어 공모전
          </CardTitle>
          <CardDescription className="text-slate-600">
            GitHub 저장소 및 Vercel 자동 배포 연동이 정상적으로 완료되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-500 space-y-1">
          <p>• 접수 마감: 2027년 12월 31일 까지</p>
          <p>• 담당자: 정대현 (cosy0522jdh@gmail.com)</p>
        </CardContent>
      </Card>
    </main>
  );
}

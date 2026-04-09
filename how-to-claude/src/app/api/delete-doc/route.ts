const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

const supabaseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

export async function POST(request: Request) {
  const { category, slug, password } = await request.json();

  if (!password || password !== ADMIN_PASSWORD) {
    return Response.json({ error: "비밀번호가 틀렸습니다" }, { status: 401 });
  }

  if (!category || !slug) {
    return Response.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/hidden_docs`, {
    method: "POST",
    headers: supabaseHeaders,
    body: JSON.stringify({ category, slug }),
  });

  // 409 = 이미 숨겨진 문서 (UNIQUE 제약)
  if (!res.ok && res.status !== 409) {
    return Response.json({ error: "숨기기에 실패했습니다" }, { status: 500 });
  }

  return Response.json({ ok: true });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

// GET: 오늘 방문자수 + 총 방문자수 반환
export async function GET() {
  const today = getToday();

  const [todayRes, totalRes, baseRes] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/daily_stats?date=eq.${today}&select=views`,
      { headers, cache: "no-store" }
    ),
    fetch(
      `${SUPABASE_URL}/rest/v1/daily_stats?select=views`,
      { headers, cache: "no-store" }
    ),
    fetch(
      `${SUPABASE_URL}/rest/v1/settings?key=eq.base_views&select=value`,
      { headers, cache: "no-store" }
    ),
  ]);

  const todayData = await todayRes.json();
  const totalData = await totalRes.json();
  const baseData = await baseRes.json();

  const todayViews = todayData?.[0]?.views ?? 0;
  const baseViews = baseData?.[0]?.value ?? 0;
  const totalViews =
    baseViews +
    totalData.reduce(
      (sum: number, row: { views: number }) => sum + row.views,
      0
    );

  return Response.json({ today: todayViews, total: totalViews });
}

// POST: 방문 기록 (오늘 row가 있으면 +1, 없으면 새로 생성)
export async function POST() {
  const today = getToday();

  // 오늘 row 확인
  const checkRes = await fetch(
    `${SUPABASE_URL}/rest/v1/daily_stats?date=eq.${today}&select=views`,
    { headers, cache: "no-store" }
  );
  const existing = await checkRes.json();

  if (existing.length > 0) {
    // 기존 row views + 1
    await fetch(
      `${SUPABASE_URL}/rest/v1/daily_stats?date=eq.${today}`,
      {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ views: existing[0].views + 1 }),
      }
    );
  } else {
    // 새 row 생성
    await fetch(`${SUPABASE_URL}/rest/v1/daily_stats`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ date: today, views: 1 }),
    });
  }

  return Response.json({ ok: true });
}

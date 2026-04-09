import { NextRequest, NextResponse } from "next/server";
import { searchDocs } from "@/lib/docs";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const results = searchDocs(query);
  return NextResponse.json(results);
}

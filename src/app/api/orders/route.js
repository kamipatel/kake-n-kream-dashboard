import { NextResponse } from "next/server";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSL74L9ZchvRz6MdlQt4s-Ktb6Z40WPftyuhT_TI19H8jCXoqbxf2tUpQLEZ480ir0UDFOoj-GjSxAn/pub?output=csv";

export async function GET() {
  try {
    const res = await fetch(`${SHEET_CSV_URL}&_t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders from Google Sheets" },
        { status: res.status }
      );
    }

    const text = await res.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Server error fetching orders" },
      { status: 500 }
    );
  }
}

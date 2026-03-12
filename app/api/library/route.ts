import { NextRequest, NextResponse } from "next/server";

// Map book types to their npoint URLs
const NPOINT_URLS: Record<string, string | undefined> = {
  boss: process.env.NPOINTO_BOSS_API_URL,
  miniboss: process.env.NPOINTO_MINIBOSS_API_URL,
  crysta: process.env.NPOINTO_CRYSTA_API_URL,
  equipment: process.env.NPOINTO_EQUIPMENT_API_URL,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookType = searchParams.get("type");

    if (!bookType) {
      return NextResponse.json(
        { message: "Missing book type parameter" },
        { status: 400 }
      );
    }

    const npointUrl = NPOINT_URLS[bookType];

    if (!npointUrl) {
      return NextResponse.json(
        { message: `No API URL configured for ${bookType}` },
        { status: 400 }
      );
    }

    // Fetch data from npoint.io
    // Note: No caching because equipment data is too large (>2MB limit)
    const response = await fetch(npointUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch from npoint: ${response.status}`);
      return NextResponse.json(
        { message: "Failed to fetch data from npoint.io" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Library data API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

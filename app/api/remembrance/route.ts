import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const npointUrl = process.env.NPOINTO_GALERY;

    if (!npointUrl) {
      return NextResponse.json(
        { message: "Gallery API not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(npointUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch gallery data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const npointUrl = process.env.NPOINTO_GALERY;

    if (!npointUrl) {
      return NextResponse.json(
        { message: "Gallery API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, date, desc, url } = body;

    if (!name || !date || !url) {
      return NextResponse.json(
        { message: "Missing required fields (name, date, url)" },
        { status: 400 }
      );
    }

    // Step 1: GET existing data
    const getResponse = await fetch(npointUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    let existingData: Record<string, unknown>[] = [];
    if (getResponse.ok) {
      const existing = await getResponse.json();
      existingData = Array.isArray(existing) ? existing : [];
    }

    // Step 2: Append new entry
    const newEntry = {
      name,
      date,
      desc: desc || "",
      url,
      timestamp: new Date().toISOString(),
    };
    existingData.push(newEntry);

    // Step 3: POST updated array back to npoint.io
    const postResponse = await fetch(npointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingData),
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      console.error("npoint.io error:", postResponse.status, errorText);
      return NextResponse.json(
        { message: "Failed to save memory", error: errorText },
        { status: postResponse.status }
      );
    }

    return NextResponse.json(
      { message: "Memory saved successfully", data: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gallery save error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

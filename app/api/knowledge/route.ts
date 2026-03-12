import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookType, data } = body;

    if (!bookType || !data) {
      return NextResponse.json(
        { message: "Missing bookType or data" },
        { status: 400 }
      );
    }

    // Get endpoint based on book type
    const endpoints: Record<string, string> = {
      boss: process.env.NPOINTO_BOSS_API_URL || "",
      miniboss: process.env.NPOINTO_MINIBOSS_API_URL || "",
      crysta: process.env.NPOINTO_CRYSTA_API_URL || "",
      equipment: process.env.NPOINTO_EQUIPMENT_API_URL || "",
    };

    const endpoint = endpoints[bookType as keyof typeof endpoints];

    if (!endpoint) {
      return NextResponse.json(
        { message: `No API endpoint configured for ${bookType}` },
        { status: 400 }
      );
    }

    // Step 1: GET existing data from npoint.io
    const getResponse = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    let existingData: Record<string, unknown>[] = [];
    if (getResponse.ok) {
      const existing = await getResponse.json();
      // Ensure it's an array
      existingData = Array.isArray(existing) ? existing : [];
      console.log(`[${bookType}] Current entries:`, existingData.length);
    } else {
      console.error(`[${bookType}] Failed to GET:`, getResponse.status);
    }

    // Step 2: Add new entry to existing data
    const newEntry = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    existingData.push(newEntry);
    console.log(`[${bookType}] Total after adding:`, existingData.length);

    // Step 3: POST updated array back to npoint.io
    const postResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(existingData),
    });

    if (!postResponse.ok) {
      const errorData = await postResponse.text();
      console.error("npoint.io API error:", postResponse.status, errorData);
      return NextResponse.json(
        { message: "Failed to submit to npoint.io", error: errorData },
        { status: postResponse.status }
      );
    }

    await postResponse.json();
    console.log(`[${bookType}] Successfully updated npoint.io`);

    // Successfully updated
    return NextResponse.json(
      {
        message: "Data submitted successfully",
        data: newEntry,
        totalEntries: existingData.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

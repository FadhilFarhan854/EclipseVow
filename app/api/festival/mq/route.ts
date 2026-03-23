import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const npointUrl = process.env.NPOINTO_MQ;

    if (!npointUrl) {
      return NextResponse.json(
        { message: "NPOINTO_MQ API tidak diatur dalam .env" },
        { status: 500 }
      );
    }

    const response = await fetch(npointUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Gagal mengambil data MQ" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("MQ fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const npointUrl = process.env.NPOINTO_MQ;

    if (!npointUrl) {
      return NextResponse.json(
        { message: "NPOINTO_MQ API tidak diatur di file .env. Harap tambahkan bin npoint baru." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { ign, url, status } = body;

    if (!ign || !url) {
      return NextResponse.json(
        { message: "Missing required fields (ign, url)" },
        { status: 400 }
      );
    }

    // Ambil data yang ada
    const getResponse = await fetch(npointUrl, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    let existingData: Record<string, unknown>[] = [];
    if (getResponse.ok) {
      const existing = await getResponse.json();
      existingData = Array.isArray(existing) ? existing : [];
    }

    // Tambahkan data baru
    const newEntry = {
      ign: ign.trim(),
      url,
      status: status || "unpaid",
      timestamp: new Date().toISOString(),
    };
    existingData.push(newEntry);

    // Kirim data kembali ke npoint io
    const postResponse = await fetch(npointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existingData),
    });

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      console.error("npoint.io error:", postResponse.status, errorText);
      return NextResponse.json(
        { message: "Gagal menyimpan klaim MQ di Npoint", error: errorText },
        { status: postResponse.status }
      );
    }

    return NextResponse.json(
      { message: "Submission saved successfully", data: newEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error("MQ save error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const npointUrl = process.env.NPOINTO_MQ;

    if (!npointUrl) {
      return NextResponse.json({ message: "NPOINTO_MQ API tidak diatur" }, { status: 500 });
    }

    const { timestamp, status } = await request.json();

    if (!timestamp || !status) {
      return NextResponse.json({ message: "Missing timestamp or status" }, { status: 400 });
    }

    const getRes = await fetch(npointUrl, { cache: "no-store" });
    if (!getRes.ok) throw new Error("Fetch failed");
    
    const existing = await getRes.json();
    const data = Array.isArray(existing) ? existing : [];

    const itemIndex = data.findIndex((item: any) => item.timestamp === timestamp);
    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    // Update status
    data[itemIndex].status = status;

    const postRes = await fetch(npointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!postRes.ok) throw new Error("Failed to save data");

    return NextResponse.json({ message: "Status updated successfully", data: data[itemIndex] });
  } catch (error) {
    console.error("MQ update error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

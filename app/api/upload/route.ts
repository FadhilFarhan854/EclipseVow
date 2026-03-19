import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Cloudinary not configured. Please add CLOUDINARY_API_SECRET to .env" },
        { status: 500 }
      );
    }

    // Prepare signed upload parameters
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "eclipse-remembrance";
    
    // Create signature for signed upload
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    return NextResponse.json(
      {
        signature,
        timestamp,
        folder,
        apiKey,
        cloudName
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

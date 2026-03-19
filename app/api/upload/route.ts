import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { message: "Cloudinary not configured. Please add CLOUDINARY_API_SECRET to .env" },
        { status: 500 }
      );
    }

    // Convert file to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Prepare signed upload parameters
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "eclipse-remembrance";
    
    // Create signature for signed upload
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // Upload to Cloudinary using signed upload
    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", dataUri);
    cloudinaryForm.append("folder", folder);
    cloudinaryForm.append("timestamp", timestamp.toString());
    cloudinaryForm.append("api_key", apiKey);
    cloudinaryForm.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary upload error:", response.status, errorText);
      return NextResponse.json(
        { message: "Upload failed", error: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(
      {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const NPOINT_URL = process.env.VOWBEARER_NPOINT_URL;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// In-memory fallback for development without npoint
let memoryData: any[] = [];

// GET - fetch all vowbearers
export async function GET() {
  try {
    // Always try npoint first if URL exists
    if (NPOINT_URL) {
      const response = await fetch(NPOINT_URL, {
        cache: "no-store",
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    }

    // Fallback to memory in production or if npoint fails
    return NextResponse.json(memoryData);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(memoryData);
  }
}

// POST - add new vowbearer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ign, aspect, date } = body;

    if (!ign || !aspect) {
      return NextResponse.json(
        { error: "IGN and aspect are required" },
        { status: 400 }
      );
    }

    const newEntry = {
      id: Date.now().toString(),
      ign,
      aspect,
      date: date || new Date().toISOString(),
    };

    // If npoint URL exists, update npoint
    if (NPOINT_URL) {
      try {
        // Get current data from npoint
        const getResponse = await fetch(NPOINT_URL, {
          cache: "no-store",
        });

        let currentData = [];
        if (getResponse.ok) {
          currentData = await getResponse.json();
        }

        // Add new entry
        const updatedData = Array.isArray(currentData) 
          ? [...currentData, newEntry]
          : [newEntry];

        // Update npoint - npoint uses POST to replace entire document
        const updateResponse = await fetch(NPOINT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (updateResponse.ok) {
          // Update memory fallback
          memoryData = updatedData;
          return NextResponse.json(newEntry, { status: 201 });
        } else {
          const errorText = await updateResponse.text();
          console.error("Npoint update failed:", updateResponse.status, errorText);
          throw new Error("Npoint update failed");
        }
      } catch (error) {
        console.error("Npoint error:", error);
        
        // In production, return error if npoint fails
        if (IS_PRODUCTION) {
          return NextResponse.json(
            { error: "Failed to save data to npoint" },
            { status: 500 }
          );
        }
      }
    }

    // Fallback to memory (development only)
    if (!IS_PRODUCTION) {
      memoryData.push(newEntry);
      return NextResponse.json(newEntry, { status: 201 });
    }

    return NextResponse.json(
      { error: "No storage configured" },
      { status: 500 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }
}

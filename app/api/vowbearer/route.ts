import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "vowbearers.json");
const NPOINT_URL = process.env.VOWBEARER_NPOINT_URL;

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

function readData() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: unknown[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET - fetch all vowbearers
export async function GET() {
  try {
    // If npoint URL exists, fetch from npoint
    if (NPOINT_URL) {
      const response = await fetch(NPOINT_URL, {
        cache: "no-store",
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    }

    // Fallback to local JSON
    const data = readData();
    return NextResponse.json(data);
  } catch {
    // If npoint fails, try local
    try {
      const data = readData();
      return NextResponse.json(data);
    } catch {
      return NextResponse.json([], { status: 500 });
    }
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

    // If npoint URL exists, post to npoint
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
        const updatedData = [...currentData, newEntry];

        // Update npoint
        const updateResponse = await fetch(NPOINT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (updateResponse.ok) {
          // Also save to local as backup
          writeData(updatedData);
          return NextResponse.json(newEntry, { status: 201 });
        }
      } catch (error) {
        console.error("Npoint error, falling back to local:", error);
      }
    }

    // Fallback to local JSON
    const data = readData();
    data.push(newEntry);
    writeData(data);

    return NextResponse.json(newEntry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }
}

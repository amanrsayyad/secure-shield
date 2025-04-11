import { NextRequest, NextResponse } from "next/server";
import { encrypt, decrypt } from "@/lib/encryption";

// Temporary storage for demo - in production, this would be a database
export let credentials: any[] = [];

// GET: Retrieve all credentials (encrypted)
export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(credentials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve credentials" },
      { status: 500 }
    );
  }
}

// POST: Create a new credential
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, title, masterPassword, ...data } = body;

    if (!type || !title || !masterPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Encrypt the sensitive data
    const encryptedData = encrypt(JSON.stringify(data), masterPassword);

    const newCredential = {
      id: Date.now().toString(),
      type,
      title,
      encryptedData,
      lastModified: new Date().toISOString().split("T")[0],
    };

    credentials.push(newCredential);
    return NextResponse.json(newCredential);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create credential" },
      { status: 500 }
    );
  }
}

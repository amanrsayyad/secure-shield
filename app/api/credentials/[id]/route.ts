import { NextRequest, NextResponse } from "next/server";
import { encrypt, decrypt } from "@/lib/encryption";

// This is accessing the same in-memory store from the main route
// In production, you would use a database
let credentials: any[] = [];
try {
  // Import from parent route (hacky but works for demo)
  credentials = require("../route").credentials;
} catch (error) {
  console.error("Could not import credentials array");
}

// GET: Retrieve a credential by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = new URL(req.url).searchParams;
    const masterPassword = searchParams.get("masterPassword");

    if (!masterPassword) {
      return NextResponse.json(
        { error: "Master password required" },
        { status: 400 }
      );
    }

    const credential = credentials.find((cred) => cred.id === id);

    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    try {
      // Decrypt the sensitive data
      const decryptedData = JSON.parse(
        decrypt(credential.encryptedData, masterPassword)
      );

      return NextResponse.json({
        ...credential,
        ...decryptedData,
        encryptedData: undefined,
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid master password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve credential" },
      { status: 500 }
    );
  }
}

// PUT: Update a credential
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { type, title, masterPassword, ...data } = body;

    if (!type || !title || !masterPassword) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const index = credentials.findIndex((cred) => cred.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    // Encrypt the updated data
    const encryptedData = encrypt(JSON.stringify(data), masterPassword);

    credentials[index] = {
      ...credentials[index],
      type,
      title,
      encryptedData,
      lastModified: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json(credentials[index]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update credential" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a credential
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const index = credentials.findIndex((cred) => cred.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    credentials.splice(index, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete credential" },
      { status: 500 }
    );
  }
}

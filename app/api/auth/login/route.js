import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongo";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("secure-shield");
    const usersCollection = db.collection("users");

    // Find user by email
    const user = await usersCollection.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Remove password from user object and convert ObjectId to string
    const userWithoutPassword = {
      _id: user._id.toString(), // Convert MongoDB ObjectId to string
      name: user.name,
      email: user.email,
      // Add other user fields as needed
    };

    // Return user information
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (serverError) {
    console.error("Login error:", serverError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

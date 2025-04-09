import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    // Get the auth cookie from the request
    const cookies = request.cookies;
    const authCookie = cookies.get("auth");

    if (!authCookie || !authCookie.value) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Decode the base64 encoded user data
    const encodedUserData = authCookie.value;
    let userData;
    try {
      // Use Buffer for server-side base64 decoding
      const decodedUserData = Buffer.from(encodedUserData, "base64").toString(
        "utf-8"
      );
      userData = JSON.parse(decodedUserData);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid authentication data" },
        { status: 401 }
      );
    }

    // If we have an ID, fetch the latest user data from the database
    if (userData && userData._id) {
      try {
        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db("secure-shield");
        const usersCollection = db.collection("users");

        // Convert string ID to ObjectId if needed
        const userId =
          typeof userData._id === "string" && userData._id.length === 24
            ? new ObjectId(userData._id)
            : userData._id;

        // Find user by ID
        const user = await usersCollection.findOne(
          { _id: userId },
          { projection: { password: 0 } } // Exclude password
        );

        if (user) {
          return NextResponse.json({
            success: true,
            user: {
              _id: user._id.toString(), // Convert ObjectId to string
              name: user.name,
              email: user.email,
              // Include avatar URL or provide a default
              avatar:
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=random`,
            },
          });
        }
      } catch (err) {
        console.error("Database error:", err);
        // Fall through to use cookie data if database lookup fails
      }
    }

    // If we don't have an ID, can't find the user in the database, or there was an error
    // return the data from the cookie
    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        // Generate avatar URL if not present
        avatar:
          userData.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userData.name
          )}&background=random`,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

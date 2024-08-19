import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import axios from "axios";
import { Session } from "next-auth";

export async function GET() {
  const session: (Session & { accessToken: string }) | null =
    await getServerSession(authOptions);

  console.log("Session:", session); // Log the entire session object

  if (!session) {
    console.log("No session found");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!session.accessToken) {
    console.log("No access token found in session");
    return NextResponse.json({ error: "No access token" }, { status: 401 });
  }

  try {
    console.log(
      "Attempting to fetch playlists with token:",
      session.accessToken
    );
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    console.log("Playlists fetched successfully");
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching playlists:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Error fetching playlists" },
      { status: error.response?.status || 500 }
    );
  }
}

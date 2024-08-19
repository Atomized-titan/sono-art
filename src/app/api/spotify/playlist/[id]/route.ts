import { NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";

const spotifyBaseUrl = "https://api.spotify.com/v1";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session: (Session & { accessToken: string }) | null =
    await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  try {
    const response = await axios.get(
      `${spotifyBaseUrl}/playlists/${params.id}`,
      {
        params: {
          fields:
            "id,name,tracks.items(track(id,name,artists,album,duration_ms))",
        },
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      }
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching playlist:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Error fetching playlist" },
      { status: error.response?.status || 500 }
    );
  }
}

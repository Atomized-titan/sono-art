import { NextResponse } from "next/server";
import { getTrack } from "@/lib/spotify";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("API route called with ID:", params.id); // Debug log

  if (!params.id) {
    console.error("No track ID provided");
    return NextResponse.json(
      { error: "Track ID is required" },
      { status: 400 }
    );
  }

  try {
    const track = await getTrack(params.id);
    console.log("Track fetched successfully:", track.name); // Debug log
    return NextResponse.json(track);
  } catch (error) {
    console.error("Failed to fetch track:", error);
    return NextResponse.json(
      { error: "Failed to fetch track" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getAlbum } from "@/lib/spotify";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("Album API route called with ID:", params.id);

  if (!params.id) {
    console.error("No album ID provided");
    return NextResponse.json(
      { error: "Album ID is required" },
      { status: 400 }
    );
  }

  try {
    const album = await getAlbum(params.id);
    console.log("Album fetched successfully:", album.name);
    return NextResponse.json(album);
  } catch (error) {
    console.error("Failed to fetch album:", error);
    return NextResponse.json(
      { error: "Failed to fetch album" },
      { status: 500 }
    );
  }
}

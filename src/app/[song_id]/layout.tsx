import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getTrack } from "@/lib/spotify"; // Adjust the import path as needed

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: { song_id: string };
}): Promise<Metadata> {
  const song_id = params.song_id;
  console.log(`Generating metadata for song_id: ${song_id}`);

  // Default metadata
  let metadata: Metadata = {
    title: {
      default: "Song Details | Sonolise",
      template: "%s | Sonolise",
    },
    description:
      "Explore and visualize song details with Sonolise. Transform your favorite tracks into stunning visual representations.",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Sonolise",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sonolise",
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  // Fetch song data
  try {
    console.log(`Fetching data for song_id: ${song_id}`);
    const songData = await getTrack(song_id);
    console.log("Fetched song data:", songData);

    // Update metadata with song-specific information
    metadata = {
      ...metadata,
      title: `${songData.name} by ${songData.artists
        .map((a: any) => a.name)
        .join(", ")} | Sonolise`,
      description: `Explore the visual representation of "${
        songData.name
      }" by ${songData.artists
        .map((a: any) => a.name)
        .join(", ")} on Sonolise.`,
      openGraph: {
        ...metadata.openGraph,
        title: `${songData.name} - Song Visualization`,
        description: `Check out the visual representation of "${songData.name}" on Sonolise`,
        images: [{ url: songData.album.images[0].url }],
      },
      twitter: {
        ...metadata.twitter,
        title: `${songData.name} - Song Visualization`,
        description: `Check out the visual representation of "${songData.name}" on Sonolise`,
        images: [songData.album.images[0].url],
      },
    };
  } catch (error) {
    console.error("Failed to fetch song data for metadata:", error);
    // In case of error, we'll use the default metadata
  }

  console.log("Final metadata:", metadata);
  return metadata;
}

export default function SongLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-100 to-white`}
    >
      <main>{children}</main>
    </div>
  );
}

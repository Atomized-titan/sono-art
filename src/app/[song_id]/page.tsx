"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { LoadingDots } from "@/components/loading-dots";
import ColorThief from "colorthief";

interface Track {
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
    release_date: string;
    total_tracks: number;
    id: string;
  };
  duration_ms: number;
  uri: string;
}

interface AlbumTrack {
  name: string;
  duration_ms: number;
}

interface Album {
  name: string;
  tracks: {
    items: AlbumTrack[];
  };
  label: string;
}
function ColorPicker({ imageUrl }: { imageUrl: string }) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 5);
      if (palette) {
        setColors(
          palette.map((color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
        );
      }
    };
  }, [imageUrl]);

  return (
    <div className="flex space-x-2 mt-4">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full print:border print:border-gray-300"
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  );
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
}

function SpotifyCode({ uri, size = 300 }: { uri: string; size?: number }) {
  const backgroundColor = "ffffff"; // white background
  const codeColor = "black"; // black code
  const format = "png";

  const url = `https://scannables.scdn.co/uri/plain/${format}/${backgroundColor}/${codeColor}/${size}/${uri}`;

  return (
    <div className="">
      <Image
        src={url}
        alt="Spotify Code"
        width={size}
        height={size / 4} // Spotify Codes are typically 4:1 ratio
        layout="responsive"
      />
    </div>
  );
}

export default function SongPage() {
  const params = useParams();
  const song_id = Array.isArray(params.song_id)
    ? params.song_id[0]
    : params.song_id;
  const [track, setTrack] = useState<Track | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (typeof song_id !== "string") {
        console.error("Invalid song_id:", song_id);
        setError("Invalid song ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const trackResponse = await fetch(`/api/track/${song_id}`);
        if (!trackResponse.ok) {
          throw new Error(`HTTP error! status: ${trackResponse.status}`);
        }
        const trackData = await trackResponse.json();
        setTrack(trackData);

        const albumResponse = await fetch(`/api/album/${trackData.album.id}`);
        if (!albumResponse.ok) {
          throw new Error(`HTTP error! status: ${albumResponse.status}`);
        }
        const albumData = await albumResponse.json();
        setAlbum(albumData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [song_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <LoadingDots />
      </div>
    );
  }

  if (error || !track || !album) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-black text-2xl">{error || "Data not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 font-sans">
      <div className="max-w-[40rem] w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingTop: "90%" }}>
          <Image
            src={track.album.images[0].url}
            alt={`${track.album.name} album cover`}
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4 text-xs uppercase tracking-wide">
            <div>
              <p className="text-gray-500">RELEASE DATE</p>
              <p className="font-semibold">
                {new Date(track.album.release_date).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">ALBUM LENGTH</p>
              <p className="font-semibold">
                {formatDuration(
                  album.tracks.items.reduce(
                    (total, track) => total + track.duration_ms,
                    0
                  )
                )}
              </p>
            </div>
            {/* <div>
              <p className="text-gray-500">TRACKS</p>
              <p className="font-semibold">{track.album.total_tracks}</p>
            </div> */}
            <div>
              <p className="text-gray-500">LABEL</p>
              <p className="font-semibold">{album.label}</p>
            </div>
            <ColorPicker imageUrl={track.album.images[0].url} />
          </div>
          <div className="w-full h-[2px] bg-gray-200 mb-4" />
          <div className="grid grid-cols-4 gap-2 mb-4">
            {album.tracks.items.map((albumTrack, index) => (
              <p key={index} className="text-[12px] uppercase rounded">
                {albumTrack.name}
              </p>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-end">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-1">{album.name}</h2>
              <p className="text-xl text-gray-700">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
            <div className="flex items-end space-x-4">
              <SpotifyCode uri={track.uri} size={400} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    images: { url: string }[];
    release_date: string;
  };
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
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  );
}

function Audiograph() {
  return (
    <div className="flex items-end space-x-[2px] h-8 w-24">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-[2px] bg-gray-400"
          style={{ height: `${Math.random() * 100}%` }}
        ></div>
      ))}
    </div>
  );
}

export default function SongPage() {
  const params = useParams();
  const song_id = Array.isArray(params.song_id)
    ? params.song_id[0]
    : params.song_id;
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrack() {
      if (typeof song_id !== "string") {
        console.error("Invalid song_id:", song_id);
        setError("Invalid song ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      console.log("Fetching track with ID:", song_id); // Debug log

      try {
        const response = await fetch(`/api/track/${song_id}`);
        console.log("API response status:", response.status); // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const trackData = await response.json();
        console.log("Received track data:", trackData); // Debug log
        setTrack(trackData);
      } catch (error) {
        console.error("Failed to fetch track:", error);
        setError("Failed to load track data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrack();
  }, [song_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <LoadingDots />
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-black text-2xl">{error || "Track not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8 font-sans">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <Image
          src={track.album.images[0].url}
          alt={`${track.name} album cover`}
          width={600}
          height={600}
          layout="responsive"
          objectFit="cover"
        />
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
              <p className="font-semibold">74:22</p>
            </div>
            <div>
              <p className="text-gray-500">LABEL</p>
              <p className="font-semibold">BPG, RVG, RCA</p>
            </div>
            <ColorPicker imageUrl={track.album.images[0].url} />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              "THE BEAUTIFUL & DAMNED",
              "LEGEND",
              "GOTDAMN",
              "PRAY FOR ME",
              "HIM & I",
              "NO LESS",
              "BUT A DREAM",
              "THE PLAN",
              "LEVIATHAN",
              "SOBER",
              "THATS A LOT",
              "PICK ME UP",
              "SUMMER IN DECEMBER",
              "CHARLES BROWN",
              "EAZY",
              "LOVE IS GONE",
            ].map((song, index) => (
              <p key={index} className="text-xs bg-gray-100 p-1 rounded">
                {song}
              </p>
            ))}
          </div>
          <h2 className="text-3xl font-bold mb-2">{track.name}</h2>
          <p className="text-xl text-gray-700 mb-4">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
          <div className="mt-4 flex justify-between items-end">
            <Image
              src="/spotify-logo.png"
              alt="Spotify Logo"
              width={100}
              height={30}
            />
            <Audiograph />
          </div>
        </div>
      </div>
    </div>
  );
}

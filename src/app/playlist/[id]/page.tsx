"use client";

import LoadingDots from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import { Track } from "@/types";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlaylistPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [songs, setSongs] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistSongs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/spotify/playlist/${params.id}`);
        setSongs(response.data.tracks.items.map((item: any) => item.track));
        setPlaylistName(response.data.name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching playlist songs:", error);
        setError("Failed to load playlist. It might be private or not exist.");
        setLoading(false);
      }
    };

    fetchPlaylistSongs();
  }, [params.id]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  if (loading) {
    return <LoadingDots />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-xl text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">{playlistName}</h1>
      <div className="grid gap-4">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            whileHover={{ scale: 1.02 }}
            className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="mr-4">
                <img
                  src={song.album.images[0]?.url}
                  alt=""
                  className="h-12 w-12"
                />
              </div>
              <div>
                <h3 className="font-semibold">{song.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {song.artists.map((artist) => artist.name).join(", ")} •{" "}
                  {song.album.name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-muted-foreground">
                {formatDuration(song.duration_ms)}
              </span>
              <Button onClick={() => router.push(`/frame/${song.id}`)}>
                View
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

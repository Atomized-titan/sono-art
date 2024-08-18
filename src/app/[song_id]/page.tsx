"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Disc, Edit, Music, X } from "lucide-react";
import ColorThief from "colorthief";

import EditPanel from "@/components/EditPanel";
import { LoadingDots } from "@/components/loading-dots";
import ShareComponent from "@/components/social-share";
import { Button } from "@/components/ui/button";

export interface Track {
  name: string;
  explicit: boolean;
  popularity: number;
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
  preview_url: string | null;
}

export interface AlbumTrack {
  name: string;
  duration_ms: number;
}

export interface Album {
  name: string;
  tracks: {
    items: AlbumTrack[];
  };
  label: string;
}

function ColorPicker({
  imageUrl,
  numColors,
}: {
  imageUrl: string;
  numColors: number;
}) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, numColors);
      if (palette) {
        setColors(
          palette.map((color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
        );
      }
    };
  }, [imageUrl, numColors]);

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
  const backgroundColor = "ffffff";
  const codeColor = "black";
  const format = "png";

  const url = `https://scannables.scdn.co/uri/plain/${format}/${backgroundColor}/${codeColor}/${size}/${uri}`;

  return (
    <img
      src={url}
      alt="Spotify Code"
      width={size}
      height={size / 4}
      className=""
    />
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

  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editOptions, setEditOptions] = useState({
    showPalette: true,
    numColors: 5,
    showReleaseDate: true,
    showAlbumLength: true,
    showLabel: true,
    showTracks: true,
    numTracksToShow: 6,
    imageSize: "large" as "small" | "medium" | "large",
    showArtists: true,
    showPopularity: false,
    backgroundStyle: "plain" as "plain" | "gradient" | "blur" | "animated",
    fontStyle: "modern" as "modern" | "classic" | "playful",
    showSpotifyCode: true,
    spotifyCodeSize: 300,
    showExplicitLabel: true,
  });

  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  useEffect(() => {
    if (track) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = track.album.images[0].url;
      img.onload = () => {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setDominantColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      };

      if (track.preview_url) {
        audioRef.current = new Audio(track.preview_url);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [track]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getImageSize = () => {
    switch (editOptions.imageSize) {
      case "small":
        return "w-64";
      case "medium":
        return "w-80";
      case "large":
        return "w-full max-w-[40rem]";
      default:
        return "w-80";
    }
  };

  const getBackgroundStyle: () => React.CSSProperties | undefined = () => {
    switch (editOptions.backgroundStyle) {
      case "gradient":
        return {
          background: `linear-gradient(to bottom right, ${dominantColor}, black)`,
        };
      case "blur":
        return {
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        };
      // case "animated":
      //   return "bg-gradient-to-r from-purple-500 to-pink-500 animate-gradient-x"; // Use Tailwind class if predefined
      default:
        return { backgroundColor: "white" };
    }
  };

  const getFontStyle = () => {
    switch (editOptions.fontStyle) {
      case "classic":
        return "font-serif";
      case "playful":
        return "font-comic";
      default:
        return "font-sans";
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <LoadingDots className="flex items-center justify-center h-screen bg-white" />
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
    <div
      className={`flex min-h-screen p-4 sm:p-8 ${getFontStyle()}`}
      style={getBackgroundStyle()}
    >
      <motion.div
        className="fixed top-4 left-4 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button onClick={() => setShowEditPanel(!showEditPanel)}>
          <Edit className="mr-2 h-4 w-4" /> {showEditPanel ? "Close" : "Edit"}
        </Button>
      </motion.div>

      <div className="flex w-full justify-center">
        <AnimatePresence>
          {showEditPanel && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-lg z-20 overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Edit Display</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <EditPanel
                onUpdate={setEditOptions}
                initialValues={editOptions}
                track={track}
                album={album}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={contentRef}
          className="max-w-[40rem] w-full bg-white shadow-lg rounded-lg overflow-hidden p-2"
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ marginLeft: showEditPanel ? "320px" : "0" }}
        >
          <div className={`${getImageSize()} mx-auto relative group`}>
            <img
              src={track.album.images[0].url}
              alt={`${track.album.name} album cover`}
              loading="lazy"
              className="rounded-lg w-full h-auto object-cover"
            />
            {track.preview_url && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white text-black"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Disc className="h-6 w-6 animate-spin" />
                  ) : (
                    <Music className="h-6 w-6" />
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap justify-between items-start sm:items-center mb-4 text-xs uppercase tracking-wide">
              {editOptions.showReleaseDate && (
                <div className="mb-2 sm:mb-0 mr-4">
                  <p className="text-gray-500">RELEASE DATE</p>
                  <p className="font-semibold">
                    {new Date(track.album.release_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
              {editOptions.showAlbumLength && (
                <div className="mb-2 sm:mb-0 mr-4">
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
              )}
              {editOptions.showLabel && (
                <div className="mb-2 sm:mb-0 mr-4">
                  <p className="text-gray-500">LABEL</p>
                  <p className="font-semibold">{album.label}</p>
                </div>
              )}
              {editOptions.showPopularity && (
                <div className="mb-2 sm:mb-0 mr-4">
                  <p className="text-gray-500">POPULARITY</p>
                  <p className="font-semibold">{track.popularity}%</p>
                </div>
              )}
            </div>

            {editOptions.showPalette && (
              <div className="mt-2 mb-4">
                <ColorPicker
                  imageUrl={track.album.images[0].url}
                  numColors={editOptions.numColors}
                />
              </div>
            )}

            <div className="w-full h-[2px] bg-gray-200 my-4" />

            {editOptions.showTracks && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {album.tracks.items
                  .slice(0, editOptions.numTracksToShow)
                  .map((albumTrack, index) => (
                    <p
                      key={index}
                      className="text-[10px] sm:text-[16px] uppercase rounded"
                    >
                      {albumTrack.name}
                    </p>
                  ))}
              </div>
            )}

            <div className="mt-8 flex justify-between w-full items-start">
              <div className="w-full">
                <h2 className="text-xl font-bold leading-tight">
                  {album.name}
                </h2>
                {editOptions.showArtists && (
                  <p className="text-sm text-gray-700 leading-tight">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                )}
                {editOptions.showExplicitLabel && track.explicit && (
                  <span className="inline-block bg-gray-200 text-gray-800 text-xs font-bold uppercase px-2 py-1 rounded mt-2">
                    Explicit
                  </span>
                )}
              </div>
              {editOptions.showSpotifyCode && (
                <div className="w-full flex justify-end items-end">
                  <div className="w-44">
                    <SpotifyCode
                      uri={track.uri}
                      size={editOptions.spotifyCodeSize}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 animate-progress" />
          )}
        </motion.div>
      </div>
      <div className="fixed bottom-4 right-4 print:opacity-0">
        <ShareComponent contentRef={contentRef} track={track} />
      </div>
    </div>
  );
}

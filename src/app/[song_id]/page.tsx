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
import { Album, Track } from "@/types";
import { AlbumCover } from "@/components/album-components/album-cover";
import { AlbumInfo } from "@/components/album-components/album-info";

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
        <Button
          onClick={() => setShowEditPanel(!showEditPanel)}
          className="print:hidden"
        >
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
          <AlbumCover
            track={track}
            imageSize={editOptions.imageSize}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
          <AlbumInfo track={track} album={album} editOptions={editOptions} />
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

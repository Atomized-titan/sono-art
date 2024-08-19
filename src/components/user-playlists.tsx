"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const UserPlaylists = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPlaylists();
    }
  }, [status]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get("/api/spotify/user-playlists");
      setPlaylists(response.data.items);
    } catch (error: any) {
      console.error("Error fetching playlists:", error);
      setError(error.response?.data?.error || "Failed to fetch playlists");
    }
  };

  if (status === "loading") return <LoadingState />;
  if (status === "unauthenticated") return <UnauthenticatedState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {playlists.map((playlist: any) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onClick={() => router.push(`/playlist/${playlist.id}`)}
        />
      ))}
    </div>
  );
};

const PlaylistCard = ({
  playlist,
  onClick,
}: {
  playlist: any;
  onClick: () => void;
}) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
    onClick={onClick}
  >
    <div className="relative pb-[100%]">
      {playlist.images?.[0] ? (
        <img
          src={playlist.images[0].url}
          alt={playlist.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Music className="w-12 h-12 text-gray-400" />
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1 truncate">{playlist.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {playlist.tracks.total} tracks
      </p>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const UnauthenticatedState = () => (
  <div className="text-center p-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
    <p className="mb-4">
      Sign in with your Spotify account to view your playlists.
    </p>
    <Button onClick={() => signIn("spotify")}>Sign in with Spotify</Button>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="text-center p-8 bg-red-100 dark:bg-red-900 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">Error</h2>
    <p>{error}</p>
    <Button onClick={() => window.location.reload()} className="mt-4">
      Try Again
    </Button>
  </div>
);

export default UserPlaylists;

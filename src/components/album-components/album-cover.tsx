import { Button } from "@/components/ui/button";
import { Track } from "@/types";
import { Disc, Music } from "lucide-react";

interface AlbumCoverProps {
  track: Track;
  imageSize: string;
  isPlaying: boolean;
  togglePlay: () => void;
}

export function AlbumCover({
  track,
  imageSize,
  isPlaying,
  togglePlay,
}: AlbumCoverProps) {
  const getImageSizeClass = () => {
    switch (imageSize) {
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

  return (
    <div className={`${getImageSizeClass()} mx-auto relative group`}>
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
  );
}

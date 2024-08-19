import { formatDuration } from "@/lib/utils";
import { Track, Album, EditOptions } from "@/types";
import { ColorPicker } from "./color-picker";
import { SpotifyCode } from "./spotify-code";

interface AlbumInfoProps {
  track: Track;
  album: Album;
  editOptions: EditOptions;
}

export function AlbumInfo({ track, album, editOptions }: AlbumInfoProps) {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-wrap justify-between items-start sm:items-center mb-4 text-xs uppercase tracking-wide">
        {editOptions.showReleaseDate && (
          <div className="mb-2 sm:mb-0 mr-4">
            <p className="text-gray-500">RELEASE DATE</p>
            <p className="font-semibold">
              {new Date(track.album.release_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
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

      <div className="mt-8 flex flex-col sm:flex-row justify-between w-full items-start sm:items-center">
        <div className="w-full mb-4 sm:mb-0">
          <h2 className="text-xl font-bold leading-tight">{album.name}</h2>
          {editOptions.showArtists && (
            <p className="text-sm text-gray-700 leading-tight mt-1">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          )}
          {editOptions.showExplicitLabel && track.explicit && (
            <span className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold uppercase px-2 py-1 rounded mt-2 transition-all duration-300 hover:bg-gray-300">
              Explicit
            </span>
          )}
        </div>
        {editOptions.showSpotifyCode && (
          <div className="w-full sm:w-auto flex justify-start sm:justify-end items-start sm:items-end">
            <div className="w-44">
              <SpotifyCode uri={track.uri} size={editOptions.spotifyCodeSize} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

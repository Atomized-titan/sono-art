export interface Track {
  id: string;
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

export interface EditOptions {
  showPalette: boolean;
  numColors: number;
  showReleaseDate: boolean;
  showAlbumLength: boolean;
  showLabel: boolean;
  showTracks: boolean;
  numTracksToShow: number;
  imageSize: "small" | "medium" | "large";
  showArtists: boolean;
  showPopularity: boolean;
  backgroundStyle: "plain" | "gradient" | "blur" | "animated";
  fontStyle: "modern" | "classic" | "playful";
  showSpotifyCode: boolean;
  spotifyCodeSize: number;
  showExplicitLabel: boolean;
}

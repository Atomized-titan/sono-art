import axios from "axios";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_ACCOUNTS_BASE = "https://accounts.spotify.com/api";

let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

async function getClientCredentialsToken() {
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Spotify client credentials are not set in the environment variables."
    );
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios.post(
      `${SPOTIFY_ACCOUNTS_BASE}/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}

export async function searchTracks(query: string) {
  try {
    const token = await getClientCredentialsToken();
    const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
      params: {
        q: query,
        type: "track",
        limit: 10,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.tracks.items;
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw error;
  }
}

export async function getTrack(trackId: string) {
  try {
    console.log("Fetching track with ID:", trackId); // Debug log
    const token = await getClientCredentialsToken();
    const response = await axios.get(`${SPOTIFY_API_BASE}/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Track fetched successfully"); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error getting track:", error);
    throw error;
  }
}

export async function getAlbum(albumId: string) {
  try {
    const token = await getClientCredentialsToken();
    const response = await axios.get(`${SPOTIFY_API_BASE}/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting album:", error);
    throw error;
  }
}

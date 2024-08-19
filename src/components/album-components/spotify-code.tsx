export function SpotifyCode({
  uri,
  size = 300,
}: {
  uri: string;
  size?: number;
}) {
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

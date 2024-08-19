import { Track } from "@/types";
import html2canvas from "html2canvas";

const captureImage = async (contentRef: React.RefObject<HTMLDivElement>) => {
  if (contentRef.current) {
    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });
    return canvas.toDataURL("image/png");
  }
};

const handleShare = async (
  contentRef: React.RefObject<HTMLDivElement>,
  track: Track
) => {
  const imageDataUrl = await captureImage(contentRef);
  if (imageDataUrl && track) {
    if (navigator.share) {
      try {
        const blob = await (await fetch(imageDataUrl)).blob();
        const file = new File(
          [blob],
          `${track.name.replace(/\s+/g, "_")}_${track.artists[0].name.replace(
            /\s+/g,
            "_"
          )}.png`,
          { type: "image/png" }
        );
        await navigator.share({
          title: `${track.name} by ${track.artists
            .map((a) => a.name)
            .join(", ")}`,
          text: "Check out this album art!",
          files: [file],
        });
      } catch (error) {
        console.error("Error sharing:", error);
        fallbackDownload(imageDataUrl, track);
      }
    } else {
      fallbackDownload(imageDataUrl, track);
    }
  }
};

const handleDownload = async (
  contentRef: React.RefObject<HTMLDivElement>,
  track: Track
) => {
  const imageDataUrl = await captureImage(contentRef);
  if (imageDataUrl && track) {
    fallbackDownload(imageDataUrl, track);
  }
};

const fallbackDownload = (imageDataUrl: string, track: Track) => {
  const link = document.createElement("a");
  link.href = imageDataUrl;
  link.download = `${track.name.replace(
    /\s+/g,
    "_"
  )}_${track.artists[0].name.replace(/\s+/g, "_")}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { handleShare, handleDownload };

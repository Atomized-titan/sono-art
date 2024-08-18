import React, { useState } from "react";
import { Instagram, Link, Share, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import html2canvas from "html2canvas";

interface ShareComponentProps {
  contentRef: React.RefObject<HTMLDivElement>;
  track: {
    name: string;
    artists: { name: string }[];
  };
}

const ShareComponent: React.FC<ShareComponentProps> = ({
  contentRef,
  track,
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const captureImage = async (targetWidth?: number, targetHeight?: number) => {
    if (contentRef.current) {
      const element = contentRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      if (!targetWidth || !targetHeight) {
        return canvas.toDataURL("image/png");
      }

      const targetCanvas = document.createElement("canvas");
      targetCanvas.width = targetWidth;
      targetCanvas.height = targetHeight;
      const ctx = targetCanvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const scale = Math.min(
          targetWidth / canvas.width,
          targetHeight / canvas.height
        );
        const x = (targetWidth - canvas.width * scale) / 2;
        const y = (targetHeight - canvas.height * scale) / 2;

        ctx.drawImage(
          canvas,
          x,
          y,
          canvas.width * scale,
          canvas.height * scale
        );
      }

      return targetCanvas.toDataURL("image/png");
    }
  };

  const copyLinkToClipboard = async () => {
    const url = window.location.href;
    setCopiedLink(false);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // For HTTPS sites
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
      } else {
        // Fallback for HTTP sites
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
          setCopiedLink(true);
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }

    // Reset copied state after 2 seconds
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async (platform: string) => {
    if (platform === "copy") {
      await copyLinkToClipboard();
      return;
    }
    setIsSharing(true);
    let imageDataUrl;
    try {
      switch (platform) {
        case "instagram":
          imageDataUrl = await captureImage(1080, 1920);
          break;
        case "download":
          imageDataUrl = await captureImage();
          break;
        default:
          imageDataUrl = await captureImage(1200, 630);
      }

      if (imageDataUrl) {
        const blob = await (await fetch(imageDataUrl)).blob();
        const file = new File(
          [blob],
          `${track.name.replace(/\s+/g, "_")}_${track.artists[0].name.replace(
            /\s+/g,
            "_"
          )}.png`,
          { type: "image/png" }
        );

        switch (platform) {
          case "instagram":
            if (navigator.share) {
              await navigator.share({
                files: [file],
                title: `${track.name} by ${track.artists
                  .map((a) => a.name)
                  .join(", ")}`,
                text: "Check out this track!",
              });
            } else {
              alert(
                "Image captured for Instagram. Please save and upload manually to Instagram."
              );
              // Fallback to download
              await downloadImage(imageDataUrl, file.name);
            }
            break;
          case "copy":
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
            break;
          case "download":
            await downloadImage(imageDataUrl, file.name);
            break;
        }
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("There was an error sharing. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const downloadImage = async (dataUrl: string, fileName: string) => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], fileName, { type: "image/png" });
        await navigator.share({
          files: [file],
          title: `${track.name} by ${track.artists
            .map((a) => a.name)
            .join(", ")}`,
          text: "Check out this track!",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to traditional download
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      // Traditional download for unsupported browsers
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="space-x-2 print:hidden">
          <Share className="h-4 w-4" />
          <span className="">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="grid gap-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleShare("instagram")}
            disabled={isSharing}
          >
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleShare("copy")}
            disabled={isSharing}
          >
            {copiedLink ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Link className="mr-2 h-4 w-4" />
            )}
            {copiedLink ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => handleShare("download")}
            disabled={isSharing}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareComponent;

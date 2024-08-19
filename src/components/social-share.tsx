import React, { useState, useEffect } from "react";
import {
  Share,
  Download,
  Check,
  Link,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (showShareDialog) {
      captureImage();
    }
  }, [showShareDialog]);

  const captureImage = async () => {
    if (contentRef.current) {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      setPreviewImage(canvas.toDataURL("image/png"));
    }
  };

  const copyLinkToClipboard = async () => {
    setCopiedLink(false);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback method for unsupported browsers (mainly older mobile browsers)
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      alert("Failed to copy link. Please try again.");
    }
  };

  const handleShare = async (platform: string) => {
    setIsSharing(true);
    try {
      const title = `${track.name} by ${track.artists
        .map((a) => a.name)
        .join(", ")}`;
      const text = "Check out this track on Sonolise!";
      let imageUrl = previewImage;

      switch (platform) {
        case "instagram":
          if (navigator.canShare() && imageUrl) {
            // Share to Instagram Story via the native share feature
            await navigator.share({
              title,
              text,
              files: [
                new File([imageUrl], `${track.name}.png`, {
                  type: "image/png",
                }),
              ],
            });
          } else if (imageUrl) {
            // Instagram Story share fallback with URL scheme
            window.open(
              `https://www.instagram.com/stories/share?backgroundImageUrl=${encodeURIComponent(
                imageUrl
              )}`,
              "_blank"
            );
          }
          break;

        case "twitter":
        case "facebook":
        case "linkedin":
          if (navigator.share) {
            await navigator.share({ title, text, url: shareUrl });
          } else {
            window.open(getShareUrl(platform, title, shareUrl), "_blank");
          }
          break;

        case "download":
          if (previewImage) {
            const link = document.createElement("a");
            link.href = previewImage;
            link.download = `${track.name.replace(/\s+/g, "_")}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          break;
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert("There was an error sharing. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const getShareUrl = (platform: string, title: string, url: string) => {
    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
      case "linkedin":
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}`;
      default:
        return url;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowShareDialog(true)}
        className="space-x-2 print:hidden"
      >
        <Share className="h-4 w-4" />
        <span>Share</span>
      </Button>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Share This Track</DialogTitle>
            <DialogDescription>
              Choose a platform to share or copy the link
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {previewImage && (
              <div className="border rounded-md p-2 overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-auto max-h-[200px] object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {["instagram", "twitter", "facebook", "linkedin"].map(
                (platform) => (
                  <Button
                    key={platform}
                    variant="outline"
                    className="p-2 h-auto aspect-square"
                    onClick={() => handleShare(platform)}
                    disabled={isSharing}
                  >
                    {platform === "instagram" && (
                      <Instagram className="h-5 w-5" />
                    )}
                    {platform === "twitter" && <Twitter className="h-5 w-5" />}
                    {platform === "facebook" && (
                      <Facebook className="h-5 w-5" />
                    )}
                    {platform === "linkedin" && (
                      <Linkedin className="h-5 w-5" />
                    )}
                  </Button>
                )
              )}
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Input value={shareUrl} readOnly className="flex-grow" />
              <Button
                onClick={copyLinkToClipboard}
                disabled={copiedLink}
                className="w-full sm:w-auto"
              >
                {copiedLink ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                {copiedLink ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Button onClick={() => handleShare("download")} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareComponent;

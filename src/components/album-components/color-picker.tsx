import ColorThief from "colorthief";
import { useEffect, useState } from "react";

export function ColorPicker({
  imageUrl,
  numColors,
}: {
  imageUrl: string;
  numColors: number;
}) {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const img = document.createElement("img");
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, numColors);
      if (palette) {
        setColors(
          palette.map((color) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`)
        );
      }
    };
  }, [imageUrl, numColors]);

  return (
    <div className="flex space-x-2 mt-4">
      {colors.map((color, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full print:border print:border-gray-300"
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  );
}

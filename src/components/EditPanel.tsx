import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const editSchema = z.object({
  showPalette: z.boolean(),
  numColors: z.number().min(2).max(20),
  showReleaseDate: z.boolean(),
  showAlbumLength: z.boolean(),
  showLabel: z.boolean(),
  showTracks: z.boolean(),
  numTracksToShow: z.number().min(1).max(20),
  imageSize: z.enum(["small", "medium", "large"]),
  showArtists: z.boolean(),
  showPopularity: z.boolean(),
  backgroundStyle: z.enum(["plain", "gradient", "blur"]),
  fontStyle: z.enum(["modern", "classic", "playful"]),
  showSpotifyCode: z.boolean(),
  spotifyCodeSize: z.number().min(100).max(1000),
  showExplicitLabel: z.boolean(),
});

type EditFormValues = z.infer<typeof editSchema>;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const EditPanel = ({
  onUpdate,
  initialValues,
  track,
  album,
}: {
  onUpdate: (data: EditFormValues) => void;
  initialValues: EditFormValues;
  track: any;
  album: any;
}) => {
  const { control, watch } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: initialValues,
  });

  const watchedValues = watch();
  const debouncedValues = useDebounce(watchedValues, 300);

  useEffect(() => {
    onUpdate(debouncedValues);
  }, [debouncedValues, onUpdate]);

  return (
    <form className="space-y-6 p-6 bg-gray-100 rounded-lg overflow-y-auto max-h-[80vh]">
      {/* <h2 className="text-lg font-semibold">Edit Display Options</h2> */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="showPalette">Show Color Palette</Label>
          <Controller
            name="showPalette"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="showPalette"
              />
            )}
          />
        </div>

        {watchedValues.showPalette && (
          <div className="space-y-2">
            <Label htmlFor="numColors">
              Number of Colors: {watchedValues.numColors}
            </Label>
            <Controller
              name="numColors"
              control={control}
              render={({ field }) => (
                <Slider
                  min={2}
                  max={20}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  id="numColors"
                />
              )}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Display Options</Label>
          {[
            "showReleaseDate",
            "showAlbumLength",
            "showLabel",
            "showTracks",
            "showArtists",
            "showPopularity",
            "showSpotifyCode",
            "showExplicitLabel",
          ].map((name) => (
            <div key={name} className="flex items-center space-x-2">
              <Controller
                name={name as keyof EditFormValues}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    id={name}
                  />
                )}
              />
              <Label htmlFor={name}>
                {name
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </Label>
            </div>
          ))}
        </div>

        {watchedValues.showTracks && (
          <div className="space-y-2">
            <Label htmlFor="numTracksToShow">
              Number of Tracks to Show: {watchedValues.numTracksToShow}
            </Label>
            <Controller
              name="numTracksToShow"
              control={control}
              render={({ field }) => (
                <Slider
                  min={1}
                  max={album.tracks.items.length}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  id="numTracksToShow"
                />
              )}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="imageSize">Image Size</Label>
          <Controller
            name="imageSize"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundStyle">Background Style</Label>
          <Controller
            name="backgroundStyle"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select background style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="blur">Blur</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontStyle">Font Style</Label>
          <Controller
            name="fontStyle"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {watchedValues.showSpotifyCode && (
          <div className="space-y-2">
            <Label htmlFor="spotifyCodeSize">
              Spotify Code Size: {watchedValues.spotifyCodeSize}
            </Label>
            <Controller
              name="spotifyCodeSize"
              control={control}
              render={({ field }) => (
                <Slider
                  min={300}
                  max={1000}
                  step={100}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  id="spotifyCodeSize"
                />
              )}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default EditPanel;

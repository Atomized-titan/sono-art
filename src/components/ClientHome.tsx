"use client";

import Link from "next/link";
import { Suspense } from "react";
import SearchComponent from "./Search";
import Navbar from "./navbar";
import Marquee from "./ui/marquee";
import { cn } from "@/lib/utils";
import Meteors from "./ui/meteors";
import Footer from "./ui/footer";

const reviews = [
  {
    name: "Lover",
    artist: "Taylor Swift",
    song_id: "1BxfuPKGuaTgP7aM0Bbdwr",
    img: "/showcase/taylor.png",
  },
  {
    name: "American Idiot",
    artist: "Green Day",
    song_id: "3ZffCQKLFLUvYM59XKLbVm",
    img: "/showcase/greenday.png",
  },
  {
    name: "Mamushi",
    artist: "Megan Thee Stallion, 千葉雄喜",
    song_id: "5b3XJ1pjrHO5JtY2PcTjnI",
    img: "/showcase/megan.png",
  },
  {
    name: "How You Like That",
    artist: "BLACKPINK",
    song_id: "4SFknyjLcyTLJFPKD2m96o",
    img: "/showcase/blackpink.png",
  },
  {
    name: "Ride",
    artist: "Twenty One Pilots",
    song_id: "2Z8WuEywRWYTKe1NybPQEW",
    img: "/showcase/twentyonepilots.png",
  },
  {
    name: "Summertime Sadness",
    artist: "Lana Del Rey",
    song_id: "2dBwB667LHQkLhdYlwLUZK",
    img: "/showcase/lana.png",
  },
];

const firstRow = reviews;

const ReviewCard = ({
  img,
  name,
  song_id,
  artist,
}: {
  img: string;
  name: string;
  song_id: string;
  artist: string;
}) => {
  return (
    <Link href={`/${song_id}`}>
      <figure
        className={cn(
          "flex flex-col w-80 h-96 cursor-pointer overflow-hidden rounded-3xl",
          "border border-gray-200 bg-white hover:bg-gray-50",
          "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div className="relative h-3/4 w-full overflow-hidden">
          <img src={img} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-between p-4 h-1/4">
          <div>
            <h3 className="font-bold text-lg leading-tight mb-1">{name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{artist}</p>
          </div>
        </div>
      </figure>
    </Link>
  );
};

export default function ClientHome() {
  return (
    <div className="flex relative flex-col min-h-screen bg-white text-gray-900 overflow-hidden">
      <Meteors number={30} />
      <main className="flex-grow">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchComponent />
          </Suspense>
        </div>
        <div className="container mx-auto px-4 my-24 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-2">Showcase</h2>
          <p className="text-lg text-gray-600 mb-12">
            Here are some of our favorite albums.
          </p>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg">
            <Marquee className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.song_id} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

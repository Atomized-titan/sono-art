"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
const DynamicSearchInput = dynamic(() => import("@/components/SearchInput"), {
  ssr: false,
  loading: () => <div className="h-12 bg-gray-200 rounded animate-pulse"></div>,
});

export default function SearchComponent() {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <>
      <motion.section
        className={`text-center ${
          searchResults.length === 0 ? "mt-32" : "mt-12"
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl font-bold mb-4">Frame Your Favorite Album</h2>
        <p className="text-xl text-gray-600 mb-8">
          Search for albums and transform them into beautiful frames with
          details and Spotify codes.
        </p>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Suspense
            fallback={
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            }
          >
            <DynamicSearchInput setSearchResults={setSearchResults} />
          </Suspense>
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.section
            className="py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((result: any) => (
                <motion.div
                  key={result.album.id}
                  className="overflow-hidden rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/${result.id}`}>
                    <Image
                      src={result.album.images[0].url}
                      alt={result.name}
                      width={400}
                      height={300}
                      className="object-cover w-full h-56"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-lg">{result.name}</h4>
                      <p className="text-gray-500">
                        {result.album.artists
                          .map((artist: any) => artist.name)
                          .join(", ")}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

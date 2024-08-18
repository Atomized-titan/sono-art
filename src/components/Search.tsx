"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    } else {
      setQuery("");
      setSearchResults([]);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const results = await response.json();
      setSearchResults(results);
      router.push(`/?q=${encodeURIComponent(searchQuery)}`, { scroll: false });
    } catch (error) {
      console.error("Search failed:", error);
    }
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

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
        <h2 className="text-5xl font-bold mb-4">Find Your Favorite Album</h2>
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
          <div className="flex space-x-2 p-4 rounded-lg w-2/3 bg-white shadow-lg">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for an album..."
              className="flex-grow bg-transparent text-gray-800 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              onClick={() => handleSearch()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-4 py-2 rounded-r-lg"
            >
              {isSearching ? (
                "Searching..."
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
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

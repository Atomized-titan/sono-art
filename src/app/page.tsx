"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingDots } from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Music, Headphones, Radio } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
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
      // Update the URL with the search query
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <h1 className="text-5xl font-bold text-center mb-4">Sonolise</h1>
        <p className="text-xl text-center text-gray-300 mb-12">
          Transform your favorite songs into stunning visuals
        </p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="flex space-x-2 bg-white/10 p-2 rounded-lg">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for a song..."
              className="flex-grow bg-transparent text-white placeholder-gray-400 border-none focus:ring-0"
            />
            <Button
              onClick={() => handleSearch()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSearching ? (
                <LoadingDots color="white" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-4">Search Results</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((track: any) => (
                  <motion.li
                    key={track.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 p-4 rounded-lg"
                  >
                    <Link
                      href={`/${track.id}`}
                      className="flex items-center space-x-4"
                    >
                      <Image
                        src={track.album.images[0].url}
                        alt={track.name}
                        width={60}
                        height={60}
                        className="rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{track.name}</h3>
                        <p className="text-gray-400">{track.artists[0].name}</p>
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {searchResults.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              Discover the Magic of Sonolise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Music className="h-12 w-12" />}
                title="Visualize Your Music"
                description="Turn your favorite tracks into stunning visual art pieces."
              />
              <FeatureCard
                icon={<Headphones className="h-12 w-12" />}
                title="Enhance Your Experience"
                description="See your music in a whole new way, enhancing your listening experience."
              />
              <FeatureCard
                icon={<Radio className="h-12 w-12" />}
                title="Share Your Vibes"
                description="Create and share unique visuals for your playlists and favorite songs."
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 p-6 rounded-lg text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

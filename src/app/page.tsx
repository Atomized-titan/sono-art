"use client";

import { LoadingDots } from "@/components/loading-dots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Search failed");
      }
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    }
    setIsSearching(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-700 to-indigo-900">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Visurhythm
        </h1>
        <p className="text-xl text-center text-gray-300 mb-8">
          Transform your favorite songs into stunning visuals
        </p>

        <div className="flex space-x-2">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a song..."
            className="flex-grow bg-white/10 text-white placeholder-gray-400 border-white/20"
          />
          <Button
            onClick={handleSearch}
            className="bg-white text-purple-700 hover:bg-gray-200"
          >
            {isSearching ? (
              <LoadingDots />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Search Results
            </h2>
            <ul className="space-y-2">
              {searchResults.map((track: any) => (
                <li key={track.id} className="bg-white/10 p-2 rounded">
                  <Link
                    href={`/${track.id}`}
                    className="text-white hover:underline"
                  >
                    {track.name} - {track.artists[0].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

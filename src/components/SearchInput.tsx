import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput({
  setSearchResults,
}: {
  setSearchResults: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [query, setQuery] = useState("");
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
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-4 rounded-lg bg-white shadow-lg">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search for an album..."
          className="flex-grow bg-transparent text-gray-800 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:ring-blue-500 focus:border-blue-500"
        />
        <Button
          onClick={() => handleSearch()}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-4 py-2 rounded-lg sm:rounded-l-none sm:rounded-r-lg"
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
    </div>
  );
}

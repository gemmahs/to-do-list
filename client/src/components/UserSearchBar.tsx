"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";

type UserProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};
export default function UserSearchBar({
  searchTerm,
  setSearchTerm,
}: UserProps) {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState(false); // Track if an item has been selected
  const searchBarRef = useRef<HTMLInputElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() && !selected) {
        try {
          const res = await fetch(`${baseUrl}/users?q=${searchTerm.trim()}`);
          const data = await res.json();
          if (res.status === 200) {
            setSearchResults(data);
            setError(null);
          } else {
            setSearchResults([]);
            setError(data.message);
          }
        } catch (e) {
          setError((e as Error).message);
          setSearchResults([]);
        }
      } else if (!searchTerm.trim()) {
        setError(null);
        setSearchResults([]);
      }
      setHighlightIndex(null);
    };

    // Debounce logic to avoid firing fetch requests too quickly
    const delayDebounce = setTimeout(() => fetchData(), 300);
    // Cleanup previous timeout on rerender
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]); // Hide the suggestion card
        setError(null);
        setHighlightIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // cleanup function, run before every re-render
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleUserInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (!searchTerm.trim()) {
      setError(null);
      setSearchResults([]);
    }
    setSearchTerm(e.target.value);
    // console.log(`Search Term: ${searchTerm}`);
    setSelected(false);
  }

  function selectUser(username: string) {
    setSearchTerm(username);
    setSearchResults([]);
    setHighlightIndex(null);
    setSelected(true);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowUp") {
      setHighlightIndex((prev) =>
        prev === null || prev === 0 ? searchResults.length - 1 : prev - 1
      );
    } else if (e.key === "ArrowDown") {
      setHighlightIndex((prev) =>
        prev === null || prev === searchResults.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "Enter" && highlightIndex !== null) {
      const selectedUser = searchResults[highlightIndex];
      if (selectedUser) {
        selectUser(selectedUser);
      }
    }
  }

  return (
    <div className="flex-1">
      <Label htmlFor="user">Username</Label>
      <div ref={searchBarRef} className="relative">
        <Input
          type="text"
          id="user"
          placeholder="Enter username"
          autoComplete="off"
          value={searchTerm}
          onChange={handleUserInput}
          onKeyDown={handleKeyDown}
        />

        {searchResults.length > 0 && (
          <div className="absolute top-100% mt-1 w-full p-2 space-y-2 bg-white rounded-md shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)]">
            {searchResults.map((result: string, index: number) => (
              <p
                className={`hover:bg-accent transition-colors p-1 rounded-sm cursor-pointer ${
                  index === highlightIndex ? "bg-accent" : ""
                }`}
                key={index}
                onClick={() => selectUser(result)}
              >
                {result}
              </p>
            ))}
          </div>
        )}

        {error && (
          <div className="absolute top-100% mt-1 w-full p-2 bg-white rounded-md shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)]">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

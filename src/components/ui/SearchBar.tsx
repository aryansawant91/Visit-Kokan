"use client";

import { useState } from "react";
import { Search, X, ArrowRight } from "lucide-react";

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
}

export default function SearchBar({
  value: controlledValue,
  placeholder = "Search destinations, forts, beaches, treks, food...",
  onSearch,
  onChange,
  className = "",
  size = "md",
  autoFocus = false,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const currentQuery = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onChange?.("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(currentQuery);
  };

  const sizeClasses = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2.5 px-4 text-sm",
    lg: "py-3.5 px-5 text-sm sm:text-base",
  };

  const buttonSize = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs sm:text-sm",
    lg: "px-6 py-2.5 text-sm font-semibold",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center bg-white rounded-full shadow-lg shadow-black/10 border border-white/80 focus-within:border-emerald-500/60 focus-within:ring-4 focus-within:ring-emerald-400/20 transition-all ${className}`}
    >
      <div className="flex items-center justify-center pl-3 sm:pl-4 text-[#2D6A4F] shrink-0">
        <Search className={size === "sm" ? "w-4 h-4" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
      </div>

      <input
        type="text"
        value={currentQuery}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`flex-1 bg-transparent text-gray-800 placeholder:text-gray-400 font-medium outline-none ${sizeClasses[size]}`}
      />

      {currentQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors mr-1"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="submit"
        className={`bg-gradient-to-r from-[#B7895A] to-[#C77B3F] hover:brightness-105 active:scale-95 text-white font-semibold rounded-full shadow-xs flex items-center gap-1.5 transition-all shrink-0 m-1 ${buttonSize[size]}`}
      >
        <span>Search</span>
        <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
      </button>
    </form>
  );
}

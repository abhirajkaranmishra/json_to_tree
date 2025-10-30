import React, { useState } from "react";

const SearchBar = ({ onSearch, searchMessage, theme }) => {
  const [path, setPath] = useState("");

  const handleSearch = () => {
    if (path.trim() === "") return;
    onSearch(path);
  };

  return (
    <div
      className={`w-full flex flex-col items-center p-4 border-b transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-gray-100 border-gray-300 text-black"
      }`}
    >
      <div className="flex w-full max-w-md">
        <input
          type="text"
          placeholder="Enter JSON path e.g. $.user.name or user.skills[0]"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-400 text-black placeholder-gray-500"
          }`}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {searchMessage && (
        <p
          className={`mt-2 text-sm ${
            searchMessage.includes("❌")
              ? "text-red-500"
              : searchMessage.includes("✅")
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          {searchMessage}
        </p>
      )}
    </div>
  );
};

export default SearchBar;

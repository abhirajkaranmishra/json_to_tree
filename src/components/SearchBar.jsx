import React, { useState } from "react";

const SearchBar = ({ onSearch, searchMessage }) => {
  const [path, setPath] = useState("");

  const handleSearch = () => {
    if (path.trim() === "") return;
    onSearch(path);
  };

  return (
    <div className="w-full flex flex-col items-center p-4 bg-gray-100 border-b border-gray-300">
      <div className="flex w-full max-w-md">
        <input
          type="text"
          placeholder="Enter JSON path e.g. $.user.name or user.skills[0]"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-400 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {searchMessage && (
        <p
          className={`mt-2 text-sm ${
            searchMessage.includes("No match")
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {searchMessage}
        </p>
      )}
    </div>
  );
};

export default SearchBar;

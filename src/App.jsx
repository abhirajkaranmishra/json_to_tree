import React, { useState } from "react";
import JsonInput from "./components/JsonInput";
import TreeStructure from "./components/TreeStructure";
import SearchBar from "./components/SearchBar";
import "./index.css";

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [theme, setTheme] = useState("dark");

  // ✅ Convert JSONPath (e.g. $.user.skills[0]) → internal ID fragment
  const normalizePathToId = (path) => {
    if (!path) return "";
    return path
      .replace(/^\$\./, "")
      .replace(/\[/g, "-")
      .replace(/\]/g, "")
      .replace(/\./g, "-");
  };

  const handleVisualize = (data) => {
    setJsonData(data);
    setHighlightedNodeId("");
    setSearchMessage("");
  };

  // 🔍 Search Handler
  const handleSearch = (query) => {
    if (!query) {
      setSearchMessage("Please enter a path (e.g. $.user.skills[0])");
      return;
    }

    const normalized = normalizePathToId(query);
    const nodeExists = findNodeExists(jsonData, normalized);

    if (nodeExists) {
      setHighlightedNodeId(normalized);
      setSearchMessage("✅ Match found!");
    } else {
      setHighlightedNodeId("");
      setSearchMessage("❌ No match found.");
    }
  };

  // Recursive check
  const findNodeExists = (data, normalizedPath) => {
    if (!data) return false;
    const parts = normalizedPath.split("-");
    let current = data;

    for (let part of parts) {
      if (Array.isArray(current)) {
        const index = parseInt(part, 10);
        if (isNaN(index) || index < 0 || index >= current.length) return false;
        current = current[index];
      } else if (typeof current === "object" && current !== null) {
        if (!(part in current)) return false;
        current = current[part];
      } else {
        return false;
      }
    }
    return true;
  };

  // 🧹 Clear / Reset everything
  const handleClear = () => {
    setJsonData(null);
    setHighlightedNodeId("");
    setSearchMessage("");
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Header with theme + clear */}
      <header
        className={`py-4 text-center shadow-md transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-800"
        }`}
      >
        <h1 className="text-2xl font-semibold">JSON Tree Visualizer</h1>

        <div className="mt-2 flex justify-center gap-3">
          {/* 🌗 Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`px-4 py-1 border rounded-md text-sm transition-colors duration-300 ${
              theme === "dark"
                ? "border-gray-500 hover:bg-gray-700 hover:text-white"
                : "border-gray-400 hover:bg-gray-200 hover:text-black"
            }`}
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* 🧹 Clear Button */}
          <button
            onClick={handleClear}
            className={`px-4 py-1 border rounded-md text-sm transition-colors duration-300 ${
              theme === "dark"
                ? "border-red-400 text-red-400 hover:bg-red-600 hover:text-white"
                : "border-red-500 text-red-600 hover:bg-red-100"
            }`}
          >
            🔄 Clear
          </button>
        </div>
      </header>

      {/* 🔍 SearchBar */}
      <SearchBar onSearch={handleSearch} searchMessage={searchMessage} theme={theme} />

      <main
        className={`flex flex-1 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <JsonInput onVisualize={handleVisualize} theme={theme} />
        <TreeStructure
          jsonData={jsonData}
          highlightedNodeId={highlightedNodeId}
          theme={theme}
        />
      </main>
    </div>
  );
};

export default App;

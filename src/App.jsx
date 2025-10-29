import React, { useState } from "react";
import JsonInput from "./components/JsonInput";
import TreeStructure from "./components/TreeStructure";
import "./index.css";

const App = () => {
  const [jsonData, setJsonData] = useState(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  // ✅ Convert JSONPath (e.g. $.user.skills[0]) → internal ID fragment
  const normalizePathToId = (path) => {
    if (!path) return "";
    return path
      .replace(/^\$\./, "") // remove leading "$."
      .replace(/\[/g, "-") // convert [0] → -0
      .replace(/\]/g, "") // remove ]
      .replace(/\./g, "-"); // convert dots → dashes
  };

  const handleVisualize = (data) => {
    setJsonData(data);
    setHighlightedNodeId("");
    setSearchMessage("");
  };

  // 🧠 Search handler: finds path, triggers highlight
  const handleSearch = () => {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) {
      setSearchMessage("Please enter a path (e.g. $.user.skills[0])");
      return;
    }

    const normalized = normalizePathToId(query);

    // ✅ Check if node exists by comparing normalized ID pattern
    const nodeExists = findNodeExists(jsonData, normalized);

    if (nodeExists) {
      setHighlightedNodeId(normalized);
      setSearchMessage("✅ Match found!");
    } else {
      setHighlightedNodeId("");
      setSearchMessage("❌ No match found.");
    }
  };

  // 🔍 Recursive check if JSON path exists
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

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="py-4 bg-white text-center shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800">
          JSON Tree Visualizer
        </h1>
      </header>

      {/* 🔍 Search Bar */}
      <div className="flex items-center justify-center gap-2 py-3 bg-gray-100 border-b border-gray-300">
        <input
          id="searchInput"
          type="text"
          placeholder="Search by JSON path (e.g. $.user.skills[0])"
          className="w-1/2 px-4 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
        >
          Search
        </button>
        {searchMessage && (
          <span
            className={`text-sm ${
              searchMessage.includes("✅")
                ? "text-green-600"
                : searchMessage.includes("❌")
                ? "text-red-500"
                : "text-gray-700"
            }`}
          >
            {searchMessage}
          </span>
        )}
      </div>

      <main className="flex flex-1">
        <JsonInput onVisualize={handleVisualize} />
        <TreeStructure
          jsonData={jsonData}
          highlightedNodeId={highlightedNodeId}
        />
      </main>
    </div>
  );
};

export default App;

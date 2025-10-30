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
  const [clearSignal, setClearSignal] = useState(null);

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

   const handleClear = () => {
  setJsonData(null);
  setHighlightedNodeId("");
  setSearchMessage("");
  setClearSignal(prev => !prev);
};

  const handleSearch = (query) => {
    if (!query) {
      setSearchMessage("Please enter a path (e.g. $.user.skills[0])");
      return;
    }

    const normalized = normalizePathToId(query);
    const nodeExists = findNodeExists(jsonData, normalized);

    if (nodeExists) {
      setHighlightedNodeId(normalized);
      setSearchMessage("Match found!");
    } else {
      setHighlightedNodeId("");
      setSearchMessage("No match found.");
    }
  };

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
    <div className="w-screen h-screen flex flex-col overflow-x-hidden">
      <header
        className={`py-4 text-center shadow-md transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-300 text-gray-800"
        }`}
      >
        <h1 className="text-2xl font-semibold">JSON Tree Visualizer</h1>

        <div className="mt-2 flex justify-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`px-4 py-1 border rounded-md text-sm transition-colors duration-300 ${
              theme === "dark"
                ? "border-gray-500 hover:bg-gray-700 hover:text-white"
                : "border-gray-400 hover:bg-gray-200 hover:text-black"
            }`}
          >
            {theme === "dark" ? " Light Mode" : " Dark Mode"}
          </button>

         <button onClick={handleClear}
            className={`mt-2 ml-2 px-4 py-1 border rounded-md text-sm transition-colors duration-300 ${
            theme === "dark"
            ? "border-gray-500 hover:bg-gray-700 hover:text-white"
            : "border-gray-400 hover:bg-gray-200 hover:text-black"
             }`}
            >
           Clear
         </button>

        </div>
      </header>

      <SearchBar onSearch={handleSearch} searchMessage={searchMessage} theme={theme} />

      <main
        className={`flex flex-1 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <JsonInput onVisualize={handleVisualize} theme={theme} clearSignal={clearSignal} />
        {jsonData && (
         <TreeStructure
            jsonData={jsonData}
            highlightedNodeId={highlightedNodeId}
            theme={theme}
         />
        )}

      </main>
    </div>
  );
};

export default App;

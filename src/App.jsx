import React, { useState } from 'react';
import JsonInput from './components/JsonInput';
import TreeStructure from './components/TreeStructure';
import './index.css';

const App = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleVisualize = (data) => {
    setJsonData(data);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      <header className="py-4 bg-white text-center">
        <h1 className="text-2xl font-semibold">
          JSON Tree Visualizer
        </h1>
      </header>

      <main className="flex flex-1">
        <JsonInput onVisualize={handleVisualize} />
        <TreeStructure jsonData={jsonData} />
      </main>
    </div>
  );
};

export default App;

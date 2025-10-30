import React, { useState, useEffect } from 'react';

const JsonInput = ({ onVisualize, theme,  clearSignal }) => {
  const [jsonText, setJsonText] = useState(`{
  "user": {
    "name": "Abhiraj",
    "age": 22,
    "skills": ["React", "Node", "c/c++"]
  }
}`);
  const [error, setError] = useState('');

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError('');
      onVisualize(parsed);
    } catch (e) {
      setError('Invalid JSON format. Please correct it.');
    }
  };

  useEffect(() => {
   if (clearSignal !== null) { 
    setJsonText("");
   }
  }, [clearSignal]);


  return (
    <div className={`w-1/2 p-6 flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
  <h2 className="text-lg font-semibold mb-2 text-blue-400">Enter JSON</h2>

  <textarea
    className={`w-full h-72 p-3 rounded-md text-sm border focus:outline-none focus:ring-2 ${
      theme === "dark"
        ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-400"
        : "bg-white border-gray-300 text-black focus:ring-blue-600"
    }`}
    value={jsonText}
    onChange={(e) => setJsonText(e.target.value)}
  ></textarea>

  {error && <p className="text-red-500 mt-2">{error}</p>}

  <button
    onClick={handleVisualize}
    className={`mt-4 px-4 py-2 rounded-lg font-semibold ${
      theme === "dark"
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
  >
    Visualize
  </button>
</div>

  );
};

export default JsonInput;

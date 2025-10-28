import React, { useState } from 'react';

const JsonInput = ({ onVisualize }) => {
  const [jsonText, setJsonText] = useState(`{
  "user": {
    "name": "Ganesh",
    "age": 22,
    "skills": ["React", "Node", "Firebase"]
  }
}`);
  const [error, setError] = useState('');

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError('');
      onVisualize(parsed); // Pass JSON data to parent
    } catch (e) {
      setError('Invalid JSON format. Please correct it.');
    }
  };

  return (
    <div className="w-1/2 p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-2 text-blue-400">Enter JSON</h2>
      <textarea
        className="w-full h-72 p-3 bg-white rounded-md text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      ></textarea>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleVisualize}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
      >
        Visualize
      </button>
    </div>
  );
};

export default JsonInput;

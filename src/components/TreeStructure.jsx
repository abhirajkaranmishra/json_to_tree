import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState } from "react";

const TreeStructure = ({ jsonData }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (jsonData) {
      // ✅ Check if there’s a single root key (like { "user": { ... } })
      if (typeof jsonData === "object" && !Array.isArray(jsonData)) {
        const entries = Object.entries(jsonData);
        if (entries.length === 1) {
          const [key, value] = entries[0];
          const { nodes, edges } = generateTree(value, null, 0, 0, key);
          setNodes(nodes);
          setEdges(edges);
        } else {
          const { nodes, edges } = generateTree(jsonData);
          setNodes(nodes);
          setEdges(edges);
        }
      } else {
        const { nodes, edges } = generateTree(jsonData);
        setNodes(nodes);
        setEdges(edges);
      }
    }
  }, [jsonData]);

  const generateTree = (data, parentId = null, depth = 0, index = 0, keyName = "root") => {
    const nodes = [];
    const edges = [];

    const id = `${parentId ? parentId + "-" : ""}${keyName}-${index}`;
    let label = "";
    let bgColor = "";

    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        label = `${keyName} [Array]`;
        bgColor = "bg-green-600";
      } else {
        label = `${keyName} {Object}`;
        bgColor = "bg-blue-600";
      }
    } else {
      label = `${keyName}: ${String(data)}`;
      bgColor = "bg-yellow-500";
    }

    // ✅ Adjusted position to give more spacing
    nodes.push({
      id,
      data: { label },
      position: { x: depth * 300, y: index * 130 },
      style: {
        background:
          bgColor === "bg-blue-600"
            ? "#2563eb" // blue → object
            : bgColor === "bg-green-600"
            ? "#16a34a" // green → array
            : "#eab308", // yellow → value
        color: "white",
        padding: 10,
        borderRadius: 8,
        fontSize: 12,
        border: "1px solid #333",
        textAlign: "center",
        minWidth: 120,
        boxShadow: "0 0 6px rgba(0,0,0,0.3)",
      },
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "straight",
      });
    }

    if (typeof data === "object" && data !== null) {
      let childIndex = 0;
      for (const [key, value] of Object.entries(data)) {
        const childTree = generateTree(value, id, depth + 1, childIndex++, key);
        nodes.push(...childTree.nodes);
        edges.push(...childTree.edges);
      }
    }

    return { nodes, edges };
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        defaultEdgeOptions={{
          type: "straight",
          style: { stroke: "#38bdf8", strokeWidth: 2 },
        }}
      >
        <Controls />
        <Background variant="dots" gap={15} size={1} color="#555" />
      </ReactFlow>
    </div>
  );
};

export default TreeStructure;

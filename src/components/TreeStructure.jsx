import ReactFlow, { Background, Controls, useReactFlow } from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState } from "react";

const TreeStructure = ({ jsonData, highlightedNodeId }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // 🧠 Generate tree whenever JSON changes
  useEffect(() => {
    if (jsonData) {
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
  }, [jsonData, highlightedNodeId]);

  // 🧩 Internal helper to safely access useReactFlow inside context
  const AutoPanToNode = ({ highlightedNodeId, nodes }) => {
    const { fitView } = useReactFlow();

    useEffect(() => {
      if (highlightedNodeId && nodes.length > 0) {
        const nodeToFocus = nodes.find((n) =>
          n.id.toLowerCase().includes(highlightedNodeId.toLowerCase())
        );
        if (nodeToFocus) {
          fitView({ nodes: [nodeToFocus], duration: 800, padding: 0.4 });
        }
      }
    }, [highlightedNodeId, nodes, fitView]);

    return null;
  };

  // 🔧 Recursive JSON → React Flow nodes and edges
  const generateTree = (data, parentId = null, depth = 0, index = 0, keyName = "root") => {
  const nodes = [];
  const edges = [];

  // ✅ Simplify id generation — no index between nested keys
  const id = parentId ? `${parentId}-${keyName}${Array.isArray(data) ? "" : ""}` : keyName;

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

  const isHighlighted =
    highlightedNodeId &&
    id.toLowerCase().includes(highlightedNodeId.toLowerCase());

  nodes.push({
    id,
    data: { label },
    position: { x: depth * 300, y: index * 130 },
    style: {
      background: isHighlighted
        ? "#ef4444"
        : bgColor === "bg-blue-600"
        ? "#2563eb"
        : bgColor === "bg-green-600"
        ? "#16a34a"
        : "#eab308",
      color: "white",
      padding: 10,
      borderRadius: 8,
      fontSize: 12,
      border: isHighlighted ? "2px solid white" : "1px solid #333",
      textAlign: "center",
      minWidth: 120,
      boxShadow: isHighlighted
        ? "0 0 12px 4px rgba(239,68,68,0.8)"
        : "0 0 6px rgba(0,0,0,0.3)",
      transition: "all 0.3s ease",
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
        {/* 👇 Runs safely inside ReactFlow’s context */}
        <AutoPanToNode highlightedNodeId={highlightedNodeId} nodes={nodes} />

        <Controls />
        <Background variant="dots" gap={15} size={1} color="#555" />
      </ReactFlow>
    </div>
  );
};

export default TreeStructure;

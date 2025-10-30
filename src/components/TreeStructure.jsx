import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState, useRef } from "react";
import { generateTree } from "../utils/generateTree";
import * as htmlToImage from "html-to-image"; 

const TreeStructureInner = ({ jsonData, highlightedNodeId, theme }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  const { fitView } = useReactFlow();
  const nodesRef = useRef([]);
  const flowRef = useRef(null); 

  useEffect(() => {
    if (!jsonData) return;

    const build = () => {
      if (typeof jsonData === "object" && !Array.isArray(jsonData)) {
        const entries = Object.entries(jsonData);
        if (entries.length === 1) {
          const [key, value] = entries[0];
          return generateTree(value, null, 0, 0, key, theme);
        }
      }
      return generateTree(jsonData, null, 0, 0, "root", theme);
    };

    const { nodes, edges } = build();
    setNodes(nodes);
    nodesRef.current = nodes;
    setEdges(edges);
  }, [jsonData, theme]);

  useEffect(() => {
    if (!highlightedNodeId) return;

    setNodes((nds) => {
      const updated = nds.map((n) => {
        const isTarget = n.id
          .toLowerCase()
          .includes(highlightedNodeId.toLowerCase());
        return {
          ...n,
          style: {
            ...n.style,
            background: isTarget ? "#ef4444" : n.style.background,
            border: isTarget ? "3px solid white" : "1px solid #333",
            boxShadow: isTarget
              ? "0 0 15px 5px rgba(239,68,68,0.8)"
              : "0 0 6px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
          },
        };
      });
      nodesRef.current = updated;
      return updated;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const currentNodes = nodesRef.current;
        const nodeToFocus = currentNodes.find((n) =>
          n.id.toLowerCase().includes(highlightedNodeId.toLowerCase())
        );

        if (nodeToFocus) {
          try {
            fitView({
              nodes: [nodeToFocus],
              duration: 800,
              padding: 0.4,
            });
          } catch (e) {
            console.warn("fitView failed:", e);
          }
        }
      });
    });
  }, [highlightedNodeId, fitView]);

  const handleDownload = async () => {
    if (!flowRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(flowRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "json-tree.png";
      link.click();
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  return (
    <div
      className={`w-full h-[calc(100vh-4rem)] ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } relative`}
    >
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleDownload}
          className={`px-3 py-1 rounded-md text-sm font-medium shadow-md transition-colors duration-300 ${
            theme === "dark"
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        >
          Download Tree
        </button>
      </div>

      {/* ReactFlow Visualization */}
      <div ref={flowRef} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeMouseEnter={(_, node) => {
            setTooltip({
              visible: true,
              x: node.position.x + 250,
              y: node.position.y + 100,
              content: `Path: ${node.data.fullPath}\nValue: ${node.data.value}`,
            });
          }}
          onNodeMouseLeave={() =>
            setTooltip({ visible: false, x: 0, y: 0, content: "" })
          }
          defaultEdgeOptions={{
            type: "straight",
            style: { stroke: "#38bdf8", strokeWidth: 2 },
          }}
        >
          <Controls />
          <Background
            variant="dots"
            gap={15}
            size={1}
            color={theme === "dark" ? "#555" : "#aaa"}
          />
        </ReactFlow>
      </div>

      {tooltip.visible && (
        <div
          className="absolute text-xs text-white bg-gray-800 border border-gray-600 rounded-md p-2 pointer-events-none whitespace-pre-line"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -120%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

const TreeStructure = (props) => (
  <ReactFlowProvider>
    <TreeStructureInner {...props} />
  </ReactFlowProvider>
);

export default TreeStructure;

import ReactFlow, {
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import React, { useEffect, useState, useRef } from "react";

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
  const nodesRef = useRef([]); // ✅ Always store latest nodes

  // 🧠 Build tree nodes whenever JSON changes
  useEffect(() => {
    if (!jsonData) return;

    const build = () => {
      if (typeof jsonData === "object" && !Array.isArray(jsonData)) {
        const entries = Object.entries(jsonData);
        if (entries.length === 1) {
          const [key, value] = entries[0];
          return generateTree(value, null, 0, 0, key);
        }
      }
      return generateTree(jsonData);
    };

    const { nodes, edges } = build();
    setNodes(nodes);
    nodesRef.current = nodes; // ✅ keep latest nodes reference
    setEdges(edges);
  }, [jsonData]);

  // 🧭 Auto center & highlight searched node
  useEffect(() => {
    if (!highlightedNodeId) return;

    // Highlight node visually
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
      nodesRef.current = updated; // update ref immediately
      return updated;
    });

    // ✅ Delay fitView until nodes are actually rendered
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

  // 🔧 Recursive JSON → nodes and edges
  const generateTree = (
    data,
    parentId = null,
    depth = 0,
    index = 0,
    keyName = "root"
  ) => {
    const nodes = [];
    const edges = [];

    const id = parentId ? `${parentId}-${keyName}` : keyName;

    let label = "";
    let bgColor = "";
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        label = `${keyName} [Array]`;
        bgColor = "#16a34a"; // green
      } else {
        label = `${keyName} {Object}`;
        bgColor = "#2563eb"; // blue
      }
    } else {
      label = `${keyName}: ${String(data)}`;
      bgColor = "#eab308"; // yellow
    }

    nodes.push({
      id,
      data: {
        label,
        fullPath: parentId ? `${parentId}.${keyName}` : `$${keyName}`,
        value: typeof data === "object" ? "[Object/Array]" : String(data),
      },
      position: { x: depth * 300, y: index * 130 },
      style: {
        background: bgColor,
        color: theme === "dark" ? "white" : "black",
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
    <div
      className={`w-full h-[calc(100vh-4rem)] ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      } relative`}
    >
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

// ✅ Provider wrapper
const TreeStructure = (props) => (
  <ReactFlowProvider>
    <TreeStructureInner {...props} />
  </ReactFlowProvider>
);

export default TreeStructure;

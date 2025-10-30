export const generateTree = (
  data,
  parentId = null,
  depth = 0,
  index = 0,
  keyName = "root",
  theme = "dark"
) => {
  const nodes = [];
  const edges = [];

  const id = parentId ? `${parentId}-${keyName}` : keyName;

  let label = "";
  let bgColor = "";
  if (typeof data === "object" && data !== null) {
    if (Array.isArray(data)) {
      label = `${keyName} [Array]`;
      bgColor = "#16a34a";
    } else {
      label = `${keyName} {Object}`;
      bgColor = "#2563eb";
    }
  } else {
    label = `${keyName}: ${String(data)}`;
    bgColor = "#eab308";
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
      const childTree = generateTree(
        value,
        id,
        depth + 1,
        childIndex++,
        key,
        theme
      );
      nodes.push(...childTree.nodes);
      edges.push(...childTree.edges);
    }
  }

  return { nodes, edges };
};

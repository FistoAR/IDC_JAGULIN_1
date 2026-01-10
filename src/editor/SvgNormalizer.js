export function normalizeSvg(svg) {
  const objects = [];

  function walk(node, offset = { x: 0, y: 0 }) {
    let current = { ...offset };

    if (node.tagName === "g" && node.getAttribute("transform")) {
      const match = node
        .getAttribute("transform")
        ?.match(/translate\(([^,]+),?([^)]+)?\)/);

      if (match) {
        current.x += parseFloat(match[1]);
        current.y += parseFloat(match[2] || 0);
      }
    }

    if (node.tagName === "text") {
      let text = "";
      let yOffset = 0;

      node.querySelectorAll("tspan").forEach(t => {
        text += t.textContent + " ";
        if (t.getAttribute("dy")) {
          yOffset += parseFloat(t.getAttribute("dy"));
        }
      });

      objects.push({
        id: crypto.randomUUID(),
        type: "text",
        x: current.x,
        y: current.y + yOffset,
        fontSize: parseFloat(node.getAttribute("font-size") || 16),
        text: text.trim()
      });
    }

    if (node.tagName === "rect") {
      objects.push({
        id: crypto.randomUUID(),
        type: "rect",
        x: parseFloat(node.getAttribute("x") || 0),
        y: parseFloat(node.getAttribute("y") || 0),
        width: parseFloat(node.getAttribute("width")),
        height: parseFloat(node.getAttribute("height")),
        rx: parseFloat(node.getAttribute("rx") || 0)
      });
    }

    [...node.children].forEach(child => walk(child, current));
  }

  walk(svg);
  return objects;
}

export function convertTspanToText(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");

  // Flatten <tspan>
  doc.querySelectorAll("text").forEach(text => {
    const tspans = text.querySelectorAll("tspan");
    if (tspans.length > 0) {
      let combinedText = "";
      tspans.forEach((tspan, index) => {
        if (index === 0) {
          if (tspan.getAttribute("x")) text.setAttribute("x", tspan.getAttribute("x"));
          if (tspan.getAttribute("y")) text.setAttribute("y", tspan.getAttribute("y"));
        }
        combinedText += tspan.textContent;
        tspan.remove();
      });
      text.textContent = combinedText;
    }
  });

  return new XMLSerializer().serializeToString(doc);
}

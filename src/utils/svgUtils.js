export function convertTspanToText(svgString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");

  // --- NEW: Fix Image Use Tags & Namespaces ---
  // Fix <use> tags referencing <image> (Common in Illustrator/Canva exports)
  doc.querySelectorAll("use").forEach(useTag => {
    const href = useTag.getAttribute("xlink:href") || useTag.getAttribute("href");
    if (href && href.startsWith("#")) {
      const targetId = href.substring(1);
      const targetEl = doc.getElementById(targetId);

      if (targetEl && targetEl.tagName === 'image') {
        const newImg = doc.createElementNS("http://www.w3.org/2000/svg", "image");
        // Copy attributes from source to the visible tag
        Array.from(targetEl.attributes).forEach(attr => newImg.setAttribute(attr.name, attr.value));
        Array.from(useTag.attributes).forEach(attr => {
          if (attr.name !== 'href' && attr.name !== 'xlink:href') {
            newImg.setAttribute(attr.name, attr.value);
          }
        });
        useTag.parentNode.replaceChild(newImg, useTag);
      }
    }
  });

  // Standardize href for all image tags
  doc.querySelectorAll("image").forEach(img => {
    const xlinkHref = img.getAttribute("xlink:href");
    if (xlinkHref && !img.getAttribute("href")) {
      img.setAttribute("href", xlinkHref);
    }
  });

  // --- EXISTING: Loop over all <text> elements (UNCHANGED) ---
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
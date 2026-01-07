import * as fabric from "fabric";
import { convertTspanToText } from "../utils/svgUtils";

export default function LeftPanel({ canvasRef }) {

  async function loadTemplate() {
    try {
      const res = await fetch("/template.svg");
      const svgString = await res.text();

      // 1️⃣ Cleanup TSPANs and fix image href namespaces via your util
      const fixedSVG = convertTspanToText(svgString);

      // 2️⃣ Correct Fabric v6 API: (string, reviver_function)
      const { objects } = await fabric.loadSVGFromString(
        fixedSVG, 
        (el, obj) => {
          // ENSURE IMAGES ARE VISIBLE
          if (el.tagName === 'image' || obj.type === 'image') {
            obj.set({
              opacity: 1,
              visible: true,
              crossOrigin: 'anonymous' // Prevents security errors on external images
            });
          }
        }
      );

      if (!objects || !objects.length) {
        throw new Error("SVG parsed but no drawable objects found");
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.clear();

      // 3️⃣ Add objects to canvas
      objects.forEach(obj => {
        obj.set({
          selectable: true,
          evented: true,
        });
        canvas.add(obj);
      });

      canvas.renderAll();

      // 🔥 5️⃣ AUTO-FIT SVG TO CANVAS WITH PADDING (Existing Logic Kept)
      const PADDING = 40; 

      const bounds = canvas.getObjects().reduce(
        (acc, obj) => {
          const box = obj.getBoundingRect(true, true); 
          acc.minX = Math.min(acc.minX, box.left);
          acc.minY = Math.min(acc.minY, box.top);
          acc.maxX = Math.max(acc.maxX, box.left + box.width);
          acc.maxY = Math.max(acc.maxY, box.top + box.height);
          return acc;
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );

      const svgWidth = bounds.maxX - bounds.minX + PADDING * 2;
      const svgHeight = bounds.maxY - bounds.minY + PADDING * 2;

      if (!svgWidth || !svgHeight) return;

      const scale = Math.min(
        canvas.width / svgWidth,
        canvas.height / svgHeight
      );

      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      canvas.setViewportTransform([
        scale, 0, 0, scale,
        (canvas.width - svgWidth * scale) / 2 - (bounds.minX - PADDING) * scale,
        (canvas.height - svgHeight * scale) / 2 - (bounds.minY - PADDING) * scale
      ]);

      canvas.requestRenderAll();

    } catch (err) {
      console.error("Error loading SVG template:", err);
    }
  }

  return (
    <div className="left-panel">
      <h3>Templates</h3>
      <button onClick={loadTemplate}>Load Template</button>
    </div>
  );
}
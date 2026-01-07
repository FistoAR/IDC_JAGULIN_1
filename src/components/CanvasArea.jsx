import { useEffect, useRef } from "react";
import * as fabric from "fabric";

export default function CanvasArea({ canvasRef, setActiveObject }) {
  const elRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(elRef.current, {
      width: 700,
      height: 900,
      backgroundColor: "#fff",
      preserveObjectStacking: true,
    });

    canvasRef.current = canvas;

    canvas.on("selection:created", e => setActiveObject(e.selected[0]));
    canvas.on("selection:updated", e => setActiveObject(e.selected[0]));
    canvas.on("selection:cleared", () => setActiveObject(null));

    return () => canvas.dispose();
  }, [canvasRef, setActiveObject]);

  return (
    <div className="canvas-wrapper">
      <canvas ref={elRef} />
    </div>
  );
}


import { Textbox, Control } from "fabric";

export function addFloatingText(canvas, text = "Edit text") {
  if (!canvas) return;

  const textbox = new Textbox(text, {
    left: canvas.width / 2,
    top: canvas.height / 2,
    width: 260,
    fontSize: 28,
    fill: "#000",
    editable: true,
    selectable: true,
    evented: true,
    hasControls: true,
    lockUniScaling: false,
    name: "Text",
  });

  // 🔴 Custom delete control
  textbox.controls.deleteControl = new Control({
    x: 0.5,
    y: -0.5,
    offsetX: 16,
    offsetY: -16,
    cursorStyle: "pointer",
    mouseUpHandler: (_, transform) => {
      const target = transform.target;
      const canvas = target.canvas;
      canvas.remove(target);
      canvas.requestRenderAll();
    },
    render: (ctx, left, top) => {
      ctx.save();
      ctx.translate(left, top);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("×", 0, 1);
      ctx.restore();
    },
  });

  canvas.add(textbox);
  canvas.setActiveObject(textbox);
  canvas.bringToFront(textbox); // 🔥 FLOAT ABOVE TEMPLATE
  canvas.requestRenderAll();
}

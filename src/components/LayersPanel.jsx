import { useEffect, useState } from "react";

export default function LayersPanel({ canvasRef, activeObject }) {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const update = () => setObjects([...canvas.getObjects()]);

    canvas.on("object:added", update);
    canvas.on("object:removed", update);
    canvas.on("object:modified", update);
    canvas.on("selection:created", update);
    canvas.on("selection:updated", update);

    update();

    return () => {
      canvas.off("object:added", update);
      canvas.off("object:removed", update);
      canvas.off("object:modified", update);
    };
  }, [canvasRef]);

  const canvas = canvasRef.current;

  // -----------------------
  // LAYER ACTIONS
  // -----------------------

  const select = (obj) => {
    canvas.setActiveObject(obj);
    canvas.renderAll();
  };

  const toggleLock = (obj) => {
    obj.selectable = !obj.selectable;
    obj.evented = obj.selectable;
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const toggleVisible = (obj) => {
    obj.visible = !obj.visible;
    canvas.renderAll();
  };

  const renameLayer = (obj) => {
    const name = prompt("Layer name", obj.name || obj.type);
    if (name) {
      obj.name = name;
      setObjects([...canvas.getObjects()]);
    }
  };

  const bringUp = (obj) => {
    canvas.bringForward(obj);
    canvas.renderAll();
  };

  const sendDown = (obj) => {
    canvas.sendBackwards(obj);
    canvas.renderAll();
  };

  const groupSelected = () => {
    const selection = canvas.getActiveObject();
    if (!selection || selection.type !== "activeSelection") return;

    selection.toGroup();
    canvas.renderAll();
  };

  const ungroup = (obj) => {
    if (obj.type !== "group") return;

    obj.toActiveSelection();
    canvas.renderAll();
  };

  // -----------------------
  // UI
  // -----------------------

  return (
    <div className="layers-panel">
      <h4>Layers</h4>

      <button onClick={groupSelected}>Group</button>

      {objects.map((obj, i) => (
        <div
          key={i}
          className={obj === activeObject ? "layer active" : "layer"}
        >
          <span onClick={() => select(obj)}>
            {obj.name || obj.type}
          </span>

          <div className="layer-actions">
            <button onClick={() => toggleLock(obj)}>
              {obj.selectable ? "🔓" : "🔒"}
            </button>

            <button onClick={() => toggleVisible(obj)}>
              {obj.visible ? "👁" : "🚫"}
            </button>

            <button onClick={() => renameLayer(obj)}>✏️</button>

            <button onClick={() => bringUp(obj)}>⬆</button>
            <button onClick={() => sendDown(obj)}>⬇</button>

            {obj.type === "group" && (
              <button onClick={() => ungroup(obj)}>Ungroup</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

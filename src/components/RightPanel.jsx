export default function RightPanel({ canvasRef, activeObject }) {
  if (!activeObject) return <div className="right-panel">Select element</div>;

  const canvas = canvasRef.current;

  // TEXT
  const update = (props) => {
    activeObject.set(props);
    canvas.renderAll();
  };

  // IMAGE REPLACE
  const replaceImage = () => {
    const url = prompt("Enter image URL");
    if (!url || activeObject.type !== "image") return;

    activeObject.setSrc(url, canvas.renderAll.bind(canvas));
  };

  // ALIGN
  const align = (pos) => {
    if (pos === "left") activeObject.set({ left: 0 });
    if (pos === "center") activeObject.centerH();
    if (pos === "right") activeObject.set({ left: canvas.width - activeObject.width });
    canvas.renderAll();
  };

  // SAVE / LOAD JSON
  const saveJSON = () => {
    const json = JSON.stringify(canvas.toJSON());
    localStorage.setItem("canvasJSON", json);
  };

  const loadJSON = () => {
    const json = localStorage.getItem("canvasJSON");
    if (json) canvas.loadFromJSON(json, canvas.renderAll.bind(canvas));
  };

  return (
    <div className="right-panel">
      {activeObject.type === "text" && (
        <>
          <input
            value={activeObject.text}
            onChange={e => update({ text: e.target.value })}
          />
          <input
            type="color"
            onChange={e => update({ fill: e.target.value })}
          />
          <input
            type="number"
            onChange={e => update({ fontSize: +e.target.value })}
            placeholder="Font size"
          />
        </>
      )}

      {activeObject.type === "image" && (
        <button onClick={replaceImage}>Replace Image</button>
      )}

      <hr />

      <button onClick={() => align("left")}>Align Left</button>
      <button onClick={() => align("center")}>Align Center</button>
      <button onClick={() => align("right")}>Align Right</button>

      <hr />

      <button onClick={saveJSON}>Save JSON</button>
      <button onClick={loadJSON}>Load JSON</button>
    </div>
  );
}

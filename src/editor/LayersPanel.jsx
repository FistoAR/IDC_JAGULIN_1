import React from "react";

export default function LayersPanel({ objects, selectedId, onSelect }) {
  return (
    <div className="layers-panel">
      <h3>Layers</h3>
      <ul style={{ maxHeight: '300px', overflowY: 'auto', padding: 0 }}>
        {objects.map((obj) => (
          <li
            key={obj.id}
            onClick={() => onSelect(obj.id)}
            style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderBottom: "1px solid #eee",
                background: selectedId === obj.id ? "#e7f3ff" : "transparent",
                cursor: "pointer"
            }}
          >
            {obj.type === "image" && (
              <div style={{ width: 24, height: 24, background: "#ddd", overflow: "hidden" }}>
                <img src={obj.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="thumb" />
              </div>
            )}
            <span style={{ fontSize: "12px" }}>
              <strong>{obj.type.toUpperCase()}</strong>: {obj.text ? obj.text.substring(0, 10) : obj.id}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
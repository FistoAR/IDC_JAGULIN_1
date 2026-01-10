import React from "react";

export default function PropertiesPanel({ selected, updateSelected, onReplaceClick }) {
  if (!selected) return <div style={{ color: "#999" }}>Select an element</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = e.target.type === "number" ? parseFloat(value) : value;
    updateSelected({ [name]: val });
  };

  return (
    <div>
      <h3>Properties</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        {/* Replace Option for Images */}
        {(selected.type === "image" || selected.type === "rect") && (
          <div style={{ padding: "10px", background: "#f9f9f9", border: "1px dashed #ccc" }}>
            <p style={{ margin: "0 0 10px 0", fontSize: "12px" }}>Image Actions:</p>
            <button 
              onClick={onReplaceClick}
              style={{
                width: "100%",
                padding: "8px",
                background: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Replace Image
            </button>
          </div>
        )}

        {selected.type === "text" && (
          <>
            <label>Text Content:
              <textarea name="text" value={selected.text} onChange={handleChange} style={{ width: "100%" }} />
            </label>
            <label>Font Size:
              <input type="number" name="fontSize" value={selected.fontSize} onChange={handleChange} style={{ width: "100%" }} />
            </label>
          </>
        )}
      </div>
    </div>
  );
}
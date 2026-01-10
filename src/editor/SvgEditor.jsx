import React, { useRef, useState, useEffect, useCallback } from "react";
import interact from "interactjs";
import HTMLFlipBook from "react-pageflip"; // You need to install: npm install react-pageflip
import { convertTspanToText } from "./convertTspanToText";
import LayersPanel from "./LayersPanel";
import PropertiesPanel from "./PropertiesPanel";

// Wrapper for individual Flipbook pages
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="flipbook-page" ref={ref} style={{ background: "white", overflow: "hidden" }}>
      <div 
        style={{ width: "794px", height: "1123px", transform: "scale(0.63)", transformOrigin: "top left" }} 
        dangerouslySetInnerHTML={{ __html: props.data }} 
      />
    </div>
  );
});

export default function SvgEditor() {
  const containerRefs = useRef([]); 
  const fileInputRef = useRef(null);

  const [selected, setSelected] = useState(null);
  const [objects, setObjects] = useState([]);
  const [zoom, setZoom] = useState(0.5); 
  const [pages, setPages] = useState([{ id: "page-1" }]);

  // --- NEW STATE FOR FLIPBOOK ---
  const [isFlipbookOpen, setIsFlipbookOpen] = useState(false);
  const [flipbookData, setFlipbookData] = useState([]);

  const selectedObj = objects.find((o) => o.id === selected?.id);

  // --- 1. CORE UPDATE LOGIC ---
  const updateSelected = useCallback((id, props) => {
    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === id) {
          let currentEl = obj.el;
          const updated = { ...obj, ...props };

          if (props.text !== undefined) currentEl.textContent = props.text;
          if (props.fontSize !== undefined) currentEl.setAttribute("font-size", props.fontSize);
          
          if (props.src !== undefined) {
            const width = currentEl.getAttribute("width");
            const height = currentEl.getAttribute("height");
            const x = currentEl.getAttribute("x") || 0;
            const y = currentEl.getAttribute("y") || 0;

            // If the user clicks a rectangle to turn it into an image, or replaces an existing image
            if (obj.type === "rect") {
              const newImg = document.createElementNS("http://www.w3.org/2000/svg", "image");
              newImg.setAttribute("x", x);
              newImg.setAttribute("y", y);
              newImg.setAttribute("width", width);
              newImg.setAttribute("height", height);
              newImg.setAttribute("data-id", id);
              newImg.setAttribute("preserveAspectRatio", "xMidYMid slice");
              currentEl.parentNode.replaceChild(newImg, currentEl);
              updated.el = newImg;
              updated.type = "image";
              currentEl = newImg;
            }
            
            // Apply the source to the image element
            currentEl.setAttribute("href", props.src);
            currentEl.setAttribute("xlink:href", props.src);
          }
          return updated;
        }
        return obj;
      })
    );
  }, []);

  // --- 2. TEXT EDITING LOGIC ---
  const handleTextEdit = useCallback((obj) => {
    const el = obj.el;
    const bbox = el.getBoundingClientRect(); 
    
    const input = document.createElement("textarea");
    input.value = el.textContent;
    
    input.style.position = "fixed";
    input.style.top = `${bbox.top}px`;
    input.style.left = `${bbox.left}px`;
    input.style.width = `${bbox.width}px`;
    input.style.height = `${bbox.height}px`;
    input.style.minWidth = "100px";
    
    const computed = window.getComputedStyle(el);
    input.style.fontSize = computed.fontSize;
    input.style.fontFamily = computed.fontFamily;
    input.style.textAlign = "center";
    input.style.zIndex = "9999";
    input.style.background = "white";
    input.style.border = "1px solid #007bff";
    input.style.outline = "none";
    input.style.resize = "none";
    input.style.overflow = "hidden";

    document.body.appendChild(input);
    input.focus();
    input.select();

    input.onblur = () => {
      updateSelected(obj.id, { text: input.value });
      document.body.removeChild(input);
    };

    input.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        input.blur();
      }
    };
  }, [updateSelected]);

  // --- 3. INTERACTIVE SETUP ---
  const makeInteractive = useCallback(() => {
    objects.forEach((obj) => {
      const el = obj.el;
      interact(el).unset();

      el.onclick = (e) => {
        e.stopPropagation();
        document.querySelectorAll(".svg-canvas *").forEach(item => {
           if(item.style) item.style.outline = "";
        });
        el.style.outline = "2px solid #007bff";
        setSelected(obj);
      };

      if (obj.type === "text") {
        el.ondblclick = (e) => {
          e.stopPropagation();
          handleTextEdit(obj);
        };
      }

      interact(el).draggable({
        listeners: {
          move(event) {
            const x = (parseFloat(el.dataset.x) || 0) + event.dx / zoom;
            const y = (parseFloat(el.dataset.y) || 0) + event.dy / zoom;
            el.dataset.x = x;
            el.dataset.y = y;
            el.setAttribute("transform", `translate(${x}, ${y})`);
          },
        },
      });
    });
  }, [objects, zoom, handleTextEdit]);

  useEffect(() => {
    makeInteractive();
  }, [objects, makeInteractive, pages]);

  // --- 4. UPLOAD PER PAGE ---
  const uploadToSpecificPage = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    let svgText = await file.text();
    svgText = convertTspanToText(svgText);

    const container = containerRefs.current[index];
    if (!container) return;

    container.innerHTML = svgText;
    const svgEl = container.querySelector("svg");
    svgEl.setAttribute("width", "794px");
    svgEl.setAttribute("height", "1123px");
    svgEl.classList.add("svg-canvas");

    const newObjs = [];
    // QUERY ALL potentially replaceable elements (images, rects, and text)
    svgEl.querySelectorAll("text, rect, image").forEach((el, i) => {
      const id = `p${index}-obj-${i}-${Date.now()}`;
      el.setAttribute("data-id", id);
      newObjs.push({
        id,
        type: el.tagName, // This will correctly capture "image" or "rect"
        el,
        text: el.tagName === "text" ? el.textContent : "",
      });
    });
    
    setObjects((prev) => [...prev, ...newObjs]);
    e.target.value = null; 
  };

  const addPage = () => {
    setPages([...pages, { id: `page-${Date.now()}` }]);
  };

  // --- 5. NEW FLIPBOOK LOGIC ---
  const handleOpenFlipbook = () => {
    const contents = containerRefs.current
      .filter(ref => ref !== null)
      .map(ref => ref.innerHTML);
    
    setFlipbookData(contents);
    setIsFlipbookOpen(true);
  };

  return (
    <>
      <style>{`
        .page-info-bar { display: flex; justify-content: space-between; align-items: center; width: 794px; margin: 10px auto; font-family: sans-serif; font-size: 14px; color: #666; }
        .page-upload-label { background: #007bff; color: white; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .add-page-wrapper { width: 794px; margin: 30px auto; display: flex; justify-content: center; }
        .canva-btn-group { display: flex; background: #f1f3f4; border: 1px solid #dadce0; border-radius: 8px; height: 40px; width: 300px; overflow: hidden; }
        .canva-main-btn { flex: 1; border: none; background: none; cursor: pointer; font-weight: 600; color: #3c4043; }
        .canva-main-btn:hover { background: #e8eaed; }
        .canva-drop-btn { width: 40px; border: none; border-left: 1px solid #dadce0; background: none; cursor: pointer; }
        .flipbook-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .close-flipbook { position: absolute; top: 20px; right: 20px; background: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
        .flipbook-container { box-shadow: 0 0 50px rgba(0,0,0,0.5); }
        .preview-btn { margin-top: 10px; padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; }
      `}</style>

      <div className="editor-layout">
        <div className="sidebar toolbar">
          <h3>Toolbar</h3>
          <div className="zoom-panel">
            <label>Zoom: {Math.round(zoom * 100)}%</label>
            <input type="range" min="0.1" max="1.5" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} />
          </div>
          <button className="preview-btn" onClick={handleOpenFlipbook}>Preview Flipbook</button>
        </div>

        <div className="workspace-container">
          <div className="canvas-stack">
            {pages.map((page, index) => (
              <div key={page.id} className="page-section">
                <div className="page-info-bar">
                  <span>Page {index + 1} of {pages.length}</span>
                  <label className="page-upload-label">
                    Upload to Page {index + 1}
                    <input type="file" hidden accept=".svg" onChange={(e) => uploadToSpecificPage(e, index)} />
                  </label>
                </div>
                <div 
                  className="a4-page"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                  ref={(el) => (containerRefs.current[index] = el)}
                ></div>
              </div>
            ))}
            <div className="add-page-wrapper">
              <div className="canva-btn-group">
                <button className="canva-main-btn" onClick={addPage}>+ Add page</button>
                <button className="canva-drop-btn">▼</button>
              </div>
            </div>
          </div>
        </div>

        {isFlipbookOpen && (
          <div className="flipbook-overlay">
            <button className="close-flipbook" onClick={() => setIsFlipbookOpen(false)}>Close Preview</button>
            <div className="flipbook-container">
              <HTMLFlipBook width={500} height={707} showCover={true} className="my-flipbook">
                {flipbookData.map((html, idx) => (
                  <Page key={idx} data={html} />
                ))}
              </HTMLFlipBook>
            </div>
          </div>
        )}

        <div className="sidebar panel-right">
          <LayersPanel objects={objects} selectedId={selected?.id} />
          <hr />
          {/* Ensure PropertiesPanel handles selected objects correctly */}
          <PropertiesPanel 
            selected={selectedObj} 
            updateSelected={(props) => updateSelected(selectedObj.id, props)} 
            onReplaceClick={() => fileInputRef.current.click()}
          />
        </div>

        {/* This file input handles the actual image replacement */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          accept="image/*" 
          onChange={(e) => {
            if (!e.target.files[0]) return;
            const reader = new FileReader();
            reader.onload = (ev) => updateSelected(selectedObj.id, { src: ev.target.result });
            reader.readAsDataURL(e.target.files[0]);
            e.target.value = null; // Reset to allow same file selection
          }} 
        />
      </div>
    </>
  );
}
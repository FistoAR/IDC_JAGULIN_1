import { useRef, useState } from "react";
import LeftPanel from "./components/LeftPanel";
import CanvasArea from "./components/CanvasArea";
import RightPanel from "./components/RightPanel";
import LayersPanel from "./components/LayersPanel";
import "./App.css";

export default function App() {
  const canvasRef = useRef(null);
  const [activeObject, setActiveObject] = useState(null);

  return (
    <div className="app">
      <LeftPanel canvasRef={canvasRef} />
      <CanvasArea canvasRef={canvasRef} setActiveObject={setActiveObject} />
      <RightPanel canvasRef={canvasRef} activeObject={activeObject} />
      <LayersPanel canvasRef={canvasRef} activeObject={activeObject} />
    </div>
  );
}

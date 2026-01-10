<<<<<<< HEAD
import React, { useState, useEffect } from 'react'; // Added useEffect
import {
  Pencil,
  ChevronDown,
  ChevronUp,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ArrowLeftRight,
  ArrowUpDown,
  MousePointer2,
  Sparkles,
  SlidersHorizontal,
  Minus,
  Italic,
  Underline,
  Strikethrough,
  Type
} from 'lucide-react';

const fontFamilies = [
  'Arial', 'Times New Roman', 'Courier New', 'Georgia', 
  'Verdana', 'Helvetica', 'Poppins', 'Roboto', 
  'Open Sans', 'Lato', 'Montserrat'
];

const fontWeights = [
  { label: 'Thin', value: '100' },
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'Semi Bold', value: '600' },
  { label: 'Bold', value: '700' },
  { label: 'Extra Bold', value: '800' }
];

const TextEditor = ({ selectedElement, onUpdate, dimensions: initialDimensions = { w: 210, h: 297 } }) => {
  const [isTextOpen, setIsTextOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [showFillPicker, setShowFillPicker] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 
  const [dims, setDims] = useState(initialDimensions);
  const [letterSpacing, setLetterSpacing] = useState('Auto');
  const [lineHeight, setLineHeight] = useState('Auto');
  const [textValue, setTextValue] = useState(''); // Local state for textarea

  // Sync state when selectedElement changes
  useEffect(() => {
    if (selectedElement) {
      setTextValue(selectedElement.textContent || '');
      setDims({
        w: parseInt(selectedElement.style.width) || initialDimensions.w,
        h: parseInt(selectedElement.style.height) || initialDimensions.h
      });
      // Reset menus when switching elements
      setActiveMenu(null);
      setShowFillPicker(false);
    }
  }, [selectedElement, initialDimensions.w, initialDimensions.h]);

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const setStyle = (prop, value) => {
    const el = selectedElement;
    if (!el) return;
    el.style[prop] = value;
    if (onUpdate) onUpdate();
  };

  const handleDimChange = (key, value) => {
    const numValue = value === '' ? 0 : parseInt(value);
    setDims(prev => ({ ...prev, [key]: numValue }));
    const el = selectedElement;
    if (el) {
      el.style[key === 'w' ? 'width' : 'height'] = `${numValue}px`;
=======
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Type, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Strikethrough, Minus, List, 
  ChevronDown, Edit3, MoveHorizontal, ArrowUpDown,
  CaseSensitive, CaseUpper, CaseLower, ListOrdered, Palette, X, Pipette,
  RotateCcw, RefreshCw, ArrowLeftRight, MinusCircle, Plus, Settings2,
  ChevronLeft, ChevronRight, MousePointer2, SlidersHorizontal
} from 'lucide-react';

const fontFamilies = ['Poppins', 'Arial', 'Roboto', 'Montserrat', 'Open Sans'];
const fontWeights = ['Light', 'Regular', 'Medium', 'Semi Bold', 'Bold'];

const TextEditor = ({ selectedElement, onUpdate, onNavigate }) => {
  const [isTextOpen, setIsTextOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isInteractionOpen, setIsInteractionOpen] = useState(true); 
  const [interactionType, setInteractionType] = useState('None'); 
  const [targetPage, setTargetPage] = useState('Page 4');
  const [activeMenu, setActiveMenu] = useState(null);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showDashedPanel, setShowDashedPanel] = useState(false);
  
  const [colorMode, setColorMode] = useState('Solid'); 
  const [gradientType, setGradientType] = useState('Linear');
  const [gradientColors, setGradientColors] = useState([
    { hex: '#63D0CD', stop: 0 },
    { hex: '#4B3EFE', stop: 100 }
  ]);
  
  const [currentColor, setCurrentColor] = useState('#000000');
  const [hue, setHue] = useState(0);
  const [opacity, setOpacity] = useState(100);

  const [dashLength, setDashLength] = useState(4);
  const [dashGap, setDashGap] = useState(4);
  const [dashWidth, setDashWidth] = useState(1);
  const [isRoundCorners, setIsRoundCorners] = useState(false);
  
  // New state for stroke color
  const [strokeColorMode, setStrokeColorMode] = useState('Solid');
  const [strokeColor, setStrokeColor] = useState('#FF0000');
  const [strokeHue, setStrokeHue] = useState(0);
  const [showStrokeColorPanel, setShowStrokeColorPanel] = useState(false);
  
  const saturationRef = useRef(null);
  const gradientBarRef = useRef(null);
  const elementRef = useRef(null);
  const strokeSaturationRef = useRef(null);

  useEffect(() => {
    elementRef.current = selectedElement;
    if (selectedElement) {
        setInteractionType(selectedElement.dataset.interactionType || 'None');
        setTargetPage(selectedElement.dataset.targetPage || 'Page 4');
    }
  }, [selectedElement]);

  const applyDashedStyle = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    
    // Apply border properties for dashed effect
    el.style.borderStyle = 'dashed';
    el.style.borderWidth = `${dashWidth}px`;
    el.style.borderColor = strokeColor;
    
    // Create the dash pattern: dashLength dash, dashGap gap
    const dashPattern = `${dashLength} ${dashGap}`;
    
    // Apply to all CSS properties that control dashes
    el.style.borderImage = 'none';
    el.style.outline = 'none';
    
    // Apply using CSS custom property and standard border
    el.style.setProperty('--dash-length', `${dashLength}px`);
    el.style.setProperty('--dash-gap', `${dashGap}px`);
    
    // For WebKit browsers
    el.style.webkitBorderImage = 'none';
    
    // Apply border-radius if round corners is enabled
    if (isRoundCorners) {
        el.style.borderRadius = `${dashWidth * 2}px`;
        el.style.borderStyle = 'dashed';
    } else {
        el.style.borderRadius = '0px';
    }
    
    // Force reflow to ensure styles are applied
    el.offsetHeight;

    if (onUpdate) onUpdate();
  }, [dashLength, dashGap, dashWidth, isRoundCorners, strokeColor, onUpdate]);

  // Handle instant toggle between Solid and Dashed
  const handleBorderStyleChange = (value) => {
    const el = elementRef.current;
    if (!el) return;

    if (value === 'Dashed') {
      applyDashedStyle();
      setShowDashedPanel(true);
    } else {
      el.style.borderStyle = 'solid';
      el.style.borderWidth = `${dashWidth}px`;
      el.style.borderColor = strokeColor;
      el.style.borderRadius = '0px';
      setShowDashedPanel(false);
    }
    if (onUpdate) onUpdate();
  };

  useEffect(() => {
    if (showDashedPanel) {
      applyDashedStyle();
    }
  }, [dashLength, dashGap, dashWidth, isRoundCorners, strokeColor, applyDashedStyle, showDashedPanel]);

  const updateInteraction = (type, page) => {
    const el = elementRef.current;
    if (!el) return;
    
    setInteractionType(type);
    setTargetPage(page);

    if (type === 'Navigate') {
        el.dataset.interactionType = 'Navigate';
        el.dataset.targetPage = page;
        el.style.cursor = 'pointer';
        
        el.onclick = () => {
            const pageNum = parseInt(page.replace('Page ', ''));
            if (onNavigate) onNavigate(pageNum);
        };
    } else {
        delete el.dataset.interactionType;
        delete el.dataset.targetPage;
        el.style.cursor = 'default';
        el.onclick = null;
    }
    if (onUpdate) onUpdate();
  };

  const updateHueFromColor = (color) => {
    if (!color || color.includes('gradient')) return;
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (!match) return;
      [r, g, b] = match.map(x => parseInt(x) / 255);
    } else { return; }
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
      if (max === r) h = (g - b) / (max - min) + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / (max - min) + 2;
      else h = (r - g) / (max - min) + 4;
      h /= 6;
    }
    setHue(Math.round(h * 360));
  };

  const updateStrokeHueFromColor = (color) => {
    if (!color || color.includes('gradient')) return;
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (!match) return;
      [r, g, b] = match.map(x => parseInt(x) / 255);
    } else { return; }
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    if (max !== min) {
      if (max === r) h = (g - b) / (max - min) + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / (max - min) + 2;
      else h = (r - g) / (max - min) + 4;
      h /= 6;
    }
    setStrokeHue(Math.round(h * 360));
  };

  const getCurrentStyle = useCallback((property) => {
    if (!selectedElement) return '';
    const style = window.getComputedStyle(selectedElement)[property] || '';
    return style.replace(/['"]/g, '');
  }, [selectedElement]);

  const updateStyle = useCallback((property, value) => {
    const el = elementRef.current;
    if (!el) return;
    if (property === 'listStyleType') {
      if (value === 'none' || value === '') el.style.display = 'block';
      else {
        el.style.display = 'list-item';
        el.style.listStylePosition = 'inside';
      }
    }
    el.style[property] = value;
    if (value.includes('gradient')) {
        el.style.webkitBackgroundClip = 'text';
        el.style.webkitTextFillColor = 'transparent';
        el.style.backgroundImage = value;
    } else if (property === 'color') {
        el.style.webkitBackgroundClip = 'unset';
        el.style.webkitTextFillColor = 'unset';
        el.style.backgroundImage = 'none';
        el.style.color = value;
        updateHueFromColor(value);
    }
    setCurrentColor(value);
    if (onUpdate) onUpdate();
  }, [onUpdate]);

  // New function to update stroke color
  const updateStrokeStyle = useCallback((value) => {
    const el = elementRef.current;
    if (!el) return;
    
    // Apply stroke color to both border and text-stroke
    el.style.borderColor = value;
    el.style.WebkitTextStrokeColor = value;
    el.style.textStrokeColor = value;
    
    setStrokeColor(value);
    updateStrokeHueFromColor(value);
    
    // Reapply dashed style if it's active
    if (showDashedPanel) {
      applyDashedStyle();
    }
    
    if (onUpdate) onUpdate();
  }, [onUpdate, showDashedPanel, applyDashedStyle]);

  useEffect(() => {
    if (colorMode === 'Gradient') {
      const type = gradientType.toLowerCase() === 'linear' ? 'linear-gradient(to right, ' : 'radial-gradient(circle, ';
      const gradString = `${type}${gradientColors.map(c => `${c.hex} ${c.stop}%`).join(', ')})`;
      updateStyle('backgroundImage', gradString);
    }
  }, [gradientColors, colorMode, gradientType, updateStyle]);

  useEffect(() => {
    if (selectedElement) {
      const bgImg = selectedElement.style.backgroundImage;
      const col = selectedElement.style.color;
      const activeColor = (bgImg && bgImg !== 'none') ? bgImg : (col || '#000000');
      const op = getCurrentStyle('opacity') || '1';
      
      // Get stroke color from element
      const strokeCol = selectedElement.style.borderColor || 
                       selectedElement.style.WebkitTextStrokeColor || 
                       selectedElement.style.textStrokeColor || 
                       '#FF0000';
      
      setCurrentColor(activeColor);
      setStrokeColor(strokeCol);
      updateHueFromColor(activeColor);
      updateStrokeHueFromColor(strokeCol);
      setOpacity(Math.round(parseFloat(op) * 100));
    }
  }, [selectedElement, getCurrentStyle]);

  const addGradientStop = (e) => {
    const rect = gradientBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const newColors = [...gradientColors, { hex: '#9f9f9f', stop: pos }].sort((a, b) => a.stop - b.stop);
    setGradientColors(newColors);
  };

  const removeGradientStop = (index) => {
    if (gradientColors.length <= 2) return;
    setGradientColors(gradientColors.filter((_, i) => i !== index));
  };

  const updateStopColor = (index, hex) => {
    const newColors = [...gradientColors];
    newColors[index].hex = hex;
    setGradientColors(newColors);
  };

  const handleSaturationClick = (e) => {
    const rect = saturationRef.current.getBoundingClientRect();
    const s = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const v = Math.round((1 - (e.clientY - rect.top) / rect.height) * 100);
    const l = (v / 100) * (1 - s / 200);
    const sL = l === 0 || l === 1 ? 0 : ((v / 100 - l) / Math.min(l, 1 - l)) * 100;
    updateStyle('color', `hsl(${hue}, ${Math.round(sL)}%, ${Math.round(l * 100)}%)`);
  };

  // New function for stroke saturation click
  const handleStrokeSaturationClick = (e) => {
    const rect = strokeSaturationRef.current.getBoundingClientRect();
    const s = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const v = Math.round((1 - (e.clientY - rect.top) / rect.height) * 100);
    const l = (v / 100) * (1 - s / 200);
    const sL = l === 0 || l === 1 ? 0 : ((v / 100 - l) / Math.min(l, 1 - l)) * 100;
    updateStrokeStyle(`hsl(${strokeHue}, ${Math.round(sL)}%, ${Math.round(l * 100)}%)`);
  };

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) return;
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      if (showStrokeColorPanel) {
        updateStrokeStyle(result.sRGBHex);
      } else {
        updateStyle('color', result.sRGBHex);
      }
    } catch (e) { console.log(e); }
  };

  const resetColor = () => {
    if (showStrokeColorPanel) {
      updateStrokeStyle('#FF0000');
      setStrokeHue(0);
    } else {
      updateStyle('color', '#000000');
      setHue(0);
    }
    setColorMode('Solid');
  };

  const updateTextContent = (text) => {
    const el = elementRef.current;
    if (el) {
      el.textContent = text;
>>>>>>> b2152b5 (Add updated TextEditor component with Color Stroke logic)
      if (onUpdate) onUpdate();
    }
  };

<<<<<<< HEAD
  const toggleAutoLetterSpacing = () => {
    const newValue = letterSpacing === 'Auto' ? '2px' : 'Auto';
    setLetterSpacing(newValue);
    setStyle('letterSpacing', newValue === 'Auto' ? 'normal' : newValue);
  };

  const toggleAutoLineHeight = () => {
    const newValue = lineHeight === 'Auto' ? '1.5' : 'Auto';
    setLineHeight(newValue);
    setStyle('lineHeight', newValue === 'Auto' ? 'normal' : newValue);
  };

  return (
    <div className="w-full bg-white font-sans antialiased select-none overflow-x-hidden p-2">
      
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-[14px] font-bold text-gray-800">Dimension :</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-medium text-gray-500">W</span>
            <input 
              type="number"
              value={dims.w}
              onChange={(e) => handleDimChange('w', e.target.value)}
              className="w-[55px] h-[30px] border border-gray-300 rounded-lg text-[12px] font-medium text-gray-700 text-center outline-none focus:border-blue-400 appearance-none m-0"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-medium text-gray-500">H</span>
            <input 
              type="number"
              value={dims.h}
              onChange={(e) => handleDimChange('h', e.target.value)}
              className="w-[55px] h-[30px] border border-gray-300 rounded-lg text-[12px] font-medium text-gray-700 text-center outline-none focus:border-blue-400 appearance-none m-0"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-3">
        <button 
          onClick={() => setIsTextOpen(!isTextOpen)}
          className="w-full h-[52px] flex items-center px-4 justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Pencil size={18} className="text-gray-600" strokeWidth={2} />
            <span className="text-[15px] font-bold text-gray-700">Text</span>
          </div>
          {isTextOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>

        {isTextOpen && (
          <div className="px-4 pb-6 space-y-5">
            <div className="relative">
              <textarea
                className="w-full h-[95px] p-4 border border-gray-300 rounded-2xl text-[13px] font-medium text-gray-700 outline-none resize-none uppercase tracking-widest leading-relaxed"
                placeholder="WE ARE DEDICATED..."
                value={textValue} // Changed from defaultValue to value
                onChange={(e) => {
                  const val = e.target.value;
                  setTextValue(val);
                  const el = selectedElement;
                  if (el) {
                    el.textContent = val;
                    if (onUpdate) onUpdate();
                  }
                }}
              />
              <Pencil size={14} className="absolute bottom-4 right-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-gray-900 whitespace-nowrap">Typography</span>
              <div className="h-[1px] w-full bg-gray-200" />
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="relative col-span-8">
                <select 
                  onChange={(e) => setStyle('fontFamily', e.target.value)}
                  className="w-full h-11 pl-3 pr-8 border border-gray-300 rounded-xl appearance-none bg-white text-[14px] text-gray-700 outline-none focus:border-blue-400"
                >
                  {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative col-span-4">
                <select 
                  onChange={(e) => setStyle('fontSize', `${e.target.value}px`)}
                  defaultValue="24"
                  className="w-full h-11 pl-3 pr-8 border border-gray-300 rounded-xl appearance-none bg-white text-[14px] text-gray-700 outline-none focus:border-blue-400"
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative col-span-5">
                <select 
                  onChange={(e) => setStyle('fontWeight', e.target.value)}
                  defaultValue="600"
                  className="w-full h-11 pl-3 pr-8 border border-gray-300 rounded-xl appearance-none bg-white text-[14px] text-gray-700 outline-none focus:border-blue-400"
                >
                  {fontWeights.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="col-span-7 flex gap-1.5">
                <button 
                  onClick={toggleAutoLetterSpacing}
                  className="flex-1 h-11 border border-gray-300 rounded-xl flex items-center justify-between px-3 text-[13px] text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className={letterSpacing !== 'Auto' ? 'text-blue-600 font-bold' : ''}>{letterSpacing}</span>
                  <ArrowLeftRight size={14} className="text-gray-600" />
                </button>
                <button 
                  onClick={toggleAutoLineHeight}
                  className="flex-1 h-11 border border-gray-300 rounded-xl flex items-center justify-between px-3 text-[13px] text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <span className={lineHeight !== 'Auto' ? 'text-blue-600 font-bold' : ''}>{lineHeight}</span>
                  <ArrowUpDown size={14} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 relative">
              <button 
                onClick={() => toggleMenu('align')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${activeMenu === 'align' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <AlignCenter size={20} />
              </button>

              <button 
                onClick={() => toggleMenu('format')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${activeMenu === 'format' ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                B
              </button>

              <button 
                onClick={() => toggleMenu('case')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${activeMenu === 'case' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Minus size={20} />
              </button>

              <button 
                onClick={() => toggleMenu('list')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${activeMenu === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <List size={20} />
              </button>
            </div>

            {activeMenu && (
              <div className="bg-black p-1.5 rounded-xl flex gap-1.5 items-center shadow-lg w-fit transition-all duration-200">
                {activeMenu === 'align' && (
                  <>
                    <button onClick={() => setStyle('textAlign', 'left')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><AlignLeft size={18}/></button>
                    <button onClick={() => setStyle('textAlign', 'center')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><AlignCenter size={18}/></button>
                    <button onClick={() => setStyle('textAlign', 'right')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><AlignRight size={18}/></button>
                    <button onClick={() => setStyle('textAlign', 'justify')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><AlignJustify size={18}/></button>
                  </>
                )}
                {activeMenu === 'format' && (
                  <>
                    <button onClick={() => setStyle('fontWeight', 'bold')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black font-bold">B</button>
                    <button onClick={() => setStyle('fontStyle', 'italic')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><Italic size={18}/></button>
                    <button onClick={() => setStyle('textDecoration', 'underline')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><Underline size={18}/></button>
                    <button onClick={() => setStyle('textDecoration', 'line-through')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><Strikethrough size={18}/></button>
                  </>
                )}
                {activeMenu === 'case' && (
                  <>
                    <button onClick={() => setStyle('textTransform', 'none')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><Minus size={18}/></button>
                    <button onClick={() => setStyle('textTransform', 'capitalize')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black font-bold text-[13px]">Aa</button>
                    <button onClick={() => setStyle('textTransform', 'uppercase')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black font-bold text-[13px]">AB</button>
                    <button onClick={() => setStyle('textTransform', 'lowercase')} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black font-bold text-[13px]">ab</button>
                  </>
                )}
                {activeMenu === 'list' && (
                  <>
                    <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><List size={18}/></button>
                    <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100 text-black"><ListOrdered size={18}/></button>
                  </>
                )}
              </div>
            )}

            <div className="pt-2">
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
                <button 
                  onClick={() => setIsColorOpen(!isColorOpen)}
                  className="w-full h-[52px] flex items-center px-4 justify-between bg-white hover:bg-gray-50"
                >
                  <span className="text-[15px] font-bold text-gray-700">Color</span>
                  {isColorOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
                
                {isColorOpen && (
                  <div className="px-5 pb-6 space-y-4 border-t border-gray-100 pt-5 relative">
                    <div className="flex items-center">
                      <div className="w-14 flex items-center justify-between">
                         <span className="text-[14px] text-gray-600">Fill</span>
                         <span className="text-[14px] text-gray-600">:</span>
                      </div>
                      <div className="flex flex-1 items-center gap-3 ml-4">
                        <button 
                          onClick={() => setShowFillPicker(!showFillPicker)}
                          className="w-10 h-10 bg-black rounded-xl border border-gray-200 shadow-sm transition-transform active:scale-95" 
                        />
                        <div className="flex-1 h-10 border border-gray-400 rounded-xl flex items-center justify-between px-3 text-[13px] text-gray-700 bg-white">
                          #000000 <span className="text-gray-400">100%</span>
                        </div>
                      </div>
                    </div>

                    {showFillPicker && (
                      <div className="absolute left-0 right-0 top-[60px] z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="relative mb-4 w-fit">
                          <select className="appearance-none bg-white border border-gray-200 rounded-lg py-1 px-3 pr-8 text-[12px] font-bold text-gray-700 outline-none cursor-pointer">
                            <option>Solid</option>
                            <option>Gradient</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Colors on this page</span>
                            <div className="h-[1px] flex-1 bg-gray-100" />
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {['#FFFFFF', '#000000', '#FF0000', '#FFA500', '#8B0000', '#FFFF00', '#008000', '#006400', '#228B22', '#00FFFF', '#008080', '#000080'].map((c, i) => (
                              <button 
                                key={i} 
                                className="w-7 h-7 rounded-md border border-gray-100 shadow-sm hover:scale-110 transition-transform" 
                                style={{ backgroundColor: c }}
                                onClick={() => { setStyle('color', c); setShowFillPicker(false); }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Solid Colors</span>
                            <div className="h-[1px] flex-1 bg-gray-100" />
                          </div>
                          <div className="grid grid-cols-6 gap-2 overflow-y-auto max-h-[120px] pr-1 custom-scrollbar">
                            {[
                              '#FFFFFF', '#000000', '#FF0000', '#FFA500', '#A52A2A', '#FFFF00',
                              '#7FFF00', '#008000', '#2E8B57', '#00FFFF', '#20B2AA', '#008080',
                              '#ADD8E6', '#00BFFF', '#4169E1', '#0000FF', '#00008B', '#E6E6FA',
                              '#DA70D6', '#FF00FF', '#808080', '#D3D3D3', '#F5F5F5', '#555555'
                            ].map((c, i) => (
                              <button 
                                key={i} 
                                className="w-7 h-7 rounded-md border border-gray-100 shadow-sm hover:scale-110 transition-transform" 
                                style={{ backgroundColor: c }}
                                onClick={() => { setStyle('color', c); setShowFillPicker(false); }}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="w-7 h-7 rounded-full border border-gray-200" style={{ background: 'conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #FFFF00 60deg, #00FF00 120deg, #00FFFF 180deg, #0000FF 240deg, #FF00FF 300deg, #FF0000 360deg)' }} />
                            <span className="text-[13px] font-bold text-gray-700">Customize Colors</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <div className="w-14 flex items-center justify-between">
                         <span className="text-[14px] text-gray-600">Stoke</span>
                         <span className="text-[14px] text-gray-600">:</span>
                      </div>
                      <div className="flex flex-1 items-center gap-3 ml-4">
                        <div className="w-10 h-10 bg-white rounded-xl border border-gray-300 relative overflow-hidden flex items-center justify-center shadow-sm">
                          <div className="w-[140%] h-[1.5px] bg-red-500 rotate-45" />
                        </div>
                        <div className="flex-1 h-10 border border-gray-400 rounded-xl flex items-center justify-between px-3 text-[13px] text-gray-700 bg-white">
                          # <span className="text-gray-400">100%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center pt-1">
                      <div className="w-14 flex justify-center">
                        <SlidersHorizontal size={22} className="text-gray-600" />
                      </div>
                      <div className="flex flex-1 items-center gap-2 ml-4">
                        <div className="flex-[1.8] relative">
                          <select className="w-full h-10 pl-3 pr-8 border border-gray-400 rounded-xl appearance-none bg-white text-[13px] text-gray-700 outline-none focus:border-blue-400">
                            <option>Dashed</option>
                            <option>Solid</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="flex-1 h-10 border border-gray-400 rounded-xl flex items-center justify-between px-3 text-[13px] text-gray-700 bg-white">
                          <List size={16} className="text-gray-400" /> 
                          <span className="font-medium">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
=======
  const presetColors = [
    '#FFFFFF', '#000000', '#FF0000', '#FF8C00', '#B22222', '#FFFF00',
    '#ADFF2F', '#228B22', '#008080', '#40E0D0', '#00CED1', '#008080',
    '#ADD8E6', '#87CEEB', '#0000FF', '#00008B', '#E6E6FA', '#FF00FF',
    '#A9A9A9', '#D3D3D3', '#FFFFFF', '#333333'
  ];

  const presetGradients = [
    'linear-gradient(to right, #63D0CD 0%, #4B3EFE 100%)',
    'linear-gradient(to right, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(to right, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(to right, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(to right, #e0c3fc 0%, #8ec5fc 100%)'
  ];

  const renderCommonOptions = () => {
    if (!activeMenu) return null;
    const menuItems = {
      align: [
        { icon: AlignLeft, prop: 'textAlign', val: 'left', def: '' },
        { icon: AlignCenter, prop: 'textAlign', val: 'center', def: '' },
        { icon: AlignRight, prop: 'textAlign', val: 'right', def: '' },
        { icon: AlignJustify, prop: 'textAlign', val: 'justify', def: '' }
      ],
      style: [
        { icon: Bold, prop: 'fontWeight', val: '700', def: '400' },
        { icon: Italic, prop: 'fontStyle', val: 'italic', def: 'normal' },
        { icon: Underline, prop: 'textDecorationLine', val: 'underline', def: 'none' },
        { icon: Strikethrough, prop: 'textDecorationLine', val: 'line-through', def: 'none' }
      ],
      case: [
        { icon: Minus, prop: 'textTransform', val: 'none', def: 'none' },
        { icon: CaseSensitive, prop: 'textTransform', val: 'capitalize', def: 'none' },
        { icon: CaseUpper, prop: 'textTransform', val: 'uppercase', def: 'none' },
        { icon: CaseLower, prop: 'textTransform', val: 'lowercase', def: 'none' }
      ],
      list: [
        { icon: List, prop: 'listStyleType', val: 'disc', def: 'none' },
        { icon: List, prop: 'listStyleType', val: 'circle', def: 'none' },
        { icon: ListOrdered, prop: 'listStyleType', val: 'decimal', def: 'none' }
      ]
    };

    return (
      <div className="mt-4 bg-[#111111] rounded-2xl p-2 flex gap-2 w-fit">
        {menuItems[activeMenu].map((item, i) => {
          const currentVal = getCurrentStyle(item.prop);
          let isActive = (currentVal === item.val && currentVal !== 'none' && currentVal !== 'normal' && currentVal !== '');
          if (item.prop === 'fontWeight') isActive = (currentVal === '700' || currentVal === 'bold');
          return (
            <button key={i} onClick={() => updateStyle(item.prop, isActive ? item.def : item.val)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isActive ? 'bg-[#6366f1] text-white' : 'bg-white text-black hover:bg-gray-200'}`}>
              <item.icon size={18} strokeWidth={isActive ? 3 : 2.5} />
            </button>
          );
        })}
      </div>
    );
  };

  // Function to render color panel (reusable for both fill and stroke)
  const renderColorPanel = (isStroke = false) => {
    const currentMode = isStroke ? strokeColorMode : colorMode;
    const currentHue = isStroke ? strokeHue : hue;
    const currentColorValue = isStroke ? strokeColor : currentColor;
    const setCurrentMode = isStroke ? setStrokeColorMode : setColorMode;
    const saturationRefToUse = isStroke ? strokeSaturationRef : saturationRef;
    const handleSaturationClickToUse = isStroke ? handleStrokeSaturationClick : handleSaturationClick;
    const updateColorFunction = isStroke ? updateStrokeStyle : (color) => updateStyle('color', color);

    return (
      <div className="p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {currentMode === 'Solid' ? (
          <>
            <div className="mb-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div 
                ref={saturationRefToUse}
                className="w-full h-32 rounded-xl relative overflow-hidden border border-gray-100 cursor-crosshair shadow-inner"
                style={{ backgroundColor: `hsl(${currentHue}, 100%, 50%)` }}
                onMouseDown={handleSaturationClickToUse}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              </div>
              <input type="range" min="0" max="360" value={currentHue}
                onChange={(e) => { 
                  if (isStroke) {
                    setStrokeHue(e.target.value); 
                    updateStrokeStyle(`hsl(${e.target.value}, 100%, 50%)`);
                  } else {
                    setHue(e.target.value); 
                    updateStyle('color', `hsl(${e.target.value}, 100%, 50%)`);
                  }
                }}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500" />
            </div>
            <div className="grid grid-cols-6 gap-2 mb-4">
              {presetColors.map((color, idx) => (
                <button key={idx} className="w-full aspect-square rounded-lg border border-gray-100 hover:ring-2 ring-indigo-100 transition-all shadow-sm"
                  style={{ backgroundColor: color }} onClick={() => updateColorFunction(color)} />
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-6 gap-2">
              {presetGradients.map((grad, idx) => (
                <button key={idx} className="w-full aspect-square rounded-lg border border-gray-100 shadow-sm"
                  style={{ background: grad }} onClick={() => updateColorFunction(grad)} />
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">Customize</span>
                 <div className="flex gap-2">
                    <button onClick={() => setGradientColors([...gradientColors].reverse())} className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50"><ArrowLeftRight size={14} /></button>
                    <button onClick={() => setGradientColors([...gradientColors, {hex: '#ffffff', stop: 50}].sort((a,b)=>a.stop-b.stop))} className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50"><Plus size={14} /></button>
                 </div>
              </div>

              <div 
                ref={gradientBarRef}
                onClick={addGradientStop}
                className="relative h-6 w-full rounded-md border border-gray-100 shadow-inner cursor-copy" 
                style={{ background: `linear-gradient(to right, ${gradientColors.map(c => `${c.hex} ${c.stop}%`).join(', ')})` }}>
                {gradientColors.map((c, i) => (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ left: `${c.stop}%` }}>
                    <div className="w-3.5 h-3.5 rounded-sm border-2 border-white shadow-md" style={{ backgroundColor: c.hex }} />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                 {gradientColors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 flex items-center justify-between p-2.5 border border-gray-200 rounded-xl bg-white shadow-sm">
                        <div className="flex items-center gap-2">
                          <input type="color" value={c.hex} onChange={(e) => updateStopColor(i, e.target.value)} className="w-5 h-5 rounded cursor-pointer p-0 border-none bg-transparent" />
                          <span className="text-[11px] font-mono font-bold text-gray-600 uppercase">{c.hex}</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400">{c.stop}%</span>
                      </div>
                      {gradientColors.length > 2 && (
                        <button onClick={() => removeGradientStop(i)} className="p-1 text-gray-300 hover:text-red-400"><MinusCircle size={18} /></button>
                      )}
                    </div>
                 ))}
>>>>>>> b2152b5 (Add updated TextEditor component with Color Stroke logic)
              </div>
            </div>
          </div>
        )}
      </div>
<<<<<<< HEAD

      <div className="space-y-2">
        <div className="h-[52px] rounded-xl border border-gray-200 flex items-center px-4 justify-between bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <MousePointer2 size={18} className="text-gray-600" />
            <span className="text-[15px] font-bold text-gray-700">Interaction</span>
          </div>
          <ChevronDown size={18} className="text-gray-400" />
        </div>
      </div>
=======
    );
  };

  return (
    <div className="relative w-full max-w-full space-y-3 font-sans antialiased text-gray-800 p-1">
      
      {/* Fill Color Panel Popup */}
      <div 
        className={`fixed top-[5%] right-[320px] w-[280px] bg-white border border-gray-200 rounded-[24px] shadow-2xl z-[100] transition-all duration-300 ease-out transform ${
          showColorPanel ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 w-full pr-8">
            <div className="relative flex-1">
              <select 
                className="w-full appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-xl text-[12px] font-bold bg-white focus:outline-none cursor-pointer"
                value={colorMode}
                onChange={(e) => setColorMode(e.target.value)}
              >
                <option>Solid</option>
                <option>Gradient</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
            
            {colorMode === 'Gradient' && (
              <div className="relative flex-1">
                <select 
                  className="w-full appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-xl text-[12px] font-bold bg-white focus:outline-none cursor-pointer"
                  value={gradientType}
                  onChange={(e) => setGradientType(e.target.value)}
                >
                  <option>Linear</option>
                  <option>Radial</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            )}
            
            <div className="flex items-center gap-1.5 ml-1">
              <Pipette size={14} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={handleEyeDropper} />
              <RotateCcw size={13} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={resetColor} />
            </div>
          </div>
          <X size={18} className="absolute right-4 top-5 cursor-pointer text-gray-300 hover:text-gray-500" onClick={() => { setShowColorPanel(false); }} />
        </div>

        {renderColorPanel(false)}
      </div>

      {/* Stroke Color Panel Popup */}
      <div 
        className={`fixed top-[20%] right-[320px] w-[280px] bg-white border border-gray-200 rounded-[24px] shadow-2xl z-[100] transition-all duration-300 ease-out transform ${
          showStrokeColorPanel ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 w-full pr-8">
            <div className="relative flex-1">
              <select 
                className="w-full appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-xl text-[12px] font-bold bg-white focus:outline-none cursor-pointer"
                value={strokeColorMode}
                onChange={(e) => setStrokeColorMode(e.target.value)}
              >
                <option>Solid</option>
                <option>Gradient</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
            
            {strokeColorMode === 'Gradient' && (
              <div className="relative flex-1">
                <select 
                  className="w-full appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-xl text-[12px] font-bold bg-white focus:outline-none cursor-pointer"
                  value={gradientType}
                  onChange={(e) => setGradientType(e.target.value)}
                >
                  <option>Linear</option>
                  <option>Radial</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            )}
            
            <div className="flex items-center gap-1.5 ml-1">
              <Pipette size={14} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={handleEyeDropper} />
              <RotateCcw size={13} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition-colors" onClick={resetColor} />
            </div>
          </div>
          <X size={18} className="absolute right-4 top-5 cursor-pointer text-gray-300 hover:text-gray-500" onClick={() => { setShowStrokeColorPanel(false); }} />
        </div>

        {renderColorPanel(true)}
      </div>

      {/* Dashed Popup Panel */}
      <div 
        className={`fixed top-[20%] right-[320px] w-[240px] bg-white border border-gray-200 rounded-[24px] shadow-2xl z-[110] transition-all duration-300 ${
          showDashedPanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
            <span className="text-[14px] font-bold text-gray-800">Dashed</span>
            <X size={16} className="text-gray-400 cursor-pointer" onClick={() => setShowDashedPanel(false)} />
        </div>
        <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-gray-700">Length :</span>
                <div className="flex items-center gap-2">
                    <ChevronLeft size={16} className="text-gray-400 cursor-pointer" onClick={() => setDashLength(Math.max(1, dashLength - 1))} />
                    <div className="w-12 py-1 border border-gray-200 rounded-lg text-center text-[13px] font-bold">{dashLength}</div>
                    <ChevronRight size={16} className="text-gray-400 cursor-pointer" onClick={() => setDashLength(dashLength + 1)} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-gray-700">Gap :</span>
                <div className="flex items-center gap-2">
                    <ChevronLeft size={16} className="text-gray-400 cursor-pointer" onClick={() => setDashGap(Math.max(0, dashGap - 1))} />
                    <div className="w-12 py-1 border border-gray-200 rounded-lg text-center text-[13px] font-bold">{dashGap}</div>
                    <ChevronRight size={16} className="text-gray-400 cursor-pointer" onClick={() => setDashGap(dashGap + 1)} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-gray-700">Round Corners :</span>
                <div 
                    onClick={() => setIsRoundCorners(!isRoundCorners)}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isRoundCorners ? 'bg-indigo-600' : 'bg-gray-200'}`}
                >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isRoundCorners ? 'left-6' : 'left-1'}`} />
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <Edit3 size={18} className="text-gray-600" />
            <span className="font-bold text-[15px] text-gray-800">Text</span>
          </div>
          <ChevronDown size={20} className={`text-gray-400 cursor-pointer transition-transform duration-300 ${isTextOpen ? 'rotate-180' : ''}`} onClick={() => setIsTextOpen(!isTextOpen)} />
        </div>

        {isTextOpen && (
          <div className="p-5 space-y-6">
            <textarea value={selectedElement?.textContent || ''} onChange={(e) => updateTextContent(e.target.value)}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] tracking-[0.15em] font-bold text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-50/50" rows="3" />

            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-gray-900">Typography</span>
              <div className="h-[1px] flex-grow bg-gray-100" />
            </div>

            <div className="flex gap-2.5">
              <div className="flex-[2] relative group">
                <select className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-2xl text-sm appearance-none bg-white font-medium shadow-sm hover:border-gray-300 transition-colors" value={getCurrentStyle('fontFamily').split(',')[0]} onChange={(e) => updateStyle('fontFamily', e.target.value)}>
                  {fontFamilies.map(f => <option key={f}>{f}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 pointer-events-none transition-colors" />
              </div>
              <div className="flex-[1.2] relative group">
                <select className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-2xl text-sm appearance-none bg-white font-medium shadow-sm hover:border-gray-300 transition-colors" value={parseInt(getCurrentStyle('fontSize')) || 12} onChange={(e) => updateStyle('fontSize', e.target.value + 'px')}>
                  {[8, 12, 14, 16, 20, 24, 32, 40, 48].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 pointer-events-none transition-colors" />
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="flex-[1.5] relative group">
                <select 
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-2xl text-sm appearance-none bg-white font-medium shadow-sm hover:border-gray-300 transition-colors" 
                  value={getCurrentStyle('fontWeight')} 
                  onChange={(e) => updateStyle('fontWeight', e.target.value)}
                >
                   {fontWeights.map(w => {
                     const weightMap = { 'Light': '300', 'Regular': '400', 'Medium': '500', 'Semi Bold': '600', 'Bold': '700' };
                     return <option key={w} value={weightMap[w]}>{w}</option>
                   })}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex-1 relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MoveHorizontal size={14} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-2xl text-sm bg-white font-medium shadow-sm hover:border-gray-300 focus:outline-none" 
                  placeholder="Auto"
                  onChange={(e) => updateStyle('letterSpacing', e.target.value + 'px')}
                />
              </div>

              <div className="flex-1 relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <ArrowUpDown size={14} />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-2xl text-sm bg-white font-medium shadow-sm hover:border-gray-300 focus:outline-none" 
                  placeholder="Auto"
                  onChange={(e) => updateStyle('lineHeight', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              {['align', 'style', 'case', 'list'].map((menu, idx) => {
                const Icon = [AlignJustify, Bold, Minus, List][idx];
                return (
                  <button key={menu} onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                    className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all shadow-sm ${activeMenu === menu ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'}`}>
                    <Icon size={19} />
                  </button>
                );
              })}
            </div>

            {renderCommonOptions()}

            <div className="border border-gray-100 rounded-[20px] p-4 bg-white shadow-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[14px] font-bold text-gray-800">Color</span>
                <span className={`cursor-pointer transition-transform duration-300 ${isColorOpen ? 'rotate-180' : ''}`} onClick={() => setIsColorOpen(!isColorOpen)}>
                   <ChevronDown size={18} />
                </span>
              </div>
              
              {isColorOpen && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-[45px]">
                      <span className="text-[13px] font-medium text-gray-800">Fill</span>
                      <span className="text-gray-400">:</span>
                    </div>
                    <div className="w-10 h-10 rounded-[10px] bg-black border border-gray-200 shadow-sm cursor-pointer shrink-0" 
                         style={{ background: currentColor }} 
                         onClick={() => { setShowColorPanel(!showColorPanel); setShowStrokeColorPanel(false); }} />
                    <div className="flex-1 flex items-center justify-between px-4 py-2 border border-gray-300 rounded-[10px] bg-white cursor-pointer" onClick={() => { setShowColorPanel(!showColorPanel); setShowStrokeColorPanel(false); }}>
                      <span className="text-[13px] font-medium text-gray-600 uppercase tracking-wide">
                        {currentColor.includes('gradient') ? 'Gradient' : (currentColor === '#000000' ? '#000000' : currentColor)}
                      </span>
                      <span className="text-[13px] font-medium text-gray-400">100%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 w-[45px]">
                      <span className="text-[13px] font-medium text-gray-800">Stoke</span>
                      <span className="text-gray-400">:</span>
                    </div>
                    <div 
                      className="w-10 h-10 rounded-[10px] border border-gray-300 flex items-center justify-center bg-white overflow-hidden relative shrink-0 cursor-pointer"
                      onClick={() => { setShowStrokeColorPanel(!showStrokeColorPanel); setShowColorPanel(false); }}
                    >
                      <div className="w-full h-[1.5px]" style={{ backgroundColor: strokeColor }} />
                    </div>
                    <div 
                      className="flex-1 flex items-center justify-between px-4 py-2 border border-gray-300 rounded-[10px] bg-white cursor-pointer"
                      onClick={() => { setShowStrokeColorPanel(!showStrokeColorPanel); setShowColorPanel(false); }}
                    >
                      <span className="text-[13px] font-medium text-gray-600 uppercase tracking-wide">
                        {strokeColor.includes('gradient') ? 'Gradient' : (strokeColor === '#FF0000' ? '#FF0000' : strokeColor)}
                      </span>
                      <span className="text-[13px] font-medium text-gray-400">100%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-[45px]" /> 
                    <div className="flex items-center gap-3 w-full">
                        <div className="shrink-0 text-gray-500 cursor-pointer">
                          <SlidersHorizontal size={18} onClick={() => setShowDashedPanel(!showDashedPanel)} />
                        </div>
                        
                        <div className="flex-1 relative">
                          <select 
                            className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-[10px] text-[13px] font-medium text-gray-700 appearance-none bg-white focus:outline-none"
                            onChange={(e) => handleBorderStyleChange(e.target.value)}
                          >
                            <option value="Dashed">Dashed</option>
                            <option value="Solid">Solid</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="w-[70px] relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                             <AlignJustify size={14} />
                          </div>
                          <input 
                            type="text" 
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-[10px] text-[13px] font-medium text-gray-700 bg-white" 
                            value={dashWidth}
                            onChange={(e) => { 
                              const newWidth = parseInt(e.target.value) || 1;
                              setDashWidth(newWidth); 
                              applyDashedStyle(); 
                            }}
                          />
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-[24px] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <MousePointer2 size={18} className="text-gray-600" />
            <span className="font-bold text-[15px] text-gray-800">Interaction</span>
          </div>
          <ChevronDown size={20} className={`text-gray-400 cursor-pointer transition-transform duration-300 ${isInteractionOpen ? 'rotate-180' : ''}`} onClick={() => setIsInteractionOpen(!isInteractionOpen)} />
        </div>

        {isInteractionOpen && (
          <div className="p-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="pl-4 pr-10 py-2.5 bg-[#f8f9fb] border border-transparent rounded-[14px] text-[13px] font-medium text-[#6b7280] appearance-none focus:outline-none cursor-pointer"
                  value={interactionType}
                  onChange={(e) => updateInteraction(e.target.value, targetPage)}
                >
                  <option>None</option>
                  <option>Navigate</option>
                  <option>Open Link</option>
                  <option>Call</option>
                </select>
                <ArrowLeftRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
              </div>

              {interactionType !== 'None' && (
                <div className="relative animate-in fade-in slide-in-from-left-2 duration-300">
                  <select className="pl-4 pr-10 py-2.5 bg-[#f8f9fb] border border-transparent rounded-[14px] text-[13px] font-medium text-[#6b7280] appearance-none focus:outline-none cursor-pointer">
                    <option>Click</option>
                    <option>Hover</option>
                  </select>
                  <ArrowLeftRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="bg-[#f3f4f6] px-3.5 py-2 rounded-xl border border-transparent text-[13px] font-medium text-[#4b5563]">
                Text
              </div>
              
              <div className="flex-grow mx-5 flex items-center">
                <div className="w-full border-t border-dashed border-[#d1d5db] relative">
                  <div className="absolute right-0 -top-[4px] border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-[#9ca3af]"></div>
                </div>
              </div>

              {interactionType === 'Navigate' ? (
                <div className="relative animate-in fade-in zoom-in-95 duration-300">
                   <select 
                    className="w-[110px] pl-4 pr-10 py-2 bg-white border border-[#d1d5db] rounded-[14px] text-[13px] font-medium text-[#374151] appearance-none focus:outline-none cursor-pointer"
                    value={targetPage}
                    onChange={(e) => updateInteraction(interactionType, e.target.value)}
                   >
                    <option>Page 1</option>
                    <option>Page 2</option>
                    <option>Page 3</option>
                    <option>Page 4</option>
                    <option>Page 5</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4b5563] pointer-events-none" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-[#f8f9fb] rounded-[14px] border border-transparent flex items-center justify-center text-[#9ca3af] text-[18px] font-medium">
                  ?
                </div>
              )}
            </div>

            <div className="h-[1px] w-full bg-[#f3f4f6]" />

            <div className="flex items-center gap-3.5 pt-2">
              <div className="w-7 h-7 rounded-full border-2 border-[#6366f1] flex items-center justify-center bg-white cursor-pointer transition-colors shadow-sm">
                <div className="w-3.5 h-3.5 bg-[#6366f1] rounded-full"></div>
              </div>
              <span className="text-[14px] font-medium text-[#6b7280]">Highlight the Component</span>
            </div>
          </div>
        )}
      </div>

      {['Animation'].map((label) => (
        <div key={label} className="bg-white border border-gray-200 rounded-[20px] shadow-sm overflow-hidden group">
          <button className="w-full flex items-center justify-between p-4 px-5 text-gray-500 group-hover:text-gray-800 transition-colors">
            <span className="font-bold text-[14px]">{label}</span>
            <ChevronDown size={18} className="text-gray-300 group-hover:text-gray-400" />
          </button>
        </div>
      ))}
>>>>>>> b2152b5 (Add updated TextEditor component with Color Stroke logic)
    </div>
  );
};

export default TextEditor;
// VideoEditor.jsx - Context-sensitive video editing panel
import React, { useRef } from 'react';
import {
  Video as VideoIcon, Upload, RefreshCw, Trash2,
  Sliders, Play, Pause, Volume2, VolumeX, Repeat
} from 'lucide-react';
import InteractionPanel from './InteractionPanel';

const VideoEditor = ({ selectedElement, onUpdate, onPopupPreviewUpdate }) => {
  const fileInputRef = useRef(null);

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        <VideoIcon className="mx-auto mb-2" size={32} />
        <p>Click on a video to edit</p>
      </div>
    );
  }

  const getCurrentStyle = (property) => {
    if (!selectedElement) return '';
    return window.getComputedStyle(selectedElement)[property] || '';
  };

  const updateStyle = (property, value) => {
    if (!selectedElement) return;
    selectedElement.style[property] = value;
    if (onUpdate) onUpdate();
  };

  const hasAttribute = (attr) => {
    if (!selectedElement) return false;
    return selectedElement.hasAttribute(attr);
  };

  const toggleAttribute = (attr) => {
    if (!selectedElement) return;
    if (selectedElement.hasAttribute(attr)) {
      selectedElement.removeAttribute(attr);
    } else {
      selectedElement.setAttribute(attr, '');
    }
    // For specific functional attributes, we might need to update properties directly too
    if (attr === 'muted') selectedElement.muted = !selectedElement.muted;
    if (attr === 'loop') selectedElement.loop = !selectedElement.loop;
    if (attr === 'controls') selectedElement.controls = !selectedElement.controls;
    // Autoplay usually requires reload or specific handling, but attr is key for template
    if (attr === 'autoplay') selectedElement.autoplay = !selectedElement.autoplay;

    if (onUpdate) onUpdate();
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (selectedElement && selectedElement.tagName === 'VIDEO') {
        selectedElement.src = event.target.result;
        // Store filename for display
        selectedElement.setAttribute('data-filename', file.name);

        // Optionally update source child if exists (common in HTML5 video)
        const source = selectedElement.querySelector('source');
        if (source) source.src = event.target.result;

        selectedElement.load(); // Reload video to show new source
        if (onUpdate) onUpdate();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    if (!selectedElement) return;
    if (confirm('Delete this video?')) {
      selectedElement.remove();
      if (onUpdate) onUpdate();
    }
  };

  const resetSize = () => {
    if (!selectedElement) return;
    selectedElement.style.width = '';
    selectedElement.style.height = '';
    if (onUpdate) onUpdate();
  };

  // Helper to get display name
  const getDisplayName = () => {
    if (!selectedElement) return "No video selected";
    const filename = selectedElement.getAttribute('data-filename');
    if (filename) return filename;

    const src = selectedElement.currentSrc || selectedElement.src;
    if (!src) return "No source";

    if (src.startsWith('data:')) return "Uploaded Video (Data)";
    return src.split('/').pop();
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* Video Preview / Info */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <VideoIcon size={14} />
          Selected Video
        </label>
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs break-all text-gray-500 font-mono" title={selectedElement.src}>
          {getDisplayName()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleReplace}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Upload size={16} />
          Upload / Replace Video
        </button>

        <button
          onClick={resetSize}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw size={16} />
          Reset Size
        </button>

        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors"
        >
          <Trash2 size={16} />
          Delete Video
        </button>
      </div>

      {/* Playback Settings */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <span className="text-xs font-semibold text-gray-700">Playback Settings</span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => toggleAttribute('autoplay')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${hasAttribute('autoplay') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <Play size={14} />
            <span className="text-xs">Autoplay</span>
          </button>

          <button
            onClick={() => toggleAttribute('loop')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${hasAttribute('loop') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <Repeat size={14} />
            <span className="text-xs">Loop</span>
          </button>

          <button
            onClick={() => toggleAttribute('muted')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${hasAttribute('muted') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            {hasAttribute('muted') ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="text-xs">Muted</span>
          </button>

          <button
            onClick={() => toggleAttribute('controls')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-colors ${hasAttribute('controls') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <Sliders size={14} />
            <span className="text-xs">Controls</span>
          </button>
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">Dimension</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-600">W</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={parseInt(getCurrentStyle('width')) || selectedElement?.videoWidth || 0}
                onChange={(e) => updateStyle('width', e.target.value + 'px')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-600">H</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={parseInt(getCurrentStyle('height')) || selectedElement?.videoHeight || 0}
                onChange={(e) => updateStyle('height', e.target.value + 'px')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Adjustments */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Sliders size={14} />
          <span className="text-xs font-semibold text-gray-700">Adjustments</span>
        </div>

        {/* Opacity */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-600">Opacity</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={parseFloat(getCurrentStyle('opacity') || '1') * 100}
              onChange={(e) => updateStyle('opacity', e.target.value / 100)}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs text-gray-600 w-12 text-right">
              {Math.round(parseFloat(getCurrentStyle('opacity') || '1') * 100)}%
            </span>
          </div>
        </div>

        {/* Border Radius */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-600">Border Radius</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="50"
              value={parseInt(getCurrentStyle('borderRadius')) || 0}
              onChange={(e) => updateStyle('borderRadius', e.target.value + 'px')}
              className="flex-1 accent-indigo-600"
            />
            <span className="text-xs text-gray-600 w-12 text-right">
              {parseInt(getCurrentStyle('borderRadius')) || 0}px
            </span>
          </div>
        </div>
      </div>

      {/* Interaction Panel */}
      <InteractionPanel
        selectedElement={selectedElement}
        onUpdate={onUpdate}
        onPopupPreviewUpdate={onPopupPreviewUpdate}
      />
    </div>
  );
};

export default VideoEditor;

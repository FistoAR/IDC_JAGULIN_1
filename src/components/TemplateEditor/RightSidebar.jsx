import React from 'react';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';
import VideoEditor from './VideoEditor';

import { Layers, Edit3, Eye, Video as VideoIcon } from 'lucide-react';

const RightSidebar = ({
  selectedElement,
  selectedElementType,
  onUpdate,
  isDoublePage,
  setIsDoublePage,
  openPreview,
  onPopupPreviewUpdate,
  closePanelsSignal
}) => {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto custom-scrollbar flex flex-col flex-shrink-0">

      {/* ================= Display Controls ================= */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDoublePage && setIsDoublePage(!isDoublePage)}
              className={`relative inline-flex h-6 w-11 rounded-full transition-colors
                ${isDoublePage ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-5 w-5 bg-white rounded-full transition-transform
                  ${isDoublePage ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Double Page
            </span>
          </div>

          <button
            onClick={openPreview}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5"
          >
            <Eye size={14} /> Preview
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Dimension :</span>
          <div className="flex gap-3">
            <div className="text-xs border px-2 py-1 rounded">W 210</div>
            <div className="text-xs border px-2 py-1 rounded">H 297</div>
          </div>
        </div>
      </div>

      {/* ================= Properties Header ================= */}
      <div className="p-4 border-b border-gray-200 flex justify-between">
        <div className="flex items-center gap-2">
          {selectedElementType === 'text' ? (
            <Edit3 size={16} className="text-blue-500" />
          ) : selectedElementType === 'video' ? (
            <VideoIcon size={16} className="text-purple-500" />
          ) : (
            <Layers size={16} />
          )}
          <h3 className="font-semibold">
            {selectedElementType
              ? `${selectedElementType} Properties`
              : 'Properties'}
          </h3>
        </div>

        {selectedElementType && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">
            {selectedElementType}
          </span>
        )}
      </div>

      {/* ================= Editors + Interaction ================= */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {selectedElementType === 'text' && (
          <TextEditor
            selectedElement={selectedElement}
            onUpdate={onUpdate}
            onPopupPreviewUpdate={onPopupPreviewUpdate}
            closePanelsSignal={closePanelsSignal}
          />
        )}

        {selectedElementType === 'image' && (
          <ImageEditor
            selectedElement={selectedElement}
            onUpdate={onUpdate}
            onPopupPreviewUpdate={onPopupPreviewUpdate}
          />
        )}

        {selectedElementType === 'video' && (
          <VideoEditor
            selectedElement={selectedElement}
            onUpdate={onUpdate}
            onPopupPreviewUpdate={onPopupPreviewUpdate}
          />
        )}



        {!selectedElementType && (
          <div className="text-center text-gray-400 pt-20">
            <Layers size={40} className="mx-auto opacity-20" />
            <p className="mt-2 text-sm">No element selected</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;

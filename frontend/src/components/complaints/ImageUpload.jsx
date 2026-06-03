import { useCallback, useState } from 'react';

/**
 * ImageUpload — Drag-and-drop + file picker for complaint images
 * Max 3 images, 5MB each
 */
const ImageUpload = ({ onChange, maxFiles = 3 }) => {
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const processFiles = useCallback((newFiles) => {
    const valid = Array.from(newFiles).filter(
      (f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
    );
    const combined = [...files, ...valid].slice(0, maxFiles);
    setFiles(combined);
    onChange(combined);

    // Generate previews
    const readers = combined.map(
      (f) =>
        new Promise((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target.result);
          reader.readAsDataURL(f);
        })
    );
    Promise.all(readers).then(setPreviews);
  }, [files, maxFiles, onChange]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
    setPreviews((p) => p.filter((_, i) => i !== idx));
    onChange(updated);
  };

  return (
    <div>
      {/* Drop zone */}
      {files.length < maxFiles && (
        <label
          className={`upload-zone block cursor-pointer ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => processFiles(e.target.files)}
          />
          <div className="text-3xl mb-2">📸</div>
          <p className="text-navy-600 font-semibold text-sm">
            Drop images here or <span className="text-saffron-600 underline">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Max {maxFiles} images · 5MB each · JPG, PNG, GIF, WebP
          </p>
          <p className="text-xs text-gray-400">
            {files.length}/{maxFiles} uploaded
          </p>
        </label>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {previews.map((src, idx) => (
            <div key={idx} className="relative group">
              <img
                src={src}
                alt={`Preview ${idx + 1}`}
                className="w-24 h-24 object-cover rounded-gov border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CATEGORIES, OCCASIONS, SEASONS, COLORS } from '../utils/constants';
import { FiX, FiUpload } from 'react-icons/fi';

// Helper: compress image to stay under Firestore's 1 MB doc limit
function compressImage(dataUrl, maxWidth = 600, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function AddClothingModal({ onClose, onSave, editItem }) {
  const [category, setCategory] = useState(editItem?.category || '');
  const [color, setColor] = useState(editItem?.color || '');
  const [occasion, setOccasion] = useState(editItem?.occasion || '');
  const [season, setSeason] = useState(editItem?.season || '');
  const [cost, setCost] = useState(editItem?.cost || '');
  const [imageUrl, setImageUrl] = useState(editItem?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useRef — demonstrates useRef for file input
  const fileInputRef = useRef(null);

  // useCallback — demonstrates useCallback for memoized handler
  const handleImageUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const compressed = await compressImage(reader.result);
        setImageUrl(compressed);
      } catch {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !color || !occasion || !season) {
      setError('Please fill in all required fields (Category, Color, Occasion, Season).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('Submitting clothing:', { category, color, occasion, season, cost });
      await onSave({ category, color, occasion, season, cost: Number(cost) || 0, imageUrl });
      console.log('Save successful, closing modal');
      onClose();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "w-full px-5 py-4 rounded-2xl border border-white/20 dark:border-white/5 bg-surface-50/50 dark:bg-dark-bg/50 text-surface-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 text-sm font-medium";

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative glass-card w-full max-w-lg max-h-[90vh] flex flex-col shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-slide-up bg-white/95 dark:bg-dark-surface/95 overflow-hidden">
        {/* Fixed Header */}
        <div className="p-6 border-b border-surface-100 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-dark-surface/50 backdrop-blur-2xl">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">
              {editItem ? 'Edit Item' : 'New Clothing'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary-500">Wardrobe Registry</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-dark-card text-surface-500 transition-all duration-300 group"
          >
            <FiX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Error banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-300 text-sm font-medium animate-fade-in">
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image upload */}
            <div className="flex flex-col items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-48 rounded-[40px] border-4 border-dashed border-primary-500/20 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-500 overflow-hidden bg-surface-50 dark:bg-dark-bg group/upload"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/upload:scale-110" />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-[24px] bg-primary-500/10 flex items-center justify-center mx-auto mb-4 text-primary-500 group-hover/upload:scale-110 transition-transform">
                      <FiUpload size={32} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-surface-400 group-hover/upload:text-primary-500 transition-colors">Select Visual</span>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Category select */}
            <div>
              <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-3 ml-1">Category *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required className={selectClass}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-3 ml-1">Color *</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button type="button" key={c.name} onClick={() => setColor(c.name)}
                    className={`w-10 h-10 rounded-full border-4 transition-all duration-300 ${color === c.name ? 'border-primary-500 scale-125 shadow-lg ring-4 ring-primary-500/20' : 'border-white dark:border-white/10 hover:scale-110 shadow-sm'}`}
                    style={{ backgroundColor: c.hex }} title={c.name} />
                ))}
              </div>
              {color && <p className="text-xs font-bold text-primary-500 mt-3 uppercase tracking-wider">Active: {color}</p>}
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-3 ml-1">Occasion *</label>
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)} required className={selectClass}>
                <option value="">Select occasion</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Season */}
            <div>
              <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-3 ml-1">Season *</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)} required className={selectClass}>
                <option value="">Select season</option>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-xs font-black text-surface-400 uppercase tracking-widest mb-3 ml-1">Cost (₹)</label>
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} min="0"
                className={selectClass} placeholder="e.g., 999" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-black rounded-2xl shadow-2xl shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 btn-glow text-lg uppercase tracking-widest">
              {loading ? 'Processing...' : editItem ? 'Update Registry' : 'Commit to Wardrobe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

import { useState, useCallback, useRef, useMemo } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { useOutfits } from '../context/OutfitContext';
import ClothingCard from '../components/ClothingCard';
import EmptyState from '../components/EmptyState';
import { OCCASIONS, COLORS } from '../utils/constants';
import { calculateColorHarmonyScore, getColorHex } from '../utils/colorUtils';
import { FiSave, FiX, FiArrowDown } from 'react-icons/fi';

export default function OutfitBuilderPage() {
  const { clothes } = useWardrobe();
  const { addOutfit } = useOutfits();
  const [selected, setSelected] = useState([]);
  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  // useRef — scroll to preview section
  const previewRef = useRef(null);

  // useCallback — memoized toggle handler
  const toggleSelect = useCallback((item) => {
    setSelected(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, item];
    });
  }, []);

  // useMemo — harmony score
  const harmonyScore = useMemo(() => calculateColorHarmonyScore(selected), [selected]);

  const scrollToPreview = useCallback(() => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSave = async () => {
    if (selected.length < 2 || !outfitName || !occasion) return;
    setSaving(true);
    try {
      await addOutfit({
        name: outfitName,
        occasion,
        itemIds: selected.map(s => s.id),
        items: selected.map(s => ({ id: s.id, category: s.category, color: s.color, imageUrl: s.imageUrl })),
        harmonyScore,
      });
      setSuccess('Outfit saved successfully!');
      setSelected([]);
      setOutfitName('');
      setOccasion('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (clothes.length === 0) {
    return <EmptyState icon="👕" title="Wardrobe is empty" message="Add some clothes first to start building outfits" />;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Outfit Builder</h1>
      <p className="text-sm text-surface-500 mb-6">Select items to create an outfit combination</p>

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 text-success text-sm text-center animate-fade-in">
          {success}
        </div>
      )}

      {/* Selection grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {clothes.map(item => (
          <ClothingCard key={item.id} item={item} selectable selected={selected.some(s => s.id === item.id)} onSelect={toggleSelect} />
        ))}
      </div>

      {selected.length > 0 && (
        <div className="text-center mb-4">
          <button onClick={scrollToPreview} className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
            <FiArrowDown /> View outfit preview ({selected.length} items)
          </button>
        </div>
      )}

      {/* Preview & Save — ref scroll target */}
      <div ref={previewRef} className="glass-card p-6 mt-4">
        <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-4">Outfit Preview</h2>
        {selected.length === 0 ? (
          <p className="text-sm text-surface-500 text-center py-8">Click on items above to add them to your outfit</p>
        ) : (
          <>
            <div className="flex gap-3 overflow-x-auto pb-3 mb-4">
              {selected.map(item => (
                <div key={item.id} className="relative flex-shrink-0 w-24">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-100 dark:bg-dark-card">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>}
                  </div>
                  <button onClick={() => toggleSelect(item)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center text-xs"><FiX /></button>
                  <p className="text-xs text-center mt-1 text-surface-600 dark:text-surface-400 truncate">{item.category}</p>
                </div>
              ))}
            </div>

            {/* Harmony score */}
            <div className="mb-4 p-3 rounded-xl bg-surface-50 dark:bg-dark-card">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Color Harmony</span>
                <span className={`text-sm font-bold ${harmonyScore >= 70 ? 'text-success' : harmonyScore >= 40 ? 'text-warning' : 'text-danger'}`}>{harmonyScore}%</span>
              </div>
              <div className="w-full h-2 bg-surface-200 dark:bg-dark-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${harmonyScore >= 70 ? 'bg-success' : harmonyScore >= 40 ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${harmonyScore}%` }} />
              </div>
            </div>

            {/* Save form */}
            <div className="space-y-3">
              <input value={outfitName} onChange={(e) => setOutfitName(e.target.value)} placeholder="Outfit name (e.g., Monday Meeting)"
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-dark-border bg-white dark:bg-dark-card text-surface-800 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-dark-border bg-white dark:bg-dark-card text-surface-800 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                <option value="">Select occasion</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <button onClick={handleSave} disabled={saving || selected.length < 2 || !outfitName || !occasion}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-600/30 transition-all disabled:opacity-50 btn-glow">
                <FiSave size={16} /> {saving ? 'Saving...' : 'Save Outfit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import ClothingCard from '../components/ClothingCard';
import AddClothingModal from '../components/AddClothingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, OCCASIONS, SEASONS } from '../utils/constants';
import { FiPlus, FiSearch } from 'react-icons/fi';

export default function WardrobePage() {
  const { clothes, loading, addItem, updateItem, deleteItem, toggleFav } = useWardrobe();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterOccasion, setFilterOccasion] = useState('');
  const [filterSeason, setFilterSeason] = useState('');

  // useMemo — filtered + searched clothes list
  const filtered = useMemo(() => {
    return clothes.filter(c => {
      if (search && !c.category.toLowerCase().includes(search.toLowerCase()) && !c.color.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCat && c.category !== filterCat) return false;
      if (filterOccasion && c.occasion !== filterOccasion) return false;
      if (filterSeason && c.season !== filterSeason) return false;
      return true;
    });
  }, [clothes, search, filterCat, filterOccasion, filterSeason]);

  const handleSave = async (data) => {
    try {
      if (editItem) {
        await updateItem(editItem.id, data);
      } else {
        await addItem(data);
      }
      setEditItem(null);
    } catch (err) {
      console.error('WardrobePage: handleSave error:', err);
      throw err;
    }
  };

  const handleEdit = (item) => { setEditItem(item); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditItem(null); };

  if (loading) return <LoadingSpinner text="Loading wardrobe..." />;

  const selectClass = "px-4 py-2.5 rounded-2xl border border-white/20 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md text-surface-700 dark:text-surface-300 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300";

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-surface-900 dark:text-white tracking-tight">My Wardrobe</h1>
          <p className="text-sm font-medium text-surface-500">{clothes.length} items total • <span className="text-primary-600">Premium Vault</span></p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-600/30 transition-all btn-glow">
          <FiPlus size={18} /> Add Clothing
        </button>
      </div>

      {/* Filters — lifting state up pattern (filter state here, used by child cards) */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px] group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clothes..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/20 dark:border-white/5 bg-white/50 dark:bg-dark-card/50 backdrop-blur-md text-surface-700 dark:text-surface-300 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all duration-300 shadow-sm" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className={selectClass}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterOccasion} onChange={(e) => setFilterOccasion(e.target.value)} className={selectClass}>
          <option value="">All Occasions</option>
          {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filterSeason} onChange={(e) => setFilterSeason(e.target.value)} className={selectClass}>
          <option value="">All Seasons</option>
          {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* List & Keys — demonstrates list rendering */}
      {filtered.length === 0 ? (
        <EmptyState icon="👕" title="No items found" message={clothes.length === 0 ? "Start by adding your first clothing item!" : "Try adjusting your filters"}
          action={clothes.length === 0 ? <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">Add First Item</button> : null} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <ClothingCard key={item.id} item={item} onEdit={handleEdit} onDelete={deleteItem} onToggleFav={toggleFav} />
          ))}
        </div>
      )}

      {showModal && <AddClothingModal onClose={handleClose} onSave={handleSave} editItem={editItem} />}
    </div>
  );
}

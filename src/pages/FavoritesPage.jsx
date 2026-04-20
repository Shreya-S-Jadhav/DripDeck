import { useMemo } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { useOutfits } from '../context/OutfitContext';
import EmptyState from '../components/EmptyState';
import ClothingCard from '../components/ClothingCard';
import { COLLECTION_PRESETS } from '../utils/constants';
import { FiHeart } from 'react-icons/fi';

export default function FavoritesPage() {
  const { clothes, toggleFav } = useWardrobe();
  const { outfits, toggleOutfitFav } = useOutfits();

  const favClothes = useMemo(() => clothes.filter(c => c.favorite), [clothes]);
  const favOutfits = useMemo(() => outfits.filter(o => o.favorite), [outfits]);

  // Smart collections — outfits grouped by occasion
  const collections = useMemo(() => {
    return COLLECTION_PRESETS.map(preset => ({
      ...preset,
      outfits: outfits.filter(o => o.occasion === preset.occasion),
    })).filter(c => c.outfits.length > 0);
  }, [outfits]);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Favorites & Collections</h1>
      <p className="text-sm text-surface-500 mb-6">Your go-to outfits and favorite items</p>

      {/* Smart Collections */}
      {collections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3">Smart Collections</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {collections.map(col => (
              <div key={col.name} className="glass-card p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{col.icon}</span>
                  <h3 className="font-semibold text-surface-800 dark:text-white">{col.name}</h3>
                </div>
                <p className="text-xs text-surface-500 mb-3">{col.outfits.length} outfit{col.outfits.length !== 1 ? 's' : ''}</p>
                <div className="flex flex-wrap gap-1">
                  {col.outfits.slice(0, 3).map(o => (
                    <div key={o.id} className="flex -space-x-1">
                      {o.items?.slice(0, 2).map((it, i) => (
                        <div key={i} className="w-6 h-6 rounded-md overflow-hidden border border-white dark:border-dark-surface bg-surface-100 dark:bg-dark-card">
                          {it.imageUrl ? <img src={it.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-[8px] flex items-center justify-center h-full">👕</span>}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Outfits */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3 flex items-center gap-2">
          <FiHeart className="text-danger" /> Favorite Outfits
        </h2>
        {favOutfits.length === 0 ? (
          <EmptyState icon="❤️" title="No favorite outfits" message="Heart your favorite outfits to see them here" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favOutfits.map(outfit => (
              <div key={outfit.id} className="glass-card p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-surface-800 dark:text-white text-sm truncate">{outfit.name}</h3>
                  <button onClick={() => toggleOutfitFav(outfit.id)} className="text-red-500 hover:scale-110 transition-transform">
                    <FiHeart size={16} fill="currentColor" />
                  </button>
                </div>
                <div className="flex gap-2 mb-2">
                  {outfit.items?.map((it, i) => (
                    <div key={i} className="w-12 h-12 rounded-lg overflow-hidden bg-surface-100 dark:bg-dark-card">
                      {it.imageUrl ? <img src={it.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-sm flex items-center justify-center h-full">👕</span>}
                    </div>
                  ))}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{outfit.occasion}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Clothes */}
      <div>
        <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3 flex items-center gap-2">
          <FiHeart className="text-danger" /> Favorite Items
        </h2>
        {favClothes.length === 0 ? (
          <EmptyState icon="👕" title="No favorite items" message="Heart your favorite clothes in the wardrobe" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favClothes.map(item => (
              <ClothingCard key={item.id} item={item} onToggleFav={toggleFav} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { FiHeart, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { COLORS } from '../utils/constants';
import { getColorHex } from '../utils/colorUtils';

export default function ClothingCard({ item, onEdit, onDelete, onToggleFav, selectable, selected, onSelect }) {
  const hex = getColorHex(item.color, COLORS);

  return (
    <div
      onClick={selectable ? () => onSelect?.(item) : undefined}
      className={`glass-card overflow-hidden group transition-all duration-500 hover:-translate-y-2 cursor-pointer relative
        ${selected ? 'ring-4 ring-primary-500 shadow-2xl shadow-primary-500/40 scale-[1.02]' : ''}
        ${selectable ? 'hover:ring-4 hover:ring-primary-500/30' : ''}
      `}
    >
      {/* Dynamic Glow Overlay for selected items */}
      {selected && (
        <div className="absolute inset-0 bg-primary-500/5 animate-pulse pointer-events-none z-10"></div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-surface-100 dark:bg-dark-card overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.category} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-surface-400 bg-gradient-to-br from-surface-100 to-surface-200 dark:from-dark-card dark:to-dark-border">
            👕
          </div>
        )}

        {/* Actions Overlay - Relentless blurred buttons */}
        {!selectable && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFav?.(item.id); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 ${
                item.favorite 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' 
                  : 'bg-white/90 dark:bg-dark-card/90 text-surface-600 hover:text-red-500 shadow-xl'
              }`}
            >
              <FiHeart size={18} fill={item.favorite ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
              className="w-10 h-10 rounded-xl bg-white/90 dark:bg-dark-card/90 text-surface-600 hover:text-primary-600 shadow-xl transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-[50ms]"
            >
              <FiEdit2 size={18} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }}
              className="w-10 h-10 rounded-xl bg-white/90 dark:bg-dark-card/90 text-surface-600 hover:text-danger shadow-xl transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-[100ms]"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        )}

        {selected && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg animate-bounce-subtle z-20">
            <span className="text-sm font-black">✓</span>
          </div>
        )}
        
        {/* Category Label Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <span className="text-white text-xs font-black uppercase tracking-widest">{item.category}</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-surface-900 dark:text-white truncate">
            {item.category}
          </span>
          <div 
            className="w-5 h-5 rounded-full border-2 border-white dark:border-white/20 shadow-sm" 
            style={{ backgroundColor: hex }} 
            title={item.color} 
          />
        </div>
        
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[10px] font-black uppercase tracking-tight px-2 py-1 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
            {item.occasion}
          </span>
          <span className="text-[10px] font-black uppercase tracking-tight px-2 py-1 rounded-lg bg-surface-500/10 text-surface-600 dark:text-surface-400 border border-surface-500/20">
            {item.season}
          </span>
        </div>
        
        {item.wearCount > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="h-1 flex-1 bg-surface-100 dark:bg-dark-border rounded-full overflow-hidden">
               <div 
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500" 
                style={{ width: `${Math.min(item.wearCount * 10, 100)}%` }} 
               />
            </div>
            <span className="text-[10px] font-bold text-surface-400 uppercase">{item.wearCount}×</span>
          </div>
        )}
      </div>
    </div>
  );
}

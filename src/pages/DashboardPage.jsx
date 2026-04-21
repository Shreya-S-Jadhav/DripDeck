import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWardrobe } from '../context/WardrobeContext';
import { useOutfits } from '../context/OutfitContext';
import { generateAISuggestions } from '../services/aiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDisplayDate } from '../utils/dateUtils';
import { COLORS } from '../utils/constants';
import { getColorHex } from '../utils/colorUtils';
import { FiArrowRight, FiShoppingBag, FiScissors, FiCalendar, FiBarChart2, FiStar } from 'react-icons/fi';

export default function DashboardPage() {
  const { user } = useAuth();
  const { clothes, loading: wLoad } = useWardrobe();
  const { outfits, calendarEntries, loading: oLoad } = useOutfits();

  // State for AI suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Fetch AI suggestions asynchronously
  useEffect(() => {
    if (clothes.length < 2) {
      setSuggestions([]);
      return;
    }

    let isMounted = true;
    const fetchAI = async () => {
      setLoadingAi(true);
      setAiError(null);
      try {
        const result = await generateAISuggestions(clothes);
        if (isMounted) setSuggestions(result);
      } catch (err) {
        console.error(err);
        if (isMounted) setAiError(err.message || 'Failed to load AI suggestions');
      } finally {
        if (isMounted) setLoadingAi(false);
      }
    };

    fetchAI();

    return () => { isMounted = false; };
  }, [clothes]);

  // useMemo — today's outfit
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }, []);
  const todayEntry = useMemo(() => calendarEntries.find(e => e.date === todayStr), [calendarEntries, todayStr]);
  const todayOutfit = useMemo(() => todayEntry ? outfits.find(o => o.id === todayEntry.outfitId) : null, [todayEntry, outfits]);

  // useMemo — recent outfits
  const recentOutfits = useMemo(() => outfits.slice(0, 4), [outfits]);

  // useMemo — outfit repetition warnings
  const repetitionAlerts = useMemo(() => outfits.filter(o => (o.wearCount || 0) >= 3).slice(0, 3), [outfits]);

  if (wLoad || oLoad) return <LoadingSpinner text="Loading dashboard..." />;

  const QuickLink = ({ to, icon: Icon, label, color }) => (
    <Link to={to} className="glass-card p-4 flex flex-col items-center gap-2 hover:shadow-lg hover:-translate-y-1 transition-all group">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
        <Icon size={22} />
      </div>
      <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{label}</span>
    </Link>
  );

  return (
    <div className="animate-fade-in">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">
          Welcome back, <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">{user?.displayName || 'User'}</span> 👋
        </h1>
        <p className="text-surface-500 mt-1">{formatDisplayDate(new Date())} — Let's plan your look!</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <QuickLink to="/wardrobe" icon={FiShoppingBag} label="Wardrobe" color="bg-gradient-to-br from-primary-500 to-primary-700" />
        <QuickLink to="/outfit-builder" icon={FiScissors} label="Build Outfit" color="bg-gradient-to-br from-accent-500 to-accent-600" />
        <QuickLink to="/calendar" icon={FiCalendar} label="Calendar" color="bg-gradient-to-br from-teal-500 to-teal-600" />
        <QuickLink to="/analytics" icon={FiBarChart2} label="Analytics" color="bg-gradient-to-br from-purple-500 to-purple-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's outfit */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">📅 Today's Outfit</h2>
          {todayOutfit ? (
            <div>
              <p className="font-semibold text-surface-800 dark:text-white mb-2">{todayOutfit.name}</p>
              <div className="flex gap-2">
                {todayOutfit.items?.map((it, i) => (
                  <div key={i} className="w-16 h-16 rounded-xl overflow-hidden bg-surface-100 dark:bg-dark-card">
                    {it.imageUrl ? <img src={it.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xl flex items-center justify-center h-full">👕</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-surface-500 mb-2">No outfit planned for today</p>
              <Link to="/calendar" className="text-primary-600 text-sm font-medium hover:underline inline-flex items-center gap-1">
                Plan now <FiArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Wardrobe summary */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">👕 Wardrobe Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">{clothes.length}</p>
              <p className="text-xs text-surface-500">Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-500">{outfits.length}</p>
              <p className="text-xs text-surface-500">Outfits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-500">{calendarEntries.length}</p>
              <p className="text-xs text-surface-500">Planned</p>
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 flex justify-between items-center">
            <span>🤖 AI Outfit Suggestions</span>
            {loadingAi && <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>}
          </h2>
          {aiError ? (
            <p className="text-sm text-red-500 text-center py-4">{aiError}</p>
          ) : loadingAi && suggestions.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-dark-card">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-lg bg-surface-200 dark:bg-surface-700 border-2 border-white dark:border-dark-surface"></div>
                    <div className="w-10 h-10 rounded-lg bg-surface-200 dark:bg-surface-700 border-2 border-white dark:border-dark-surface"></div>
                  </div>
                  <div className="flex-1 h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <p className="text-sm text-surface-500 text-center py-4">Add more clothes to get suggestions</p>
          ) : (
            <div className="space-y-3">
              {suggestions.map((sug, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-surface-50 dark:bg-dark-card">
                  <div className="flex -space-x-2">
                    {sug.items.map((it, j) => (
                      <div key={j} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white dark:border-dark-surface bg-surface-100 dark:bg-dark-card">
                        {it.imageUrl ? <img src={it.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs flex items-center justify-center h-full">👕</span>}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-surface-700 dark:text-surface-300 truncate">
                      {sug.items.map(it => it.category).join(' + ')}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <FiStar size={10} className="text-warning" />
                      <span className="text-xs text-surface-500">Score: {sug.score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repetition alerts */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">🔁 Repetition Alerts</h2>
          {repetitionAlerts.length === 0 ? (
            <p className="text-sm text-surface-500 text-center py-4">No over-worn outfits — great variety! 🎉</p>
          ) : (
            <div className="space-y-2">
              {repetitionAlerts.map(o => (
                <div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <span className="text-sm text-surface-700 dark:text-surface-300 truncate">{o.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-yellow-700 dark:text-yellow-300 font-medium whitespace-nowrap">
                    Worn {o.wearCount}× — try something new!
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

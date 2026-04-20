import { useMemo } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { useOutfits } from '../context/OutfitContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS as COLOR_LIST } from '../utils/constants';
import { getColorHex } from '../utils/colorUtils';

const CHART_COLORS = ['#5c7cfa', '#f06595', '#51cf66', '#fcc419', '#ff6b6b', '#20c997', '#7950f2', '#fd7e14'];

export default function AnalyticsPage() {
  const { clothes, loading: wLoading } = useWardrobe();
  const { outfits, calendarEntries, loading: oLoading } = useOutfits();

  // useMemo — most worn items
  const mostWorn = useMemo(() =>
    [...clothes].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0)).slice(0, 8).map(c => ({
      name: `${c.category} (${c.color})`, wears: c.wearCount || 0, fill: getColorHex(c.color, COLOR_LIST),
    })), [clothes]);

  // useMemo — least worn
  const leastWorn = useMemo(() =>
    [...clothes].sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0)).slice(0, 8).map(c => ({
      name: `${c.category} (${c.color})`, wears: c.wearCount || 0, fill: getColorHex(c.color, COLOR_LIST),
    })), [clothes]);

  // useMemo — category distribution
  const catDistribution = useMemo(() => {
    const map = {};
    clothes.forEach(c => { map[c.category] = (map[c.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [clothes]);

  // useMemo — cost-per-wear
  const costPerWear = useMemo(() =>
    clothes.filter(c => c.cost && c.wearCount).map(c => ({
      name: `${c.category}`, cpw: Math.round(c.cost / c.wearCount), fill: getColorHex(c.color, COLOR_LIST),
    })).sort((a, b) => a.cpw - b.cpw).slice(0, 8), [clothes]);

  // useMemo — outfit repetition
  const outfitRepetition = useMemo(() =>
    outfits.filter(o => (o.wearCount || 0) > 1).sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0)).slice(0, 5),
    [outfits]);

  if (wLoading || oLoading) return <LoadingSpinner text="Crunching numbers..." />;
  if (clothes.length === 0) return <EmptyState icon="📊" title="No data yet" message="Add clothes and start wearing them to see analytics" />;

  const StatCard = ({ label, value, icon }) => (
    <div className="glass-card p-5 text-center">
      <span className="text-3xl">{icon}</span>
      <p className="text-2xl font-bold text-surface-800 dark:text-white mt-2">{value}</p>
      <p className="text-xs text-surface-500 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Wardrobe Analytics</h1>
      <p className="text-sm text-surface-500 mb-6">Insights into your style habits</p>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👕" label="Total Items" value={clothes.length} />
        <StatCard icon="👗" label="Outfits Created" value={outfits.length} />
        <StatCard icon="📅" label="Days Planned" value={calendarEntries.length} />
        <StatCard icon="❤️" label="Favorites" value={clothes.filter(c => c.favorite).length + outfits.filter(o => o.favorite).length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Worn */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">🔥 Most Worn Items</h3>
          {mostWorn.length === 0 ? <p className="text-xs text-surface-500 text-center py-8">No wear data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mostWorn}><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="wears" radius={[6,6,0,0]}>
                {mostWorn.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar></BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Distribution */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">📦 Category Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={catDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {catDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cost-per-wear */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">💰 Cost Per Wear (₹)</h3>
          {costPerWear.length === 0 ? <p className="text-xs text-surface-500 text-center py-8">Add cost to items and wear them</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={costPerWear}><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="cpw" radius={[6,6,0,0]}>
                {costPerWear.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar></BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Outfit Repetition Tracker */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">🔁 Outfit Repetition</h3>
          {outfitRepetition.length === 0 ? <p className="text-xs text-surface-500 text-center py-8">No repeated outfits yet</p> : (
            <div className="space-y-2">
              {outfitRepetition.map(o => (
                <div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-50 dark:bg-dark-card">
                  <span className="text-sm text-surface-700 dark:text-surface-300 truncate">{o.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-yellow-700 dark:text-yellow-300 font-medium">
                    Worn {o.wearCount}×
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

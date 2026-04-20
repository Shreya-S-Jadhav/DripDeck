import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useOutfits } from '../context/OutfitContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { formatDate } from '../utils/dateUtils';

const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales: { 'en-US': enUS } });

export default function CalendarPage() {
  const { outfits, calendarEntries, loading, addCalEntry, deleteCalEntry } = useOutfits();
  const [showAssign, setShowAssign] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedOutfit, setSelectedOutfit] = useState('');

  // useMemo — transform calendar entries into react-big-calendar events
  const events = useMemo(() => {
    return calendarEntries.map(entry => {
      const outfit = outfits.find(o => o.id === entry.outfitId);
      return {
        id: entry.id,
        title: outfit?.name || 'Unknown Outfit',
        start: new Date(entry.date),
        end: new Date(entry.date),
        allDay: true,
        outfitId: entry.outfitId,
      };
    });
  }, [calendarEntries, outfits]);

  const handleSelectSlot = useCallback(({ start }) => {
    setSelectedDate(formatDate(start));
    setShowAssign(true);
  }, []);

  const handleAssign = async () => {
    if (!selectedOutfit || !selectedDate) return;
    await addCalEntry({ outfitId: selectedOutfit, date: selectedDate });
    setShowAssign(false);
    setSelectedOutfit('');
  };

  if (loading) return <LoadingSpinner text="Loading calendar..." />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Outfit Calendar</h1>
          <p className="text-sm text-surface-500">Plan what to wear each day</p>
        </div>
        <button onClick={() => setShowAssign(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-600/30 transition-all btn-glow">
          <FiPlus size={18} /> Assign Outfit
        </button>
      </div>

      {outfits.length === 0 ? (
        <EmptyState icon="👗" title="No outfits yet" message="Create outfits in the Outfit Builder first" />
      ) : (
        <div className="glass-card p-4 overflow-hidden" style={{ minHeight: 500 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelectSlot}
            views={['month', 'week']}
            eventPropGetter={() => ({
              style: { backgroundColor: '#5c7cfa', borderRadius: 8, border: 'none', fontSize: 12, padding: '2px 6px' },
            })}
          />
        </div>
      )}

      {/* Upcoming entries */}
      {calendarEntries.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-surface-800 dark:text-white mb-3">Scheduled Outfits</h2>
          <div className="space-y-2">
            {calendarEntries.map(entry => {
              const outfit = outfits.find(o => o.id === entry.outfitId);
              return (
                <div key={entry.id} className="glass-card p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {outfit?.items?.slice(0, 3).map((it, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white dark:border-dark-surface bg-surface-100 dark:bg-dark-card">
                          {it.imageUrl ? <img src={it.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs flex items-center justify-center h-full">👕</span>}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-white">{outfit?.name || 'Unknown'}</p>
                      <p className="text-xs text-surface-500">{entry.date}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteCalEntry(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-surface-400 hover:text-danger transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assign modal */}
      {showAssign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAssign(false)} />
          <div className="relative glass-card w-full max-w-sm p-6 animate-slide-up">
            <h3 className="text-lg font-bold text-surface-800 dark:text-white mb-4">Assign Outfit to Date</h3>
            <div className="space-y-3">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-dark-border bg-white dark:bg-dark-card text-surface-800 dark:text-white text-sm" />
              <select value={selectedOutfit} onChange={(e) => setSelectedOutfit(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-dark-border bg-white dark:bg-dark-card text-surface-800 dark:text-white text-sm">
                <option value="">Select outfit</option>
                {outfits.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={() => setShowAssign(false)} className="flex-1 py-2.5 rounded-xl border border-surface-300 dark:border-dark-border text-surface-600 dark:text-surface-400 text-sm font-medium hover:bg-surface-50 dark:hover:bg-dark-card transition-colors">Cancel</button>
                <button onClick={handleAssign} disabled={!selectedOutfit} className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

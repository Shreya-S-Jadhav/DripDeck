import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import * as fs from '../services/firestoreService';

const OutfitContext = createContext(null);

const initialState = { outfits: [], calendarEntries: [], loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_OUTFITS':
      return { ...state, outfits: action.payload, loading: false };
    case 'ADD_OUTFIT':
      return { ...state, outfits: [action.payload, ...state.outfits] };
    case 'UPDATE_OUTFIT':
      return {
        ...state,
        outfits: state.outfits.map(o => o.id === action.payload.id ? { ...o, ...action.payload.data } : o),
      };
    case 'DELETE_OUTFIT':
      return { ...state, outfits: state.outfits.filter(o => o.id !== action.payload) };
    case 'SET_CALENDAR':
      return { ...state, calendarEntries: action.payload };
    case 'ADD_CALENDAR_ENTRY':
      return { ...state, calendarEntries: [...state.calendarEntries, action.payload] };
    case 'DELETE_CALENDAR_ENTRY':
      return { ...state, calendarEntries: state.calendarEntries.filter(e => e.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function OutfitProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_OUTFITS', payload: [] });
      dispatch({ type: 'SET_CALENDAR', payload: [] });
      return;
    }
    let cancelled = false;
    (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [outfits, calendar] = await Promise.all([
          fs.getOutfits(user.uid),
          fs.getCalendarEntries(user.uid),
        ]);
        if (!cancelled) {
          dispatch({ type: 'SET_OUTFITS', payload: outfits });
          dispatch({ type: 'SET_CALENDAR', payload: calendar });
        }
      } catch (err) {
        if (!cancelled) dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const addOutfit = useCallback(async (data) => {
    if (!user) return;
    const outfit = await fs.addOutfit(user.uid, data);
    dispatch({ type: 'ADD_OUTFIT', payload: outfit });
    return outfit;
  }, [user]);

  const updateOutfit = useCallback(async (id, data) => {
    if (!user) return;
    await fs.updateOutfit(user.uid, id, data);
    dispatch({ type: 'UPDATE_OUTFIT', payload: { id, data } });
  }, [user]);

  const deleteOutfit = useCallback(async (id) => {
    if (!user) return;
    await fs.deleteOutfit(user.uid, id);
    dispatch({ type: 'DELETE_OUTFIT', payload: id });
  }, [user]);

  const toggleOutfitFav = useCallback(async (id) => {
    if (!user) return;
    const outfit = state.outfits.find(o => o.id === id);
    if (!outfit) return;
    await fs.toggleFavorite(user.uid, 'outfits', id, outfit.favorite);
    dispatch({ type: 'UPDATE_OUTFIT', payload: { id, data: { favorite: !outfit.favorite } } });
  }, [user, state.outfits]);

  const addCalEntry = useCallback(async (data) => {
    if (!user) return;
    const entry = await fs.addCalendarEntry(user.uid, data);
    dispatch({ type: 'ADD_CALENDAR_ENTRY', payload: entry });
    // Increment wear count for the outfit
    const outfit = state.outfits.find(o => o.id === data.outfitId);
    if (outfit) {
      await fs.incrementWearCount(user.uid, 'outfits', outfit.id, outfit.wearCount || 0);
      dispatch({ type: 'UPDATE_OUTFIT', payload: { id: outfit.id, data: { wearCount: (outfit.wearCount || 0) + 1 } } });
      // Also increment wear count for each clothing item
      for (const itemId of (outfit.itemIds || [])) {
        await fs.incrementWearCount(user.uid, 'clothes', itemId, 0).catch(() => {});
      }
    }
    return entry;
  }, [user, state.outfits]);

  const deleteCalEntry = useCallback(async (id) => {
    if (!user) return;
    await fs.deleteCalendarEntry(user.uid, id);
    dispatch({ type: 'DELETE_CALENDAR_ENTRY', payload: id });
  }, [user]);

  const favoriteOutfits = useMemo(() => state.outfits.filter(o => o.favorite), [state.outfits]);

  const value = {
    outfits: state.outfits,
    calendarEntries: state.calendarEntries,
    loading: state.loading,
    error: state.error,
    favoriteOutfits,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    toggleOutfitFav,
    addCalEntry,
    deleteCalEntry,
  };

  return (
    <OutfitContext.Provider value={value}>
      {children}
    </OutfitContext.Provider>
  );
}

export function useOutfits() {
  const ctx = useContext(OutfitContext);
  if (!ctx) throw new Error('useOutfits must be used within OutfitProvider');
  return ctx;
}

export default OutfitContext;

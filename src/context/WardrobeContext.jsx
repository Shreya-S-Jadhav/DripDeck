import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as fs from '../services/firestoreService';

const WardrobeContext = createContext(null);

const initialState = { clothes: [], loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CLOTHES':
      return { ...state, clothes: action.payload, loading: false, error: null };
    case 'ADD_ITEM':
      return { ...state, clothes: [action.payload, ...state.clothes] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        clothes: state.clothes.map(c => c.id === action.payload.id ? { ...c, ...action.payload.data } : c),
      };
    case 'DELETE_ITEM':
      return { ...state, clothes: state.clothes.filter(c => c.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function WardrobeProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch clothes when user logs in — demonstrates useEffect
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET_CLOTHES', payload: [] });
      return;
    }
    let cancelled = false;
    (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const data = await fs.getClothes(user.uid);
        if (!cancelled) dispatch({ type: 'SET_CLOTHES', payload: data });
      } catch (err) {
        if (!cancelled) dispatch({ type: 'SET_ERROR', payload: err.message });
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  // Memoized CRUD actions — demonstrates useCallback
  const addItem = useCallback(async (data) => {
    if (!user) return;
    console.log('WardrobeContext: Calling addItem for user', user.uid);
    try {
      const item = await fs.addClothing(user.uid, data);
      console.log('WardrobeContext: Successfully added item to DB', item.id);
      dispatch({ type: 'ADD_ITEM', payload: item });
      return item;
    } catch (err) {
      console.error('WardrobeContext: Failed to add clothing item:', err);
      throw err;
    }
  }, [user]);

  const updateItem = useCallback(async (id, data) => {
    if (!user) return;
    await fs.updateClothing(user.uid, id, data);
    dispatch({ type: 'UPDATE_ITEM', payload: { id, data } });
  }, [user]);

  const deleteItem = useCallback(async (id) => {
    if (!user) return;
    await fs.deleteClothing(user.uid, id);
    dispatch({ type: 'DELETE_ITEM', payload: id });
  }, [user]);

  const toggleFav = useCallback(async (id) => {
    if (!user) return;
    const item = state.clothes.find(c => c.id === id);
    if (!item) return;
    await fs.toggleFavorite(user.uid, 'clothes', id, item.favorite);
    dispatch({ type: 'UPDATE_ITEM', payload: { id, data: { favorite: !item.favorite } } });
  }, [user, state.clothes]);

  // Computed values — demonstrates useMemo
  const favorites = useMemo(() => state.clothes.filter(c => c.favorite), [state.clothes]);
  const totalItems = useMemo(() => state.clothes.length, [state.clothes]);

  const value = {
    clothes: state.clothes,
    loading: state.loading,
    error: state.error,
    favorites,
    totalItems,
    addItem,
    updateItem,
    deleteItem,
    toggleFav,
  };

  return (
    <WardrobeContext.Provider value={value}>
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const ctx = useContext(WardrobeContext);
  if (!ctx) throw new Error('useWardrobe must be used within WardrobeProvider');
  return ctx;
}

export default WardrobeContext;

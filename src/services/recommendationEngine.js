import { areColorsCompatible, calculateColorHarmonyScore } from '../utils/colorUtils';
import { getCurrentSeason } from '../utils/dateUtils';
import {
  TOP_CATEGORIES, BOTTOM_CATEGORIES, OUTERWEAR_CATEGORIES,
  FOOTWEAR_CATEGORIES, FULL_BODY_CATEGORIES, ACCESSORY_CATEGORIES, SEASON_WEIGHTS,
} from '../utils/constants';

/**
 * Rule-based AI outfit recommendation engine.
 * Generates outfit suggestions from the user's wardrobe based on:
 *   - Color compatibility
 *   - Occasion matching
 *   - Season appropriateness
 *   - Least-worn items (encourages wardrobe utilization)
 */

function categorize(clothes) {
  const tops = clothes.filter(c => TOP_CATEGORIES.includes(c.category));
  const bottoms = clothes.filter(c => BOTTOM_CATEGORIES.includes(c.category));
  const outerwear = clothes.filter(c => OUTERWEAR_CATEGORIES.includes(c.category));
  const footwear = clothes.filter(c => FOOTWEAR_CATEGORIES.includes(c.category));
  const fullBody = clothes.filter(c => FULL_BODY_CATEGORIES.includes(c.category));
  const accessories = clothes.filter(c => ACCESSORY_CATEGORIES.includes(c.category));
  return { tops, bottoms, outerwear, footwear, fullBody, accessories };
}

function filterBySeason(items, season) {
  const validSeasons = SEASON_WEIGHTS[season] || [season, 'All Season'];
  return items.filter(i => validSeasons.includes(i.season));
}

function filterByOccasion(items, occasion) {
  if (!occasion) return items;
  return items.filter(i => i.occasion === occasion || i.occasion === 'Casual');
}

function sortByLeastWorn(items) {
  return [...items].sort((a, b) => (a.wearCount || 0) - (b.wearCount || 0));
}

function scoreOutfit(items) {
  const colorScore = calculateColorHarmonyScore(items);
  // Bonus for using least-worn items
  const avgWear = items.reduce((s, i) => s + (i.wearCount || 0), 0) / items.length;
  const wearBonus = Math.max(0, 30 - avgWear * 5);
  return Math.min(100, colorScore + wearBonus);
}

export function generateSuggestions(clothes, options = {}) {
  const { occasion, season: overrideSeason, maxSuggestions = 5 } = options;
  const season = overrideSeason || getCurrentSeason();

  const seasonFiltered = filterBySeason(clothes, season);
  const occasionFiltered = filterByOccasion(seasonFiltered, occasion);
  const { tops, bottoms, footwear, fullBody, accessories } = categorize(occasionFiltered);

  const suggestions = [];

  // Strategy 1: Top + Bottom + optional Footwear
  const sortedTops = sortByLeastWorn(tops);
  const sortedBottoms = sortByLeastWorn(bottoms);
  const sortedFoot = sortByLeastWorn(footwear);

  for (const top of sortedTops.slice(0, 6)) {
    for (const bottom of sortedBottoms.slice(0, 6)) {
      if (!areColorsCompatible(top.color, bottom.color)) continue;
      const items = [top, bottom];
      // Try to add footwear
      const shoe = sortedFoot.find(f => areColorsCompatible(f.color, top.color) || areColorsCompatible(f.color, bottom.color));
      if (shoe) items.push(shoe);
      // Try to add an accessory
      const acc = accessories.find(a => areColorsCompatible(a.color, top.color));
      if (acc) items.push(acc);

      suggestions.push({
        items,
        score: scoreOutfit(items),
        type: 'mix-match',
      });
    }
  }

  // Strategy 2: Full-body (dress) + optional footwear + accessory
  for (const dress of sortByLeastWorn(fullBody).slice(0, 4)) {
    const items = [dress];
    const shoe = sortedFoot.find(f => areColorsCompatible(f.color, dress.color));
    if (shoe) items.push(shoe);
    const acc = accessories.find(a => areColorsCompatible(a.color, dress.color));
    if (acc) items.push(acc);
    suggestions.push({ items, score: scoreOutfit(items), type: 'full-body' });
  }

  // Sort by score descending and return top N
  suggestions.sort((a, b) => b.score - a.score);
  return suggestions.slice(0, maxSuggestions);
}

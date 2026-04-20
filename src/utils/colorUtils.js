import { COLOR_COMPATIBILITY } from './constants';

/**
 * Check if two colors are compatible
 */
export function areColorsCompatible(color1, color2) {
  if (color1 === color2) return true;
  const compatList = COLOR_COMPATIBILITY[color1];
  return compatList ? compatList.includes(color2) : false;
}

/**
 * Get the hex value for a color name from the COLORS array
 */
export function getColorHex(colorName, colorsList) {
  const found = colorsList.find(c => c.name === colorName);
  return found ? found.hex : '#868e96';
}

/**
 * Calculate a compatibility score between all items in an outfit (0-100)
 */
export function calculateColorHarmonyScore(items) {
  if (!items || items.length < 2) return 100;
  let compatiblePairs = 0;
  let totalPairs = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      totalPairs++;
      if (areColorsCompatible(items[i].color, items[j].color)) {
        compatiblePairs++;
      }
    }
  }
  return totalPairs > 0 ? Math.round((compatiblePairs / totalPairs) * 100) : 100;
}

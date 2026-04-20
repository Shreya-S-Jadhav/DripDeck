// Clothing categories
export const CATEGORIES = [
  'T-Shirt', 'Shirt', 'Blouse', 'Top', 'Sweater', 'Hoodie', 'Jacket', 'Coat',
  'Jeans', 'Trousers', 'Shorts', 'Skirt', 'Dress',
  'Sneakers', 'Boots', 'Heels', 'Sandals', 'Loafers',
  'Hat', 'Scarf', 'Belt', 'Watch', 'Bag', 'Sunglasses',
];

// Top categories (for outfit builder pairing logic)
export const TOP_CATEGORIES = ['T-Shirt', 'Shirt', 'Blouse', 'Top', 'Sweater', 'Hoodie'];
export const BOTTOM_CATEGORIES = ['Jeans', 'Trousers', 'Shorts', 'Skirt'];
export const OUTERWEAR_CATEGORIES = ['Jacket', 'Coat'];
export const FOOTWEAR_CATEGORIES = ['Sneakers', 'Boots', 'Heels', 'Sandals', 'Loafers'];
export const FULL_BODY_CATEGORIES = ['Dress'];
export const ACCESSORY_CATEGORIES = ['Hat', 'Scarf', 'Belt', 'Watch', 'Bag', 'Sunglasses'];

// Occasions
export const OCCASIONS = ['Casual', 'Formal', 'Party', 'Sports', 'Business', 'Date Night', 'Travel'];

// Seasons
export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter', 'All Season'];

// Colors with hex values for swatches
export const COLORS = [
  { name: 'Black', hex: '#212529' },
  { name: 'White', hex: '#f8f9fa' },
  { name: 'Gray', hex: '#868e96' },
  { name: 'Navy', hex: '#1c3d5a' },
  { name: 'Blue', hex: '#4c6ef5' },
  { name: 'Light Blue', hex: '#74c0fc' },
  { name: 'Red', hex: '#e03131' },
  { name: 'Pink', hex: '#f06595' },
  { name: 'Green', hex: '#40c057' },
  { name: 'Olive', hex: '#5c7c3a' },
  { name: 'Yellow', hex: '#fcc419' },
  { name: 'Orange', hex: '#fd7e14' },
  { name: 'Brown', hex: '#8b6914' },
  { name: 'Beige', hex: '#d4c5a9' },
  { name: 'Purple', hex: '#7950f2' },
  { name: 'Burgundy', hex: '#862e2e' },
  { name: 'Teal', hex: '#20c997' },
  { name: 'Coral', hex: '#ff6b6b' },
];

// Color compatibility matrix for AI suggestions
export const COLOR_COMPATIBILITY = {
  'Black':  ['White', 'Gray', 'Red', 'Pink', 'Blue', 'Yellow', 'Teal', 'Coral', 'Beige', 'Navy', 'Purple'],
  'White':  ['Black', 'Navy', 'Blue', 'Red', 'Pink', 'Gray', 'Green', 'Brown', 'Beige', 'Teal', 'Purple'],
  'Gray':   ['Black', 'White', 'Blue', 'Pink', 'Purple', 'Teal', 'Red', 'Navy', 'Yellow'],
  'Navy':   ['White', 'Beige', 'Brown', 'Light Blue', 'Gray', 'Pink', 'Red', 'Yellow', 'Orange'],
  'Blue':   ['White', 'Gray', 'Beige', 'Brown', 'Navy', 'Black', 'Yellow', 'Orange'],
  'Light Blue': ['White', 'Navy', 'Gray', 'Beige', 'Brown', 'Pink'],
  'Red':    ['Black', 'White', 'Gray', 'Navy', 'Beige', 'Blue'],
  'Pink':   ['White', 'Gray', 'Black', 'Navy', 'Blue', 'Beige', 'Light Blue'],
  'Green':  ['White', 'Beige', 'Brown', 'Black', 'Navy', 'Gray', 'Yellow'],
  'Olive':  ['White', 'Beige', 'Brown', 'Black', 'Navy', 'Gray'],
  'Yellow': ['Navy', 'Black', 'Gray', 'Blue', 'White', 'Brown'],
  'Orange': ['Navy', 'Blue', 'White', 'Brown', 'Black', 'Beige'],
  'Brown':  ['White', 'Beige', 'Blue', 'Green', 'Navy', 'Orange', 'Yellow'],
  'Beige':  ['Navy', 'Brown', 'Blue', 'White', 'Black', 'Green', 'Olive', 'Red'],
  'Purple': ['White', 'Gray', 'Black', 'Beige', 'Pink', 'Light Blue'],
  'Burgundy': ['White', 'Beige', 'Gray', 'Black', 'Navy', 'Pink'],
  'Teal':   ['White', 'Black', 'Gray', 'Beige', 'Navy', 'Coral'],
  'Coral':  ['White', 'Navy', 'Black', 'Teal', 'Beige', 'Gray'],
};

// Season compatibility for temperature
export const SEASON_WEIGHTS = {
  'Spring': ['Spring', 'All Season'],
  'Summer': ['Summer', 'All Season'],
  'Autumn': ['Autumn', 'All Season'],
  'Winter': ['Winter', 'All Season'],
};

// Collection presets for Favorites page
export const COLLECTION_PRESETS = [
  { name: 'Office Wear', icon: '💼', occasion: 'Business' },
  { name: 'Party Fits', icon: '🎉', occasion: 'Party' },
  { name: 'Casual Everyday', icon: '😎', occasion: 'Casual' },
  { name: 'Date Night', icon: '❤️', occasion: 'Date Night' },
  { name: 'Sporty', icon: '🏃', occasion: 'Sports' },
  { name: 'Travel Ready', icon: '✈️', occasion: 'Travel' },
];

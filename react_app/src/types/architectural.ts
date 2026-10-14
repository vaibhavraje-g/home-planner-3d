export type SurfaceCategory =
  | 'ext_main'
  | 'box_grooves'
  | 'parapet_box'
  | 'pillar_plinth'
  | 'int_living'
  | 'int_master'
  | 'int_bed23'
  | 'int_kitchen'
  | 'slab_trim';

export type TimeOfDay = 'morning' | 'noon' | 'sunset' | 'night';

export interface AsianPaintShade {
  name: string;
  code: string;
  hex: string;
  group: 'whites' | 'earth' | 'grays' | 'pastels' | 'vibrant' | 'greens';
  lrv: number; // Light Reflectance Value (%)
  series: 'Apex Ultima' | 'Royale Luxury' | 'Woodtech';
  description?: string;
}

export interface CuratedTheme {
  id: number | 'clay';
  name: string;
  subtitle: string;
  category: 'Popular' | 'Vastu' | 'Modern' | 'Heritage' | 'Clay';
  colors: Record<SurfaceCategory, string>;
  swatchPreview: string[];
  description: string;
}

export interface RoomDefinition {
  id: string;
  name: string;
  dimensions: string;
  tagline: string;
  vastuZone: string;
  vastuSignificance: string;
  pos: [number, number, number];
  look: [number, number, number];
  planRect?: { x: number; y: number; w: number; h: number };
}

export interface CameraPreset {
  id: string;
  label: string;
  sub: string;
  elevation: string;
  pos: [number, number, number];
  look: [number, number, number];
}

export const CATEGORY_LABELS: Record<SurfaceCategory, { title: string; desc: string }> = {
  ext_main: {
    title: 'Exterior Main Facade Walls',
    desc: 'Outer villa weather-coat walls, upper parapet body, and rear elevations'
  },
  box_grooves: {
    title: 'Window Box Chajjas & Grooves',
    desc: 'Projecting concrete box windows, lintel bands, and South pilaster grooves'
  },
  parapet_box: {
    title: 'Parapet Cutout Accent Frame',
    desc: 'Prominent geometric cutout frame above porch (Camel Skin) & kitchen accent'
  },
  pillar_plinth: {
    title: 'Circular Pillar & Plinth Border',
    desc: 'Front circular verandah pillar, raised 2\'6" plinth skirting, and roof coping'
  },
  int_living: {
    title: 'Living Hall & Central Passage',
    desc: '21\'×16\'6" living hall walls, central foyer, and straight circulation spine'
  },
  int_master: {
    title: 'Master Bedroom Walls',
    desc: '12\'×14\'6" South-West master bedroom walls and feature bed wall'
  },
  int_bed23: {
    title: 'Bedrooms 2 & 3 Walls',
    desc: '14\'×11\' Middle Bedroom 2 and 14\'×12\' Rear Bedroom 3 walls'
  },
  int_kitchen: {
    title: 'Kitchen & Pooja Ghar Walls',
    desc: '12\'×18\' modular kitchen walls and 5\'×3\' sacred Pooja alcove'
  },
  slab_trim: {
    title: 'Roof Slab & Cornice Trim',
    desc: 'Fascia bands, cantilevered porch beams, and rooftop mumty slab edges'
  }
};

/**
 * Comprehensive Asian Paints Official Shade Database (60+ Curated Shades)
 * Ground truth Asian Paints Royale & Apex Ultima Codes, HEX values, and LRVs
 */
export const ASIAN_PAINTS_SHADES: AsianPaintShade[] = [
  // --- 1. WHITES & OFF-WHITES (HIGH LRV) ---
  { name: 'Innocent White', code: 'L180', hex: '#F3EFE6', group: 'whites', lrv: 86, series: 'Apex Ultima', description: 'Warm architectural white, Asian Paints all-time top exterior pick' },
  { name: 'Morning Frost', code: '0765', hex: '#E5EAE3', group: 'whites', lrv: 85, series: 'Royale Luxury', description: 'Crisp morning frost off-white with delicate cool champagne clarity' },
  { name: 'Morning Glory', code: '0765', hex: '#FAF7EF', group: 'whites', lrv: 89, series: 'Royale Luxury', description: 'Crisp morning cream with soft champagne undertones' },
  { name: 'Canvas Cream', code: '0313', hex: '#EAE6DD', group: 'whites', lrv: 82, series: 'Royale Luxury', description: 'Subtle linen white, perfect for high-traffic living halls' },
  { name: 'Cream Pie', code: 'L152', hex: '#EFE7D8', group: 'whites', lrv: 87, series: 'Apex Ultima', description: 'Silky off-white with delicate buttermilk warmth' },
  { name: 'Absolute White', code: 'L161', hex: '#FFFFFF', group: 'whites', lrv: 94, series: 'Apex Ultima', description: 'Pure architectural brilliant white for ceilings and fascia' },
  { name: 'White Silk', code: 'L171', hex: '#F1EFEA', group: 'whites', lrv: 85, series: 'Apex Ultima', description: 'Classic pearlescent off-white for luxury exterior facades' },
  { name: 'Pebble White', code: 'L136', hex: '#ECE8DF', group: 'whites', lrv: 81, series: 'Apex Ultima', description: 'Weathered stone off-white with balanced earthy warmth' },
  { name: 'White Butter', code: 'L167', hex: '#FAF5E8', group: 'whites', lrv: 88, series: 'Royale Luxury', description: 'Gentle golden cream off-white for welcoming foyers' },
  { name: 'Pure Ivory', code: '0315', hex: '#F5EBD9', group: 'whites', lrv: 83, series: 'Royale Luxury', description: 'Traditional royal ivory for heritage elevation accents' },
  { name: 'Swiss White', code: 'L102', hex: '#F8F8F6', group: 'whites', lrv: 92, series: 'Apex Ultima', description: 'Ultra-modern cool alpine white' },

  // --- 2. WARM EARTH TONES, BEIGES & MOCHAS ---
  { name: 'Sand Drift', code: '8461', hex: '#C4B59D', group: 'earth', lrv: 51, series: 'Apex Ultima', description: 'Signature taupe-sand for projecting window box frames & grooves' },
  { name: 'Camel Skin', code: '8515', hex: '#C89B61', group: 'earth', lrv: 44, series: 'Apex Ultima', description: 'Rich desert camel, used on the main porch parapet feature frame' },
  { name: 'Mushroom', code: '8470', hex: '#9D9484', group: 'earth', lrv: 35, series: 'Apex Ultima', description: 'Sophisticated earthy greige-taupe for modern accents' },
  { name: 'Raw Jute', code: '8513', hex: '#A28D75', group: 'earth', lrv: 42, series: 'Royale Luxury', description: 'Organic natural fiber tone, warm and tactile' },
  { name: 'Nut Brown-N', code: '0419', hex: '#5E4632', group: 'earth', lrv: 18, series: 'Apex Ultima', description: 'Deep mocha roasted coffee tone for architectural grounding' },
  { name: 'Almond Frost', code: '0957', hex: '#DFD5C6', group: 'earth', lrv: 63, series: 'Royale Luxury', description: 'Gentle creamy almond, timeless interior living tone' },
  { name: 'Light Biscuit', code: '8514', hex: '#DACABC', group: 'earth', lrv: 58, series: 'Apex Ultima', description: 'Warm sand biscuit for understated exterior elegance' },
  { name: 'Desert Tan', code: '8521', hex: '#B89B7A', group: 'earth', lrv: 39, series: 'Apex Ultima', description: 'Sun-drenched architectural tan' },
  { name: 'Rich Tan', code: '8522', hex: '#8F6347', group: 'earth', lrv: 32, series: 'Apex Ultima', description: 'Warm amber tan with clay undertones for plinth and trim' },
  { name: 'Walnut Shell', code: '8632', hex: '#4A3B32', group: 'earth', lrv: 12, series: 'Woodtech', description: 'Dark walnut for external window trims and doors' },
  { name: 'Sand Dune', code: '8452', hex: '#D2C3B0', group: 'earth', lrv: 55, series: 'Apex Ultima', description: 'Fine golden sand tone with high curb appeal' },
  { name: 'Magnolia', code: '0387', hex: '#ECE2CE', group: 'earth', lrv: 74, series: 'Royale Luxury', description: 'Floral warm cream for serene master bedrooms' },

  // --- 3. MODERN URBAN GRAYS & CHARCOALS ---
  { name: 'Thundercloud', code: '8305', hex: '#474B4E', group: 'grays', lrv: 17, series: 'Apex Ultima', description: 'Deep architectural slate grey, perfect for porch pillar & plinth' },
  { name: 'Charcoal Grey', code: '8297', hex: '#3A3E45', group: 'grays', lrv: 12, series: 'Apex Ultima', description: 'Bold modern charcoal with graphite depth' },
  { name: 'Pewter', code: '8298', hex: '#5B6168', group: 'grays', lrv: 26, series: 'Apex Ultima', description: 'Balanced medium industrial grey for pilasters and lintels' },
  { name: 'Whispering Smoke', code: '8308', hex: '#B0B7BC', group: 'grays', lrv: 48, series: 'Apex Ultima', description: 'Cool foggy silver-grey, top contemporary exterior shade' },
  { name: 'Smoke Grey', code: '8304', hex: '#7C8285', group: 'grays', lrv: 34, series: 'Apex Ultima', description: 'Neutral mid-tone grey with zero blue tint' },
  { name: 'Steel Gleam', code: '8286', hex: '#949B9E', group: 'grays', lrv: 41, series: 'Royale Luxury', description: 'Metallic sheen grey for modern architectural finishes' },
  { name: 'Jet Black', code: '8296', hex: '#212224', group: 'grays', lrv: 6, series: 'Apex Ultima', description: 'Deepest architectural pitch black for window grilles & reveals' },
  { name: 'Slate Grey', code: '8292', hex: '#4F565C', group: 'grays', lrv: 20, series: 'Apex Ultima', description: 'Natural slate stone grey with subtle cool undertones' },

  // --- 4. VASTU EAST PASTELS & SERENE TONES ---
  { name: 'Aqua Hint', code: 'L114', hex: '#DCE9E5', group: 'pastels', lrv: 78, series: 'Royale Luxury', description: 'Calming sea-mist pastel, Vastu recommended for East & Pooja' },
  { name: 'Soft Dawn', code: '0935', hex: '#F2DDC6', group: 'pastels', lrv: 75, series: 'Royale Luxury', description: 'Gentle sunrise apricot pastel, brings warmth and vitality to living areas' },
  { name: 'Ocean Ridge', code: '7480', hex: '#87B5B5', group: 'pastels', lrv: 45, series: 'Royale Luxury', description: 'Coastal turquoise for accent walls and garden planter walls' },
  { name: 'Sky Mist', code: '7442', hex: '#C2D9E5', group: 'pastels', lrv: 68, series: 'Royale Luxury', description: 'Soft morning sky blue for tranquil guest bedrooms' },
  { name: 'Lilac Breeze', code: '7188', hex: '#DDD6E5', group: 'pastels', lrv: 74, series: 'Royale Luxury', description: 'Subtle ethereal lilac for Bedroom 2 and reading corners' },
  { name: 'Lavender Lace', code: '7156', hex: '#E8E1E8', group: 'pastels', lrv: 76, series: 'Royale Luxury', description: 'Delicate floral lavender with soothing evening resonance' },
  { name: 'Gem Stone', code: '7172', hex: '#D9DFE3', group: 'pastels', lrv: 72, series: 'Royale Luxury', description: 'Silvery blue-grey pastel for modern bedroom interiors' },
  { name: 'Pink Mist', code: '8092', hex: '#EEDBDD', group: 'pastels', lrv: 72, series: 'Royale Luxury', description: 'Warm romantic pastel for private suites' },
  { name: 'Delicate Violet', code: '7173', hex: '#D2CEDB', group: 'pastels', lrv: 64, series: 'Royale Luxury', description: 'Muted violet-slate for stylish feature niches' },
  { name: 'Lavender Love', code: 'K051', hex: '#DDD4E5', group: 'pastels', lrv: 67, series: 'Royale Luxury', description: 'Romantic calming lavender pastel' },

  // --- 5. SAGE GREENS & ORGANIC NATURE TONES ---
  { name: 'Tranquil Green', code: '7564', hex: '#BDD2B6', group: 'greens', lrv: 62, series: 'Royale Luxury', description: 'Refreshing botanical sage green for indoor-outdoor harmony' },
  { name: 'Mint Whisper', code: '7523', hex: '#D4E8DC', group: 'greens', lrv: 76, series: 'Royale Luxury', description: 'Crisp mint pastel for vibrant kitchen and dining areas' },
  { name: 'Muted Sage', code: '7682', hex: '#9CAE98', group: 'greens', lrv: 42, series: 'Apex Ultima', description: 'Organic earthy sage, trending worldwide for villa facades' },
  { name: 'Deep Olive', code: '7663', hex: '#58634F', group: 'greens', lrv: 22, series: 'Apex Ultima', description: 'Stately dark olive for architectural border pilasters' },
  { name: 'Soft Breeze', code: '8116', hex: '#E0E7DC', group: 'greens', lrv: 79, series: 'Royale Luxury', description: 'Airy pale green with serene natural presence' },

  // --- 6. VIBRANT HERITAGE & CONTEMPORARY ACCENTS ---
  { name: 'Gold Mine', code: '7949', hex: '#E6B34A', group: 'vibrant', lrv: 55, series: 'Royale Luxury', description: 'Lustrous golden yellow for auspicious Pooja and parapet features' },
  { name: 'Terracotta', code: '0524', hex: '#B85D43', group: 'vibrant', lrv: 25, series: 'Apex Ultima', description: 'Authentic baked Indian clay terracotta for parapet & porch' },
  { name: 'Marigold', code: '7984', hex: '#E59B3C', group: 'vibrant', lrv: 46, series: 'Apex Ultima', description: 'Auspicious Indian festive golden-yellow accent' },
  { name: 'Saffron Spice', code: '7954', hex: '#D97724', group: 'vibrant', lrv: 34, series: 'Apex Ultima', description: 'Rich turmeric-saffron accent for Pooja and entrance niches' },
  { name: 'Teal Twist', code: '7492', hex: '#2F7C85', group: 'vibrant', lrv: 21, series: 'Royale Luxury', description: 'Deep ocean peacock teal for statement feature walls' },
  { name: 'Deep Teal', code: '7490', hex: '#1C5B63', group: 'vibrant', lrv: 14, series: 'Apex Ultima', description: 'Dramatic deep teal for modern luxury contrast' },
  { name: 'Signal Red', code: '0520', hex: '#B82828', group: 'vibrant', lrv: 16, series: 'Apex Ultima', description: 'Bold statement red for main entrance doors and focal accents' },
  { name: 'Zinnia Bloom', code: '8716', hex: '#F08D7A', group: 'vibrant', lrv: 48, series: 'Royale Luxury', description: 'Coral warm floral tone for inviting entrance verandas' },
  { name: 'Solemn Yellow', code: '7914', hex: '#F0D478', group: 'vibrant', lrv: 68, series: 'Royale Luxury', description: 'Sunny warm yellow for uplifting breakfast alcoves' }
];

/**
 * 8 Best Pre-Configured Asian Paints Designer Combinations (Online Recommended)
 */
export const CURATED_THEMES: CuratedTheme[] = [
  {
    id: 1,
    name: 'Warm Heritage Sandstone & Teak',
    subtitle: 'Site Blueprint Match • Innocent White & Camel Skin',
    category: 'Popular',
    description: 'Matches the real site construction and 3D elevation render: Innocent White L180 body, Sand Drift 8461 box frames, Camel Skin 8515 parapet cutout, Teak wood porch wall, and Thundercloud 8305 plinth skirting. Interior features Canvas Cream 0313 living walls and Cream Pie L152 master suite.',
    colors: {
      ext_main: '#F3EFE6',      // Innocent White L180
      box_grooves: '#C4B59D',   // Sand Drift 8461
      parapet_box: '#C89B61',   // Camel Skin 8515
      pillar_plinth: '#474B4E', // Thundercloud 8305
      int_living: '#EAE6DD',    // Canvas Cream 0313
      int_master: '#EFE7D8',    // Cream Pie L152
      int_bed23: '#F3EFE6',     // Innocent White L180
      int_kitchen: '#EAE6DD',   // Canvas Cream 0313
      slab_trim: '#5E4632'      // Nut Brown-N 0419
    },
    swatchPreview: ['#F3EFE6', '#C4B59D', '#C89B61', '#474B4E', '#5E4632']
  },
  {
    id: 2,
    name: 'Modern Minimalist Greige & Charcoal',
    subtitle: 'Morning Frost, Raw Jute & Charcoal Grey',
    category: 'Modern',
    description: 'Sophisticated architectural minimalism: Morning Frost 0765 exterior facade with Raw Jute 8513 box frames, grounded by bold Charcoal Grey 8297 plinth and parapet accents. Interiors flow into Whispering Smoke 8308 and Raw Jute with crisp Innocent White ceilings.',
    colors: {
      ext_main: '#E5EAE3',      // Morning Frost 0765
      box_grooves: '#A28D75',   // Raw Jute 8513
      parapet_box: '#3A3E45',   // Charcoal Grey 8297
      pillar_plinth: '#3A3E45', // Charcoal Grey 8297
      int_living: '#B0B7BC',    // Whispering Smoke 8308
      int_master: '#A28D75',    // Raw Jute 8513
      int_bed23: '#E5EAE3',     // Morning Frost 0765
      int_kitchen: '#F3EFE6',   // Innocent White L180
      slab_trim: '#3A3E45'      // Charcoal Grey 8297
    },
    swatchPreview: ['#E5EAE3', '#A28D75', '#3A3E45', '#B0B7BC', '#F3EFE6']
  },
  {
    id: 3,
    name: 'Vedic Vastu Harmonized (East Entrance)',
    subtitle: 'Canvas Cream, Soft Dawn, Aqua Hint & Rich Tan',
    category: 'Vastu',
    description: 'Auspicious Vedic Vastu scheme for East-facing entrance: Sun-aligned Canvas Cream 0313 Indra facade, Gold Mine 7949 puja/parapet accents, and Rich Tan 8522 plinth grounding. Interiors feature Soft Dawn 0935 living hall and Aqua Hint L114 master bedroom serenity.',
    colors: {
      ext_main: '#EAE6DD',      // Canvas Cream 0313
      box_grooves: '#C4B59D',   // Sand Drift 8461
      parapet_box: '#E6B34A',   // Gold Mine 7949
      pillar_plinth: '#8F6347', // Rich Tan 8522
      int_living: '#F2DDC6',    // Soft Dawn 0935
      int_master: '#DCE9E5',    // Aqua Hint L114
      int_bed23: '#DDD6E5',     // Lilac Breeze 7188
      int_kitchen: '#EAE6DD',   // Canvas Cream 0313
      slab_trim: '#8F6347'      // Rich Tan 8522
    },
    swatchPreview: ['#EAE6DD', '#C4B59D', '#E6B34A', '#8F6347', '#DCE9E5']
  },
  {
    id: 4,
    name: 'Whispering Smoke & White Silk',
    subtitle: 'Urban Monochromatic Elegance',
    category: 'Modern',
    description: 'Sophisticated modern grey palette recommended by Asian Paints Apex Ultima for clean geometric elevations.',
    colors: {
      ext_main: '#F1EFEA',      // White Silk L171
      box_grooves: '#B0B7BC',   // Whispering Smoke 8308
      parapet_box: '#7C8285',   // Smoke Grey 8304
      pillar_plinth: '#3A3E45', // Charcoal Grey 8297
      int_living: '#F8F8F6',    // Swiss White L102
      int_master: '#B0B7BC',    // Whispering Smoke 8308
      int_bed23: '#D9DFE3',     // Gem Stone 7172
      int_kitchen: '#F1EFEA',   // White Silk L171
      slab_trim: '#4F565C'      // Slate Grey 8292
    },
    swatchPreview: ['#F1EFEA', '#B0B7BC', '#7C8285', '#3A3E45', '#4F565C']
  },
  {
    id: 5,
    name: 'Subtle Asian Paints Pastels',
    subtitle: 'Aqua Hint, Lilac Breeze & Gem Stone',
    category: 'Popular',
    description: 'Gentle, light-filled pastel palette offering serene ambiance inside and playful, airy elevation accents.',
    colors: {
      ext_main: '#EFE7D8',      // Cream Pie L152
      box_grooves: '#C4B59D',   // Sand Drift 8461
      parapet_box: '#D9DFE3',   // Gem Stone 7172
      pillar_plinth: '#5B6168', // Pewter 8298
      int_living: '#DCE9E5',    // Aqua Hint L114
      int_master: '#E8E1E8',    // Lavender Lace 7156
      int_bed23: '#DDD6E5',     // Lilac Breeze 7188
      int_kitchen: '#DCE9E5',   // Aqua Hint L114
      slab_trim: '#5B6168'      // Pewter 8298
    },
    swatchPreview: ['#EFE7D8', '#DCE9E5', '#DDD6E5', '#D9DFE3', '#5B6168']
  },
  {
    id: 6,
    name: 'Terracotta & Almond Warmth',
    subtitle: 'Indian Heritage Baked Clay',
    category: 'Heritage',
    description: 'Warm, inviting ethnic exterior with authentic Terracotta parapet accents paired with smooth Almond Frost and dark wood.',
    colors: {
      ext_main: '#F3EFE6',      // Innocent White L180
      box_grooves: '#DFD5C6',   // Almond Frost 0957
      parapet_box: '#B85D43',   // Terracotta 0524
      pillar_plinth: '#474B4E', // Thundercloud 8305
      int_living: '#DFD5C6',    // Almond Frost 0957
      int_master: '#B89B7A',    // Desert Tan 8521
      int_bed23: '#EAE6DD',     // Canvas Cream 0313
      int_kitchen: '#FAF5E8',   // White Butter L167
      slab_trim: '#B85D43'      // Terracotta 0524
    },
    swatchPreview: ['#F3EFE6', '#DFD5C6', '#B85D43', '#474B4E', '#B85D43']
  },
  {
    id: 7,
    name: 'Serene Muted Sage & Ivory',
    subtitle: 'Biophilic Botanical Balance',
    category: 'Modern',
    description: 'Connects the home to surrounding lawns and garden planters with soothing Muted Sage and Pure Ivory.',
    colors: {
      ext_main: '#F5EBD9',      // Pure Ivory 0315
      box_grooves: '#9CAE98',   // Muted Sage 7682
      parapet_box: '#58634F',   // Deep Olive 7663
      pillar_plinth: '#474B4E', // Thundercloud 8305
      int_living: '#E0E7DC',    // Soft Breeze 8116
      int_master: '#BDD2B6',    // Tranquil Green 7564
      int_bed23: '#D4E8DC',     // Mint Whisper 7523
      int_kitchen: '#F5EBD9',   // Pure Ivory 0315
      slab_trim: '#58634F'      // Deep Olive 7663
    },
    swatchPreview: ['#F5EBD9', '#9CAE98', '#58634F', '#474B4E', '#58634F']
  },
  {
    id: 'clay',
    name: 'Architectural Clay Mode',
    subtitle: 'Zero-Paint Pure Massing Evaluation',
    category: 'Clay',
    description: 'Clean matte architectural white finish with soft shadow occlusion, perfect for evaluating form, geometry, and openings. Porch wood tiles preserved.',
    colors: {
      ext_main: '#EEEEEE',
      box_grooves: '#E0E0E0',
      parapet_box: '#D6D6D6',
      pillar_plinth: '#CCCCCC',
      int_living: '#EFEFEF',
      int_master: '#EAEAEA',
      int_bed23: '#E8E8E8',
      int_kitchen: '#ECECEC',
      slab_trim: '#DDDDDD'
    },
    swatchPreview: ['#EEEEEE', '#E0E0E0', '#CCCCCC', '#DDDDDD', '#6B3E23']
  }
];

export const ROOM_DEFINITIONS: RoomDefinition[] = [
  {
    id: 'porch',
    name: 'Front Porch / Verandah',
    dimensions: "20'6\" × 12'6\"",
    tagline: 'Left Double Door • Fixed Teak Tiles • Sunken Fluted Wood Ceiling',
    vastuZone: 'East (Indra / Surya)',
    vastuSignificance: 'Brings morning prana, vitality, and wealth into the household.',
    pos: [6.0, 6.2, 23.5],
    look: [6.0, 5.8, 12.5],
    planRect: { x: 55, y: 72, w: 42, h: 25 }
  },
  {
    id: 'living',
    name: 'Living Hall',
    dimensions: "21'0\" × 16'6\"",
    tagline: 'L-Sectional Sofa • 65" TV Media Wall • POP False Ceiling & Coves',
    vastuZone: 'East / North-East',
    vastuSignificance: 'Spacious central living fosters family harmony and social growth.',
    pos: [14.0, 6.2, 10.0],
    look: [3.0, 5.2, 2.5],
    planRect: { x: 55, y: 44, w: 42, h: 26 }
  },
  {
    id: 'kitchen',
    name: 'Kitchen (Doorless Entry)',
    dimensions: "12'0\" × 18'0\"",
    tagline: 'Granite L-Counter • Chimney & Hob • Double-Door Refrigerator',
    vastuZone: 'South-East (Agni Corner)',
    vastuSignificance: 'Ideal fire quadrant for food preparation, promoting health and prosperity.',
    pos: [-4.5, 6.2, 8.5],
    look: [-12.5, 5.2, 16.5],
    planRect: { x: 3, y: 70, w: 49, h: 27 }
  },
  {
    id: 'puja',
    name: 'Pooja Ghar Sanctuary',
    dimensions: "5'0\" × 3'0\"",
    tagline: 'White Marble Mandir • Brass Diyas • Carved Teak Jali Screen',
    vastuZone: 'North-East (Ishan Corner)',
    vastuSignificance: 'Supreme spiritual quadrant for meditation, positive energy, and peace.',
    pos: [-5.2, 6.0, 16.8],
    look: [-4.5, 5.2, 21.8],
    planRect: { x: 34, y: 88, w: 18, h: 9 }
  },
  {
    id: 'passage',
    name: 'Central Passage Spine',
    dimensions: "8'6\" → 4'0\"",
    tagline: 'Direct Straight Axis from Front Entrance to Rear Exit Door',
    vastuZone: 'Brahmasthan / Central Axis',
    vastuSignificance: 'Unobstructed energy flow from front entrance straight to rear backyard.',
    pos: [0.0, 6.2, 8.5],
    look: [0.0, 6.0, -24.0],
    planRect: { x: 38, y: 38, w: 20, h: 30 }
  },
  {
    id: 'bed2_entry',
    name: 'Bed 2 Entry Corner',
    dimensions: "3'0\" × 5'0\" Clearance",
    tagline: 'West Corner Swing Area • Offset from Master Bed Door Across Hall',
    vastuZone: 'North-West (Vayu)',
    vastuSignificance: 'Uninhibited door swing for smooth circulation and privacy.',
    pos: [-5.8, 6.5, -3.5],
    look: [-9.0, 6.5, -2.0],
    planRect: { x: 26, y: 44, w: 12, h: 10 }
  },
  {
    id: 'bed2',
    name: 'Bedroom 2 (Study Suite)',
    dimensions: "14'0\" × 11'0\"",
    tagline: 'Dual-Monitor Workstation • Ergonomic Mesh Chair • Queen Bed',
    vastuZone: 'North-West / West',
    vastuSignificance: 'Ideal for children or guests; brings mental clarity and creative focus.',
    pos: [-14.0, 6.2, -1.0],
    look: [-6.2, 5.0, 3.2],
    planRect: { x: 3, y: 52, w: 35, h: 18 }
  },
  {
    id: 'master',
    name: 'Master Bedroom',
    dimensions: "12'0\" × 14'6\"",
    tagline: 'King Platform Bed • Headboard Lighting • Mirror Wardrobe',
    vastuZone: 'South-West (Nairutya Corner)',
    vastuSignificance: 'Master suite in Nairutya anchors authority, leadership, and emotional stability.',
    pos: [5.5, 6.2, -7.5],
    look: [13.0, 5.2, -14.0],
    planRect: { x: 57, y: 15, w: 40, h: 27 }
  },
  {
    id: 'bed3',
    name: 'Bedroom 3 (Guest / Study)',
    dimensions: "14'0\" × 12'0\"",
    tagline: 'Queen Bed • Study Desk • Full Wardrobe • Cross Ventilation',
    vastuZone: 'North-West (Vayu Corner)',
    vastuSignificance: 'Peaceful guest / study room with cross-ventilation windows.',
    pos: [-13.5, 6.2, -15.0],
    look: [-6.0, 5.2, -20.0],
    planRect: { x: 3, y: 3, w: 35, h: 25 }
  },
  {
    id: 'sanitary',
    name: 'Common 3-Zone Sanitary Hub',
    dimensions: "WC 4'×4' • Bath 4'×6'",
    tagline: 'Independent WC • Washbasin • Shower & Dedicated Washing Machine Space',
    vastuZone: 'West Zone',
    vastuSignificance: 'Correct placement for waste drainage without impacting living zones.',
    pos: [-0.5, 6.2, -17.5],
    look: [4.0, 5.5, -18.5],
    planRect: { x: 40, y: 3, w: 15, h: 25 }
  },
  {
    id: 'mumty',
    name: 'Rooftop Staircase Mumty Tower',
    dimensions: "11'0\" × 6'0\"",
    tagline: 'Terrace Access Tower • Vertical Louver Ventilation • Overhanging Slab',
    vastuZone: 'South-West / North-West (Elevated Heavy Mass)',
    vastuSignificance: 'Height and massing on the Western/Southern quadrant provides Vastu stability.',
    pos: [-12.0, 16.5, -9.5],
    look: [-12.0, 16.5, 0.0],
    planRect: { x: 3, y: 38, w: 25, h: 14 }
  }
];

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'iso',
    label: '3/4 Isometric',
    sub: 'Full Villa, Garden & Mumty Tower',
    elevation: 'Overview',
    pos: [52, 22, 58],
    look: [0, 6.5, 0]
  },
  {
    id: 'front',
    label: 'East Elevation (Front)',
    sub: 'Sunken Porch, Parapet Cutouts & Kitchen',
    elevation: 'Elevation 1',
    pos: [2, 11, 66],
    look: [2, 8, 0]
  },
  {
    id: 'porch_closeup',
    label: 'Porch & Left Double Door',
    sub: 'Teak Tiles, Granite Steps & Pillar',
    elevation: 'Detail',
    pos: [6, 8, 28],
    look: [2, 7.2, 12.5]
  },
  {
    id: 'south',
    label: 'South Elevation (Right)',
    sub: '2 Box Windows, 6 Grooves & Stone Niche',
    elevation: 'Elevation 2',
    pos: [64, 12, -4],
    look: [0, 7, -4]
  },
  {
    id: 'north',
    label: 'North Elevation (Left)',
    sub: '5 Pilasters, Chajjas & Rooftop Mumty',
    elevation: 'Elevation 3',
    pos: [-64, 14, -2],
    look: [0, 8, -2]
  },
  {
    id: 'west',
    label: 'West Elevation (Rear)',
    sub: 'Bed 3, Toilets & Rear Service Exit Door',
    elevation: 'Elevation 4',
    pos: [-0.2, 11, -64],
    look: [-0.2, 7, 0]
  },
  {
    id: 'top',
    label: 'Overhead Roof / Floor Plan',
    sub: '90° Top-Down Aerial Architectural Cut',
    elevation: 'Plan',
    pos: [0, 82, 0],
    look: [0, 0, 0]
  }
];

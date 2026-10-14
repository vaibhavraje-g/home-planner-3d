import React, { useState, useMemo } from 'react';
import {
  Palette,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  Sparkles,
  Lock
} from 'lucide-react';
import {
  SurfaceCategory,
  CuratedTheme,
  CATEGORY_LABELS,
  ASIAN_PAINTS_SHADES,
  CURATED_THEMES
} from '../types/architectural';

interface RightPaintStudioProps {
  activeCategory: SurfaceCategory;
  setActiveCategory: (cat: SurfaceCategory) => void;
  categoryColors: Record<SurfaceCategory, string>;
  onApplyShade: (category: SurfaceCategory, hex: string) => void;
  onApplyTheme: (theme: CuratedTheme) => void;
  onEnableClayMode: () => void;
  activeThemeId: number | 'clay';
}

export const RightPaintStudio: React.FC<RightPaintStudioProps> = ({
  activeCategory,
  setActiveCategory,
  categoryColors,
  onApplyShade,
  onApplyTheme,
  onEnableClayMode,
  activeThemeId
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Paint search and group filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [customHex, setCustomHex] = useState('');

  const currentCategoryMeta = CATEGORY_LABELS[activeCategory];
  const currentColor = categoryColors[activeCategory];

  // Filtered Asian Paints Shades
  const filteredShades = useMemo(() => {
    return ASIAN_PAINTS_SHADES.filter((shade) => {
      const matchesSearch =
        shade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shade.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shade.description && shade.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGroup = selectedGroup === 'all' || shade.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchQuery, selectedGroup]);

  return (
    <aside
      className={`fixed top-20 right-3 z-30 transition-all duration-300 pointer-events-auto flex items-start ${
        isOpen ? 'w-[360px] sm:w-[410px]' : 'w-auto'
      }`}
      style={{ maxHeight: 'calc(100vh - 96px)' }}
    >
      {/* Mini Vertical Pill Bar (Always visible on left edge of right panel) */}
      <div className="flex flex-col items-center gap-1.5 p-1 rounded-2xl glass-panel shadow-2xl border border-white/15 mr-1 shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-amber-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isOpen ? 'Collapse Colour Studio' : 'Expand Asian Paints Colour Studio'}
        >
          {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <div className="w-6 h-[1px] bg-white/15 my-0.5" />

        <button
          onClick={() => setIsOpen(true)}
          className={`p-2 rounded-xl transition-all ${
            isOpen
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Asian Paints Studio (60+ Shades & Combinations)"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      {/* Main Drawer Body (When Expanded) */}
      {isOpen && (
        <div className="w-full glass-panel rounded-2xl border border-white/15 shadow-2xl flex flex-col overflow-hidden max-h-[calc(100vh-96px)]">
          {/* Header Bar */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Palette className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight uppercase">
                  Asian Paints Colour Studio
                </h3>
                <span className="text-[10px] text-gray-400 block -mt-0.5">
                  60+ Official Shades & Curated Combinations
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              title="Close panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 text-xs">
            {/* Active Target Surface Selector */}
            <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-200 text-[11px] uppercase tracking-wide">
                  Target Surface to Paint:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-mono">{currentColor}</span>
                  <div
                    className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: currentColor }}
                    title={`Current color: ${currentColor}`}
                  />
                </div>
              </div>

              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as SurfaceCategory)}
                className="w-full bg-slate-900 border border-white/20 text-white text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer font-medium"
              >
                {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => (
                  <option key={catKey} value={catKey}>
                    {info.title}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-gray-400 leading-tight">
                {currentCategoryMeta?.desc} (or click any 3D surface in the model)
              </span>
            </div>

            {/* Curated Pre-Configured Designer Combinations */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Curated Combinations
                </span>
                <button
                  onClick={onEnableClayMode}
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-all ${
                    activeThemeId === 'clay'
                      ? 'bg-white text-slate-900 font-bold'
                      : 'text-gray-400 hover:text-white underline'
                  }`}
                >
                  Clay Mode
                </button>
              </div>

              <div className="flex flex-col gap-1.5 max-h-[175px] overflow-y-auto pr-1">
                {CURATED_THEMES.filter((t) => t.id !== 'clay').map((theme) => {
                  const isActive = activeThemeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => onApplyTheme(theme)}
                      className={`p-2 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-[11px]">{theme.name}</span>
                          <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-500/15 px-1 rounded">
                            {theme.category}
                          </span>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <span className="text-[10px] text-gray-400 line-clamp-1">{theme.subtitle}</span>
                      <div className="flex h-3 rounded overflow-hidden border border-white/15">
                        {theme.swatchPreview.map((hex, i) => (
                          <div key={i} className="flex-1 h-full" style={{ backgroundColor: hex }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fixed Porch Wood Note */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[10.5px] text-amber-200">
              <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>
                <strong>Porch Teak Wood Tiles</strong> & fluted ceiling are permanently preserved for 100% site photo authenticity.
              </span>
            </div>

            {/* Search & Shade Library Filter */}
            <div className="flex flex-col gap-1.5 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-200 text-[11px] uppercase tracking-wide">
                  Official Shades ({filteredShades.length})
                </span>
                <div className="flex items-center gap-1 text-[10px]">
                  <input
                    type="text"
                    placeholder="#HEX"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-16 px-1.5 py-0.5 rounded bg-black/50 border border-white/20 text-white text-[10px] font-mono outline-none"
                  />
                  <button
                    onClick={() => {
                      if (/^#?[0-9A-Fa-f]{6}$/.test(customHex)) {
                        const formatted = customHex.startsWith('#') ? customHex : `#${customHex}`;
                        onApplyShade(activeCategory, formatted);
                      }
                    }}
                    className="px-1.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search shade name or code (e.g. L180, 8461, Camel)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs text-white placeholder-gray-500 outline-none focus:border-amber-400"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 text-[10px]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'whites', label: 'Whites & Creams' },
                  { id: 'earth', label: 'Earth & Mocha' },
                  { id: 'grays', label: 'Urban Grays' },
                  { id: 'pastels', label: 'Pastels' },
                  { id: 'greens', label: 'Sages' },
                  { id: 'vibrant', label: 'Accents' }
                ].map((grp) => (
                  <button
                    key={grp.id}
                    onClick={() => setSelectedGroup(grp.id)}
                    className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-all ${
                      selectedGroup === grp.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>

              {/* Shade Swatch Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[210px] overflow-y-auto p-1 bg-black/30 rounded-xl border border-white/10">
                {filteredShades.map((shade) => {
                  const isApplied = currentColor.toLowerCase() === shade.hex.toLowerCase();
                  return (
                    <button
                      key={shade.code}
                      onClick={() => onApplyShade(activeCategory, shade.hex)}
                      className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all group ${
                        isApplied
                          ? 'border-amber-400 bg-amber-400/20 shadow-sm ring-1 ring-amber-400'
                          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }`}
                      title={`${shade.name} (${shade.code}) - LRV ${shade.lrv}% • ${shade.series}`}
                    >
                      <div
                        className="w-full h-5 rounded-md border border-black/30 shadow-inner mb-1"
                        style={{ backgroundColor: shade.hex }}
                      />
                      <span className="text-[10px] font-bold text-gray-200 line-clamp-1 w-full leading-tight">
                        {shade.name}
                      </span>
                      <div className="flex items-center justify-between w-full text-[9px] text-gray-400 font-mono mt-0.5">
                        <span>{shade.code}</span>
                        <span className="text-[8px] opacity-70">{shade.lrv}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

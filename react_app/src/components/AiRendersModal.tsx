import React, { useState } from 'react';
import { X, Sparkles, Download, Maximize2, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface AiRendersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiRendersModal: React.FC<AiRendersModalProps> = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!isOpen) return null;

  const RENDERS = [
    {
      id: 'front_facade',
      title: 'East Elevation (Front Facade & Sunken Porch)',
      category: 'Exterior Facade',
      specs: 'Innocent White L180 • Camel Skin 8515 • Teak Wood Tiles • Black Granite Steps',
      src: './renders/front_facade_exact_8k.jpg',
      desc: 'Exact front facade elevation matching the CAD blueprint and site photos. Features the +2\'6" raised plinth with 4 black granite steps and planter urns, sunken porch with circular RCC pillar, horizontal teak wood tile back wall, double-door entrance, Camel Skin (8515) parapet geometric frame, and rooftop mumty tower.'
    },
    {
      id: 'south_elevation',
      title: 'South Side Elevation (2 Box Windows & Stone Niche)',
      category: 'Side Elevation',
      specs: 'Innocent White L180 • Sand Drift 8461 • Natural Slate Stone • Up/Down Sconces',
      src: './renders/south_elevation_exact_8k.jpg',
      desc: 'Exact South elevation featuring 2 projecting concrete box windows with lower display ledges in Sand Drift (8461), 6 crisp horizontal plaster grooves on the corner pilaster, and the vertical split-face natural stone niche with dual up/down architectural beam sconces.'
    },
    {
      id: 'north_elevation',
      title: 'North Side Elevation (5 Pilasters & Mumty)',
      category: 'Side Elevation',
      specs: 'Innocent White L180 • Sand Drift 8461 • Cantilevered Chajjas • Mumty Tower',
      src: './renders/north_elevation_exact_8k.jpg',
      desc: 'North facade showing the rhythmic sequence of 5 architectural pilasters, 4 windows with cantilevered concrete chajja sunshades, dark plinth skirting, and the elevated rooftop staircase mumty tower with vertical ventilation louvers.'
    },
    {
      id: 'rear_elevation',
      title: 'West Rear Elevation (Service Exit & Ventilators)',
      category: 'Rear Elevation',
      specs: 'Innocent White L180 • Sand Drift 8461 • Granite Steps • Frosted Louvers',
      src: './renders/rear_elevation_exact_8k.jpg',
      desc: 'Rear West elevation showing the central service exit door with black granite steps down to the backyard lawn, Bedroom 3 window, and high-level frosted louvered ventilators for the common bathroom, WC, and master ensuite.'
    },
    {
      id: 'dollhouse_floorplan',
      title: '3D Cutaway Dollhouse Architectural Overview',
      category: 'Floorplan & Inner Walls',
      specs: '37\' x 50\' Footprint • RCC Column Grid • 9"x12" Drop Beams • All 10 Rooms',
      src: './renders/dollhouse_floorplan_exact_8k.jpg',
      desc: 'Isometric cutaway perspective revealing the entire single-storey villa with roof removed. Displays all interior partition walls, structural RCC column grid, drop ceiling beams, central circulation spine, and full furnishing layout across all 10 rooms.'
    },
    {
      id: 'living_hall',
      title: 'Living Hall & Entertainment Suite (21\' 0" × 16\' 6")',
      category: 'Interior Living Space',
      specs: 'Canvas Cream 0313 • POP Cove LED 3000K • 65" 4K OLED • Fluted Wood Panel',
      src: './renders/living_hall_exact_8k.jpg',
      desc: 'Spacious living hall featuring multi-tiered POP false ceiling with warm 3000K LED cove light trough, modern black ceiling fan, L-shaped sectional sofa with throw pillows, 2-tier designer coffee table, and fluted wood media feature wall with 65" TV and bias backlighting.'
    },
    {
      id: 'kitchen_modular',
      title: 'Modular Kitchen & Breakfast Bar (12\' 0" × 18\' 0")',
      category: 'Interior Modular Kitchen',
      specs: 'Black Granite L-Counter • Stainless Chimney & Hob • Double-Door Refrigerator',
      src: './renders/kitchen_modular_exact_8k.jpg',
      desc: 'Modern kitchen layout featuring deep black polished granite L-counters with 4" splashback, undermount sink with gooseneck faucet under the window, 4-burner glass hob, overhead chimney hood, double-door refrigerator, and wooden breakfast counter.'
    },
    {
      id: 'bedroom_study',
      title: 'Bedroom 2 (Study Suite & Dual-Monitor Desk)',
      category: 'Interior Study Bedroom',
      specs: 'Dual 27" Monitors • Workstation PC • Ergonomic Mesh Chair • Queen Bed',
      src: './renders/bedroom_study_workstation_exact_8k.jpg',
      desc: 'Dedicated study bedroom featuring a walnut desk with dual 27" widescreen monitors (IDE + 3D blueprint) on an articulated arm, mid-tower PC with blue LED glow, mechanical keyboard, ergonomic mesh chair, queen platform bed, and Lilac Breeze accent wall.'
    },
    {
      id: 'master_bedroom',
      title: 'Master Bedroom Suite (12\' 0" × 14\' 6")',
      category: 'Interior Master Suite',
      specs: 'Aqua Hint L114 Accent • King Platform Bed • Mirror Wardrobe • Box Window',
      src: './renders/master_bedroom_exact_8k.jpg',
      desc: 'Serene master bedroom suite featuring a king platform bed with vertical channel headboard, serene Aqua Hint (L114) feature wall, floor-to-ceiling wardrobe with full-height mirror door, projecting box window with ledge seating, and ensuite door.'
    },
    {
      id: 'pooja_sanctuary',
      title: 'Pooja Ghar Sanctuary & Altar (5\' 0" × 3\' 0")',
      category: 'Interior Sacred Sanctuary',
      specs: 'White Makrana Marble Mandir • Brass Diyas • Carved Teak Jali Screen',
      src: './renders/pooja_sanctuary_exact_8k.jpg',
      desc: 'Traditional sacred sanctuary in the North-East corner featuring a handcrafted stepped white marble mandir with shikhara dome, sacred brass idols, glowing brass diya lamps, hanging bell, and intricate carved teak wood jali partition screen.'
    }
  ];

  const current = RENDERS[activeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] glass-panel rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden bg-slate-950/90 text-white">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                  AI Photorealistic Architectural Gallery
                </h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                  8K Frontier AI
                </span>
              </div>
              <span className="text-[11px] text-gray-400 block -mt-0.5">
                Magazine-grade photorealistic renders synthesized with the <code className="text-amber-300">interior-design-visualizer</code> skill
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Main Showcase Image Frame */}
          <div className="relative w-full aspect-[16/9] max-h-[58vh] rounded-xl overflow-hidden bg-black/60 border border-white/15 shadow-2xl flex items-center justify-center group">
            <img
              src={current.src}
              alt={current.title}
              className="w-full h-full object-contain sm:object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {/* Navigation Overlay Arrows */}
            <button
              onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : RENDERS.length - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-slate-950 backdrop-blur-md border border-white/20 transition-all shadow-xl"
              title="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveIndex((prev) => (prev < RENDERS.length - 1 ? prev + 1 : 0))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-slate-950 backdrop-blur-md border border-white/20 transition-all shadow-xl"
              title="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Download Button in Corner */}
            <a
              href={current.src}
              download={`${current.id}_8k_render.jpg`}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/25 text-xs font-bold transition-all shadow-lg backdrop-blur-md"
              title="Download full 8K image"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download 8K</span>
            </a>
          </div>

          {/* Details & Specs of Current Photo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                  {current.title}
                </h3>
                <span className="text-[10px] text-gray-400 font-mono">
                  ({activeIndex + 1} of {RENDERS.length})
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed max-w-3xl">
                {current.desc}
              </p>
              <div className="mt-1 text-[10px] text-amber-400/90 font-mono">
                <strong>Palette Specs:</strong> {current.specs}
              </div>
            </div>
          </div>

          {/* Thumbnail Selector Strip */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
              Select Architectural View to Inspect ({RENDERS.length}):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto pr-1">
              {RENDERS.map((render, idx) => {
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={render.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative rounded-xl overflow-hidden border text-left transition-all flex flex-col group ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-lg'
                        : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                    }`}
                  >
                    <div className="w-full h-16 sm:h-20 bg-black/50 overflow-hidden">
                      <img
                        src={render.src}
                        alt={render.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-1.5 bg-slate-900/90 flex flex-col">
                      <span className="text-[10px] font-bold text-white line-clamp-1">
                        {render.title}
                      </span>
                      <span className="text-[9px] text-amber-300 font-mono truncate">
                        {render.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

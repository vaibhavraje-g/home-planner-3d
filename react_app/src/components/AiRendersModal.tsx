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
      id: 'exterior',
      title: 'Villa Exterior Facade (3/4 Isometric)',
      category: 'Frontier AI Architectural Visualizer',
      specs: 'Innocent White L180 • Sand Drift 8461 • Camel Skin 8515 • Teak Tiles',
      src: './renders/exterior_realistic_8k.jpg',
      desc: 'Hyper-realistic 8K daylight architectural render matching the 37\' x 50\' blueprint and construction site photos. Showcases the 4 black granite steps, circular verandah pillar, horizontal teak plank wall, Camel Skin parapet frame, and side split-face stone cladding niche with warm 3000K sconce lighting.'
    },
    {
      id: 'living',
      title: 'Living Hall & Dining Suite (21\' 0" × 16\' 6")',
      category: 'Frontier AI Interior Visualizer',
      specs: 'Canvas Cream 0313 • POP Cove LED 3000K • Vitrified Marble • Walnut Unit',
      src: './renders/living_room_realistic_8k.jpg',
      desc: 'Architectural Digest-grade interior visualizer render of the main living hall. Features linen-textured Canvas Cream walls, recessed POP false ceiling tray with warm LED cove glow, polished vitrified porcelain marble flooring, woven rug, modern sofa, and eastern dining nook with pendant fixture.'
    },
    {
      id: 'master',
      title: 'Master Bedroom Suite (12\' 0" × 14\' 6")',
      category: 'Frontier AI Interior Visualizer',
      specs: 'Almond Frost 0957 • Desert Tan 8521 • Louver Wardrobe • Box Window',
      src: './renders/master_bedroom_realistic_8k.jpg',
      desc: 'Ultra-realistic visualization of the private master bedroom suite. Features soothing Almond Frost walls with a Desert Tan accent wall, king-size platform bed, bedside nightstands with warm reading lamps, floor-to-ceiling louvered wooden wardrobe, and corner window overlooking the lawn.'
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
          <div className="grid grid-cols-3 gap-2.5">
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
                  <div className="p-1.5 sm:p-2 bg-slate-900/90 flex flex-col">
                    <span className="text-[10px] sm:text-xs font-bold text-white line-clamp-1">
                      {render.title}
                    </span>
                    <span className="text-[9px] text-amber-300 font-mono">
                      {render.id.toUpperCase()} VIEW
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

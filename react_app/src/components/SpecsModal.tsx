import React from 'react';
import { X, Check, Ruler, Building, Compass, Sun, Shield } from 'lucide-react';

interface SpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsModal: React.FC<SpecsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-panel rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                37' × 50' Architectural Specifications & Room Schedule
              </h2>
              <p className="text-xs text-gray-400">
                Contemporary Indian 3BHK Single-Storey Villa with Rooftop Staircase Mumty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Total Footprint</span>
              <strong className="text-base text-amber-300 font-mono mt-0.5">37' × 50'</strong>
              <span className="text-[10px] text-gray-400">1,850 sq ft built-up</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Ceiling Height</span>
              <strong className="text-base text-amber-300 font-mono mt-0.5">10' 6" Clear</strong>
              <span className="text-[10px] text-gray-400">11' 0" slab level</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Raised Plinth</span>
              <strong className="text-base text-amber-300 font-mono mt-0.5">2' 6" Plinth</strong>
              <span className="text-[10px] text-gray-400">4 black granite steps</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Orientation</span>
              <strong className="text-base text-amber-300 font-mono mt-0.5">East Entrance</strong>
              <span className="text-[10px] text-gray-400">Vastu Purusha compliant</span>
            </div>
          </div>

          {/* Room Schedule Table */}
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">
              Complete Room-by-Room Schedule
            </span>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-black/25">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-white/5 border-b border-white/10 text-gray-300 font-semibold">
                  <tr>
                    <th className="p-2.5">Room / Area</th>
                    <th className="p-2.5">Blueprint Dimensions</th>
                    <th className="p-2.5">Carpet Area</th>
                    <th className="p-2.5">Architectural Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Front Verandah (Porch)</td>
                    <td className="p-2.5 font-mono text-amber-400">20' 6" × 12' 6"</td>
                    <td className="p-2.5">256 sq ft</td>
                    <td className="p-2.5 text-gray-400">Circular pillar, 4 granite steps, fixed teak wood tiles</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Living Hall</td>
                    <td className="p-2.5 font-mono text-amber-400">21' 0" × 16' 6"</td>
                    <td className="p-2.5">346 sq ft</td>
                    <td className="p-2.5 text-gray-400">Open kitchen entry, POP tray ceiling, porch window</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Kitchen (Open Arch)</td>
                    <td className="p-2.5 font-mono text-amber-400">12' 0" × 18' 0"</td>
                    <td className="p-2.5">216 sq ft</td>
                    <td className="p-2.5 text-gray-400">3 windows, L-counter, doorless west entrance</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Pooja Ghar</td>
                    <td className="p-2.5 font-mono text-amber-400">5' 0" × 3' 0"</td>
                    <td className="p-2.5">15 sq ft</td>
                    <td className="p-2.5 text-gray-400">Sacred East corner alcove with jali partition</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Bedroom 1 (Master)</td>
                    <td className="p-2.5 font-mono text-amber-400">12' 0" × 14' 6"</td>
                    <td className="p-2.5">174 sq ft</td>
                    <td className="p-2.5 text-gray-400">Attached private bath (12'×4') & South box window</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Bedroom 2</td>
                    <td className="p-2.5 font-mono text-amber-400">14' 0" × 11' 0"</td>
                    <td className="p-2.5">154 sq ft</td>
                    <td className="p-2.5 text-gray-400">Attached bath (5'×10'6"), single door at West corner</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Bedroom 3</td>
                    <td className="p-2.5 font-mono text-amber-400">14' 0" × 12' 0"</td>
                    <td className="p-2.5">168 sq ft</td>
                    <td className="p-2.5 text-gray-400">Rear left corner with direct common bath access</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Staircase</td>
                    <td className="p-2.5 font-mono text-amber-400">11' 0" × 6' 0"</td>
                    <td className="p-2.5">66 sq ft</td>
                    <td className="p-2.5 text-gray-400">Dog-legged granite stairs to rooftop mumty tower</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Common Sanitary Hub</td>
                    <td className="p-2.5 font-mono text-amber-400">WC 4'×4' • Bath 4'×6'</td>
                    <td className="p-2.5">40 sq ft</td>
                    <td className="p-2.5 text-gray-400">Separate WC & shower, central vanity & washing machine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Facade & Elevation Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
              <span className="font-bold text-amber-300">South Elevation Signature</span>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Corner pilaster with 6 horizontal recessed groove lines, two projecting concrete box windows with lower display ledges, and a central split-stone cladding niche with warm 3000K up-down architectural sconce lighting.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
              <span className="font-bold text-amber-300">Circulation Axis</span>
              <p className="text-gray-400 leading-relaxed text-[11px]">
                Double entrance doors lead from the porch into the living hall, through an 8'6" central foyer transitioning into a 4'0" straight corridor directly to the rear service exit door on the west elevation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

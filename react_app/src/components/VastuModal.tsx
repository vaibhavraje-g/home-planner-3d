import React from 'react';
import { X, ShieldCheck, Compass, Sun, Flame, Wind, Mountain } from 'lucide-react';
import { ROOM_DEFINITIONS } from '../types/architectural';

interface VastuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (roomId: string) => void;
}

export const VastuModal: React.FC<VastuModalProps> = ({ isOpen, onClose, onSelectRoom }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-panel rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Vastu Shastra Architectural Alignment
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  East Facing Villa
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Ground-truth Vedic orientation analysis for the 37' × 50' layout
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
          {/* Summary Box */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col gap-1.5 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>100% Vastu Purusha Mandala Harmony</span>
            </div>
            <p>
              This 37' 0" × 50' 0" architectural plan satisfies the ancient Vastu guidelines for residential villas: the main entrance welcomes morning prana from the East, the Pooja Ghar occupies the sacred North-East (Ishan), the Kitchen resides in the fire quadrant (Agni / South-East), and the Master Bedroom anchors in the South-West (Nairutya).
            </p>
          </div>

          {/* Quadrant Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Ishan NE */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> North-East (Ishan Corner)
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-1.5 py-0.5 rounded">
                  Pooja Ghar (5'×3')
                </span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                The most auspicious quadrant for spiritual devotion and mental serenity. Positioned in the tranquil corner of the kitchen with an open carved teak jali partition.
              </p>
              <button
                onClick={() => {
                  onSelectRoom('puja');
                  onClose();
                }}
                className="mt-1 text-left text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline"
              >
                Teleport to Pooja Ghar →
              </button>
            </div>

            {/* Agni SE */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> South-East (Agni Corner)
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-1.5 py-0.5 rounded">
                  Kitchen (12'×18')
                </span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                The Fire element quadrant. Cooking platform faces East so the cook always faces the morning sun, invoking culinary health and vitality.
              </p>
              <button
                onClick={() => {
                  onSelectRoom('kitchen');
                  onClose();
                }}
                className="mt-1 text-left text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline"
              >
                Teleport to Kitchen →
              </button>
            </div>

            {/* Nairutya SW */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-amber-400" /> South-West (Nairutya Corner)
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-1.5 py-0.5 rounded">
                  Master Bed (12'×14'6")
                </span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                The Earth element quadrant representing stability and leadership. Placing the master suite here ensures sound sleep, financial grounding, and household authority.
              </p>
              <button
                onClick={() => {
                  onSelectRoom('master');
                  onClose();
                }}
                className="mt-1 text-left text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline"
              >
                Teleport to Master Bedroom →
              </button>
            </div>

            {/* Vayu NW */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-amber-400" /> North-West (Vayu Corner)
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/15 px-1.5 py-0.5 rounded">
                  Bedrooms 2 & 3
                </span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                The Air element quadrant governing movement and mental freshness. Ideal for growing children and guest bedrooms, fostering active minds.
              </p>
              <button
                onClick={() => {
                  onSelectRoom('bed2');
                  onClose();
                }}
                className="mt-1 text-left text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline"
              >
                Teleport to Bedroom 2 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

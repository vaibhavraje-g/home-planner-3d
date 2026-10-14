import React from 'react';
import {
  Eye,
  Layers,
  Compass,
  Sun,
  Moon,
  Flame,
  Trees,
  Home,
  Fan,
  Tag,
  MapPin,
  Camera,
  Info,
  ShieldCheck
} from 'lucide-react';
import { TimeOfDay } from '../types/architectural';

interface TopNavProps {
  mode: 'orbit' | 'dollhouse' | 'walk';
  setMode: (mode: 'orbit' | 'dollhouse' | 'walk') => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  isSkyActive: boolean;
  toggleSky: () => void;
  isGroundActive: boolean;
  toggleGround: () => void;
  isRoofActive: boolean;
  toggleRoof: () => void;
  isFansActive: boolean;
  toggleFans: () => void;
  showLabels: boolean;
  toggleLabels: () => void;
  openBlueprint: () => void;
  openSpecs: () => void;
  openVastu: () => void;
  onCaptureSnapshot: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  mode,
  setMode,
  timeOfDay,
  setTimeOfDay,
  isSkyActive,
  toggleSky,
  isGroundActive,
  toggleGround,
  isRoofActive,
  toggleRoof,
  isFansActive,
  toggleFans,
  showLabels,
  toggleLabels,
  openBlueprint,
  openSpecs,
  openVastu,
  onCaptureSnapshot
}) => {
  return (
    <header className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:p-3 glass-panel rounded-2xl border border-white/10 shadow-2xl">
      {/* Brand & Scale Badge */}
      <div className="flex items-center gap-2.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-sm">
              37' × 50' Villa
            </span>
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              3D Architectural Visualizer <span className="text-amber-400">&</span> Asian Paints Studio
            </h1>
          </div>
          <p className="text-[10.5px] text-gray-400 hidden sm:block">
            Ground Truth Construction Blueprint • Sunken Porch Wood • Fixed Teak Tiles
          </p>
        </div>
      </div>

      {/* 3 Main Exploration Modes */}
      <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setMode('orbit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'orbit'
              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
          title="Full exterior 3D Orbit view"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exterior Orbit</span>
          <span className="sm:hidden">Orbit</span>
        </button>

        <button
          onClick={() => setMode('dollhouse')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'dollhouse'
              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
          title="Cutaway roof dollhouse view into all rooms"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cutaway Dollhouse</span>
          <span className="sm:hidden">Dollhouse</span>
        </button>

        <button
          onClick={() => setMode('walk')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mode === 'walk'
              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
          title="Walk inside at 5'2&quot; human eye level"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Walk Inside</span>
          <span className="sm:hidden">Walk</span>
        </button>
      </div>

      {/* Time of Day Switcher */}
      <div className="hidden lg:flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
        {[
          { id: 'morning', label: 'Morning', icon: Sun },
          { id: 'noon', label: 'Noon', icon: Sun },
          { id: 'sunset', label: 'Sunset', icon: Flame },
          { id: 'night', label: 'Night', icon: Moon }
        ].map((t) => {
          const isSelected = timeOfDay === t.id;
          const IconComp = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTimeOfDay(t.id as TimeOfDay)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={`Simulate ${t.label} Architectural Lighting`}
            >
              <IconComp className="w-3 h-3" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Action Tools */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={openBlueprint}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm"
          title="Open Interactive 2D Blueprint"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>2D Plan</span>
        </button>

        <button
          onClick={openVastu}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25 hover:bg-amber-500/20 transition-all"
          title="Vastu Shastra Compliance Report"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Vastu</span>
        </button>

        <button
          onClick={openSpecs}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
          title="View Dimensions & Room Schedule"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Specs</span>
        </button>

        <button
          onClick={onCaptureSnapshot}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
          title="Download High-Resolution 3D Snapshot"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Snapshot</span>
        </button>
      </div>
    </header>
  );
};

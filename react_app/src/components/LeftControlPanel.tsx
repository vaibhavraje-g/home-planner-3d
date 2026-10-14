import React, { useState } from 'react';
import {
  Compass,
  DoorOpen,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Flame,
  ShieldCheck,
  Footprints,
  Sparkles,
  Box
} from 'lucide-react';
import {
  TimeOfDay,
  CAMERA_PRESETS,
  ROOM_DEFINITIONS
} from '../types/architectural';

interface LeftControlPanelProps {
  onSelectPreset: (presetId: string) => void;
  onTeleportRoom: (roomId: string) => void;
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  sunIntensity: number;
  setSunIntensity: (val: number) => void;
  interiorLightsActive: boolean;
  setInteriorLightsActive: (val: boolean) => void;
  isFansActive: boolean;
  setIsFansActive: (val: boolean) => void;
  isCinematicBloom: boolean;
  setIsCinematicBloom: (val: boolean) => void;
  onOpenBlenderStudio: () => void;
  onOpenVastuModal: () => void;
  activeRoomId?: string;
}

export const LeftControlPanel: React.FC<LeftControlPanelProps> = ({
  onSelectPreset,
  onTeleportRoom,
  timeOfDay,
  setTimeOfDay,
  sunIntensity,
  setSunIntensity,
  interiorLightsActive,
  setInteriorLightsActive,
  isFansActive,
  setIsFansActive,
  isCinematicBloom,
  setIsCinematicBloom,
  onOpenBlenderStudio,
  onOpenVastuModal,
  activeRoomId
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'views' | 'rooms' | 'lighting'>('views');

  return (
    <aside
      className={`fixed top-[74px] left-2.5 z-30 transition-all duration-300 pointer-events-auto flex items-start ${
        isOpen ? 'w-[320px] sm:w-[350px]' : 'w-auto'
      }`}
      style={{ maxHeight: 'calc(100vh - 86px)' }}
    >
      {/* Main Drawer Body (When Expanded) */}
      {isOpen && (
        <div className="w-full glass-panel rounded-2xl border border-white/15 shadow-2xl flex flex-col overflow-hidden max-h-[calc(100vh-96px)]">
          {/* Header Bar */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {activeTab === 'views' && <Compass className="w-4 h-4" />}
                {activeTab === 'rooms' && <DoorOpen className="w-4 h-4" />}
                {activeTab === 'lighting' && <Sun className="w-4 h-4" />}
              </span>
              <div>
                <h3 className="text-xs font-bold text-white tracking-tight uppercase">
                  {activeTab === 'views' && 'Elevations & Perspectives'}
                  {activeTab === 'rooms' && 'Walk Inside Room Teleports'}
                  {activeTab === 'lighting' && 'Daylight & Interior LEDs'}
                </h3>
                <span className="text-[10px] text-gray-400 block -mt-0.5">
                  {activeTab === 'views' && '37\' × 50\' Villa 4-Elevation Presets'}
                  {activeTab === 'rooms' && '5\' 2" Human Eye Level Inside'}
                  {activeTab === 'lighting' && 'Sun Direction, Warm Sconces & Fans'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              title="Collapse left panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TAB 1: ELEVATIONS & CAMERA PRESETS */}
          {activeTab === 'views' && (
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 text-xs">
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">
                Architectural Elevations:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {CAMERA_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 transition-all text-left group"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">
                        {preset.elevation}
                      </span>
                      <strong className="text-xs text-white group-hover:text-amber-300 block">
                        {preset.label}
                      </strong>
                      <span className="text-[10px] text-gray-400 block">{preset.sub}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ROOM TELEPORTS */}
          {activeTab === 'rooms' && (
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">
                  Walk Inside Rooms (10):
                </span>
                <span className="text-[10px] text-amber-400 font-mono">5' 2" Eye Level</span>
              </div>

              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200">
                <Footprints className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Use <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/20 font-bold">W A S D</kbd> or Arrow Keys to walk inside.</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {ROOM_DEFINITIONS.map((room) => {
                  const isCurrentRoom = activeRoomId === room.id;
                  return (
                    <button
                      key={room.id}
                      onClick={() => onTeleportRoom(room.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex flex-col gap-0.5 group ${
                        isCurrentRoom
                          ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50'
                          : 'bg-white/5 hover:bg-amber-500/15 border-white/10 hover:border-amber-400/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-white group-hover:text-amber-300">
                          {room.name}
                        </strong>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">
                          {room.dimensions}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <span className="text-amber-300/80 font-semibold">{room.vastuZone}</span>
                        <span>•</span>
                        <span className="line-clamp-1">{room.tagline}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LIGHTING & TIME OF DAY */}
          {activeTab === 'lighting' && (
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 text-xs">
              {/* Time of Day Switcher */}
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-gray-200 text-[11px] uppercase tracking-wide">
                  Daylight & Sun Angle:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'morning', label: 'Morning Sun', icon: Sun, desc: 'East Sun & Soft Shadows' },
                    { id: 'noon', label: 'Midday Noon', icon: Sun, desc: 'High-Contrast Daylight' },
                    { id: 'sunset', label: 'Golden Sunset', icon: Flame, desc: 'Warm 3000K Sconces' },
                    { id: 'night', label: 'Night Studio', icon: Moon, desc: 'POP LEDs & Accent Sconces' }
                  ].map((t) => {
                    const isCurrent = timeOfDay === t.id;
                    const IconComp = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTimeOfDay(t.id as TimeOfDay)}
                        className={`p-2 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          isCurrent
                            ? 'bg-amber-500/25 border-amber-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <IconComp className="w-3.5 h-3.5 text-amber-400" />
                          <strong className="text-xs">{t.label}</strong>
                        </div>
                        <span className="text-[9px] text-gray-400 line-clamp-1">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sun Intensity */}
              <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-200">Natural Sun Intensity</span>
                  <span className="text-amber-400 font-mono font-bold">{sunIntensity.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={sunIntensity}
                  onChange={(e) => setSunIntensity(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* POP Cove & Spotlights */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-200">POP Ceiling LEDs</span>
                  <span className="text-[10px] text-gray-400">Warm 3000K concealed tray lighting</span>
                </div>
                <button
                  onClick={() => setInteriorLightsActive(!interiorLightsActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    interiorLightsActive ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {interiorLightsActive ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Ceiling Fans Rotation */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-200">Ceiling Fans Rotation</span>
                  <span className="text-[10px] text-gray-400">Aerodynamic blades in all rooms</span>
                </div>
                <button
                  onClick={() => setIsFansActive(!isFansActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isFansActive ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {isFansActive ? 'SPIN' : 'STOP'}
                </button>
              </div>

              {/* Cinematic Post-Processing Bloom */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Cinematic PBR Bloom
                  </span>
                  <span className="text-[10px] text-gray-400">Soft glow on LEDs, sconces & sunlight</span>
                </div>
                <button
                  onClick={() => setIsCinematicBloom(!isCinematicBloom)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isCinematicBloom ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {isCinematicBloom ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Blender 3D Export Quick Trigger */}
              <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-orange-300 flex items-center gap-1.5 text-xs">
                    <Box className="w-3.5 h-3.5 text-orange-400" />
                    Blender & Cycles Studio
                  </span>
                  <span className="text-[10px] text-gray-400">Export .GLB or procedural Python</span>
                </div>
                <button
                  onClick={onOpenBlenderStudio}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 text-slate-950 hover:bg-orange-400 transition-all shadow-sm"
                >
                  Open
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mini Vertical Pill Bar (Always visible on left edge) */}
      <div className="flex flex-col items-center gap-1.5 p-1 rounded-2xl glass-panel shadow-2xl border border-white/15 ml-1 shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-amber-400 hover:text-white hover:bg-white/10 transition-colors"
          title={isOpen ? 'Collapse Panel' : 'Expand Views & Room Navigation'}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        <div className="w-6 h-[1px] bg-white/15 my-0.5" />

        <button
          onClick={() => {
            setIsOpen(true);
            setActiveTab('views');
          }}
          className={`p-2 rounded-xl transition-all ${
            isOpen && activeTab === 'views'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Elevations & Camera Presets"
        >
          <Compass className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setIsOpen(true);
            setActiveTab('rooms');
          }}
          className={`p-2 rounded-xl transition-all ${
            isOpen && activeTab === 'rooms'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Walk Inside Room Teleports"
        >
          <DoorOpen className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setIsOpen(true);
            setActiveTab('lighting');
          }}
          className={`p-2 rounded-xl transition-all ${
            isOpen && activeTab === 'lighting'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          title="Time of Day & Architectural Lighting"
        >
          <Sun className="w-4 h-4" />
        </button>

        <div className="w-6 h-[1px] bg-white/15 my-0.5" />

        <button
          onClick={onOpenVastuModal}
          className="p-2 rounded-xl text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/15 transition-all"
          title="Vastu Shastra Compliance & Orientations"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

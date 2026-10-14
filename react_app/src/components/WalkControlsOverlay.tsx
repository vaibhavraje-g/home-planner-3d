import React from 'react';
import { Eye, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CornerUpLeft } from 'lucide-react';
import { ROOM_DEFINITIONS } from '../types/architectural';

interface WalkControlsOverlayProps {
  mode: 'orbit' | 'dollhouse' | 'walk';
  activeRoomId: string;
  onExitWalk: () => void;
}

export const WalkControlsOverlay: React.FC<WalkControlsOverlayProps> = ({
  mode,
  activeRoomId,
  onExitWalk
}) => {
  if (mode !== 'walk') return null;

  const activeRoom = ROOM_DEFINITIONS.find((r) => r.id === activeRoomId) || ROOM_DEFINITIONS[0];

  // Helper to dispatch keyboard events for mobile D-pad
  const simulateKey = (code: string, isDown: boolean) => {
    window.dispatchEvent(new KeyboardEvent(isDown ? 'keydown' : 'keyup', { code, bubbles: true }));
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 pb-28 sm:pb-36">
      {/* Top Banner showing current room */}
      <div className="flex justify-center">
        <div className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-xl glass-panel border border-amber-400/40 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">Inside {activeRoom.name}</span>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/20 px-1.5 py-0.2 rounded">
                {activeRoom.dimensions}
              </span>
            </div>
            <span className="text-[10px] text-gray-300">5' 2" Human Eye Level • 360° Drag to Look</span>
          </div>

          <button
            onClick={onExitWalk}
            className="ml-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/15"
          >
            <CornerUpLeft className="w-3.5 h-3.5" />
            <span>Exterior</span>
          </button>
        </div>
      </div>

      {/* Bottom Area: Keyboard Hint on Desktop, Virtual D-pad for Touch/Mobile */}
      <div className="flex items-end justify-between">
        {/* Desktop Keyboard Hints */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-gray-300">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[10px] font-bold">
              W
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[10px] font-bold">
              A
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[10px] font-bold">
              S
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[10px] font-bold">
              D
            </kbd>
            <span className="ml-1 text-[11px] text-gray-400">or Arrows to Walk</span>
          </div>
          <span className="text-gray-500">•</span>
          <span className="text-[11px] text-gray-400">Left-Drag to Rotate Sightline</span>
        </div>

        {/* Mobile On-Screen D-Pad (Virtual Joystick) */}
        <div className="sm:hidden pointer-events-auto flex flex-col items-center gap-1 bg-black/70 p-2 rounded-2xl border border-white/15 backdrop-blur-lg ml-auto">
          <button
            onPointerDown={() => simulateKey('KeyW', true)}
            onPointerUp={() => simulateKey('KeyW', false)}
            onPointerLeave={() => simulateKey('KeyW', false)}
            className="w-10 h-10 rounded-xl bg-white/15 active:bg-amber-500 active:text-slate-950 text-white flex items-center justify-center transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onPointerDown={() => simulateKey('KeyA', true)}
              onPointerUp={() => simulateKey('KeyA', false)}
              onPointerLeave={() => simulateKey('KeyA', false)}
              className="w-10 h-10 rounded-xl bg-white/15 active:bg-amber-500 active:text-slate-950 text-white flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onPointerDown={() => simulateKey('KeyS', true)}
              onPointerUp={() => simulateKey('KeyS', false)}
              onPointerLeave={() => simulateKey('KeyS', false)}
              className="w-10 h-10 rounded-xl bg-white/15 active:bg-amber-500 active:text-slate-950 text-white flex items-center justify-center transition-colors"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onPointerDown={() => simulateKey('KeyD', true)}
              onPointerUp={() => simulateKey('KeyD', false)}
              onPointerLeave={() => simulateKey('KeyD', false)}
              className="w-10 h-10 rounded-xl bg-white/15 active:bg-amber-500 active:text-slate-950 text-white flex items-center justify-center transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

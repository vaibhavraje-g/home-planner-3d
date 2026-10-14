import React from 'react';
import { ROOM_DEFINITIONS, RoomDefinition } from '../types/architectural';

interface LabelPosition {
  id: string;
  x: number;
  y: number;
  visible: boolean;
}

interface FloatingLabelsOverlayProps {
  labelPositions: LabelPosition[];
  showLabels: boolean;
  mode: 'orbit' | 'dollhouse' | 'walk';
  onTeleportRoom: (roomId: string) => void;
}

export const FloatingLabelsOverlay: React.FC<FloatingLabelsOverlayProps> = ({
  labelPositions,
  showLabels,
  mode,
  onTeleportRoom
}) => {
  if (!showLabels || mode === 'walk') return null;

  const roomMap = new Map<string, RoomDefinition>(ROOM_DEFINITIONS.map((r) => [r.id, r]));

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {labelPositions.map((pos) => {
        if (!pos.visible) return null;
        const room = roomMap.get(pos.id);
        if (!room) return null;

        return (
          <div
            key={pos.id}
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onTeleportRoom(pos.id)}
            className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center select-none"
          >
            <div className="px-2.5 py-1 rounded-lg bg-slate-950/85 hover:bg-amber-500 border border-amber-400/50 hover:border-amber-300 shadow-xl backdrop-blur-md transition-all duration-200 transform group-hover:scale-105 group-hover:-translate-y-1">
              <span className="text-[11px] font-bold text-white group-hover:text-slate-950 transition-colors block text-center leading-tight">
                {room.name}
              </span>
              <span className="text-[9px] text-gray-300 group-hover:text-slate-900 transition-colors block text-center font-mono">
                {room.dimensions}
              </span>
            </div>
            {/* Small arrow pointing downward */}
            <div className="w-1.5 h-1.5 rotate-45 bg-slate-950/85 border-r border-b border-amber-400/50 group-hover:bg-amber-500 -mt-1" />
          </div>
        );
      })}
    </div>
  );
};

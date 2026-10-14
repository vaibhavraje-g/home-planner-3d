import React, { useState } from 'react';
import { X, MapPin, CheckCircle, ExternalLink, Compass, ShieldCheck } from 'lucide-react';
import { RoomDefinition, ROOM_DEFINITIONS } from '../types/architectural';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (roomId: string) => void;
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  isOpen,
  onClose,
  onSelectRoom
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'site_photos'>('plan');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] glass-panel rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Ground Truth Architectural Plan & Blueprint
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                  37' 0" × 50' 0"
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Click any room on the interactive floor plan to immediately teleport the 3D camera inside.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-black/40 border border-white/10 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('plan')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'plan' ? 'bg-amber-400 text-slate-950 shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                Interactive 2D Plan
              </button>
              <button
                onClick={() => setActiveTab('site_photos')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'site_photos' ? 'bg-amber-400 text-slate-950 shadow' : 'text-gray-300 hover:text-white'
                }`}
              >
                Construction Site Reference
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {activeTab === 'plan' ? (
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
              {/* Interactive 2D SVG Blueprint */}
              <div className="relative w-full max-w-[480px] aspect-[37/50] bg-[#161a23] rounded-xl border border-white/20 p-2 shadow-2xl flex flex-col justify-between">
                {/* SVG Blueprint Plan */}
                <svg
                  viewBox="0 0 370 500"
                  className="w-full h-full font-sans select-none"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}
                >
                  {/* Outer Villa Boundary */}
                  <rect x="5" y="5" width="360" height="490" fill="#1e2430" stroke="#94a3b8" strokeWidth="4" />

                  {/* 1. Porch (Front-Right: X=165 to 365, Y=375 to 495) */}
                  <g
                    onClick={() => {
                      onSelectRoom('porch');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('porch')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer transition-all"
                  >
                    <rect
                      x="165"
                      y="375"
                      width="200"
                      height="120"
                      fill={hoveredRoom === 'porch' ? '#e5a952' : '#333b4d'}
                      stroke="#fbbf24"
                      strokeWidth="2"
                      opacity="0.85"
                    />
                    <text x="265" y="425" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                      PORCH
                    </text>
                    <text x="265" y="442" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                      20'6" × 12'6"
                    </text>
                    {/* Pillar */}
                    <circle cx="345" cy="475" r="9" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                    {/* Steps */}
                    <line x1="200" y1="495" x2="330" y2="495" stroke="#fff" strokeWidth="3" />
                    <line x1="205" y1="490" x2="325" y2="490" stroke="#94a3b8" strokeWidth="2" />
                  </g>

                  {/* 2. Living Room (Front-Center/Right: X=165 to 365, Y=225 to 375) */}
                  <g
                    onClick={() => {
                      onSelectRoom('living');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('living')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="165"
                      y="225"
                      width="200"
                      height="150"
                      fill={hoveredRoom === 'living' ? '#e5a952' : '#283142'}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <text x="265" y="295" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                      LIVING ROOM
                    </text>
                    <text x="265" y="315" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                      21'0" × 16'6"
                    </text>
                  </g>

                  {/* 3. Kitchen (Front-Left: X=5 to 165, Y=350 to 495) */}
                  <g
                    onClick={() => {
                      onSelectRoom('kitchen');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('kitchen')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="5"
                      y="350"
                      width="160"
                      height="145"
                      fill={hoveredRoom === 'kitchen' ? '#e5a952' : '#2b3648'}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <text x="75" y="415" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                      KITCHEN
                    </text>
                    <text x="75" y="432" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                      12'0" × 18'0"
                    </text>
                    {/* Kitchen Platform */}
                    <path d="M 15 485 L 15 370 L 65 370" fill="none" stroke="#60a5fa" strokeWidth="4" />
                  </g>

                  {/* 4. Pooja Ghar (East-North corner of Kitchen: X=115 to 165, Y=445 to 495) */}
                  <g
                    onClick={() => {
                      onSelectRoom('puja');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('puja')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="115"
                      y="445"
                      width="50"
                      height="50"
                      fill={hoveredRoom === 'puja' ? '#e5a952' : '#3d4454'}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    <text x="140" y="468" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold">
                      PUJA
                    </text>
                    <text x="140" y="480" textAnchor="middle" fill="#cbd5e1" fontSize="7.5">
                      5'×3'
                    </text>
                  </g>

                  {/* 5. Central Passage (X=145 to 165, runs vertically, and horizontal hallway Y=145 to 225) */}
                  <g
                    onClick={() => {
                      onSelectRoom('passage');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('passage')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="145"
                      y="145"
                      width="80"
                      height="80"
                      fill={hoveredRoom === 'passage' ? '#e5a952' : '#222938'}
                      stroke="#475569"
                      strokeDasharray="3 3"
                    />
                    <rect
                      x="145"
                      y="5"
                      width="40"
                      height="140"
                      fill={hoveredRoom === 'passage' ? '#e5a952' : '#222938'}
                      stroke="#475569"
                      strokeDasharray="3 3"
                    />
                    <text x="185" y="185" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                      PASSAGE
                    </text>
                    <text x="185" y="198" textAnchor="middle" fill="#64748b" fontSize="8.5">
                      8'6" → 4'0"
                    </text>
                    {/* Straight Path Arrow */}
                    <line x1="165" y1="420" x2="165" y2="10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                    <polygon points="165,5 160,15 170,15" fill="#f59e0b" />
                  </g>

                  {/* 6. Bedroom 2 (Middle-Left: X=5 to 145, Y=230 to 350) */}
                  <g
                    onClick={() => {
                      onSelectRoom('bed2');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('bed2')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="5"
                      y="230"
                      width="140"
                      height="120"
                      fill={hoveredRoom === 'bed2' ? '#e5a952' : '#293344'}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <text x="75" y="300" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                      BEDROOM 2
                    </text>
                    <text x="75" y="318" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                      14'0" × 11'0"
                    </text>
                  </g>

                  {/* Bed 2 Attached Toilet (5' x 10'6": X=5 to 95, Y=230 to 275) */}
                  <rect x="5" y="230" width="90" height="45" fill="#202733" stroke="#64748b" strokeWidth="1.5" />
                  <text x="50" y="255" textAnchor="middle" fill="#94a3b8" fontSize="8.5">
                    TOILET 5'×10'6"
                  </text>

                  {/* 7. Staircase (X=5 to 145, Y=145 to 230) */}
                  <g className="cursor-pointer">
                    <rect x="5" y="145" width="140" height="85" fill="#1e2330" stroke="#64748b" strokeWidth="1.5" />
                    {/* Stair Treads */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <line
                        key={i}
                        x1={30 + i * 14}
                        y1="145"
                        x2={30 + i * 14}
                        y2="185"
                        stroke="#475569"
                        strokeWidth="1.5"
                      />
                    ))}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <line
                        key={i}
                        x1={30 + i * 14}
                        y1="190"
                        x2={30 + i * 14}
                        y2="230"
                        stroke="#475569"
                        strokeWidth="1.5"
                      />
                    ))}
                    <text x="75" y="190" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                      STAIRCASE 11'×6'
                    </text>
                  </g>

                  {/* 8. Bedroom 3 (Rear-Left: X=5 to 145, Y=5 to 145) */}
                  <g
                    onClick={() => {
                      onSelectRoom('bed3');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('bed3')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="5"
                      y="5"
                      width="140"
                      height="140"
                      fill={hoveredRoom === 'bed3' ? '#e5a952' : '#293344'}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <text x="75" y="75" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                      BEDROOM 3
                    </text>
                    <text x="75" y="93" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                      14'0" × 12'0"
                    </text>
                  </g>

                  {/* 9. Common Sanitary Hub (Rear-Center: X=185 to 225, Y=5 to 145) */}
                  <g
                    onClick={() => {
                      onSelectRoom('sanitary');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('sanitary')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect x="185" y="5" width="40" height="40" fill="#202733" stroke="#64748b" strokeWidth="1.5" />
                    <text x="205" y="28" textAnchor="middle" fill="#94a3b8" fontSize="8.5">
                      WC 4'×4'
                    </text>
                    <rect x="185" y="45" width="40" height="60" fill="#202733" stroke="#64748b" strokeWidth="1.5" />
                    <text x="205" y="78" textAnchor="middle" fill="#94a3b8" fontSize="8.5">
                      BATH 4'×6'
                    </text>
                  </g>

                  {/* 10. Master Bedroom (Rear-Right: X=225 to 365, Y=5 to 225) */}
                  <g
                    onClick={() => {
                      onSelectRoom('master');
                      onClose();
                    }}
                    onMouseEnter={() => setHoveredRoom('master')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="225"
                      y="5"
                      width="140"
                      height="220"
                      fill={hoveredRoom === 'master' ? '#e5a952' : '#293344'}
                      stroke="#94a3b8"
                      strokeWidth="2"
                    />
                    <text x="295" y="115" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">
                      MASTER BED
                    </text>
                    <text x="295" y="133" textAnchor="middle" fill="#cbd5e1" fontSize="10">
                      12'0" × 14'6"
                    </text>
                  </g>

                  {/* Master Attached Toilet (Rear: X=225 to 365, Y=5 to 45) */}
                  <rect x="225" y="5" width="140" height="40" fill="#202733" stroke="#64748b" strokeWidth="1.5" />
                  <text x="295" y="28" textAnchor="middle" fill="#94a3b8" fontSize="8.5">
                    ATTACHED TOILET 12'×4'
                  </text>

                  {/* Dimensions & Compass Markers */}
                  <text x="185" y="495" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
                    37' 0" WIDTH
                  </text>
                  <text
                    x="368"
                    y="250"
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize="11"
                    fontWeight="bold"
                    transform="rotate(90, 368, 250)"
                  >
                    50' 0" LENGTH
                  </text>
                </svg>

                {/* Vastu & Compass Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-md text-[10px] text-amber-300 font-mono border border-white/10">
                  <Compass className="w-3.5 h-3.5" />
                  <span>East Entrance (Vastu Auspicious)</span>
                </div>
              </div>

              {/* Room Quick Selection Panel */}
              <div className="flex-1 flex flex-col gap-2 max-h-[440px] overflow-y-auto">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Select Room to Walk Inside:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ROOM_DEFINITIONS.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        onSelectRoom(room.id);
                        onClose();
                      }}
                      onMouseEnter={() => setHoveredRoom(room.id)}
                      onMouseLeave={() => setHoveredRoom(null)}
                      className="p-2.5 rounded-xl text-left bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 transition-all flex flex-col gap-0.5 group"
                    >
                      <strong className="text-xs text-white group-hover:text-amber-300">
                        {room.name}
                      </strong>
                      <span className="text-[11px] font-mono text-amber-400">{room.dimensions}</span>
                      <span className="text-[10px] text-gray-400 line-clamp-1">{room.tagline}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <strong>Architectural Ground Truth Verification:</strong> This 3D visualizer is built directly against the official 37' × 50' structural CAD blueprint and verified by on-site construction photos (brick masonry, plastered facade, and real teak tile porch cladding).
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-white">East Elevation & Sunken Porch</span>
                  <p className="text-[11px] text-gray-400">
                    Matches the plastered construction site photo with single circular pillar, 4 black granite entrance steps, left-side main entrance door, right-side verandah window, and geometric parapet cutout frames above.
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-white">South Facade: 2 Box Windows & Sconces</span>
                  <p className="text-[11px] text-gray-400">
                    Faithfully incorporates the 6 horizontal corner grooves, two concrete box window frames with lower display ledges, and central split-stone cladding niche with architectural up-down illumination.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

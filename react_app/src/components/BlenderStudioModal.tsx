import React, { useState } from 'react';
import {
  X,
  Box,
  Download,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Terminal,
  Shield,
  SunMedium,
  Camera
} from 'lucide-react';

interface BlenderStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportGLB: () => void;
  isExporting?: boolean;
}

export const BlenderStudioModal: React.FC<BlenderStudioModalProps> = ({
  isOpen,
  onClose,
  onExportGLB,
  isExporting = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'script' | 'frameworks' | 'guide'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleCopyScript = () => {
    fetch('./blender_villa_generator.py')
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      })
      .catch(() => {
        // Fallback snippet
        navigator.clipboard.writeText("blender --background -P blender_villa_generator.py");
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] glass-panel rounded-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden bg-slate-950/95 text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Box className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight uppercase">
                  Blender & Professional 3D Visualization Pipeline
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-slate-950 uppercase tracking-wider">
                  Cycles & glTF 2.0
                </span>
              </div>
              <p className="text-[11.5px] text-gray-400 -mt-0.5">
                How architectural firms use Blender, baked lightmaps, PBR materials, and real-time WebGL engines
              </p>
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

        {/* Quick Export Action Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs text-gray-300 font-medium">
              Live Model Ready with Active Asian Paints Swatches
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportGLB}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="Download glTF 2.0 Binary file for Blender"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting glTF...' : 'Export to Blender (.GLB)'}</span>
            </button>

            <a
              href="./blender_villa_generator.py"
              download="blender_villa_generator.py"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all"
              title="Download procedural Blender Python automation script"
            >
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              <span>Download Python Script (.py)</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 px-4 bg-black/40 text-xs">
          {[
            { id: 'overview', label: 'Architectural Pipeline', icon: Layers },
            { id: 'guide', label: 'Blender Import Guide', icon: Box },
            { id: 'script', label: 'Blender Python Script', icon: Terminal },
            { id: 'frameworks', label: 'Engines & Frameworks', icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 font-semibold transition-all border-b-2 -mb-px ${
                  isActive
                    ? 'border-orange-500 text-orange-400 bg-white/5'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-sm text-gray-300">
          
          {/* TAB 1: OVERVIEW & PIPELINE */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-4xl">
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <h3 className="text-sm font-bold text-orange-300 flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  How Modern Studios Render Photorealistic Architecture
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Professional architectural studios do not rely solely on real-time browser shaders. They use 
                  <strong> Blender</strong> to calculate physically accurate light bounces (global illumination, 
                  caustics, and ambient occlusion), and then bridge that data into <strong>Three.js</strong> 
                  and <strong>Diffusion AI</strong> for real-time interaction.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wide">
                    <SunMedium className="w-4 h-4" />
                    1. Cycles Path-Tracing Engine
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Blender's <strong>Cycles</strong> simulates the physics of light rays. When sunlight hits the teak 
                    wood porch floor, light naturally bounces upward into the ceiling louvers, carrying a warm golden amber 
                    hue. This cannot be faked in simple rasterization without ray-tracing.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wide">
                    <Layers className="w-4 h-4" />
                    2. Lightmap & AO Baking for Web
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    To make heavy ray-traced lighting run at <strong>60 FPS on any phone or laptop</strong>, 3D artists 
                    bake the Cycles lighting solution into an <em>Ambient Occlusion (AO) map</em> or <em>Lightmap</em>. 
                    Three.js then loads this baked map as an <code className="text-amber-300 text-[11px]">aoMap</code>, 
                    giving photorealistic shadows with zero GPU lag.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <Camera className="w-4 h-4" />
                    3. Two-Point Perspective Tilt-Shift
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    The #1 hallmark of professional architectural photography is <strong>vertical line parallelism</strong>. 
                    Amateur 3D shots tilt the camera up or down, making walls look like they are falling backward (keystoning). 
                    Blender and Three.js solve this using camera shift leveling.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wide">
                    <Cpu className="w-4 h-4" />
                    4. glTF 2.0 PBR Standard
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    glTF (GL Transmission Format) is the universal 3D standard created by the Khronos Group. 
                    It packages geometries, normals, PBR material properties (roughness, metalness, clearcoat), 
                    and Asian Paints color metadata into a single compact <code className="text-amber-300 text-[11px]">.glb</code> file.
                  </p>
                </div>
              </div>

              {/* Architectural Workflow Diagram */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2.5">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  The End-to-End Architectural Visualization Pipeline
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    2D Blueprint (37'×50')
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Blender Procedural Model
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    glTF 2.0 PBR Export
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Three.js WebGL (Interactive)
                  </span>
                  <span className="text-gray-500">→</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Frontier AI Diffusion (8K Renders)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP BY STEP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold text-white">How to Import this House into Blender (Cycles / Eevee)</h3>
                  <p className="text-xs text-gray-400">Step-by-step instructions to render with offline Hollywood ray-tracing</p>
                </div>
                <button
                  onClick={onExportGLB}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500 text-slate-950 hover:bg-orange-400 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .GLB</span>
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Click "Export to Blender (.GLB)"</h4>
                    <p className="text-gray-400">
                      The browser generates a full glTF 2.0 binary file containing the exact walls, roof, teak porch, columns, 
                      granite steps, and active Asian Paints color codes.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Import into Blender 3.x / 4.x</h4>
                    <p className="text-gray-400">
                      Open Blender, delete the default cube, and click: <br />
                      <code className="text-amber-300 font-mono text-[11px] bg-black/40 px-1.5 py-0.5 rounded">File &gt; Import &gt; glTF 2.0 (.glb / .gltf)</code>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Preview Asian Paints PBR Shaders</h4>
                    <p className="text-gray-400">
                      Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">Z</kbd> on your keyboard 
                      and select <strong>Material Preview</strong>. You will see the Innocent White facade, Sand Drift chajja, 
                      Camel Skin frame, and teak wood grain textures instantly.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">4</span>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Switch Render Engine to Cycles GPU</h4>
                    <p className="text-gray-400">
                      Go to the Render Properties tab on the right side:
                      <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-300">
                        <li>Render Engine: <strong>Cycles</strong></li>
                        <li>Device: <strong>GPU Compute</strong> (NVIDIA RTX / AMD / Apple Metal)</li>
                        <li>Denoising: Check <strong>OpenImageDenoise</strong></li>
                      </ul>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center shrink-0">5</span>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">Press F12 to Render 4K Architectural Still</h4>
                    <p className="text-gray-400">
                      Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px]">F12</kbd>. Blender will calculate 
                      the full multi-bounce global illumination and produce a high-resolution render ready for client presentation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCRIPT AUTOMATION */}
          {activeTab === 'script' && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Blender Python Script (`blender_villa_generator.py`)</h3>
                  <p className="text-xs text-gray-400">
                    Run Blender headlessly without even opening the UI to generate the 3D villa
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Script'}</span>
                  </button>

                  <a
                    href="./blender_villa_generator.py"
                    download="blender_villa_generator.py"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500 text-slate-950 hover:bg-orange-400 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .py</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs">
                <div className="text-gray-400 mb-2"># Terminal CLI Command (Windows Powershell / Mac / Linux):</div>
                <div className="text-amber-300 font-bold p-2.5 rounded bg-white/5 border border-white/5 select-all">
                  blender --background -P blender_villa_generator.py
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide">Script Capabilities:</h4>
                <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-5">
                  <li>Procedural generation of the 37' × 50' plinth, 4 granite steps, circular pillar, and exterior walls.</li>
                  <li>Automatic assignment of Asian Paints colors using linear sRGB to Blender Principled BSDF nodes.</li>
                  <li>Configures physical Nishita Sky & Sun lighting at 42° elevation.</li>
                  <li>Places warm 3000K recessed point lights in living room, kitchen, bedroom, and stone sconces.</li>
                  <li>Sets up an architectural 35mm camera with zero tilt distortion.</li>
                  <li>Exports to standard glTF 2.0 binary (<code className="text-amber-300">.glb</code>) ready for game engines and web.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: ENGINES & FRAMEWORKS COMPARISON */}
          {activeTab === 'frameworks' && (
            <div className="space-y-4 max-w-4xl">
              <div>
                <h3 className="text-sm font-bold text-white">3D Architectural Frameworks & Libraries Compared</h3>
                <p className="text-xs text-gray-400">Which tool should you use for what purpose?</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-gray-200 border-b border-white/10 font-bold uppercase tracking-wider text-[10.5px]">
                      <th className="p-3">Framework / Tool</th>
                      <th className="p-3">Primary Role</th>
                      <th className="p-3">Lighting Method</th>
                      <th className="p-3">Performance</th>
                      <th className="p-3">Best Used For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-blue-400">Three.js / React (Current)</td>
                      <td className="p-3">Interactive Web App</td>
                      <td className="p-3">WebGL 2.0 PBR Architectural Shading</td>
                      <td className="p-3 text-emerald-400 font-semibold">60 FPS (Zero Install)</td>
                      <td className="p-3">Live client customization, Asian Paints swatches, orbit & walk-through</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-orange-400">Blender 4.x (Cycles)</td>
                      <td className="p-3">DCC & Offline Ray-Tracer</td>
                      <td className="p-3">Path-tracing (Multi-bounce GI)</td>
                      <td className="p-3 text-amber-400 font-semibold">1-5 mins / frame (GPU)</td>
                      <td className="p-3">Cinematic 4K architectural renders, lightmap baking, fly-through animations</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-indigo-400">Unreal Engine 5</td>
                      <td className="p-3">Real-Time AAA Engine</td>
                      <td className="p-3">Lumen Dynamic GI & Nanite</td>
                      <td className="p-3 text-emerald-400 font-semibold">60-120 FPS (Requires Dedicated GPU)</td>
                      <td className="p-3">Immersive VR walkthroughs, luxury real-estate showrooms</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="p-3 font-bold text-emerald-400">Frontier AI Diffusion</td>
                      <td className="p-3">AI Image Synthesis</td>
                      <td className="p-3">Geometry-conditioned Diffusion (ControlNet)</td>
                      <td className="p-3 text-blue-400 font-semibold">3-8 seconds / image</td>
                      <td className="p-3">Magazine-grade 8K photos, material exploration, interior styling ideas</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Summary Recommendation for this Villa Project:
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Use <strong>Three.js</strong> for sharing with family and contractors directly in mobile/desktop browsers 
                  with instantaneous color changes. For high-end marketing prints or elevation approval, export the 
                  <strong> .GLB</strong> into <strong>Blender</strong> for Cycles rendering, or use our <strong>8K AI Renders</strong> 
                  gallery for immediate photorealistic inspiration!
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopNav } from './components/TopNav';
import { LeftControlPanel } from './components/LeftControlPanel';
import { RightPaintStudio } from './components/RightPaintStudio';
import { BlueprintModal } from './components/BlueprintModal';
import { SpecsModal } from './components/SpecsModal';
import { VastuModal } from './components/VastuModal';
import { AiRendersModal } from './components/AiRendersModal';
import { BlenderStudioModal } from './components/BlenderStudioModal';
import { FloatingLabelsOverlay } from './components/FloatingLabelsOverlay';
import { WalkControlsOverlay } from './components/WalkControlsOverlay';
import {
  SurfaceCategory,
  CuratedTheme,
  TimeOfDay,
  CURATED_THEMES,
  CAMERA_PRESETS,
  ROOM_DEFINITIONS
} from './types/architectural';

export default function App() {
  // Exploration Mode: orbit | dollhouse | walk
  const [mode, setMode] = useState<'orbit' | 'dollhouse' | 'walk'>('orbit');

  // Paint & Theme state (Default: Theme 1 - Realistic Site Render)
  const defaultTheme = CURATED_THEMES[0];
  const [paintSettings, setPaintSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('home-planner-paint') || 'null');
      const colors = Object.fromEntries(
        (Object.keys(defaultTheme.colors) as SurfaceCategory[]).map((category) => {
          const savedColor = saved?.colors?.[category];
          return [category, typeof savedColor === 'string' && /^#[\da-f]{6}$/i.test(savedColor)
            ? savedColor
            : defaultTheme.colors[category]];
        })
      ) as Record<SurfaceCategory, string>;
      const themeId = saved?.themeId === 'clay' || saved?.themeId === -1 ||
        CURATED_THEMES.some((theme) => theme.id === saved?.themeId)
        ? saved.themeId
        : defaultTheme.id;
      return { colors, themeId: themeId as number | 'clay' };
    } catch {
      return { colors: defaultTheme.colors, themeId: defaultTheme.id };
    }
  });
  const { colors: categoryColors, themeId: activeThemeId } = paintSettings;

  React.useEffect(() => {
    try {
      localStorage.setItem('home-planner-paint', JSON.stringify(paintSettings));
    } catch {
      // The live palette still works if browser storage is unavailable.
    }
  }, [paintSettings]);
  const [activeCategory, setActiveCategory] = useState<SurfaceCategory>('ext_main');

  // Time of Day & Lighting state
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [sunIntensity, setSunIntensity] = useState<number>(1.25);
  const [interiorLightsActive, setInteriorLightsActive] = useState<boolean>(true);

  // Environment & Building visibility toggles
  const [isSkyActive, setIsSkyActive] = useState<boolean>(true);
  const [isGroundActive, setIsGroundActive] = useState<boolean>(true);
  const [isRoofActive, setIsRoofActive] = useState<boolean>(true);
  const [isFansActive, setIsFansActive] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(false);

  // Active room for Walk Inside mode
  const [activeRoomId, setActiveRoomId] = useState<string>('living');

  // Camera animations trigger
  const [cameraTrigger, setCameraTrigger] = useState<{
    pos: [number, number, number];
    look: [number, number, number];
    duration?: number;
  } | null>(null);

  // 3D projected label coordinates
  const [labelPositions, setLabelPositions] = useState<
    { id: string; x: number; y: number; visible: boolean }[]
  >([]);

  // Modals state
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [isVastuOpen, setIsVastuOpen] = useState<boolean>(false);
  const [isAiRendersOpen, setIsAiRendersOpen] = useState<boolean>(false);
  const [isBlenderOpen, setIsBlenderOpen] = useState<boolean>(false);

  // Cinematic Postprocessing & glTF Export state
  const [isCinematicBloom, setIsCinematicBloom] = useState<boolean>(false);
  const [isExportingGLB, setIsExportingGLB] = useState<boolean>(false);
  const exportGLBRef = React.useRef<(() => Promise<boolean>) | null>(null);

  const handleExportGLB = async () => {
    if (!exportGLBRef.current) return;
    setIsExportingGLB(true);
    try {
      await exportGLBRef.current();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExportingGLB(false);
    }
  };

  // Mode change handler
  const handleSetMode = (newMode: 'orbit' | 'dollhouse' | 'walk') => {
    setMode(newMode);
    if (newMode === 'orbit') {
      setIsRoofActive(true);
      const iso = CAMERA_PRESETS.find((p) => p.id === 'iso') || CAMERA_PRESETS[0];
      setCameraTrigger({ pos: iso.pos, look: iso.look, duration: 850 });
    } else if (newMode === 'dollhouse') {
      setIsRoofActive(false); // Detach roof in dollhouse view
      setCameraTrigger({ pos: [34, 48, 36], look: [0, 4, -2], duration: 950 });
    } else if (newMode === 'walk') {
      setIsRoofActive(true);
      handleTeleportRoom(activeRoomId || 'living');
    }
  };

  // Camera preset handler
  const handleSelectPreset = (presetId: string) => {
    if (mode === 'walk') {
      setMode('orbit');
      setIsRoofActive(true);
    }
    const preset = CAMERA_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCameraTrigger({ pos: preset.pos, look: preset.look, duration: 850 });
    }
  };

  // Room teleport handler (human eye level inside)
  const handleTeleportRoom = (roomId: string) => {
    const room = ROOM_DEFINITIONS.find((r) => r.id === roomId);
    if (!room) return;

    setActiveRoomId(roomId);
    setMode('walk');
    setIsRoofActive(true);

    setCameraTrigger({
      pos: [room.pos[0], room.pos[1], room.pos[2]],
      look: [room.look[0], room.look[1], room.look[2]],
      duration: 850
    });
  };

  // Paint color application handler
  const handleApplyShade = (category: SurfaceCategory, hex: string) => {
    setPaintSettings((prev) => ({
      colors: { ...prev.colors, [category]: hex },
      themeId: -1
    }));
  };

  // Apply curated theme
  const handleApplyTheme = (theme: CuratedTheme) => {
    setPaintSettings({ colors: theme.colors, themeId: theme.id });
  };

  // Clay mode
  const handleEnableClayMode = () => {
    const clayTheme = CURATED_THEMES.find((t) => t.id === 'clay');
    if (clayTheme) {
      setPaintSettings({ colors: clayTheme.colors, themeId: 'clay' });
    }
  };

  // Capture HD Canvas Snapshot
  const handleCaptureSnapshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `37x50_villa_${mode}_${timeOfDay}_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
  }, [mode, timeOfDay]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0d1017] text-white">
      {/* 3D WebGL Canvas Layer (Full Unobstructed Viewport) */}
      <ThreeCanvas
        mode={mode}
        activeCategory={activeCategory}
        categoryColors={categoryColors}
        isClayMode={activeThemeId === 'clay'}
        timeOfDay={timeOfDay}
        isSkyActive={isSkyActive}
        isGroundActive={isGroundActive}
        isRoofActive={isRoofActive}
        isFansActive={isFansActive}
        sunIntensity={sunIntensity}
        interiorLightsActive={interiorLightsActive}
        isCinematicBloom={isCinematicBloom}
        onSurfaceClick={(cat) => setActiveCategory(cat)}
        onLabelPositionsUpdate={setLabelPositions}
        cameraTrigger={cameraTrigger}
        onExportGLBReady={(fn) => {
          exportGLBRef.current = fn;
        }}
      />

      {/* Floating 3D Room Badges (Only in Orbit / Dollhouse) */}
      <FloatingLabelsOverlay
        labelPositions={labelPositions}
        showLabels={showLabels}
        mode={mode}
        onTeleportRoom={handleTeleportRoom}
      />

      {/* Sleek Top Navigation Bar */}
      <TopNav
        mode={mode}
        setMode={handleSetMode}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        isSkyActive={isSkyActive}
        toggleSky={() => setIsSkyActive(!isSkyActive)}
        isGroundActive={isGroundActive}
        toggleGround={() => setIsGroundActive(!isGroundActive)}
        isRoofActive={isRoofActive}
        toggleRoof={() => setIsRoofActive(!isRoofActive)}
        isFansActive={isFansActive}
        toggleFans={() => setIsFansActive(!isFansActive)}
        showLabels={showLabels}
        toggleLabels={() => setShowLabels(!showLabels)}
        openBlueprint={() => setIsBlueprintOpen(true)}
        openSpecs={() => setIsSpecsOpen(true)}
        openVastu={() => setIsVastuOpen(true)}
        openAiRenders={() => setIsAiRendersOpen(true)}
        openBlenderStudio={() => setIsBlenderOpen(true)}
        onCaptureSnapshot={handleCaptureSnapshot}
      />

      {/* Walk Inside First-Person Movement HUD */}
      <WalkControlsOverlay
        mode={mode}
        activeRoomId={activeRoomId}
        onExitWalk={() => handleSetMode('orbit')}
      />

      {/* Left-Side Control Panel: Elevation Presets, Room Teleports, Lighting & Sun Angles */}
      <LeftControlPanel
        onSelectPreset={handleSelectPreset}
        onTeleportRoom={handleTeleportRoom}
        timeOfDay={timeOfDay}
        setTimeOfDay={setTimeOfDay}
        sunIntensity={sunIntensity}
        setSunIntensity={setSunIntensity}
        interiorLightsActive={interiorLightsActive}
        setInteriorLightsActive={setInteriorLightsActive}
        isFansActive={isFansActive}
        setIsFansActive={setIsFansActive}
        isCinematicBloom={isCinematicBloom}
        setIsCinematicBloom={setIsCinematicBloom}
        onOpenBlenderStudio={() => setIsBlenderOpen(true)}
        onOpenVastuModal={() => setIsVastuOpen(true)}
        activeRoomId={activeRoomId}
      />

      {/* Right-Side Asian Paints Colour Studio: Surface Picker, Curated Themes, 60+ Swatches */}
      <RightPaintStudio
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryColors={categoryColors}
        onApplyShade={handleApplyShade}
        onApplyTheme={handleApplyTheme}
        onEnableClayMode={handleEnableClayMode}
        activeThemeId={activeThemeId}
      />

      {/* Interactive 2D Blueprint Modal */}
      <BlueprintModal
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
        onSelectRoom={handleTeleportRoom}
      />

      {/* Architectural Specifications Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      {/* Vastu Shastra Compliance Modal */}
      <VastuModal
        isOpen={isVastuOpen}
        onClose={() => setIsVastuOpen(false)}
        onSelectRoom={handleTeleportRoom}
      />

      {/* 8K AI Photorealistic Renders Gallery Modal */}
      <AiRendersModal
        isOpen={isAiRendersOpen}
        onClose={() => setIsAiRendersOpen(false)}
      />

      {/* Blender & Professional 3D Visualization Pipeline Modal */}
      <BlenderStudioModal
        isOpen={isBlenderOpen}
        onClose={() => setIsBlenderOpen(false)}
        onExportGLB={handleExportGLB}
        isExporting={isExportingGLB}
      />
    </main>
  );
}

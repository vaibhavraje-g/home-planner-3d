import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  SurfaceCategory,
  CuratedTheme,
  TimeOfDay,
  CATEGORY_LABELS,
  RoomDefinition,
  ROOM_DEFINITIONS
} from '../types/architectural';
import {
  createWoodPlankTileTexture,
  createCeilingLouverTexture,
  createVitrifiedFloorTexture,
  createSplitStoneTexture,
  createBlackGraniteTexture,
  createWoodGrainTexture,
  createFabricTexture,
  createPlasterTexture,
  createGrassTexture
} from '../utils/proceduralTextures';

interface ThreeCanvasProps {
  mode: 'orbit' | 'dollhouse' | 'walk';
  activeCategory: SurfaceCategory;
  categoryColors: Record<SurfaceCategory, string>;
  isClayMode: boolean;
  timeOfDay: TimeOfDay;
  isSkyActive: boolean;
  isGroundActive: boolean;
  isRoofActive: boolean;
  isFansActive: boolean;
  sunIntensity: number;
  interiorLightsActive: boolean;
  isCinematicBloom?: boolean;
  onSurfaceClick: (category: SurfaceCategory) => void;
  onLabelPositionsUpdate?: (
    positions: { id: string; x: number; y: number; visible: boolean }[]
  ) => void;
  cameraTrigger?: { pos: [number, number, number]; look: [number, number, number]; duration?: number } | null;
  onExportGLBReady?: (exporter: () => Promise<boolean>) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  mode,
  categoryColors,
  isClayMode,
  timeOfDay,
  isSkyActive,
  isGroundActive,
  isRoofActive,
  isFansActive,
  sunIntensity,
  interiorLightsActive,
  isCinematicBloom = true,
  onSurfaceClick,
  onLabelPositionsUpdate,
  cameraTrigger,
  onExportGLBReady
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);

  // Group references
  const houseGroupRef = useRef<THREE.Group>(new THREE.Group());
  const roofGroupRef = useRef<THREE.Group>(new THREE.Group());
  const groundGroupRef = useRef<THREE.Group>(new THREE.Group());
  const interiorLightsRef = useRef<THREE.Group>(new THREE.Group());
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const sconceLightsRef = useRef<THREE.PointLight[]>([]);
  const porchLightsRef = useRef<THREE.PointLight[]>([]);
  const ceilingFansRef = useRef<THREE.Group[]>([]);
  const paintableMeshesRef = useRef<THREE.Mesh[]>([]);
  const materialsRef = useRef<Record<SurfaceCategory, THREE.MeshStandardMaterial>>({} as any);

  // Animation & Tweening state
  const tweenRef = useRef<{
    startPos: THREE.Vector3;
    startLook: THREE.Vector3;
    endPos: THREE.Vector3;
    endLook: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null>(null);

  const keysPressed = useRef<Record<string, boolean>>({});

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.3, 500);
    camera.position.set(52, 22, 58);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Setup Cinematic Postprocessing Pipeline (Bloom, Tonemapping, Color Balance)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.28,  // bloom strength
      0.35,  // bloom radius
      0.82   // threshold - preserves clean white facades while blooming LEDs & sconces
    );
    composer.addPass(bloomPass);
    bloomPassRef.current = bloomPass;

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 6.5, 0);
    controls.maxDistance = 180;
    controls.minDistance = 1.2;
    controlsRef.current = controls;

    // RoomEnvironment Studio Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Natural Sky & Sun Light Rig
    const hemiLight = new THREE.HemisphereLight(0xfffdf7, 0x6a7b66, 0.72);
    hemiLight.position.set(0, 75, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xfff4e0, sunIntensity);
    sunLight.position.set(58, 72, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 195;
    const d = 46;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const fillLight = new THREE.DirectionalLight(0xdde8fa, 0.35);
    fillLight.position.set(-50, 30, -45);
    scene.add(fillLight);

    // Warm Sconces on South Stone Niche
    const sconceUp = new THREE.PointLight(0xffaa44, 1.3, 16);
    sconceUp.position.set(19.2, 8.6, -4.0);
    scene.add(sconceUp);

    const sconceDown = new THREE.PointLight(0xffaa44, 1.3, 16);
    sconceDown.position.set(19.2, 6.2, -4.0);
    scene.add(sconceDown);
    sconceLightsRef.current = [sconceUp, sconceDown];

    // Porch Warm Recessed Downlights
    const porchLight1 = new THREE.PointLight(0xffe2b5, 0.9, 22);
    porchLight1.position.set(3.0, 11.2, 18.5);
    scene.add(porchLight1);
    const porchLight2 = new THREE.PointLight(0xffe2b5, 0.9, 22);
    porchLight2.position.set(12.5, 11.2, 18.5);
    scene.add(porchLight2);
    porchLightsRef.current = [porchLight1, porchLight2];

    // Interior Warm POP Cove & Recessed Illumination
    const intLights = interiorLightsRef.current;
    intLights.clear();
    [
      [8.0, 12.1, 4.25, 0.65],    // Living Hall POP
      [-10.5, 12.1, 15.5, 0.6],   // Kitchen
      [11.2, 12.1, -12.2, 0.55],  // Master Bedroom
      [-11.5, 12.1, 2.5, 0.55],   // Bedroom 2
      [-11.5, 12.1, -19.0, 0.55], // Bedroom 3
      [-0.5, 12.1, -6.0, 0.52]    // Central Passage
    ].forEach(([lx, ly, lz, intensity]) => {
      const pl = new THREE.PointLight(0xfff1dc, intensity, 25);
      pl.position.set(lx, ly, lz);
      intLights.add(pl);
    });
    scene.add(intLights);

    // Add Groups to Scene
    scene.add(houseGroupRef.current);
    scene.add(roofGroupRef.current);
    scene.add(groundGroupRef.current);

    // Build the Complete Villa Model
    buildCompleteVillaModel();

    // Window Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      if (composerRef.current) {
        composerRef.current.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // Keyboard Listeners for 1st person walk
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Raycasting for Click-to-Select Surface
    let pointerDownPos = { x: 0, y: 0 };
    const handlePointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y) > 6) return;
      if (!mountRef.current || !cameraRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(paintableMeshesRef.current, false);

      if (intersects.length > 0) {
        const cat = intersects[0].object.userData?.category as SurfaceCategory;
        if (cat && CATEGORY_LABELS[cat]) {
          onSurfaceClick(cat);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    domEl.addEventListener('pointerup', handlePointerUp);

    // Render & Animation Loop
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Camera tweening
      if (tweenRef.current && cameraRef.current && controlsRef.current) {
        const { startPos, endPos, startLook, endLook, startTime, duration } = tweenRef.current;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3); // Cubic ease-out

        cameraRef.current.position.lerpVectors(startPos, endPos, ease);
        controlsRef.current.target.lerpVectors(startLook, endLook, ease);

        if (t >= 1) {
          tweenRef.current = null;
        }
      }

      // Ceiling fans rotation
      if (isFansActive && ceilingFansRef.current.length > 0) {
        ceilingFansRef.current.forEach((fan) => {
          fan.rotation.y += delta * 6.5;
        });
      }

      // First-person walking physics
      if (cameraRef.current && controlsRef.current) {
        const kp = keysPressed.current;
        if (
          kp['KeyW'] ||
          kp['KeyS'] ||
          kp['KeyA'] ||
          kp['KeyD'] ||
          kp['ArrowUp'] ||
          kp['ArrowDown'] ||
          kp['ArrowLeft'] ||
          kp['ArrowRight']
        ) {
          const speed = 13.5 * delta;
          const forward = new THREE.Vector3();
          cameraRef.current.getWorldDirection(forward);
          forward.y = 0;
          forward.normalize();

          const right = new THREE.Vector3().crossVectors(forward, cameraRef.current.up).normalize();
          const move = new THREE.Vector3();

          if (kp['KeyW'] || kp['ArrowUp']) move.add(forward);
          if (kp['KeyS'] || kp['ArrowDown']) move.sub(forward);
          if (kp['KeyD'] || kp['ArrowRight']) move.add(right);
          if (kp['KeyA'] || kp['ArrowLeft']) move.sub(right);

          if (move.lengthSq() > 0) {
            move.normalize().multiplyScalar(speed);
            cameraRef.current.position.add(move);
            controlsRef.current.target.add(move);
          }
        }
      }

      controlsRef.current?.update();

      // Project 3D room label coordinates
      if (onLabelPositionsUpdate && cameraRef.current && mountRef.current) {
        const rect = mountRef.current.getBoundingClientRect();
        const positions = ROOM_DEFINITIONS.map((r) => {
          const vec = new THREE.Vector3(r.pos[0], r.pos[1] + 2.8, r.pos[2]);
          vec.project(cameraRef.current!);
          const visible = vec.z < 1;
          const x = (vec.x * 0.5 + 0.5) * rect.width;
          const y = (-(vec.y * 0.5) + 0.5) * rect.height;
          return { id: r.id, x, y, visible };
        });
        onLabelPositionsUpdate(positions);
      }

      if (sceneRef.current && cameraRef.current) {
        if (isCinematicBloom && composerRef.current) {
          composerRef.current.render();
        } else if (rendererRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      domEl.removeEventListener('pointerup', handlePointerUp);
      composer.dispose();
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isCinematicBloom]);

  // Adjust Postprocessing Bloom dynamically with Time of Day
  useEffect(() => {
    if (!bloomPassRef.current) return;
    if (timeOfDay === 'night') {
      bloomPassRef.current.strength = 0.52;
      bloomPassRef.current.threshold = 0.65;
      bloomPassRef.current.radius = 0.48;
    } else if (timeOfDay === 'sunset') {
      bloomPassRef.current.strength = 0.38;
      bloomPassRef.current.threshold = 0.72;
      bloomPassRef.current.radius = 0.42;
    } else {
      bloomPassRef.current.strength = 0.24;
      bloomPassRef.current.threshold = 0.82;
      bloomPassRef.current.radius = 0.32;
    }
  }, [timeOfDay]);

  // Register glTF Exporter callback for Blender export
  useEffect(() => {
    if (onExportGLBReady) {
      onExportGLBReady(async () => {
        const { exportHouseToGLB } = await import('../utils/gltfExporterUtil');
        return exportHouseToGLB(houseGroupRef.current, roofGroupRef.current, 'villa_37x50_asian_paints_model.glb');
      });
    }
  }, [onExportGLBReady]);

  // Update Lighting for Time of Day & Intensity
  useEffect(() => {
    if (!sceneRef.current || !sunLightRef.current || !hemiLightRef.current) return;

    const sun = sunLightRef.current;
    const hemi = hemiLightRef.current;

    if (!isSkyActive) {
      sceneRef.current.background = new THREE.Color(0x111317);
      sceneRef.current.fog = null;
    } else if (timeOfDay === 'morning') {
      sceneRef.current.background = new THREE.Color(0xc8ddfa);
      sceneRef.current.fog = new THREE.FogExp2(0xc8ddfa, 0.0022);
      sun.color.setHex(0xfff5e4);
      sun.position.set(58, 68, 52);
      sun.intensity = sunIntensity;
      hemi.color.setHex(0xfffdf7);
      hemi.groundColor.setHex(0x6a7b66);
      sconceLightsRef.current.forEach((l) => (l.intensity = 0.8));
    } else if (timeOfDay === 'noon') {
      sceneRef.current.background = new THREE.Color(0xd4e7fd);
      sceneRef.current.fog = new THREE.FogExp2(0xd4e7fd, 0.0018);
      sun.color.setHex(0xffffff);
      sun.position.set(12, 85, 12);
      sun.intensity = sunIntensity * 1.15;
      hemi.color.setHex(0xffffff);
      hemi.groundColor.setHex(0x758070);
      sconceLightsRef.current.forEach((l) => (l.intensity = 0.4));
    } else if (timeOfDay === 'sunset') {
      sceneRef.current.background = new THREE.Color(0xe6ab7a);
      sceneRef.current.fog = new THREE.FogExp2(0xe6ab7a, 0.0035);
      sun.color.setHex(0xff7722);
      sun.position.set(-60, 26, -20);
      sun.intensity = sunIntensity * 1.1;
      hemi.color.setHex(0xffb885);
      hemi.groundColor.setHex(0x42382c);
      sconceLightsRef.current.forEach((l) => (l.intensity = 1.6));
    } else if (timeOfDay === 'night') {
      sceneRef.current.background = new THREE.Color(0x0a0c12);
      sceneRef.current.fog = new THREE.FogExp2(0x0a0c12, 0.004);
      sun.color.setHex(0x334466);
      sun.position.set(-20, 50, -40);
      sun.intensity = 0.12;
      hemi.color.setHex(0x222a38);
      hemi.groundColor.setHex(0x111318);
      sconceLightsRef.current.forEach((l) => (l.intensity = 2.4));
    }
  }, [timeOfDay, isSkyActive, sunIntensity]);

  useEffect(() => {
    interiorLightsRef.current.visible = interiorLightsActive;
  }, [interiorLightsActive]);

  useEffect(() => {
    groundGroupRef.current.visible = isGroundActive;
  }, [isGroundActive]);

  useEffect(() => {
    roofGroupRef.current.visible = isRoofActive;
  }, [isRoofActive]);

  // Update Dynamic Materials
  useEffect(() => {
    const mats = materialsRef.current;
    if (!mats || Object.keys(mats).length === 0) return;

    Object.entries(categoryColors).forEach(([cat, hex]) => {
      const mat = mats[cat as SurfaceCategory];
      if (mat) {
        mat.color.set(hex);
        mat.needsUpdate = true;
      }
    });
  }, [categoryColors]);

  // Handle Camera Trigger from presets or room clicks
  useEffect(() => {
    if (!cameraTrigger || !cameraRef.current || !controlsRef.current) return;
    const { pos, look, duration = 850 } = cameraTrigger;

    tweenRef.current = {
      startPos: cameraRef.current.position.clone(),
      startLook: controlsRef.current.target.clone(),
      endPos: new THREE.Vector3(...pos),
      endLook: new THREE.Vector3(...look),
      startTime: performance.now(),
      duration
    };
  }, [cameraTrigger]);

  // ---------------------------------------------------------------------------
  // MODEL BUILDER: Full 37' x 50' Villa Architecture
  // ---------------------------------------------------------------------------
  function buildCompleteVillaModel() {
    const houseGroup = houseGroupRef.current;
    const roofGroup = roofGroupRef.current;
    const groundGroup = groundGroupRef.current;

    houseGroup.clear();
    roofGroup.clear();
    groundGroup.clear();
    paintableMeshesRef.current = [];
    ceilingFansRef.current = [];

    const Y_PLINTH = 2.5;
    const Y_CEIL = 13.0; // 10' 6" clear interior height
    const Y_SLAB = 13.5; // 11' 0" slab top
    const WT = 0.75;     // 9" exterior wall thickness
    const IT = 0.5;      // 6" interior partition thickness

    // Fixed Architectural & Interior Textures
    const woodGrainMap = createWoodGrainTexture();
    const fabricWeaveMap = createFabricTexture();
    const wallPlasterNoise = createPlasterTexture();
    const grassMap = createGrassTexture();

    // Materials registry
    const mats: Record<SurfaceCategory, THREE.MeshStandardMaterial> = {
      ext_main: new THREE.MeshStandardMaterial({ color: categoryColors.ext_main, roughness: 0.76, metalness: 0.03, map: wallPlasterNoise }),
      box_grooves: new THREE.MeshStandardMaterial({ color: categoryColors.box_grooves, roughness: 0.72, metalness: 0.04, map: wallPlasterNoise }),
      parapet_box: new THREE.MeshStandardMaterial({ color: categoryColors.parapet_box, roughness: 0.7, metalness: 0.04, map: wallPlasterNoise }),
      pillar_plinth: new THREE.MeshStandardMaterial({ color: categoryColors.pillar_plinth, roughness: 0.65, metalness: 0.08, map: wallPlasterNoise }),
      int_living: new THREE.MeshStandardMaterial({ color: categoryColors.int_living, roughness: 0.85, map: wallPlasterNoise }),
      int_master: new THREE.MeshStandardMaterial({ color: categoryColors.int_master, roughness: 0.85, map: wallPlasterNoise }),
      int_bed23: new THREE.MeshStandardMaterial({ color: categoryColors.int_bed23, roughness: 0.85, map: wallPlasterNoise }),
      int_kitchen: new THREE.MeshStandardMaterial({ color: categoryColors.int_kitchen, roughness: 0.85, map: wallPlasterNoise }),
      slab_trim: new THREE.MeshStandardMaterial({ color: categoryColors.slab_trim, roughness: 0.7, metalness: 0.05, map: wallPlasterNoise })
    };
    materialsRef.current = mats;

    // Fixed Architectural Textures
    const fixedPorchWallMat = new THREE.MeshStandardMaterial({
      map: createWoodPlankTileTexture('#6B3E23'),
      roughness: 0.52,
      metalness: 0.04
    });

    const fixedPorchCeilingMat = new THREE.MeshStandardMaterial({
      map: createCeilingLouverTexture('#985E3B'),
      roughness: 0.55,
      metalness: 0.04
    });

    const fixedStoneNicheMat = new THREE.MeshStandardMaterial({
      map: createSplitStoneTexture('#686A6D'),
      roughness: 0.88,
      metalness: 0.05
    });

    const graniteMat = new THREE.MeshPhysicalMaterial({
      map: createBlackGraniteTexture(),
      roughness: 0.18,
      metalness: 0.15,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08
    });

    const interiorFloorMat = new THREE.MeshPhysicalMaterial({
      map: createVitrifiedFloorTexture('#f3f0e8', 8),
      roughness: 0.16,
      metalness: 0.04,
      clearcoat: 0.88,
      clearcoatRoughness: 0.08,
      reflectivity: 0.85
    });

    const porchFloorMat = new THREE.MeshPhysicalMaterial({
      map: createVitrifiedFloorTexture('#e0e4e8', 6),
      roughness: 0.28,
      metalness: 0.04,
      clearcoat: 0.55,
      clearcoatRoughness: 0.12
    });

    const bathTileMat = new THREE.MeshPhysicalMaterial({
      map: createVitrifiedFloorTexture('#d5dee2', 10),
      roughness: 0.30,
      metalness: 0.04,
      clearcoat: 0.65,
      clearcoatRoughness: 0.10
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xcee5f8,
      transparent: true,
      opacity: 0.42,
      roughness: 0.05,
      metalness: 0.08,
      transmission: 0.65,
      ior: 1.52,
      thickness: 0.3
    });

    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xd8e8f8, roughness: 0.05, metalness: 0.9 });
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0x1f2124, roughness: 0.45, metalness: 0.6 });
    const teakDoorMat = new THREE.MeshStandardMaterial({ color: 0x5a3119, roughness: 0.52, metalness: 0.05, map: woodGrainMap });
    const furnitureWoodMat = new THREE.MeshStandardMaterial({ color: 0x9a663c, roughness: 0.5, map: woodGrainMap });
    const walnutMat = new THREE.MeshStandardMaterial({ color: 0x6b4a30, roughness: 0.45, map: woodGrainMap });
    const fabricGreyMat = new THREE.MeshStandardMaterial({ color: 0x8f959c, roughness: 0.92, map: fabricWeaveMap });
    const fabricBeigeMat = new THREE.MeshStandardMaterial({ color: 0xc4b9a6, roughness: 0.92, map: fabricWeaveMap });
    const fabricAccentMat = new THREE.MeshStandardMaterial({ color: 0xb5623a, roughness: 0.9, map: fabricWeaveMap });
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xe8e4da, roughness: 0.9, map: fabricWeaveMap });
    const duvetMat = new THREE.MeshStandardMaterial({ color: 0xd7cfc2, roughness: 0.95, map: fabricWeaveMap });
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf2efe9, roughness: 0.18, metalness: 0.05 });
    const terracottaMat = new THREE.MeshStandardMaterial({ color: 0xa5673f, roughness: 0.85 });
    const plantSoilMat = new THREE.MeshStandardMaterial({ color: 0x3d2f24, roughness: 0.95 });
    const leafMatA = new THREE.MeshStandardMaterial({ color: 0x3f7233, roughness: 0.8 });
    const leafMatB = new THREE.MeshStandardMaterial({ color: 0x528a3f, roughness: 0.8 });
    const leafMatC = new THREE.MeshStandardMaterial({ color: 0x2e5c28, roughness: 0.82 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d5136, roughness: 0.9 });
    const showerGlassMat = new THREE.MeshPhysicalMaterial({ color: 0xcfe0e8, transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.05 });
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x8d9aa4, roughness: 0.4, metalness: 0.1 });
    const hobBlackMat = new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.28, metalness: 0.3 });
    const popCeilingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88 });
    const popCoveGlowMat = new THREE.MeshBasicMaterial({ color: 0xffe4b5 });
    const coveLightMat = new THREE.MeshStandardMaterial({ color: 0xfff2d8, emissive: 0xffdf9e, emissiveIntensity: 0.85, roughness: 0.4 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.18, metalness: 0.88 });
    const applianceSteelMat = new THREE.MeshStandardMaterial({ color: 0x767b82, roughness: 0.32, metalness: 0.65 });
    const applianceBlackMat = new THREE.MeshStandardMaterial({ color: 0x18191b, roughness: 0.22, metalness: 0.45 });
    const ceramicWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.18, metalness: 0.08 });
    const tvMat = new THREE.MeshStandardMaterial({ color: 0x101216, roughness: 0.25, metalness: 0.4 });
    const sofaFabricMat = new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 0.85, map: fabricWeaveMap });
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0xc89b61, roughness: 0.8, map: fabricWeaveMap });
    const foliageDarkMat = new THREE.MeshStandardMaterial({ color: 0x2a5624, roughness: 0.8 });
    const foliageLightMat = new THREE.MeshStandardMaterial({ color: 0x437739, roughness: 0.75 });

    const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });

    function addBox(
      x1: number,
      x2: number,
      y1: number,
      y2: number,
      z1: number,
      z2: number,
      matKeyOrMat: SurfaceCategory | THREE.Material,
      parent: THREE.Group = houseGroup,
      addEdges = true
    ) {
      const w = Math.abs(x2 - x1);
      const h = Math.abs(y2 - y1);
      const d = Math.abs(z2 - z1);
      if (w < 0.001 || h < 0.001 || d < 0.001) return null;

      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = typeof matKeyOrMat === 'string' ? mats[matKeyOrMat] : matKeyOrMat;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      if (typeof matKeyOrMat === 'string' && CATEGORY_LABELS[matKeyOrMat]) {
        mesh.userData.category = matKeyOrMat;
        paintableMeshesRef.current.push(mesh);
      }

      parent.add(mesh);

      if (addEdges) {
        const edges = new THREE.EdgesGeometry(geo);
        const line = new THREE.LineSegments(edges, edgeMat);
        mesh.add(line);
      }
      return mesh;
    }

    interface Opening {
      pos: number;
      width: number;
      bottom: number;
      top: number;
      type: 'window' | 'vent' | 'door' | 'double_door' | 'open';
      swingDir?: number;
      hingeSide?: 'start' | 'end';
    }

    function buildSegmentedWall(
      axis: 'x' | 'z',
      fixedCoord: number,
      startCoord: number,
      endCoord: number,
      yBottom: number,
      yTop: number,
      thickness: number,
      matKeyOrMat: SurfaceCategory | THREE.Material,
      openings: Opening[] = [],
      parent: THREE.Group = houseGroup
    ) {
      const sorted = [...openings].sort((a, b) => a.pos - a.width / 2 - (b.pos - b.width / 2));
      let cursor = startCoord;

      sorted.forEach((op) => {
        const opStart = op.pos - op.width / 2;
        const opEnd = op.pos + op.width / 2;

        if (opStart > cursor + 0.01) {
          if (axis === 'x') {
            addBox(cursor, opStart, yBottom, yTop, fixedCoord - thickness / 2, fixedCoord + thickness / 2, matKeyOrMat, parent);
          } else {
            addBox(fixedCoord - thickness / 2, fixedCoord + thickness / 2, yBottom, yTop, cursor, opStart, matKeyOrMat, parent);
          }
        }

        if (op.bottom > yBottom + 0.01) {
          if (axis === 'x') {
            addBox(opStart, opEnd, yBottom, op.bottom, fixedCoord - thickness / 2, fixedCoord + thickness / 2, matKeyOrMat, parent);
          } else {
            addBox(fixedCoord - thickness / 2, fixedCoord + thickness / 2, yBottom, op.bottom, opStart, opEnd, matKeyOrMat, parent);
          }
        }

        if (op.top < yTop - 0.01) {
          if (axis === 'x') {
            addBox(opStart, opEnd, op.top, yTop, fixedCoord - thickness / 2, fixedCoord + thickness / 2, matKeyOrMat, parent);
          } else {
            addBox(fixedCoord - thickness / 2, fixedCoord + thickness / 2, op.top, yTop, opStart, opEnd, matKeyOrMat, parent);
          }
        }

        if (op.type === 'window' || op.type === 'vent') {
          buildWindowAssembly(axis, fixedCoord, op.pos, op.width, op.bottom, op.top, thickness, parent);
        } else if (op.type === 'door' || op.type === 'double_door') {
          buildDoorAssembly(axis, fixedCoord, op.pos, op.width, op.bottom, op.top, thickness, op.type === 'double_door', op.swingDir || 1, op.hingeSide || 'start', parent);
        }

        cursor = opEnd;
      });

      if (endCoord > cursor + 0.01) {
        if (axis === 'x') {
          addBox(cursor, endCoord, yBottom, yTop, fixedCoord - thickness / 2, fixedCoord + thickness / 2, matKeyOrMat, parent);
        } else {
          addBox(fixedCoord - thickness / 2, fixedCoord + thickness / 2, yBottom, yTop, cursor, endCoord, matKeyOrMat, parent);
        }
      }
    }

    function buildWindowAssembly(axis: 'x' | 'z', fixedCoord: number, centerPos: number, width: number, yBottom: number, yTop: number, wallThick: number, parent: THREE.Group) {
      const h = yTop - yBottom;
      const frameThick = 0.18;
      if (axis === 'x') {
        addBox(centerPos - width / 2, centerPos + width / 2, yBottom, yTop, fixedCoord - 0.04, fixedCoord + 0.04, glassMat, parent, false);
        addBox(centerPos - width / 2, centerPos + width / 2, yBottom, yBottom + frameThick, fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, grilleMat, parent, false);
        addBox(centerPos - width / 2, centerPos + width / 2, yTop - frameThick, yTop, fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, grilleMat, parent, false);
        addBox(centerPos - 0.06, centerPos + 0.06, yBottom, yTop, fixedCoord - 0.1, fixedCoord + 0.1, grilleMat, parent, false);
        const bars = Math.max(2, Math.floor(h * 1.6));
        for (let i = 1; i < bars; i++) {
          const by = yBottom + (h / bars) * i;
          addBox(centerPos - width / 2, centerPos + width / 2, by - 0.025, by + 0.025, fixedCoord - 0.08, fixedCoord + 0.08, grilleMat, parent, false);
        }
      } else {
        addBox(fixedCoord - 0.04, fixedCoord + 0.04, yBottom, yTop, centerPos - width / 2, centerPos + width / 2, glassMat, parent, false);
        addBox(fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, yBottom, yBottom + frameThick, centerPos - width / 2, centerPos + width / 2, grilleMat, parent, false);
        addBox(fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, yTop - frameThick, yTop, centerPos - width / 2, centerPos + width / 2, grilleMat, parent, false);
        addBox(fixedCoord - 0.1, fixedCoord + 0.1, yBottom, yTop, centerPos - 0.06, centerPos + 0.06, grilleMat, parent, false);
        const bars = Math.max(2, Math.floor(h * 1.6));
        for (let i = 1; i < bars; i++) {
          const by = yBottom + (h / bars) * i;
          addBox(fixedCoord - 0.08, fixedCoord + 0.08, by - 0.025, by + 0.025, centerPos - width / 2, centerPos + width / 2, grilleMat, parent, false);
        }
      }
    }

    function buildDoorAssembly(axis: 'x' | 'z', fixedCoord: number, centerPos: number, width: number, yBottom: number, yTop: number, wallThick: number, isDouble: boolean, swingDir: number, hingeSide: 'start' | 'end', parent: THREE.Group) {
      const frameW = 0.2;
      if (axis === 'x') {
        addBox(centerPos - width / 2, centerPos - width / 2 + frameW, yBottom, yTop, fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, teakDoorMat, parent, false);
        addBox(centerPos + width / 2 - frameW, centerPos + width / 2, yBottom, yTop, fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, teakDoorMat, parent, false);
        addBox(centerPos - width / 2, centerPos + width / 2, yTop - frameW, yTop, fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, teakDoorMat, parent, false);
        if (isDouble) {
          const leafW = (width - 2 * frameW) / 2;
          addBox(centerPos - width / 2 + frameW, centerPos - width / 2 + frameW + 0.14, yBottom, yTop - frameW, fixedCoord - leafW * swingDir, fixedCoord, teakDoorMat, parent, true);
          addBox(centerPos + width / 2 - frameW - 0.14, centerPos + width / 2 - frameW, yBottom, yTop - frameW, fixedCoord - leafW * swingDir, fixedCoord, teakDoorMat, parent, true);
        } else {
          const leafW = (width - 2 * frameW) * 0.88;
          const hx = hingeSide === 'end' ? centerPos + width / 2 - frameW - 0.14 : centerPos - width / 2 + frameW;
          addBox(hx, hx + 0.14, yBottom, yTop - frameW, fixedCoord - leafW * swingDir, fixedCoord, teakDoorMat, parent, true);
        }
      } else {
        addBox(fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, yBottom, yTop, centerPos - width / 2, centerPos - width / 2 + frameW, teakDoorMat, parent, false);
        addBox(fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, yBottom, yTop, centerPos + width / 2 - frameW, centerPos + width / 2, teakDoorMat, parent, false);
        addBox(fixedCoord - wallThick / 2 - 0.04, fixedCoord + wallThick / 2 + 0.04, yTop - frameW, yTop, centerPos - width / 2, centerPos + width / 2, teakDoorMat, parent, false);
        const leafW = (width - 2 * frameW) * 0.88;
        const hz = hingeSide === 'end' ? centerPos + width / 2 - frameW - 0.14 : centerPos - width / 2 + frameW;
        addBox(fixedCoord, fixedCoord + leafW * swingDir, yBottom, yTop - frameW, hz, hz + 0.14, teakDoorMat, parent, true);
      }
    }

    // 1. PLINTH & BLACK GRANITE STEPS (2' 6" Plinth)
    addBox(-18.5, 18.5, 0, Y_PLINTH, -25.0, 25.0, 'pillar_plinth');
    addBox(-18.1, 18.1, Y_PLINTH, Y_PLINTH + 0.08, -24.6, 12.5, interiorFloorMat, houseGroup, false);
    addBox(-18.1, -2.0, Y_PLINTH, Y_PLINTH + 0.08, 12.5, 24.6, interiorFloorMat, houseGroup, false);
    addBox(-2.0, 18.5, Y_PLINTH, Y_PLINTH + 0.08, 12.5, 25.0, porchFloorMat, houseGroup, false);

    for (let s = 0; s < 4; s++) {
      const stepH = (Y_PLINTH / 4) * (s + 1);
      const zStart = 28.4 - (s + 1) * 0.85;
      const zEnd = 28.4 - s * 0.85;
      addBox(5.5, 15.5, 0, stepH, zStart, zEnd, graniteMat);
    }

    // Garden Planter Box Border
    addBox(18.5, 20.6, 0, 1.35, -25.0, 12.5, 'box_grooves');
    addBox(-18.5, -2.0, 0, 1.35, 25.0, 27.0, 'box_grooves');

    // 2. FRONT PORCH: FIXED DARK TEAK TILES, LEFT DOOR & RIGHT WINDOW
    buildSegmentedWall('x', 12.5, -2.0, 18.5, Y_PLINTH, Y_CEIL, WT, fixedPorchWallMat, [
      { pos: -0.2, width: 3.6, bottom: Y_PLINTH + 0.35, top: 9.8, type: 'door', swingDir: 1 }, // Left Main Entrance
      { pos: 8.5, width: 6.2, bottom: 5.1, top: 9.8, type: 'window' }                           // Right Porch Window
    ]);

    addBox(-2.0, 1.8, Y_PLINTH + 0.08, Y_PLINTH + 0.42, 12.5, 13.8, graniteMat);

    // Porch Left-Side Wall with Window to Kitchen
    buildSegmentedWall('z', -2.0, 12.5, 25.0, Y_PLINTH, Y_CEIL, WT, fixedPorchWallMat, [
      { pos: 16.8, width: 3.6, bottom: 5.5, top: 9.5, type: 'window' }
    ]);
    buildSegmentedWall('z', -2.0, 7.0, 12.5, Y_PLINTH, Y_CEIL, IT, 'int_kitchen', []);

    // Single Porch Corner Pillar (Front-Right: X = +17.5, Z = +24.0)
    const pillarGeo = new THREE.CylinderGeometry(0.68, 0.68, 9.25, 32);
    const pillarMesh = new THREE.Mesh(pillarGeo, mats.pillar_plinth);
    pillarMesh.position.set(17.5, Y_PLINTH + 4.625, 24.0);
    pillarMesh.castShadow = true;
    pillarMesh.userData.category = 'pillar_plinth';
    paintableMeshesRef.current.push(pillarMesh);
    houseGroup.add(pillarMesh);
    addBox(16.6, 18.4, Y_PLINTH, Y_PLINTH + 0.45, 23.1, 24.9, 'pillar_plinth');
    addBox(16.6, 18.4, 11.35, 11.75, 23.1, 24.9, 'pillar_plinth');

    // 3. KITCHEN EAST FRONT ELEVATION
    buildSegmentedWall('x', 24.625, -18.5, -2.0, Y_PLINTH, Y_CEIL, WT, 'ext_main', [
      { pos: -10.5, width: 4.8, bottom: 5.5, top: 9.8, type: 'window' }
    ]);

    for (let gy = 3.5; gy <= 12.0; gy += 1.05) {
      if (gy < 5.2 || gy > 10.1) {
        addBox(-18.55, -2.0, gy, gy + 0.75, 25.0, 25.12, 'box_grooves');
      } else {
        addBox(-18.55, -13.3, gy, gy + 0.75, 25.0, 25.12, 'box_grooves');
        addBox(-7.7, -2.0, gy, gy + 0.75, 25.0, 25.12, 'box_grooves');
      }
    }

    addBox(-13.3, -7.7, 5.1, 14.8, 25.0, 25.85, 'parapet_box');
    addBox(-12.6, -8.4, 10.1, 14.3, 25.85, 26.0, fixedStoneNicheMat);
    addBox(-13.2, -7.8, 5.2, 5.55, 25.0, 26.2, 'ext_main');
    addBox(-13.2, -7.8, 9.75, 10.1, 25.0, 26.2, 'ext_main');
    addBox(-13.2, -12.85, 5.2, 10.1, 25.0, 26.2, 'ext_main');
    addBox(-8.15, -7.8, 5.2, 10.1, 25.0, 26.2, 'ext_main');

    // 4. SOUTH ELEVATION: 6 GROOVES PILASTER, 2 BOX WINDOWS & STONE NICHE
    buildSegmentedWall('z', 18.125, -25.0, 12.5, Y_PLINTH, Y_CEIL, WT, 'ext_main', [
      { pos: -22.8, width: 2.0, bottom: 8.2, top: 10.0, type: 'vent' },
      { pos: -12.5, width: 5.0, bottom: 5.8, top: 10.2, type: 'window' },
      { pos: 4.5, width: 5.0, bottom: 5.8, top: 10.2, type: 'window' }
    ]);

    for (let i = 0; i < 6; i++) {
      const gy = 3.4 + i * 1.45;
      addBox(18.5, 18.7, gy, gy + 1.05, 10.5, 12.55, 'box_grooves');
    }

    [4.5, -12.5].forEach((wz) => {
      const wHalf = 2.9;
      const boxDepth = 1.1;
      addBox(18.5, 18.5 + boxDepth, 10.2, 10.65, wz - wHalf, wz + wHalf, 'box_grooves');
      addBox(18.5, 18.5 + boxDepth, 5.4, 5.8, wz - wHalf, wz + wHalf, 'box_grooves');
      addBox(18.5, 18.5 + boxDepth, 3.3, 3.7, wz - wHalf, wz + wHalf, 'box_grooves');
      addBox(18.5, 18.5 + boxDepth, 3.3, 10.65, wz - wHalf, wz - wHalf + 0.45, 'box_grooves');
      addBox(18.5, 18.5 + boxDepth, 3.3, 10.65, wz + wHalf - 0.45, wz + wHalf, 'box_grooves');
      addBox(18.5, 18.68, 3.7, 5.4, wz - wHalf + 0.45, wz + wHalf - 0.45, 'box_grooves');
    });

    addBox(18.5, 18.68, 3.3, 10.65, -5.2, -2.8, fixedStoneNicheMat);
    addBox(18.68, 18.9, 7.2, 7.8, -4.2, -3.8, grilleMat, houseGroup, false);

    // 5. NORTH ELEVATION: 5 PILASTERS & LINTELS
    buildSegmentedWall('z', -18.125, -25.0, 25.0, Y_PLINTH, Y_CEIL, WT, 'ext_main', [
      { pos: -19.0, width: 4.5, bottom: 5.5, top: 9.8, type: 'window' },
      { pos: -4.5, width: 2.0, bottom: 8.0, top: 9.8, type: 'vent' },
      { pos: 2.5, width: 4.5, bottom: 5.5, top: 9.8, type: 'window' },
      { pos: 16.5, width: 4.5, bottom: 5.5, top: 9.8, type: 'window' }
    ]);

    [-24.6, -12.8, -6.8, 8.2, 24.6].forEach((cz) => {
      addBox(-18.75, -18.5, 0, Y_CEIL, cz - 0.45, cz + 0.45, 'box_grooves');
    });
    addBox(-18.72, -18.5, 9.8, 10.5, -25.0, 25.0, 'box_grooves');
    [-19.0, 2.5, 16.5].forEach((wz) => {
      addBox(-19.5, -18.5, 9.8, 10.1, wz - 2.6, wz + 2.6, 'box_grooves');
      addBox(-19.1, -18.5, 5.2, 5.5, wz - 2.5, wz + 2.5, 'box_grooves');
      addBox(-19.0, -18.5, 3.4, 3.65, wz - 2.4, wz + 2.4, 'box_grooves');
    });
    addBox(-19.6, -18.5, 7.2, 8.2, -13.2, -6.8, 'box_grooves');

    // 6. WEST (REAR) ELEVATION: STRAIGHT PATH REAR EXIT DOOR
    buildSegmentedWall('x', -24.625, -18.5, 18.5, Y_PLINTH, Y_CEIL, WT, 'ext_main', [
      { pos: -11.5, width: 4.5, bottom: 5.5, top: 9.8, type: 'window' },
      { pos: -0.2, width: 3.4, bottom: Y_PLINTH, top: 9.5, type: 'door', swingDir: -1 },
      { pos: 3.4, width: 1.6, bottom: 8.2, top: 9.8, type: 'vent' },
      { pos: 11.5, width: 2.2, bottom: 8.2, top: 9.8, type: 'vent' }
    ]);

    // 7. INTERIOR ROOM LAYOUT (BLUEPRINT EXACT)
    // Kitchen West Wall: Open entrance archway into Living Hall (X = -5.0 to -2.0, Z = +7.0)
    buildSegmentedWall('x', 7.0, -18.0, -2.0, Y_PLINTH, Y_CEIL, IT, 'int_kitchen', [
      { pos: -3.5, width: 3.0, bottom: Y_PLINTH, top: 9.6, type: 'open' }
    ]);

    // Pooja Ghar (5' x 3' in East-North corner of Kitchen)
    buildSegmentedWall('x', 21.5, -7.0, -2.0, Y_PLINTH, Y_CEIL, 0.35, 'int_kitchen', [
      { pos: -4.5, width: 2.4, bottom: Y_PLINTH, top: 8.8, type: 'open' }
    ]);
    buildSegmentedWall('z', -7.0, 21.5, 24.3, Y_PLINTH, Y_CEIL, 0.35, 'int_kitchen', []);

    // Kitchen Countertops (Black Granite)
    addBox(-17.8, -7.1, Y_PLINTH, Y_PLINTH + 2.65, 22.1, 24.25, 'box_grooves');
    addBox(-17.8, -7.05, Y_PLINTH + 2.65, Y_PLINTH + 2.8, 22.0, 24.3, graniteMat);
    addBox(-17.8, -15.6, Y_PLINTH, Y_PLINTH + 2.65, 10.5, 22.1, 'box_grooves');
    addBox(-17.8, -15.5, Y_PLINTH + 2.65, Y_PLINTH + 2.8, 10.4, 22.1, graniteMat);

    // Living Hall to Central Passage Transition
    buildSegmentedWall('x', -4.0, 4.8, 18.0, Y_PLINTH, Y_CEIL, IT, 'int_living', []);

    // Bedroom 2 (14' x 11') & Attached Toilet (5' x 10'6"): Door at X = -4.5, Z = -3.4
    buildSegmentedWall('z', -4.5, -7.0, 7.0, Y_PLINTH, Y_CEIL, IT, 'int_bed23', [
      { pos: -3.4, width: 3.0, bottom: Y_PLINTH, top: 9.4, type: 'door', swingDir: -1, hingeSide: 'start' }
    ]);
    buildSegmentedWall('x', -2.0, -18.0, -7.5, Y_PLINTH, Y_CEIL, IT, 'int_bed23', [
      { pos: -9.0, width: 2.5, bottom: Y_PLINTH, top: 9.0, type: 'door', swingDir: -1, hingeSide: 'start' }
    ]);
    buildSegmentedWall('z', -7.5, -7.0, -2.0, Y_PLINTH, Y_CEIL, IT, 'int_bed23', []);
    addBox(-18.0, -7.5, Y_PLINTH, Y_PLINTH + 0.09, -7.0, -2.0, bathTileMat, houseGroup, false);

    // Wall separating Bedroom 2 from Staircase
    buildSegmentedWall('x', -7.0, -18.0, -4.5, Y_PLINTH, Y_CEIL, IT, 'int_living', []);

    // Internal Staircase (11' x 6')
    buildSegmentedWall('x', -13.0, -18.0, -2.2, Y_PLINTH, Y_CEIL, IT, 'int_living', []);
    for (let i = 0; i < 10; i++) {
      addBox(-8.0 - i * 0.75, -7.2 - i * 0.75, Y_PLINTH + i * 0.52, Y_PLINTH + (i + 1) * 0.52, -9.8, -7.2, graniteMat);
      addBox(-15.2 + i * 0.75, -14.4 + i * 0.75, Y_PLINTH + 5.2 + i * 0.55, Y_PLINTH + 5.2 + (i + 1) * 0.55, -12.8, -10.0, graniteMat);
    }
    addBox(-18.2, -15.2, Y_PLINTH + 4.8, Y_PLINTH + 5.3, -12.8, -7.2, graniteMat);

    // Bedroom 3 (14' x 12')
    buildSegmentedWall('z', -2.2, -25.0, -13.0, Y_PLINTH, Y_CEIL, IT, 'int_bed23', [
      { pos: -15.2, width: 3.1, bottom: Y_PLINTH, top: 9.4, type: 'door', swingDir: -1 }
    ]);

    // Common 3-Zone Sanitary Hub
    buildSegmentedWall('z', 1.6, -25.0, -21.2, Y_PLINTH, Y_CEIL, IT, 'int_living', [
      { pos: -23.1, width: 2.4, bottom: Y_PLINTH, top: 9.0, type: 'door', swingDir: 1 }
    ]);
    buildSegmentedWall('z', 1.6, -18.2, -14.2, Y_PLINTH, Y_CEIL, IT, 'int_living', [
      { pos: -16.2, width: 2.4, bottom: Y_PLINTH, top: 9.0, type: 'door', swingDir: 1 }
    ]);
    buildSegmentedWall('x', -21.2, 1.6, 4.8, Y_PLINTH, Y_CEIL, IT, 'int_living', []);
    buildSegmentedWall('x', -18.2, 1.6, 4.8, Y_PLINTH, Y_CEIL, IT, 'int_living', []);
    buildSegmentedWall('x', -14.2, 1.6, 4.8, Y_PLINTH, Y_CEIL, IT, 'int_living', []);
    addBox(1.6, 4.8, Y_PLINTH, Y_PLINTH + 0.09, -24.6, -14.2, bathTileMat, houseGroup, false);

    // Master Bedroom (12' x 14'6") with Attached Toilet
    buildSegmentedWall('z', 4.8, -25.0, -4.0, Y_PLINTH, Y_CEIL, IT, 'int_master', [
      { pos: -5.6, width: 3.0, bottom: Y_PLINTH, top: 9.4, type: 'door', swingDir: 1, hingeSide: 'end' }
    ]);
    buildSegmentedWall('x', -20.5, 4.8, 18.0, Y_PLINTH, Y_CEIL, IT, 'int_master', [
      { pos: 7.2, width: 2.6, bottom: Y_PLINTH, top: 9.0, type: 'door', swingDir: 1 }
    ]);
    addBox(4.8, 18.0, Y_PLINTH, Y_PLINTH + 0.09, -24.6, -20.5, bathTileMat, houseGroup, false);

    // Helper builders for interior elements
    function makeProp(
      x1: number,
      x2: number,
      y1: number,
      y2: number,
      z1: number,
      z2: number,
      matKeyOrMat: SurfaceCategory | THREE.Material,
      parent: THREE.Group = houseGroup,
      edges = false
    ) {
      return addBox(x1, x2, y1, y2, z1, z2, matKeyOrMat, parent, edges);
    }

    function makePottedPlant(x: number, y: number, z: number, potH = 1.4, plantH = 2.6) {
      const g = new THREE.Group();
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(potH * 0.55, potH * 0.42, potH, 14), terracottaMat);
      pot.position.y = potH / 2;
      pot.castShadow = true;
      g.add(pot);

      const soil = new THREE.Mesh(new THREE.CylinderGeometry(potH * 0.52, potH * 0.52, 0.06, 14), plantSoilMat);
      soil.position.y = potH;
      g.add(soil);

      for (let i = 0; i < 7; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, plantH * (0.5 + Math.random() * 0.5), 6), i % 2 === 0 ? leafMatB : leafMatA);
        leaf.position.set((Math.random() - 0.5) * 0.5, potH + plantH * 0.45, (Math.random() - 0.5) * 0.5);
        leaf.rotation.set((Math.random() - 0.5) * 0.7, Math.random() * Math.PI, (Math.random() - 0.5) * 0.7);
        leaf.castShadow = true;
        g.add(leaf);
      }
      g.position.set(x, y, z);
      houseGroup.add(g);
      return g;
    }

    function makeWC(x: number, z: number, facing: 'x+' | 'x-' | 'z+' | 'z-', yF: number) {
      const g = new THREE.Group();
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.5, 1.05, 16), ceramicWhiteMat);
      bowl.position.y = yF + 0.55;
      bowl.castShadow = true;
      g.add(bowl);

      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.14, 16), ceramicWhiteMat);
      seat.position.y = yF + 1.12;
      g.add(seat);

      const cistern = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.35, 0.55), ceramicWhiteMat);
      cistern.position.y = yF + 1.75;
      cistern.castShadow = true;
      g.add(cistern);

      if (facing === 'x+') g.rotation.y = Math.PI / 2;
      if (facing === 'x-') g.rotation.y = -Math.PI / 2;
      if (facing === 'z-') g.rotation.y = Math.PI;

      g.position.set(x, 0, z);
      houseGroup.add(g);
      return g;
    }

    function makeBasin(x: number, z: number, w: number, d: number, yBase: number, mirrorWall: 'x+' | 'x-' | 'z+' | 'z-') {
      makeProp(x - w / 2, x + w / 2, yBase, yBase + 2.4, z - d / 2, z + d / 2, walnutMat);
      makeProp(x - w / 2 + 0.1, x + w / 2 - 0.1, yBase + 2.4, yBase + 2.52, z - d / 2 + 0.1, z + d / 2 - 0.1, marbleMat);

      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.5, 0.55, 16), ceramicWhiteMat);
      bowl.position.set(x, yBase + 2.75, z);
      bowl.castShadow = true;
      houseGroup.add(bowl);

      const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0, 10), chromeMat);
      faucet.position.set(x, yBase + 3.0, z);
      houseGroup.add(faucet);

      if (mirrorWall === 'x+') makeProp(x + w / 2 - 0.12, x + w / 2 - 0.02, yBase + 3.1, yBase + 5.6, z - d / 2 + 0.1, z + d / 2 - 0.1, mirrorMat);
      if (mirrorWall === 'x-') makeProp(x - w / 2 + 0.02, x - w / 2 + 0.12, yBase + 3.1, yBase + 5.6, z - d / 2 + 0.1, z + d / 2 - 0.1, mirrorMat);
      if (mirrorWall === 'z+') makeProp(x - w / 2 + 0.1, x + w / 2 - 0.1, yBase + 3.1, yBase + 5.6, z + d / 2 - 0.12, z + d / 2 - 0.02, mirrorMat);
      if (mirrorWall === 'z-') makeProp(x - w / 2 + 0.1, x + w / 2 - 0.1, yBase + 3.1, yBase + 5.6, z - d / 2 + 0.02, z - d / 2 + 0.12, mirrorMat);
    }

    function makeShower(x: number, z: number, wallSide: 'x+' | 'x-' | 'z+' | 'z-', headY: number) {
      const armLen = 0.85;
      let ax = x, az = z;
      if (wallSide === 'x+') ax = x - armLen / 2;
      if (wallSide === 'x-') ax = x + armLen / 2;
      if (wallSide === 'z+') az = z - armLen / 2;
      if (wallSide === 'z-') az = z + armLen / 2;

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, armLen, 8), chromeMat);
      arm.rotation.z = Math.PI / 2;
      if (wallSide === 'z+' || wallSide === 'z-') arm.rotation.y = Math.PI / 2;
      arm.position.set(ax, headY, az);
      houseGroup.add(arm);

      const head = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.18, 14), chromeMat);
      head.position.set(
        wallSide === 'x+' ? x - armLen : wallSide === 'x-' ? x + armLen : x,
        headY - 0.15,
        wallSide === 'z+' ? z - armLen : wallSide === 'z-' ? z + armLen : z
      );
      houseGroup.add(head);

      const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 12), chromeMat);
      drain.position.set(x, headY - 6.3, z);
      houseGroup.add(drain);
    }

    function makeBed(x1: number, x2: number, zHead: number, zFoot: number, yF: number) {
      const sgn = Math.sign(zFoot - zHead) || 1;
      const zMin = Math.min(zHead, zFoot);
      const zMax = Math.max(zHead, zFoot);

      makeProp(x1, x2, yF + 0.15, yF + 1.15, zMin + 0.05, zMax - 0.05, furnitureWoodMat);
      makeProp(x1 + 0.1, x2 - 0.1, yF + 1.15, yF + 1.9, zMin + 0.15, zMax - 0.15, mattressMat);

      const dzA = zHead + (zFoot - zHead) * 0.38;
      const dzB = zFoot - 0.12 * sgn;
      makeProp(x1 + 0.06, x2 - 0.06, yF + 1.85, yF + 2.15, Math.min(dzA, dzB), Math.max(dzA, dzB), duvetMat);

      makeProp(x1 - 0.12, x2 + 0.12, yF + 0.15, yF + 3.2, zHead - 0.15 * sgn, zHead + 0.18 * sgn, furnitureWoodMat);

      const pzA = zHead + 0.22 * sgn;
      const pzB = zHead + 1.05 * sgn;
      makeProp(x1 + 0.1, x1 + (x2 - x1) * 0.46, yF + 1.9, yF + 2.45, Math.min(pzA, pzB), Math.max(pzA, pzB), mattressMat);
      makeProp(x1 + (x2 - x1) * 0.54, x2 - 0.1, yF + 1.9, yF + 2.45, Math.min(pzA, pzB), Math.max(pzA, pzB), mattressMat);
    }

    function makeWardrobe(x1: number, x2: number, z1: number, z2: number, yF: number) {
      makeProp(x1, x2, yF + 0.15, yF + 6.9, z1, z2, walnutMat);
      const n = Math.max(2, Math.floor(Math.abs(x2 - x1) / 1.6));
      for (let i = 1; i < n; i++) {
        const lx = x1 + ((x2 - x1) * i) / n;
        makeProp(lx - 0.03, lx + 0.03, yF + 0.35, yF + 6.7, z1 + (z2 - z1) * 0.06, z1 + (z2 - z1) * 0.94, furnitureWoodMat);
      }
      makeProp(x1 + 0.15, x2 - 0.15, yF + 6.9, yF + 7.05, z1 + 0.1, z2 - 0.1, furnitureWoodMat);
    }

    // -------------------------------------------------------------------------
    // 8. RICH INTERIOR STYLING & FURNISHING (DESIGN MATCH FROM Z AI MODEL)
    // -------------------------------------------------------------------------
    // 8A. LIVING ROOM (21'0" x 16'6")
    // Seating Zone: Area rug with fabric weave
    makeProp(6.2, 14.2, Y_PLINTH + 0.02, Y_PLINTH + 0.08, 2.2, 9.2, fabricAccentMat);

    // 3-Seater Sofa with Individual Cushions and Arms
    makeProp(7.4, 12.8, Y_PLINTH, Y_PLINTH + 1.0, 6.8, 9.2, fabricGreyMat);
    makeProp(7.4, 12.8, Y_PLINTH + 1.0, Y_PLINTH + 2.3, 8.5, 9.2, fabricGreyMat);
    makeProp(7.4, 7.9, Y_PLINTH + 1.0, Y_PLINTH + 1.85, 6.1, 9.2, fabricGreyMat);
    makeProp(12.3, 12.8, Y_PLINTH + 1.0, Y_PLINTH + 1.85, 6.1, 9.2, fabricGreyMat);
    for (let i = 0; i < 3; i++) {
      makeProp(7.8 + i * 1.5, 9.1 + i * 1.5, Y_PLINTH + 1.0, Y_PLINTH + 1.15, 6.9, 8.45, fabricBeigeMat);
    }

    // 2 Lounge Armchairs
    makeProp(5.4, 7.2, Y_PLINTH, Y_PLINTH + 1.0, 2.6, 4.9, fabricBeigeMat);
    makeProp(5.4, 7.2, Y_PLINTH + 1.0, Y_PLINTH + 2.2, 2.6, 3.15, fabricBeigeMat);
    makeProp(13.0, 14.8, Y_PLINTH, Y_PLINTH + 1.0, 2.6, 4.9, fabricBeigeMat);
    makeProp(13.0, 14.8, Y_PLINTH + 1.0, Y_PLINTH + 2.2, 2.6, 3.15, fabricBeigeMat);

    // Two-Tier Wooden Coffee Table
    makeProp(8.5, 11.6, Y_PLINTH, Y_PLINTH + 1.35, 3.6, 5.5, furnitureWoodMat);
    makeProp(8.8, 11.3, Y_PLINTH + 0.35, Y_PLINTH + 0.45, 3.85, 5.25, furnitureWoodMat);

    // TV Console Unit & Wall-Mounted TV
    makeProp(8.2, 13.8, Y_PLINTH, Y_PLINTH + 1.7, -3.9, -3.2, walnutMat);
    makeProp(9.2, 12.8, Y_PLINTH + 3.2, Y_PLINTH + 5.9, -3.95, -3.85, tvMat);

    // Dining Nook with 4 Chairs on Western Side of Living Hall
    makeProp(-1.5, 3.2, Y_PLINTH, Y_PLINTH + 2.5, 4.2, 6.8, walnutMat);
    makeProp(-1.65, 3.35, Y_PLINTH + 2.5, Y_PLINTH + 2.62, 4.05, 6.95, furnitureWoodMat);
    for (let i = 0; i < 2; i++) {
      makeProp(-1.1 + i * 3.4, -0.2 + i * 3.4, Y_PLINTH, Y_PLINTH + 1.45, 2.9, 3.95, furnitureWoodMat);
      makeProp(-1.1 + i * 3.4, -0.2 + i * 3.4, Y_PLINTH + 1.45, Y_PLINTH + 2.55, 2.9, 3.2, furnitureWoodMat);
      makeProp(-1.1 + i * 3.4, -0.2 + i * 3.4, Y_PLINTH, Y_PLINTH + 1.45, 7.05, 8.1, furnitureWoodMat);
      makeProp(-1.1 + i * 3.4, -0.2 + i * 3.4, Y_PLINTH + 1.45, Y_PLINTH + 2.55, 7.8, 8.1, furnitureWoodMat);
    }

    // Dining Pendant Light Fixture
    makeProp(0.7, 1.0, 9.4, 13.0, 5.35, 5.65, chromeMat);
    const pendantShade = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.55, 1.1, 16), applianceBlackMat);
    pendantShade.position.set(0.85, 8.9, 5.5);
    pendantShade.castShadow = true;
    houseGroup.add(pendantShade);
    const pendantBulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), coveLightMat);
    pendantBulb.position.set(0.85, 8.45, 5.5);
    houseGroup.add(pendantBulb);

    // Living Room Wall Console & Warm Table Lamp
    makeProp(16.8, 17.6, Y_PLINTH, Y_PLINTH + 2.5, 5.0, 9.5, walnutMat);
    makeProp(17.1, 17.5, Y_PLINTH + 2.5, Y_PLINTH + 3.1, 6.4, 7.2, ceramicWhiteMat);
    makeProp(17.15, 17.45, Y_PLINTH + 3.1, Y_PLINTH + 3.7, 6.5, 7.1, coveLightMat);

    // Living Room Potted Plants in Corner
    makePottedPlant(16.8, Y_PLINTH + 0.1, 10.9, 1.4, 2.6);

    // 8B. MODULAR KITCHEN (18'0" x 12'0")
    // Base Cabinet Units with Stainless Vertical Handle Profiles & Black Granite Countertop
    makeProp(-17.8, -7.1, Y_PLINTH, Y_PLINTH + 2.65, 22.1, 24.25, cabinetMat);
    makeProp(-17.8, -7.05, Y_PLINTH + 2.65, Y_PLINTH + 2.8, 22.0, 24.3, graniteMat);
    makeProp(-17.8, -15.6, Y_PLINTH, Y_PLINTH + 2.65, 10.5, 22.1, cabinetMat);
    makeProp(-17.8, -15.5, Y_PLINTH + 2.65, Y_PLINTH + 2.8, 10.4, 22.1, graniteMat);

    // Cabinet Handle Grooves
    for (let gx = -16.5; gx < -7.5; gx += 1.2) {
      makeProp(gx, gx + 0.08, Y_PLINTH + 0.3, Y_PLINTH + 2.45, 22.05, 22.15, applianceSteelMat);
    }
    for (let gz = 11.5; gz < 21.5; gz += 1.2) {
      makeProp(-15.55, -15.45, Y_PLINTH + 0.3, Y_PLINTH + 2.45, gz, gz + 0.08, applianceSteelMat);
    }

    // Stainless Steel Double-Bowl Sink with Swan-Neck Chrome Mixer Faucet
    makeProp(-17.7, -15.8, Y_PLINTH + 2.7, Y_PLINTH + 2.78, 15.5, 18.2, applianceSteelMat);
    makeProp(-17.65, -15.85, Y_PLINTH + 2.6, Y_PLINTH + 2.7, 15.6, 18.1, applianceSteelMat);
    const sinkFaucet = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 10), chromeMat);
    sinkFaucet.position.set(-16.7, Y_PLINTH + 3.4, 16.85);
    houseGroup.add(sinkFaucet);
    const sinkSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.55, 8), chromeMat);
    sinkSpout.rotation.z = Math.PI / 2;
    sinkSpout.position.set(-16.5, Y_PLINTH + 3.9, 16.85);
    houseGroup.add(sinkSpout);

    // 4-Burner Black Glass Gas Hob & Stainless Exhaust Chimney Hood
    makeProp(-12.5, -9.5, Y_PLINTH + 2.8, Y_PLINTH + 2.92, 22.5, 23.8, hobBlackMat);
    [[-12.0, 22.9], [-10.8, 22.9], [-12.0, 23.4], [-10.8, 23.4]].forEach(([bx, bz]) => {
      const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.09, 12), grilleMat);
      burner.position.set(bx, Y_PLINTH + 2.98, bz);
      houseGroup.add(burner);
    });
    makeProp(-12.8, -9.2, Y_PLINTH + 5.6, Y_PLINTH + 6.2, 22.3, 24.1, applianceSteelMat);
    makeProp(-11.5, -10.5, Y_PLINTH + 6.2, Y_PLINTH + 10.4, 22.9, 23.9, applianceSteelMat);

    // Upper Storage Cabinets
    makeProp(-16.5, -7.5, Y_PLINTH + 5.5, Y_PLINTH + 7.5, 24.0, 24.28, cabinetMat);

    // Double-Door Refrigerator
    makeProp(-17.6, -14.8, Y_PLINTH, Y_PLINTH + 6.0, 7.5, 9.8, applianceSteelMat);
    makeProp(-17.58, -14.82, Y_PLINTH + 3.8, Y_PLINTH + 6.0, 7.55, 9.75, applianceBlackMat);
    makeProp(-14.75, -14.65, Y_PLINTH + 1.2, Y_PLINTH + 3.5, 7.8, 8.1, chromeMat);

    // Breakfast Table & Wooden Stools in Kitchen
    makeProp(-7.5, -4.8, Y_PLINTH, Y_PLINTH + 2.45, 12.0, 14.5, walnutMat);
    makeProp(-7.65, -4.65, Y_PLINTH + 2.45, Y_PLINTH + 2.58, 11.85, 14.65, furnitureWoodMat);
    [[-6.2, 11.2], [-6.2, 15.3]].forEach(([sx, sz]) => {
      const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 1.6, 14), furnitureWoodMat);
      stool.position.set(sx, Y_PLINTH + 0.8, sz);
      stool.castShadow = true;
      houseGroup.add(stool);
    });

    // 8C. PUJA SANCTUARY (5'0" x 3'0")
    // White Marble Altar, Diya Lights & Traditional Jali Screen
    makeProp(-6.6, -2.4, Y_PLINTH, Y_PLINTH + 1.5, 22.8, 24.2, marbleMat);
    makeProp(-6.6, -2.45, Y_PLINTH + 1.5, Y_PLINTH + 5.5, 24.15, 24.28, walnutMat);
    const deity1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 12), marbleMat);
    deity1.position.set(-5.2, Y_PLINTH + 2.1, 23.5);
    deity1.castShadow = true;
    houseGroup.add(deity1);
    const deity2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.15, 10), marbleMat);
    deity2.position.set(-3.8, Y_PLINTH + 2.25, 23.5);
    deity2.castShadow = true;
    houseGroup.add(deity2);
    makeProp(-6.0, -5.7, Y_PLINTH + 1.5, Y_PLINTH + 1.7, 23.0, 23.3, coveLightMat);
    makeProp(-3.3, -3.0, Y_PLINTH + 1.5, Y_PLINTH + 1.7, 23.0, 23.3, coveLightMat);
    // Traditional wooden jali louvers across opening
    for (let jy = Y_PLINTH + 0.3; jy < Y_PLINTH + 8.4; jy += 0.55) {
      makeProp(-4.8, -4.75, jy, jy + 0.3, 21.6, 23.9, furnitureWoodMat, houseGroup, false);
    }

    // 8D. MASTER BEDROOM (12'0" x 14'6")
    // King Platform Bed, Duvet, Plush Pillows & Bedside Tables
    makeBed(10.5, 16.5, -19.8, -13.5, Y_PLINTH);
    makeProp(9.2, 10.2, Y_PLINTH, Y_PLINTH + 1.9, -19.8, -18.8, walnutMat);
    makeProp(16.8, 17.6, Y_PLINTH, Y_PLINTH + 1.9, -19.8, -18.8, walnutMat);
    makeProp(9.45, 9.95, Y_PLINTH + 1.9, Y_PLINTH + 2.45, -19.5, -19.1, coveLightMat);
    makeProp(17.05, 17.55, Y_PLINTH + 1.9, Y_PLINTH + 2.45, -19.5, -19.1, coveLightMat);
    makeWardrobe(5.2, 6.2, -19.5, -11.5, Y_PLINTH);
    makeProp(8.5, 12.5, Y_PLINTH, Y_PLINTH + 1.8, -5.0, -4.2, walnutMat);
    makeProp(9.2, 11.5, Y_PLINTH + 2.8, Y_PLINTH + 5.2, -4.25, -4.15, tvMat);
    makePottedPlant(16.8, Y_PLINTH + 0.1, -6.5, 1.3, 2.4);

    // 8E. BEDROOM 2 (14'0" x 11'0")
    // Queen Bed, Nightstands, Wardrobe & Study Desk
    makeBed(-16.5, -11.0, 6.4, 0.8, Y_PLINTH);
    makeProp(-17.5, -16.7, Y_PLINTH, Y_PLINTH + 1.9, 5.5, 6.4, walnutMat);
    makeProp(-10.8, -10.0, Y_PLINTH, Y_PLINTH + 1.9, 5.5, 6.4, walnutMat);
    makeProp(-17.3, -16.9, Y_PLINTH + 1.9, Y_PLINTH + 2.45, 5.7, 6.2, coveLightMat);
    makeProp(-10.6, -10.2, Y_PLINTH + 1.9, Y_PLINTH + 2.45, 5.7, 6.2, coveLightMat);
    makeWardrobe(-17.6, -12.0, -1.7, -0.6, Y_PLINTH);
    makeProp(-7.5, -5.0, Y_PLINTH, Y_PLINTH + 2.2, 4.8, 6.2, furnitureWoodMat);

    // 8F. BEDROOM 3 (14'0" x 12'0")
    // Queen Bed against Rear Wall, Nightstands, Wardrobe & Potted Plant
    makeBed(-16.5, -11.0, -24.0, -18.2, Y_PLINTH);
    makeProp(-17.5, -16.7, Y_PLINTH, Y_PLINTH + 1.9, -24.0, -23.1, walnutMat);
    makeProp(-10.8, -10.0, Y_PLINTH, Y_PLINTH + 1.9, -24.0, -23.1, walnutMat);
    makeWardrobe(-17.6, -11.5, -14.6, -13.5, Y_PLINTH);
    makePottedPlant(-4.2, Y_PLINTH + 0.1, -23.8, 1.3, 2.4);

    // 8G. SANITARY WARE & BATHROOM FIXTURES
    // Master Toilet
    makeWC(16.5, -23.0, 'z-', Y_PLINTH);
    makeBasin(11.0, -23.6, 3.4, 1.6, Y_PLINTH, 'z-');
    makeShower(6.0, -22.5, 'x-', Y_PLINTH + 6.4);
    makeProp(7.2, 7.35, Y_PLINTH, Y_PLINTH + 6.6, -24.3, -20.8, showerGlassMat);

    // Bedroom 2 Attached Toilet
    makeWC(-16.8, -4.8, 'x-', Y_PLINTH);
    makeBasin(-13.5, -4.8, 3.2, 1.5, Y_PLINTH, 'z-');
    makeShower(-8.8, -3.6, 'x+', Y_PLINTH + 6.4);
    makeProp(-11.2, -11.05, Y_PLINTH, Y_PLINTH + 6.6, -5.5, -2.2, showerGlassMat);

    // Common 3-Zone Sanitary Hub (Rear WC, Middle Basin, Front Shower)
    makeWC(3.6, -23.2, 'z-', Y_PLINTH);
    makeBasin(3.5, -19.5, 2.6, 1.5, Y_PLINTH, 'x+');
    makeShower(2.8, -15.5, 'z+', Y_PLINTH + 6.2);
    makeProp(1.8, 3.2, Y_PLINTH, Y_PLINTH + 6.4, -16.8, -16.65, showerGlassMat);

    // Dedicated Washing Machine in Passage Utility Niche
    makeProp(2.0, 4.4, Y_PLINTH, Y_PLINTH + 2.9, -13.9, -11.5, applianceSteelMat);
    const wmDoor = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 24), applianceBlackMat);
    wmDoor.rotation.x = Math.PI / 2;
    wmDoor.rotation.z = Math.PI / 2;
    wmDoor.position.set(1.92, Y_PLINTH + 1.45, -12.7);
    wmDoor.castShadow = true;
    houseGroup.add(wmDoor);
    makeProp(1.95, 4.4, Y_PLINTH + 2.7, Y_PLINTH + 2.9, -13.9, -11.5, applianceBlackMat);

    // 9. ROOF, PARAPETS, MUMTY TOWER & POP CEILINGS
    addBox(-18.9, -4.0, Y_CEIL, Y_SLAB, -25.4, -13.0, 'slab_trim', roofGroup);
    addBox(-18.9, -4.0, Y_CEIL, Y_SLAB, -7.0, 25.4, 'slab_trim', roofGroup);
    addBox(-4.0, 18.9, Y_CEIL, Y_SLAB, -25.4, 12.5, 'slab_trim', roofGroup);

    // Sunken Porch Slab (11.75' vs 13.0' main ceiling) + Fluted Wooden Louver Ceiling
    addBox(-2.0, 19.3, 11.75, 12.25, 12.5, 25.8, 'slab_trim', roofGroup);
    addBox(-1.8, 17.8, 11.65, 11.75, 12.8, 24.6, fixedPorchCeilingMat, roofGroup, false);

    // 6 Porch Recessed Spotlights
    [[2.5, 16.0], [8.5, 16.0], [14.5, 16.0], [2.5, 21.5], [8.5, 21.5], [14.5, 21.5]].forEach(([px, pz]) => {
      const pSpot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16), popCoveGlowMat);
      pSpot.position.set(px, 11.63, pz);
      roofGroup.add(pSpot);
    });

    addBox(-2.0, 18.8, 12.25, Y_SLAB, 24.4, 25.3, 'ext_main', roofGroup);
    addBox(17.8, 18.8, 12.25, Y_SLAB, 12.5, 25.3, 'ext_main', roofGroup);

    // Parapet Cutout Frames above Porch
    addBox(-1.8, -1.1, Y_SLAB, 16.5, 24.4, 25.2, 'box_grooves', roofGroup);
    addBox(2.1, 2.8, Y_SLAB, 16.5, 24.4, 25.2, 'box_grooves', roofGroup);
    addBox(-1.8, 2.8, 15.8, 16.5, 24.4, 25.2, 'box_grooves', roofGroup);

    // Camel Skin Central Tall Rectangular Frame
    addBox(2.8, 3.8, Y_SLAB, 18.2, 24.3, 25.4, 'parapet_box', roofGroup);
    addBox(8.8, 9.8, Y_SLAB, 18.2, 24.3, 25.4, 'parapet_box', roofGroup);
    addBox(2.8, 9.8, 17.3, 18.2, 24.3, 25.4, 'parapet_box', roofGroup);
    addBox(3.8, 8.8, Y_SLAB, 14.5, 24.4, 25.2, 'parapet_box', roofGroup);

    // Solid Parapet Walls
    addBox(9.8, 18.6, Y_SLAB, 16.0, 24.4, 25.2, 'ext_main', roofGroup);
    addBox(9.8, 18.7, 16.0, 16.3, 24.3, 25.3, 'pillar_plinth', roofGroup);
    addBox(17.8, 18.6, Y_SLAB, 16.2, 12.5, 24.4, 'pillar_plinth', roofGroup);
    addBox(-18.6, -2.0, Y_SLAB, 16.4, 24.4, 25.1, 'ext_main', roofGroup);
    addBox(17.8, 18.6, Y_SLAB, 16.3, -25.0, 12.5, 'ext_main', roofGroup);
    addBox(-18.6, 18.6, Y_SLAB, 16.3, -25.1, -24.4, 'ext_main', roofGroup);
    addBox(-18.6, -17.8, Y_SLAB, 16.3, -25.0, 25.0, 'ext_main', roofGroup);

    // Rooftop Staircase Mumty Tower
    addBox(-18.6, -6.5, Y_SLAB, 21.8, -13.5, -12.8, 'box_grooves', roofGroup);
    addBox(-18.6, -6.5, Y_SLAB, 21.8, -7.2, -6.5, 'box_grooves', roofGroup);
    addBox(-18.6, -17.8, Y_SLAB, 21.8, -13.5, -11.2, 'box_grooves', roofGroup);
    addBox(-18.6, -17.8, Y_SLAB, 21.8, -8.8, -6.5, 'box_grooves', roofGroup);
    addBox(-18.6, -17.8, Y_SLAB, 15.2, -11.2, -8.8, 'box_grooves', roofGroup);
    addBox(-18.6, -17.8, 20.5, 21.8, -11.2, -8.8, 'box_grooves', roofGroup);
    addBox(-18.3, -18.1, 15.2, 20.5, -11.2, -8.8, fixedPorchWallMat, roofGroup);
    addBox(-7.2, -6.5, Y_SLAB, 21.8, -13.5, -10.5, 'ext_main', roofGroup);
    addBox(-7.2, -6.5, 19.8, 21.8, -10.5, -7.2, 'ext_main', roofGroup);
    addBox(-20.2, -5.2, 21.8, 22.4, -14.5, -5.5, 'pillar_plinth', roofGroup);

    // Interior POP Tray Ceilings
    function addPOPRoomCeiling(x1: number, x2: number, z1: number, z2: number, yCeil: number) {
      const trayW = 1.5;
      const dropH = 0.45;
      addBox(x1, x2, yCeil - dropH, yCeil, z1, z1 + trayW, popCeilingMat, roofGroup, false);
      addBox(x1, x2, yCeil - dropH, yCeil, z2 - trayW, z2, popCeilingMat, roofGroup, false);
      addBox(x1, x1 + trayW, yCeil - dropH, yCeil, z1 + trayW, z2 - trayW, popCeilingMat, roofGroup, false);
      addBox(x2 - trayW, x2, yCeil - dropH, yCeil, z1 + trayW, z2 - trayW, popCeilingMat, roofGroup, false);

      addBox(x1 + trayW - 0.08, x2 - trayW + 0.08, yCeil - dropH + 0.05, yCeil - dropH + 0.14, z1 + trayW - 0.08, z1 + trayW, popCoveGlowMat, roofGroup, false);
      addBox(x1 + trayW - 0.08, x2 - trayW + 0.08, yCeil - dropH + 0.05, yCeil - dropH + 0.14, z2 - trayW, z2 - trayW + 0.08, popCoveGlowMat, roofGroup, false);

      [
        [x1 + trayW / 2, z1 + trayW / 2],
        [x2 - trayW / 2, z1 + trayW / 2],
        [x1 + trayW / 2, z2 - trayW / 2],
        [x2 - trayW / 2, z2 - trayW / 2]
      ].forEach(([sx, sz]) => {
        const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16), popCoveGlowMat);
        spot.position.set(sx, yCeil - dropH - 0.01, sz);
        roofGroup.add(spot);
      });
    }

    // Ceiling Fan helper
    function createCeilingFan(cx: number, cy: number, cz: number) {
      const fanGroup = new THREE.Group();
      fanGroup.position.set(cx, cy, cz);

      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 12), teakDoorMat);
      rod.position.y = -0.55;
      fanGroup.add(rod);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.4, 0.22, 20), teakDoorMat);
      hub.position.y = -1.1;
      fanGroup.add(hub);

      const bladeGroup = new THREE.Group();
      bladeGroup.position.y = -1.1;
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.04, 0.38), teakDoorMat);
        blade.position.x = 1.25;
        const pivot = new THREE.Group();
        pivot.rotation.y = (b * Math.PI * 2) / 3;
        pivot.add(blade);
        bladeGroup.add(pivot);
      }
      fanGroup.add(bladeGroup);
      roofGroup.add(fanGroup);
      ceilingFansRef.current.push(bladeGroup);
    }

    addPOPRoomCeiling(-1.5, 17.6, -3.5, 12.0, Y_CEIL);    // Living Room POP
    addPOPRoomCeiling(5.2, 17.6, -20.0, -4.4, Y_CEIL);    // Master Bedroom POP
    addPOPRoomCeiling(-17.6, -4.9, -1.6, 6.6, Y_CEIL);    // Bedroom 2 POP
    addPOPRoomCeiling(-17.6, -2.6, -24.4, -13.4, Y_CEIL); // Bedroom 3 POP
    addPOPRoomCeiling(-17.6, -2.4, 7.4, 21.2, Y_CEIL);    // Kitchen POP

    createCeilingFan(8.5, Y_CEIL, 4.2);     // Living Hall Fan
    createCeilingFan(11.4, Y_CEIL, -12.2);  // Master Bedroom Fan
    createCeilingFan(-11.2, Y_CEIL, 2.5);   // Bedroom 2 Fan
    createCeilingFan(-10.5, Y_CEIL, -19.0); // Bedroom 3 Fan

    // 10. SURROUNDINGS: LAWN, PAVERS & TROPICAL SHRUBS
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, map: grassMap });
    const paverMat = new THREE.MeshStandardMaterial({ color: 0x5a5f64, roughness: 0.65 });
    const soilMat = new THREE.MeshStandardMaterial({ color: 0xded7cc, roughness: 0.9 });

    addBox(-65, 65, -0.4, 0, -65, 65, lawnMat, groundGroup, false);
    addBox(-21, 24, -0.35, 0.03, -28, 36, paverMat, groundGroup, false);
    addBox(18.55, 20.4, 1.25, 1.38, -24.8, 12.3, soilMat, groundGroup, false);
    addBox(-18.3, -2.1, 1.25, 1.38, 25.05, 26.8, soilMat, groundGroup, false);

    function createPlantShrub(x: number, y: number, z: number, scale = 1.0) {
      const plant = new THREE.Group();
      plant.position.set(x, y, z);

      const mainBush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95 * scale, 1), foliageDarkMat);
      mainBush.position.y = 0.8 * scale;
      mainBush.castShadow = true;
      plant.add(mainBush);

      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2;
        const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65 * scale, 1), foliageLightMat);
        leaf.position.set(Math.cos(ang) * 0.65 * scale, (0.6 + (i % 2) * 0.35) * scale, Math.sin(ang) * 0.65 * scale);
        leaf.castShadow = true;
        plant.add(leaf);
      }
      groundGroup.add(plant);
    }

    for (let pz = -22; pz <= 10.5; pz += 3.6) {
      createPlantShrub(19.5, 1.35, pz, 0.9 + ((Math.abs(pz) % 3) * 0.12));
    }
    for (let px = -17.0; px <= -3.5; px += 3.3) {
      createPlantShrub(px, 1.35, 25.9, 0.95);
    }
    addBox(3.6, 5.0, 0, 1.5, 25.5, 26.9, teakDoorMat, groundGroup);
    createPlantShrub(4.3, 1.5, 26.2, 1.05);
    addBox(16.0, 17.4, 0, 1.5, 25.5, 26.9, teakDoorMat, groundGroup);
    createPlantShrub(16.7, 1.5, 26.2, 1.05);
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
    />
  );
};

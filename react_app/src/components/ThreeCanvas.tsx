import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
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
  createBlackGraniteTexture
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
  onSurfaceClick: (category: SurfaceCategory) => void;
  onLabelPositionsUpdate?: (
    positions: { id: string; x: number; y: number; visible: boolean }[]
  ) => void;
  cameraTrigger?: { pos: [number, number, number]; look: [number, number, number]; duration?: number } | null;
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
  onSurfaceClick,
  onLabelPositionsUpdate,
  cameraTrigger
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

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

      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
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
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

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

    // Materials registry
    const mats: Record<SurfaceCategory, THREE.MeshStandardMaterial> = {
      ext_main: new THREE.MeshStandardMaterial({ color: categoryColors.ext_main, roughness: 0.76, metalness: 0.03 }),
      box_grooves: new THREE.MeshStandardMaterial({ color: categoryColors.box_grooves, roughness: 0.72, metalness: 0.04 }),
      parapet_box: new THREE.MeshStandardMaterial({ color: categoryColors.parapet_box, roughness: 0.7, metalness: 0.04 }),
      pillar_plinth: new THREE.MeshStandardMaterial({ color: categoryColors.pillar_plinth, roughness: 0.65, metalness: 0.08 }),
      int_living: new THREE.MeshStandardMaterial({ color: categoryColors.int_living, roughness: 0.85 }),
      int_master: new THREE.MeshStandardMaterial({ color: categoryColors.int_master, roughness: 0.85 }),
      int_bed23: new THREE.MeshStandardMaterial({ color: categoryColors.int_bed23, roughness: 0.85 }),
      int_kitchen: new THREE.MeshStandardMaterial({ color: categoryColors.int_kitchen, roughness: 0.85 }),
      slab_trim: new THREE.MeshStandardMaterial({ color: categoryColors.slab_trim, roughness: 0.7, metalness: 0.05 })
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

    const graniteMat = new THREE.MeshStandardMaterial({
      map: createBlackGraniteTexture(),
      roughness: 0.25,
      metalness: 0.15
    });

    const interiorFloorMat = new THREE.MeshStandardMaterial({
      map: createVitrifiedFloorTexture('#f3f0e8', 8),
      roughness: 0.28,
      metalness: 0.06
    });

    const porchFloorMat = new THREE.MeshStandardMaterial({
      map: createVitrifiedFloorTexture('#e0e4e8', 6),
      roughness: 0.35,
      metalness: 0.05
    });

    const bathTileMat = new THREE.MeshStandardMaterial({
      map: createVitrifiedFloorTexture('#d5dee2', 10),
      roughness: 0.42,
      metalness: 0.05
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x98c3e4,
      transparent: true,
      opacity: 0.38,
      roughness: 0.1,
      metalness: 0.1
    });

    const mirrorMat = new THREE.MeshStandardMaterial({ color: 0xd8e8f8, roughness: 0.05, metalness: 0.9 });
    const grilleMat = new THREE.MeshStandardMaterial({ color: 0x1f2124, roughness: 0.45, metalness: 0.6 });
    const teakDoorMat = new THREE.MeshStandardMaterial({ color: 0x5a3119, roughness: 0.52, metalness: 0.05 });
    const popCeilingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88 });
    const popCoveGlowMat = new THREE.MeshBasicMaterial({ color: 0xffe4b5 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdcdcdc, roughness: 0.18, metalness: 0.88 });
    const applianceSteelMat = new THREE.MeshStandardMaterial({ color: 0x767b82, roughness: 0.32, metalness: 0.65 });
    const applianceBlackMat = new THREE.MeshStandardMaterial({ color: 0x18191b, roughness: 0.22, metalness: 0.45 });
    const ceramicWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.18, metalness: 0.08 });
    const sofaFabricMat = new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 0.85 });
    const cushionMat = new THREE.MeshStandardMaterial({ color: 0xc89b61, roughness: 0.8 });
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

    // 8. FURNISHINGS & APPLIANCES
    // Living Room L-Sofa & Center Table
    addBox(6.5, 16.5, Y_PLINTH, Y_PLINTH + 1.35, 7.5, 10.4, sofaFabricMat);
    addBox(6.5, 16.5, Y_PLINTH + 1.35, Y_PLINTH + 2.7, 9.7, 10.5, sofaFabricMat);
    addBox(14.0, 16.8, Y_PLINTH, Y_PLINTH + 1.35, 1.0, 7.5, sofaFabricMat);
    addBox(16.0, 16.8, Y_PLINTH + 1.35, Y_PLINTH + 2.7, 1.0, 7.5, sofaFabricMat);
    addBox(7.2, 8.8, Y_PLINTH + 1.4, Y_PLINTH + 2.3, 8.8, 9.6, cushionMat);
    addBox(11.5, 13.1, Y_PLINTH + 1.4, Y_PLINTH + 2.3, 8.8, 9.6, cushionMat);
    addBox(8.5, 12.8, Y_PLINTH, Y_PLINTH + 1.15, 3.2, 5.8, teakDoorMat);
    addBox(8.7, 12.6, Y_PLINTH + 1.15, Y_PLINTH + 1.22, 3.4, 5.6, glassMat, houseGroup, false);
    addBox(6.8, 15.5, Y_PLINTH, Y_PLINTH + 1.5, -3.7, -2.5, teakDoorMat);
    addBox(8.2, 14.0, Y_PLINTH + 2.8, Y_PLINTH + 6.0, -3.7, -3.5, applianceBlackMat);

    // Kitchen Appliances
    addBox(-12.5, -9.5, Y_PLINTH + 2.8, Y_PLINTH + 2.92, 22.5, 23.8, applianceBlackMat);
    addBox(-12.6, -9.4, Y_PLINTH + 5.6, Y_PLINTH + 6.2, 22.2, 24.2, applianceSteelMat);
    addBox(-11.6, -10.4, Y_PLINTH + 6.2, Y_PLINTH + 10.2, 23.0, 24.2, applianceSteelMat);
    addBox(-17.4, -15.8, Y_PLINTH + 2.72, Y_PLINTH + 2.84, 15.5, 18.2, chromeMat);
    addBox(-17.6, -15.0, Y_PLINTH, Y_PLINTH + 6.0, 7.5, 10.1, applianceSteelMat);
    addBox(-5.8, -3.2, Y_PLINTH, Y_PLINTH + 2.2, 23.0, 24.2, ceramicWhiteMat);

    // Sanitary Fixtures & Outside Washing Machine
    addBox(2.8, 4.5, Y_PLINTH, Y_PLINTH + 1.45, -23.8, -22.2, ceramicWhiteMat);
    addBox(3.9, 4.5, Y_PLINTH + 1.45, Y_PLINTH + 2.6, -23.8, -22.2, ceramicWhiteMat);
    addBox(2.2, 4.5, Y_PLINTH, Y_PLINTH + 2.6, -20.8, -18.6, teakDoorMat);
    addBox(2.5, 4.2, Y_PLINTH + 2.6, Y_PLINTH + 2.95, -20.4, -19.0, ceramicWhiteMat);
    addBox(4.55, 4.65, Y_PLINTH + 3.4, Y_PLINTH + 6.6, -20.6, -18.8, mirrorMat, houseGroup, false);
    addBox(2.0, 4.5, Y_PLINTH + 6.8, Y_PLINTH + 7.0, -15.5, -15.0, chromeMat);

    // Washing Machine in Passage Niche
    addBox(2.0, 4.4, Y_PLINTH, Y_PLINTH + 2.9, -13.9, -11.5, applianceSteelMat);
    addBox(1.92, 2.0, Y_PLINTH + 0.6, Y_PLINTH + 2.2, -13.3, -12.1, applianceBlackMat);

    // Master Bedroom
    addBox(11.5, 17.6, Y_PLINTH, Y_PLINTH + 1.6, -15.2, -9.2, teakDoorMat);
    addBox(11.7, 17.2, Y_PLINTH + 1.6, Y_PLINTH + 2.1, -15.0, -9.4, ceramicWhiteMat);
    addBox(17.1, 17.6, Y_PLINTH + 1.6, Y_PLINTH + 3.8, -15.2, -9.2, cushionMat);
    addBox(8.5, 16.5, Y_PLINTH, Y_PLINTH + 7.2, -5.5, -4.3, teakDoorMat);
    addBox(15.5, 17.5, Y_PLINTH, Y_PLINTH + 1.5, -23.8, -22.2, ceramicWhiteMat);
    addBox(9.5, 11.5, Y_PLINTH + 2.4, Y_PLINTH + 2.8, -24.3, -22.8, ceramicWhiteMat);

    // Bedroom 2
    addBox(-17.6, -11.8, Y_PLINTH, Y_PLINTH + 1.6, 1.2, 6.0, teakDoorMat);
    addBox(-17.3, -12.0, Y_PLINTH + 1.6, Y_PLINTH + 2.1, 1.4, 5.8, ceramicWhiteMat);
    addBox(-17.6, -17.1, Y_PLINTH + 1.6, Y_PLINTH + 3.6, 1.2, 6.0, cushionMat);
    addBox(-17.6, -11.0, Y_PLINTH, Y_PLINTH + 7.2, -1.7, -0.4, teakDoorMat);
    addBox(-17.6, -15.8, Y_PLINTH, Y_PLINTH + 1.5, -5.2, -3.6, ceramicWhiteMat);
    addBox(-9.8, -8.0, Y_PLINTH + 2.4, Y_PLINTH + 2.8, -6.6, -5.2, ceramicWhiteMat);

    // Bedroom 3
    addBox(-17.6, -11.8, Y_PLINTH, Y_PLINTH + 1.6, -21.5, -16.2, teakDoorMat);
    addBox(-17.3, -12.0, Y_PLINTH + 1.6, Y_PLINTH + 2.1, -21.3, -16.4, ceramicWhiteMat);
    addBox(-17.6, -10.0, Y_PLINTH, Y_PLINTH + 7.2, -14.8, -13.3, teakDoorMat);

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
    const lawnMat = new THREE.MeshStandardMaterial({ color: 0x385c2e, roughness: 0.95 });
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

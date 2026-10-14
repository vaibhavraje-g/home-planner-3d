import * as THREE from 'three';

/**
 * Procedurally generates high-resolution horizontal wood plank tile textures
 * with realistic wood grain waves, plank seams, micro-bevels, and subtle tonal variation.
 */
export function createWoodPlankTileTexture(
  baseHex: string,
  anisotropy = 8
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 1024, 1024);

  const courses = 14;
  const rowH = 1024 / courses;

  for (let r = 0; r < courses; r++) {
    const y0 = r * rowH;
    const tone = ((r * 37) % 22) - 11;
    ctx.fillStyle = tone >= 0 ? `rgba(255, 225, 185, ${tone / 240})` : `rgba(20, 8, 2, ${-tone / 180})`;
    ctx.fillRect(0, y0, 1024, rowH);

    // Realistic multi-frequency grain waves
    for (let g = 0; g < 20; g++) {
      const gy = y0 + (g / 20) * rowH;
      ctx.strokeStyle = g % 4 === 0 ? 'rgba(32, 14, 5, 0.22)' : 'rgba(255, 220, 180, 0.09)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      const amp1 = (g % 2 === 0 ? 1 : -1) * 3.5;
      const amp2 = (g % 3 === 0 ? -1 : 1) * 3;
      ctx.bezierCurveTo(320, gy + amp1, 700, gy + amp2, 1024, gy);
      ctx.stroke();
    }

    // Horizontal dark recessed joint
    ctx.strokeStyle = 'rgba(12, 6, 2, 0.68)';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(1024, y0);
    ctx.stroke();

    // Subtle highlight on lower edge of plank (bevel effect)
    ctx.strokeStyle = 'rgba(255, 230, 200, 0.25)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, y0 + 2.5);
    ctx.lineTo(1024, y0 + 2.5);
    ctx.stroke();

    // Staggered vertical end joints
    for (let j = 0; j < 2; j++) {
      const jx = ((r * 241 + j * 512) % 910) + 55;
      ctx.strokeStyle = 'rgba(12, 6, 2, 0.65)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(jx, y0);
      ctx.lineTo(jx, y0 + rowH);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.5, 2.2);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedurally generates lighter fluted wooden ceiling louvers / battens
 * with parallel slat shadows for the sunken porch ceiling.
 */
export function createCeilingLouverTexture(
  baseHex = '#985E3B',
  anisotropy = 8
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  const slats = 28;
  const slatW = 512 / slats;

  for (let s = 0; s < slats; s++) {
    const x0 = s * slatW;
    // Wood grain gradient on each slat
    const grad = ctx.createLinearGradient(x0, 0, x0 + slatW, 0);
    grad.addColorStop(0, 'rgba(255, 235, 205, 0.16)');
    grad.addColorStop(0.3, 'rgba(255, 235, 205, 0.05)');
    grad.addColorStop(0.85, 'rgba(0, 0, 0, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = grad;
    ctx.fillRect(x0, 0, slatW, 512);

    // Deep recessed shadow gap between louvers
    ctx.fillStyle = '#1a0c05';
    ctx.fillRect(x0 + slatW - 2.5, 0, 2.5, 512);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 4);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedurally generates polished vitrified marble/porcelain floor tiles
 * with delicate marble veins and fine grout joints.
 */
export function createVitrifiedFloorTexture(
  baseHex: string,
  gridCount = 8,
  anisotropy = 8
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 512, 512);

  // Soft organic marble cloud noise
  for (let i = 0; i < 50; i++) {
    const rx = Math.random() * 512;
    const ry = Math.random() * 512;
    const rad = 25 + Math.random() * 50;
    const grad = ctx.createRadialGradient(rx, ry, 2, rx, ry, rad);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft organic mineral veining
  ctx.strokeStyle = 'rgba(160, 150, 140, 0.15)';
  ctx.lineWidth = 1.2;
  for (let v = 0; v < 4; v++) {
    ctx.beginPath();
    let cx = Math.random() * 512;
    let cy = 0;
    ctx.moveTo(cx, cy);
    while (cy < 512) {
      cx += (Math.random() - 0.5) * 35;
      cy += 30 + Math.random() * 40;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Crisp fine tile grout grid
  const step = 512 / gridCount;
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i <= gridCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * step, 0);
    ctx.lineTo(i * step, 512);
    ctx.moveTo(0, i * step);
    ctx.lineTo(512, i * step);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 8);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedural split-face natural slate stone cladding texture for exterior wall niches.
 */
export function createSplitStoneTexture(baseHex: string, anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 512);

  const courses = 40;
  const ch = 512 / courses;
  for (let r = 0; r < courses; r++) {
    const shade = ((r * 31) % 46) - 23;
    ctx.fillStyle = shade > 0 ? `rgba(255, 255, 255, ${shade / 220})` : `rgba(0, 0, 0, ${-shade / 190})`;
    ctx.fillRect(0, r * ch, 256, ch - 1.6);

    // Chiseled stone shadow cleft
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, (r + 1) * ch - 1.6, 256, 1.6);

    // Top highlight bevel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fillRect(0, r * ch, 256, 1.0);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedural polished Black Granite with crystalline flecks
 * for entrance steps, threshold steps, and kitchen countertops.
 */
export function createBlackGraniteTexture(anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#151719';
  ctx.fillRect(0, 0, 512, 512);

  // Tiny crystalline granite flecks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 1.6;
    const brightness = Math.random();
    ctx.fillStyle =
      brightness > 0.8
        ? 'rgba(240, 245, 255, 0.45)'
        : brightness > 0.5
        ? 'rgba(90, 95, 105, 0.35)'
        : 'rgba(30, 32, 36, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Subtle neutral wood-grain overlay texture for furniture, cabinets, doors and frames.
 */
export function createWoodGrainTexture(anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 64; i++) {
    const y0 = Math.random() * 512;
    const dark = 0.06 + Math.random() * 0.12;
    ctx.strokeStyle = `rgba(70, 40, 18, ${dark})`;
    ctx.lineWidth = 0.8 + Math.random() * 1.8;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    for (let px = 0; px <= 512; px += 32) {
      ctx.lineTo(px, y0 + Math.sin(px * 0.02 + i) * 2.8);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedural fabric weave texture for sofas, armchairs, cushions, mattresses and duvets.
 */
export function createFabricTexture(anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);

  // Micro thread specks
  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const v = Math.random() > 0.5 ? 230 : 255;
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.35)`;
    ctx.fillRect(x, y, 2, 1);
  }

  // Cross-weave thread grid
  ctx.strokeStyle = 'rgba(170, 165, 158, 0.18)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 256; i += 6) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 256);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Micro plaster noise texture so painted walls look like real Asian Paints matte/silk emulsion.
 */
export function createPlasterTexture(anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);

  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const v = Math.random() > 0.5 ? 255 : 185;
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.05)`;
    ctx.fillRect(x, y, 1.8, 1.8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

export function createPlasterBumpTexture(anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const image = ctx.createImageData(256, 256);
  for (let i = 0; i < image.data.length; i += 4) {
    const value = 224 + Math.random() * 31;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Realistic blade-textured lawn grass.
 */
export function createGrassTexture(anisotropy = 8): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#3a542e';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const g = 75 + Math.random() * 75;
    ctx.strokeStyle = `rgba(${g - 25}, ${g + 35}, ${g - 35}, 0.55)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 4, y - 3 - Math.random() * 4);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(24, 24);
  tex.anisotropy = Math.min(anisotropy, 8);
  tex.needsUpdate = true;
  return tex;
}


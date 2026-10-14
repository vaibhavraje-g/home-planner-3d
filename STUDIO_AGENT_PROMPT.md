# Master Studio Agent Prompt: Interactive 3D House Studio & Asian Paints Decorator

> **How to use:** Copy and paste the entire block below into your AI Studio Agent (Antigravity Studio, Claude Code, Cursor, v0, etc.) to generate the complete interactive 3D HTML application.

---

```markdown
# TASK: Build an Interactive 3D Architectural House Studio & Decorator Web App (HTML + Three.js)

You are an expert 3D Creative Technologist and Senior Frontend Architect specializing in Three.js, WebGL, and architectural visualization. Build a self-contained, production-grade interactive single-file `index.html` application that models an authentic Indian 3BHK contemporary villa based on real construction blueprints and site photos, allowing users to explore the house in 3D, walk inside each room, and interactively test official Asian Paints colors.

---

## 1. Ground Truth Architectural Specifications

### A. Dimensions & Footprint (From Official Blueprint: 37' 0" × 50' 0")
- **Total Footprint:** 37 feet width (X-axis) × 50 feet length (Z-axis). Single-storey villa with a rooftop staircase tower (mumty).
- **Scale:** 1 unit in Three.js = 1 foot (or 0.3048 meters). 
- **Ceiling Height:** 10' 6" clear height (slab at 11' 0").
- **Raised Plinth:** 2' 6" plinth height above ground with front black granite steps.

### B. Room-by-Room Schedule (Exact Plan Layout)
1. **Front Verandah / Porch (Front-Right):** `20' 6" × 12' 6"`
   - Cantilevered roof slab supported by a single circular pillar (1' 2" dia) at the front-right corner.
   - Black granite 4-step entrance staircase.
   - Back wall finished with horizontal teak-wood plank tiles.
   - Ceiling fitted with fluted wooden louvers and recessed spotlights.
2. **Living Room (Front-Center/Right):** `21' 0" × 16' 6"`
   - Main double-door entrance leading directly from the Porch.
   - Large window facing the verandah.
3. **Kitchen (Front-Left):** `12' 0" × 18' 0"`
   - L-shaped modular kitchen counter.
4. **Puja Ghar (Attached to Kitchen):** `5' 0" × 3' 0"`
   - Enclosed sanctuary with carved wooden jali partition.
5. **Central Passage / Foyer:** `8' 6"` wide central circulation transitioning to a `4' 0"` rear corridor.
6. **Internal Staircase:** `11' 0" × 6' 0"`
   - Located on the left wall; 3' 0" wide flights with landing leading up through the roof slab into the rooftop mumty tower.
7. **Bedroom 1 (Master Bedroom - Rear-Right):** `12' 0" × 14' 6"` with attached **Toilet:** `12' 0" × 4' 0"`.
8. **Bedroom 2 (Middle-Left):** `14' 0" × 11' 0"` with attached **Toilet:** `5' 0" × 10' 6"`.
9. **Bedroom 3 (Rear-Left):** `14' 0" × 12' 0"`.
10. **Common Sanitary Hub (Rear-Center):**
    - **WC:** `4' 0" × 4' 0"`
    - **Bathroom:** `4' 0" × 6' 0"`
    - **Passage:** `4' 0"` width.

### C. Exterior Facade Details (From Construction & Plaster Photos)
1. **Front Porch Parapet Cutout:** Directly above the porch roof slab, the parapet features:
   - A central tall rectangular hollow cutout frame.
   - A left lower square cutout frame.
   - A right solid parapet wall with coping.
2. **North Side Elevation Wall:**
   - **Corner Pilaster:** Features 6 crisp horizontal recessed groove lines.
   - **Two Projecting Box Windows:** Symmetrical projecting concrete chajja frames with lower recessed display ledges underneath.
   - **Vertical Stone Niche:** Recessed vertical panel between the two windows clad in split-face stone tile with warm 3000K up-down architectural sconce lighting.
   - **Rear Ventilator:** High-level small toilet window.
3. **Rooftop Staircase Mumty Tower:**
   - Located on the rear-left roof slab directly above the 11' × 6' staircase.
   - Features an overhang roof slab chajja, terrace exit door, and vertical window slit.

---

## 2. Core Functional Requirements & User Experience

### Mode 1: Pure Uncolored Clay / Architectural Massing Mode (DEFAULT)
- **Constraint:** By default, start with **ZERO color applied**.
- All walls, trims, ceilings, and slabs must render in a clean, matte architectural white/clay finish (`#EEEEEE` - `#E0E0E0`) with soft contact shadows and clean edge definition.
- **Blank Surroundings:** Surrounding environment is a clean, distraction-free neutral studio void.
- Provide toggle switches for surrounding elements:
  - `Background`: Simple Blank Void vs. Soft Daylight Sky.
  - `Ground`: Hidden (Pure Floating Model) vs. Lawn & Driveway Pavers.
  - `Roof`: Attached vs. Detached (Cutaway).

### Mode 2: Three Exploration Views
1. **Exterior 3D Orbit View:**
   - Smooth OrbitControls (Left-drag to rotate, Right-drag to pan, Scroll to zoom).
   - Instant camera presets with smooth tweening transitions:
     - `Front (East Entrance / Porch)`
     - `Side (North Elevation / 2 Box Windows)`
     - `Rear (West Elevation)`
     - `South (Staircase Tower Elevation)`
     - `3/4 Isometric Perspective`
     - `Top / Roof Plan View`
2. **Cutaway Dollhouse View:**
   - Automatically detaches/hides the roof slab and mumty.
   - Positions camera at an aerial 45° perspective looking directly into the 37' × 50' 3BHK interior.
   - Clearly reveals all room partitions, doorways, corridors, and 3D floating room labels (Living, Kitchen, Puja, Master Bed, Bed 2, Bed 3, Toilets).
3. **First-Person Room Walkthrough / "Walk Inside":**
   - Allows the user to teleport inside ANY room:
     - `Living Room (21' × 16'6")`
     - `Pooja Room (5' × 3')`
     - `Kitchen (12' × 18')`
     - `Master Bedroom (12' × 14'6")`
     - `Bedroom 2 (14' × 11')`
     - `Bedroom 3 (14' × 12')`
     - `Front Verandah (20'6" × 12'6")`
     - `Terrace & Staircase Mumty`
   - Positions the camera at 5' 2" (1.6m) eye level inside the selected room.
   - 360° drag-to-look around controls with gentle interior ambient illumination and doorway sightlines.

---

## 3. Interactive Decorator Studio & Asian Paints Palette System

Provide an expandable side panel allowing the user to switch from "Clay Mode" to "Asian Paints Decorator Studio".

### Official Asian Paints Shade Database (With Exact Codes & Hex Values)
1. **Off-Whites & Base Emulsions (High LRV):**
   - `Innocent White (L180)` — `#F3EFE6` (Royale Luxury / Apex Ultima)
   - `Morning Glory (0765)` — `#FAF7EF`
   - `Canvas Cream (0313)` — `#EAE6DD`
   - `Cream Pie (L152)` — `#F6F3EC`
   - `Absolute White (L161)` — `#FFFFFF` (Ceilings)
2. **Earth Tones, Mocha & Warm Taupes:**
   - `Sand Drift (8461)` — `#C4B59D` (Window box frames & grooves)
   - `Camel Skin (8515)` — `#C89B61` (Parapet accent box)
   - `Mushroom (8470)` — `#9D9484`
   - `Raw Jute (8513)` — `#AFA89B`
   - `Nut Brown-N (0419)` — `#5E4632`
   - `Almond Frost (0957)` — `#DFD5C6`
3. **Subtle Pastels (Interior Bedroom & Accent Swatches):**
   - `Aqua Hint (L114)` — `#D8EAE6` (East/Pooja accent wall)
   - `Lilac Breeze (7188)` — `#E5DDEB` (Bedroom 2 / Kids room)
   - `Lavender Lace (7156)` — `#E8E1E8`
   - `Gem Stone (7172)` — `#D9DFE3` (Bedroom 3 / Guest room)
4. **Deep Contrasts:**
   - `Thundercloud (8305)` — `#474B4E` (Porch column & plinth border)
   - `Charcoal Grey (8297)` — `#383A3C`
   - `Pewter (8298)` — `#606466`

### One-Click Curated Palette Themes:
- **Theme 1: Warm Sandstone & Mocha Earth (Site Photo & AI Concept Match)**
  - Main Walls: `Innocent White (L180)`
  - Window Boxes & Grooves: `Sand Drift (8461)`
  - Parapet Feature Box: `Camel Skin (8515)`
  - Column & Plinth: `Thundercloud (8305)`
  - Verandah: Teak Wood Tile (`#985934`) + Black Granite Steps (`#18191A`)
- **Theme 2: Soft Subtle Pastels (Owner's Shortlist)**
  - Main Walls: `Innocent White (L180)`
  - Living Accent: `Aqua Hint (L114)`
  - Bedrooms: `Lilac Breeze (7188)` & `Gem Stone (7172)`
  - Exterior Trims: `Sand Drift (8461)` + `Gem Stone (7172)`
- **Theme 3: Modern Minimalist Greige & Teak**
  - Main Walls: `Canvas Cream (0313)`
  - Window Boxes & Trims: `Raw Jute (8513)`
  - Accents: `Nut Brown-N (0419)`
  - Column: `Charcoal Grey (8297)`

### Custom Surface-by-Surface Painter:
Allow the user to select any category and apply colors in real-time:
- `Exterior Main Walls`
- `Window Box Chajjas & Grooves`
- `Parapet Accent Box`
- `Porch Circular Pillar`
- `Living Room Walls`
- `Master Bedroom Walls`
- `Bedrooms 2 & 3 Accent Walls`

---

## 4. Technical Architecture & Implementation Guidelines

- **Format:** Single, self-contained `index.html` file with embedded CSS and JavaScript.
- **Dependencies:** Use CDN links for Three.js (r128) and OrbitControls.
- **Lighting:** ACESFilmicToneMapping with soft PCFSoftShadowMap, morning East directional sun (intensity 1.2), soft sky hemisphere light, and local warm interior sconce/ambient lights.
- **UI Design:** Dark, modern, glassmorphic UI overlay panels (blur 14px, rounded corners, clean typography, responsive layout).
- **Zero Errors:** Fully tested, robust geometry creation, smooth camera transitions, and resilient window resize handling.
```

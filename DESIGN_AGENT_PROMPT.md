# Master Design Agent Prompt Note: 3D House Visualizer & Interactive Decorator

> **Purpose:** Share this complete architectural specification with any AI design agent (Antigravity Studio, Claude Code, Cursor, v0, etc.) to explore, reproduce, or enhance this 3D house visualizer with 100% fidelity to the blueprint and site construction photos.

---

## 1. Ground Truth Blueprint & Architectural Specifications

- **Footprint:** Indian contemporary villa on a **37' 0" (Width / X-axis) × 50' 0" (Length / Z-axis)** plot.
- **Reference Files:**
  - 2D Blueprint: [`floor_plan_37x50.png`](floor_plan_37x50.png)
  - Plastered Site Photos: `WhatsApp Image 2026-09-17 at 9.22.54 AM.jpeg`, `WhatsApp Image 2026-09-17 at 9.22.55 AM (1).jpeg`, `WhatsApp Image 2026-10-13 at 9.39.47 PM.jpeg`
  - Brick Structural Photos: `ChatGPT Image Oct 13, 2026, 10_22_03 PM.jpg`, `ChatGPT Image Oct 13, 2026, 10_22_16 PM.jpg`
  - Rendered Reference: `WhatsApp Image 2026-09-17 at 9.22.55 AM.jpeg`
- **Plinth & Scale:** 2' 6" raised plinth with 4 black granite front steps; 1 unit = 1 foot.

---

## 2. Room Layout, Washrooms & Circulation Axis

1. **Straight Circulation Axis from Front to Back Door:**
   - Front entrance double doors open from the **Front Porch** directly into the **Living Room (`21' 0" × 16' 6"`)**.
   - Back wall of the Living Room features a wide opening into the **Central Passage (`8' 6"` transitioning to `4' 0"`)**.
   - The 4' passage runs straight to the **Back Exterior Door** at the rear of the house, providing a completely unimpeded straight walk-through from front to backyard!
2. **Kitchen (`12' 0" × 18' 0"`) with 3 Windows:**
   - Window 1: East front wall facing the street.
   - Window 2: South exterior left wall.
   - Window 3: North interior wall facing into the Front Porch/Verandah.
   - Attached **Puja Ghar (`5' 0" × 3' 0"`)** with carved wooden jali partition and window.
3. **Correct Washroom Distribution:**
   - **Master Bedroom (`12' 0" × 14' 6"`)**: Private **attached toilet (`12' 0" × 4' 0"`)** on the west (rear) side with high ventilator.
   - **Bedroom 2 (`14' 0" × 11' 0"`)**: Private **attached toilet (`5' 0" × 10' 6"`)** on the west side with ventilator.
   - **Bedroom 3 (`14' 0" × 12' 0"`)**: **NO attached toilet**. The common **WC (`4' 0" × 4' 0"`)** and **Bathroom (`4' 0" × 6' 0"`)** are located directly in front of Bedroom 3 across the shared 4' passage!
4. **Sunken Porch Ceiling:**
   - The Front Porch (`20' 6" × 12' 6"`) roof slab is slightly sunken (clear ceiling height is ~9' 3", lower than the main house's 10' 6" ceiling).
   - The outer beam, circular pillar, and parapet walls extend upward to align flush with the main roof elevation, capped by the geometric cutout frames.
5. **Exterior Facing Windows:**
   - Every room has windows on its exterior facing walls, including the Living Room (porch window + projecting side box window).

---

## 3. Elevation Alignments (All 4 Sides)

1. **East Elevation (Front / Z = +25.0):**
   - Left: Kitchen front wall with horizontal plaster grooves and framed window; Puja window.
   - Right: Front Porch with 4 black granite steps, single circular pillar (capital + base), horizontal teak-wood tile back wall, double entrance door, living room window, and fluted wooden ceiling.
   - Parapet above Porch: Central tall rectangular hollow cutout frame (Camel Skin 8515) + left square hollow cutout frame + right solid parapet with coping.
2. **South Elevation (Right Side / X = +18.5):**
   - Front corner pilaster with **6 horizontal recessed grooves**.
   - Living room projecting concrete box window with lower display niche and vertical accent band extending to the parapet.
   - Central recessed stone cladding niche with dual up-down architectural sconce lights.
   - Master bedroom projecting box window with lower display ledge.
   - Rear high toilet ventilator.
3. **North Elevation (Left Side / X = -18.5):**
   - 5 structural concrete column pilasters and continuous lintel band.
   - Kitchen window, Bedroom 2 window, Toilet vent, and Bedroom 3 window with concrete sills and projecting sunshades (chajjas).
   - **Rooftop Staircase Mumty Tower:** Projecting mid-level cantilevered beam, rising 8.5' above the roof slab with overhang chajja, terrace door, and vertical window.
4. **West Elevation (Rear / Z = -25.0):**
   - Bedroom 3 window, **Rear Service Exit Door (straight path)**, common WC & bathroom ventilators, and master toilet ventilator.

---

## 4. Color & Material Customization Architecture

1. **Uncolored Clay Mode (Default):**
   - Clean architectural matte finish (`#EEEEEE` - `#E0E0E0`) in a neutral studio void for massing evaluation.
2. **Curated Preconfigured Color Combos:**
   - **Theme 1: Warm Sandstone & Teak (Reference Image Match):**
     - *Main Walls:* Innocent White `L180` (`#F3EFE6`)
     - *Box Frames & Grooves:* Sand Drift `8461` (`#C4B59D`)
     - *Parapet Accent Frame:* Camel Skin `8515` (`#C89B61`)
     - *Pillars & Plinth Skirting:* Thundercloud `8305` (`#474B4E`)
     - *Porch Back Wall:* Teak Wood Plank Tiles (`#985934`)
     - *Niche:* Split-face Natural Stone Cladding (`#686a6d`)
     - *Interior Walls:* Canvas Cream `0313` (`#EAE6DD`)
   - **Theme 2: Modern Greige & Mocha Earth:** Morning Glory `0765` + Raw Jute `8513` + Nut Brown-N `0419` + Charcoal Grey `8297`.
   - **Theme 3: Subtle Asian Paints Pastels:** Cream Pie `L152` + Aqua Hint `L114` + Lilac Breeze `7188` + Gem Stone `7172`.
   - **Theme 4: Vastu Harmonized (East Entrance):** Canvas Cream `0313` + Sand Drift `8461` + Rich Tan `8522` + Pewter `8298`.
3. **Interactive 3D Raycasting / Click-to-Paint:**
   - Raycaster on canvas detects clicks on individual 3D meshes (exterior wall, pillar, box frame, door, steps, etc.).
   - Highlights the selected surface and lets the user pick individual swatches or apply the theme across all components.

---

## 5. Walk Inside & Exploration Controls

- **WASD / Arrow Keys Movement:** Real-time first-person walking inside the house.
- **Mouse Drag Look Around:** 360° camera rotation inside rooms.
- **One-Click Room Teleports:** Porch, Living Room, Kitchen (3 Windows), Puja Sanctuary, Straight Passage, Back Door, Master Bedroom, Bedroom 2, Bedroom 3, Common Bath, Stairs & Mumty.
- **Cutaway Dollhouse View:** Automatic roof removal and 3D floating room labels.

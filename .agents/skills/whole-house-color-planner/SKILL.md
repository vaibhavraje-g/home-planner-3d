---
name: whole-house-color-planner
description: Master orchestrator workflow for cohesive whole-house colour design, coordinating architectural colour theory (LRV, 60-30-10, daylight exposure, sheens), interior/exterior visualisation, Indian Vastu Shastra elemental zoning, and Vedic astrology. Defines inputs, outputs, and handoffs across six distinct roles, strictly audits compass directions, preserves house geometry, proposes three coordinated whole-house palettes, and clearly separates traditional beliefs from empirical architectural science.
---

# Whole-House Colour Planner Orchestrator

The master workflow orchestrating end-to-end residential colour design, balancing architectural science, spatial flow, traditional Vastu Shastra, personalized Vedic astrology, and photorealistic AI visualisation.

---

## The Six-Role Architecture & Handoff Pipeline

```mermaid
graph TD
    A[1. House Analysis Role] -->|Floorplan, Geometry, Orientations| B[2. Architectural Colour Role]
    A -->|Compass Bearings, Room Allocations| C[3. Vastu Consultation Role]
    A -->|Occupant Data (Optional/Local)| D[4. Vedic Astrology Role]
    B & C & D -->|Synthesized Whole-House Palette| E[5. Visualisation Role]
    E -->|Rendered Concept & Spec| F[6. Quality & Compliance Review Role]
```

### Role 1: House Analysis (`house-analysis`)
- **Responsibilities:**
  - Ingest floorplans, room dimensions, ceiling heights, window sizes, flooring materials, and fixed cabinetry.
  - **MANDATORY AUDIT:** Verify compass directions (North, South, East, West) for every room.
  - **GUARDRAIL:** If compass orientations are missing, **HALT and proactively ask the user** before finalizing directional Vastu or daylight calculations.
  - Establish **Locked Invariants**: structural columns, beam positions, window openings, plinths, and door returns that must never drift.
- **Handoff Output:** `SpatialBrief` containing room inventory, compass bearings, daylight exposure tags, and locked geometry.

---

### Role 2: Architectural Colour Specialist (`architectural-colour`)
- **Responsibilities:**
  - Analyze **Daylight Exposure**:
    - *North-facing rooms:* Cool, indirect, diffused light. Requires warm undertones (creams, warm greiges, soft blush) and higher LRV (65–80%) to prevent gloominess.
    - *South-facing rooms:* Intense, warm, amber sun throughout the day. Requires neutral-to-cool undertones (soft sages, muted blues, balanced taupes) to prevent visual overheating.
    - *East-facing rooms:* Bright morning light, cooler afternoons. Ideal for fresh greens, pale golds, and clean whites.
    - *West-facing rooms:* Dim mornings, intense late-afternoon golden-orange glare. Requires muted, calming mid-tones.
  - Enforce **60-30-10 Rule**:
    - 60% Dominant (Main wall surfaces)
    - 30% Secondary (Feature wall, millwork, large textiles, ceiling or cabinetry)
    - 10% Accent (Decor, lighting hardware, cushions, niche reveals)
  - Manage **Light Reflectance Value (LRV)**:
    - Main living / hallways: LRV 60–75%
    - Cozy bedrooms / media rooms: LRV 30–50%
    - Ceilings: Typically 10–15% higher LRV than walls (unless doing color drenching)
  - Define **Sheen Schedule**:
    - Ceilings: Flat / Ultra-Matte (0–3% gloss)
    - Living / Bedrooms: Eggshell or Matte (5–10% gloss)
    - Kitchens / Bathrooms: Satin (15–25% gloss for scrubbability and moisture resistance)
    - Millwork, Doors & Trim: Semi-Gloss or Satin (25–40% gloss for durability)
  - Propose **Three Distinct Coordinated Whole-House Palettes**:
    1. **Palette A: Biophilic Heritage & Earth Warmth** (Warm sand, muted terracotta, olive sage, raw linen, antique brass).
    2. **Palette B: Modern Serene Minimalist** (Warm alabaster, neutral greige, pale celadon, muted slate, natural white oak).
    3. **Palette C: Vibrant Indian Contemporary** (Almond cream base, royal peacock teal, warm saffron/mustard accents, rich teak/walnut).
- **Handoff Output:** `ArchitecturalPaletteSpec` with precise LRV, undertones, finishes, and room-by-room flow.

---

### Role 3: Vastu Shastra Consultant (`vastu-consultation`)
- **Responsibilities:**
  - Map rooms to the 8 cardinal directions and 16 Vastu zones.
  - Evaluate element distributions according to the *Panchamahabhutas* (Water, Fire, Earth, Air, Space).
  - Cross-check the architectural palettes against auspicious/inauspicious directional parameters.
  - Propose non-structural color remedies for any displaced functions (e.g., buffering a kitchen in the North with pastel green).
  - Explicitly document cultural and metaphysical rationale, keeping it distinct from physical optical properties.
- **Handoff Output:** `VastuAuditReport` with directional compatibility score, elemental notes, and non-structural remedies.

---

### Role 4: Vedic Astrology Integrator (`astrology-integration`)
- **Responsibilities:**
  - If requested and birth details are provided locally, correlate the planetary lords (*Grahas*) and ruling zodiac sign (*Rashi*) to private zones (e.g., owner's master bedroom, home office desk).
  - **PRIVACY & SAFETY MANDATE:**
    - Birth data and photographs are strictly processed locally; **NEVER transmitted externally**.
    - No fatalistic predictions, medical diagnoses, or fear-inducing statements.
    - Offline calculation only using local deterministic algorithms (via `astro-skill`).
  - Frame astrological suggestions strictly as personal energetic resonance and cultural tradition, never as structural mandates.
- **Handoff Output:** `PersonalAstrologyHarmonizer` with resident planetary accent recommendations.

---

### Role 5: Spatial Visualiser (`visualisation`)
- **Responsibilities:**
  - Translate the selected whole-house palette and architectural brief into precise generation briefs.
  - Follow the non-negotiable rules of `interior-design-visualizer`:
    - Separate explicit requirements, designer decisions, and locked invariants.
    - Strictly preserve architectural geometry (window framing, ceiling heights, door returns, plinth heights).
    - Ensure lighting reflects true window orientation (North soft light vs South sun).
  - Generate photorealistic concepts using `generate_image`.
  - Verify and inspect outputs locally using `view_file`.
- **Handoff Output:** `VisualMockups` (saved image artifacts with exact paths and geometry review).

---

### Role 6: Quality & Compliance Reviewer (`quality-review`)
- **Responsibilities:**
  - **Geometric Consistency Check:** Confirm that room structure, doorways, and windows have not morphed or drifted.
  - **Colour Harmony & Transition Review:** Confirm cohesive whole-house continuity (hallway transitions, trim consistency, sightlines between adjoining rooms).
  - **Epistemic Clarity Audit:** Verify that the report strictly delineates:
    - *Evidence-Based Architectural Physics:* LRV, color temperature, circadian rhythm, pigment mixing, moisture durability.
    - *Traditional Cultural Systems:* Vastu Shastra directional zones, elemental symbolism, Vedic astrological planetary correspondences.
  - **Deliverable Packaging:** Deliver complete specifications with paint brand equivalents, hex codes, sheen schedules, and maintenance advice.
- **Handoff Output:** Final `WholeHouseDesignReport`.

---

## Operating Guidelines & Privacy Rules

1. **Ask for Missing Directions:** If the user presents room photographs or floorplans without orientation, immediately inquire: *"Could you specify the compass orientation (North/South/East/West) or front entrance facing direction? This is essential for accurate natural light balancing and Vastu directional zoning."*
2. **Preserve Geometry:** Never let AI hallucinate non-existent windows, arches, or removed load-bearing walls.
3. **Respect Personal Privacy:** House photos and birth details must never leave the local environment.
4. **Three Distinct Coordinated Palettes:** Always formulate three full-house options so the homeowner has meaningful aesthetic choices that remain completely Vastu-compliant and architecturally sound.

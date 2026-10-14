# Workflow Handoffs, Input Schemas, and Verification Contracts

This document formalizes the input/output schemas and handoff contracts across the six roles of the `whole-house-color-planner` skill.

---

## 1. Role: House Analysis (`house-analysis`)

### Input Requirements:
- Floorplan or room schedule (names, dimensions, ceiling heights).
- Structural elements (openings, columns, beams, fixed window locations).
- Photos, renders, or sketches of existing rooms.
- **Compass Orientations:** North arrow on floorplan, or explicit statement of room / entrance bearings.

### Verification Guardrail:
- If compass directions are absent:
  ```text
  [FLAG_MISSING_ORIENTATION]: Compass orientations are missing. Halt Vastu and daylight calculations. Prompt user immediately.
  ```

### Handoff Artifact: `SpatialBrief.json`
```json
{
  "project_id": "home_01",
  "rooms": [
    {
      "name": "Living Room",
      "quadrant": "East",
      "dimensions_ft": [16, 20, 10],
      "daylight_exposure": "Morning direct sun, afternoon indirect diffused",
      "locked_invariants": ["East-facing 8ft floor-to-ceiling glass slider", "Structural column in SE corner"]
    },
    {
      "name": "Pooja Room",
      "quadrant": "North-East",
      "dimensions_ft": [6, 8, 10],
      "daylight_exposure": "Gentle morning indirect light",
      "locked_invariants": ["Marble floor threshold", "East-facing prayer altar"]
    },
    {
      "name": "Kitchen",
      "quadrant": "South-East",
      "dimensions_ft": [12, 14, 10],
      "daylight_exposure": "Intense morning light, warm midday",
      "locked_invariants": ["L-shaped granite counter", "Hob position on East wall"]
    },
    {
      "name": "Master Bedroom",
      "quadrant": "South-West",
      "dimensions_ft": [15, 18, 10],
      "daylight_exposure": "Intense afternoon sun (warm)",
      "locked_invariants": ["West window with timber louvers", "South solid masonry wall"]
    }
  ]
}
```

---

## 2. Role: Architectural Colour Specialist (`architectural-colour`)

### Calculation Protocols:
1. **Light Reflectance Value (LRV) Check:**
   - Dark/North rooms: Min LRV 65% for dominant wall.
   - High-sun South/West rooms: LRV 50–65% with neutral/cool desaturated undertones to control glare and thermal perception.
2. **60-30-10 Proportion Check:**
   - 60% Dominant (Main walls)
   - 30% Secondary (Feature wall / cabinetry / built-ins)
   - 10% Accent (Decor, textiles, light fixtures, metal trim)
3. **Continuous Architectural Trim & Ceiling Strategy:**
   - Continuous off-white or neutral trim ties discontinuous rooms together.
   - Ceiling LRV is 10–15% higher than wall color to maximize vertical volume.
4. **Sheen Specifications:**
   - Ceiling: Ultra-Matte (0–3%)
   - Walls: Eggshell (5–10%)
   - Wet areas (Kitchen / Baths): Satin (15–25%)
   - Doors, Architraves, Millwork: Semi-Gloss (30–40%)

---

## 3. Role: Vastu Shastra Consultant (`vastu-consultation`)

### Validation Protocols:
1. Check elemental assignment against the *Panchamahabhuta* Matrix:
   - NE = Water/Space -> White, cream, ice blue.
   - SE = Fire -> Peach, terracotta, soft orange, pastel green.
   - SW = Earth -> Warm sand, camel, almond, earthy yellow.
   - NW = Air -> Pearl, light grey, soft cream.
   - Center = Space -> Pure airy white.
2. Flag elemental clashes:
   - *Example:* Black or navy blue in SE (Water extinguishing Fire).
   - *Example:* Fiery red in NE (Fire polluting spiritual Water).
3. Specify non-structural color remedies when room functions deviate from ideal Vastu placement.

---

## 4. Role: Vedic Astrology Integrator (`astrology-integration`)

### Local Privacy & Ethics Guardrails:
1. Birth dates, birth times, and planetary charts are calculated **strictly offline**.
2. Never send birth data or personal identities to external APIs or remote third parties.
3. Astrological resonance provides personalized accent/room choices; never use it to induce fear or predict negative life events.
4. Clearly mark recommendations as cultural/personal astrological alignment, distinct from structural architecture.

---

## 5. Role: Spatial Visualiser (`visualisation`)

### Rendering Protocol:
1. Translate the selected palette and locked invariants into a strict image generation brief.
2. State camera position, eye-level perspective, and window light direction matching actual compass exposure.
3. Call `generate_image` in the Antigravity IDE platform.
4. Inspect the generated artifact with `view_file` to confirm that doors, windows, and ceiling lines match the floorplan geometry.

---

## 6. Role: Quality & Compliance Reviewer (`quality-review`)

### Final Deliverable Verification Checklist:
- [ ] Were compass directions confirmed prior to palette creation?
- [ ] Are 3 distinct coordinated whole-house palettes provided?
- [ ] Are structural geometry invariants preserved in all descriptions and visual briefs?
- [ ] Is there an unambiguous distinction between empirical science (LRV, color temperature, circadian rhythm) and traditional systems (Vastu, astrology)?
- [ ] Are paint codes, hex values, LRVs, and sheen schedules fully articulated?
- [ ] Has personal user data remained strictly on-device?

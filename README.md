# AtlasInfoViewerJS

A browser-based HTML5 canvas viewer for M2's `atlasinfo.txt` map layout file.
Load a file, inspect sector placements, detect overlaps, and export the result as a PNG — no installation required.

**[Live Demo](https://martysama0134.github.io/AtlasInfoViewerJS/)** · Fork of [m2lab original](http://metin2lab.altervista.org/atlasinfo/) by Mr.Licorice / Mr.Lucifer

---

## What is atlasinfo.txt?

`atlasinfo.txt` is a configuration file used by the M2 game client and server to describe the world map layout. Each line defines one map sector — its name, its world-space origin coordinates, and how many 256-unit blocks it spans in each axis.

The client reads this file to determine which map files to load, where to place them in world space, and how they connect. Server-side tools use it for pathfinding, spawn placement, and collision setup.

A fundamental rule enforced by the engine is that **sector origins must be multiples of 25600** (or zero). Violating this causes glitchy object collisions at sector boundaries because the collision grid no longer aligns with the coordinate system.

### File format

```
<map_name>  <origin_x>  <origin_y>  <width_sectors>  <height_sectors>
```

| Field | Unit | Description |
|-------|------|-------------|
| `map_name` | — | Internal map identifier (e.g. `map_a1`) |
| `origin_x` | coord × 100 | World X origin of the sector's top-left corner |
| `origin_y` | coord × 100 | World Y origin of the sector's top-left corner |
| `width_sectors` | blocks | Width in 256-unit map blocks |
| `height_sectors` | blocks | Height in 256-unit map blocks |

Fields are whitespace-separated. Lines with fewer than five fields are skipped.

#### Example

```
map_a1       256000   256000   25  25
map_n_flame  512000   768000   50  50
season2/map_trent  1024000  512000  25  25
```

The viewer strips common prefixes and optional path prefixes from display names to keep labels readable.

---

## Features

| Feature | Details |
|---------|---------|
| **Canvas rendering** | Each sector is drawn as a filled rectangle with a randomly assigned color, scaled to fit the viewport |
| **Stable colors** | Colors are assigned once on file load and remain consistent across scale changes |
| **Overlap detection** | Enable the Transparency toggle to render sectors at 65% opacity — overlapping areas appear as a visibly darker blended region |
| **Adaptive grid labels** | Background grid cells show world coordinates; label font size scales proportionally with zoom level |
| **Scale control** | Drag the slider or type a value directly (0.1 – 1.0) |
| **Log panel** | Toggle a collapsible textarea showing every parsed sector and the canvas dimensions |
| **PNG export** | Exports the current canvas view as `atlasinfo.png` with a white background |
| **No dependencies** | Pure HTML5 + vanilla JS; works offline from a local file |

---

## Usage

1. Open the [live demo](https://martysama0134.github.io/AtlasInfoViewerJS/) or serve the repository locally (any static file server or just `index.html` in a browser).
2. Click **Load Atlasinfo** and select your `atlasinfo.txt`.
3. The canvas renders immediately. Use the **Scale** slider to zoom in or out.
4. Enable **Transparency** to visually identify overlapping sectors.
5. Click **Get Image** to download the current view as a PNG.
6. Click **Toggle Log** to inspect the raw parsing output.

### Running locally

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## Controls reference

| Control | Behaviour |
|---------|-----------|
| Load Atlasinfo | Opens a file picker; parses the selected `atlasinfo.txt` and redraws |
| Scale (slider) | Sets the render scale from 0.1× to 1.0× |
| Scale (text input) | Direct numeric entry; syncs the slider |
| Transparency | Toggles 65% alpha on sector fills to expose overlaps |
| Toggle Log | Shows/hides the parsing log textarea |
| Get Image | Downloads the canvas as `atlasinfo.png` (white background) |

---

## Overlap rule

The M2 engine requires map sector origins to be exact multiples of **25600 coordinate units** (or zero). When two sectors are placed so that their rectangles intersect in world space, objects near the boundary may clip, teleport, or collide incorrectly.

Use the **Transparency** toggle to spot any unintended overlap at a glance — the blended darker region shows exactly where the rectangles intersect.

---

## Project structure

```
AtlasInfoViewerJS/
├── index.html              # Single-page app shell
├── assets/
│   ├── css/
│   │   └── style.css       # Design tokens, component styles, responsive rules
│   └── js/
│       ├── functions.js    # File parsing, draw loop, event handling
│       └── centeredcanvas.js   # Canvas drawing helpers (text wrap, outlined text)
```

---

## Credits

- **Original tool** — [Mr.Licorice / Mr.Lucifer](http://metin2lab.altervista.org/atlasinfo/)
- **Improvements** — [martysama0134](https://github.com/martysama0134/AtlasInfoViewerJS)

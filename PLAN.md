# Feature Plan

The app currently displays a fixed walking route between Tokyo landmarks on a Leaflet map. Here are suggested features to make it more useful and engaging.

> **Constraint:** The app is hosted on GitHub Pages (static-only, no backend). All features below are fully client-side — data lives in bundled JSON files, user state is persisted in `localStorage`, and routing uses the free public OSRM API.

---

## 1. Manhole Card Data Layer ✅ DONE

The project is called "manhole-cards" but doesn't show any yet. Add a data layer with manhole cover locations and their associated collectible cards.

- ✅ Store manhole card data (location, description, city/ward, distribution info, category) in `src/data/manholeCards.json` — 20 real Tokyo cards with accurate distribution locations sourced from the official GKP/cardhunter.jp database.
- ✅ Custom manhole cover SVG icon at `public/manhole-icon.svg` used as the Leaflet marker.
- ✅ `ManholeMarkers` component (`src/ManholeMarkers.js`) renders all 20 cards as custom markers on the map.
- ✅ Clicking a marker opens a styled popup showing: category badge (color-coded), name, ward, description, and distribution pickup location/address.
- Card images not yet added (no image URLs in the data); future tasks can add `imageUrl` field and photos to `public/`.
- Data fields per card: `id`, `name`, `ward`, `description`, `coordinates`, `distributionLocation`, `distributionAddress`, `category` (culture/nature/character/landmark/art).
- Categories covered: culture (5), nature (2), character (4), landmark (5), art (4).

## 2. User-Editable Routes

Let users build their own manhole-hunting routes instead of relying on hardcoded waypoints.

- Click on manhole markers to add them as stops.
- Drag-and-drop to reorder stops in a sidebar list.
- "Clear route" button to start over.

## 3. Sidebar / Stop List Panel

Add a collapsible sidebar showing the current route as an ordered list.

- Display stop name, thumbnail, and estimated walking distance/time to next stop.
- Click a stop to pan/zoom the map to it.
- Show total route distance and estimated walking time at the top.

## 4. Filter & Search

- Search bar to find manhole cards by name, city, or design theme (client-side filtering over the bundled JSON).
- Filter toggles (e.g. by ward, by design category, by "visited" status).
- Highlight matching markers on the map.

## 5. "Visited" Tracking

- Let users mark cards as collected/visited (persisted in `localStorage`).
- Visual distinction on the map (e.g. greyed-out vs. vibrant marker).
- Progress indicator: "12 / 47 collected".

## 6. Multiple Tile Layer Options

- Add a Leaflet layer control to switch between map styles (e.g. CartoDB Light, OpenStreetMap, Stadia Maps).
- A dark-mode tile layer option would pair well with a dark UI theme.

## 7. Mobile-Friendly Layout

- Make the map full-screen on small viewports.
- Bottom sheet or drawer for the stop list instead of a sidebar.
- Ensure touch-friendly controls.

## 8. Share / Export Route

- Generate a shareable URL encoding the selected stops in the URL hash (works with GitHub Pages' static routing).
- Export route as a GPX file generated client-side (e.g. using `Blob` + download link) for use in other mapping/GPS apps.

## 9. Geolocation

- "Locate me" button using the browser Geolocation API.
- Show user's position on the map.
- Optionally sort nearby manhole cards by distance.

## 10. Photo Gallery per Card

- Expand popups or add a detail modal with multiple photos (cover design, in-situ photo, the collectible card itself).
- All images stored as static assets in `public/` and referenced from the data JSON.

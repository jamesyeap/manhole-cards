# AGENTS.md

## Build & Dev Commands

- `npm start` — start dev server
- `npm run build` — production build (uses `react-scripts build`)
- `npm test` — run tests (uses `react-scripts test`)
- `npm run deploy` — deploy to GitHub Pages

## Stack

- React 19, Leaflet + react-leaflet, plain JS (no TypeScript)
- Static site hosted on GitHub Pages (no backend)
- User state persisted in `localStorage`

## Workflow

When working on tasks:

1. Always use a subagent to perform each task.
2. At the end of the subagent's run, spin up another subagent to test and verify that the task has indeed been completed.
3. If the task has not been completed, or any bug has been discovered, spin up another subagent to fix the bug, and go back to step 2.

Always keep the Tasks section up to date — mark tasks as done when completed, and add new tasks as they arise.

## Tasks

- [x] Fix StopList sidebar to filter stops by selected day (currently shows all stops regardless of day selection)
- [x] Fix RouteLines to only display route segments for the currently selected day (currently shows all routes regardless of day selection)
- [x] Fix StopList sidebar to allow the user to finalize the route when a specific day is selected, and not in the "All" days selection.
- [x] Fix route to allow user to click on the destination to finalize the route, because currently when the user clicks on a destination in drawing mode, the details of the destination are displayed instead of the route being extended.
- [x] Walking Stats Per Day — show per-day walking stats (distance, steps, time) as bar charts or sparklines in the sidebar
- [x] Export / Share — generate shareable URL via URL hash and allow GPX file export of routes
- [x] Add integration with https://anythingsearch.info/ - allow users to select manhole cards from there, and also fetch manhole card information from there.
- [x] "Closest Card I Missed" Layer — show uncollected cards with greyed-out markers and display how close they were to each day's route
- [x] Currently the map highlights specific locations when a day is selected, even when the location hasn't been added to that day's route. Fix this.
- [x] Replace the map icon pins with the actual pictures of the cards.
- [x] Dark Mode / Map Style Switcher — add Leaflet layer control to toggle between CartoDB Light, OpenStreetMap, and CartoDB Dark Matter
- [x] Responsive / Mobile Layout — make map full-screen on small viewports with a bottom drawer/sheet for the stop list

## Feature Ideas

This is a personal trip retrospective site — it showcases a completed Japan trip where manhole cards were collected. The tone should be "look at what I did" rather than "plan your trip." Features should focus on visualising and presenting the trip data in interesting ways.

### Trip Statistics Dashboard ✅ DONE

Add a summary panel showing trip stats at a glance: total cards collected, total distance walked, number of wards visited, number of unique categories covered, and the date range of the trip. This gives visitors an immediate sense of scale.

- ✅ `TripStats.js` component shows total cards, unique wards, unique categories, total km walked, and a category breakdown row.
- ✅ Rendered between the page title and the main layout.

### Trip Timeline / Day-by-Day View ✅ DONE

Let the user (you) tag each card with the day it was collected. Then render a timeline or day-picker that highlights which cards were picked up on each day, with the route for that day shown on the map. This turns the site into a trip diary rather than just a pin map.

- ✅ Each card in `manholeCards.json` now has a `collectionDay` field (1–5), distributed geographically across 5 days.
- ✅ `DayPicker.js` renders pill-style "All" / "Day 1"–"Day 5" buttons.
- ✅ `ManholeMarkers.js` dims non-matching cards to 0.3 opacity when a day is selected.

### Photo Gallery Per Card ✅ DONE

Each card entry could link to photos — the physical card itself, the manhole cover in-situ, and the surrounding streetscape. Store images in `public/photos/{card-id}/` and reference them from the JSON data. Display them in an expandable lightbox or modal when a card marker is clicked.

- ✅ Each card in `manholeCards.json` now has a `photos` array (currently empty — populate with `{ "src": "/photos/{id}/photo.jpg", "caption": "..." }` objects and add images to `public/photos/{id}/`).
- ✅ `PhotoGallery.js` modal with prev/next navigation, captions, dot indicators, Escape/background-click close.
- ✅ "View Photos" button added to each marker popup in `ManholeMarkers.js`.

### Ward Heatmap / Coverage Visualisation ✅ DONE

Overlay Tokyo ward boundaries on the map and shade each ward by how many cards were collected there. Wards with no cards stay grey; wards with many cards get a deeper shade. This shows geographic coverage at a glance.

- ✅ `tokyoWards.json` with center coordinates for all 23 Tokyo special wards.
- ✅ `WardHeatmap.js` renders `CircleMarker` per ward, sized and shaded by card count, with tooltips.
- ✅ "Show/Hide Ward Heatmap" toggle button in App.js.

### Walking Stats Per Day

Extend the distance tracking to show per-day walking stats: distance walked, steps (if available), and time spent. Display as small bar charts or sparklines in the sidebar. Libraries like `recharts` could work here if added as a dependency.

### "Closest Card I Missed" Layer

Show cards that exist in the dataset but weren't collected, with a different marker style (greyed out or with an X). Optionally show how close the nearest uncollected card was to each day's route — a fun "so close yet so far" stat.

### Dark Mode / Map Style Switcher

Add a Leaflet layer control to toggle between CartoDB Light, OpenStreetMap, and a dark tile layer (e.g. CartoDB Dark Matter). A dark theme would pair well with the purple accent colour already used.

### Export / Share

Generate a shareable URL encoding the route in the URL hash (works with GitHub Pages). Also allow exporting the route as a GPX file for use in other apps — generate client-side using `Blob` + download link.

### Responsive / Mobile Layout

Currently the sidebar + map side-by-side layout doesn't work well on phones. On small viewports, make the map full-screen and move the stop list into a bottom drawer/sheet that can be swiped up.

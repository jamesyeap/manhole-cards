import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || waypoints.length < 2) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      // Core settings to make it non-interactive
      routeWhileDragging: false, // Disables dragging route
      addWaypoints: false,       // Disables adding new waypoints
      draggableWaypoints: false, // Disables dragging existing waypoints
      show: false,               // Hides the instructions panel
      
      router: L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1`,
        profile: 'foot'
      }),
      lineOptions: {
        styles: [{ color: '#6A0DAD', opacity: 0.8, weight: 5, dashArray: '10, 10' }]
      },
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: function(i, waypoint, n) {
        if (waypoint.name) {
          // Main locations are visible but not draggable
          return L.marker(waypoint.latLng, {
            draggable: false, 
          }).bindPopup(`<b>${waypoint.name}</b>`);
        }
        // "Via" points are invisible
        return false;
      }
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, waypoints]);

  return null;
};

export default RoutingMachine;

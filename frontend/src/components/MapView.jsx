import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

//  Driver icon
const driverIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:28px;filter:drop-shadow(0px 2px 4px rgba(0,0,0,0.4))">🛺</div>`,
  iconAnchor: [14, 14],
});

//  Pickup icon
const pickupIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:24px">📍</div>`,
  iconAnchor: [12, 24],
});

// Drop icon
const dropIcon = L.divIcon({
  className: "",
  html: `<div style="font-size:24px">🏁</div>`,
  iconAnchor: [12, 24],
});

// Recenter on driver
function RecenterDriver({ driverLocation }) {
  const map = useMap();
  useEffect(() => {
    if (driverLocation) {
      map.setView([driverLocation.lat, driverLocation.lng], 15);
    }
  }, [driverLocation]);
  return null;
}

function RouteLayer({ from, to }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!from || !to) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.routes && data.routes[0]) {
          // OSRM returns [lng, lat] → Leaflet needs [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setRouteCoords(coords);
        }
      } catch (err) {
        console.log("Route fetch error:", err);
      }
    };

    fetchRoute();
  }, [from?.lat, from?.lng, to?.lat, to?.lng]);

  if (routeCoords.length === 0) return null;

  return (
    <Polyline
      positions={routeCoords}
      color="#4F46E5"
      weight={4}
      opacity={0.8}
    />
  );
}

export default function MapView({ lat, lng, driverLocation, pickupLocation, dropLocation }) {
  const defaultLat = lat || 30.3165;
  const defaultLng = lng || 78.0322;

  const driverFrom = driverLocation
    ? { lat: driverLocation.lat, lng: driverLocation.lng }
    : null;

  // Pickup point
  const pickupPoint = pickupLocation
    ? { lat: pickupLocation.coordinates[1], lng: pickupLocation.coordinates[0] }
    : null;

  // Drop point
  const dropPoint = dropLocation
    ? { lat: dropLocation.coordinates[1], lng: dropLocation.coordinates[0] }
    : null;

  return (
    <MapContainer
      center={
        driverLocation
          ? [driverLocation.lat, driverLocation.lng]
          : [defaultLat, defaultLng]
      }
      zoom={15}
      className="h-full w-full"
    >
      <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; OpenStreetMap contributors'
      />
      {/* Recenter on driver */}
      <RecenterDriver driverLocation={driverLocation} />

      {/* Driver marker */}
      {driverLocation && (
        <Marker
          position={[driverLocation.lat, driverLocation.lng]}
          icon={driverIcon}
        >
          <Popup>🛺 Driver</Popup>
        </Marker>
      )}

      {/*  Pickup marker */}
      {pickupPoint && (
        <Marker position={[pickupPoint.lat, pickupPoint.lng]} icon={pickupIcon}>
          <Popup>📍 Pickup</Popup>
        </Marker>
      )}

      {/*Drop marker */}
      {dropPoint && (
        <Marker position={[dropPoint.lat, dropPoint.lng]} icon={dropIcon}>
          <Popup>🏁 Drop</Popup>
        </Marker>
      )}

  
      {lat && lng && (
        <Marker position={[lat, lng]}>
          <Popup>📌 You</Popup>
        </Marker>
      )}

      {/*  Route: Driver → Pickup */}
      {driverFrom && pickupPoint && (
        <RouteLayer from={driverFrom} to={pickupPoint} />
      )}

      {/* Route: Pickup → Drop */}
      {pickupPoint && dropPoint && (
        <RouteLayer from={pickupPoint} to={dropPoint} />
      )}

    </MapContainer>
  );
}
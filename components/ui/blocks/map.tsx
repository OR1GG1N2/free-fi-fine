'use client';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"

interface MapPoint {
  id: number;
  hotspots: string;
  location: string;
  lat: number;
  lng: number;
  user_id: string;
}

// Фиксим иконки для Leaflet
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
    iconUrl: '/leaflet/images/marker-icon.png',
    // shadowUrl: '/leaflet/images/marker-shadow.png',
  });
};

const customIcon = new L.Icon({
  iconUrl: "/Wifi-icon.svg",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
  className: "marker-icon"
});

const MapClientComponent = () => {
  const { data: session, status } = useSession()
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newHotspotName, setNewHotspotName] = useState("");
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
  const [userId, setUserId] = useState(session?.user?.id || '');

  useEffect(() => {
    fixLeafletIcons();
    
    const fetchPoints = async () => {
      try {
        const response = await fetch('/api/wifi');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        
        const formattedPoints = data.map((point: any) => {
          const [lat, lng] = point.location.split(',').map((coord: string) => parseFloat(coord.trim()));
          return {
            id: point.id,
            location: point.location,
            hotspots: point.hotspots,
            lat,
            lng,
            user_id: point.user_id
          };
        });
        
        setPoints(formattedPoints);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load points');
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => setClickedPosition([e.latlng.lat, e.latlng.lng])
    });
    return null;
  };

  const handleAddPoint = async () => {
    if (!clickedPosition || !newHotspotName || !userId) return;
    
    try {
      const response = await fetch('/api/wifi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotspots: newHotspotName,
          location: `${clickedPosition[0]}, ${clickedPosition[1]}`,
          user_id: userId
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      
      const newPoint = await response.json();
      const [lat, lng] = newPoint.location.split(',').map(parseFloat);
      
      setPoints(prev => [...prev, {
        id: newPoint.id,
        hotspots: newPoint.hotspots,
        location: newPoint.location,
        lat,
        lng,
        user_id: newPoint.user_id
      }]);
      
      setNewHotspotName("");
      setClickedPosition(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add point');
    }
  };

  const handleDeletePoint = async (id: number) => {
    try {
      const response = await fetch(`/api/wifi/${id}`, { method: 'DELETE' });
      if (response.status !== 204) throw new Error('Delete failed');
      setPoints(prev => prev.filter(point => point.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="relative">
      <MapContainer
        center={[48.3794, 31.1656]}
        zoom={6}
        style={{ height: "calc(100vh - 65px)", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
        />

        <MapClickHandler />

        {points.map((point) => (
          <Marker key={point.id} position={[point.lat, point.lng]} icon={customIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{point.hotspots}</h3>
                <p className="text-sm text-gray-600">{point.location}</p>
                {point.user_id === userId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this point?")) handleDeletePoint(point.id);
                    }}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {clickedPosition && (
        <div className="absolute top-4 left-4 z-[1000] bg-white p-4 shadow-lg rounded-md max-w-xs">
          <h3 className="font-bold text-lg mb-3">Add Hotspot</h3>
          <input
            type="text"
            placeholder="Hotspot name"
            className="w-full p-2 border rounded mb-3"
            value={newHotspotName}
            onChange={(e) => setNewHotspotName(e.target.value)}
            required
          />
          <p className="text-sm mb-3">
            Coordinates: {clickedPosition[0].toFixed(6)}, {clickedPosition[1].toFixed(6)}
          </p>
          <div className="flex gap-2">
            <button
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
              onClick={handleAddPoint}
              disabled={!newHotspotName.trim()}
            >
              Add
            </button>
            <button
              className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
              onClick={() => setClickedPosition(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapClientComponent;
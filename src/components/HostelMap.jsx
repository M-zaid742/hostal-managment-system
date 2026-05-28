import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from "react-leaflet";
const defaultCenter = { lat: 31.5204, lng: 74.3587 };

function getDistanceKm(a, b) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return earthRadiusKm * c;
}

export default function HostelMap({ hostels = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [radiusKm, setRadiusKm] = useState(5);
  const [searchError, setSearchError] = useState("");
  const [routingError, setRoutingError] = useState("");
  const [minRent, setMinRent] = useState(2000);
  const [maxRent, setMaxRent] = useState(12000);
  const [gender, setGender] = useState("all");
  const [roomType, setRoomType] = useState("all");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");

  const filteredHostels = useMemo(() => {
    return hostels.filter((hostel) => {
      const hostelPoint = { lat: Number(hostel.lat), lng: Number(hostel.lng) };
      const distanceOk = searchLocation
        ? getDistanceKm(searchLocation, hostelPoint) <= radiusKm
        : true;
      const rentOk = (hostel.min_rent ?? 0) <= maxRent && (hostel.max_rent ?? 0) >= minRent;
      const genderOk = gender === "all" || hostel.gender === gender;
      const roomTypes = hostel.room_types || [];
      const roomTypeOk = roomType === "all" || roomTypes.includes(roomType);
      const hostelFrom = hostel.available_from ? new Date(hostel.available_from) : null;
      const hostelTo = hostel.available_to ? new Date(hostel.available_to) : null;
      const fromDate = availableFrom ? new Date(availableFrom) : null;
      const toDate = availableTo ? new Date(availableTo) : null;
      const availabilityOk = (!fromDate || !hostelFrom || hostelFrom <= fromDate) &&
        (!toDate || !hostelTo || hostelTo >= toDate);

      return distanceOk && rentOk && genderOk && roomTypeOk && availabilityOk;
    });
  }, [availableFrom, availableTo, gender, hostels, maxRent, minRent, radiusKm, roomType, searchLocation]);

  const mapCenter = searchLocation || defaultCenter;

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setSearchError("");
    setRoutingError("");

    const params = new URLSearchParams({
      q: searchQuery,
      format: "json",
      limit: "1"
    });

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
      const results = await response.json();
      const first = results[0];

      if (!first) {
        setSearchError("No results found for that location.");
        return;
      }

      const location = {
        lat: Number(first.lat),
        lng: Number(first.lon)
      };

      setSearchLocation(location);
      setRouteCoords([]);
      setSelectedHostel(null);
    } catch (error) {
      setSearchError("Unable to search right now.");
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Geolocation is not supported in this browser.");
      return;
    }

    setSearchError("");
    setRoutingError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setRouteCoords([]);
        setSelectedHostel(null);
      },
      () => {
        setSearchError("Unable to access your location.");
      }
    );
  };

  const handleDirections = async (hostel) => {
    if (!searchLocation) {
      setRoutingError("Set your location first (search or click the map).");
      return;
    }
    const destination = { lat: Number(hostel.lat), lng: Number(hostel.lng) };

    try {
      setRoutingError("");
      const url = `https://router.project-osrm.org/route/v1/driving/${searchLocation.lng},${searchLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      const response = await fetch(url);
      const data = await response.json();
      const route = data.routes?.[0]?.geometry?.coordinates;

      if (!route) {
        setRoutingError("No route found for this hostel.");
        return;
      }

      const coords = route.map(([lng, lat]) => [lat, lng]);
      setRouteCoords(coords);
      setSelectedHostel(hostel);
    } catch (error) {
      setRoutingError("Unable to load directions right now.");
    }
  };

  const hasRoute = routeCoords.length > 0;

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-5">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h2 className="h5">Find Hostels</h2>
            <p className="text-muted small">Search a location and explore nearby hostels.</p>

            <label className="form-label small">Search location</label>
            <div className="input-group">
              <input
                className="form-control"
                placeholder="Search area or landmark"
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button className="btn btn-accent" type="button" onClick={handleSearch}>
                Search
              </button>
            </div>
            <button className="btn btn-outline-secondary btn-sm mt-2" type="button" onClick={handleUseMyLocation}>
              Use my location
            </button>
            {searchError && <div className="text-danger small mt-2">{searchError}</div>}

            <div className="filter-grid mt-3">
              <div>
                <label className="form-label small">Min rent (PKR)</label>
                <input
                  className="form-control"
                  type="number"
                  value={minRent}
                  onChange={(event) => setMinRent(Number(event.target.value))}
                />
              </div>
              <div>
                <label className="form-label small">Max rent (PKR)</label>
                <input
                  className="form-control"
                  type="number"
                  value={maxRent}
                  onChange={(event) => setMaxRent(Number(event.target.value))}
                />
              </div>
              <div>
                <label className="form-label small">Gender</label>
                <select className="form-select" value={gender} onChange={(event) => setGender(event.target.value)}>
                  <option value="all">All</option>
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="co-ed">Co-ed</option>
                </select>
              </div>
              <div>
                <label className="form-label small">Room type</label>
                <select className="form-select" value={roomType} onChange={(event) => setRoomType(event.target.value)}>
                  <option value="all">All</option>
                  <option value="single">Single</option>
                  <option value="shared">Shared</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className="form-label small">Available from</label>
                <input
                  className="form-control"
                  type="date"
                  value={availableFrom}
                  onChange={(event) => setAvailableFrom(event.target.value)}
                />
              </div>
              <div>
                <label className="form-label small">Available to</label>
                <input
                  className="form-control"
                  type="date"
                  value={availableTo}
                  onChange={(event) => setAvailableTo(event.target.value)}
                />
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between mt-3">
              <label className="form-label small mb-0">Radius</label>
              <span className="badge text-bg-light">{radiusKm} km</span>
            </div>
            <input
              className="form-range"
              min="1"
              max="15"
              step="1"
              type="range"
              value={radiusKm}
              onChange={(event) => setRadiusKm(Number(event.target.value))}
            />

            <div className="hostel-list mt-3">
              {filteredHostels.map((hostel) => (
                <button
                  key={hostel.id}
                  className={`hostel-item ${selectedHostel?.id === hostel.id ? "active" : ""}`}
                  type="button"
                  onClick={() => handleDirections(hostel)}
                >
                  <div>
                    <div className="fw-semibold">{hostel.name}</div>
                    <div className="text-muted small">{hostel.area} • {hostel.address}</div>
                    <div className="text-muted small">Beds available: {hostel.beds_available}</div>
                    <div className="text-muted small">
                      Rent: PKR {hostel.min_rent ?? "-"} - {hostel.max_rent ?? "-"}
                    </div>
                    <div className="text-muted small">Room types: {hostel.room_types?.join(", ")}</div>
                  </div>
                  <div className="d-flex flex-column gap-2 align-items-end">
                    <span className="badge text-bg-success">Route</span>
                    <Link className="small link-primary" to={`/hostels/${hostel.id}`} onClick={(event) => event.stopPropagation()}>
                      View details
                    </Link>
                  </div>
                </button>
              ))}

              {filteredHostels.length === 0 && (
                <div className="text-muted small">No hostels found in this radius.</div>
              )}

              {routingError && <div className="text-danger small">{routingError}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-7">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h2 className="h5 mb-0">Hostels Map</h2>
              <span className="text-muted small">Click a hostel for directions</span>
            </div>
            <div className="map-container">
              <MapContainer center={mapCenter} zoom={searchLocation ? 13 : 11} style={{ width: "100%", height: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitMapToPoints searchLocation={searchLocation} routeCoords={routeCoords} />
                <MapClickHandler onPickLocation={setSearchLocation} onClearRoute={setRouteCoords} />

                {searchLocation && (
                  <Marker position={searchLocation}>
                    <Popup>Your search location</Popup>
                  </Marker>
                )}

                {filteredHostels.map((hostel) => (
                  <Marker
                    key={hostel.id}
                    position={{ lat: Number(hostel.lat), lng: Number(hostel.lng) }}
                    eventHandlers={{
                      click: () => handleDirections(hostel)
                    }}
                  >
                    <Popup>
                      <div className="fw-semibold">{hostel.name}</div>
                      <div className="text-muted small">{hostel.address}</div>
                    </Popup>
                  </Marker>
                ))}

                {hasRoute && <Polyline positions={routeCoords} color="#1e88a8" weight={4} />}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FitMapToPoints({ searchLocation, routeCoords }) {
  const map = useMap();
  const lastViewKeyRef = useRef("");

  useEffect(() => {
    if (!searchLocation) {
      return;
    }

    const viewKey = `${searchLocation.lat.toFixed(5)}:${searchLocation.lng.toFixed(5)}:${routeCoords.length}`;

    if (lastViewKeyRef.current === viewKey) {
      return;
    }

    lastViewKeyRef.current = viewKey;

    if (routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView(searchLocation, 13);
    }
  }, [map, routeCoords, searchLocation]);

  return null;
}

function MapClickHandler({ onPickLocation, onClearRoute }) {
  useMapEvents({
    click: (event) => {
      onPickLocation({ lat: event.latlng.lat, lng: event.latlng.lng });
      onClearRoute([]);
    }
  });

  return null;
}

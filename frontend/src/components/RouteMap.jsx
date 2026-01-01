import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue with webpack - use CDN URLs
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const MapBoundsUpdater = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
};

const RouteMap = ({ cities, route, color = 'blue', title }) => {
  // Default center (Pakistan)
  const defaultCenter = [30.3753, 69.3451];
  const defaultZoom = 6;

  // Calculate bounds for the route
  const getBounds = () => {
    if (!route || route.length === 0) return null;

    const validCities = route
      .map(cityName => cities.find(c => c.name === cityName))
      .filter(c => c && c.latitude && c.longitude);

    if (validCities.length === 0) return null;

    return validCities.map(c => [c.latitude, c.longitude]);
  };

  const bounds = getBounds();

  // Get route coordinates
  const routeCoordinates = route
    ? route
        .map(cityName => cities.find(c => c.name === cityName))
        .filter(c => c && c.latitude && c.longitude)
        .map(c => [c.latitude, c.longitude])
    : [];

  // Create custom delivery truck icon SVG
  const createTruckIcon = (color) => {
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40">
        <circle cx="24" cy="24" r="22" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M18 28h2m8 0h2m-16-8h8v4h-8v-4m8 4v-4h4l2 2v4h-6v-2m-8 2v2h2v-2m8 0v2h2v-2"
              fill="white" stroke="white" stroke-width="0.5"/>
        <circle cx="19" cy="30" r="1.5" fill="white"/>
        <circle cx="29" cy="30" r="1.5" fill="white"/>
      </svg>
    `;
    return L.divIcon({
      html: svgIcon,
      className: 'custom-truck-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  // Create warehouse/pharmacy icon
  const createWarehouseIcon = (color) => {
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="35" height="35">
        <circle cx="24" cy="24" r="22" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M24 14l-8 6v10h16V20l-8-6z" fill="white"/>
        <rect x="22" y="26" width="4" height="4" fill="${color}"/>
        <path d="M18 32h12v2H18z" fill="white"/>
      </svg>
    `;
    return L.divIcon({
      html: svgIcon,
      className: 'custom-warehouse-icon',
      iconSize: [35, 35],
      iconAnchor: [17.5, 35],
      popupAnchor: [0, -35],
    });
  };

  // Icons
  const greenTruckIcon = createTruckIcon('#27ae60'); // Origin (green truck)
  const redWarehouseIcon = createWarehouseIcon('#e74c3c'); // Destination (red warehouse)
  const blueMarkerIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [20, 33],
    iconAnchor: [10, 33],
    popupAnchor: [0, -33],
    shadowSize: [33, 33],
  });

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      {title && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 50,
            zIndex: 1000,
            background: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
          }}
        >
          {title}
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bounds && <MapBoundsUpdater bounds={bounds} />}

        {/* Draw the route line */}
        {routeCoordinates.length > 1 && (
          <Polyline positions={routeCoordinates} color={color} weight={4} opacity={0.7} />
        )}

        {/* Mark cities in the route */}
        {route &&
          route.map((cityName, index) => {
            const city = cities.find(c => c.name === cityName);
            if (!city || !city.latitude || !city.longitude) return null;

            const isStart = index === 0;
            const isEnd = index === route.length - 1;

            // Choose icon based on position
            let markerIcon = blueMarkerIcon;
            let popupLabel = `Distribution Center #${index}`;

            if (isStart) {
              markerIcon = greenTruckIcon;
              popupLabel = '🚚 ORIGIN - Delivery Truck Departing';
            }
            if (isEnd) {
              markerIcon = redWarehouseIcon;
              popupLabel = '🏥 DESTINATION - Distribution Center';
            }

            return (
              <Marker
                key={`${cityName}-${index}`}
                position={[city.latitude, city.longitude]}
                icon={markerIcon}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong style={{ fontSize: '14px', color: '#0066cc' }}>{city.name}</strong>
                    <br />
                    <span style={{ fontSize: '12px', color: '#666' }}>{popupLabel}</span>
                    {city.population && (
                      <>
                        <br />
                        <span style={{ fontSize: '11px', color: '#999' }}>
                          Population: {city.population.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default RouteMap;

'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
}

interface MapViewProps {
  lat: number;
  lng: number;
  markers?: MapMarker[];
}

export default function MapView({ lat, lng, markers = [] }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      const L = await import('leaflet');
      if (!isMounted || !mapContainerRef.current) return;

      // Prevent double init
      if (mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 14);

      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Property marker (home icon)
      const homeIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width:32px;height:32px;border-radius:50%;
          background:#c04e2a;display:flex;
          align-items:center;justify-content:center;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
          border:2px solid #fff;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const homeMarker = L.marker([lat, lng], { icon: homeIcon }).addTo(map);
      homeMarker.bindPopup('<b>Your flat</b>');
      markersRef.current.push(homeMarker);

      // Recommendation markers
      markers.forEach((m) => {
        const pinIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            width:28px;height:28px;border-radius:50%;
            background:#8b9660;display:flex;
            align-items:center;justify-content:center;
            box-shadow:0 2px 6px rgba(0,0,0,0.2);
            border:2px solid #fff;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
            </svg>
          </div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        });

        const marker = L.marker([m.lat, m.lng], { icon: pinIcon }).addTo(map);
        marker.bindPopup(`<b>${m.title}</b>`);
        markersRef.current.push(marker);
      });

      // Fit bounds if there are multiple markers
      if (markers.length > 0) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.15));
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [lat, lng, markers]);

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-border bg-stone-100"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </div>
  );
}

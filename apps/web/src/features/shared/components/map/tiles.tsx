'use client';
import maplibregl from 'maplibre-gl';
import React, { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapPicker({
  lng = 106.84513,
  lat = -6.21462,
  setValue,
}: {
  lat?: number;
  lng?: number;
  setValue: (lng: number, lat: number) => void;
}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${GEOAPIFY_KEY}`,
      center: [lng, lat],
      zoom: 15,
    });

    const marker = new maplibregl.Marker({ draggable: true, anchor: 'bottom' })
      .setLngLat([lng, lat])
      .addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLngLat();
      setValue(pos.lng, pos.lat);
    });

    map.on('click', (e) => {
      const lngLat = e.lngLat;
      marker.setLngLat(lngLat);
      setValue(lngLat.lng, lngLat.lat);
    });

    map.addControl(new maplibregl.NavigationControl());
    markerRef.current = marker;
    mapRef.current = map;
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '350px' }} />;
}

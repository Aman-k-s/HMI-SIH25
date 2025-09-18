/*import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Pencil, Trash2 } from "lucide-react";

// Leaflet & Plugins
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-draw";
import "leaflet-control-geocoder";
import "leaflet-providers"; // optional

// Fix default marker icons (Leaflet)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl,
  shadowUrl: iconShadow,
});

export function MapView() {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current).setView([30.901, 75.8573], 13);

      // Base layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Feature group for drawn shapes
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // Drawing controls
      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: {
          polygon: true,
          rectangle: true,
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
      });
      map.addControl(drawControl);

      // Handle new drawings
      map.on(L.Draw.Event.CREATED, (event: any) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);
      });

      // Geocoder
      //@ts-ignore
      L.Control.geocoder({ defaultMarkGeocode: true }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleClear = () => drawnItemsRef.current?.clearLayers();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("field_mapping")}</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => alert("Use the map controls to draw polygons")}>
              <Pencil className="mr-2 h-4 w-4" />
              {t("draw")}
            </Button>
            <Button size="sm" variant="outline" onClick={handleClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          style={{ width: "100%", height: "500px", minHeight: "500px" }}
          className="rounded-lg border border-border bg-muted/20"
        />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">📍 Ludhiana, Punjab</p>
          <p className="text-xs text-muted-foreground">Use the toolbar to draw and search locations</p>
        </div>
      </CardContent>
    </Card>
  );
}
*/
/*
// src/components/MapView.tsx
import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Polygon, CircleMarker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

function MapClickHandler({ onMapClick, isDrawing }: any) {
  useMapEvents({
    click(e) {
      if (isDrawing) onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function MapTypeControl({ mapType, setMapType }: any) {
  const map = useMap();

  useState(() => {
    const CustomControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        div.style.backgroundColor = "white";
        div.style.padding = "5px 10px";
        div.style.cursor = "pointer";
        div.style.borderRadius = "5px";
        div.style.fontSize = "14px";
        div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        div.style.marginTop = "50px";

        div.innerHTML =
          mapType === "street" ? "🛰️ Satellite View" : "🌍 Street View";
        div.onclick = () => setMapType(mapType === "street" ? "satellite" : "street");
        L.DomEvent.disableClickPropagation(div);
        return div;
      },
      onRemove: function () {},
    });

    const control = new CustomControl({ position: "topleft" });
    map.addControl(control);
    return () => map.removeControl(control);
  }, [map, mapType, setMapType]);

  return null;
}

function SearchControl() {
  const map = useMap();

  useState(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoClose: true,
      keepResult: true,
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);

  return null;
}

export function MapView() {
  const [farmPolygon, setFarmPolygon] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [farmArea, setFarmArea] = useState(0);
  const [mapType, setMapType] = useState("street");

  const centerPosition = [28.6139, 77.209]; // Delhi

  const handleMapClick = (latlng: number[]) => {
    if (!isDrawing) return;
    const newPolygon = [...farmPolygon, latlng];
    setFarmPolygon(newPolygon);

    if (newPolygon.length >= 3) {
      const coords = newPolygon.map(p => [p[1], p[0]]);
      coords.push(coords[0]);
      const turfPoly = turf.polygon([coords]);
      const areaSqM = turf.area(turfPoly);
      setFarmArea(Number((areaSqM / 10000).toFixed(2)));
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setFarmPolygon([]);
    setFarmArea(0);
  };

  const undoLastPoint = () => {
    setFarmPolygon(farmPolygon.slice(0, -1));
  };

  const finishDrawing = () => {
    if (farmPolygon.length < 3) {
      alert("Please click at least 3 points to create a farm boundary!");
      return;
    }
    setIsDrawing(false);
  };

  const clearFarm = () => {
    setFarmPolygon([]);
    setIsDrawing(false);
    setFarmArea(0);
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={startDrawing} disabled={isDrawing}>Start Drawing</button>
        <button onClick={undoLastPoint} disabled={!isDrawing || farmPolygon.length === 0}>Undo Last Point</button>
        <button onClick={finishDrawing} disabled={!isDrawing || farmPolygon.length < 3}>Finish Drawing</button>
        <button onClick={clearFarm}>Clear</button>
        <span style={{ marginLeft: "20px" }}>Area: {farmArea} ha</span>
      </div>

      <MapContainer center={centerPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
        <SearchControl />
        <MapTypeControl mapType={mapType} setMapType={setMapType} />
        <TileLayer
          url={
            mapType === "street"
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          }
          attribution="Map data &copy; OpenStreetMap contributors"
        />
        <MapClickHandler onMapClick={handleMapClick} isDrawing={isDrawing} />
        {farmPolygon.map((point, i) => (
          <CircleMarker key={i} center={point} radius={5} pathOptions={{ color: "#ff5722", fillColor: "#ff5722", fillOpacity: 1 }} />
        ))}
        {farmPolygon.length >= 2 && <Polyline positions={farmPolygon} pathOptions={{ color: "#ff5722", weight: 2 }} />}
        {!isDrawing && farmPolygon.length >= 3 && <Polygon positions={farmPolygon} pathOptions={{ color: "#4caf50", fillColor: "#4caf50", fillOpacity: 0.2, weight: 2 }} />}
      </MapContainer>
    </div>
  );
}
*/


// src/components/MapView.tsx
"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker, Polyline, useMapEvents, useMap } from "react-leaflet";
import * as turf from "@turf/turf";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./MapView.css";

// MapClickHandler
function MapClickHandler({ onMapClick, isDrawing }: { onMapClick: (latlng: any) => void; isDrawing: boolean }) {
  useMapEvents({
    click(e) {
      if (isDrawing) onMapClick(e.latlng);
    },
  });
  return null;
}

// MapTypeControl
function MapTypeControl({ mapType, setMapType }: { mapType: string; setMapType: (t: string) => void }) {
  const map = useMap();
  React.useEffect(() => {
    const Control = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");
        div.style.backgroundColor = "white";
        div.style.padding = "5px 10px";
        div.style.cursor = "pointer";
        div.style.borderRadius = "5px";
        div.style.fontSize = "14px";
        div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        div.innerHTML = mapType === "street" ? "🛰️ Satellite" : "🌍 Street";
        div.onclick = () => setMapType(mapType === "street" ? "satellite" : "street");
        L.DomEvent.disableClickPropagation(div);
        return div;
      },
    });
    const control = new Control({ position: "topleft" });
    map.addControl(control);
    return () => map.removeControl(control);
  }, [map, mapType, setMapType]);
  return null;
}

// SearchControl
function SearchControl() {
  const map = useMap();
  React.useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      autoClose: true,
      keepResult: true,
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}

// Main MapView
export default function MapView() {
  const [farmPolygon, setFarmPolygon] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [farmArea, setFarmArea] = useState(0);
  const [mapType, setMapType] = useState("street");

  const centerPosition: [number, number] = [28.6139, 77.209]; // Delhi

  const demoFarm = [
    [28.6139, 77.209],
    [28.6149, 77.21],
    [28.6159, 77.209],
    [28.6149, 77.208],
  ];

  const handleMapClick = (latlng: any) => {
    if (isDrawing) {
      const newPoint = [latlng.lat, latlng.lng];
      const newPolygon = [...farmPolygon, newPoint];
      setFarmPolygon(newPolygon);

      if (newPolygon.length >= 3) {
        const coords = newPolygon.map((p) => [p[1], p[0]]);
        coords.push(coords[0]);
        setFarmArea(Number((turf.area(turf.polygon([coords])) / 10000).toFixed(2)));
      }
    }
  };

  const startDrawing = () => { setIsDrawing(true); setFarmPolygon([]); setFarmArea(0); };
  const finishDrawing = () => {
    if (farmPolygon.length >= 3) {
      setIsDrawing(false);
      const coords = farmPolygon.map((p) => [p[1], p[0]]);
      coords.push(coords[0]);
      setFarmArea(Number((turf.area(turf.polygon([coords])) / 10000).toFixed(2)));
    } else alert("Please select at least 3 points!");
  };
  const clearFarm = () => { setFarmPolygon([]); setIsDrawing(false); setFarmArea(0); };
  const undoLastPoint = () => { if (farmPolygon.length > 0) setFarmPolygon(farmPolygon.slice(0, -1)); };
  const loadDemoFarm = () => { setFarmPolygon(demoFarm); setIsDrawing(false); setFarmArea(2.5); };
  const saveFarm = () => {
    if (farmPolygon.length >= 3) {
      console.log("Farm data:", { coordinates: farmPolygon, area: farmArea, timestamp: new Date().toISOString() });
      alert(`Farm boundary saved! Area: ${farmArea} hectares`);
    } else alert("Draw a farm boundary first!");
  };

  return (
    <div className="mapview-container">
      {/* Toolbar */}
      <div className="toolbar">
        <button className="btn btn-green-700" onClick={startDrawing} disabled={isDrawing}>Start</button>
        <button className="btn btn-green-600" onClick={undoLastPoint} disabled={!isDrawing || farmPolygon.length === 0}>Undo</button>
        <button className="btn btn-green-500" onClick={finishDrawing} disabled={!isDrawing || farmPolygon.length < 3}>Finish</button>
        <button className="btn btn-green-800" onClick={clearFarm}>Clear</button>
        <button className="btn btn-green-400" onClick={loadDemoFarm}>Demo Farm</button>
        <button className="btn btn-green-900" onClick={saveFarm} disabled={farmPolygon.length < 3 || isDrawing}>Save</button>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapContainer center={centerPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
          <SearchControl />
          <MapTypeControl mapType={mapType} setMapType={setMapType} />
          <TileLayer
            url={mapType === "street" 
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"}
            attribution={mapType === "street" ? "" : "Tiles © Esri"}
          />
          <MapClickHandler onMapClick={handleMapClick} isDrawing={isDrawing} />

          {farmPolygon.map((point, idx) => (
            <CircleMarker key={idx} center={point} radius={5} pathOptions={{ color: "#fff", fillColor: isDrawing ? "#ff5722" : "#4caf50", fillOpacity: 1 }} />
          ))}

          {farmPolygon.length >= 2 && (
            <Polyline positions={farmPolygon} pathOptions={{ color: isDrawing ? "#ff5722" : "#4caf50", weight: 3, dashArray: isDrawing ? "6,6" : undefined }} />
          )}

          {!isDrawing && farmPolygon.length >= 3 && (
            <Polygon positions={farmPolygon} pathOptions={{ color: "#4caf50", fillColor: "#4caf50", fillOpacity: 0.2 }} />
          )}
        </MapContainer>
      </div>

      {/* Area Display */}
      <div className="area-display">
        {farmArea > 0 ? `Area: ${farmArea} hectares` : "No farm selected"}
      </div>

      {/* Coordinates Display */}
      {farmPolygon.length >= 3 && !isDrawing && (
        <div className="coords-display">
          <h4>Coordinates:</h4>
          <ul>
            {farmPolygon.map((point, idx) => (
              <li key={idx}>{`Lat: ${point[0].toFixed(6)}, Lng: ${point[1].toFixed(6)}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

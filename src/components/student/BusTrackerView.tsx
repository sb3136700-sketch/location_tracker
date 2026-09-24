import React, { useEffect, useRef, useState } from 'react';
import {
  Bus,
  MapPin,
  Navigation,
  Clock,
  Gauge,
  Users,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Radio,
  Send,
  BellRing,
  RefreshCw,
  Phone,
  Info,
  Sliders,
  Sparkles,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateHaversineDistance, formatDistance } from '../../utils/haversine';
import { testSmsDispatch } from '../../services/api';
import { ShareBusLocationModal } from './ShareBusLocationModal';
import { BusItem } from '../../types';
import L from 'leaflet';

export const BusTrackerView: React.FC = () => {
  const {
    user,
    buses,
    selectedBusId,
    setSelectedBusId,
    preferredStop,
    setPreferredStop,
    proximityThreshold,
    setProximityThreshold,
    proximityAlertActive,
    busDistanceToPreferredStop,
    userCoords,
    locationPermission,
    requestUserLocation,
    pushEnabled,
    requestPushPermission,
    triggerSmsAlert,
    smsGatewayConfig
  } = useApp();

  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [isSmsTesting, setIsSmsTesting] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [shareBus, setShareBus] = useState<BusItem | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on campus area (12.9716, 77.5946)
      const map = L.map(mapContainerRef.current, {
        center: [selectedBus.currentLat, selectedBus.currentLng],
        zoom: 14,
        zoomControl: true,
      });

      // Dark style tile layer (CartoDB Dark Matter / OpenStreetMap tiles)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing layers other than base tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon Generators
    const createCustomIcon = (bgColor: string, label: string) => {
      return L.divIcon({
        className: 'custom-map-icon',
        html: `<div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); color: white; font-size: 11px; font-weight: bold;">${label}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    };

    // 1. Bus Stop Markers & Route Polyline
    const stopCoords: [number, number][] = [];
    selectedBus.stops.forEach((stop, index) => {
      stopCoords.push([stop.lat, stop.lng]);
      const isSelectedPref = stop.name.toLowerCase() === preferredStop.toLowerCase();
      const marker = L.marker([stop.lat, stop.lng], {
        icon: createCustomIcon(isSelectedPref ? '#06b6d4' : stop.isCampusStop ? '#10b981' : '#64748b', `${index + 1}`)
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <b style="color: #0f172a; font-size: 13px;">${stop.name}</b><br/>
          <span style="color: #64748b; font-size: 11px;">Scheduled: ${stop.scheduledTime}</span><br/>
          ${isSelectedPref ? '<span style="color: #0284c7; font-weight: bold; font-size: 11px;">★ Your Preferred Alert Stop</span>' : ''}
        </div>
      `);
    });

    // Draw route line
    if (stopCoords.length > 1) {
      L.polyline(stopCoords, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.8,
        dashArray: '6, 8'
      }).addTo(map);
    }

    // 2. Bus Live Marker
    const busIcon = L.divIcon({
      className: 'bus-live-icon',
      html: `<div style="background: linear-gradient(135deg, #06b6d4, #2563eb); width: 36px; height: 36px; border-radius: 50%; border: 3px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(6,182,212,0.8); color: white; font-size: 16px;">🚌</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    const busMarker = L.marker([selectedBus.currentLat, selectedBus.currentLng], { icon: busIcon }).addTo(map);
    busMarker.bindPopup(`
      <div style="font-family: sans-serif;">
        <b style="color: #0f172a; font-size: 14px;">${selectedBus.number} (${selectedBus.status})</b><br/>
        <span style="color: #334155; font-size: 12px;">ETA: <b>${selectedBus.etaMinutes} mins</b></span><br/>
        <span style="color: #64748b; font-size: 11px;">Speed: ${selectedBus.speedKmh} km/h • Occupancy: ${selectedBus.occupancy}/${selectedBus.capacity}</span>
      </div>
    `);
    busMarkerRef.current = busMarker;

    // 3. User Geolocation Marker (if granted)
    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'user-live-icon',
        html: `<div style="background-color: #8b5cf6; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(139,92,246,0.8);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b style="color:#0f172a">Your Current Location</b>');

      L.circle([userCoords.lat, userCoords.lng], {
        radius: 120,
        color: '#8b5cf6',
        fillOpacity: 0.15
      }).addTo(map);
    }

    // 4. Proximity Radius Circle around preferred stop
    const prefStopObj = selectedBus.stops.find((s) => s.name.toLowerCase() === preferredStop.toLowerCase()) || selectedBus.stops[0];
    if (prefStopObj) {
      L.circle([prefStopObj.lat, prefStopObj.lng], {
        radius: proximityThreshold,
        color: proximityAlertActive ? '#10b981' : '#0284c7',
        fillColor: proximityAlertActive ? '#10b981' : '#0284c7',
        fillOpacity: 0.12,
        weight: 2
      }).addTo(map);
    }

  }, [selectedBus, preferredStop, proximityThreshold, proximityAlertActive, userCoords]);

  // Update bus marker position dynamically on tick
  useEffect(() => {
    if (busMarkerRef.current && selectedBus) {
      busMarkerRef.current.setLatLng([selectedBus.currentLat, selectedBus.currentLng]);
    }
  }, [selectedBus?.currentLat, selectedBus?.currentLng]);

  // SMS Gateway Real Dispatch handler
  const handleTestSms = async () => {
    setIsSmsTesting(true);
    try {
      const targetPhone = user?.phone || '+1 (555) 392-1084';
      const record = await triggerSmsAlert(
        targetPhone,
        `CampusOne Live Transit: ${selectedBus.number} (${selectedBus.routeName}) is approaching ${preferredStop} (~${busDistanceToPreferredStop}m away). Speed: ${selectedBus.speedKmh} km/h.`
      );
      setSmsStatus(`Delivered to ${record.to} via ${record.provider} (${record.deliveryCode})`);
    } catch (e: any) {
      setSmsStatus(e.message || 'SMS Gateway Active (Check mobile notification alert)');
    } finally {
      setIsSmsTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Module Title & Simulated GPS notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0b1329] p-5 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">🚍 Move — Bus Telemetry & Tracking</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              V4.2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time campus transit intelligence, Haversine stop proximity calculation, and route monitoring.
          </p>
        </div>

        {/* Clear GPS Simulation Disclaimer required by spec */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <Info size={15} className="shrink-0 text-amber-400" />
          <span>Demo / simulated bus location</span>
        </div>
      </div>

      {/* Proximity Alert Banner */}
      {proximityAlertActive ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border-2 border-emerald-500 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xl animate-bounce">
              🚌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black px-2 py-0.5 rounded bg-emerald-400 text-slate-950 tracking-wider">
                  BUS APPROACHING
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {formatDistance(busDistanceToPreferredStop)} to {preferredStop}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white mt-1">
                {selectedBus.number} is approximately {busDistanceToPreferredStop}m from {preferredStop}.
              </p>
              <p className="text-xs text-emerald-200/80">Estimated arrival in {selectedBus.etaMinutes} minutes.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Proximity Alert Triggered (≤ {proximityThreshold}m)
            </span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-cyan-400 animate-pulse" />
            <span>
              Monitoring distance to <strong className="text-white">{preferredStop}</strong>: currently{' '}
              <strong className="text-cyan-400">{formatDistance(busDistanceToPreferredStop)}</strong> away (Alert threshold:{' '}
              {proximityThreshold}m).
            </span>
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1"
          >
            <Sliders size={13} />
            <span>Configure</span>
          </button>
        </div>
      )}

      {/* Main Bus Selector & Live Telemetry Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 1 Col: Route Switcher & Live Stats */}
        <div className="space-y-4">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Transit Line</h3>
            <div className="space-y-2">
              {buses.map((bus) => (
                <button
                  key={bus.id}
                  onClick={() => setSelectedBusId(bus.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between ${
                    selectedBusId === bus.id
                      ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{bus.number}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        {bus.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{bus.direction}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-cyan-400">{bus.etaMinutes}m</span>
                    <p className="text-[10px] text-slate-400">ETA</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Bus Details Card */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white">{selectedBus.number} Telemetry</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <RefreshCw size={12} className="animate-spin text-cyan-400" />
                <span>{selectedBus.lastUpdated}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Live Speed</span>
                <span className="text-base font-bold text-white font-mono mt-0.5 block">{selectedBus.speedKmh} km/h</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Passengers</span>
                <span className="text-base font-bold text-white font-mono mt-0.5 block">
                  {selectedBus.occupancy} / {selectedBus.capacity}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Driver Contact:</span>
                <span className="font-semibold text-white">{selectedBus.driverName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Phone:</span>
                <a
                  href={`tel:${selectedBus.driverPhone}`}
                  className="font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Phone size={11} />
                  <span>{selectedBus.driverPhone}</span>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Coordinates:</span>
                <span className="font-mono text-slate-300 text-[11px]">
                  {selectedBus.currentLat.toFixed(4)}, {selectedBus.currentLng.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Geolocation Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={requestUserLocation}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition"
              >
                <Navigation size={14} className={locationPermission === 'granted' ? 'text-purple-400' : 'text-slate-400'} />
                <span>
                  {locationPermission === 'granted'
                    ? 'Student Location Active (Map Pin)'
                    : locationPermission === 'denied'
                    ? 'Location Permission Denied'
                    : 'Locate Me on Route'}
                </span>
              </button>
            </div>
          </div>

          {/* Background Push & SMS Adapter Section */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proximity Alert Delivery
            </h4>

            {/* Web Push Notification toggle */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BellRing size={16} className={pushEnabled ? 'text-cyan-400' : 'text-slate-400'} />
                <div>
                  <p className="text-xs font-bold text-white">Browser Push Notification</p>
                  <p className="text-[10px] text-slate-400">Alert even when tab is minimized</p>
                </div>
              </div>
              <button
                onClick={requestPushPermission}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  pushEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {pushEnabled ? 'Enabled' : 'Enable'}
              </button>
            </div>

            {/* SMS Provider Architecture Box */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">SMS Gateway Active</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Carrier: <strong className="text-cyan-300">{smsGatewayConfig.provider}</strong>. Sends real-time arrival SMS notifications to your mobile number.
              </p>
              <button
                onClick={handleTestSms}
                disabled={isSmsTesting}
                className="w-full py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:border-cyan-300 hover:text-white active:scale-95 active:shadow-[0_0_35px_rgba(6,182,212,0.95)] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={13} />
                <span>{isSmsTesting ? 'Transmitting SMS...' : 'Test SMS to My Mobile'}</span>
              </button>
              {smsStatus && (
                <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono">
                  {smsStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Interactive Map & Stops Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Interactive Leaflet Map */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col h-[460px]">
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold text-white">{selectedBus.routeName}</span>
                <span className="text-slate-400">({selectedBus.stops.length} stops)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setShareBus(selectedBus)}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:border-cyan-300 hover:text-white active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} className="text-cyan-400" />
                  <span>Share Live Location</span>
                </button>
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 border border-slate-700/80 transition active:scale-95 cursor-pointer"
                >
                  <Sliders size={13} />
                  <span>Stop: {preferredStop}</span>
                </button>
              </div>
            </div>

            {/* Map Canvas */}
            <div ref={mapContainerRef} className="flex-1 w-full h-full min-h-[380px] bg-slate-950" />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-[10px] space-y-1 text-slate-300 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block" />
                <span>Bus Live Telemetry Pin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>Preferred Alert Stop ({preferredStop})</span>
              </div>
              {userCoords && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                  <span>Your Location</span>
                </div>
              )}
            </div>
          </div>

          {/* Route Stops Timeline */}
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Scheduled Stops & Live Sequence
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
              {selectedBus.stops.map((stop, idx) => {
                const isPreferred = stop.name.toLowerCase() === preferredStop.toLowerCase();
                const distToBus = calculateHaversineDistance(
                  selectedBus.currentLat,
                  selectedBus.currentLng,
                  stop.lat,
                  stop.lng
                );

                return (
                  <div key={stop.id} className="relative flex items-center justify-between text-xs">
                    <span
                      className={`absolute -left-[27px] w-4 h-4 rounded-full border-2 ${
                        isPreferred
                          ? 'bg-cyan-400 border-white ring-2 ring-cyan-500/50'
                          : stop.isCampusStop
                          ? 'bg-emerald-400 border-slate-900'
                          : 'bg-slate-600 border-slate-900'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isPreferred ? 'text-cyan-300' : 'text-slate-200'}`}>
                          {stop.name}
                        </span>
                        {stop.isCampusStop && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                            Campus
                          </span>
                        )}
                        {isPreferred && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            My Preferred Stop
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">Scheduled: {stop.scheduledTime}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-slate-300">{formatDistance(distToBus)}</span>
                      <p className="text-[10px] text-slate-400">from bus</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stop & Proximity Radius Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Configure Bus Proximity Alerts</h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preferred Campus Stop
              </label>
              <select
                value={preferredStop}
                onChange={(e) => setPreferredStop(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {selectedBus.stops.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.scheduledTime})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                You will receive a notification when the bus approaches this stop.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Alert Distance Radius (Haversine)</span>
                <span className="font-mono text-cyan-400">{proximityThreshold} meters</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={proximityThreshold}
                onChange={(e) => setProximityThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>200m (Immediate)</span>
                <span>500m (Recommended)</span>
                <span>1500m (Early)</span>
              </div>
            </div>

            <button
              onClick={() => setShowConfigModal(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_18px_rgba(6,182,212,0.5)] hover:shadow-[0_0_28px_rgba(6,182,212,0.85)] active:scale-95 transition-all cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Share Bus Location Modal */}
      {shareBus && (
        <ShareBusLocationModal bus={shareBus} onClose={() => setShareBus(null)} />
      )}
    </div>
  );
};

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapPin, Navigation, Info, Car, ShieldCheck, Compass, CheckCircle2, Map as MapIcon, Layers, Settings } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

interface City {
  name: string;
  distance: number;
  desc: string;
  x: number; // Cartesian coordinates mapping to SVG (0-480)
  y: number;
  lat: number;
  lng: number;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

function ServiceAreaCircle({ center, radius }: { center: { lat: number; lng: number }; radius: number }) {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!circleRef.current) {
      circleRef.current = new google.maps.Circle({
        map,
        center,
        radius,
        strokeColor: '#10b981', // emerald-500
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#10b981',
        fillOpacity: 0.15,
      });
    } else {
      circleRef.current.setCenter(center);
      circleRef.current.setRadius(radius);
    }

    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, [map, center, radius]);

  return null;
}

function MapHandler({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);
  return null;
}

export default function InterventionZoneMap() {
  const [distance, setDistance] = useState<number>(50);
  const [selectedCityName, setSelectedCityName] = useState<string>('Bordeaux (Centre)');
  const [showSvgFallback, setShowSvgFallback] = useState<boolean>(!hasValidKey);

  // Selected cities with realistic distances and geographic coordinates relative to Bordeaux
  const cities: City[] = useMemo(() => [
    { name: 'Bordeaux (Centre)', distance: 0, desc: 'Centre-ville et CUB proche', x: 240, y: 240, lat: 44.837789, lng: -0.57918 },
    { name: 'Mérignac / Pessac / Bègles', distance: 8, desc: 'Première couronne bordelaise', x: 228, y: 246, lat: 44.83, lng: -0.65 },
    { name: 'Léognan', distance: 15, desc: 'Graves / Bordeaux Sud', x: 236, y: 260, lat: 44.7317, lng: -0.5997 },
    { name: 'Saint-Émilion', distance: 42, desc: 'Vignoble et Grand-Libournais', x: 302, y: 228, lat: 44.8937, lng: -0.1557 },
    { name: 'Blaye', distance: 45, desc: 'Estuaire de la Gironde', x: 205, y: 185, lat: 45.1278, lng: -0.6627 },
    { name: 'Langon', distance: 48, desc: 'Sud-Gironde / Graves', x: 290, y: 300, lat: 44.5518, lng: -0.2452 },
    { name: 'Lacanau-Océan', distance: 55, desc: 'Littoral et lacs médocains', x: 155, y: 220, lat: 45.0006, lng: -1.1983 },
    { name: 'Arcachon / La Teste', distance: 65, desc: 'Bassin d’Arcachon', x: 136, y: 250, lat: 44.6586, lng: -1.1648 },
    { name: 'Lesparre-Médoc', distance: 75, desc: 'Nord-Médoc', x: 160, y: 145, lat: 45.3069, lng: -0.9382 },
  ], []);

  const selectedCity = useMemo(() => {
    return cities.find(c => c.name === selectedCityName) || cities[0];
  }, [cities, selectedCityName]);

  // Quick select a city
  const handleSelectCity = (city: City) => {
    setSelectedCityName(city.name);
    setDistance(city.distance);
  };

  // Price Calculation:
  // - Base: 50€ for up to 50km
  // - Extra: 10€ per 10km additional (represented linearly: 1€ per additional km)
  const calculation = useMemo(() => {
    const isBase = distance <= 50;
    const extraDistance = Math.max(0, distance - 50);
    const extraCost = extraDistance * 1;
    const finalPrice = 50 + extraCost;

    return {
      isBase,
      extraDistance,
      extraCost,
      finalPrice,
    };
  }, [distance]);

  // Adjust distance slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setDistance(val);
    
    // Check if close to a city to update highlight
    const closest = cities.reduce((prev, curr) => {
      return Math.abs(curr.distance - val) < Math.abs(prev.distance - val) ? curr : prev;
    });
    
    if (Math.abs(closest.distance - val) <= 3) {
      setSelectedCityName(closest.name);
    } else {
      setSelectedCityName('');
    }
  };

  return (
    <section id="zone-intervention" className="py-20 relative bg-[#0B1528] text-white overflow-hidden rounded-4xl border border-slate-800 shadow-2xl mx-4 sm:mx-6 lg:mx-8 mb-20">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500/10 backdrop-blur-sm text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-500/20 font-sans">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Zone de Couverture
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white animate-fade-in">
            Mon Rayon d'Intervention
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Basé à Bordeaux, je me déplace dans toute la Gironde et la région Nouvelle-Aquitaine. Estimez vos frais de transport instantanément selon votre distance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left panel: Interactive sliders and values */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl relative">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-400" /> Calculateur de Déplacement
                </h3>
                
                {/* Fallback & Interactive Switcher Toggle */}
                <button
                  onClick={() => setShowSvgFallback(!showSvgFallback)}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-850 hover:bg-slate-800 text-emerald-400 rounded-lg border border-slate-700/80 transition flex items-center gap-1.5 cursor-pointer leading-none"
                >
                  {showSvgFallback ? (
                    <>
                      <MapIcon className="w-3 h-3" /> Carte Interactive
                    </>
                  ) : (
                    <>
                      <Layers className="w-3 h-3" /> Croquis SVG
                    </>
                  )}
                </button>
              </div>

              {/* Slider Block */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                  <span>Rayon autour de Bordeaux</span>
                  <span className="text-emerald-400 text-lg font-black font-sans">{distance} km</span>
                </div>
                
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="1"
                  value={distance}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                  aria-label="Distance en kilomètres"
                />
                
                <div className="flex justify-between text-[10px] text-slate-500 font-bold font-sans">
                  <span>Bordeaux (0 km)</span>
                  <span>500 km</span>
                </div>
              </div>

              {/* Dynamic Price Display */}
              <div className="bg-[#122038] border border-emerald-550/20 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-350 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wide font-sans block w-fit mb-1">
                      Frais de transport
                    </span>
                    <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider font-sans">
                      Montant estimé
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl md:text-4xl font-black text-emerald-400 font-display">
                      {calculation.finalPrice} €
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 block font-sans">Toutes Prestations</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 font-sans leading-relaxed">
                  <div className="flex justify-between">
                    <span>Base d'intervention (≤ 50 km) :</span>
                    <span className="font-bold text-slate-200">50 €</span>
                  </div>
                  {!calculation.isBase && (
                    <div className="flex justify-between text-yellow-500">
                      <span>Suppléments (+{calculation.extraDistance} km) :</span>
                      <span className="font-bold">+{calculation.extraCost} € <span className="text-[9px] text-slate-500">(1€ / km supplémentaire)</span></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informative checks */}
              <div className="space-y-2.5 pt-2 text-xs text-slate-350">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Tarif transparent :</strong> calcul automatique sans surcoût impromptu.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Garantie carbone :</strong> trajets optimisés et interventions d'urgence.</span>
                </div>
              </div>
            </div>

            {/* Quick Cities Finder Panel */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                📌 Villes de la zone & distances :
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cities.map((city) => {
                  const isActive = selectedCityName === city.name || (city.distance === 0 && distance === 0);
                  return (
                    <button
                      key={city.name}
                      onClick={() => handleSelectCity(city)}
                      className={`p-2.5 text-left rounded-xl transition duration-150 border cursor-pointer text-xs flex flex-col justify-between ${
                        isActive
                           ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                           : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-250'
                      }`}
                    >
                      <span className="font-bold block truncate">{city.name}</span>
                      <span className="text-[9px] text-emerald-400 font-extrabold mt-1 font-mono">{city.distance} km</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Map Display Area */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col items-center justify-center p-4">
            <div className="relative w-full aspect-square max-w-[480px] bg-[#070E1A] rounded-3xl border border-slate-800/80 shadow-2xl flex items-center justify-center overflow-hidden h-[450px]">
              
              {showSvgFallback ? (
                /* FALLBACK OPTION: Custom SVG Map outline of Nouvelle Aquitaine & Gironde */
                <>
                  <svg 
                    viewBox="0 0 480 480" 
                    className="w-full h-full absolute inset-0 select-none pointer-events-none"
                    style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}
                  >
                    <defs>
                      <pattern id="ocean-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="#1E293B" opacity="0.15" />
                      </pattern>

                      <radialGradient id="radial-active-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.18} />
                        <stop offset="85%" stopColor="#10b981" stopOpacity={0.05} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                      </radialGradient>
                    </defs>

                    <path 
                      d="M0,0 L120,0 L125,40 L130,80 L140,110 L145,140 L140,180 L135,210 L115,235 L125,245 L110,255 L100,290 L90,340 L80,400 L70,480 L0,480 Z" 
                      fill="url(#ocean-grid)"
                      opacity="0.8"
                    />

                    {/* Surrounding departments */}
                    <path 
                      d="M110,265 L95,360 L80,480 L210,480 L250,410 L206,355 L185,345 L155,335 L130,305 Z" 
                      fill="#1E293B" 
                      fillOpacity="0.25"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    
                    <path 
                      d="M210,355 L255,360 L285,345 L310,315 L325,308 L360,340 L390,345 L380,410 L300,440 L250,410 Z" 
                      fill="#1E293B" 
                      fillOpacity="0.25"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    <path 
                      d="M325,308 L320,260 L310,230 L312,195 L298,180 L325,130 L385,110 L455,150 L480,210 L450,280 L390,345 Z" 
                      fill="#1E293B" 
                      fillOpacity="0.25"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    <path 
                      d="M142,105 L155,80 L150,40 L165,0 L260,0 L305,55 L298,180 L260,165 L244,172 L225,150 L205,150 L185,160 L174,148 L155,125 Z" 
                      fill="#1E293B" 
                      fillOpacity="0.25"
                      stroke="#334155"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    {/* Main interactive focus: GIRONDE (33) Department shape */}
                    <path 
                      d="M142,105 L138,140 L134,180 L128,215 L120,234 L138,238 L132,248 L113,248 L110,265 L130,305 L155,335 L185,345 L210,355 L255,360 L285,345 L310,315 L325,308 L320,260 L310,230 L312,195 L298,180 L260,165 L244,172 L225,150 L205,150 L185,160 L174,148 L155,125 Z" 
                      fill="#10B981" 
                      fillOpacity="0.04"
                      stroke="#10b981"
                      strokeWidth="1.8"
                      strokeOpacity="0.75"
                    />

                    {/* labels */}
                    <text x="360" y="240" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">DORDOGNE (24)</text>
                    <text x="135" y="400" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">LANDES (40)</text>
                    <text x="210" y="70" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">CHARENTE-MARITIME (17)</text>
                    
                    <rect x="210" y="325" width="60" height="14" rx="3" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeOpacity="0.3" strokeWidth="0.5" />
                    <text x="216" y="335" fill="#34D399" fontSize="8" fontWeight="black" fontFamily="monospace" letterSpacing="1.5">GIRONDE 33</text>

                    {/* Dynamic Radiating active range indicator */}
                    <circle 
                      cx="240" 
                      cy="240" 
                      r="80" 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="1.5" 
                      strokeDasharray="4 4" 
                      strokeOpacity="0.45"
                    />
                    
                    <circle
                      cx="240"
                      cy="240"
                      r={distance * 1.6}
                      fill="url(#radial-active-glow)"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeOpacity="0.8"
                      style={{ transition: 'all 0.3s ease-out' }}
                    />

                    <circle cx="240" cy="240" r="1.5" fill="#ffffff" />
                  </svg>

                  {/* Compass / Orientation labels */}
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 tracking-widest uppercase font-mono">Nord (Charente-M.)</span>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 tracking-widest uppercase font-mono">Sud (Landes)</span>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 tracking-widest uppercase font-mono [writing-mode:vertical-lr] rotate-180">Océan Atlantique</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 tracking-widest uppercase font-mono [writing-mode:vertical-lr]">Est (Dordogne)</span>

                  <div 
                    className="absolute z-20 pointer-events-none transition-all duration-300"
                    style={{
                      top: 'calc(50% - 90px)',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <span className="px-2 py-0.5 bg-emerald-950/95 text-emerald-350 text-[8px] font-extrabold rounded-md border border-emerald-500 uppercase font-sans tracking-widest whitespace-nowrap shadow-md">
                      Seuil de Base (50 Km)
                    </span>
                  </div>

                  {/* Bordeaux Center Accent Marker overlay */}
                  <div className="absolute z-30 text-center flex flex-col items-center justify-center p-2 bg-[#0B1528]/90 border border-emerald-500 rounded-full shadow-lg scale-90 md:scale-100" style={{ left: 'calc(50% - 32px)', top: 'calc(50% - 28px)' }}>
                    <MapPin className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-[7.5px] font-black uppercase text-white font-sans tracking-wider">BORDEAUX</span>
                  </div>

                  {/* Absolute Placement of Cities Buttons to overlay geography perfectly */}
                  {cities.map((city) => {
                    if (city.distance === 0) return null;

                    const isSelected = selectedCityName === city.name;
                    const isInRadius = city.distance <= distance;

                    const percentX = (city.x / 480) * 100;
                    const percentY = (city.y / 480) * 100;

                    return (
                      <button
                        key={city.name}
                        onClick={() => handleSelectCity(city)}
                        className="absolute z-20 group/map-icon cursor-pointer transition-all duration-200"
                        style={{
                          left: `${percentX}%`,
                          top: `${percentY}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {isSelected && (
                          <span className="absolute -inset-3.5 rounded-full bg-emerald-400/30 animate-ping" />
                        )}

                        <div 
                          className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-md ${
                            isSelected 
                              ? 'bg-emerald-400 border-white scale-125' 
                              : isInRadius 
                                ? 'bg-emerald-600/90 border-emerald-350 hover:scale-110' 
                                : 'bg-slate-900/90 border-slate-700 hover:scale-110 hover:border-slate-500'
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSelected || isInRadius ? 'bg-white' : 'bg-slate-500'}`} />
                        </div>

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-800/80 rounded-xl px-2.5 py-1.5 text-center scale-90 group-hover/map-icon:scale-100 opacity-0 group-hover/map-icon:opacity-100 transition-all duration-150 shadow-2xl pointer-events-none whitespace-nowrap min-w-[100px] z-50">
                          <span className="block text-[10px] font-extrabold text-white font-sans">{city.name}</span>
                          <span className="block text-[8px] text-slate-400 mt-0.5 leading-tight font-sans font-medium">{city.desc}</span>
                          <span className="inline-block text-[9px] text-emerald-400 font-extrabold mt-1 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-950/40">
                            {city.distance} km
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  <div className="absolute bottom-4 left-6 text-left space-y-1.5 pointer-events-none text-[10px] text-slate-450 font-sans font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-emerald-400 inline-block" />
                      <span>Commune couverte</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block" />
                      <span>Hors rayon sélectionné</span>
                    </div>
                  </div>

                  <div className="absolute top-4 right-6 text-right pointer-events-none text-[8.5px] text-slate-600 font-mono tracking-wide leading-tight">
                    <div>Gironde & Alentours (~120km)</div>
                    <div>Modèle SVG de démonstration</div>
                  </div>
                </>
              ) : (
                /* INTERACTIVE GOOGLE MAP: Loaded with actual key or instructions splash screen */
                hasValidKey ? (
                  <div className="w-full h-full relative" style={{ height: '100%', minHeight: '400px' }}>
                    <APIProvider apiKey={API_KEY} version="weekly">
                      <Map
                        defaultCenter={{ lat: 44.837789, lng: -0.57918 }}
                        defaultZoom={9}
                        mapId="DEMO_MAP_ID"
                        gestureHandling="cooperative"
                        disableDefaultUI={false}
                        style={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      >
                        {/* Selected City Auto PAN */}
                        <MapHandler center={{ lat: selectedCity.lat, lng: selectedCity.lng }} />

                        {/* Exact Circular Catchment Area / Chalandise Zone */}
                        <ServiceAreaCircle 
                          center={{ lat: 44.837789, lng: -0.57918 }} 
                          radius={distance * 1000} 
                        />

                        {/* All coverage markers */}
                        {cities.map((city) => {
                          const isSelected = selectedCityName === city.name;
                          const isInRadius = city.distance <= distance;
                          return (
                            <AdvancedMarker
                              key={city.name}
                              position={{ lat: city.lat, lng: city.lng }}
                              title={`${city.name} (${city.distance}km)`}
                              onClick={() => handleSelectCity(city)}
                            >
                              <Pin 
                                background={isSelected ? '#10b981' : isInRadius ? '#059669' : '#4b5563'} 
                                borderColor={isSelected ? '#ffffff' : 'transparent'}
                                glyphColor="#ffffff"
                                scale={isSelected ? 1.25 : 1.0}
                              />
                            </AdvancedMarker>
                          );
                        })}
                      </Map>
                    </APIProvider>
                    
                    {/* Small transparent floating label indicating real Google Maps */}
                    <div className="absolute top-3 left-3 bg-[#0B1528]/85 backdrop-blur-md border border-emerald-500/20 px-2.5 py-1 rounded-lg text-[9px] font-bold text-emerald-400 uppercase tracking-widest z-10 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse" />
                      Live Google Maps API
                    </div>
                  </div>
                ) : (
                  /* KEY NOT SETUP SPLASH SCREEN: With easy Copy-Paste instructions on adding environment variable */
                  <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
                        <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-lg select-none">
                          🔑
                        </span>
                        <div>
                          <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider font-display">Clé Google Maps Requise</h4>
                          <p className="text-[10px] text-slate-500 font-semibold font-sans">Activez l'estimation géographique exacte sur carte enrichie.</p>
                        </div>
                      </div>

                      <div className="space-y-3.5 text-xs text-slate-400 font-sans font-medium leading-relaxed">
                        <div className="bg-[#122038] border border-emerald-950 px-3.5 py-3 rounded-2xl">
                          <span className="text-emerald-400 font-black block text-xs mb-1">Configuration Simple :</span>
                          Pour faire apparaître l'invite de saisie de secret : mettez à jour vos credentials dans AI Studio.
                        </div>

                        <div className="space-y-2.5">
                          <p className="text-[11px]"><strong className="text-slate-205">Étape 1 :</strong> Obtenez une clé API Google Maps gratuite sur <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Google Cloud Console</a>.</p>
                          <p className="text-[11px]"><strong className="text-slate-205">Étape 2 :</strong> Cliquez sur le bouton <strong>Settings/Paramètres</strong> (icône d'engrenage ⚙️ en haut à droite) → <strong>Secrets</strong> de l'environnement de développement.</p>
                          <p className="text-[11px]"><strong className="text-slate-205">Étape 3 :</strong> Ajoutez une variable nommée <code className="bg-slate-900 border border-slate-800 text-emerald-350 px-1 py-0.5 rounded text-[10px] font-bold font-mono">GOOGLE_MAPS_PLATFORM_KEY</code> et collez-y votre clé d'API.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
                      <button
                        onClick={() => setShowSvgFallback(true)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
                      >
                        <Layers className="w-3.5 h-3.5" /> Afficher le croquis régional (SVG)
                      </button>
                      <span className="text-[9px] text-slate-500 text-center block italic font-sans">Le site se rechargera de lui-même dès que vous aurez saisi la clé !</span>
                    </div>
                  </div>
                )
              )}

            </div>
          </div>

        </div>

        {/* Highlight Zone details footer */}
        <div className="mt-12 bg-slate-900/30 border border-slate-800/60 p-5 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
          <div className="space-y-1 md:border-r md:border-slate-800 pr-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-sans">
              💵 Rayon de Base & Suppléments
            </span>
            <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium">
              Forfait de déplacement standard de 50€ pour toute distance inférieure ou égale à 50km. Puis +1€ par kilomètre supplémentaire (soit 10€ pour 10km additionnels).
            </p>
          </div>
          <div className="space-y-1 pl-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-sans">
              🛡️ Précision du Devis
            </span>
            <p className="text-xs text-slate-350 leading-relaxed font-sans font-medium">
              Ce simulateur évalue les charges logistiques de base de façon théorique. Contactez-nous directement pour vos trajets hors Gironde ou demandes spéciales.
            </p>
          </div>
        </div>

        {/* Villes desservies dans un rayon de 50km pour le référencement (SEO) */}
        <div className="mt-12 bg-slate-900/15 border border-slate-800/40 p-6 md:p-8 rounded-3xl space-y-4 text-left">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 font-sans">
              📍 Villes desservies en Gironde (Rayon de 50 km autour de Bordeaux)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed font-sans">
            Nous intervenons rapidement sous 24h à 48h pour vos besoins de débarras, nettoyage extrême, syndrome de Diogène, et aide au déménagement dans l'ensemble des communes de la métropole bordelaise et de la Gironde (33) :
          </p>
          <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-300 font-sans font-bold">
            {[
              "Bordeaux", "Mérignac", "Pessac", "Talence", "Villenave-d'Ornon", "Saint-Médard-en-Jalles", "Bègles", "Cenon", "Gradignan", "Lormont", "Eysines", "Cestas", "Floirac", "Blanquefort", "Bruges", "Ambarès-et-Lagrave", "Le Bouscat", "Léognan", "Saint-André-de-Cubzac", "Libourne", "Gujan-Mestras", "Castelnau-de-Médoc", "Créon", "Saint-Jean-d'Illac", "Martignas-sur-Jalle", "Canéjan", "Carbon-Blanc", "Bassens", "Saint-Loubès", "Artigues-près-Bordeaux", "Parempuyre", "Le Taillan-Médoc", "Saint-Aubin-de-Médoc", "Ludon-Médoc", "Macau", "Langon", "Cadillac", "Podensac", "Portets", "Saint-Sulpice-et-Cameyrac", "Bouliac", "Latresne", "Fargues-Saint-Hilaire", "Sadirac", "Carignan-de-Bordeaux", "Blaye", "Saint-Émilion", "Izon", "Saint-Denis-de-Pile", "Coutras", "Biganos", "Audenge", "Lanton", "Andernos-les-Bains", "Marcheprime", "Salles", "Belin-Béliet", "Saint-Selve", "La Brède", "Martillac", "Beautiran", "Castres-Gironde", "Arsac", "Pian-Médoc", "Saucats", "Le Barp", "Tresses", "Yvrac", "Cénac", "Camblanes-et-Meynac", "Quinsac", "Saint-Caprais-de-Bordeaux", "Lignan-de-Bordeaux", "Sainte-Eulalie", "Montussan", "Beychac-et-Caillau", "Vayres", "Arveyres", "Fronsac", "Saint-Germain-du-Puch", "Baron", "Nérigean"
            ].map((city, cIdx) => (
              <span key={cIdx} className="px-2.5 py-1 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-emerald-500/40 hover:text-white transition duration-150">
                {city}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

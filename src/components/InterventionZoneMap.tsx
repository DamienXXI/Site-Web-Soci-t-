import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Info, Car, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

interface City {
  name: string;
  distance: number;
  desc: string;
  x: number; // Cartesian coordinates mapping to SVG (0-480)
  y: number;
}

export default function InterventionZoneMap() {
  const [distance, setDistance] = useState<number>(50);
  const [selectedCityName, setSelectedCityName] = useState<string>('Bordeaux (Centre)');

  // Selected cities with realistic distances and geographic coordinates relative to Bordeaux (240, 240)
  const cities: City[] = useMemo(() => [
    { name: 'Bordeaux (Centre)', distance: 0, desc: 'Centre-ville et CUB proche', x: 240, y: 240 },
    { name: 'Mérignac / Pessac / Bègles', distance: 8, desc: 'Première couronne bordelaise', x: 228, y: 246 },
    { name: 'St-André-de-Cubzac', distance: 28, desc: 'Haute-Gironde / Rive droite', x: 272, y: 208 },
    { name: 'Saint-Émilion', distance: 42, desc: 'Vignoble et Grand-Libournais', x: 302, y: 228 },
    { name: 'Blaye', distance: 45, desc: 'Estuaire de la Gironde', x: 205, y: 185 },
    { name: 'Langon', distance: 48, desc: 'Sud-Gironde / Graves', x: 290, y: 300 },
    { name: 'Lacanau-Océan', distance: 55, desc: 'Littoral et lacs médocains', x: 155, y: 220 },
    { name: 'Arcachon / La Teste', distance: 65, desc: 'Bassin d’Arcachon', x: 136, y: 250 },
    { name: 'Lesparre-Médoc', distance: 75, desc: 'Nord-Médoc', x: 160, y: 145 },
  ], []);

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
              <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" /> Calculateur de Déplacement
              </h3>

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
                    <div className="flex justify-between text-yellow-450">
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

          {/* Right panel: Beautiful SVG Map outline of Nouvelle Aquitaine & Gironde */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col items-center justify-center p-4">
            <div className="relative w-full aspect-square max-w-[480px] bg-[#070E1A] rounded-3xl border border-slate-800/80 shadow-2xl flex items-center justify-center overflow-hidden">
              
              {/* Main SVG Geographic drawing container */}
              <svg 
                viewBox="0 0 480 480" 
                className="w-full h-full absolute inset-0 select-none pointer-events-none"
                style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' }}
              >
                <defs>
                  {/* Oceanic Grid Pattern */}
                  <pattern id="ocean-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#1E293B" opacity="0.15" />
                  </pattern>

                  {/* Dynamic radar scanner gradient */}
                  <radialGradient id="radial-active-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                    <stop offset="85%" stopColor="#10b981" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                  </radialGradient>
                </defs>

                {/* Ocean block covering the left part of the canvas */}
                <path 
                  d="M0,0 L120,0 L125,40 L130,80 L140,110 L145,140 L140,180 L135,210 L115,235 L125,245 L110,255 L100,290 L90,340 L80,400 L70,480 L0,480 Z" 
                  fill="url(#ocean-grid)"
                  opacity="0.8"
                />

                {/* --- Surrounding departments (Nouvelle-Aquitaine background outline) --- */}

                {/* LANDES (40) - South of Gironde */}
                <path 
                  d="M110,265 L95,360 L80,480 L210,480 L250,410 L206,355 L185,345 L155,335 L130,305 Z" 
                  fill="#1E293B" 
                  fillOpacity="0.25"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                
                {/* LOT-ET-GARONNE (47) - South-East */}
                <path 
                  d="M210,355 L255,360 L285,345 L310,315 L325,308 L360,340 L390,345 L380,410 L300,440 L250,410 Z" 
                  fill="#1E293B" 
                  fillOpacity="0.25"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* DORDOGNE (24) - East */}
                <path 
                  d="M325,308 L320,260 L310,230 L312,195 L298,180 L325,130 L385,110 L455,150 L480,210 L450,280 L390,345 Z" 
                  fill="#1E293B" 
                  fillOpacity="0.25"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* CHARENTE-MARITIME (17) - North */}
                <path 
                  d="M142,105 L155,80 L150,40 L165,0 L260,0 L305,55 L298,180 L260,165 L244,172 L225,150 L205,150 L185,160 L174,148 L155,125 Z" 
                  fill="#1E293B" 
                  fillOpacity="0.25"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* --- Main interactive focus: GIRONDE (33) Department shape --- */}
                <path 
                  d="M142,105 L138,140 L134,180 L128,215 L120,234 L138,238 L132,248 L113,248 L110,265 L130,305 L155,335 L185,345 L210,355 L255,360 L285,345 L310,315 L325,308 L320,260 L310,230 L312,195 L298,180 L260,165 L244,172 L225,150 L205,150 L185,160 L174,148 L155,125 Z" 
                  fill="#10B981" 
                  fillOpacity="0.04"
                  stroke="#10b981"
                  strokeWidth="1.8"
                  strokeOpacity="0.75"
                />

                {/* Department label marks */}
                <text x="360" y="240" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">DORDOGNE (24)</text>
                <text x="135" y="400" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">LANDES (40)</text>
                <text x="210" y="70" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace" letterSpacing="1">CHARENTE-MARITIME (17)</text>
                
                {/* Highlight label for Gironde */}
                <rect x="210" y="325" width="60" height="14" rx="3" fill="#10B981" fillOpacity="0.1" stroke="#10B981" strokeOpacity="0.3" strokeWidth="0.5" />
                <text x="216" y="335" fill="#34D399" fontSize="8" fontWeight="black" fontFamily="monospace" letterSpacing="1.5">GIRONDE 33</text>

                {/* --- Dynamic Interactive Radar Layer (Centered exactly at Bordeaux 240, 240) --- */}
                
                {/* 50km Limit visual ring boundary */}
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
                


                {/* Dynamic Radiating active range indicator (Calculated using exact scale multiplier 1.6) */}
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

                {/* Tiny Bordeaux Center Core graphic */}
                <circle cx="240" cy="240" r="1.5" fill="#ffffff" />
              </svg>

              {/* Compass / Orientation labels */}
              <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-650 tracking-widest uppercase font-mono">Nord (Charente-M.)</span>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-650 tracking-widest uppercase font-mono">Sud (Landes)</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-650 tracking-widest uppercase font-mono [writing-mode:vertical-lr] rotate-180">Océan Atlantique</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-650 tracking-widest uppercase font-mono [writing-mode:vertical-lr]">Est (Dordogne)</span>

              {/* Dynamic Range limit badge at 50km */}
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

              {/* Precise Absolute Placement of Cities Buttons to overlay geography perfectly */}
              {cities.map((city) => {
                if (city.distance === 0) return null;

                const isSelected = selectedCityName === city.name;
                const isInRadius = city.distance <= distance;

                // Position calculation matching coordinates with a width/height of 480
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
                    {/* Pulsing glow if this city is selected */}
                    {isSelected && (
                      <span className="absolute -inset-3.5 rounded-full bg-emerald-400/30 animate-ping" />
                    )}

                    {/* Highly responsive geographic dot representation */}
                    <div 
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-md ${
                        isSelected 
                          ? 'bg-emerald-400 border-white scale-125 shadow-emerald-555/40' 
                          : isInRadius 
                            ? 'bg-emerald-600/90 border-emerald-350 hover:scale-110' 
                            : 'bg-slate-900/90 border-slate-700 hover:scale-110 hover:border-slate-500'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSelected || isInRadius ? 'bg-white' : 'bg-slate-500'}`} />
                    </div>

                    {/* Floating tooltips / badges */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-800/80 rounded-xl px-2.5 py-1.5 text-center scale-90 group-hover/map-icon:scale-100 opacity-0 group-hover/map-icon:opacity-100 transition-all duration-150 shadow-2xl pointer-events-none whitespace-nowrap min-w-[100px] z-50">
                      <span className="block text-[10px] font-extrabold text-white font-sans">{city.name}</span>
                      <span className="block text-[8px] text-slate-400 mt-0.5 leading-tight font-sans font-medium">{city.desc}</span>
                      <span className="inline-block text-[9px] text-emerald-450 font-extrabold mt-1 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-900/40">
                        {city.distance} km
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Bottom Legends on the graphic */}
              <div className="absolute bottom-4 left-6 text-left space-y-1.5 pointer-events-none text-[10px] text-slate-450 font-sans font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-emerald-480 inline-block" />
                  <span>Commune couverte</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 inline-block" />
                  <span>Hors rayon sélectionné</span>
                </div>
              </div>

              {/* Scale ruler watermark */}
              <div className="absolute top-4 right-6 text-right pointer-events-none text-[8.5px] text-slate-600 font-mono tracking-wide leading-tight">
                <div>Gironde & Alentours (~120km)</div>
                <div>Calcul étendu jusqu'à 500km</div>
              </div>

            </div>
          </div>

        </div>

        {/* Highlight Zone details footer */}
        <div className="mt-12 bg-slate-900/30 border border-slate-800/60 p-5 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-1 md:border-r md:border-slate-800 pr-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-sans">
              📍 Communes Desservies
            </span>
            <p className="text-xs text-slate-355 leading-relaxed font-sans font-medium">
              Bordeaux (Centre), CUB (Mérignac, Pessac, Bègles, etc.), Blaye, Saint-Émilion, St-André-de-Cubzac, Langon, Bassin d'Arcachon, Lacanau, Lesparre-Médoc.
            </p>
          </div>
          <div className="space-y-1 md:border-r md:border-slate-800 px-4">
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

      </div>
    </section>
  );
}

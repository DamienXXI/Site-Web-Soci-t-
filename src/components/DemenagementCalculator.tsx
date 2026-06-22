import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Minus,
  Plus,
  Trash2,
  Truck,
  ArrowRight,
  Calculator,
  Building,
  Info,
  Loader2
} from 'lucide-react';
import { QuoteRequest } from '../types';

interface DemenagementCalculatorProps {
  onQuoteSubmitted: (newQuote: QuoteRequest) => void;
}

export default function DemenagementCalculator({ onQuoteSubmitted }: DemenagementCalculatorProps) {
  // States
  const [demDepart, setDemDepart] = useState('');
  const [demArrivee, setDemArrivee] = useState('');
  const [demDistance, setDemDistance] = useState(0);
  const [demEtapes, setDemEtapes] = useState<string[]>([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [hasSuccessfullyCalculated, setHasSuccessfullyCalculated] = useState(false);
  const [demCartons, setDemCartons] = useState(0);
  const [demMeubles, setDemMeubles] = useState(0);
  const [demElectro, setDemElectro] = useState(0);
  const [demDivers, setDemDivers] = useState(0);
  const [demLits, setDemLits] = useState(0);
  const [demTables, setDemTables] = useState(0);
  const [demPetits, setDemPetits] = useState(0);
  const [demVelos, setDemVelos] = useState(0);
  const [demCustomItems, setDemCustomItems] = useState<{ id: string; name: string; quantity: number; m3: number; width?: string; length?: string; height?: string }[]>([]);
  
  // Custom item form states
  const [custName, setCustName] = useState('');
  const [custQty, setCustQty] = useState(1);
  const [custMode, setCustMode] = useState<'dimensions' | 'vol'>('dimensions');
  const [custLength, setCustLength] = useState('');
  const [custWidth, setCustWidth] = useState('');
  const [custHeight, setCustHeight] = useState('');
  const [custM3, setCustM3] = useState('');
  
  // Custom item validation errors
  const [custNameError, setCustNameError] = useState(false);
  const [custVolumeError, setCustVolumeError] = useState(false);
  const [custDimensionsError, setCustDimensionsError] = useState(false);
  
  // Déménagement Form states
  const [demName, setDemName] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).fullName || '' : '';
    } catch {
      return '';
    }
  });
  const [demEmail, setDemEmail] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).email || '' : '';
    } catch {
      return '';
    }
  });
  const [demPhone, setDemPhone] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).phone || '' : '';
    } catch {
      return '';
    }
  });
  const [demDate, setDemDate] = useState('');
  const [demMessage, setDemMessage] = useState('');
  const [demIsSuccess, setDemIsSuccess] = useState(false);

  // Calcul automatique du trajet à partir des adresses saisies
  useEffect(() => {
    const points = [demDepart, ...demEtapes, demArrivee]
      .map(p => p.trim())
      .filter(p => p.length >= 3);

    if (points.length < 2) {
      setHasSuccessfullyCalculated(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCalculatingRoute(true);
      setRouteError(null);
      setHasSuccessfullyCalculated(false);

      try {
        const coords: { lat: number; lon: number; name: string }[] = [];

        for (const point of points) {
          // Temporisation simple de 800ms pour respecter la politique d'usage de l'API Nominatim (1 req/sec max)
          if (coords.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }

          const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(point)}&limit=1&countrycodes=fr`;
          const res = await fetch(geocodeUrl, {
            headers: {
              'Accept-Language': 'fr'
            }
          });

          if (!res.ok) {
            throw new Error(`Erreur lors de la recherche de : ${point}`);
          }

          const data = await res.json();
          if (data && data.length > 0) {
            coords.push({
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
              name: point
            });
          }
        }

        if (coords.length < 2) {
          throw new Error("Impossible de géolocaliser suffisamment de points.");
        }

        // Tenter de calculer la distance routière via l'API publique OSRM
        try {
          const coordStr = coords.map(c => `${c.lon},${c.lat}`).join(';');
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=false`;
          
          const osrmRes = await fetch(osrmUrl);
          if (osrmRes.ok) {
            const osrmData = await osrmRes.json();
            if (osrmData && osrmData.routes && osrmData.routes[0]) {
              const meters = osrmData.routes[0].distance;
              const km = Math.round(meters / 1000);
              if (km > 0) {
                setDemDistance(km);
                setHasSuccessfullyCalculated(true);
                setIsCalculatingRoute(false);
                return;
              }
            }
          }
        } catch (osrmErr) {
          console.warn("OSRM routing failed, falling back to Haversine", osrmErr);
        }

        // Fallback robust : Calcul cumulatif par la formule Haversine
        let totalKm = 0;
        for (let i = 0; i < coords.length - 1; i++) {
          const p1 = coords[i];
          const p2 = coords[i + 1];

          const R = 6371; // Rayon moyen de la Terre en km
          const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
          const dLon = ((p2.lon - p1.lon) * Math.PI) / 180;
          const lat1 = (p1.lat * Math.PI) / 180;
          const lat2 = (p2.lat * Math.PI) / 180;

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const birdDistance = R * c;

          // Grand-cercle x coefficient routier (~1.35 en France/Europe de l'Ouest)
          totalKm += birdDistance * 1.35;
        }

        const finalKm = Math.round(totalKm);
        if (finalKm > 0) {
          setDemDistance(finalKm);
          setHasSuccessfullyCalculated(true);
        } else {
          throw new Error("Calcul de distance incorrect.");
        }
      } catch (err: any) {
        console.error("Erreur de calcul du trajet :", err);
        setRouteError("La géolocalisation automatique a échoué. Vous pouvez continuer à modifier la distance manuellement.");
      } finally {
        setIsCalculatingRoute(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [demDepart, demArrivee, JSON.stringify(demEtapes)]);

  // Math Volume calculations inside useMemo
  const totalM3Value = useMemo(() => {
    const presetM3 = (
      (demCartons * 0.1) +
      (demMeubles * 1.5) +
      (demElectro * 1.0) +
      (demDivers * 0.5) +
      (demLits * 1.2) +
      (demTables * 0.8) +
      (demPetits * 0.6) +
      (demVelos * 0.3)
    );
    const customM3 = demCustomItems.reduce((acc, item) => acc + (item.m3 * item.quantity), 0);
    return presetM3 + customM3;
  }, [demCartons, demMeubles, demElectro, demDivers, demLits, demTables, demPetits, demVelos, demCustomItems]);

  const rawManutentionPrice = useMemo(() => {
    return totalM3Value * 40;
  }, [totalM3Value]);

  const totalEstimatedPrice = useMemo(() => {
    return (demDistance * 1.00) + rawManutentionPrice;
  }, [demDistance, rawManutentionPrice]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      
      {/* Left Col - Calculateur de Trajet & Objets */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Part 1: Le Trajet */}
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <MapPin className="w-24 h-24 text-emerald-600" />
          </div>
          
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-500 text-white font-extrabold rounded-lg flex items-center justify-center text-sm font-sans">1</span>
            <span>📍 Estimation du Trajet & Étapes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ville de Départ *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={demDepart}
                  onChange={(e) => setDemDepart(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                  placeholder="ex: Bordeaux"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Ville d'Arrivée *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-emerald-500" />
                <input
                  type="text"
                  required
                  value={demArrivee}
                  onChange={(e) => setDemArrivee(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                  placeholder="ex: Paris, Mérignac..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">Distance Estimée (km) *</label>
              <div className="relative">
                <Calculator className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  required
                  value={demDistance}
                  onChange={(e) => setDemDistance(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-emerald-500 font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Add Etapes Intermédiaires */}
          <div className="mt-5 border-t border-slate-200/45 pt-4">
            <span className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider mb-2">📍 Haltes ou points logistiques intermédiaires (Optionnel) :</span>
            
            <div className="space-y-2.5">
              {demEtapes.map((etape, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-amber-500" />
                    <input
                      type="text"
                      value={etape}
                      onChange={(e) => {
                        const updated = [...demEtapes];
                        updated[idx] = e.target.value;
                        setDemEtapes(updated);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:ring-1 focus:ring-emerald-500 font-medium text-slate-800"
                      placeholder={`Ville étape ${idx + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDemEtapes(demEtapes.filter((_, i) => i !== idx));
                    }}
                    className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition text-xs font-bold"
                  >
                    Supprimer
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setDemEtapes([...demEtapes, ''])}
                className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-700 hover:text-emerald-800 uppercase tracking-wider bg-emerald-50/50 py-1.5 px-3 rounded-full border border-emerald-150 transition cursor-pointer font-sans"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>Ajouter un point de passage / chargement</span>
              </button>
            </div>
          </div>

          {/* Dynamic route calculation state indicator */}
          {isCalculatingRoute && (
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl p-3 border border-amber-200/50 animate-pulse">
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Calcul de l'itinéraire et de la distance en cours...</span>
            </div>
          )}

          {!isCalculatingRoute && hasSuccessfullyCalculated && (
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-55 rounded-xl p-3 border border-emerald-200/50">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                Itinéraire calculé automatiquement de <strong>{demDepart}</strong> à <strong>{demArrivee}</strong>
                {demEtapes.filter(e => e.trim().length > 0).length > 0 ? ` (via ${demEtapes.filter(e => e.trim().length > 0).join(', ')})` : ''} : <strong>{demDistance} km</strong>
              </span>
            </div>
          )}

          {!isCalculatingRoute && routeError && (
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-800 bg-amber-55 rounded-xl p-3 border border-amber-200/50">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{routeError}</span>
            </div>
          )}
        </div>

        {/* Part 2: Les Objets */}
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Truck className="w-24 h-24 text-teal-600" />
          </div>
          
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <span className="w-7 h-7 bg-emerald-500 text-white font-extrabold rounded-lg flex items-center justify-center text-sm font-sans">2</span>
            <span>📦 Sélection des Objets & Volume (m³)</span>
          </h3>

          <p className="text-xs text-slate-500 font-sans font-medium mb-6">
            Ajoutez les éléments prévus dans le camion pour estimer le volume d'encombrement et le temps de manutention de chargement requis.
          </p>

          {/* Preset List - 8 Objects */}
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Objets Standards</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            
            {/* Item 1: Cartons */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cartons de déménagement</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Volume : ~0.1 m³ / carton</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemCartons(Math.max(0, demCartons - 5))}
                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center font-sans"
                >
                  -5
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demCartons}</span>
                <button
                  type="button"
                  onClick={() => setDemCartons(demCartons + 5)}
                  className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center font-sans"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Item 2: Grands Meubles / Canapés */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛋️</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Grands meubles / Canapés</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Armoires, lits, tables, etc. (~1.5 m³)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemMeubles(Math.max(0, demMeubles - 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demMeubles}</span>
                <button
                  type="button"
                  onClick={() => setDemMeubles(demMeubles + 1)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item 3: Électroménagers */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Gros Électroménagers</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Lave-linges, réfrigérateurs, etc. (~1.0 m³)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemElectro(Math.max(0, demElectro - 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demElectro}</span>
                <button
                  type="button"
                  onClick={() => setDemElectro(demElectro + 1)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item 4: Lits doubles / Matelas */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛏️</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Lit Double / Matelas</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Sommier et matelas double (~1.2 m³)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemLits(Math.max(0, demLits - 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demLits}</span>
                <button
                  type="button"
                  onClick={() => setDemLits(demLits + 1)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item 5: Tables / Bureaux */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tables / Bureaux</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Tables de repas, bureaux d'études (~0.8 m³)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemTables(Math.max(0, demTables - 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demTables}</span>
                <button
                  type="button"
                  onClick={() => setDemTables(demTables + 1)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item 6: Petits meubles / Commodes */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🗄️</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Petits meubles / Fauteuils</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Commodes, chaises, tables de nuit (~0.6 m³)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemPetits(Math.max(0, demPetits - 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demPetits}</span>
                <button
                  type="button"
                  onClick={() => setDemPetits(demPetits + 1)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item 7: Vélos & Matériel Sport */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚲</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Vélos & Trottinettes</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Trottinettes pro, vélos de route (~0.3 m³)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemVelos(Math.max(0, demVelos - 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demVelos}</span>
                <button
                  type="button"
                  onClick={() => setDemVelos(demVelos + 1)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Item 8: Objets Divers */}
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-150/70 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏺</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Divers / Sacs / Lampadaires</h4>
                  <p className="text-[10px] text-slate-400 font-sans">Packs, sacs de rangement, plantes (~0.5 m³)</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDemDivers(Math.max(0, demDivers - 1))}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-display font-black text-xs text-slate-900 w-6 text-center">{demDivers}</span>
                <button
                  type="button"
                  onClick={() => setDemDivers(demDivers + 1)}
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-bold transition flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Custom Item Adder Section */}
          <div className="border-t border-slate-200/50 pt-6 mt-6 bg-slate-50/50 -mx-6 md:-mx-8 px-6 md:px-8 pb-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>📐</span>
              <span>Projet Particulier ? Ajoutez un objet sur-mesure</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium leading-normal mb-4">
              Si vous possédez un meuble rare ou hors-gabarit (piano, meuble d'angle, armoire normande...), entrez ses dimensions pour que l'algorithme estime son volume exact au centième de m³ près.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nom personnalisé de l'objet *</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => {
                    setCustName(e.target.value);
                    setCustNameError(false);
                  }}
                  placeholder="ex: Piano droit, Grand buffet, Plante XXL..."
                  className={`w-full bg-white border rounded-xl py-2 px-3 text-xs focus:ring-1 font-medium transition-colors ${
                    custNameError
                      ? 'border-[#800020] bg-[#800020]/5 focus:ring-[#800020] focus:border-[#800020] text-[#800020] placeholder-[#800020]/60'
                      : 'border-slate-200 focus:ring-emerald-500 text-slate-800'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Quantité</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustQty(Math.max(1, custQty - 1))}
                    className="w-8 h-8 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs text-slate-900 w-8 text-center">{custQty}</span>
                  <button
                    type="button"
                    onClick={() => setCustQty(custQty + 1)}
                    className="w-8 h-8 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200/40 my-3 pt-3">
              <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
                <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Mode de calcul :</span>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-705">
                  <input
                    type="radio"
                    name="custMode"
                    checked={custMode === 'dimensions'}
                    onChange={() => setCustMode('dimensions')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  Calcul par dimensions (Long. x Larg. x Haut.)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-705">
                  <input
                    type="radio"
                    name="custMode"
                    checked={custMode === 'vol'}
                    onChange={() => setCustMode('vol')}
                    className="text-emerald-500 focus:ring-emerald-500"
                  />
                  Saisie directe en m³
                </label>
              </div>

              {custMode === 'dimensions' ? (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Longueur (cm)</span>
                    <input
                      type="number"
                      min="1"
                      value={custLength}
                      onChange={(e) => {
                        setCustLength(e.target.value);
                        setCustDimensionsError(false);
                      }}
                      placeholder="ex: 120"
                      className={`w-full bg-white border rounded-xl py-1.5 px-3 text-xs focus:ring-1 text-center font-bold transition-colors ${
                        custDimensionsError
                          ? 'border-[#800020] bg-[#800020]/5 focus:ring-[#800020] focus:border-[#800020] text-[#800020] placeholder-[#800020]/60'
                          : 'border-slate-150 focus:ring-emerald-500 text-slate-850'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Largeur / Prof. (cm)</span>
                    <input
                      type="number"
                      min="1"
                      value={custWidth}
                      onChange={(e) => {
                        setCustWidth(e.target.value);
                        setCustDimensionsError(false);
                      }}
                      placeholder="ex: 60"
                      className={`w-full bg-white border rounded-xl py-1.5 px-3 text-xs focus:ring-1 text-center font-bold transition-colors ${
                        custDimensionsError
                          ? 'border-[#800020] bg-[#800020]/5 focus:ring-[#800020] focus:border-[#800020] text-[#800020] placeholder-[#800020]/60'
                          : 'border-slate-150 focus:ring-emerald-500 text-slate-855'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hauteur (cm)</span>
                    <input
                      type="number"
                      min="1"
                      value={custHeight}
                      onChange={(e) => {
                        setCustHeight(e.target.value);
                        setCustDimensionsError(false);
                      }}
                      placeholder="ex: 80"
                      className={`w-full bg-white border rounded-xl py-1.5 px-3 text-xs focus:ring-1 text-center font-bold transition-colors ${
                        custDimensionsError
                          ? 'border-[#800020] bg-[#800020]/5 focus:ring-[#800020] focus:border-[#800020] text-[#800020] placeholder-[#800020]/60'
                          : 'border-slate-150 focus:ring-emerald-500 text-slate-860'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Volume de l'objet (m³)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={custM3}
                    onChange={(e) => {
                      setCustM3(e.target.value);
                      setCustVolumeError(false);
                    }}
                    placeholder="ex: 2.5"
                    className={`w-40 bg-white border rounded-xl py-1.5 px-3 text-xs focus:ring-1 font-bold transition-colors ${
                      custVolumeError
                        ? 'border-[#800020] bg-[#800020]/5 focus:ring-[#800020] focus:border-[#800020] text-[#800020] placeholder-[#800020]/60'
                        : 'border-slate-150 focus:ring-emerald-500 text-slate-850'
                    }`}
                  />
                </div>
              )}

              {/* Live volume calculated projection */}
              {custMode === 'dimensions' && custLength && custWidth && custHeight && (
                <div className="mt-3 text-[11px] font-sans text-emerald-700 bg-emerald-50/50 py-1.5 px-3 rounded-xl inline-block border border-emerald-150/40">
                  ✨ Volume estimé : <strong>{parseFloat((((Number(custLength) || 0) * (Number(custWidth) || 0) * (Number(custHeight) || 0)) / 1000000).toFixed(3))} m³</strong> par unité.
                </div>
              )}
            </div>

            {/* Error alerts rendered in Bordeaux red */}
            {(custNameError || custDimensionsError || custVolumeError) && (
              <div className="mt-4 p-3.5 bg-[#800020]/10 border border-[#800020] rounded-xl text-[#800020] text-xs font-bold leading-relaxed space-y-1 font-sans">
                <p className="flex items-center gap-1.5 font-black text-[13px] uppercase">
                  <span>⚠️</span>
                  <span>Oubli de saisie détecté</span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 font-semibold text-[11px]">
                  {custNameError && <li>Veuillez indiquer un "Nom de l'objet" pour pouvoir l'ajouter.</li>}
                  {custDimensionsError && <li>Veuillez renseigner toutes les dimensions (Longueur, Largeur, Hauteur) de l'objet.</li>}
                  {custVolumeError && <li>Veuillez saisir un volume valide supérieur à 0 m³.</li>}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                let hasError = false;
                setCustNameError(false);
                setCustDimensionsError(false);
                setCustVolumeError(false);

                if (!custName.trim()) {
                  setCustNameError(true);
                  hasError = true;
                }

                let calcM = 0;
                if (custMode === 'dimensions') {
                  const L = parseFloat(custLength) || 0;
                  const W = parseFloat(custWidth) || 0;
                  const H = parseFloat(custHeight) || 0;
                  if (L <= 0 || W <= 0 || H <= 0) {
                    setCustDimensionsError(true);
                    hasError = true;
                  } else {
                    calcM = (L * W * H) / 1000000;
                  }
                } else {
                  calcM = parseFloat(custM3) || 0;
                  if (calcM <= 0) {
                    setCustVolumeError(true);
                    hasError = true;
                  }
                }

                if (hasError) {
                  return;
                }

                const newCustom = {
                  id: 'cust-' + Date.now(),
                  name: custName.trim(),
                  quantity: custQty,
                  m3: calcM,
                  length: custMode === 'dimensions' ? custLength : undefined,
                  width: custMode === 'dimensions' ? custWidth : undefined,
                  height: custMode === 'dimensions' ? custHeight : undefined
                };

                setDemCustomItems([...demCustomItems, newCustom]);

                // Reset forms
                setCustName('');
                setCustQty(1);
                setCustLength('');
                setCustWidth('');
                setCustHeight('');
                setCustM3('');
                
                // Reset error state
                setCustNameError(false);
                setCustDimensionsError(false);
                setCustVolumeError(false);
              }}
              className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm cursor-pointer font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter cet objet au simulateur</span>
            </button>
          </div>

          {/* Added custom items list */}
          {demCustomItems.length > 0 && (
            <div className="mt-4 space-y-2">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vos Objets Personnalisés Ajoutés :</span>
              <div className="space-y-1.5">
                {demCustomItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white border border-slate-150 rounded-xl p-3 shadow-xs text-xs">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-800">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-sans">
                        (x{item.quantity} • {parseFloat(item.m3.toFixed(3))} m³ /unité {item.length ? `[${item.length}x${item.width}x${item.height} cm]` : ''})
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-teal-600">{parseFloat((item.m3 * item.quantity).toFixed(3))} m³</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDemCustomItems(demCustomItems.filter(i => i.id !== item.id));
                        }}
                        className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-teal-50 rounded-2xl border border-teal-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2.5 text-xs">
          <div className="font-semibold text-slate-700 font-sans">
            📊 Total Volume d'Objets : <strong className="text-teal-700">{parseFloat(totalM3Value.toFixed(3))} m³</strong>
          </div>
          <div className="font-bold text-slate-800">
            Sous-total manutention : <span className="text-teal-700 font-black">{rawManutentionPrice.toFixed(2)} €</span>
          </div>
        </div>

      </div>

      {/* Right Col - Récapitulatif Devis & Form */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Receipt invoice breakdown */}
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
          
          <h3 className="font-display font-bold text-white text-base">📄 Devis Estimatif Déménagement</h3>

          <div className="space-y-4 text-xs font-medium border-b border-slate-800 pb-5">
            <div className="flex justify-between gap-1">
              <span className="text-slate-400">Trajet {demDepart} {demEtapes.filter(Boolean).length > 0 ? `[via ${demEtapes.filter(Boolean).join(', ')}]` : ''} ➔ {demArrivee}</span>
              <span className="text-emerald-400 font-display">{(demDistance * 1.00).toFixed(2)} €</span>
            </div>
            <div className="text-[10px] text-slate-500 -mt-2">
              Frais kilométriques ({demDistance} km estimatif)
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Objets & Manutention ({parseFloat(totalM3Value.toFixed(3))} m³)</span>
              <span className="text-emerald-400 font-display">{rawManutentionPrice.toFixed(2)} €</span>
            </div>
            <div className="text-[10px] text-slate-500 -mt-2">
              Chargement, immobilisation camion & sangles de protection incluses
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-300">Total Estimé TTC</span>
              <span className="text-2xl md:text-3xl font-black font-display text-emerald-400">
                {totalEstimatedPrice.toFixed(2)} €
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal text-right font-sans font-medium">Le devis final sera validé par Damien après examen logistique.</p>
          </div>
        </div>

        {/* Form to submit the moving quote request */}
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm space-y-4">
          <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider">Demander ce Devis</h4>
          
          {demIsSuccess ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3">
              <span className="text-2xl block">🎉</span>
              <h5 className="text-xs font-bold text-emerald-800">Demande Enregistrée !</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
                Votre projet de transport de <strong>{parseFloat(totalM3Value.toFixed(3))} m³</strong> de <strong>{demDepart}</strong> {demEtapes.filter(Boolean).length > 0 ? `[via ${demEtapes.filter(Boolean).join(', ')}]` : ''} à <strong>{demArrivee}</strong> a été transmis à Damien Pommier.
              </p>
              <button
                onClick={() => setDemIsSuccess(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-bold transition uppercase cursor-pointer"
              >
                Nouvelle Simulation
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                
                const emailClean = demEmail.trim();
                const phoneClean = demPhone.replace(/[\s\(\)\.-]/g, '');
                const emailIsValid = !emailClean || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean);
                const phoneIsValid = !phoneClean || /^(?:0|\+33|0033)[1-9]\d{8}$/.test(phoneClean);

                if (!demName || !demEmail || !demPhone) {
                  alert("Veuillez renseigner votre nom, e-mail et numéro de téléphone.");
                  return;
                }

                if (!emailIsValid) {
                  alert("Veuillez saisir une adresse e-mail valide (ex: jean@email.com).");
                  return;
                }

                if (!phoneIsValid) {
                  alert("Veuillez saisir un numéro de téléphone valide (ex: 06 12 34 56 78).");
                  return;
                }
                
                const customItemsStr = demCustomItems.length > 0 
                  ? ` + Objets sur-mesure: ${demCustomItems.map(i => `${i.name} (x${i.quantity}, ${parseFloat((i.m3 * i.quantity).toFixed(3))} m³)`).join(', ')}`
                  : '';
                
                const etapesStr = demEtapes.filter(Boolean).length > 0 ? ` [via ${demEtapes.filter(Boolean).join(', ')}]` : '';
                const detailText = `🚚 Projet Déménagement de ${demDepart}${etapesStr} à ${demArrivee} (${demDistance} km). ` +
                  `Volume : ${parseFloat(totalM3Value.toFixed(3))} m³ (${demCartons} cartons, ${demMeubles} meubles, ${demElectro} appareils, ${demLits} lits, ${demTables} tables, ${demPetits} petits meubles, ${demVelos} vélos, ${demDivers} divers${customItemsStr}). ` +
                  `Prix Estimé : ${totalEstimatedPrice.toFixed(2)}€ TTC. ` +
                  `Détails additionnels : ${demMessage}`;

                const newQuote: QuoteRequest = {
                  id: 'DEM-' + Math.floor(Math.random() * 900000 + 100000),
                  fullName: demName,
                  email: demEmail,
                  phone: demPhone,
                  address: `Départ: ${demDepart}${etapesStr}`,
                  zipCode: '33000',
                  city: `Arrivée: ${demArrivee}`,
                  serviceType: 'particulier',
                  estimatedVolumeM3: Number(totalM3Value.toFixed(3)),
                  selectedItems: {
                    'Cartons': demCartons,
                    'Grands Meubles': demMeubles,
                    'Électroménager': demElectro,
                    'Lits': demLits,
                    'Tables': demTables,
                    'Petits': demPetits,
                    'Velos': demVelos,
                    'Divers': demDivers,
                    ...Object.fromEntries(demCustomItems.map(i => [i.name, i.quantity]))
                  },
                  floor: 0,
                  hasElevator: true,
                  parkingDistance: 'proche',
                  additionalDetails: detailText,
                  createdAt: new Date().toISOString(),
                  status: 'pending'
                };

                onQuoteSubmitted(newQuote);
                setDemIsSuccess(true);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={demName}
                  onChange={(e) => setDemName(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 font-medium text-slate-850"
                  placeholder="ex: Jean Dupont"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={demEmail}
                    onChange={(e) => setDemEmail(e.target.value)}
                    className={`w-full bg-white border rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 font-medium text-slate-850 ${
                      demEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demEmail.trim())
                        ? 'border-red-500 bg-red-50/10 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-200/80 focus:ring-emerald-500'
                    }`}
                    placeholder="jean@email.com"
                  />
                  {demEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demEmail.trim()) && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">
                      Format e-mail invalide (ex: jean@email.com)
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={demPhone}
                    onChange={(e) => setDemPhone(e.target.value)}
                    className={`w-full bg-white border rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 font-medium text-slate-850 ${
                      demPhone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(demPhone.replace(/[\s\(\)\.-]/g, ''))
                        ? 'border-red-500 bg-red-50/10 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-200/80 focus:ring-emerald-500'
                    }`}
                    placeholder="06 61 29 20 59"
                  />
                  {demPhone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(demPhone.replace(/[\s\(\)\.-]/g, '')) && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">
                      Numéro de téléphone invalide (ex: 0612345678)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date prévue du déménagement</label>
                <input
                  type="date"
                  value={demDate}
                  onChange={(e) => setDemDate(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 font-medium font-sans text-slate-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Contraintes ou détails logistiques</label>
                <textarea
                  value={demMessage}
                  onChange={(e) => setDemMessage(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-slate-200/80 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-emerald-500 font-medium text-slate-850"
                  placeholder="ex: Présence d'un ascenseur, étages..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md shadow-emerald-500/10 cursor-pointer"
              >
                🚀 Envoyer ma demande
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface NettoyageCalculatorProps {
  onQuoteRequest: () => void;
}

export default function NettoyageCalculator({ onQuoteRequest }: NettoyageCalculatorProps) {
  const [nettoyageM2, setNettoyageM2] = useState<number>(0);
  const [nettoyageType, setNettoyageType] = useState<'appartement' | 'maison'>('appartement');
  const [nettoyageSalete, setNettoyageSalete] = useState<'propre' | 'standard' | 'tres-sale'>('standard');
  const [netOptionCave, setNetOptionCave] = useState<boolean>(false);
  const [netOptionDesinfection, setNetOptionDesinfection] = useState<boolean>(false);

  // Derived calculations
  const pricePerM2 = nettoyageType === 'appartement'
    ? (nettoyageSalete === 'propre' ? 5 : nettoyageSalete === 'standard' ? 8 : 15)
    : (nettoyageSalete === 'propre' ? 6 : nettoyageSalete === 'standard' ? 10 : 18);
  
  let totalNettoyagePrice = nettoyageM2 > 0 ? Math.round(nettoyageM2 * pricePerM2) : 0;
  if (nettoyageM2 > 0) {
    if (netOptionCave) totalNettoyagePrice += 50;
    if (netOptionDesinfection) totalNettoyagePrice += 90;
    totalNettoyagePrice = Math.max(120, totalNettoyagePrice);
  } else {
    totalNettoyagePrice = 0;
  }
  
  const estimatedNettoyageHours = nettoyageM2 > 0 ? Math.ceil(
    (nettoyageM2 * (nettoyageSalete === 'propre' ? 0.05 : nettoyageSalete === 'standard' ? 0.08 : 0.16)) + 
    (nettoyageType === 'maison' ? 1.5 : 0.5) +
    (netOptionCave ? 1.5 : 0) +
    (netOptionDesinfection ? 1.0 : 0)
  ) : 0;

  return (
    <div id="simulateur-nettoyage-inner" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      {/* Inputs block: 7/12 */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
        {/* Housing Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Type de Logement :
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setNettoyageType('appartement')}
              className={`py-3 px-4 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                nettoyageType === 'appartement'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🏢</span> Appartement
            </button>
            <button
              type="button"
              onClick={() => setNettoyageType('maison')}
              className={`py-3 px-4 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
                nettoyageType === 'maison'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🏠</span> Maison / Villa
            </button>
          </div>
        </div>

        {/* Surface area input & slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Surface Habitable :
            </label>
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
              <input
                type="number"
                min="0"
                max="400"
                value={nettoyageM2}
                onChange={(e) => setNettoyageM2(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 text-right font-black text-slate-900 bg-transparent outline-none text-xs sm:text-sm font-sans"
              />
              <span className="text-xs font-bold text-slate-500">m²</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            step="5"
            value={nettoyageM2}
            onChange={(e) => setNettoyageM2(parseInt(e.target.value) || 0)}
            className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 font-sans">
            <span>0 m²</span>
            <span>100 m²</span>
            <span>200 m²</span>
            <span>300 m²</span>
          </div>
        </div>

        {/* Level of dirtiness / saleté */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            État général & Saleté :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setNettoyageSalete('propre')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 cursor-pointer ${
                nettoyageSalete === 'propre'
                  ? 'bg-emerald-50/60 border-emerald-400 text-slate-900 shadow-sm'
                  : 'border-slate-150 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm text-emerald-800 block">✨ Logement propre</span>
              <span className="text-[10px] text-slate-500 font-sans font-semibold mt-1">
                Entretien régulier, mise au propre simple
              </span>
            </button>

            <button
              type="button"
              onClick={() => setNettoyageSalete('standard')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 cursor-pointer ${
                nettoyageSalete === 'standard'
                  ? 'bg-amber-50/60 border-amber-400 text-slate-950 shadow-sm'
                  : 'border-slate-150 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm text-amber-800 block">⚠️ Moyennement sale</span>
              <span className="text-[10px] text-slate-500 font-sans font-semibold mt-1">
                Fin de bail standard, emménagement
              </span>
            </button>

            <button
              type="button"
              onClick={() => setNettoyageSalete('tres-sale')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 cursor-pointer ${
                nettoyageSalete === 'tres-sale'
                  ? 'bg-rose-50/60 border-rose-400 text-slate-950 shadow-sm'
                  : 'border-slate-150 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm text-rose-800 block">☣️ Très sale ou encrassé</span>
              <span className="text-[10px] text-slate-500 font-sans font-semibold mt-1">
                Logement très sale, encrassé, remises en état
              </span>
            </button>
          </div>
        </div>

        {/* Extra options */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Prestations Optionnelles complémentaires :
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setNetOptionCave(!netOptionCave)}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition duration-200 cursor-pointer ${
                netOptionCave
                  ? 'bg-emerald-50/40 border-emerald-400/80 shadow-xs'
                  : 'border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">📦</span>
              <div>
                <span className="block text-xs font-extrabold text-slate-800">Cave (+50€)</span>
                <span className="text-[9px] text-slate-400 font-bold block">Sols, plafonds, recoins</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setNetOptionDesinfection(!netOptionDesinfection)}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition duration-200 cursor-pointer ${
                netOptionDesinfection
                  ? 'bg-emerald-50/40 border-emerald-400/80 shadow-xs'
                  : 'border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg">🧬</span>
              <div>
                <span className="block text-xs font-extrabold text-slate-800">Bactéricide (+90€)</span>
                <span className="text-[9px] text-slate-400 font-bold block font-sans">Désinfection agréée</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Estimation screen: 5/12 */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6 self-stretch flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono">
              Estimation Estimée
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Calculateur Actif
            </span>
          </div>

          <div className="pt-2">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest font-sans">
              Cout D'intervention estimé :
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl md:text-4xl font-black text-emerald-400 font-display">
                {totalNettoyagePrice} €
              </span>
              <span className="text-slate-400 text-xs sm:text-sm font-semibold font-sans">à {Math.round(totalNettoyagePrice * 1.15)} €</span>
              <span className="text-[10px] text-slate-500 italic font-bold">HT</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic leading-relaxed font-medium font-sans">
              *Une visite d'évaluation physique ou par photos est toujours effectuée avant validation définitive du devis.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/80 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block font-sans font-bold">⏱️ Durée estimative :</span>
              <span className="font-extrabold text-sm text-slate-100 font-mono">{estimatedNettoyageHours}h - {estimatedNettoyageHours + 2}h</span>
              <span className="text-[9px] text-slate-500 block font-sans font-semibold">de travail accompli</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-sans font-bold">🧠 Techniciens requis :</span>
              <span className="font-extrabold text-sm text-slate-100 font-mono">
                {nettoyageM2 < 70 && nettoyageSalete === 'propre' ? '1 Opérateur' : nettoyageM2 > 150 || nettoyageSalete === 'tres-sale' ? '3 Opérateurs' : '2 Opérateurs'}
              </span>
              <span className="text-[9px] text-slate-400 block font-sans font-semibold">Assureurs d'hygiène</span>
            </div>
          </div>

          {/* Included details */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest block">Inclus par défaut :</span>
            <ul className="text-[11px] text-slate-350 space-y-1.5 font-sans font-semibold">
              <li className="flex items-center gap-1.5">✓ Lessivage humide des sols</li>
              <li className="flex items-center gap-1.5">✓ Dégraissage cuisine & détartrage sanitaires</li>
              <li className="flex items-center gap-1.5">✓ Nettoyage poignées, interrupteurs</li>
              <li className="flex items-center gap-1.5">✓ Élimination des poussières volatiles</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onQuoteRequest}
          className="w-full mt-4 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2"
        >
          Demander ce devis nettoyage <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

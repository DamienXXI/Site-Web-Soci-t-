import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface PartiesCommunesCalculatorProps {
  onQuoteRequest: () => void;
}

export default function PartiesCommunesCalculator({ onQuoteRequest }: PartiesCommunesCalculatorProps) {
  const [partiesLots, setPartiesLots] = useState<number>(0);
  const [partiesFrequence, setPartiesFrequence] = useState<'hebdomadaire' | 'bi-hebdomadaire' | 'quinzomadaire' | 'mensuel'>('hebdomadaire');
  const [partiesComplexite, setPartiesComplexite] = useState<'simple' | 'standard' | 'complexe'>('standard');
  const [partiesOptionBacs, setPartiesOptionBacs] = useState<boolean>(false);
  const [partiesOptionVitres, setPartiesOptionVitres] = useState<boolean>(false);
  const [partiesOptionNettoyage, setPartiesOptionNettoyage] = useState<boolean>(false);

  // Derived calculations for Parties Communes Simulator
  const partiesBaseCostPerLot = 22; // euros / month per lot
  let partiesSizeFactor = 1.0;
  if (partiesLots <= 8) {
    partiesSizeFactor = 1.0;
  } else if (partiesLots <= 20) {
    partiesSizeFactor = 0.90;
  } else if (partiesLots <= 50) {
    partiesSizeFactor = 0.82;
  } else {
    partiesSizeFactor = 0.72;
  }

  const partiesFreqMultiplier = 
    partiesFrequence === 'hebdomadaire' ? 1.0 :
    partiesFrequence === 'bi-hebdomadaire' ? 1.85 :
    partiesFrequence === 'quinzomadaire' ? 0.55 : 0.32;

  const partiesComplexMultiplier = 
    partiesComplexite === 'simple' ? 0.85 :
    partiesComplexite === 'standard' ? 1.0 : 1.30;

  let totalPartiesPrice = partiesLots > 0 ? Math.round(partiesLots * partiesBaseCostPerLot * partiesSizeFactor * partiesFreqMultiplier * partiesComplexMultiplier) : 0;
  
  if (partiesLots > 0) {
    // Option Bacs management: 3.5€ per lot
    if (partiesOptionBacs) {
      const bacsPrice = Math.min(150, Math.max(25, partiesLots * 3.5));
      totalPartiesPrice += Math.round(bacsPrice);
    }
    
    // Option Vitres Flat fee: +45€ flat / month
    if (partiesOptionVitres) {
      totalPartiesPrice += 45;
    }

    // Option Nettoyage flat fee: +120€ / month
    if (partiesOptionNettoyage) {
      totalPartiesPrice += 120;
    }

    totalPartiesPrice = Math.max(85, totalPartiesPrice); // minimum intervention billing
  }

  return (
    <div id="simulateur-parties-communes-inner" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      {/* Inputs block: 7/12 */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-6">
        {/* Number of Lots (copropriétaires) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nombre de Lots (Appartements) :
            </label>
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
              <input
                type="number"
                min="0"
                max="200"
                value={partiesLots}
                onChange={(e) => setPartiesLots(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 text-right font-black text-slate-900 bg-transparent outline-none text-xs sm:text-sm font-sans"
              />
              <span className="text-xs font-bold text-slate-500">lots</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={partiesLots}
            onChange={(e) => setPartiesLots(parseInt(e.target.value) || 0)}
            className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="relative w-full h-5 text-[10px] font-bold text-slate-400 font-sans">
            <span className="absolute left-0">0 lot</span>
            <span className="absolute left-[20%] -translate-x-1/2 whitespace-nowrap">20 lots</span>
            <span className="absolute left-[47.92%] -translate-x-1/2 whitespace-nowrap">50 lots</span>
            <span className="absolute right-0">100 lots (Grand ensemble)</span>
          </div>
          {partiesLots >= 25 && (
            <p className="text-[10px] text-slate-700 bg-emerald-50 px-2 py-1 rounded font-medium">
              🎉 Tarif dégressif appliqué automatiquement pour copropriétés de plus de 20 lots.
            </p>
          )}
        </div>

        {/* Frequency of Interventions */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Fréquence souhaitée des passages :
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPartiesFrequence('mensuel')}
              className={`py-2.5 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition duration-200 cursor-pointer ${
                partiesFrequence === 'mensuel'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">🗓️</span> Mensuel
              <span className="text-[8px] opacity-80 uppercase">1x/Mois</span>
            </button>

            <button
              type="button"
              onClick={() => setPartiesFrequence('quinzomadaire')}
              className={`py-2.5 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition duration-200 cursor-pointer ${
                partiesFrequence === 'quinzomadaire'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">🌓</span> Bi-Mensuel
              <span className="text-[8px] opacity-80 uppercase">2x/Mois</span>
            </button>

            <button
              type="button"
              onClick={() => setPartiesFrequence('hebdomadaire')}
              className={`py-2.5 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition duration-200 cursor-pointer ${
                partiesFrequence === 'hebdomadaire'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">🌟</span> Hebdomadaire
              <span className="text-[8px] opacity-80 uppercase">1x/Semaine</span>
            </button>

            <button
              type="button"
              onClick={() => setPartiesFrequence('bi-hebdomadaire')}
              className={`py-2.5 px-2 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1 transition duration-200 cursor-pointer ${
                partiesFrequence === 'bi-hebdomadaire'
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">⚡</span> Bi-Hebdo
              <span className="text-[8px] opacity-80 uppercase">2x/Semaine</span>
            </button>
          </div>
        </div>

        {/* Complexity of the Residence */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Modèle de Résidence & Équipements :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPartiesComplexite('simple')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 cursor-pointer ${
                partiesComplexite === 'simple'
                  ? 'bg-emerald-50/60 border-emerald-400 text-slate-900 shadow-sm'
                  : 'border-slate-150 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">🪜 Simple</span>
              <span className="text-[10px] text-slate-500 font-sans font-semibold mt-1">Immeuble de ville, pas d'ascenseur</span>
            </button>

            <button
              type="button"
              onClick={() => setPartiesComplexite('standard')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 cursor-pointer ${
                partiesComplexite === 'standard'
                  ? 'bg-emerald-50/60 border-emerald-400 text-slate-900 shadow-sm'
                  : 'border-slate-150 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">🏢 Standard</span>
              <span className="text-[10px] text-slate-500 font-sans font-semibold mt-1">Ascenseur, un seul local poubelles</span>
            </button>

            <button
              type="button"
              onClick={() => setPartiesComplexite('complexe')}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition duration-200 cursor-pointer ${
                partiesComplexite === 'complexe'
                  ? 'bg-emerald-50/60 border-emerald-400 text-slate-900 shadow-sm'
                  : 'border-slate-150 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">🌲 Complexe</span>
              <span className="text-[10px] text-slate-500 font-sans font-semibold mt-1">Plusieurs allées, extérieurs vastes</span>
            </button>
          </div>
        </div>

        {/* Extras / Options */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Options & Services Optionnels :
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPartiesOptionBacs(!partiesOptionBacs)}
              className={`py-3 px-4 rounded-xl border text-left flex items-start gap-3 transition duration-200 cursor-pointer ${
                partiesOptionBacs
                  ? 'bg-emerald-50/40 border-emerald-400/80 shadow-xs'
                  : 'border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">🗑️</span>
              <div>
                <span className="block text-xs font-extrabold text-slate-800">Gestion des Bacs</span>
                <span className="text-[9px] text-slate-400 font-bold block">Sortie et rentrée règlementée des bacs</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPartiesOptionVitres(!partiesOptionVitres)}
              className={`py-3 px-4 rounded-xl border text-left flex items-start gap-3 transition duration-200 cursor-pointer ${
                partiesOptionVitres
                  ? 'bg-emerald-50/40 border-emerald-400/80 shadow-xs'
                  : 'border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">🪟</span>
              <div>
                <span className="block text-xs font-extrabold text-slate-800">Nettoyage Vitrages</span>
                <span className="text-[9px] text-slate-400 font-bold block">Lavage périodique des glaces & miroirs</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPartiesOptionNettoyage(!partiesOptionNettoyage)}
              className={`py-3 px-4 rounded-xl border text-left flex items-start gap-3 transition duration-200 cursor-pointer ${
                partiesOptionNettoyage
                  ? 'bg-emerald-50/40 border-emerald-400/80 shadow-xs'
                  : 'border-slate-150 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">🧼</span>
              <div>
                <span className="block text-xs font-extrabold text-slate-800 font-sans">Option Nettoyage (+120€)</span>
                <span className="text-[9px] text-slate-400 font-bold block font-sans">Lavage haute-pression extérieur, locaux vélos & poubelles</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Estimate Right Bar: 5/12 */}
      <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6 self-stretch flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono font-sans">
              Mensualité Estimée
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Calculateur Actif
            </span>
          </div>

          <div className="pt-2">
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest font-sans">
              Budget mensuel estimé :
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl md:text-4xl font-black text-emerald-400 font-display">
                {totalPartiesPrice} €
              </span>
              <span className="text-slate-350 text-xs sm:text-sm font-semibold font-sans">/ mois</span>
              <span className="text-[10px] text-slate-500 italic font-bold">HT</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic leading-relaxed font-semibold">
              Soit environ <strong className="text-slate-200">{(totalPartiesPrice / partiesLots).toFixed(1)} €</strong> par lot/mois pour chaque copropriétaire.
            </p>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/80 text-xs font-sans font-semibold">
            <div className="space-y-1">
              <span className="text-slate-400 block font-bold">🧹 Nb Interventions :</span>
              <span className="font-extrabold text-sm text-slate-100">
                {partiesFrequence === 'hebdomadaire' ? '4 passages / mois' : partiesFrequence === 'bi-hebdomadaire' ? '8 passages / mois' : partiesFrequence === 'quinzomadaire' ? '2 passages / mois' : '1 passage / mois'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block font-bold">⏱️ Contrôle Qualité :</span>
              <span className="font-extrabold text-sm text-emerald-400 font-mono">Carnet Émargé</span>
              <span className="text-[9px] text-slate-550 block font-sans">Fiche visible au hall</span>
            </div>
          </div>

          {/* Included tasks */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest block">Inclus dans la formule :</span>
            <ul className="text-[11px] text-slate-350 space-y-1.5 font-sans font-semibold mb-2">
              <li className="flex items-center gap-1.5">✓ Balayage & lavage du hall d'entrée</li>
              <li className="flex items-center gap-1.5">✓ Aspiration + lessivage de l'escalier</li>
              <li className="flex items-center gap-1.5">✓ Vidage des corbeilles à prospectus</li>
              <li className="flex items-center gap-1.5">✓ Désinfection des points de contact sensibles</li>
              {partiesOptionBacs && <li className="flex items-center gap-1.5 text-emerald-350">✓ Sortie/Rentrée hebdomadaire des bacs roulants</li>}
              {partiesOptionVitres && <li className="flex items-center gap-1.5 text-emerald-350">✓ Entretien poussé de la verrerie et des glaces d'accès</li>}
              {partiesOptionNettoyage && <li className="flex items-center gap-1.5 text-emerald-350 font-sans font-semibold">✓ Lavage haute-pression extérieur, locaux vélos & poubelles</li>}
            </ul>
          </div>
        </div>

        <button
          onClick={onQuoteRequest}
          className="w-full mt-4 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2"
        >
          Obtenir ce devis copropriété <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

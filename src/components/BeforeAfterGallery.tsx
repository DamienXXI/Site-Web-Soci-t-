import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeftRight, HelpCircle } from 'lucide-react';

// Use generated local images for the débarras scenario
// @ts-ignore
import debarrasBefore from '../assets/images/declutter_before_1782245814061.jpg';
// @ts-ignore
import debarrasAfter from '../assets/images/declutter_after_1782245828566.jpg';
// @ts-ignore
import corridorBefore from '../assets/images/corridor_before_1782318216523.jpg';
// @ts-ignore
import corridorAfter from '../assets/images/corridor_after_1782318229953.jpg';
// @ts-ignore
import technicalBefore from '../assets/images/technical_before_1782318243324.jpg';
// @ts-ignore
import technicalAfter from '../assets/images/technical_after_1782318255141.jpg';

interface Scenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  category: 'debarras' | 'nettoyage' | 'demenagement';
  disabled?: boolean;
  statusText?: string;
}

const scenarios: Scenario[] = [
  {
    id: 'corridor',
    badge: '🚪 Encombrants Couloir',
    title: "Débarras d'Encombrants de Copropriété",
    description: "Évacuation rapide d'encombrants, cartons de mobilier volumineux et emballages abandonnés encombrant les passages dans les couloirs d'immeubles ou de résidences.",
    beforeImg: corridorBefore,
    afterImg: corridorAfter,
    category: 'debarras'
  },
  {
    id: 'technical',
    badge: '⚙️ Placard Technique',
    title: 'Nettoyage de Gaine & Placard Technique',
    description: "Retrait sécurisé d'archives humides, cartons usagés, vieux textiles accumulés et détritus stockés illégalement dans un placard de compteurs d'immeuble.",
    beforeImg: technicalBefore,
    afterImg: technicalAfter,
    category: 'debarras'
  },
  {
    id: 'debarras',
    badge: '📦 Cave & Garage',
    title: 'Débarras de Cave & Garage',
    description: "Enlèvement complet des encombrants, tri méticuleux pour don et recyclage, suivi d'un balayage soigné.",
    beforeImg: debarrasBefore,
    afterImg: debarrasAfter,
    category: 'debarras'
  },
  {
    id: 'demenagement',
    badge: '🚚 Déménagement',
    title: 'Aide au Déménagement & Transport de Volumes',
    description: "Aide efficace au chargement, transport de vos meubles ou cartons de déménagement en Gironde, et libération rapide de vos anciens locaux.",
    beforeImg: 'https://images.unsplash.com/photo-1600513524458-297ba52937ae?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
    category: 'demenagement'
  },
  {
    id: 'nettoyage',
    badge: '🧼 Diogène / Extrême',
    title: 'Nettoyage Après Sinistre / Diogène',
    description: 'Remise au propre intégrale, lessivage des murs, désinfection et élimination totale des odeurs persistantes.',
    beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
    category: 'nettoyage',
    disabled: true,
    statusText: 'Bientôt'
  },
  {
    id: 'parties_communes',
    badge: '🧹 Parties Communes',
    title: 'Entretien des Halls & Escaliers',
    description: 'Lavage haute performance des dalles, dépoussiérage des rampes et désinfection des locaux poubelles.',
    beforeImg: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800',
    afterImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    category: 'nettoyage',
    disabled: true,
    statusText: 'Bientôt'
  }
];

export default function BeforeAfterGallery() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'debarras' | 'nettoyage' | 'avant_apres'>('all');
  const [activeTab, setActiveTab] = useState<string>('corridor');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered scenarios based on filter selection
  const filteredScenarios = scenarios.filter(s => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'debarras') return s.category === 'debarras';
    if (selectedFilter === 'nettoyage') return s.category === 'nettoyage';
    if (selectedFilter === 'avant_apres') return !s.disabled; // Only those with active before/after
    return true;
  });

  const currentScenario = scenarios.find((s) => s.id === activeTab) || scenarios[0];

  // Auto-switch active tab if filtered out
  useEffect(() => {
    if (filteredScenarios.length > 0 && !filteredScenarios.some(s => s.id === activeTab)) {
      // Find first non-disabled or first available
      const firstAvailable = filteredScenarios.find(s => !s.disabled) || filteredScenarios[0];
      setActiveTab(firstAvailable.id);
    }
  }, [selectedFilter, activeTab]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Reset slider position on tab change
  useEffect(() => {
    setSliderPosition(50);
  }, [activeTab]);

  return (
    <section className="py-20 bg-white border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-10">
          <span className="inline-block px-3.5 py-1.5 bg-emerald-50 border border-emerald-100/60 text-emerald-800 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider mb-2 font-sans">
            Preuves d'Excellence
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
            Réalisations Avant / Après
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 font-semibold font-sans">
            Faites glisser la poignée centrale pour révéler en temps réel l'impact du travail soigné de Damien.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 border-b border-slate-100 pb-6 max-w-2xl mx-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 w-full text-center mb-1">Filtrer par type de prestation :</span>
          {[
            { id: 'all', label: '✨ Tous' },
            { id: 'debarras', label: '📦 Débarras' },
            { id: 'nettoyage', label: '🧼 Nettoyage' },
            { id: 'avant_apres', label: '🔄 Avant / Après' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedFilter === filter.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {filteredScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                if (!s.disabled) {
                  setActiveTab(s.id);
                }
              }}
              className={`px-4.5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 border flex items-center gap-2 ${
                s.disabled
                  ? 'bg-slate-50 text-slate-350 border-slate-150 cursor-not-allowed opacity-50'
                  : activeTab === s.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10 scale-[1.02] cursor-pointer'
                  : 'bg-white text-slate-600 border-slate-150 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
              }`}
            >
              <span>{s.badge}</span>
              {s.disabled && (
                <span className="px-1.5 py-0.5 text-[8px] bg-slate-200 text-slate-500 rounded font-bold">
                  {s.statusText || 'Bientôt'}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Interactive Slider Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Explanation Text */}
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
            <h3 className="text-xl md:text-2xl font-black font-display text-slate-900 leading-tight">
              {currentScenario.title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans font-medium">
              {currentScenario.description}
            </p>
          </div>

          {/* Before / After Slider Stage */}
          <div className="lg:col-span-8">
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-2xl select-none cursor-ew-resize bg-slate-100"
            >
              {/* After Image (Background) */}
              <img 
                src={currentScenario.afterImg} 
                alt="Après intervention" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 right-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md z-10 font-sans border border-emerald-500">
                APRÈS
              </span>

              {/* Before Image (Foreground, Clipped) */}
              <div 
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={currentScenario.beforeImg} 
                  alt="Avant intervention" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ width: containerRef.current?.getBoundingClientRect().width }}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 left-4 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md z-10 font-sans border border-rose-500">
                  AVANT
                </span>
              </div>

              {/* Center Slider Bar / Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl z-20 pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Center Handle Button */}
                <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl border-4 border-white cursor-ew-resize hover:scale-110 active:scale-95 transition-transform z-30">
                  <ArrowLeftRight className="w-4 h-4 shrink-0" />
                </div>
              </div>

              {/* Subtle hover instructions */}
              <div className="absolute top-4 left-[50%] -translate-x-[50%] bg-slate-900/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest py-1 px-3.5 rounded-full pointer-events-none animate-pulse text-center font-sans">
                Faites glisser pour comparer
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

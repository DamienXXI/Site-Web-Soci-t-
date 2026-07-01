import React, { useState } from 'react';
import { MapPin, FolderOpen, HeartHandshake, FileCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface SitemapTextuelProps {
  setCurrentPage: (page: string) => void;
  setActiveModal: (modal: string | null) => void;
}

export default function SitemapTextuel({ setCurrentPage, setActiveModal }: SitemapTextuelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleAnchorClick = (page: string, elementId?: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    if (elementId) {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const sections = [
    {
      title: "Plan du Site",
      icon: <FolderOpen className="w-4 h-4 text-emerald-500" />,
      links: [
        { label: "Accueil / Présentation", action: () => handleAnchorClick('accueil') },
        { label: "Enlèvement d'Encombrants & Débarras", action: () => handleAnchorClick('enlevements') },
        { label: "Service de Déménagement & Transport", action: () => handleAnchorClick('demenagement') },
        { label: "Interventions Avant / Après (Galerie)", action: () => handleAnchorClick('galerie'), disabled: true },
        { label: "Calculateur de Volume m³", action: () => handleAnchorClick('accueil', 'calculateur-volume') },
        { label: "Foire Aux Questions (FAQ)", action: () => handleAnchorClick('accueil', 'faq') },
        { label: "Conseils de Débarras & Tri", action: () => handleAnchorClick('accueil', 'conseils-debarras') },
        { label: "Demander un Devis Gratuit", action: () => setActiveModal('estimation') }
      ]
    },
    {
      title: "Nos Services Débarras",
      icon: <HeartHandshake className="w-4 h-4 text-emerald-500" />,
      links: [
        { label: "Débarras de Maison complet", action: () => handleAnchorClick('enlevements') },
        { label: "Vide Maison & Succession", action: () => handleAnchorClick('enlevements') },
        { label: "Débarras d'Appartement à l'étage", action: () => handleAnchorClick('enlevements') },
        { label: "Nettoyage de Cave, Garage & Box", action: () => handleAnchorClick('enlevements') },
        { label: "Enlèvement d'Encombrants Volumineux", action: () => handleAnchorClick('enlevements') },
        { label: "Débarras Syndrome de Diogène (Insalubre)", action: () => handleAnchorClick('enlevements') },
        { label: "Tri éco-responsable & Dons caritatifs", action: () => handleAnchorClick('enlevements') },
        { label: "Nettoyage après sinistre", action: () => handleAnchorClick('enlevements') }
      ]
    },
    {
      title: "Villes Clés (Gironde 33)",
      icon: <MapPin className="w-4 h-4 text-emerald-500" />,
      links: [
        { label: "Débarras Bordeaux (33000)", action: () => handleAnchorClick('accueil', 'rayon-intervention') },
        { label: "Débarras Mérignac (33700)", action: () => handleAnchorClick('accueil', 'rayon-intervention') },
        { label: "Débarras Pessac (33600)", action: () => handleAnchorClick('accueil', 'rayon-intervention') },
        { label: "Débarras Talence (33400)", action: () => handleAnchorClick('accueil', 'rayon-intervention') },
        { label: "Débarras Villenave-d'Ornon (33140)", action: () => handleAnchorClick('accueil', 'rayon-intervention') },
        { label: "Débarras Bègles (33130)", action: () => handleAnchorClick('accueil', 'rayon-intervention') },
        { label: "Débarras Libourne (33500)", action: () => handleAnchorClick('accueil', 'rayon-intervention') },
        { label: "Débarras Cestas (33610)", action: () => handleAnchorClick('accueil', 'rayon-intervention') }
      ]
    },
    {
      title: "Ressources & Légal",
      icon: <FileCheck className="w-4 h-4 text-emerald-500" />,
      links: [
        { label: "Comment vider une maison en 5 étapes", action: () => handleAnchorClick('accueil', 'conseils-debarras') },
        { label: "Guide complet sur le débarras de succession", action: () => handleAnchorClick('accueil', 'conseils-debarras') },
        { label: "Où vont les anciens objets en Gironde ?", action: () => handleAnchorClick('accueil', 'conseils-debarras') },
        { label: "Filière éco-responsable & recyclage", action: () => handleAnchorClick('accueil', 'conseils-debarras') },
        { label: "Mentions Légales & SIRET", action: () => setActiveModal('legals') },
        { label: "Assurances Professionnelles AXA & ACB", action: () => setActiveModal('legals') },
        { label: "Contact direct par Téléphone", action: () => window.open('tel:0661292059', '_self') },
        { label: "Devis WhatsApp Direct sous 24h", action: () => window.open('https://wa.me/33661292059', '_blank') }
      ]
    }
  ];

  return (
    <div className="bg-slate-900 border-t border-slate-800/80 text-slate-400 font-sans">
      
      {/* Small bar visible to the user by default */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Plan du Site & Référencement Local (Gironde)
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
        >
          <span>{isOpen ? "Masquer le plan du site" : "Afficher le plan du site"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible content (always rendered but visual display toggled so Google can still crawl links) */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isOpen ? "py-10 opacity-100 block" : "h-0 overflow-hidden opacity-0 pointer-events-none hidden"}`}>
        
        {/* Header section with branding & SEO context */}
        <div className="mb-10 pb-8 border-b border-slate-800/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Sitemap & Index Référencement Gironde (33)
            </h3>
            <p className="text-[11px] text-slate-500 font-medium max-w-2xl mt-1.5">
              Accédez directement à l'ensemble de nos services d'enlèvement d'encombrants, débarras de maison, appartement, cave et aide au déménagement. AlloServices33 dessert l'agglomération bordelaise et la Gironde sous 24/48h.
            </p>
          </div>
          <div className="text-[10px] text-slate-550 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80 w-fit">
            RCS Bordeaux • SIRET 990 183 394 00016
          </div>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-4">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-slate-800/40">
                {section.icon}
                <span>{section.title}</span>
              </h4>
              <ul className="space-y-2 text-[11px] font-semibold text-slate-400">
                {section.links.map((link, lIdx) => {
                  const isLinkDisabled = 'disabled' in link && link.disabled;
                  return (
                    <li key={lIdx}>
                      <button
                        onClick={isLinkDisabled ? undefined : link.action}
                        disabled={isLinkDisabled}
                        className={`transition text-left focus:outline-none flex items-center gap-1 group ${
                          isLinkDisabled 
                            ? 'text-slate-600 cursor-not-allowed select-none opacity-50' 
                            : 'hover:text-emerald-400 cursor-pointer'
                        }`}
                      >
                        <span className={`transition-transform ${isLinkDisabled ? 'text-slate-700' : 'text-slate-650 group-hover:text-emerald-500 group-hover:translate-x-0.5'}`}>›</span>
                        <span>{link.label}</span>
                        {isLinkDisabled && (
                          <span className="ml-1.5 text-[8px] bg-slate-800 text-slate-500 px-1 py-0.5 rounded font-bold uppercase tracking-wider">indisponible</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer legal disclaimer of sitemap */}
        <div className="mt-10 pt-6 border-t border-slate-800/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-slate-550 font-semibold">
          <span>
            AlloServices33 — Entreprise locale d'enlèvement et débarras d'encombrants en Gironde.
          </span>
          <span className="text-emerald-500/80 hover:text-emerald-400 cursor-pointer transition" onClick={() => handleAnchorClick('accueil')}>
            ↑ Retour à l'accueil
          </span>
        </div>

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CATEGORIES, WASTE_ITEMS, calculateEstimatedPrice } from '../data';
import { QuoteRequest } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sofa,
  Tv,
  Package,
  Hammer,
  Trash2,
  ChevronRight,
  Calculator,
  Building,
  Truck,
  Sparkles,
  ClipboardCheck,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Info,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface VolumeCalculatorProps {
  onQuoteSubmitted: (quote: QuoteRequest) => void;
}

interface PhotoFile {
  id: string;
  name: string;
  size: string;
  dataUrl: string;
  status: 'loading' | 'success' | 'error';
}

export default function VolumeCalculator({ onQuoteSubmitted }: VolumeCalculatorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('furniture');
  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>({});
  
  // Form fields
  const [fullName, setFullName] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).fullName || '' : '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).email || '' : '';
    } catch {
      return '';
    }
  });
  const [phone, setPhone] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).phone || '' : '';
    } catch {
      return '';
    }
  });
  const [address, setAddress] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).address || '' : '';
    } catch {
      return '';
    }
  });
  const [zipCode, setZipCode] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).zipCode || '' : '';
    } catch {
      return '';
    }
  });
  const [city, setCity] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).city || '' : '';
    } catch {
      return '';
    }
  });
  const [serviceType, setServiceType] = useState<'particulier' | 'professionnel' | 'cave_grenier'>('particulier');
  const [floor, setFloor] = useState<number>(0);
  const [hasElevator, setHasElevator] = useState<boolean>(false);
  const [parkingDistance, setParkingDistance] = useState<'proche' | 'moyen' | 'eloigne'>('proche');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<PhotoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    const id = Math.random().toString(36).substring(2, 9);
    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' Mo';
    
    // Add loading state
    const newPhoto: PhotoFile = {
      id,
      name: file.name,
      size: sizeStr,
      dataUrl: '',
      status: 'loading'
    };
    
    setPhotoFiles((prev) => [...prev, newPhoto]);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        setPhotoFiles((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, dataUrl, status: 'success' } : item
          )
        );
        setPhotos((prev) => [...prev, dataUrl]);
      } else {
        setPhotoFiles((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'error' } : item
          )
        );
      }
    };
    reader.onerror = () => {
      setPhotoFiles((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'error' } : item
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);
      filesArray.forEach(processFile);
    }
  };

  const handleRemovePhoto = (id: string, dataUrl: string) => {
    setPhotoFiles((prev) => prev.filter((item) => item.id !== id));
    setPhotos((prev) => prev.filter((url) => url !== dataUrl));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const filesArray: File[] = Array.from(e.dataTransfer.files);
      filesArray.forEach((file) => {
        if (file.type.startsWith('image/')) {
          processFile(file);
        }
      });
    }
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  // Icon mapping helper
  const renderCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Sofa': return <Sofa className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Package': return <Package className={className} />;
      case 'Hammer': return <Hammer className={className} />;
      default: return <Package className={className} />;
    }
  };

  const currentCategoryItems = useMemo(() => {
    return WASTE_ITEMS.filter(item => item.categoryId === activeCategory);
  }, [activeCategory]);

  const incrementItem = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const decrementItem = (itemId: string) => {
    if ((quantities[itemId] || 0) <= 0) return;
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) - 1
    }));
  };

  const clearCalculator = () => {
    setQuantities({});
  };

  // Compute total volume
  const totalVolume = useMemo(() => {
    let vol = 0;
    Object.entries(quantities).forEach(([itemId, val]) => {
      const qty = Number(val);
      if (qty <= 0) return;
      const matched = WASTE_ITEMS.find(item => item.id === itemId);
      if (matched) {
        vol += matched.volumeM3 * qty;
      }
    });
    return Math.round(vol * 100) / 100;
  }, [quantities]);

  // Compute price ranges based on totalVolume & accessibility
  const priceRange = useMemo(() => {
    return calculateEstimatedPrice(totalVolume, { floor, hasElevator, parkingDistance });
  }, [totalVolume, floor, hasElevator, parkingDistance]);

  const selectedItemsSummaryList = useMemo(() => {
    return Object.entries(quantities)
      .filter(([_, val]) => Number(val) > 0)
      .map(([itemId, val]) => {
        const qty = Number(val);
        const item = WASTE_ITEMS.find(i => i.id === itemId);
        return { item, qty };
      })
      .filter(entry => entry.item !== undefined);
  }, [quantities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalVolume <= 0) {
      alert("Veuillez sélectionner au moins un encombrant à évacuer pour générer un devis.");
      return;
    }

    const emailClean = email.trim();
    const phoneClean = phone.replace(/[\s\(\)\.-]/g, '');
    const emailIsValid = !emailClean || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean);
    const phoneIsValid = !phoneClean || /^(?:0|\+33|0033)[1-9]\d{8}$/.test(phoneClean);

    if (!fullName || !email || !phone || !address || !zipCode || !city) {
      alert("Veuillez remplir vos coordonnées pour recevoir l'estimation.");
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

    setIsSubmitting(true);

    // Simulate reliable API call to process quote within 2hr SLA
    setTimeout(() => {
      const newQuote: QuoteRequest = {
        id: 'DEB-' + Math.floor(Math.random() * 900000 + 100000),
        fullName,
        email,
        phone,
        address,
        zipCode,
        city,
        serviceType,
        estimatedVolumeM3: totalVolume,
        selectedItems: { ...quantities },
        floor,
        hasElevator,
        parkingDistance,
        additionalDetails,
        photos,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // Save to localStorage
      const existingQuotesRaw = localStorage.getItem('debarras_quotes');
      const existingQuotes = existingQuotesRaw ? JSON.parse(existingQuotesRaw) : [];
      localStorage.setItem('debarras_quotes', JSON.stringify([newQuote, ...existingQuotes]));

      onQuoteSubmitted(newQuote);
      setSubmittedQuote(newQuote);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmittedQuote(null);
    setQuantities({});
    setFullName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setZipCode('');
    setCity('');
    setFloor(0);
    setHasElevator(false);
    setParkingDistance('proche');
    setAdditionalDetails('');
    setPhotos([]);
  };

  return (
    <div id="calculator-section" className="bg-white/45 backdrop-blur-md rounded-3xl border border-white/60 p-6 md:p-10 max-w-6xl mx-auto shadow-lg relative">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-850 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-200/40">
          <Calculator className="w-3.5 h-3.5" /> Outil d'estimation intelligent
        </span>
        <h3 className="text-2xl md:text-3xl font-black font-display text-slate-900 tracking-tight">
          Calculez votre volume et estimez votre devis
        </h3>
        <p className="text-slate-600 mt-2 text-sm max-w-xl mx-auto font-medium">
          Sélectionnez les objets à débarrasser. Mon algorithme calcule instantanément le volume en m³ et génère une fourchette tarifaire transparente.
        </p>
      </div>

      {isSuccess && submittedQuote ? (
        <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 md:p-10 text-center border border-white/60 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200 animate-pulse">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h4 className="text-2xl font-black font-display text-slate-900 mb-2">Devis Reçu ! Estimation Générée</h4>
          <p className="text-slate-600 text-sm md:text-base mb-6 font-medium">
            Votre demande a été enregistrée avec succès sous la référence <strong className="text-emerald-700">{submittedQuote.id}</strong>.
          </p>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 text-left shadow-sm border border-white/75 mb-6 space-y-3">
            <h5 className="font-extrabold text-slate-800 border-b border-slate-200/50 pb-2 mb-2 text-xs uppercase tracking-wider">Récapitulatif de votre demande :</h5>
            <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-600 font-medium">
              <div>Nom complet :</div>
              <div className="font-bold text-slate-900 text-right">{submittedQuote.fullName}</div>
              <div>Volume estimé :</div>
              <div className="font-bold text-slate-900 text-right text-emerald-600">{submittedQuote.estimatedVolumeM3} m³</div>
              {submittedQuote.address && (
                <>
                  <div>Adresse :</div>
                  <div className="font-bold text-slate-900 text-right text-wrap truncate max-w-[200px] ml-auto">{submittedQuote.address}</div>
                </>
              )}
              <div>Lieu d'intervention :</div>
              <div className="font-bold text-slate-900 text-right">{submittedQuote.zipCode} {submittedQuote.city}</div>
              <div>Accessibilité :</div>
              <div className="font-bold text-slate-900 text-right">Etg {submittedQuote.floor} {submittedQuote.hasElevator ? '(avec asc.)' : '(sans asc.)'}</div>
              <div>Tarif indicatif :</div>
              <div className="font-extrabold text-emerald-700 text-right text-sm">
                {priceRange.min} € HT *
              </div>
            </div>
            {priceRange.isFreePossible && (
              <div className="mt-2 text-[11px] bg-amber-50/70 text-amber-900 p-2.5 rounded-xl border border-amber-100/50 flex items-start gap-1.5 leading-relaxed font-semibold">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 animate-bounce" />
                <span>
                  <strong>Option de valorisation possible :</strong> Au vu du volume estimé, si certains de vos objets ont une valeur de revente, celle-ci viendra déduire le coût total et l'opération pourra être à <strong>0€</strong>.
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleResetForm}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-full text-xs font-bold uppercase tracking-wider transition shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Nouvelle Estimation
            </button>
            <a
              href="tel:0661292059"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-750 text-white rounded-full text-xs font-bold uppercase tracking-wider transition shadow-md shadow-emerald-250 inline-flex items-center justify-center gap-2"
            >
              Appeler le 06 61 29 20 59
            </a>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 font-semibold">
            * Estimation fournie à titre purement indicatif. Le tarif contractuel ferme sera arrêté d'un commun accord après envoi de photos ou visite.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selector */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200/40">
              {CATEGORIES.map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full transition duration-200 outline-none cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-250'
                        : 'bg-white/40 backdrop-blur-sm hover:bg-white/70 text-slate-755 border border-slate-250/20 shadow-sm'
                    }`}
                  >
                    {renderCategoryIcon(cat.iconName, "w-4 h-4")}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Category Intro */}
            <div className="bg-emerald-50/50 backdrop-blur-sm rounded-2xl p-4 text-xs text-slate-700 font-semibold border border-emerald-100/40">
              {CATEGORIES.find(c => c.id === activeCategory)?.description}
            </div>

            {/* Items List of Active Category */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {currentCategoryItems.map(item => {
                const qty = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-3xl border transition ${
                      qty > 0
                        ? 'bg-emerald-50/40 border-emerald-350 shadow-sm scale-[1.002]'
                        : 'bg-white/50 backdrop-blur-sm hover:bg-white/80 border-white/70 shadow-sm'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{item.name}</h4>
                      <span className="text-xs text-slate-500 font-semibold">Volume unitaire : {item.volumeM3} m³</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => decrementItem(item.id)}
                        disabled={qty <= 0}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition border cursor-pointer ${
                          qty > 0
                            ? 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                            : 'border-slate-200 bg-slate-100/50 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={`w-6 text-center font-black text-sm ${qty > 0 ? 'text-emerald-700 text-base' : 'text-slate-400'}`}>
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementItem(item.id)}
                        className="w-8 h-8 rounded-xl bg-emerald-150 border border-emerald-300 text-emerald-800 hover:bg-emerald-200/80 flex items-center justify-center transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick summary check */}
            {totalVolume > 0 && (
              <div className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Objets sélectionnés ({selectedItemsSummaryList.length})</span>
                <button
                  type="button"
                  onClick={clearCalculator}
                  className="text-xs font-black text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Tout vider
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Calculator Summary & Form */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Volume & Pricing card */}
            <div className="bg-slate-900/95 backdrop-blur-lg text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Volume total accumulé</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-extrabold font-mono">
                  {totalVolume} m³
                </span>
              </div>

              {/* Graphical indicator of volume */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalVolume / 35) * 100)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                <div>
                  <span className="text-slate-450 text-[10px] md:text-xs uppercase font-bold tracking-wider">Tarif indicatif HT *</span>
                  <div className="text-xl md:text-2xl font-black text-emerald-400 font-mono mt-0.5">
                    {totalVolume > 0 ? `${priceRange.min} €` : '0,00 €'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-450 text-[10px] md:text-xs uppercase font-bold tracking-wider">Camions requis</span>
                  <div className="text-sm font-extrabold text-slate-100 mt-1">
                    {totalVolume <= 0 ? 'Calculateur vide' : totalVolume < 6 ? '1 Fourgon (10m³)' : totalVolume < 18 ? '1 Grand Camion (22m³)' : '2 Camions Pro'}
                  </div>
                </div>
              </div>

              {priceRange.isFreePossible && (
                <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-900/30 rounded-2xl flex gap-2 items-start text-xs text-slate-300 leading-normal font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                  <span>
                    <strong className="text-emerald-350">Option de valorisation :</strong> Vos meubles revendables peuvent venir compenser le coût de l'opération !
                  </span>
                </div>
              )}
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal text-right font-sans font-semibold -mt-3 mb-2 px-2">
              Le devis final sera validé par Damien après examen logistique.
            </p>

            {/* Interactive Contact & Location form */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-white/60 space-y-4 shadow-sm">
              <h4 className="font-extrabold font-display text-slate-800 text-base md:text-lg border-b border-slate-200/50 pb-2">
                1. Critères d'accès
              </h4>

              <div className="space-y-3">
                {/* Floor and Elevator row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Étage</label>
                    <select
                      value={floor}
                      onChange={(e) => setFloor(Number(e.target.value))}
                      className="w-full bg-white/60 border border-slate-200/50 rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                    >
                      {[...Array(11)].map((_, i) => (
                        <option key={i} value={i}>
                          {i === 0 ? "Rez-de-chaussée" : `${i}ème étage`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Ascenseur</label>
                    <div className="flex items-center gap-1.5 h-8 mt-1">
                      <input
                        type="checkbox"
                        id="elevator"
                        checked={hasElevator}
                        onChange={(e) => setHasElevator(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="elevator" className="text-xs text-slate-700 font-bold cursor-pointer select-none">
                        Avec ascenseur
                      </label>
                    </div>
                  </div>
                </div>

                {/* Parking Distance */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Proximité parking camion</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'proche', label: 'Proche (< 10m)' },
                      { id: 'moyen', label: 'Moyen (< 30m)' },
                      { id: 'eloigne', label: 'Éloigné (> 30m)' }
                    ].map(opt => {
                      const sel = parkingDistance === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setParkingDistance(opt.id as any)}
                          className={`py-2 px-1 rounded-full border text-[10px] md:text-xs font-extrabold transition cursor-pointer ${
                            sel
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white/60 border-slate-200/50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <h4 className="font-extrabold font-display text-slate-800 text-base md:text-lg border-b border-slate-200/50 pb-2 pt-2">
                2. Coordonnées
              </h4>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Cadre du débarras</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'particulier', label: 'Particulier' },
                      { id: 'professionnel', label: 'Professionnel' }
                    ].map(opt => {
                      const sel = serviceType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setServiceType(opt.id as any)}
                          className={`py-2 px-1 rounded-full border text-[10px] md:text-xs font-extrabold transition cursor-pointer ${
                            sel
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                              : 'bg-white/60 border-slate-200/50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Nom Complet *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex: Jean Dupond"
                    className="w-full bg-white/60 border border-slate-200/50 rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="ex: 06 12 34 56 78"
                      className={`w-full bg-white/60 border rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:outline-none transition ${
                        phone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(phone.replace(/[\s\(\)\.-]/g, ''))
                          ? 'border-red-500 bg-red-50/10 text-red-900 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-slate-200/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                      }`}
                    />
                    {phone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(phone.replace(/[\s\(\)\.-]/g, '')) && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">
                        Numéro de téléphone invalide (ex: 0612345678)
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: jean@email.com"
                      className={`w-full bg-white/60 border rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:outline-none transition ${
                        email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                          ? 'border-red-500 bg-red-50/10 text-red-900 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-slate-200/50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'
                      }`}
                    />
                    {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">
                        Format e-mail invalide (ex: jean@email.com)
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="ex: 12 rue de la Paix"
                    className="w-full bg-white/60 border border-slate-200/50 rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Code Postal *</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="ex: 75015"
                      className="w-full bg-white/60 border border-slate-200/50 rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Ville *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="ex: Paris"
                      className="w-full bg-white/60 border border-slate-200/50 rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Détails à signaler (facultatif)</label>
                  <textarea
                    rows={2}
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Objets fragiles, piano, syndrome de Diogène, horaires particuliers, recyclage informatique..."
                    className="w-full bg-white/60 border border-slate-200/50 rounded-xl p-2.5 text-xs font-semibold focus:bg-white/95 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none resize-none transition"
                  ></textarea>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Photos des objets (conseillé pour un devis précis)
                    </label>
                    {photoFiles.length > 0 && (
                      <span className="text-[10px] text-emerald-600 font-extrabold font-mono">
                        {photoFiles.length} photo{photoFiles.length > 1 ? 's' : ''} sélectionnée{photoFiles.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  
                  <motion.div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    animate={{ scale: isDragging ? 1.015 : 1 }}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10'
                        : 'border-slate-250 bg-slate-50/40 hover:border-emerald-500 hover:bg-slate-50/80 shadow-inner'
                    }`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="volume-photo-upload"
                    />
                    <label htmlFor="volume-photo-upload" className="cursor-pointer block">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2 shadow-sm">
                        <Upload className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-700">
                        Glissez vos photos ici ou <span className="text-emerald-600 hover:text-emerald-700 underline font-extrabold">parcourez vos fichiers</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium font-sans">
                        Formats acceptés : JPG, PNG, WEBP &bull; Max 5 Mo par photo
                      </p>
                      <p className="text-[9px] text-emerald-600/80 mt-1.5 font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-100/50 rounded-md py-0.5 px-2 inline-block">
                        ⚡ Les photos aident Damien à fixer un prix définitif sans visite !
                      </p>
                    </label>
                  </motion.div>

                  {/* Enhanced Previews with List & Thumbnails */}
                  <AnimatePresence>
                    {photoFiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2.5"
                      >
                        {/* Summary bar */}
                        <div className="flex items-center justify-between text-[11px] bg-slate-100/80 border border-slate-200/50 rounded-xl px-3 py-1.5">
                          <span className="font-bold text-slate-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Espace d'envoi optimisé (Prêt)
                          </span>
                          <button
                            type="button"
                            onClick={() => { setPhotoFiles([]); setPhotos([]); }}
                            className="text-red-500 hover:text-red-700 font-extrabold uppercase text-[9px] tracking-wider cursor-pointer"
                          >
                            Tout effacer
                          </button>
                        </div>

                        {/* Interactive Grid with Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {photoFiles.map((p) => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="bg-white/95 border border-slate-150 rounded-xl p-2 flex items-center gap-3 shadow-xs hover:border-emerald-300 transition-colors group relative"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200/60 flex-shrink-0 bg-slate-50">
                                {p.status === 'loading' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                ) : (
                                  <img src={p.dataUrl} alt={p.name} className="w-full h-full object-cover" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0 pr-6">
                                <p className="text-[11px] font-bold text-slate-800 truncate font-sans">{p.name}</p>
                                <p className="text-[10px] text-slate-450 font-medium font-mono">{p.size}</p>
                              </div>

                              {p.status === 'success' && (
                                <span className="absolute right-9 top-[50%] -translate-y-[50%] text-emerald-500 font-bold text-xs bg-emerald-50 p-1 rounded-full border border-emerald-100">
                                  ✓
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(p.id, p.dataUrl)}
                                className="absolute right-2 top-[50%] -translate-y-[50%] p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                title="Supprimer la photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || totalVolume <= 0}
                  className={`w-full py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider text-center transition flex justify-center items-center gap-2 ${
                    totalVolume <= 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 active:transform active:scale-[0.99] shadow-md shadow-emerald-500/15 cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Traitement de ma demande...
                    </>
                  ) : totalVolume <= 0 ? (
                    "Sélectionnez des objets"
                  ) : (
                    <>
                      <ClipboardCheck className="w-4 h-4" /> Envoyer ma demande
                    </>
                  )}
                </button>
              </form>
            </div>
            
          </div>

        </div>
      )}
    </div>
  );
}

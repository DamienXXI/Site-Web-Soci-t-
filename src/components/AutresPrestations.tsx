import React, { useState, useMemo } from 'react';
import { ArrowRight, HardHat, AlertTriangle, Sparkles, Wrench, Shield, Check, Send } from 'lucide-react';
import { QuoteRequest } from '../types';

interface AutresPrestationsProps {
  onQuoteSubmitted: (quote: QuoteRequest) => void;
}

export default function AutresPrestations({ onQuoteSubmitted }: AutresPrestationsProps) {
  // Form States
  const [selectedService, setSelectedService] = useState('terrassement');
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
  const [city, setCity] = useState(() => {
    try {
      const profile = localStorage.getItem('debarras_profile');
      return profile ? JSON.parse(profile).city || '' : '';
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
  const [volume, setVolume] = useState(2); // estimated m3
  const [details, setDetails] = useState('');
  const [floor, setFloor] = useState(0);
  const [hasElevator, setHasElevator] = useState(false);
  const [parking, setParking] = useState<'proche' | 'moyen' | 'eloigne'>('proche');
  
  // Specific Simulator States
  const [terrassementSurface, setTerrassementSurface] = useState(0); // m²
  const [terrassementTypeSol, setTerrassementTypeSol] = useState<'meuble' | 'compact' | 'rocheux'>('meuble');
  const [terrassementProfondeur, setTerrassementProfondeur] = useState(0.3); // m depth
  const [carportType, setCarportType] = useState<'simple' | 'double' | 'triple'>('simple');
  const [carportAncrage, setCarportAncrage] = useState<'existant' | 'plots'>('existant');
  const [carportAdosse, setCarportAdosse] = useState<boolean>(false);
  const [heavyItemType, setHeavyItemType] = useState<'piano-droit' | 'billard' | 'coffre-moyen' | 'coffre-fort' | 'machine-indus'>('piano-droit');

  const [formSuccess, setFormSuccess] = useState(false);

  // Live Price & Comparison Simulator Logic
  const pricingSimulation = useMemo(() => {
    let ourPrice = 0;
    let competitorPrice = 0;
    let explanationBreakdown = '';
    let ourEdge = '';

    if (selectedService === 'terrassement') {
      const baseFee = 350; // mobilisation + transport de la mini-pelle
      let solFee = 0;
      let solLabel = "Terre végétale / meuble";
      if (terrassementTypeSol === 'compact') {
        solFee = 8;
        solLabel = "Sol compact / argileux (+8€/m²)";
      } else if (terrassementTypeSol === 'rocheux') {
        solFee = 20;
        solLabel = "Sol rocheux / difficile (+20€/m²)";
      }

      const depthRatio = terrassementProfondeur / 0.3;
      const basePricePerM2 = 18;
      
      ourPrice = terrassementSurface > 0 ? (baseFee + (terrassementSurface * (basePricePerM2 + solFee) * depthRatio)) : 0;
      competitorPrice = terrassementSurface > 0 ? (650 + (terrassementSurface * (38 + solFee * 1.5) * depthRatio)) : 0;
      
      explanationBreakdown = `Nivellement / Décaissement sur ${terrassementSurface} m² (profondeur ${Math.round(terrassementProfondeur * 100)} cm). Sol : ${solLabel}.`;
      ourEdge = "";
    } 
    else if (selectedService === 'carport') {
      let baseFee = 490;
      let sizeLabel = "Carport Simple (1 véhicule)";
      if (carportType === 'double') {
        baseFee = 890;
        sizeLabel = "Carport Double (2 véhicules)";
      } else if (carportType === 'triple') {
        baseFee = 1350;
        sizeLabel = "Carport XXL / Triple";
      }

      let ancrageFee = 0;
      if (carportAncrage === 'plots') {
        ancrageFee = 250;
      }

      let adosseFee = carportAdosse ? 120 : 0;

      ourPrice = baseFee + ancrageFee + adosseFee;
      competitorPrice = (baseFee * 1.6) + (ancrageFee * 1.8) + (carportAdosse ? 220 : 0);
      
      explanationBreakdown = `Montage de carport métallique (${sizeLabel}). Ancrage : ${carportAncrage === 'plots' ? 'Plots béton à creuser et couler' : 'Fixation sur surface existante'}.`;
      ourEdge = "";
    } 

    return {
      ourPrice: Math.round(ourPrice),
      competitorPrice: Math.round(competitorPrice),
      economy: Math.round(competitorPrice - ourPrice),
      explanationBreakdown,
      ourEdge
    };
  }, [selectedService, terrassementSurface, terrassementTypeSol, terrassementProfondeur, carportType, carportAncrage, carportAdosse]);

  const servicesList = [
    {
      id: 'terrassement',
      title: 'Terrassement avec utilisation de mini-pelle',
      icon: '🚜',
      tag: 'Terrassement & Aménagement',
      desc: 'Travaux de terrassement de petite et moyenne envergure : nivellement de terrain, décaissement pour allées ou terrasses, tranchées pour réseaux (eau, électricité, évacuation), et creusement de fondations.',
      details: [
        'Utilisation de mini-pelles adaptées aux passages étroits (accès difficiles)',
        'Nivellement précis du sol et évacuation des excédents de terre',
        'Création de tranchées techniques pour raccordements et gaines',
        'Préparation de plateformes stables pour dalles béton ou terrasses'
      ]
    },
    {
      id: 'carport',
      title: 'Montage de Carport métallique',
      icon: '🚗',
      tag: 'Structures Extérieures',
      desc: 'Montage et fixation professionnels de votre carport métallique ou structure de protection en aluminium pour véhicules (simple, double, ou adossé). Assemblage précis et ancrage au sol durable.',
      details: [
        'Ancrage rigide et scellement au sol (plots béton ou platines renforcées)',
        'Assemblage de la structure en stricte conformité avec la notice constructeur',
        'Pose de la couverture (plaques polycarbonate, bac acier, panneaux)',
        'Vérification des niveaux, de l\'équerrage et de l\'étanchéité globale'
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailClean = email.trim();
    const phoneClean = phone.replace(/[\s\(\)\.-]/g, '');
    const emailIsValid = !emailClean || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean);
    const phoneIsValid = !phoneClean || /^(?:0|\+33|0033)[1-9]\d{8}$/.test(phoneClean);

    if (!fullName || !email || !phone || !city) {
      alert('Veuillez renseigner les champs obligatoires.');
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

    let configDetails = '';
    if (selectedService === 'terrassement') {
      configDetails = `Terrassement Surface: ${terrassementSurface}m², Profondeur: ${terrassementProfondeur}m, Type de Sol: ${terrassementTypeSol}`;
    } else if (selectedService === 'carport') {
      configDetails = `Carport Taille: ${carportType}, Fixation: ${carportAncrage}, Type: ${carportAdosse ? 'Adossé' : 'Autoportant'}`;
    }

    const newQuote: QuoteRequest = {
      id: 'Devis-2026' + Math.floor(1000 + Math.random() * 9000),
      fullName,
      email,
      phone,
      zipCode: zipCode || '33000',
      city,
      serviceType: 'professionnel', // categorised as pro for custom jobs
      estimatedVolumeM3: selectedService === 'terrassement' ? Math.round(terrassementSurface * terrassementProfondeur) : 5,
      selectedItems: { [selectedService]: 1 },
      floor: 0,
      hasElevator: false,
      parkingDistance: 'proche',
      additionalDetails: `[Service Spécial: ${servicesList.find(s => s.id === selectedService)?.title}] ${configDetails}. Estimation: ${pricingSimulation.ourPrice}€ HT. Détails additionnels: ${details}`,
      estimatedPrice: `${pricingSimulation.ourPrice} € HT`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    onQuoteSubmitted(newQuote);
    setFormSuccess(true);
    
    // Reset form fields
    setFullName('');
    setEmail('');
    setPhone('');
    setDetails('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-[70vh]">
      {/* Header section */}
      <div className="text-center mb-12">
        <span className="inline-block px-3.5 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-200/40 font-sans">
          Mes Autres Services
        </span>
        <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 leading-tight">
          Autres prestations de service sur-mesure
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
          Au-delà du débarras standard, je propose des solutions adaptées pour vos aménagements extérieurs, petits chantiers de terrassement ou montage de structures de protection comme les carports. Profitez d'équipements adaptés et d'un savoir-faire rigoureux.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Services List Block: 7/12 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            {servicesList.map((service) => (
              <div 
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer flex gap-4 sm:gap-6 items-start ${
                  selectedService === service.id
                    ? 'bg-emerald-50/40 border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                    : 'bg-white border-slate-150 hover:border-emerald-200 shadow-xs'
                }`}
              >
                <div className="p-3 bg-white border border-slate-100/80 rounded-2xl text-2xl shadow-xs shrink-0 select-none">
                  {service.icon}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {service.tag}
                    </span>
                    {selectedService === service.id && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1.5 font-sans">
                        <Check className="w-2.5 h-2.5" /> Sélectionné pour devis
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-black text-slate-900 text-base sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {service.desc}
                  </p>
                  
                  {/* Expanded details */}
                  <div className="pt-3 border-t border-slate-150/50 mt-2">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-slate-500 font-sans font-semibold">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Block: 5/12 */}
        <div id="formulaire-autres-prestations" className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-sans">
              Formulaire Unique
            </span>
            <h3 className="text-lg md:text-xl font-black text-slate-900 font-display pt-1">
              Obtenir mon devis spécialisé
            </h3>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              Sélectionnez ci-contre ou ci-dessous le type de prestation requis, remplissez vos informations et je vous appellerai sous 24 heures pour fixer une visite ou vous transmettre un prix ferme.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Dropdown inside Form */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Prestation sélectionnée :
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:bg-white outline-none cursor-pointer"
              >
                {servicesList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Simulator Inputs based on selectedService */}
            {selectedService === 'terrassement' && (
              <div className="space-y-4 border-b border-slate-100 pb-4">
                {/* Surface */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Surface à terrasser :
                    </label>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-sans">
                      {terrassementSurface} m²
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="5"
                    value={terrassementSurface}
                    onChange={(e) => setTerrassementSurface(parseInt(e.target.value))}
                    className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Profondeur */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Profondeur de décaissement :
                    </label>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-sans">
                      {Math.round(terrassementProfondeur * 100)} cm ({(terrassementProfondeur).toFixed(2)}m)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={Math.round(terrassementProfondeur * 100)}
                    onChange={(e) => setTerrassementProfondeur(parseInt(e.target.value) / 100)}
                    className="w-full accent-emerald-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Type de sol */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Type de sol :
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'meuble', label: 'Terre Meuble' },
                      { id: 'compact', label: 'Terre Argile' },
                      { id: 'rocheux', label: 'Terre Roche' }
                    ].map((sol) => (
                      <button
                        key={sol.id}
                        type="button"
                        onClick={() => setTerrassementTypeSol(sol.id as any)}
                        className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition cursor-pointer text-center leading-normal ${
                          terrassementTypeSol === sol.id
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {sol.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedService === 'carport' && (
              <div className="space-y-4 border-b border-slate-100 pb-4">
                {/* Type de Carport / Taille */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Dimensions du carport :
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'simple', label: 'Simple (~15m²)' },
                      { id: 'double', label: 'Double (~30m²)' },
                      { id: 'triple', label: 'XXL (~45m²)' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setCarportType(type.id as any)}
                        className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition cursor-pointer text-center leading-normal ${
                          carportType === type.id
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ancrage */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Mode de fixation :
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCarportAncrage('existant')}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition cursor-pointer text-center leading-normal ${
                        carportAncrage === 'existant'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Dalle/plots existants
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarportAncrage('plots')}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition cursor-pointer text-center leading-normal ${
                        carportAncrage === 'plots'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Plots béton (+250€)
                    </button>
                  </div>
                </div>

                {/* Adossé */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Configuration :
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCarportAdosse(false)}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition cursor-pointer text-center leading-normal ${
                        !carportAdosse
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                      }`}
                    >
                      Autoportant
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarportAdosse(true)}
                      className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition cursor-pointer text-center leading-normal ${
                        carportAdosse
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-250 hover:bg-slate-50 text-slate-550'
                      }`}
                    >
                      Adossé (+120€)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Details message */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                Détaillez vos besoins particuliers :
              </label>
              <textarea
                placeholder="Ex : passage étroit pour la mini-pelle, hauteur sous toit souhaitée, marque du carport, passage par la fenêtre pour le piano..."
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-500 resize-none font-sans"
              />
            </div>

            {/* Live Pricing Estimator Panel */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800 shadow-md relative overflow-hidden my-4 text-left">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
              
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-900 px-2 py-0.5 rounded-md font-sans">
                  Simulateur en temps réel
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase font-sans">
                  Tarif indicatif HT
                </span>
              </div>

              <div className="space-y-2 pb-3 border-b border-slate-800/80">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11px] font-bold text-slate-400 font-sans">Notre Tarif :</span>
                  <span className="text-2xl font-black font-display text-emerald-400">
                    {pricingSimulation.ourPrice} €<span className="text-xs font-bold text-slate-400 ml-0.5 font-sans">HT</span>
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold italic font-sans">
                  {pricingSimulation.explanationBreakdown}
                </p>
              </div>

              {/* Competitor Comparison */}
              <div className="space-y-2 pb-1 font-sans font-semibold">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Tarif moyen constaté ailleurs :</span>
                  <span className="text-rose-400 line-through">
                    {pricingSimulation.competitorPrice} € HT
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl">
                  <span className="text-emerald-400 font-black flex items-center gap-1 font-sans">
                    🎉 Économie cumulée :
                  </span>
                  <span className="text-emerald-300 font-black font-display text-[11px]">
                    - {pricingSimulation.economy} € HT (-{Math.round((pricingSimulation.economy / pricingSimulation.competitorPrice) * 100)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="pt-3 border-t border-slate-150/60 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Nom Complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0612345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full text-xs border rounded-xl px-3.5 py-2.5 font-semibold outline-none transition ${
                      phone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(phone.replace(/[\s\(\)\.-]/g, ''))
                        ? 'border-red-500 bg-red-50/10 text-red-900 focus:bg-white focus:border-red-500'
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-500'
                    }`}
                  />
                  {phone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(phone.replace(/[\s\(\)\.-]/g, '')) && (
                    <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">
                      Numéro de téléphone invalide (ex: 0612345678)
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    placeholder="33000"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Bordeaux"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-slate-800 outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="jean.dupont@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full text-xs border rounded-xl px-3.5 py-2.5 font-semibold outline-none transition ${
                    email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                      ? 'border-red-500 bg-red-50/10 text-red-900 focus:bg-white focus:border-red-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-emerald-500'
                  }`}
                />
                {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">
                    Format e-mail invalide (ex: jean.dupont@email.com)
                  </p>
                )}
              </div>
            </div>

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-[10px] font-extrabold flex items-center gap-2 font-sans animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Demande reçue ! Mes équipes étudient votre besoin. Ouvrez le suivi pour suivre l'état.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Soumettre ma demande d'estimation</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

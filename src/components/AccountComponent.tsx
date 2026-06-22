import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle, Clock, XCircle, Sparkles, Building, RefreshCw } from 'lucide-react';
import { QuoteRequest } from '../types';

interface AccountComponentProps {
  onProfileUpdated?: () => void;
}

export default function AccountComponent({ onProfileUpdated }: AccountComponentProps) {
  // Profile States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    // Load profile
    const stored = localStorage.getItem('debarras_profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.zipCode) setZipCode(parsed.zipCode);
        if (parsed.city) setCity(parsed.city);
      } catch (err) {
        console.error('Error parsing profile', err);
      }
    }

    // Load submitted quotes
    loadQuotes();
  }, []);

  const loadQuotes = () => {
    const storedQuotes = localStorage.getItem('debarras_quotes');
    if (storedQuotes) {
      try {
        setQuotes(JSON.parse(storedQuotes));
      } catch (err) {
        console.error('Error parsing quotes', err);
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const emailClean = email.trim();
    const phoneClean = phone.replace(/[\s\(\)\.-]/g, '');
    const emailIsValid = !emailClean || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean);
    const phoneIsValid = !phoneClean || /^(?:0|\+33|0033)[1-9]\d{8}$/.test(phoneClean);

    if (!fullName || !email || !phone) {
      alert("Veuillez remplir les informations obligatoires (Nom, Email, Téléphone).");
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

    const profile = { fullName, email, phone, address, zipCode, city };
    localStorage.setItem('debarras_profile', JSON.stringify(profile));
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4500);

    // Notify other components if needed
    if (onProfileUpdated) {
      onProfileUpdated();
    }

    // Trigger custom event to notify other mounted components in real time
    window.dispatchEvent(new Event('profile_updated'));
  };

  // Helper to change status for simulation/testing
  const handleToggleQuoteStatus = (quoteId: string, currentStatus: string) => {
    const statuses: ('pending' | 'allocated' | 'completed' | 'cancelled')[] = ['pending', 'allocated', 'completed', 'cancelled'];
    let nextIndex = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    if (nextIndex < 0) nextIndex = 0;
    const nextStatus = statuses[nextIndex];

    const updated = quotes.map(q => {
      if (q.id === quoteId) {
        return { ...q, status: nextStatus };
      }
      return q;
    });

    localStorage.setItem('debarras_quotes', JSON.stringify(updated));
    setQuotes(updated);
  };

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'allocated':
      case 'completed':
      case 'approved':
      case 'validated':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl border border-emerald-200/50">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validé - RDV planifié</span>
          </span>
        );
      case 'cancelled':
      case 'rejected':
      case 'refused':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl border border-rose-200/50">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Refusé</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 font-extrabold text-[10px] uppercase tracking-wider rounded-xl border border-amber-200/50">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>En cours de traitement</span>
          </span>
        );
    }
  };

  return (
    <div className="py-12 md:py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title and subtitle */}
        <div className="text-center mb-12 space-y-2">
          <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-850 text-xs font-bold rounded-full uppercase tracking-wider font-sans border border-emerald-200/30">
            Espace Client Sécurisé
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 tracking-tight">
            Mon Compte & Suivi de devis
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
            Gérez vos coordonnées pour pré-remplir automatiquement tous vos futurs simulateurs de devis et suivez l'état d'avancement de vos demandes d'intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Profile Details Form (5/12) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg">
                👤
              </div>
              <h3 className="text-lg font-black font-display text-slate-900 pt-2">
                Mes Coordonnées
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Renseignez ces informations une seule fois : elles s'appliqueront automatiquement à l'ensemble de nos outils d'estimation de volume et calculateurs.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-sans">
                  Nom complet *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    placeholder="ex: Jean Dupont"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-sans">
                    E-mail *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-3.5 text-xs font-semibold outline-none focus:bg-white focus:ring-1 ${
                        email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                          ? 'border-red-500 bg-red-50/10 text-red-900 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-emerald-500'
                      }`}
                      placeholder="jean.dupont@email.com"
                    />
                  </div>
                  {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                    <p className="text-[10px] text-red-500 font-bold mt-1.5 font-sans">
                      Format e-mail invalide (ex: jean@email.com)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-sans">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-3.5 text-xs font-semibold outline-none focus:bg-white focus:ring-1 ${
                        phone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(phone.replace(/[\s\(\)\.-]/g, ''))
                          ? 'border-red-500 bg-red-50/10 text-red-900 focus:ring-red-500'
                          : 'border-slate-200 focus:ring-emerald-500'
                      }`}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  {phone && !/^(?:0|\+33|0033)[1-9]\d{8}$/.test(phone.replace(/[\s\(\)\.-]/g, '')) && (
                    <p className="text-[10px] text-red-500 font-bold mt-1.5 font-sans">
                      Numéro de téléphone invalide (ex: 0612345678)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-sans">
                  Adresse Postale
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                    placeholder="12 rue de la Paix"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-sans">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 font-sans"
                    placeholder="33000"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 font-sans">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 font-sans"
                    placeholder="Bordeaux"
                  />
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-900 text-xs font-bold leading-normal font-sans">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Coordonnées sauvegardées avec succès !</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
              >
                💾 Enregistrer mes coordonnées
              </button>
            </form>
          </div>

          {/* Column 2: Submitted Requests Monitor (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-black font-display text-slate-900">
                  Suivi de mes demandes ({quotes.length})
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Vos demandes d'estimations et devis soumis en direct.
                </p>
              </div>
              <button
                onClick={loadQuotes}
                className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-transform flex items-center gap-1.5 text-xs font-bold uppercase"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Synchroniser
              </button>
            </div>

            {quotes.length === 0 ? (
              <div className="bg-white/80 border border-slate-200/60 rounded-3xl p-10 text-center space-y-3 shadow-xs">
                <span className="text-4xl block">📋</span>
                <h4 className="font-bold text-slate-900 text-sm font-display">Aucune demande trouvée</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium font-sans">
                  Vous n'avez pas encore envoyé de demande d'estimation ou de devis de débarras/déménagement avec ce navigateur.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => {
                  return (
                    <div 
                      key={quote.id} 
                      className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 text-left"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-150/60">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 font-mono block">
                            RÉFÉRENCE
                          </span>
                          <span className="text-xs font-black text-slate-800 font-mono">
                            {quote.id}
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 block font-sans">
                            DATE DEPÔT
                          </span>
                          <span className="text-xs font-bold text-slate-700 font-sans">
                            {new Date(quote.createdAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-sans font-semibold">
                          <span className="text-slate-500">Service :</span>
                          <span className="text-slate-900 font-bold">
                            {quote.serviceType === 'particulier' ? '📦 Débarras / Enlèvement Particulier' : '💼 Prestation Professionnelle'}
                          </span>
                        </div>

                        {quote.estimatedVolumeM3 > 0 && (
                          <div className="flex justify-between text-xs font-sans font-semibold">
                            <span className="text-slate-500">Volume :</span>
                            <span className="text-emerald-700 font-extrabold">
                              {quote.estimatedVolumeM3} m³
                            </span>
                          </div>
                        )}

                        {quote.city && (
                          <div className="flex justify-between text-xs font-sans font-semibold">
                            <span className="text-slate-500">Lieu d'intervention :</span>
                            <span className="text-slate-800 font-bold block max-w-sm truncate text-right">
                              {quote.zipCode} {quote.city}
                            </span>
                          </div>
                        )}

                        {quote.additionalDetails && (
                          <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 font-sans font-medium leading-relaxed max-h-32 overflow-y-auto mt-2 border border-slate-100">
                            <strong className="text-slate-800 block mb-1">Détails :</strong>
                            {quote.additionalDetails}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-150/60 mt-2">
                        {renderStatusBadge(quote.status || 'pending')}
                        
                        <button 
                          onClick={() => handleToggleQuoteStatus(quote.id, quote.status || 'pending')}
                          className="text-[9px] text-slate-500 hover:text-emerald-700 font-extrabold uppercase font-sans tracking-wider hover:bg-slate-100 p-1 rounded transition max-w-max cursor-pointer"
                          title="Cliquez pour simuler un changement d'état côté administrateur"
                        >
                          🧪 Simuler changement d'état 🔄
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
          </div>

        </div>

      </div>
    </div>
  );
}

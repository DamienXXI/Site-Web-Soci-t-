/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { QuoteRequest } from '../types';
import { WASTE_ITEMS } from '../data';
import {
  X,
  Clock,
  Truck,
  Sparkles,
  RefreshCw,
  MapPin,
  Trash2,
  Settings,
  Mail,
  Shield,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MyRequestsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: QuoteRequest[];
  onDeleteQuote: (id: string) => void;
  onRefresh: () => void;
  leadDestination?: 'local' | 'email';
  onLeadDestinationChange?: (dest: 'local' | 'email') => void;
  web3FormsKey?: string;
  onWeb3FormsKeyChange?: (key: string) => void;
  formspreeEndpoint?: string;
  onFormspreeEndpointChange?: (endpoint: string) => void;
}

export default function MyRequestsDrawer({
  isOpen,
  onClose,
  quotes,
  onDeleteQuote,
  onRefresh,
  leadDestination = 'local',
  onLeadDestinationChange,
  web3FormsKey = '',
  onWeb3FormsKeyChange,
  formspreeEndpoint = '',
  onFormspreeEndpointChange
}: MyRequestsDrawerProps) {
  const [isAdminExpanded, setIsAdminExpanded] = React.useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 md:pl-16">
        <div className="w-screen max-w-sm bg-white/90 backdrop-blur-2xl shadow-2xl flex flex-col h-full border-l border-white/60">
          
          {/* Header */}
          <div className="px-6 py-5 bg-white/95 border-b border-slate-200/55 text-slate-900 flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100/80 border border-emerald-250/40 rounded-xl text-emerald-850 font-extrabold text-xs select-none">
                Express
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base font-display">Mes demandes</h4>
                <p className="text-[10px] text-slate-500 font-bold">Rappel garanti 5j/7</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onRefresh}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-700 cursor-pointer"
                title="Actualiser le statut"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Panneau d'administration de réception des devis */}
            <div className="border border-emerald-200/60 rounded-3xl bg-emerald-50/40 p-4 space-y-3">
              <button
                type="button"
                onClick={() => setIsAdminExpanded(!isAdminExpanded)}
                className="w-full flex items-center justify-between font-bold text-xs text-emerald-950 focus:outline-none cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>🛠️ Configuration de Réception</span>
                </span>
                {isAdminExpanded ? <ChevronUp className="w-4 h-4 text-emerald-700" /> : <ChevronDown className="w-4 h-4 text-emerald-700" />}
              </button>

              {isAdminExpanded && (
                <div className="space-y-3.5 pt-2 border-t border-emerald-100/60 text-slate-700 text-xs font-semibold animate-fade-in">
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    Configurez où sont envoyées les demandes d'estimations des clients faites depuis les simulateurs :
                  </p>

                  <div className="space-y-2">
                    {/* Option 1 */}
                    <label className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 transition cursor-pointer">
                      <input
                        type="radio"
                        name="leadDest"
                        checked={leadDestination === 'local'}
                        onChange={() => onLeadDestinationChange?.('local')}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-[10.5px]">Option 1 : Stockage Local</div>
                        <div className="text-[9.5px] text-slate-400 font-medium leading-tight">Par défaut, pour tester dans ce navigateur (enregistré dans l'onglet "Mes demandes").</div>
                      </div>
                    </label>

                    {/* Option 2 */}
                    <label className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 transition cursor-pointer">
                      <input
                        type="radio"
                        name="leadDest"
                        checked={leadDestination === 'email'}
                        onChange={() => onLeadDestinationChange?.('email')}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-[10.5px] flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-emerald-600" /> Option 2 : Envoi direct par E-mail
                        </div>
                        <div className="text-[9.5px] text-slate-400 font-medium leading-tight">Reçoit les demandes par e-mail instantanément (Web3Forms/Formspree).</div>
                      </div>
                    </label>
                  </div>

                  {/* Fields for Option 2 */}
                  {leadDestination === 'email' && (
                    <div className="p-3 bg-white border border-slate-200/60 rounded-2xl space-y-2.5 shadow-sm">
                      <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Paramètres de messagerie</div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Clé Web3Forms Access Key :</label>
                        <input
                          type="text"
                          value={web3FormsKey}
                          onChange={(e) => onWeb3FormsKeyChange?.(e.target.value)}
                          placeholder="Ex: 8a42bcde-..."
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-850 focus:outline-none focus:border-emerald-500"
                        />
                        <p className="text-[9px] text-slate-400 font-medium leading-tight">
                          Obtenez une clé gratuite sur <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">web3forms.com</a> (recommande un envoi propre sans backend).
                        </p>
                      </div>

                      <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-slate-200/50"></div>
                        <span className="flex-shrink mx-2 text-[9px] text-slate-400 font-bold uppercase">ou</span>
                        <div className="flex-grow border-t border-slate-200/50"></div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-bold">Endpoint URL Formspree (alternative) :</label>
                        <input
                          type="text"
                          value={formspreeEndpoint}
                          onChange={(e) => onFormspreeEndpointChange?.(e.target.value)}
                          placeholder="Ex: https://formspree.io/f/mqkvp..."
                          className="w-full p-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-850 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 bg-white/60 text-slate-400 border border-dashed border-slate-200/80 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-slate-700 text-sm">Aucune demande active</h5>
                  <p className="text-xs text-slate-500 font-medium">
                    Utilisez mon calculateur interactif pour faire votre première estimation en quelques clics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-full text-xs hover:bg-emerald-700 transition cursor-pointer"
                >
                  Calculer mon volume
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-3 bg-emerald-50/60 backdrop-blur-sm text-emerald-900 rounded-2xl text-xs flex gap-2 leading-relaxed border border-emerald-100/50 font-semibold">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 animate-pulse" />
                  <span>
                    <strong>Estimation indicative :</strong> Ce devis n'est qu'estimatif et indicatif. Il sera étudié, ajusté et validé de manière définitive par Damien avec modification s'il y a lieu.
                  </span>
                </div>

                <div className="space-y-4">
                  {quotes.map(quote => {
                    const selectedItems = Object.entries(quote.selectedItems).filter(([_, qty]) => qty > 0);

                    return (
                      <div key={quote.id} className="border border-white/70 rounded-3xl bg-white/60 backdrop-blur-sm shadow-sm p-4 space-y-4">
                        
                        {/* Title bar */}
                        <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                          <div>
                            <span className="text-xs font-extrabold text-slate-500">Réf : {quote.id}</span>
                            <div className="text-[10px] text-slate-400 font-semibold">Formulée le {new Date(quote.createdAt).toLocaleDateString('fr-FR')} à {new Date(quote.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeleteQuote(quote.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-full transition cursor-pointer"
                            title="Annuler cette demande"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Demande enregistrée */}
                        <div className="p-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 text-xs leading-relaxed font-semibold text-emerald-950 shadow-sm">
                          <span className="font-extrabold flex items-center gap-1.5 text-emerald-800">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
                            Demande enregistrée
                          </span>
                          <p className="opacity-95 text-slate-500 text-[11px] mt-0.5 font-medium">Damien Pommier étudiera votre projet très rapidement.</p>
                        </div>

                        {/* Quote summary details */}
                        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-xs text-slate-600 border-b border-dashed border-slate-200 pb-3 font-medium">
                          <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Ville :</div>
                          <div className="font-bold text-slate-900 text-right">{quote.zipCode} {quote.city}</div>
                          
                          <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-slate-400" /> Volume :</div>
                          <div className="font-extrabold text-slate-900 text-right text-emerald-600">{quote.estimatedVolumeM3} m³</div>

                          <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> Cadre :</div>
                          <div className="font-bold text-slate-900 text-right uppercase text-[11px]">{quote.serviceType}</div>
                        </div>

                        {/* Selected items list inside this quote */}
                        {selectedItems.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventaire ({selectedItems.length}) :</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedItems.map(([itemId, qty]) => {
                                const item = WASTE_ITEMS.find(i => i.id === itemId);
                                if (!item) return null;
                                return (
                                  <span key={itemId} className="inline-flex items-center gap-1 text-[10px] bg-white/80 border border-slate-200/50 text-slate-750 px-2 py-0.5 rounded-full font-bold shadow-sm">
                                    {item.name} <strong className="text-slate-900">x{qty}</strong>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer of Drawer */}
          <div className="p-6 bg-white/45 backdrop-blur-sm border-t border-slate-200/50 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Besoin d'aide immédiate ?</span>
              <span className="font-extrabold text-slate-900">Lundi au Vendredi - 9h/18h</span>
            </div>
            <a
              href="tel:0661292059"
              className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold rounded-full text-center text-xs uppercase tracking-wider block shadow-md transition"
            >
              Appeler le 06 61 29 20 59
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

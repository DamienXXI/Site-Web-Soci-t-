/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Plus, ChevronLeft, ChevronRight, Check, Sparkles, User, ShieldCheck } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  serviceType: string;
}

interface TestimonialsCarouselProps {
  reviews: Testimonial[];
  onAddReview: (review: Omit<Testimonial, 'id' | 'date' | 'role'>) => void;
}

export default function TestimonialsCarousel({ reviews, onAddReview }: TestimonialsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formService, setFormService] = useState('Débarras de maison');
  const [formText, setFormText] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Auto-play timer
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
    }
    autoPlayTimer.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
  };

  useEffect(() => {
    if (reviews.length > 0) {
      resetTimer();
    }
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [reviews, activeIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    resetTimer();
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % reviews.length);
    resetTimer();
  };

  const handleDotClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    resetTimer();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formText.trim()) return;

    onAddReview({
      name: formName.trim(),
      location: formLocation.trim() || 'Gironde',
      rating: formRating,
      serviceType: formService,
      text: formText.trim()
    });

    // Reset Form
    setFormName('');
    setFormLocation('');
    setFormRating(5);
    setFormService('Débarras de maison');
    setFormText('');
    setFormSuccess(true);
    
    // Auto collapse form after brief success message
    setTimeout(() => {
      setFormSuccess(false);
      setIsFormOpen(false);
    }, 3000);
  };

  const servicesList = [
    'Débarras de maison',
    'Débarras d’appartement',
    'Débarras de succession',
    'Vide cave / garage',
    'Enlèvement d’encombrants',
    'Déménagement complet',
    'Aide au déménagement',
    'Nettoyage extrême'
  ];

  // Framer motion variants for smooth sliding
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -150 : 150,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  const currentReview = reviews[activeIndex] || null;

  return (
    <section id="temoignages-section" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative background grid elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Block */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-100/80 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-200/40 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Avis Clients &amp; Témoignages en direct</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 tracking-tight">
            Ils nous font confiance
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
            Découvrez les retours d'expérience de nos clients en Gironde. Tous nos avis proviennent d'interventions réelles et de fiches de satisfaction validées.
          </p>
        </div>

        {/* Grid: Carousel on left, submit on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Block: Testimonials Carousel (8 columns on large screens) */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-white/70 backdrop-blur-md rounded-4xl border border-slate-200/80 p-8 md:p-12 shadow-sm relative min-h-[400px]">
            {/* Elegant Quotation Mark Mark in background */}
            <div className="absolute top-6 right-10 text-slate-100 font-serif text-[180px] font-bold select-none leading-none pointer-events-none">
              “
            </div>

            {reviews.length > 0 && currentReview ? (
              <div className="relative flex-1 flex flex-col justify-between">
                
                {/* Carousel Card */}
                <div className="overflow-hidden min-h-[220px]">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={currentReview.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Stars & Badge */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex gap-1 bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-150/40">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < currentReview.rating 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Avis Vérifié</span>
                        </span>
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          {currentReview.date}
                        </span>
                      </div>

                      {/* Service Badge & Text */}
                      <div className="space-y-3">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          📌 {currentReview.serviceType}
                        </span>
                        <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed font-medium italic">
                          "{currentReview.text}"
                        </p>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500 font-bold uppercase text-sm">
                          {currentReview.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{currentReview.name}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{currentReview.role} • <span className="text-emerald-600 font-bold">{currentReview.location}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Controls (Arrows and dots) */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-8">
                  {/* Indicators / Dots */}
                  <div className="flex gap-1.5">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          index === activeIndex ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                        }`}
                        title={`Voir témoignage ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Manual Navigation Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                      title="Témoignage précédent"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                      title="Témoignage suivant"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                <MessageSquare className="w-12 h-12 mb-2 text-slate-200" />
                <span>Aucun avis disponible pour le moment.</span>
              </div>
            )}
          </div>

          {/* Right Block: "Laisser un avis" Card (4 columns on large screens) */}
          <div className="lg:col-span-4 bg-slate-900 text-slate-100 rounded-4xl border border-slate-800 p-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h3 className="font-display font-black text-slate-100 text-sm uppercase tracking-wider">
                  Votre avis nous intéresse !
                </h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                Vous avez fait appel à AlloServices33 pour un débarras ou un déménagement en Gironde ? Donnez-nous votre avis en remplissant le formulaire ci-dessous.
              </p>
            </div>

            {/* Toggle Button for Mobile/Drawer Feel */}
            {!isFormOpen && !formSuccess ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-6 w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest transition shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Rédiger un avis</span>
              </button>
            ) : formSuccess ? (
              <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-xs font-black uppercase">Merci beaucoup !</h4>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Votre avis a bien été enregistré et s'affiche désormais directement dans le carrousel.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                
                {/* Form fields */}
                <div className="space-y-3.5">
                  
                  {/* Name and Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-450 tracking-wider mb-1 font-sans">Votre Nom *</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex: Sophie M."
                        required
                        className="w-full bg-slate-950 border border-slate-800 text-slate-250 text-xs rounded-xl py-2 px-3 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-450 tracking-wider mb-1 font-sans">Votre Commune</label>
                      <input
                        type="text"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        placeholder="Ex: Mérignac"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-250 text-xs rounded-xl py-2 px-3 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Rating selection */}
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-450 tracking-wider mb-1 font-sans">Note attribuée *</label>
                    <div className="flex gap-1.5 bg-slate-950 border border-slate-800 py-2 px-3.5 rounded-xl w-fit">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(null)}
                          className="focus:outline-none transition-transform active:scale-125 cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= (hoveredStar ?? formRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service dropdown */}
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-450 tracking-wider mb-1 font-sans">Service concerné *</label>
                    <select
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-250 text-xs rounded-xl py-2 px-3 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
                    >
                      {servicesList.map((srv) => (
                        <option key={srv} value={srv} className="bg-slate-950 text-slate-300">
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-450 tracking-wider mb-1 font-sans">Votre Témoignage *</label>
                    <textarea
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      placeholder="Décrivez brièvement le déroulement de notre intervention..."
                      required
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-250 text-xs rounded-xl py-2 px-3 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors resize-none"
                    />
                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-2 px-3 border border-slate-800 hover:bg-slate-800 text-slate-400 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Publier</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

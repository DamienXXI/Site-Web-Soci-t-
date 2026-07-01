/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Phone,
  Calendar,
  Award,
  Star,
  HardHat,
  FileText,
  ArrowRight,
  ShieldCheck,
  Heart,
  Recycle,
  Scale,
  MapPin,
  ExternalLink,
  Menu,
  X,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  MessageSquare,
  BookmarkCheck,
  CheckCircle,
  TrendingDown,
  Truck,
  Building,
  Plus,
  Minus,
  RotateCcw,
  Check,
  Trash2,
  ArrowUp
} from 'lucide-react';
// @ts-ignore
import humanPhoto from './assets/images/human_loading_van_1782143690142.jpg';
// @ts-ignore
import immoAquitaineLogo from './assets/images/immo_france_aquitaine_logo_1782294657178.jpg';
// @ts-ignore
import pichetLogo from './assets/images/pichet_logo_1782294901264.jpg';
// @ts-ignore
import cabinetBedinLogo from './assets/images/cabinet_bedin_logo_1782294912018.jpg';
// @ts-ignore
import actiaConceptLogo from './assets/images/actia_concept_logo_1782294924224.jpg';
// @ts-ignore
import creditAgricoleLogo from './assets/images/credit_agricole_logo_1782294935861.jpg';
// Lazy-loaded components for optimal performance on mobile networks
const VolumeCalculator = React.lazy(() => import('./components/VolumeCalculator'));
const DemenagementCalculator = React.lazy(() => import('./components/DemenagementCalculator'));
const NettoyageCalculator = React.lazy(() => import('./components/NettoyageCalculator'));
const PartiesCommunesCalculator = React.lazy(() => import('./components/PartiesCommunesCalculator'));
const AutresPrestations = React.lazy(() => import('./components/AutresPrestations'));
const InterventionZoneMap = React.lazy(() => import('./components/InterventionZoneMap'));
const MyRequestsDrawer = React.lazy(() => import('./components/MyRequestsDrawer'));
const AccountComponent = React.lazy(() => import('./components/AccountComponent'));
const BeforeAfterGallery = React.lazy(() => import('./components/BeforeAfterGallery'));
const ConseilsAndFAQ = React.lazy(() => import('./components/ConseilsAndFAQ'));
const SitemapTextuel = React.lazy(() => import('./components/SitemapTextuel'));
const TestimonialsCarousel = React.lazy(() => import('./components/TestimonialsCarousel'));

interface StatCounterProps {
  endValue: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function StatCounter({ endValue, suffix = "", prefix = "", duration = 1.5 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Simple ease-out power 2 function for smoother ending
      const easeOut = 1 - Math.pow(1 - progress, 2);
      
      setCount(Math.floor(easeOut * endValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, endValue, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

// Smooth modern transition loader skeleton/spinner
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[250px] space-y-4">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-4 border-slate-100/30 animate-pulse"></div>
      <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin"></div>
    </div>
    <span className="text-xs font-semibold text-slate-500 animate-pulse font-sans">Chargement...</span>
  </div>
);

// Reusable ScrollReveal component for progressive and elegant reveal-on-scroll animations
const ScrollReveal = ({ children, delay = 0, y = 30 }: { children: React.ReactNode, delay?: number, y?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

import { TESTIMONIALS } from './data';
import { QuoteRequest } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'accueil' | 'enlevements' | 'nettoyage' | 'parties-communes' | 'fonctionnement' | 'demenagement' | 'autres-prestations' | 'galerie'>('accueil');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  // Collapsible zones d'intervention
  const [isZonesExpanded, setIsZonesExpanded] = useState(false);

  // Lead receiving configurations (Options 1, 2)
  const [leadDestination, setLeadDestination] = useState<'local' | 'email'>(() => {
    const stored = localStorage.getItem('pommier_lead_destination');
    if (stored === 'email') return 'email';
    return 'local';
  });
  const [web3FormsKey, setWeb3FormsKey] = useState(() => {
    return localStorage.getItem('pommier_web3forms_key') || '';
  });
  const [formspreeEndpoint, setFormspreeEndpoint] = useState(() => {
    return localStorage.getItem('pommier_formspree_endpoint') || '';
  });
  
  // Déménagement Calculator states
  const [demDepart, setDemDepart] = useState('Bordeaux');
  const [demArrivee, setDemArrivee] = useState('Mérignac');
  const [demDistance, setDemDistance] = useState(15);
  const [demEtapes, setDemEtapes] = useState<string[]>([]);
  const [demCartons, setDemCartons] = useState(10);
  const [demMeubles, setDemMeubles] = useState(2);
  const [demElectro, setDemElectro] = useState(1);
  const [demDivers, setDemDivers] = useState(3);
  const [demLits, setDemLits] = useState(1);
  const [demTables, setDemTables] = useState(1);
  const [demPetits, setDemPetits] = useState(2);
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
  
  // Déménagement Form states
  const [demName, setDemName] = useState('');
  const [demEmail, setDemEmail] = useState('');
  const [demPhone, setDemPhone] = useState('');
  const [demDate, setDemDate] = useState('');
  const [demMessage, setDemMessage] = useState('');
  const [demIsSuccess, setDemIsSuccess] = useState(false);
  
  // Custom reviews list in state
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewLoc, setNewReviewLoc] = useState('');
  const [newReviewService, setNewReviewService] = useState('Débarras de maison');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<'legals' | 'privacy' | 'recycling' | 'estimation' | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState<boolean>(false);

  // Homepage Calculators Tab
  const [activeHomeCalcTab, setActiveHomeCalcTab] = useState<'encombrants' | 'demenagement' | 'nettoyage' | 'parties-communes'>('encombrants');

  // Selected tips step in interactive process
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Volume calculations for Déménagement
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
  const totalM3Value = presetM3 + customM3;
  const rawManutentionPrice = totalM3Value * 40;

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSelectedScrollState();
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const setSelectedScrollState = () => {
    if (window.scrollY > 400) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (activeModal || showWelcomePopup) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeModal, showWelcomePopup]);

  useEffect(() => {
    // Initial fetch of localStorage quotes
    const loadQuotes = () => {
      const stored = localStorage.getItem('debarras_quotes');
      if (stored) {
        setQuotes(JSON.parse(stored));
      }
    };
    loadQuotes();
    
    // Set custom reviews
    const storedReviews = localStorage.getItem('debarras_reviews');
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews(TESTIMONIALS);
    }
  }, []);

  useEffect(() => {
    if (currentPage === 'galerie') {
      setCurrentPage('accueil');
      return;
    }

    // Dynamic titles, descriptions and keywords based on current page for local SEO (Gironde / Bordeaux)
    const pageMeta: Record<string, { title: string; description: string; keywords: string }> = {
      accueil: {
        title: "AlloServices33 - Débarras, Déménagement en Gironde",
        description: "Services professionnels de débarras de maison, enlèvement d'encombrants, nettoyage de logement et aide au déménagement en Gironde et région bordelaise. Devis gratuit sous 24h/48h.",
        keywords: "débarras gironde, débarras maison bordeaux, enlèvement encombrants, déménagement bordeaux, nettoyage maison gironde, vide maison gironde, débarras gratuit"
      },
      enlevements: {
        title: "Enlèvement d'encombrants & Débarras de Maison | Gironde",
        description: "Besoin de vider une maison, un appartement ou de faire enlever vos encombrants en Gironde ? Découvrez notre service de débarras sur mesure et éco-responsable.",
        keywords: "enlèvement encombrants bordeaux, debarras maison 33, vide maison bordeaux, débarras appartement gironde, debarras cave bordeaux, debarras gratuit"
      },
      nettoyage: {
        title: "Nettoyage Extrême, Diogène & Ménage de Printemps | Bordeaux (33)",
        description: "Prestations spécialisées de nettoyage en Gironde : nettoyage après déménagement, ménage de printemps, syndromes de Diogène, et désinfection de logement insalubre.",
        keywords: "nettoyage diogene bordeaux, nettoyage maison gironde, nettoyage insalubre bordeaux, desinfection logement gironde, nettoyage fin de chantier, menage"
      },
      'parties-communes': {
        title: "Entretien & Nettoyage de Parties Communes de Copropriétés | Gironde",
        description: "Entretien régulier et nettoyage professionnel des parties communes d'immeubles et copropriétés en Gironde. Sortie de poubelles, vitres, et cages d'escalier.",
        keywords: "entretien copropriete bordeaux, nettoyage hall immeuble gironde, sortie poubelles bordeaux, entretien parties communes gironde, syndic immeuble 33"
      },
      fonctionnement: {
        title: "Comment ça marche ? Nos Débarras & Déménagements pas à pas",
        description: "Découvrez notre processus clair et professionnel de la prise de contact à l'enlèvement de vos encombrants, tri éco-responsable et valorisation en Gironde.",
        keywords: "processus debarras bordeaux, fonctionnement debarras gironde, devis débarras gratuit, valorisation dechets gironde, tri éco-responsable"
      },
      demenagement: {
        title: "Aide au Déménagement & Transport de Volumes en Gironde (33)",
        description: "Service de transport de meubles, aide au déménagement et portage de charges lourdes en Gironde. Calculateur de volume en ligne et devis instantané.",
        keywords: "aide demenagement bordeaux, transport de meubles gironde, location camion avec chauffeur bordeaux, demenagement pas cher gironde, portage de meubles"
      },
      'autres-prestations': {
        title: "Prestations Extérieures & Petits Travaux de Jardinage | Gironde",
        description: "Prestations de terrassement, nivellement de terrain, nettoyage de terrasses et terrassement paysager en Gironde. Services de proximité de qualité.",
        keywords: "terrassement jardin bordeaux, nettoyage terrasse gironde, nivellement terrain bordeaux, dessouchage gironde, travaux exterieurs gironde"
      },
      galerie: {
        title: "Interventions Avant / Après | AlloServices33",
        description: "Découvrez notre sélection interactive de photos Avant / Après illustrant nos interventions de débarras de maisons, caves, greniers et déménagements en Gironde.",
        keywords: "debarras avant apres, interventions photos debarras bordeaux, nettoyage diogene photos, photos debarras gironde, tri debarras"
      }
    };

    const meta = pageMeta[currentPage] || pageMeta.accueil;

    // 1. Update document title
    document.title = meta.title;

    // 2. Update/Create Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', meta.description);

    // 3. Update/Create Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', meta.keywords);

  }, [currentPage]);

  const handleRefreshQuotes = () => {
    const stored = localStorage.getItem('debarras_quotes');
    if (stored) {
      setQuotes(JSON.parse(stored));
    }
  };

  const handleDeleteQuote = (id: string) => {
    const updated = quotes.filter(q => q.id !== id);
    localStorage.setItem('debarras_quotes', JSON.stringify(updated));
    setQuotes(updated);
  };

  const handleQuoteRequest = () => {
    setCurrentPage('accueil');
    setTimeout(() => {
      const el = document.getElementById('formulaire-devis');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleQuoteSubmitted = (newQuote: QuoteRequest) => {
    // 1. Front-end Validation: Prevent incomplete form submissions
    if (!newQuote.fullName || !newQuote.fullName.trim()) {
      alert("Erreur : Le nom complet est obligatoire pour soumettre la demande.");
      return;
    }
    if (!newQuote.phone || !newQuote.phone.trim()) {
      alert("Erreur : Le numéro de téléphone est obligatoire pour soumettre la demande.");
      return;
    }

    // Option 1 is ALWAYS active as a base layer so the user can track their request in their browser
    setQuotes(prev => [newQuote, ...prev]);
    setIsDrawerOpen(true);

    // Format descriptive message body for remote submissions (email or log)
    let itemDetailsText = "";
    if (newQuote.selectedItems) {
      itemDetailsText = Object.entries(newQuote.selectedItems)
        .filter(([_, qty]) => qty > 0)
        .map(([itemId, qty]) => `• ${itemId}: ${qty}`)
        .join("\n");
    }

    const emailSubject = `Nouveau Devis - ${newQuote.fullName} (${newQuote.city})`;
    const emailBodyMessage = `
Nouveau Devis Déposé par un Client depuis le site de Damien Pommier :
------------------------------------
Nom complet : ${newQuote.fullName}
E-mail : ${newQuote.email || "Non renseigné"}
Téléphone : ${newQuote.phone}
Localisation : ${newQuote.zipCode} ${newQuote.city}
Type de prestation : ${newQuote.serviceType}

------------------------------------
DÉTAILS DU CALCUL DE VOLUME & TARIFICATION :
• Volume Global Estimé : ${newQuote.estimatedVolumeM3} m³
• Tarif / Montant Estimé : ${newQuote.estimatedPrice || "Non calculé / À valider"}
------------------------------------

Configuration du lieu :
• Étage : ${newQuote.floor} (Ascenseur : ${newQuote.hasElevator ? "Oui" : "Non"})
• Distance de Parking : ${newQuote.parkingDistance}

Détails complémentaires :
${newQuote.additionalDetails || "Aucun détail complémentaire fourni."}

Inventaire détaillé des objets sélectionnés :
${itemDetailsText || "Aucun objet individuel sélectionné (estimation de volume direct ou formulaire déménagement)."}

------------------------------------
Demande générée le : ${new Date(newQuote.createdAt).toLocaleString('fr-FR')}
Référence de suivi : ${newQuote.id}
    `;

    // Helper to convert base64 data URL to Blob
    const dataURLtoBlob = (dataurl: string): Blob | null => {
      try {
        const arr = dataurl.split(',');
        if (arr.length < 2) return null;
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      } catch (e) {
        console.error("Error converting photo data URL to Blob:", e);
        return null;
      }
    };

    // Option 2: Direct Email via Web3Forms or Formspree
    if (leadDestination === 'email') {
      const isFormspree = !!formspreeEndpoint;
      const endpoint = isFormspree ? formspreeEndpoint : "https://api.web3forms.com/submit";
      
      if (!isFormspree && !web3FormsKey) {
        console.warn("Web3Forms Key is missing. Please configure it in the administration panel.");
        alert("Configuration requise : Option E-mail sélectionnée mais aucune clé d'accès configurée. Allez dans le panneau d'administration pour renseigner votre clé Web3Forms ou Formspree.");
        return;
      }

      // Use FormData to send actual files to email services
      const formData = new FormData();
      
      // A valid email is required by submission platforms to prevent spam rejection (400)
      const senderEmail = newQuote.email && newQuote.email.trim() ? newQuote.email.trim() : "no-reply@debarras-gironde.fr";
      
      if (isFormspree) {
        formData.append("subject", emailSubject);
        formData.append("name", newQuote.fullName);
        formData.append("email", senderEmail);
        formData.append("phone", newQuote.phone);
        formData.append("message", emailBodyMessage);
        formData.append("_subject", emailSubject);
      } else {
        formData.append("access_key", web3FormsKey || "");
        formData.append("subject", emailSubject);
        formData.append("from_name", "Demande De Devis");
        formData.append("name", newQuote.fullName);
        formData.append("email", senderEmail);
        formData.append("phone", newQuote.phone);
        formData.append("message", emailBodyMessage);
      }

      // Convert and append base64 photos as real attachments for Web3Forms/Formspree
      if (newQuote.photos && newQuote.photos.length > 0) {
        newQuote.photos.forEach((photoBase64, index) => {
          const blob = dataURLtoBlob(photoBase64);
          if (blob) {
            const extension = blob.type.split('/')[1] || 'jpg';
            const filename = `photo_${index + 1}.${extension}`;
            
            // Web3Forms supports receiving files with any name, including 'photos_projet'
            formData.append("photos_projet", blob, filename);
            
            // Web3Forms and other email providers also look for 'attachment' fields
            const fieldName = index === 0 ? 'attachment' : `attachment_${index + 1}`;
            formData.append(fieldName, blob, filename);
          }
        });
      }

      fetch(endpoint, {
        method: "POST",
        body: formData // No Content-Type header - browser will set boundary automatically
      })
      .then(res => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        console.log("Email submitted successfully with attachments via " + (isFormspree ? "Formspree" : "Web3Forms"));
      })
      .catch(err => {
        console.error("Failed to send email lead:", err);
      });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName || !newReviewText) return;

    const added = {
      id: 'rev-' + Date.now(),
      name: newReviewName,
      location: newReviewLoc || 'France',
      role: 'Client Particulier',
      rating: newReviewRating,
      text: newReviewText,
      date: 'Aujourd\'hui',
      serviceType: newReviewService
    };

    const newSet = [added, ...reviews];
    localStorage.setItem('debarras_reviews', JSON.stringify(newSet));
    setReviews(newSet);

    // Reset fields
    setNewReviewName('');
    setNewReviewText('');
    setNewReviewLoc('');
    setNewReviewRating(5);
    setReviewSuccessMessage(true);
    setTimeout(() => setReviewSuccessMessage(false), 4000);
  };

  const handleAddNewReview = (newReview: { name: string; text: string; rating: number; location: string; serviceType: string }) => {
    const added = {
      id: 'rev-' + Date.now(),
      name: newReview.name,
      location: newReview.location || 'Gironde',
      role: 'Client Particulier',
      rating: newReview.rating,
      text: newReview.text,
      date: 'Aujourd\'hui',
      serviceType: newReview.serviceType
    };

    const newSet = [added, ...reviews];
    localStorage.setItem('debarras_reviews', JSON.stringify(newSet));
    setReviews(newSet);
  };

  // Business hours active indicator
  const isBusinessOpen = () => {
    const now = new Date();
    // Convert to Paris local time roughly or inspect hours (8h - 20h)
    const hours = now.getUTCHours() + 2; // approximation for Paris summer time (UTC+2)
    const day = now.getUTCDay();
    return hours >= 8 && hours < 20 && day >= 1 && day <= 5; // Monday-Friday
  };

  return (
    <div id="main-app-container" className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 font-sans text-slate-800 antialiased relative">
      {/* Background Decor Blurred Circles */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-teal-200/40 rounded-full blur-[130px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[550px] h-[550px] bg-emerald-100/40 rounded-full blur-[110px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[5%] w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <nav className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-100/80 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Brand text */}
            <div className="flex items-center gap-3 animate-fade-in">
              {/* Photo - clicks to show lightbox modal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLogoModalOpen(true);
                }}
                title="Cliquez pour agrandir la photo"
                className="relative group w-16 h-16 flex-shrink-0 focus:outline-none cursor-pointer"
              >
                <img
                  src={humanPhoto}
                  alt="Logo Damien Pommier"
                  className="w-full h-full object-cover rounded-2xl shadow-md border border-emerald-500/20 transform group-hover:scale-105 duration-200 transition-transform"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </button>

              {/* Name - clicks to go back to home page */}
              <button
                onClick={() => {
                  setCurrentPage('accueil');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left focus:outline-none hover:opacity-85 transition group cursor-pointer"
              >
                <span className="font-display font-black text-xl text-slate-900 tracking-tight block leading-tight group-hover:text-emerald-700 transition-colors">
                  Damien Pommier
                </span>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block -mt-0.5">
                  Mes services à votre service
                </span>
              </button>
            </div>

            {/* Desktop Navbar menu */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Dropdown with Hover Group */}
              <div className="relative group py-2">
                <button 
                  onClick={() => setCurrentPage('enlevements')}
                  className={`text-xs px-4.5 py-2.5 rounded-full font-black uppercase tracking-wide transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] cursor-pointer flex items-center gap-1.5 border-2 shadow-md ${
                    ['enlevements', 'nettoyage', 'parties-communes', 'demenagement', 'autres-prestations'].includes(currentPage)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-emerald-500/15' 
                      : 'bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-500 shadow-emerald-500/5'
                  }`}
                >
                  <span>Prestations</span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-250 group-hover:rotate-180 ${
                    ['enlevements', 'nettoyage', 'parties-communes', 'demenagement', 'autres-prestations'].includes(currentPage) ? 'text-white' : 'text-emerald-500'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Hover Card */}
                <div className="absolute left-[50%] -translate-x-[50%] top-full pt-1.5 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="bg-white/95 backdrop-blur-md border border-slate-150 rounded-2xl p-2 w-[340px] text-xs font-semibold text-slate-700 flex flex-col gap-1.5 shadow-2xl">
                    <button
                      onClick={() => {
                        setCurrentPage('enlevements');
                      }}
                      className="p-3 text-left hover:bg-emerald-50/65 rounded-xl transition-all duration-200 flex gap-2.5 items-start cursor-pointer group/item hover:translate-x-1"
                    >
                      <span className="text-lg">📦</span>
                      <div>
                        <div className="font-extrabold text-slate-950 group-hover/item:text-emerald-700 transition font-sans">Enlèvement d'encombrants</div>
                        <div className="text-[10px] text-slate-400 font-semibold font-sans">Pour particuliers & professionnels, tri, dont et recyclage</div>
                      </div>
                    </button>
                    
                    <button
                      disabled
                      className="p-3 text-left rounded-xl transition flex gap-2.5 items-start cursor-not-allowed opacity-40 border-t border-slate-100 select-none w-full"
                    >
                      <span className="text-lg grayscale">🧼</span>
                      <div>
                        <div className="font-extrabold text-slate-400 font-sans flex items-center gap-1.5 flex-wrap">
                          <span>Nettoyage de logements</span>
                          <span className="px-1.5 py-0.5 text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold uppercase tracking-wider">prochainement</span>
                        </div>
                        <div className="text-[10px] text-slate-450 font-semibold font-sans">Remise au propre complète de maisons & appartements</div>
                      </div>
                    </button>
 
                    <button
                      disabled
                      className="p-3 text-left rounded-xl transition flex gap-2.5 items-start cursor-not-allowed opacity-40 border-t border-slate-100 select-none w-full"
                    >
                      <span className="text-lg grayscale">🧹</span>
                      <div>
                        <div className="font-extrabold text-slate-400 font-sans flex items-center gap-1.5 flex-wrap">
                          <span>Entretien des parties communes</span>
                          <span className="px-1.5 py-0.5 text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold uppercase tracking-wider">prochainement</span>
                        </div>
                        <div className="text-[10px] text-slate-450 font-semibold font-sans">Lavage d'immeubles, désinfection halls & locaux poubelles</div>
                      </div>
                    </button>
 
                    <button
                      onClick={() => {
                        setCurrentPage('demenagement');
                      }}
                      className="p-3 text-left hover:bg-emerald-50/65 rounded-xl transition-all duration-200 flex gap-2.5 items-start cursor-pointer group/item border-t border-slate-100 hover:translate-x-1"
                    >
                      <span className="text-lg">🚚</span>
                      <div>
                        <div className="font-extrabold text-slate-950 group-hover/item:text-emerald-700 transition font-sans">Service de déménagement</div>
                        <div className="text-[10px] text-slate-400 font-semibold font-sans">Calculateur de trajet & d'objets de déménagement</div>
                      </div>
                    </button>
 
                    <button
                      disabled
                      className="p-3 text-left rounded-xl transition flex gap-2.5 items-start cursor-not-allowed opacity-40 border-t border-slate-100 select-none"
                    >
                      <span className="text-lg grayscale">🛠️</span>
                      <div>
                        <div className="font-extrabold text-slate-400 font-sans flex items-center gap-1.5 flex-wrap">
                          <span>Autres prestations de service</span>
                          <span className="px-1.5 py-0.5 text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-bold uppercase tracking-wider">prochainement</span>
                        </div>
                        <div className="text-[10px] text-slate-450 font-semibold font-sans">Terrassement mini-pelle, carport métalliques</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Interventions Tab */}
              <button 
                disabled
                className="text-xs px-4.5 py-2.5 rounded-full font-black uppercase tracking-wide flex items-center gap-1.5 border-2 border-slate-200 bg-slate-100 text-slate-400 opacity-60 cursor-not-allowed select-none shadow-sm"
                title="Service temporairement indisponible"
              >
                📸 Interventions <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-bold uppercase tracking-wider">indisponible</span>
              </button>
               
              <button 
                onClick={() => setActiveModal('estimation')}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-4.5 py-2.5 rounded-full font-black uppercase tracking-wide flex items-center gap-1.5 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transform cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
              >
                Obtenir une estimation
              </button>
            </div>

            {/* Sticky Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href="tel:0661292059"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-black uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-emerald-600/25 hover:scale-[1.02] transform cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>06 61 29 20 59</span>
              </a>
            </div>

            {/* Mobile Hamburger toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 text-slate-700 bg-slate-100 hover:bg-slate-150 rounded-xl transition cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 animate-pulse" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden border-t border-slate-100 bg-white px-4 pt-4 pb-6 space-y-4 shadow-xl overflow-hidden"
            >
              <div>
                <button
                  onClick={() => { setCurrentPage('enlevements'); setMobileMenuOpen(false); }}
                  className={`w-full text-left block p-3 text-sm font-black rounded-xl cursor-pointer transition-all duration-200 hover:translate-x-1 ${
                    ['enlevements', 'nettoyage', 'parties-communes', 'demenagement', 'autres-prestations'].includes(currentPage) ? 'text-emerald-800 bg-emerald-50 border border-emerald-100/50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Prestations & Services
                </button>
                <div className="pl-4 pr-1 mt-2 space-y-1.5 text-xs">
                  <button
                    onClick={() => {
                      setCurrentPage('enlevements');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg block font-semibold transition-all duration-200 hover:translate-x-1.5 ${
                      currentPage === 'enlevements' ? 'text-emerald-700 bg-emerald-50/60 font-bold' : 'text-slate-600 hover:text-emerald-600'
                    }`}
                  >
                    📦 Enlèvement d'encombrants
                  </button>
                  <button
                    disabled
                    className="w-full text-left py-2 px-3 rounded-lg block font-semibold opacity-40 cursor-not-allowed select-none text-slate-450"
                  >
                    🧼 Nettoyage logements <span className="ml-1 px-1.5 py-0.5 text-[8px] bg-slate-200 text-slate-600 rounded font-black uppercase tracking-wider select-none">prochainement</span>
                  </button>
                  <button
                    disabled
                    className="w-full text-left py-2 px-3 rounded-lg block font-semibold opacity-40 cursor-not-allowed select-none text-slate-450"
                  >
                    🧹 Entretien des parties comm. <span className="ml-1 px-1.5 py-0.5 text-[8px] bg-slate-200 text-slate-600 rounded font-black uppercase tracking-wider select-none">prochainement</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('demenagement');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg block font-semibold transition-all duration-200 hover:translate-x-1.5 ${
                      currentPage === 'demenagement' ? 'text-emerald-700 bg-emerald-50/60 font-bold' : 'text-slate-600 hover:text-emerald-600'
                    }`}
                  >
                    🚚 Service de déménagement
                  </button>
                  <button
                    disabled
                    className="w-full text-left py-2 px-3 rounded-lg block font-semibold opacity-40 cursor-not-allowed select-none text-slate-450"
                  >
                    🛠️ Autres prestations de service <span className="ml-1 px-1.5 py-0.5 text-[8px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded font-black uppercase tracking-wider select-none">prochainement</span>
                  </button>
                </div>
              </div>

              {/* Interventions Link on Mobile */}
              <div>
                <button
                  disabled
                  className="w-full text-left block p-3 text-sm font-black rounded-xl bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed select-none border border-slate-200/40"
                >
                  📸 Interventions <span className="ml-1 text-[9px] px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded font-bold uppercase tracking-wider">indisponible</span>
                </button>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => { setActiveModal('estimation'); setMobileMenuOpen(false); }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-500/15 block cursor-pointer transition-all duration-200 hover:translate-x-1 hover:scale-[1.01]"
                >
                  ✨ Obtenir une estimation
                </button>
                <a
                  href="tel:0661292059"
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-center text-xs font-black uppercase tracking-wider block transition-all duration-200 hover:translate-x-1"
                >
                  📞 Appeler : 06 61 29 20 59
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Conditionally rendered page content */}
      {currentPage === 'accueil' && (
        <>
          {/* Summary of Services Section */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="py-20 bg-slate-50/40 relative"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="text-center mb-16">
                  <span className="inline-block px-3.5 py-1.5 bg-emerald-100/70 backdrop-blur-sm text-emerald-800 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-200/40 font-sans">
                    Savoir-Faire & Fiabilité
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
                    Découvrez l'ensemble de mes services
                  </h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Card 1: Encombrants */}
                <ScrollReveal delay={0.1}>
                  <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs hover:shadow-lg hover:border-emerald-300/40 transition-all duration-300 flex flex-col justify-between h-[340px] group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200">
                        📦
                      </div>
                      <h3 className="font-display font-extrabold text-slate-900 text-lg">
                        Enlèvement d'encombrants
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                        Débarras d'appartements, maisons, bureaux commerciaux et caves. Intervention sous 24h/48h avec balayage et tri éco-responsable.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage('enlevements');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="mt-6 pt-4 border-t border-slate-100 font-extrabold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center justify-between cursor-pointer w-full text-left"
                    >
                      <span>Voir ce service</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </ScrollReveal>

                {/* Card 2: Nettoyage Logement */}
                <ScrollReveal delay={0.2}>
                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-200/60 flex flex-col justify-between h-[340px] opacity-60 select-none">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-200/50 border border-slate-300/40 flex items-center justify-center text-2xl grayscale">
                        🧼
                      </div>
                      <h3 className="font-display font-extrabold text-slate-500 text-lg flex items-center gap-1.5 flex-wrap">
                        <span>Nettoyage Logements</span>
                        <span className="px-1.5 py-0.5 text-[8px] bg-slate-200 text-slate-600 rounded font-bold uppercase tracking-wider">prochainement</span>
                      </h3>
                      <p className="text-slate-450 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                        Ménage minutieux de fin de bail, de chantier ou traitement de salubrité diogène de vos appartements ou maisons.
                      </p>
                    </div>
                    <div
                      className="mt-6 pt-4 border-t border-slate-150 font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between cursor-not-allowed w-full text-left"
                    >
                      <span>Bientôt disponible</span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Card 3: Entretien Parties Communes */}
                <ScrollReveal delay={0.3}>
                  <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-200/60 flex flex-col justify-between h-[340px] opacity-60 select-none">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-200/50 border border-slate-300/40 flex items-center justify-center text-2xl grayscale">
                        🧹
                      </div>
                      <h3 className="font-display font-extrabold text-slate-500 text-lg flex items-center gap-1.5 flex-wrap">
                        <span>Parties Communes</span>
                        <span className="px-1.5 py-0.5 text-[8px] bg-slate-200 text-slate-600 rounded font-bold uppercase tracking-wider">prochainement</span>
                      </h3>
                      <p className="text-slate-450 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                        Contrat d'entretien pour immeubles de copropriété. Balayage hebdomadaire, lavage des halls et gestion des bacs poubelles.
                      </p>
                    </div>
                    <div
                      className="mt-6 pt-4 border-t border-slate-150 font-extrabold text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between cursor-not-allowed w-full text-left"
                    >
                      <span>Bientôt disponible</span>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Card 4: Déménagement */}
                <ScrollReveal delay={0.4}>
                  <div className="bg-white rounded-3xl p-6 border border-slate-150 shadow-xs hover:shadow-lg hover:border-emerald-300/40 transition-all duration-300 flex flex-col justify-between h-[340px] group">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200">
                        🚚
                      </div>
                      <h3 className="font-display font-extrabold text-slate-900 text-lg">
                        Service de déménagement
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                        Transport de mobilier, transfert de charges volumineuses ou aide logistique avec calculateur de volume précis et devis immédiat.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage('demenagement');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="mt-6 pt-4 border-t border-slate-100 font-extrabold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center justify-between cursor-pointer w-full text-left"
                    >
                      <span>Voir ce service</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </motion.section>

          {/* Calculator Container Panel inside landing page */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            id="formulaire-devis"
            className="py-20 relative bg-slate-50/30 border-t border-slate-100"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="text-center mb-8">
                  <span className="inline-block px-3.5 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-200/40 font-sans">
                    Simulateurs Interactifs
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900">
                    Estimez votre prix immédiatement
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mt-2 font-semibold">
                    Choisissez le simulateur adapté à votre besoin pour obtenir une estimation de devis en temps réel.
                  </p>
                </div>
              </ScrollReveal>

              {/* Tab Selector */}
              <ScrollReveal delay={0.15}>
                <div className="flex justify-center mb-10">
                  <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-1.5 border border-slate-200 shadow-inner w-full sm:w-auto">
                    <button
                      onClick={() => setActiveHomeCalcTab('encombrants')}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer font-sans ${
                        activeHomeCalcTab === 'encombrants'
                          ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/30'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <span>📦 Débarras / Encombrants</span>
                    </button>
                    <button
                      onClick={() => setActiveHomeCalcTab('demenagement')}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer font-sans ${
                        activeHomeCalcTab === 'demenagement'
                          ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/30'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <span>🚚 Déménagement</span>
                    </button>
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-not-allowed font-sans opacity-40 select-none text-slate-400"
                    >
                      <span>🧼 Nettoyage <span className="ml-1 text-[8px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded uppercase font-black">prochainement</span></span>
                    </button>
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-not-allowed font-sans opacity-40 select-none text-slate-400"
                    >
                      <span>🏢 Parties Comm. <span className="ml-1 text-[8px] bg-slate-200 text-slate-600 px-1 py-0.5 rounded uppercase font-black">prochainement</span></span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Active Calculator widget */}
              <ScrollReveal delay={0.25}>
                <div className="bg-white/40 backdrop-blur-md rounded-4xl border border-slate-100 shadow-xs p-1 md:p-3">
                  <React.Suspense fallback={<LoadingSpinner />}>
                    {activeHomeCalcTab === 'encombrants' && (
                      <VolumeCalculator onQuoteSubmitted={handleQuoteSubmitted} />
                    )}
                    {activeHomeCalcTab === 'demenagement' && (
                      <DemenagementCalculator onQuoteSubmitted={handleQuoteSubmitted} />
                    )}
                  </React.Suspense>
                  {activeHomeCalcTab === 'nettoyage' && (
                    <div className="p-8 text-center bg-slate-50/50 rounded-3xl border border-slate-150 py-16">
                      <span className="text-4xl block mb-3 grayscale">🧼</span>
                      <h4 className="font-display font-black text-slate-400 text-lg">Simulateur Nettoyage bientôt disponible</h4>
                      <span className="mt-2 inline-block px-2.5 py-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-200 rounded">prochainement</span>
                    </div>
                  )}
                  {activeHomeCalcTab === 'parties-communes' && (
                    <div className="p-8 text-center bg-slate-50/50 rounded-3xl border border-slate-150 py-16">
                      <span className="text-4xl block mb-3 grayscale">🏢</span>
                      <h4 className="font-display font-black text-slate-400 text-lg">Simulateur Parties Communes bientôt disponible</h4>
                      <span className="mt-2 inline-block px-2.5 py-1 text-[10px] uppercase font-bold text-slate-500 bg-slate-200 rounded">prochainement</span>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          </motion.section>



          {/* Section cartographique interactive de la zone d'intervention */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <ScrollReveal delay={0.1}>
              <React.Suspense fallback={<LoadingSpinner />}>
                <InterventionZoneMap />
              </React.Suspense>
            </ScrollReveal>
          </motion.div>

        </>
      )}

      {currentPage === 'enlevements' && (
        <section id="enlevements-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh]">
          
          {/* Grid Layout including "Disponibilité & Chiffres Clés" as requested */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="inline-block px-3.5 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-200/40 font-sans">
                Prestations &bull; Enlèvement d'encombrants
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 leading-tight">
                Un débarras et enlèvement d'encombrants sur-mesure
              </h2>
            </div>
            
            <div className="lg:col-span-5">
              <div className="bg-white shadow-xs rounded-3xl border border-slate-150 p-6 md:p-8 space-y-6">
                <h3 className="font-display font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  ✨ Disponibilité & Chiffres Clés
                </h3>
                
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/40 text-center"
                  >
                    <div className="text-2xl font-black text-emerald-700 font-display">
                      <StatCounter endValue={5} suffix="j / 7" />
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1 font-sans">Disponibilité</div>
                  </motion.div>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/40 text-center"
                  >
                    <div className="text-2xl font-black text-emerald-700 font-display">
                      <StatCounter endValue={300} suffix="+" />
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1 font-sans">Débarras Réalisés</div>
                  </motion.div>
                </div>

                <ul className="space-y-3.5">
                  <li className="flex items-start gap-2.5">
                    <div className="p-1 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 mt-0.5 border border-emerald-100">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Intervention rapide de proximité</h4>
                      <p className="text-[10px] text-slate-500 font-semibold font-sans leading-relaxed">Débarras et nettoyage sous 24h à 48h selon vos contraintes.</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-2.5">
                    <div className="p-1 bg-emerald-50 text-emerald-700 rounded-lg shrink-0 mt-0.5 border border-emerald-100">
                      <Scale className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Tarification transparente au m³</h4>
                      <p className="text-[10px] text-slate-500 font-semibold font-sans leading-relaxed">Aucun frais caché. Le trajet, les frais de déchetterie et le tri sont inclus.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Infinite scrolling partner brands (LTR) */}
          <div className="w-full overflow-hidden pt-6 pb-8 bg-white/30 backdrop-blur-md rounded-3xl border border-white/60 shadow-sm mb-16 relative">
            <div className="text-center mb-5">
              <span className="inline-block px-3.5 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-200/40 font-sans">
                Ils me font confiance pour l'enlèvement
              </span>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-100/30 to-transparent z-10 pointer-events-none rounded-l-3xl"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-100/30 to-transparent z-10 pointer-events-none rounded-r-3xl"></div>
            <div className="relative w-full flex overflow-x-hidden">
              <div className="animate-marquee-ltr whitespace-nowrap flex gap-12 items-center">
                {[
                  {
                    name: 'Pichet Immobilier',
                    logo: (
                      <img 
                        src={pichetLogo} 
                        alt="Pichet Immobilier" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Cabinet Bedin',
                    logo: (
                      <img 
                        src={cabinetBedinLogo} 
                        alt="Cabinet Bedin" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Actia Concept',
                    logo: (
                      <img 
                        src={actiaConceptLogo} 
                        alt="Actia Concept" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Crédit Agricole Immobilier',
                    logo: (
                      <img 
                        src={creditAgricoleLogo} 
                        alt="Crédit Agricole Immobilier" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Immo de France Aquitaine',
                    logo: (
                      <img 
                        src={immoAquitaineLogo} 
                        alt="Immo de France Aquitaine" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  }
                ].map((partner, index) => (
                  <div key={`p1-${index}`} className="flex items-center justify-center bg-white hover:bg-white transition duration-300 w-44 h-24 p-1 rounded-2xl border border-slate-100/90 shadow-sm hover:shadow-md shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      {partner.logo}
                    </div>
                  </div>
                ))}
                {/* Repeat for looping */}
                {[
                  {
                    name: 'Pichet Immobilier',
                    logo: (
                      <img 
                        src={pichetLogo} 
                        alt="Pichet Immobilier" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Cabinet Bedin',
                    logo: (
                      <img 
                        src={cabinetBedinLogo} 
                        alt="Cabinet Bedin" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Actia Concept',
                    logo: (
                      <img 
                        src={actiaConceptLogo} 
                        alt="Actia Concept" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Crédit Agricole Immobilier',
                    logo: (
                      <img 
                        src={creditAgricoleLogo} 
                        alt="Crédit Agricole Immobilier" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  },
                  {
                    name: 'Immo de France Aquitaine',
                    logo: (
                      <img 
                        src={immoAquitaineLogo} 
                        alt="Immo de France Aquitaine" 
                        className="w-full h-full object-contain rounded-xl" 
                        referrerPolicy="no-referrer" 
                        loading="lazy"
                      />
                    )
                  }
                ].map((partner, index) => (
                  <div key={`p2-${index}`} className="flex items-center justify-center bg-white hover:bg-white transition duration-300 w-44 h-24 p-1 rounded-2xl border border-slate-100/90 shadow-sm hover:shadow-md shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      {partner.logo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Service Card 1: Particuliers */}
              <div id="particuliers-section" className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm hover:bg-white/70 hover:shadow-xl hover:border-emerald-300/50 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-3xl">
                    🏠
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-xl">Pour les Particuliers</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Appartements, maisons pavillonnaires ou résidences secondaires. Idéal suite à une succession notariale, un déménagement d'immeuble sans ascenseur ou l'évacuation d'encombrants accumulés.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-2 pt-3">
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">✨ Nettoyage & Balayage en fin de journée</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">📦 Tri sélectif des souvenirs précieux</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">📋 Solutions Diogène et réhabilitation</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('simulateur-enlevement');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="mt-8 pt-4 border-t border-slate-200/60 font-bold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer text-left w-full"
                >
                  <span>Estimer mon volume</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Service Card 2: Professionnels */}
              <div id="professionnels-section" className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm hover:bg-white/70 hover:shadow-xl hover:border-emerald-300/50 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-3xl">
                    🏢
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-xl">Pour les Professionnels</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Copropriétés, appartements en location, bureaux, locaux commerciaux. Une offre sur-mesure pour les syndics, agences de location et bailleurs sociaux. Peu importe l'encombrement, je suis professionnel et j'interviens avec rigueur, respect, et réalise un balayage à la fin de chaque chantier.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-2 pt-3">
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">🏬 Pour syndics, agences de location & bailleurs sociaux</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">💼 Copropriétés, appartements, bureaux & locaux</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">✨ Intervention rigoureuse, respectueuse & balayage final</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('simulateur-enlevement');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="mt-8 pt-4 border-t border-slate-200/60 font-bold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer text-left w-full"
                >
                  <span>Estimer mon volume</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dons & Recyclage visual segment integrated directly into encombrants */}
            <div className="bg-emerald-50/50 backdrop-blur-md rounded-3xl p-8 border border-emerald-150/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200/50 flex items-center justify-center text-3xl mb-4">
                      ♻️
                    </div>
                    <h3 className="font-display font-bold text-emerald-900 text-xl">Dons & Éco-Recyclage</h3>
                    <p className="text-slate-650 text-xs md:text-sm mt-2 leading-relaxed font-sans font-medium">
                      Une politique zéro-gaspillage stricte. Les objets réutilisables sont redistribués au tissu associatif d'entraide, les déchets sont ségrégués en décharge certifiée.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveModal('recycling')}
                    className="mt-6 font-bold text-xs uppercase tracking-wider text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <span>Détails de mes filières</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-xs">
                    <h4 className="font-bold text-xs text-emerald-850 uppercase tracking-wider mb-2">🤝 Associatifs</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
                      Je travaille avec des associations caritatives locales pour redistribuer vêtements, vaisselle, mobiliers d'appoint et jeux d'enfants directement aux personnes en ayant le plus besoin.
                    </p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-xs">
                    <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">🌱 Valorisation Verte</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
                      Les matériaux abîmés ou irréparables (métaux, cartons, bois, plastiques) sont triés puis déversés dans un centre agréé de tri environnemental régional (DEEE/Bordereaux de Suivi).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Volume Calculator */}
            <div id="simulateur-enlevement" className="bg-slate-50/65 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-slate-200/60 shadow-sm mt-12">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider mb-2 font-mono">
                  🔋 Simulateur m³ de référence
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 font-display">
                  Simulateur de volume d'encombrants
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  Estimez instantanément le volume total en mètres cubes (m³) de vos objets et mobiliers à évacuer.
                </p>
              </div>
              <div className="bg-white/40 backdrop-blur-md rounded-4xl border border-slate-100 shadow-xs p-1 md:p-3">
                <React.Suspense fallback={<LoadingSpinner />}>
                  <VolumeCalculator onQuoteSubmitted={handleQuoteSubmitted} />
                </React.Suspense>
              </div>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'nettoyage' && (
        <section id="nettoyage-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh]">
          <div className="text-center mb-16">
            <span className="inline-block px-3.5 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-200/40 font-sans">
              Prestations &bull; Ménage de Logements
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900">
              Nettoyage complet de logements (Maisons & Appartements)
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mt-3 font-medium">
              Suite à un débarras, avant une mise en vente notariale, pour un état des lieux locatif ou pour la réhabilitation complète d'un logement insalubre (Syndrome Diogène).
            </p>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Option 2A: Maisons */}
              <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm hover:bg-white/70 hover:shadow-xl hover:border-emerald-300/50 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-3xl">
                    🏡
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-lg">Nettoyage Maisons & Villas</h4>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify md:text-left">
                    Un service de nettoyage intégral, de la cave au grenier. Adapté aux grands volumes, terrasses, garages et dépendances extérieures pour valoriser votre patrimoine.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-2 pt-3">
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">🧼 Lessivage intégral des murs, plinthes et portes</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">🚿 Désinfection complète des sanitaires et cuisines</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">🧽 Lessivage de terrasses</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('simulateur-nettoyage');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="mt-8 pt-4 border-t border-slate-200/60 font-bold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer text-left w-full"
                >
                  <span>Demander un forfait maison</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Option 2B: Appartements */}
              <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/60 shadow-sm hover:bg-white/70 hover:shadow-xl hover:border-emerald-300/50 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-3xl">
                    🏢
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-lg">Nettoyage Appartements & Studios</h4>
                  <p className="text-slate-600 text-sm leading-relaxed text-justify md:text-left">
                    Nettoyage technique après-départ d'un locataire ou avant un état des lieux de sortie. Je garantis la remise en état conforme du logement.
                  </p>
                  <ul className="text-xs text-slate-500 space-y-2 pt-3">
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">✨ Dépoussiérage méticuleux et nettoyage de tous les vitrages</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">🧹 Shampouinage professionnel des moquettes ou parquets</li>
                    <li className="flex items-center gap-1.5 font-bold text-slate-600 font-sans">📦 Tri et mise au rebut immédiat de tous les résidus</li>
                  </ul>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('simulateur-nettoyage');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="mt-8 pt-4 border-t border-slate-200/60 font-bold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1.5 cursor-pointer text-left w-full"
                >
                  <span>Demander un forfait appartement</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 bg-emerald-50/60 rounded-3xl border border-emerald-100 inline-block w-full text-center shadow-xs">
              <span className="text-emerald-800 font-bold text-sm uppercase tracking-wider block mb-2 font-display">💡 Forfait Combiné Débarras + Nettoyage</span>
              <p className="text-slate-700 text-xs md:text-sm max-w-3xl mx-auto leading-relaxed font-sans font-medium">
                En programmant à la fois votre débarras d'encombrants et le nettoyage complet de votre logement, bénéficiez de conditions tarifaires avantageuses et de la certitude d'un travail soigné, coordonné par un seul et unique interlocuteur de confiance.
              </p>
            </div>

            {/* Interactive Calculator: Nettoyage */}
            <div id="simulateur-nettoyage" className="bg-slate-50/60 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-slate-200/60 shadow-sm mt-12 font-sans">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider mb-2 font-mono">
                  ⏱️ Estimation instantanée
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 font-display">
                  Simulateur de Tarif Nettoyage Logement
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  Estimez le budget de votre nettoyage résidentiel en temps réel en ajustant les paramètres ci-dessous.
                </p>
              </div>
              <React.Suspense fallback={<LoadingSpinner />}>
                <NettoyageCalculator onQuoteRequest={handleQuoteRequest} />
              </React.Suspense>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'parties-communes' && (
        <section id="parties-communes-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh]">
          <div className="text-center mb-16">
            <span className="inline-block px-3.5 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-200/40 font-sans">
              Prestations &bull; Parties Communes
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900">
              Entretien & Nettoyage des Parties Communes de copropriétés
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mt-3 font-medium">
              Lavage, aspiration, évacuation d'urgence des encombrants et désinfection minutieuse des copropriétés, cages d'escalier et locaux de rangement d'immeubles résidentiels.
            </p>
          </div>

          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* PC card 1 */}
              <div className="bg-white/60 p-6 md:p-8 rounded-3xl border border-slate-150/80 shadow-xs hover:border-emerald-200 hover:bg-white/85 transition duration-200 flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-3">🧹</span>
                  <h4 className="font-bold text-base text-slate-900 mb-2 font-display">Halls & Escaliers</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                    Aspiration et lavage humide régulier des sols de cages d'escalier et rez-de-chaussée. Nettoyage des rampes, poignées de portes d'entrée, boutons d'ascenseurs et dépoussiérage des boîtes aux lettres d'allées.
                  </p>
                </div>
              </div>

              {/* PC card 2 */}
              <div className="bg-white/60 p-6 md:p-8 rounded-3xl border border-slate-150/80 shadow-xs hover:border-emerald-200 hover:bg-white/85 transition duration-200 flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-3">🗑️</span>
                  <h4 className="font-bold text-base text-slate-900 mb-2 font-display">Conteneurs & Poubelles</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                    Sortie et rentrée réglementée des bacs roulants collectifs aux heures fixées par la voirie urbaine. Désinfection périodique, balayage humidifié et contrôle sanitaire régulier des locaux de rangement poubelles.
                  </p>
                </div>
              </div>

              {/* PC card 3 */}
              <div className="bg-white/60 p-6 md:p-8 rounded-3xl border border-slate-150/80 shadow-xs hover:border-emerald-200 hover:bg-white/85 transition duration-200 flex flex-col justify-between">
                <div>
                  <span className="text-3xl block mb-3">🌱</span>
                  <h4 className="font-bold text-base text-slate-900 mb-2 font-display">Extérieurs & Sous-sols</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                    Nettoyage des espaces communs extérieurs d'immeuble (abords de parkings, allées de résidences, locaux de vélos fermés) et évacuation rapide de tous les dépôts sauvages d'objets ou de cartons suspects.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/55 backdrop-blur-md rounded-3xl p-8 border border-white/60 text-slate-700 text-xs md:text-sm leading-relaxed max-w-4xl mx-auto space-y-6">
              <h4 className="font-display font-black text-slate-950 uppercase tracking-widest text-xs md:text-sm text-center">Mes atouts pour l'entretien de copropriétés</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1 font-bold text-lg">✓</span>
                  <div>
                    <span className="font-bold text-slate-900 block font-sans text-sm">Fréquence sur-mesure</span>
                    <span className="text-xs text-slate-500 font-sans font-medium">Formule à la carte : quotidiennes (du lundi au vendredi), hebdomadaires, bi-mensuelles ou mensuelles.</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1 font-bold text-lg">✓</span>
                  <div>
                    <span className="font-bold text-slate-900 block font-sans text-sm">Cahier des charges strict</span>
                    <span className="text-xs text-slate-500 font-sans font-medium">Fiche de passage émargée après chaque lavage garantissant la présence et la ponctualité.</span>
                  </div>
                </div>
              </div>
              <div className="text-center pt-4 border-t border-slate-100 font-sans">
                <button
                  onClick={() => {
                    setCurrentPage('accueil');
                    setTimeout(() => {
                      const el = document.getElementById('formulaire-devis');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 150);
                  }}
                  className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  <span>Obtenir un devis personnalisé pour mon syndic ou bailleur</span> <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Calculator: Parties Communes */}
            <div id="simulateur-parties-communes" className="bg-slate-50/65 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-slate-200/60 shadow-sm mt-12 font-sans">
              <div className="max-w-3xl mx-auto text-center mb-8">
                <span className="inline-block px-3 py-1 bg-emerald-100/70 text-emerald-800 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider mb-2 font-mono">
                  🏢 Simulation Syndics & Conseil Syndical
                </span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 font-display">
                  Simulateur de Budget Parties Communes
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  Estimez instantanément le budget récurrent pour l'entretien de votre copropriété résidentielle.
                </p>
              </div>
              <React.Suspense fallback={<LoadingSpinner />}>
                <PartiesCommunesCalculator onQuoteRequest={handleQuoteRequest} />
              </React.Suspense>
            </div>

          </div>
        </section>
      )}







      {currentPage === 'demenagement' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 min-h-[70vh]">
          {/* Header section */}
          <div className="text-center mb-12">
            <span className="inline-block px-3.5 py-1 bg-emerald-100/60 backdrop-blur-sm text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-emerald-200/40 font-sans">
              Service de Déménagement
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-display text-slate-900 leading-tight">
              Calculateur de Déménagement
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
              Estimez instantanément le montant de votre déménagement en combinant la distance kilométrique de votre trajet et les objets à transporter.
            </p>
          </div>

          <React.Suspense fallback={<LoadingSpinner />}>
            <DemenagementCalculator onQuoteSubmitted={handleQuoteSubmitted} />
          </React.Suspense>

          </section>
      )}

      {currentPage === 'autres-prestations' && (
        <React.Suspense fallback={<LoadingSpinner />}>
          <AutresPrestations onQuoteSubmitted={handleQuoteSubmitted} />
        </React.Suspense>
      )}

      {currentPage === 'galerie' && (
        <div className="bg-slate-50 min-h-[70vh]">
          <React.Suspense fallback={<LoadingSpinner />}>
            <BeforeAfterGallery />
          </React.Suspense>
        </div>
      )}

      {/* Conseils Débarras & FAQ Sections - Persistent bottom band above footer */}
      <React.Suspense fallback={<LoadingSpinner />}>
        <ConseilsAndFAQ />
      </React.Suspense>

      {/* Textual Sitemap for advanced SEO navigation */}
      <React.Suspense fallback={<LoadingSpinner />}>
        <SitemapTextuel setCurrentPage={setCurrentPage} setActiveModal={setActiveModal} />
      </React.Suspense>

      {/* Section Zones d'Intervention Détaillées pour l'optimisation du maillage local / SEO */}
      <div className="bg-slate-900 pb-12 pt-2 px-4 sm:px-6 lg:px-8 border-t border-slate-850">
        <div className="max-w-7xl mx-auto border-t border-slate-800/65 pt-6">
          <button
            onClick={() => setIsZonesExpanded(!isZonesExpanded)}
            className="flex items-center gap-2 text-slate-450 hover:text-slate-200 transition text-[11px] font-extrabold uppercase tracking-wider cursor-pointer"
          >
            <span>Zones d'Intervention Détaillées</span>
            {isZonesExpanded ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
          </button>
          
          <AnimatePresence>
            {isZonesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3.5">
                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                    AlloServices33 intervient rapidement pour vos débarras, déménagements et nettoyages professionnels dans l'ensemble de la métropole bordelaise et de la Gironde (33). Retrouvez ci-dessous la liste détaillée de nos secteurs d'activité :
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-2 text-[10px] text-slate-400 font-semibold">
                    {[
                      "Bordeaux Centre (33000)", "Mérignac (33700)", "Pessac (33600)", "Talence (33400)", "Villenave-d'Ornon (33140)", 
                      "Saint-Médard-en-Jalles (33160)", "Bègles (33130)", "Gradignan (33170)", "Cenon (33150)", "Libourne (33500)", 
                      "Lormont (33310)", "Le Bouscat (33110)", "Eysines (33320)", "Floirac (33270)", "Cestas (33610)", "Blanquefort (33290)", 
                      "Bruges (33520)", "Ambarès-et-Lagrave (33440)", "La Teste-de-Buch (33260)", "Gujan-Mestras (33470)", 
                      "Arcachon (33120)", "Andernos-les-Bains (33510)", "Le Haillan (33185)", "Parempuyre (33290)", 
                      "Martignas-sur-Jalle (33127)", "Taillan-Médoc (33320)", "Saint-Loubès (33450)", "Artigues-près-Bordeaux (33370)", 
                      "Carbon-Blanc (33560)", "Sainte-Eulalie (33560)", "Saint-Jean-d'Illac (33127)", "Le Pian-Médoc (33290)"
                    ].map((city) => (
                      <a
                        key={city}
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage('accueil');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="hover:text-emerald-400 hover:underline transition-all block py-0.5 truncate"
                        title={`Service de débarras et déménagement à ${city}`}
                      >
                        Débarras {city}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Schema.org JSON-LD Structured Data for LocalBusiness SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "AlloServices33 - Débarras, Encombrants & Déménagement Gironde",
            "image": "https://images.unsplash.com/photo-1600513524458-297ba52937ae?auto=format&fit=crop&q=80&w=800",
            "@id": "https://damien-pommier-debarras.fr/#localbusiness",
            "url": "https://damien-pommier-debarras.fr",
            "telephone": "+33661292059",
            "priceRange": "€€",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Bordeaux et communes de la Gironde",
              "addressLocality": "Bordeaux",
              "addressRegion": "Gironde",
              "postalCode": "33000",
              "addressCountry": "FR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 44.837789,
              "longitude": -0.57918
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
              ],
              "opens": "07:00",
              "closes": "20:00"
            },
            "sameAs": [
              "https://wa.me/33661292059"
            ],
            "areaServed": [
              { "@type": "AdministrativeArea", "name": "Bordeaux" },
              { "@type": "AdministrativeArea", "name": "Gironde" },
              { "@type": "AdministrativeArea", "name": "Mérignac" },
              { "@type": "AdministrativeArea", "name": "Pessac" },
              { "@type": "AdministrativeArea", "name": "Talence" },
              { "@type": "AdministrativeArea", "name": "Villenave-d'Ornon" },
              { "@type": "AdministrativeArea", "name": "Bègles" },
              { "@type": "AdministrativeArea", "name": "Libourne" },
              { "@type": "AdministrativeArea", "name": "Cestas" },
              { "@type": "AdministrativeArea", "name": "Gradignan" }
            ]
          })
        }}
      />

      {/* Schema.org JSON-LD Structured Data for FAQPage SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Quels sont vos secteurs et communes d'intervention autour de Bordeaux et en Gironde ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Damien Pommier intervient rapidement (sous 24h à 48h) dans toutes les villes dans un rayon de 50km autour de Bordeaux et plus généralement dans l'ensemble du département de la Gironde (33). Les principales communes desservies comprennent : Bordeaux (33000), Mérignac (33700), Pessac (33600), Talence (33400), Villenave-d'Ornon (33140), Saint-Médard-en-Jalles (33160), Bègles (33130), Cenon (33150), Gradignan (33170), Lormont (33310), Eysines (33320), Cestas (33610), Floirac (33270), Blanquefort (33290), Bruges (33520), Ambarès-et-Lagrave (33440), Le Bouscat (33110), Léognan (33850), Saint-André-de-Cubzac (33240), Libourne (33500), Gujan-Mestras (33470), Castelnau-de-Médoc (33480), Créon (33670), Saint-Jean-d'Illac (33127), Martignas-sur-Jalle (33127), Canéjan (33610), Carbon-Blanc (33560), Bassens (33530), Saint-Loubès (33450), Artigues-près-Bordeaux (33370), Parempuyre (33290), Le Taillan-Médoc (33320), Saint-Aubin-de-Médoc (33160), Ludon-Médoc (33290), Macau (33460), Langon (33210), Cadillac (33410), Podensac (33720), Portets (33640), Saint-Sulpice-et-Cameyrac (33450), Bouliac (33270), Latresne (33360), Fargues-Saint-Hilaire (33370), Sadirac (33670), Carignan-de-Bordeaux (33360), Blaye (33390), Saint-Émilion (33330), Izon (33240), Saint-Denis-de-Pile (33910), Coutras (33230), Biganos (33380), Audenge (33980), Lanton (33138), Andernos-les-Bains (33510), Marcheprime (33380), Salles (33770), Belin-Béliet (33830), Saint-Selve (33650), La Brède (33650), Martillac (33650), Beautiran (33640), Castres-Gironde (33640), Arsac (33460), Le Pian-Médoc (33290), Saucats (33650), Le Barp (33114), Tresses (33370), Yvrac (33370), Cénac (33360), Camblanes-et-Meynac (33360), Quinsac (33360), Saint-Caprais-de-Bordeaux (33880), Lignan-de-Bordeaux (33360), Sainte-Eulalie (33560), Montussan (33450), Beychac-et-Caillau (33750), Vayres (33870), Arveyres (33500), Fronsac (33126), Saint-Germain-du-Puch (33750), Baron (33750), Nérigean (33750)... Nous nous déplaçons gratuitement pour évaluer le volume à vider et vous proposer un devis personnalisé."
                }
              },
              {
                "@type": "Question",
                "name": "Quels sont vos tarifs pour un débarras en Gironde ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Nos tarifs sont calculés de manière transparente et sur-mesure. Ils dépendent de trois facteurs clés : le volume total à évacuer (en m³), l'accessibilité des locaux (étages, ascenseur, distance de portage jusqu'au camion) et l'éventuelle valeur des objets récupérables (qui vient en déduction du coût de l'intervention)."
                }
              },
              {
                "@type": "Question",
                "name": "Combien de temps dure une intervention classique ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "La plupart de nos débarras de caves, garages ou appartements se font en une seule journée. Pour des maisons entières ou des chantiers Diogène très encombrés, l'intervention peut s'étendre sur 2 à 3 jours. Nous nous engageons à respecter scrupuleusement les délais convenus."
                }
              },
              {
                "@type": "Question",
                "name": "Que faites-vous des affaires personnelles et documents importants ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "La discrétion et le respect de votre vie privée sont nos priorités. Lors du débarras, si nous découvrons des photos de famille, des testaments, des actes notariés, des bijoux ou de l'argent liquide, nous les mettons immédiatement de côté dans un carton sécurisé que nous vous remettons en main propre à la fin du chantier."
                }
              },
              {
                "@type": "Question",
                "name": "Intervenez-vous pour des cas de syndrome de Diogène ou de logements insalubres ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Oui, nous sommes équipés et formés pour intervenir dans les situations d'insalubrité extrême, de logement de personnes atteintes du syndrome de Diogène ou après des sinistres. Nous réalisons le tri, l'évacuation complète des déchets, le nettoyage minutieux et la désinfection totale des pièces."
                }
              },
              {
                "@type": "Question",
                "name": "Comment puis-je obtenir un devis ou une estimation précise ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "C'est très simple et gratuit ! Vous pouvez utiliser notre simulateur de m³ en ligne ci-dessus, nous appeler directement au 06 61 29 20 59, ou nous envoyer des photos du chantier par SMS ou par email. Si nécessaire, nous nous déplaçons gratuitement chez vous pour évaluer le travail et vous proposer un devis ferme sous 24h."
                }
              }
            ]
          })
        }}
      />

      {/* Beautiful styled premium footer with modal anchors */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-10 border-t border-slate-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
            
            {/* Box 1: Brand & Logo (Saves 4 cols) */}
            <div className="space-y-4 lg:col-span-4">
              <button 
                onClick={() => {
                  setCurrentPage('accueil');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsLogoModalOpen(true);
                }}
                className="flex items-center gap-3 hover:opacity-80 transition text-left cursor-pointer focus:outline-none"
              >
                <img
                  src={humanPhoto}
                  alt="Logo AlloServices33"
                  className="w-14 h-14 object-cover rounded-xl shadow-md border border-emerald-500/10"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <span className="font-display font-black text-slate-100 text-lg tracking-tight">AlloServices33</span>
              </button>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm font-semibold">
                Spécialiste de l'enlèvement des encombrants.
                <br />
                Une rigueur professionnelle au service des agences immobilières (syndics, gestion locative, bailleurs sociaux) & des particuliers.
              </p>
            </div>

            {/* Box 2: Prestations quick navigations (Saves 2 cols) */}
            <div className="space-y-4 lg:col-span-2">
              <h4 className="text-slate-200 text-xs font-black uppercase tracking-wider font-display">Prestations</h4>
              <ul className="space-y-2.5 text-xs text-slate-500 font-semibold">
                <li>
                  <button 
                    onClick={() => { setCurrentPage('enlevements'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="hover:text-emerald-500 transition cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>📦</span> Enlèvement Encombrants
                  </button>
                </li>
                <li>
                  <span className="text-slate-600 select-none flex items-center gap-1.5 cursor-not-allowed opacity-50">
                    <span>🧼</span> Nettoyage Logement <span className="text-[8px] bg-slate-900 text-slate-500 px-1 py-0.5 rounded uppercase font-black font-sans leading-none">bientôt</span>
                  </span>
                </li>
                <li>
                  <span className="text-slate-600 select-none flex items-center gap-1.5 cursor-not-allowed opacity-50">
                    <span>🧹</span> Entretien Parties Communes <span className="text-[8px] bg-slate-900 text-slate-500 px-1 py-0.5 rounded uppercase font-black font-sans leading-none">bientôt</span>
                  </span>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentPage('demenagement'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="hover:text-emerald-500 transition cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>🚚</span> Service de Déménagement
                  </button>
                </li>
              </ul>
            </div>

            {/* Box 3: Services par Ville (Saves 3 cols) */}
            <div className="space-y-4 lg:col-span-3">
              <h4 className="text-slate-200 text-xs font-black uppercase tracking-wider font-display">Services par Ville</h4>
              <ul className="space-y-2 text-xs text-slate-500 font-semibold">
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage('accueil');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 hover:underline transition block"
                  >
                    Débarras Mérignac (33700)
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage('accueil');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 hover:underline transition block"
                  >
                    Débarras Pessac (33600)
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage('accueil');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 hover:underline transition block"
                  >
                    Débarras Talence (33400)
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage('accueil');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 hover:underline transition block"
                  >
                    Débarras Villenave-d'Ornon (33140)
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage('accueil');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-400 hover:underline transition block"
                  >
                    Débarras Bègles (33130)
                  </a>
                </li>
              </ul>
            </div>

            {/* Box 4: Direct contact call cards (Saves 3 cols) */}
            <div className="space-y-4 lg:col-span-3">
              <h4 className="text-slate-200 text-xs font-black uppercase tracking-wider font-display">Contact Direct</h4>
              <div className="space-y-2.5 text-xs font-semibold">
                <div>
                  <a href="tel:0661292059" className="text-slate-100 hover:text-emerald-400 transition flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>06 61 29 20 59</span>
                  </a>
                </div>
                <div>
                  <a
                    href="https://wa.me/33661292059?text=Bonjour%20Damien%20Pommier%2C%20je%20souhaiterais%20obtenir%20des%20informations%20concernant%20un%20projet%20de%20d%C3%A9barras%20ou%20d%C3%A9m%C3%A9nagement."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-100 hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-[#25D366] shrink-0"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.068 2.877 1.216 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>06 61 29 20 59</span>
                  </a>
                </div>
                <div className="pt-1">
                  <a href="mailto:damien.societe@outlook.com" className="text-slate-100 hover:text-emerald-400 transition break-all font-mono text-[11px] block">
                    damien.societe@outlook.com
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[11px] font-semibold">
            <div>
              &copy; {new Date().getFullYear()} AlloServices33. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveModal('legals')} className="hover:text-emerald-400 transition cursor-pointer">Mentions Légales</button>
              <button onClick={() => setIsDrawerOpen(true)} className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5">
                <span>⚙️ Configuration de Réception</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Slide drawer for users requested quotes stored in localStorage */}
      <React.Suspense fallback={null}>
        <MyRequestsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          quotes={quotes}
          onDeleteQuote={handleDeleteQuote}
          onRefresh={handleRefreshQuotes}
          leadDestination={leadDestination}
          onLeadDestinationChange={(dest) => {
            setLeadDestination(dest);
            localStorage.setItem('pommier_lead_destination', dest);
          }}
          web3FormsKey={web3FormsKey}
          onWeb3FormsKeyChange={(key) => {
            setWeb3FormsKey(key);
            localStorage.setItem('pommier_web3forms_key', key);
          }}
          formspreeEndpoint={formspreeEndpoint}
          onFormspreeEndpointChange={(endpoint) => {
            setFormspreeEndpoint(endpoint);
            localStorage.setItem('pommier_formspree_endpoint', endpoint);
          }}
        />
      </React.Suspense>

      {/* Modals of French Compliance */}
      {activeModal === 'legals' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/60 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <Scale className="w-5 h-5 text-emerald-500" /> Mentions Légales & Agréments SAS
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Dénomination sociale :</strong> Damien Pommier.
              </p>
              <p>
                <strong>Immatriculation :</strong> Inscrite au Registre du Commerce et des Sociétés de Bordeaux sous le numéro SIRET <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">990 183 394 00016</code>.
              </p>
                        <p>
                <strong>Assurances professionnelles :</strong> Police d'assurance responsabilité civile professionnelle souscrite auprès de la compagnie <strong>ACB ASSURANCES</strong> garantissant les vols accidentels, les dégâts de plomberie lors du déplacement des électroménagers ou détériorations de parties communes syndicales à hauteur de 5 000 000 € d'indemnité par sinistre.
              </p>
            </div>

            <div className="border-t border-slate-200/55 pt-3 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-full text-xs font-bold transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/60 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200/55 pb-3">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Politique RGPD & Confidentialité
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD 2016/679) de l'Union Européenne, je vous informe que les données transmises via mon outil de calcul m³ ou mon standard téléphonique font l'objet d'un chiffrement sécurisé.
              </p>
              <p>
                <strong>Propriétaire du traitement :</strong> Débarras Gironde SAS.
              </p>
              <p>
                <strong>Finalités :</strong> Vos données (identité, téléphone, volume d'intervention, localisation postal) servent exclusivement à vous émettre un devis et fixer la date de vidage. Aucun usage commercial ou revente à des assureurs ou plates-formes de démarchage tiers n'est effectué.
              </p>
              <p>
                <strong>Conservation :</strong> Les données sont conservées sur le serveur sécurisé en France pendant une durée de 12 mois suivant la formulation du devis puis sont définitivement hachées, à moins qu'un contrat de débarras n'ait été signé (auquel cas la facturation légale de 5 ans s'impose).
              </p>
              <p>
                <strong>Droits d'accès :</strong> Vous pouvez demander la suppression immédiate de vos coordonnées ou de vos anciennes simulations de devis en écrivant directement à <code className="font-mono text-slate-600 text-[11px] bg-slate-100 px-1 py-0.5 rounded">damien.societe@outlook.com</code>.
              </p>
            </div>

            <div className="border-t border-slate-200/55 pt-3 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-full text-xs font-bold transition cursor-pointer"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'recycling' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/60 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200/55 pb-3">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <Recycle className="w-5 h-5 text-emerald-500 animate-spin" style={{ animationDuration: '8s' }} /> Mon process responsable déchèterie 
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                <strong>1. Tri au sol rigoureux :</strong> Dès mon arrivée sur les lieux, mes équipes séparent les cartons pliables, les livres jaunis, le textile du mobilier imposant en bois composite ou massif.
              </p>
              <p>
                <strong>2. Circuit de revalorisation sociale :</strong> Tout ce qui est en bon état d'usage fait l'objet d'un catalogage immédiat. Je charge en priorité ces éléments pour les acheminer vers les structures de don (Type recyclerie, Emmaüs, boutiques solidaires partenaires) contribuant à l'économie circulaire.
              </p>
              <p>
                <strong>3. Traitement des déchets DEEE :</strong> Les écrans cathodiques, vieux frigidaires, téléviseurs ou câbles informatiques ne sont jamais envoyés en décharge commune. Ils sont remis à des syndicats de retraitement agréés où les composants polluants (métaux lourds, gaz CFC réfrigérants) sont isolés en sécurité.
              </p>
            </div>

            <div className="border-t border-slate-200/55 pt-3 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-full text-xs font-bold transition cursor-pointer"
              >
                Retourner aux services
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'estimation' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-white/60 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200/55 pb-3">
              <h4 className="font-display font-black text-slate-950 text-lg md:text-xl flex items-center gap-2">
                <span>📊</span> Que souhaitez-vous estimer ?
              </h4>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer transition text-slate-500 hover:text-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs md:text-sm text-slate-600 font-sans font-medium">
              Choisissez le service pour lequel vous désirez calculer un volume, obtenir un tarif indicatif ou soumettre votre demande de forfait :
            </p>

            <div className="space-y-4">
              {/* Option 1: Enlèvement d'encombrants */}
              <button
                onClick={() => {
                  setActiveModal(null);
                  setCurrentPage('enlevements');
                }}
                className="w-full p-4 text-left border border-slate-200/80 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl transition-all duration-200 flex items-start gap-4 cursor-pointer group/choice"
              >
                <div className="p-3 bg-emerald-100/60 text-emerald-800 rounded-xl group-hover/choice:bg-emerald-600 group-hover/choice:text-white transition-all duration-200 text-xl shrink-0">
                  📦
                </div>
                <div>
                  <h5 className="font-display font-black text-slate-900 group-hover/choice:text-emerald-700 transition text-sm md:text-base">
                    Enlèvement d'encombrants
                  </h5>
                  <p className="text-[11px] md:text-xs text-slate-500 mt-1 leading-relaxed font-sans font-medium">
                    Estimez le volume de vos cartons, meubles ou objets encombrant vos copropriétés grâce à mon calculateur de m³ interactif.
                  </p>
                </div>
              </button>

              {/* Option 2: Nettoyage */}
              <button
                disabled
                className="w-full p-4 text-left border border-slate-150 bg-slate-50/40 rounded-2xl flex items-start gap-4 cursor-not-allowed opacity-50 select-none"
              >
                <div className="p-3 bg-slate-100 text-slate-400 rounded-xl text-xl shrink-0 grayscale">
                  🧼
                </div>
                <div>
                  <h5 className="font-display font-black text-slate-450 text-sm md:text-base flex items-center gap-1.5 flex-wrap">
                    <span>Nettoyage / Ménage de logements</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-slate-200 text-slate-600 rounded font-bold uppercase tracking-wider">prochainement</span>
                  </h5>
                  <p className="text-[11px] md:text-xs text-slate-450 mt-1 leading-relaxed font-sans font-medium">
                    Découvrez mes forfaits de nettoyage complets pour maisons & appartements (mise au propre, remise en état, syndrome de Diogène, etc.).
                  </p>
                </div>
              </button>

              {/* Option 3: Déménagement */}
              <button
                onClick={() => {
                  setActiveModal(null);
                  setCurrentPage('demenagement');
                }}
                className="w-full p-4 text-left border border-slate-200/80 hover:border-emerald-300 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl transition-all duration-200 flex items-start gap-4 cursor-pointer group/choice"
              >
                <div className="p-3 bg-emerald-100/60 text-emerald-800 rounded-xl group-hover/choice:bg-emerald-600 group-hover/choice:text-white transition-all duration-200 text-xl shrink-0">
                  🚚
                </div>
                <div>
                  <h5 className="font-display font-black text-slate-900 group-hover/choice:text-emerald-700 transition text-sm md:text-base">
                    Service de déménagement
                  </h5>
                  <p className="text-[11px] md:text-xs text-slate-500 mt-1 leading-relaxed font-sans font-medium">
                    Calculez le volume à transporter, la distance kilométrique et soumettez votre demande complète d'estimation de trajet.
                  </p>
                </div>
              </button>

              {/* Option 4: Autres prestations */}
              <button
                disabled
                className="w-full p-4 text-left border border-slate-150 bg-slate-50/40 rounded-2xl flex items-start gap-4 cursor-not-allowed opacity-50 select-none"
              >
                <div className="p-3 bg-slate-100 text-slate-400 rounded-xl text-xl shrink-0 grayscale">
                  🛠️
                </div>
                <div>
                  <h5 className="font-display font-black text-slate-450 text-sm md:text-base flex items-center gap-1.5 flex-wrap">
                    <span>Autres prestations de service</span>
                    <span className="px-1.5 py-0.5 text-[9px] bg-slate-200 text-slate-600 rounded font-bold uppercase tracking-wider">prochainement</span>
                  </h5>
                  <p className="text-[11px] md:text-xs text-slate-450 mt-1 leading-relaxed font-sans font-medium">
                    Terrassement de terrain avec mini-pelle, montage de carport métallique, manutention et transport d'objets lourds.
                  </p>
                </div>
              </button>
            </div>

            <div className="border-t border-slate-150 pt-4 flex justify-end items-center text-[10px] md:text-xs text-slate-450 font-medium font-sans">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-full text-xs font-bold transition cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Popup Modal has been removed as requested */}

      {/* Lightbox photo modal triggered by clicking on the logo */}
      <AnimatePresence>
        {isLogoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLogoModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full p-3 shadow-2xl border border-white/20 relative space-y-3 cursor-default"
            >
              {/* Close button */}
              <button
                onClick={() => setIsLogoModalOpen(false)}
                className="absolute top-5 right-5 p-2 bg-slate-950/70 hover:bg-slate-950 text-white rounded-full transition-all duration-200 shadow-md hover:scale-105 cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-100">
                <img
                  src={humanPhoto}
                  alt="Déménagement & Débarras Damien Pommier en Gironde"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              <div className="text-center pb-2">
                <h4 className="font-display font-black text-slate-900 text-base">
                  Notre Équipe en Action
                </h4>
                <p className="text-[11px] text-slate-500 font-bold font-sans mt-0.5">
                  Déménagement, débarras de maison & transport de meubles en Gironde (33)
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top Floating Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="scroll-to-top-button"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-500/30 cursor-pointer flex items-center justify-center border border-white/10 group"
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}

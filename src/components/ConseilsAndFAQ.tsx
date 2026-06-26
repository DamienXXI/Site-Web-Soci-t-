import React, { useState } from 'react';
import { HelpCircle, ChevronDown, BookOpen, Clock, FileText, ArrowRight } from 'lucide-react';

interface Article {
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  icon: string;
  content: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function ConseilsAndFAQ() {
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      title: "Comment préparer un débarras en 5 étapes",
      excerpt: "Un débarras réussi demande un minimum de préparation. Suivez notre guide pratique pour vider votre maison, appartement ou cave en Gironde en toute sérénité.",
      readTime: "3 min",
      category: "💡 Guide Pratique",
      icon: "📋",
      content: [
        "1. Identifiez et mettez de côté les documents personnels importants, bijoux et objets de famille sentimentaux.",
        "2. Marquez clairement ou isolez les meubles et objets que vous souhaitez conserver afin d'éviter toute confusion lors de l'intervention.",
        "3. Facilitez les accès : dégagez les couloirs et signalez les conditions d'accès (hauteur de portail, ascenseur, places de stationnement proches).",
        "4. Triez à l'avance les petits objets par catégories (vaisselle, vêtements, livres) si vous souhaitez participer au tri, ou laissez notre équipe s'en charger de A à Z.",
        "5. Planifiez l'intervention : convenez d'un rendez-vous clair avec Damien Pommier pour s'assurer que le camion et le matériel adapté soient réservés à votre créneau."
      ]
    },
    {
      title: "Succession et débarras de maison : mode d'emploi",
      excerpt: "La perte d'un proche est une épreuve difficile. Découvrez comment gérer le débarras des biens mobiliers de manière respectueuse, organisée et conforme aux exigences notariales.",
      readTime: "4 min",
      category: "⚖️ Succession",
      icon: "🏡",
      content: [
        "Lors d'un règlement de succession, le débarras de la maison ou de l'appartement du défunt est souvent nécessaire avant la mise en vente du bien immobilier.",
        "• Coordination avec le notaire : Nous pouvons transmettre directement notre devis et facture à l'étude notariale en charge de la succession pour un règlement prélevé directement sur l'actif successoral.",
        "• Tri minutieux des souvenirs : Nous portons une attention absolue au respect des affaires personnelles. Tout document administratif récent, photo de famille ou souvenir précieux trouvé durant le débarras est mis de côté et restitué à la famille.",
        "• Valorisation et don : Les objets ayant encore une utilité sont redistribués à des associations locales, réduisant ainsi les frais de mise en décharge tout en faisant un geste solidaire."
      ]
    },
    {
      title: "Le tri éco-responsable : où vont vos anciens objets ?",
      excerpt: "Le tri n'est pas qu'une étape, c'est notre philosophie. Découvrez notre filière de revalorisation, de dons associatifs et de recyclage en Gironde.",
      readTime: "3 min",
      category: "🌱 Éco-Responsabilité",
      icon: "♻️",
      content: [
        "Chez Damien Pommier, jeter est le dernier recours. Nous appliquons une politique stricte de valorisation pour chaque m³ de débarras :",
        "• Le don solidaire : Les meubles d'appoint, vêtements, vaisselles et jouets d'enfants en bon état sont livrés gracieusement à des associations caritatives partenaires de la région pour équiper les personnes les plus démunies.",
        "• Le recyclage des matières : Les métaux, cartons, bois de construction et plastiques durs sont rigoureusement séparés puis acheminés vers des centres de tri agréés de Gironde.",
        "• Le traitement réglementé (DEEE) : Les anciens appareils électroménagers et écrans sont déposés dans des filières spécifiques pour être dépollués et recyclés de manière conforme aux normes environnementales."
      ]
    }
  ];

  const faqItems: FAQItem[] = [
    {
      question: "Quels sont vos secteurs et communes d'intervention autour de Bordeaux et en Gironde ?",
      answer: "Damien Pommier intervient rapidement (sous 24h à 48h) dans toutes les villes dans un rayon de 50km autour de Bordeaux et plus généralement dans l'ensemble du département de la Gironde (33). Les principales communes desservies comprennent : Bordeaux, Mérignac, Pessac, Talence, Villenave-d'Ornon, Saint-Médard-en-Jalles, Bègles, Cenon, Gradignan, Lormont, Eysines, Cestas, Floirac, Blanquefort, Bruges, Ambarès-et-Lagrave, Le Bouscat, Léognan, Saint-André-de-Cubzac, Libourne, Gujan-Mestras, Castelnau-de-Médoc, Créon, Saint-Jean-d'Illac, Martignas-sur-Jalle, Canéjan, Carbon-Blanc, Bassens, Saint-Loubès, Artigues-près-Bordeaux, Parempuyre, Le Taillan-Médoc, Saint-Aubin-de-Médoc, Ludon-Médoc, Macau, Langon, Cadillac, Podensac, Portets, Saint-Sulpice-et-Cameyrac, Bouliac, Latresne, Fargues-Saint-Hilaire, Sadirac, Carignan-de-Bordeaux, Blaye, Saint-Émilion, Izon, Saint-Denis-de-Pile, Coutras, Biganos, Audenge, Lanton, Andernos-les-Bains, Marcheprime, Salles, Belin-Béliet, Saint-Selve, La Brède, Martillac, Beautiran, Castres-Gironde, Arsac, Pian-Médoc, Saucats, Le Barp, Tresses, Yvrac, Cénac, Camblanes-et-Meynac, Quinsac, Saint-Caprais-de-Bordeaux, Lignan-de-Bordeaux, Sainte-Eulalie, Montussan, Beychac-et-Caillau, Vayres, Arveyres, Fronsac, Saint-Germain-du-Puch, Baron, Nérigean... Nous nous déplaçons gratuitement pour évaluer le volume à vider et vous proposer un devis personnalisé."
    },
    {
      question: "Quels sont vos tarifs pour un débarras en Gironde ?",
      answer: "Nos tarifs sont calculés de manière transparente et sur-mesure. Ils dépendent de trois facteurs clés : le volume total à évacuer (en m³), l'accessibilité des locaux (étages, ascenseur, distance de portage jusqu'au camion) et l'éventuelle valeur des objets récupérables (qui vient en déduction du coût de l'intervention)."
    },
    {
      question: "Combien de temps dure une intervention classique ?",
      answer: "La plupart de nos débarras de caves, garages ou appartements se font en une seule journée. Pour des maisons entières ou des chantiers Diogène très encombrés, l'intervention peut s'étendre sur 2 à 3 jours. Nous nous engageons à respecter scrupuleusement les délais convenus."
    },
    {
      question: "Que faites-vous des affaires personnelles et documents importants ?",
      answer: "La discrétion et le respect de votre vie privée sont nos priorités. Lors du débarras, si nous découvrons des photos de famille, des testaments, des actes notariés, des bijoux ou de l'argent liquide, nous les mettons immédiatement de côté dans un carton sécurisé que nous vous remettons en main propre à la fin du chantier."
    },
    {
      question: "Intervenez-vous pour des cas de syndrome de Diogène ou de logements insalubres ?",
      answer: "Oui, nous sommes équipés et formés pour intervenir dans les situations d'insalubrité extrême, de logement de personnes atteintes du syndrome de Diogène ou après des sinistres. Nous réalisons le tri, l'évacuation complète des déchets, le nettoyage minutieux et la désinfection totale des pièces."
    },
    {
      question: "Comment puis-je obtenir un devis ou une estimation précise ?",
      answer: "C'est très simple et gratuit ! Vous pouvez utiliser notre simulateur de m³ en ligne ci-dessus, nous appeler directement au 06 61 29 20 59, ou nous envoyer des photos du chantier par SMS ou par email. Si nécessaire, nous nous déplaçons gratuitement chez vous pour évaluer le travail et vous proposer un devis ferme sous 24h."
    }
  ];

  return (
    <div className="py-20 bg-slate-50/40 border-t border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP: Conseils Débarras Section */}
        <div id="conseils-debarras" className="mb-24">
          <div className="text-center mb-12">
            <span className="inline-block px-3.5 py-1.5 bg-emerald-50 border border-emerald-100/60 text-emerald-800 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider mb-2 font-sans">
              Conseils & SEO
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
              Conseils Débarras & Revalorisation
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 font-semibold font-sans">
              Nos guides d'experts pour préparer sereinement vos projets de débarras, vider un logement ou trier vos biens en Gironde.
            </p>
          </div>

          {/* Bento-style Grid for Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl border border-slate-150/80 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100/30">
                      {article.category}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-350" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <div className="text-3xl filter saturate-100 group-hover:scale-110 transition-transform duration-300">
                    {article.icon}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-950 font-sans tracking-tight leading-tight group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedArticle(article)}
                    className="text-xs font-black text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                  >
                    <span>Lire l'article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: FAQ Section */}
        <div id="faq" className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3.5 py-1.5 bg-emerald-50 border border-emerald-100/60 text-emerald-800 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider mb-2 font-sans">
              Vos Questions
            </span>
            <h2 className="text-3xl md:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
              Foire Aux Questions (FAQ)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto mt-2 font-semibold font-sans">
              Retrouvez toutes les réponses simples et transparentes concernant nos interventions de débarras de maison, tarifs et services en Gironde.
            </p>
          </div>

          {/* Ergonomic expand/collapse controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 px-1">
            <span className="text-[11px] font-bold text-slate-400">
              💡 Cliquez sur une question pour déplier la réponse ou utilisez les commandes rapides :
            </span>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  const allOpen: Record<number, boolean> = {};
                  faqItems.forEach((_, i) => { allOpen[i] = true; });
                  setOpenStates(allOpen);
                }}
                className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100/60 px-3 py-1.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Tout déplier
              </button>
              <button
                onClick={() => setOpenStates({})}
                className="text-[10px] font-extrabold text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 px-3 py-1.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Tout replier
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = !!openStates[idx];
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                >
                  <button
                    onClick={() => {
                      setOpenStates(prev => ({
                        ...prev,
                        [idx]: !prev[idx]
                      }));
                    }}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-sans font-bold text-slate-900 text-sm md:text-base hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{item.question}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-350 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>

                  <div 
                    className={`transition-all duration-350 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[800px] border-t border-slate-100' : 'max-h-0'
                    }`}
                  >
                    <div className="p-5 text-slate-600 text-xs md:text-sm leading-relaxed font-semibold bg-slate-50/30">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Article Detail Lightbox Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-10 shadow-2xl space-y-6 relative border border-slate-100">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
            
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full">
                {selectedArticle.category}
              </span>
              <h3 className="text-xl md:text-2xl font-black font-display text-slate-950 leading-tight">
                {selectedArticle.title}
              </h3>
              <p className="text-slate-400 text-[10px] font-bold flex items-center gap-1 pb-4 border-b border-slate-100">
                <Clock className="w-3.5 h-3.5 text-slate-350" />
                Temps de lecture : {selectedArticle.readTime}
              </p>
            </div>

            <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed font-semibold">
              {selectedArticle.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, WasteItem, FAQItem, Testimonial } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'furniture',
    name: 'Mobilier & Encombrants',
    description: 'Canapés, lits, armoires, tables et chaises.',
    iconName: 'Sofa'
  },
  {
    id: 'appliances',
    name: 'Électroménager & High-Tech',
    description: 'Machines à laver, frigos, fours, écrans (DEEE).',
    iconName: 'Tv'
  },
  {
    id: 'boxes',
    name: 'Cartons & Divers Accumulé',
    description: 'Petits objets, vaisselle, vieux cartons, vêtements.',
    iconName: 'Package'
  },
  {
    id: 'outdoor',
    name: 'Chantier & Extérieur',
    description: 'Gravats propres, bois, métaux, branchages.',
    iconName: 'Hammer'
  }
];

export const WASTE_ITEMS: WasteItem[] = [
  // Furniture
  { id: 'sofa_2p', name: 'Canapé (2 places) / Fauteuil', volumeM3: 1.0, categoryId: 'furniture', iconName: 'Sofa' },
  { id: 'bed_double', name: 'Lit Simple / Double (avec matelas)', volumeM3: 1.5, categoryId: 'furniture', iconName: 'Bed' },
  { id: 'wardrobe', name: 'Grand Armoire / Commode', volumeM3: 2.0, categoryId: 'furniture', iconName: 'FolderClosed' },
  { id: 'table_heavy', name: 'Grande Table de salle à manger', volumeM3: 1.2, categoryId: 'furniture', iconName: 'Scale' },
  { id: 'chair', name: 'Chaise / Tabouret', volumeM3: 0.15, categoryId: 'furniture', iconName: 'Grid' },
  
  // Appliances
  { id: 'fridge_double', name: 'Frigo Américain / Grand congélateur', volumeM3: 1.8, categoryId: 'appliances', iconName: 'Refrigerator' },
  { id: 'washing_machine', name: 'Lave-linge / Lave-vaisselle / Sèche-linge', volumeM3: 0.8, categoryId: 'appliances', iconName: 'Wrench' },
  { id: 'microwave_small', name: 'Petit four / Micro-ondes', volumeM3: 0.2, categoryId: 'appliances', iconName: 'CookingPot' },
  { id: 'television', name: 'Écran de télévision / Moniteur informatique', volumeM3: 0.3, categoryId: 'appliances', iconName: 'Tv' },

  // Boxes & Miscellaneous
  { id: 'box_large', name: 'Grand carton de déménagement rempli', volumeM3: 0.15, categoryId: 'boxes', iconName: 'Package' },
  { id: 'box_medium', name: 'Carton standard / Sac poubelle 100L', volumeM3: 0.1, categoryId: 'boxes', iconName: 'PackageOpen' },
  { id: 'bicycle', name: 'Vélo ou trottinette', volumeM3: 0.4, categoryId: 'boxes', iconName: 'Bike' },
  { id: 'carpet_rolled', name: 'Tapis enroulé ou grand miroir', volumeM3: 0.5, categoryId: 'boxes', iconName: 'BookOpen' },

  // Construction / Outdoor
  { id: 'wood_pile', name: 'Planches de bois / Palette (lot de 3)', volumeM3: 0.6, categoryId: 'outdoor', iconName: 'Layers' },
  { id: 'rubble_bag', name: 'Sac de gravats (max 25kg)', volumeM3: 0.1, categoryId: 'outdoor', iconName: 'Shovel' },
  { id: 'metal_items', name: 'Tuyaux de métal / Ferraille diverse', volumeM3: 0.5, categoryId: 'outdoor', iconName: 'Activity' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Jean-Pierre L.',
    location: 'Paris (15ème)',
    role: 'Particulier',
    rating: 5,
    text: 'Formidable service pour vider l\'appartement de ma défunte tante. Équipe d\'une grande discrétion, ponctuels et très soignés. L\'appartement a été laissé balayé. Je recommande vivement.',
    date: '12 mai 2026',
    serviceType: 'Débarras de succession'
  },
  {
    id: 't2',
    name: 'Sophie M.',
    location: 'Lyon (6ème)',
    role: 'Responsable Services Généraux',
    rating: 5,
    text: 'Je devais débarrasser 45 postes de travail en urgence avant la restitution des clés de mes anciens bureaux. Débarras Gironde est intervenu le samedi même. Efficace, respectueux et traçabilité DEEE impeccable !',
    date: '24 avril 2026',
    serviceType: 'Débarras de bureau'
  },
  {
    id: 't3',
    name: 'Antoine D.',
    location: 'Bordeaux',
    role: 'Particulier',
    rating: 5,
    text: 'Ma cave était pleine depuis 12 ans. En 1h30, tout a été chargé. Un grand bravo pour la démarche éco-responsable : une partie a été donnée à la Ressourcerie locale d\'après les retours. Top !',
    date: '18 mai 2026',
    serviceType: 'Débarras de cave'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'pricing',
    question: 'Combien coûte un débarras professionnel ?',
    answer: 'Mes tarifs commencent à partir de 45€ HT par m³ et diminuent de manière dégressive selon le volume total. Ce tarif inclut la main d\'œuvre, la mise en sac, la manutention, le transport, et les taxes de déchèterie professionnelle. Le devis est 100% personnalisé et sans engagement.'
  },
  {
    category: 'pricing',
    question: 'Le débarras peut-il être valorisé à 0€ ?',
    answer: 'Tout à fait ! J\'évalue la valeur de revente de vos objets valorisables (meubles anciens récents, électroménager fonctionnel, objets de collection). Si cette valeur est supérieure ou égale au coût de ma prestation de débarras et de démolition, l\'intervention est entièrement compensée.'
  },
  {
    category: 'service',
    question: 'Combien de temps à l\'avance faut-il réserver ?',
    answer: 'Idéalement, 48h à l\'avance. Cependant, je dispose d\'équipes dédiées aux urgences capables d\'opérer en moins de 24h en région parisienne et grandes agglomérations pour éviter des pénalités de retard de bail ou sécuriser une vente notariale.'
  },
  {
    category: 'eco',
    question: 'Que deviennent mes encombrants ? Sont-ils jetés ?',
    answer: 'Non, pas tous ! Je trie minutieusement chaque objet. Les vêtements sous-vide, vaisselles et mobiliers réutilisables sont donnés à mes associations partenaires (type Emmaüs, Croix-Rouge ou ressourceries locales). Le reste est apporté dans des centres agréés pour recyclage par filière (bois, DEEE, métaux) avec émission d\'un Bordereau de Suivi des Déchets (BSD).'
  },
  {
    category: 'service',
    question: 'Devez-vous visiter les lieux pour faire un devis ?',
    answer: 'Ce n\'est pas obligatoire ! Pour un volume simple (cave, garage, quelques meubles), l\'envoi de quelques photos claires par SMS/E-mail ou l\'utilisation de mon calculateur en ligne suffit à fixer un prix ferme et définitif. Pour de grands volumes (maison complète de 150m²), une visite sur place sans engagement est préférée.'
  }
];

export function calculateEstimatedPrice(
  volumeM3: number,
  accessibility: { floor: number; hasElevator: boolean; parkingDistance: 'proche' | 'moyen' | 'eloigne' }
): { min: number; max: number; isFreePossible: boolean } {
  if (volumeM3 <= 0) return { min: 0, max: 0, isFreePossible: false };

  // Le tarif est de 40€ du m3 et 50 de déplacement
  const cost = Math.round(40 * volumeM3 + 50);

  return {
    min: cost,
    max: cost,
    isFreePossible: false
  };
}

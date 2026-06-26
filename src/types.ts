/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WasteItem {
  id: string;
  name: string;
  volumeM3: number; // in cubic meters
  categoryId: string;
  iconName: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  zipCode: string;
  city: string;
  serviceType: 'particulier' | 'professionnel' | 'cave_grenier';
  estimatedVolumeM3: number;
  selectedItems: { [itemId: string]: number };
  floor: number;
  hasElevator: boolean;
  parkingDistance: 'proche' | 'moyen' | 'eloigne';
  additionalDetails?: string;
  estimatedPrice?: string;
  photos?: string[];
  createdAt: string;
  status: 'pending' | 'reviewed' | 'scheduled';
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'pricing' | 'service' | 'eco';
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  serviceType: string;
}

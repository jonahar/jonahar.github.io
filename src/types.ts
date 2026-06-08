/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContactInfo {
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
}

export interface TourHighlight {
  id: string;
  text: string;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  groupSize: string;
  meetingPoint: string;
  highlights: TourHighlight[];
  whatsappLink: string;
  longDescription?: string;
  interestPoints?: { name: string; description: string }[];
  gallery?: string[];
}

export interface BioLink {
  id: string;
  label: string;
  url: string;
  type: 'phone' | 'whatsapp' | 'email' | 'facebook' | 'instagram' | 'custom';
}

export interface Testimonial {
  id: string;
  name: string;
  category: string;
  quote: string;
  rating: number;
  tourName: string;
  date: string;
}


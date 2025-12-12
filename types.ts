export enum AppView {
  LANGUAGE_SELECT,
  DASHBOARD,
  KUNDALI_FORM,
  KUNDALI_RESULT,
  MILAN_FORM,
  MILAN_RESULT,
  NUMEROLOGY_FORM,
  NUMEROLOGY_RESULT,
  PALMISTRY,
  RASHIFAL,
}

export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  SANSKRIT = 'sa',
}

export interface UserDetails {
  name: string;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  location: string;
  gender: 'male' | 'female';
}

export interface PlanetPosition {
  planet: string; // Sun, Moon, Mars...
  signIndex: number; // 0 (Aries) to 11 (Pisces)
  degree: number;
  house: number; // 1 to 12
  isRetrograde: boolean;
  nakshatra?: string;
  nakshatraLord?: string;
}

export interface DoshaReport {
  hasMangalDosha: boolean;
  hasKaalSarp: boolean;
  hasPitraDosha: boolean;
  description: string;
}

export interface Remedy {
  type: 'Gemstone' | 'Mantra' | 'Rudraksha';
  name: string;
  description: string;
  procedure: string;
}

export interface HouseReport {
  houseNumber: number;
  sign: string;
  lord: string;
  planets: PlanetPosition[];
  analysis: string;
}

export interface KundaliData {
  ascendant: number; // Sign index of Lagna
  planets: PlanetPosition[];
  details: UserDetails;
  doshas: DoshaReport;
  remedies: Remedy[];
  lifePrediction: string; // Kept for PDF generation
  houseReports: HouseReport[]; // New structured data for UI
}

export interface MilanData {
  p1: UserDetails;
  p2: UserDetails;
  score: number; // Out of 36
  categoryScores: {
    varna: number; // 1
    vashya: number; // 2
    tara: number; // 3
    yoni: number; // 4
    grahaMaitri: number; // 5
    gana: number; // 6
    bhakoot: number; // 7
    nadi: number; // 8
  };
  conclusion: string;
  manglikStatus: string; // "Boy Manglik, Girl Non-Manglik" etc.
}

export interface NumerologyData {
  mulank: number; // Based on day
  bhagyank: number; // Based on full date
  namank: number; // Based on name
  soulUrge: number; // Vowels
  personality: number; // Consonants
  prediction: string;
  arrows: string[]; // New: David Phillips Arrows (e.g., "Arrow of Determination")
  luckyColor: string;
  luckyGem: string;
}

export interface PalmistryResult {
  type: 'palm' | 'face';
  imageUrl: string;
  traits: { label: string; value: string; score: number }[];
  prediction: string;
  personalityKeywords: string[];
}

export interface RashifalData {
  rashi: string;
  date: string;
  prediction: string;
  luckyColor: string;
  luckyNumber: number;
}
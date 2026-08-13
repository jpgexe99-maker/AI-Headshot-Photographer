import { AspectRatioOption, OptionItem, SampleSelfie } from '../types';

export const ATTIRE_OPTIONS: OptionItem[] = [
  {
    id: 'navy-blazer-shirt',
    label: 'Dark Navy Blazer & Crisp White Shirt',
    description: 'Universal executive business formal look',
  },
  {
    id: 'charcoal-suit-tie',
    label: 'Charcoal Executive Suit with Silk Tie',
    description: 'High-level corporate, finance, or legal look',
  },
  {
    id: 'black-blazer-crewneck',
    label: 'Modern Black Blazer over Fitted Crewneck',
    description: 'Sleek tech founder or creative director attire',
  },
  {
    id: 'tailored-light-grey',
    label: 'Tailored Light Grey Suit (Open Collar)',
    description: 'Modern, approachable executive smart-casual',
  },
  {
    id: 'knitwear-structured-jacket',
    label: 'Sophisticated Knitwear & Soft Blazer',
    description: 'Warm, smart casual editorial styling',
  },
  {
    id: 'silk-blouse-blazer',
    label: 'Tailored Blazer & Silk Blouse / Dress Shirt',
    description: 'Refined professional leadership attire',
  },
  {
    id: 'smart-casual-linen',
    label: 'Crisp Button-Down Oxford Shirt',
    description: 'Relaxed yet professional everyday headshot',
  },
];

export const EXPRESSION_OPTIONS: OptionItem[] = [
  {
    id: 'confident-approachable-smile',
    label: 'Confident & Approachable Smile',
    description: 'Warm eye catchlights with a natural, friendly smile (Recommended)',
  },
  {
    id: 'gentle-soft-smile',
    label: 'Gentle & Subtle Warm Smile',
    description: 'Calm, thoughtful, and pleasant expression',
  },
  {
    id: 'serious-executive',
    label: 'Focused Executive Composure',
    description: 'Strong, resolute, authoritative direct gaze',
  },
  {
    id: 'enthusiastic-engaging',
    label: 'Enthusiastic & Open Expression',
    description: 'Bright, energetic smile perfect for personal branding',
  },
];

export const LIGHTING_OPTIONS: OptionItem[] = [
  {
    id: 'soft-studio-box',
    label: 'Soft Studio Box Lighting',
    description: 'Even, flattering facial lighting with smooth gradient shadows',
  },
  {
    id: 'cinematic-side-key',
    label: 'Cinematic Side Rembrandt Light',
    description: 'Deeper shadows for high-contrast facial structure depth',
  },
  {
    id: 'natural-window-daylight',
    label: 'Natural Window Daylight',
    description: 'Soft directional window glow with gentle ambient bounce',
  },
  {
    id: 'golden-hour-rim',
    label: 'Warm Golden Hour Rim Light',
    description: 'Warm subtle hair accent light with soft front illumination',
  },
  {
    id: 'high-key-diffused',
    label: 'Bright High-Key Diffusion',
    description: 'Clean, shadowless modern commercial photo lighting',
  },
];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    id: '3:4',
    label: '3:4 Portrait',
    dimensions: 'Ideal for Resumes, Corporate Websites & Badges',
    iconName: 'RectangleVertical',
  },
  {
    id: '1:1',
    label: '1:1 Square',
    dimensions: 'Perfect for LinkedIn, Twitter/X & Avatars',
    iconName: 'Square',
  },
  {
    id: '4:5',
    label: '4:5 Social',
    dimensions: 'Instagram & Mobile Bio Cards',
    iconName: 'Smartphone',
  },
  {
    id: '16:9',
    label: '16:9 Landscape',
    dimensions: 'Website Hero Banners & Speaker Cards',
    iconName: 'RectangleHorizontal',
  },
];

export const SAMPLE_SELFIES: SampleSelfie[] = [
  {
    id: 'sample-f1',
    name: 'Sarah (Casual Selfie)',
    gender: 'Female',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    description: 'Casual indoor phone selfie with natural window lighting.',
  },
  {
    id: 'sample-m1',
    name: 'Alex (Casual Selfie)',
    gender: 'Male',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    description: 'Casual outdoor smartphone snapshot in t-shirt.',
  },
  {
    id: 'sample-f2',
    name: 'Elena (Casual Selfie)',
    gender: 'Female',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    description: 'Everyday casual portrait photo.',
  },
  {
    id: 'sample-m2',
    name: 'Marcus (Casual Selfie)',
    gender: 'Male',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    description: 'Casual natural lighting portrait photo.',
  },
];

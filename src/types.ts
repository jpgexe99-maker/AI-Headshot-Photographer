export interface HeadshotStyle {
  id: string;
  name: string;
  category: 'Corporate' | 'Tech' | 'Creative' | 'LinkedIn';
  description: string;
  previewUrl: string;
  badge?: string;
  defaultAttire: string;
  defaultLighting: string;
  defaultBg: string;
  tags: string[];
}

export interface OptionItem {
  id: string;
  label: string;
  description: string;
}

export interface AspectRatioOption {
  id: '3:4' | '1:1' | '4:5' | '16:9';
  label: string;
  dimensions: string;
  iconName: string;
}

export interface GeneratedHeadshot {
  id: string;
  originalImage: string;
  headshotUrl: string;
  styleName: string;
  attire: string;
  expression: string;
  lighting: string;
  backgroundDetail: string;
  aspectRatio: string;
  createdAt: string;
  modelUsed: string;
  customPrompt?: string;
  isFavorite?: boolean;
}

export interface SampleSelfie {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  url: string;
  description: string;
}

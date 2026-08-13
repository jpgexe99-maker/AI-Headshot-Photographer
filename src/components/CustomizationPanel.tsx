import React, { useState } from 'react';
import {
  ATTIRE_OPTIONS,
  EXPRESSION_OPTIONS,
  LIGHTING_OPTIONS,
  ASPECT_RATIOS,
} from '../data/options';
import { HeadshotStyle, OptionItem, AspectRatioOption } from '../types';
import {
  Shirt,
  Smile,
  Sun,
  Crop,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

interface CustomizationPanelProps {
  selectedStyle: HeadshotStyle;
  selectedAttire: string;
  onSelectAttire: (val: string) => void;
  selectedExpression: string;
  onSelectExpression: (val: string) => void;
  selectedLighting: string;
  onSelectLighting: (val: string) => void;
  selectedAspectRatio: '3:4' | '1:1' | '4:5' | '16:9';
  onSelectAspectRatio: (val: '3:4' | '1:1' | '4:5' | '16:9') => void;
  selectedQuality: 'lite' | 'standard';
  onSelectQuality: (val: 'lite' | 'standard') => void;
  customPrompt: string;
  onChangeCustomPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasSourceImage: boolean;
}

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  selectedStyle,
  selectedAttire,
  onSelectAttire,
  selectedExpression,
  onSelectExpression,
  selectedLighting,
  onSelectLighting,
  selectedAspectRatio,
  onSelectAspectRatio,
  selectedQuality,
  onSelectQuality,
  customPrompt,
  onChangeCustomPrompt,
  onGenerate,
  isGenerating,
  hasSourceImage,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h2 className="flex items-center text-base font-semibold text-white">
            <span className="mr-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400 border border-indigo-500/30">
              3
            </span>
            Studio Fine-Tuning & Controls
          </h2>
          <p className="text-xs text-slate-400">
            Personalize attire, smile tone, lighting, and framing
          </p>
        </div>
        <button className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-5 space-y-4 border-t border-slate-800/80 pt-4">
          {/* Attire Selection */}
          <div>
            <label className="mb-1.5 flex items-center text-xs font-medium text-slate-300">
              <Shirt className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
              Clothing & Attire
            </label>
            <select
              value={selectedAttire}
              onChange={(e) => onSelectAttire(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {ATTIRE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expression & Pose */}
          <div>
            <label className="mb-1.5 flex items-center text-xs font-medium text-slate-300">
              <Smile className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
              Facial Expression & Smile
            </label>
            <select
              value={selectedExpression}
              onChange={(e) => onSelectExpression(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {EXPRESSION_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Studio Lighting */}
          <div>
            <label className="mb-1.5 flex items-center text-xs font-medium text-slate-300">
              <Sun className="mr-1.5 h-3.5 w-3.5 text-sky-400" />
              Studio Lighting Scheme
            </label>
            <select
              value={selectedLighting}
              onChange={(e) => onSelectLighting(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {LIGHTING_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio Grid */}
          <div>
            <label className="mb-1.5 flex items-center text-xs font-medium text-slate-300">
              <Crop className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              Framing & Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ASPECT_RATIOS.map((ratio) => {
                const isSelected = selectedAspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => onSelectAspectRatio(ratio.id)}
                    className={`rounded-xl border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold text-white">{ratio.label}</span>
                    <span className="block text-[10px] text-slate-500 truncate">
                      {ratio.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Quality / Speed Mode */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center">
                <Zap className="mr-1.5 h-3.5 w-3.5 text-yellow-400" />
                Render Engine Quality
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSelectQuality('lite')}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  selectedQuality === 'lite'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Flash Lite</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-400">
                    Fast (~5s)
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  Ideal for rapid style exploration
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSelectQuality('standard')}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  selectedQuality === 'standard'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">1K Ultra Res</span>
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-400">
                    Studio (~8s)
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  High clarity studio texture detail
                </p>
              </button>
            </div>
          </div>

          {/* Custom Prompt Tweak */}
          <div>
            <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-300">
              <span className="flex items-center">
                <Sliders className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
                Custom Adjustments (Optional)
              </span>
              <span className="text-[10px] text-slate-500">e.g., glasses, hair, background</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Add silver rimmed eyeglasses, trim facial hair..."
              value={customPrompt}
              onChange={(e) => onChangeCustomPrompt(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Main Generate Button */}
      <div className="mt-5">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !hasSourceImage}
          className={`relative flex w-full items-center justify-center space-x-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-300 ${
            isGenerating || !hasSourceImage
              ? 'cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Rendering Photorealistic Headshot...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Generate AI Headshot</span>
            </>
          )}
        </button>
        {!hasSourceImage && (
          <p className="mt-2 text-center text-[11px] text-amber-400/90">
            * Please upload or pick a reference selfie first
          </p>
        )}
      </div>
    </div>
  );
};

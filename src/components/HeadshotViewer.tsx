import React, { useState, useRef } from 'react';
import {
  Download,
  Eye,
  Sparkles,
  RefreshCw,
  Heart,
  Share2,
  Maximize2,
  X,
  Sliders,
  Check,
  Zap,
} from 'lucide-react';
import { GeneratedHeadshot } from '../types';

interface HeadshotViewerProps {
  headshot: GeneratedHeadshot | null;
  isGenerating: boolean;
  onRefine: (refinePrompt: string) => void;
  onRegenerate: () => void;
  onToggleFavorite?: (id: string) => void;
}

export const HeadshotViewer: React.FC<HeadshotViewerProps> = ({
  headshot,
  isGenerating,
  onRefine,
  onRegenerate,
  onToggleFavorite,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isComparing, setIsComparing] = useState<boolean>(true);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  const [refineInput, setRefineInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !e.touches[0]) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleDownload = () => {
    if (!headshot) return;
    const link = document.createElement('a');
    link.href = headshot.headshotUrl;
    link.download = `aurashot-headshot-${headshot.styleName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    if (!headshot) return;
    navigator.clipboard.writeText(headshot.headshotUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineInput.trim()) return;
    onRefine(refineInput.trim());
    setRefineInput('');
  };

  if (isGenerating) {
    return (
      <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-indigo-500/30 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
          <div className="absolute inset-2 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white">
          Crafting Your AI Studio Headshot
        </h3>
        <p className="mt-2 max-w-sm text-xs text-slate-400">
          Enhancing facial symmetry, setting studio key lighting, and replacing casual attire with custom tailored business wear...
        </p>

        <div className="mt-6 flex items-center space-x-2 rounded-full bg-slate-950 px-4 py-1.5 text-[11px] text-indigo-300 border border-indigo-500/20">
          <Zap className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
          <span>Generating photorealistic textures (~5-8 sec)</span>
        </div>
      </div>
    );
  }

  if (!headshot) {
    return (
      <div className="flex h-full min-h-[460px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/50">
          <Eye className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-200">
          Your Studio Canvas
        </h3>
        <p className="mt-1 max-w-xs text-xs text-slate-400">
          Upload a casual selfie on the left and choose a style to generate your executive headshots.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
      {/* Header Bar */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white">
              {headshot.styleName}
            </h2>
            <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
              {headshot.aspectRatio} Ratio
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {headshot.attire}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1.5 rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setIsComparing(true)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              isComparing
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Split Compare
          </button>
          <button
            onClick={() => setIsComparing(false)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              !isComparing
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Headshot Only
          </button>
        </div>
      </div>

      {/* Main Image Display Box */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {isComparing ? (
          /* Interactive Split View Slider */
          <div
            ref={sliderRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[380px] w-full cursor-ew-resize select-none overflow-hidden"
          >
            {/* Generated AI Headshot (Underneath / Right side) */}
            <img
              src={headshot.headshotUrl}
              alt="AI Generated Headshot"
              className="absolute inset-0 h-full w-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 z-10 rounded-lg bg-indigo-950/80 px-2.5 py-1 text-[10px] font-bold text-indigo-200 border border-indigo-500/30 backdrop-blur-md">
              AI Headshot
            </div>

            {/* Original Selfie (Clipped Overlay / Left side) */}
            <div
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={headshot.originalImage}
                alt="Original Selfie"
                className="absolute inset-0 h-full w-full max-w-none object-cover object-top"
                style={{ width: sliderRef.current?.getBoundingClientRect().width || '100%' }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 z-10 rounded-lg bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-slate-300 border border-slate-700/50 backdrop-blur-md">
                Original Selfie
              </div>
            </div>

            {/* Divider Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -left-3.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl border border-slate-300">
                <span className="text-[10px] font-bold">◄ ►</span>
              </div>
            </div>
          </div>
        ) : (
          /* Single AI Headshot View */
          <div className="relative h-[380px] w-full overflow-hidden bg-slate-950 flex justify-center items-center">
            <img
              src={headshot.headshotUrl}
              alt="AI Headshot"
              className="h-full w-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-3 right-3 rounded-lg bg-slate-950/80 p-2 text-slate-300 hover:bg-slate-900 hover:text-white border border-slate-700/50 backdrop-blur-md transition-all"
              title="Full Screen Zoom"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            title="Generate a variation with slight random tweaks"
          >
            <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
            <span>Variation</span>
          </button>

          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(headshot.id)}
              className={`rounded-xl border p-2 transition-all ${
                headshot.isFavorite
                  ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
              title="Save to Favorites"
            >
              <Heart className={`h-4 w-4 ${headshot.isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied Image' : 'Share'}</span>
        </button>
      </div>

      {/* Quick Refinement Bar */}
      <div className="mt-4">
        <form onSubmit={handleRefineSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Sliders className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Refine this headshot (e.g. 'Make blazer navy blue', 'Add subtle smile')..."
              value={refineInput}
              onChange={(e) => setRefineInput(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!refineInput.trim() || isGenerating}
            className="flex items-center space-x-1 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-indigo-600 hover:text-white disabled:opacity-50 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Refine</span>
          </button>
        </form>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl bg-slate-950 p-2">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 z-10 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-800 border border-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={headshot.headshotUrl}
              alt="Zoomed Headshot"
              className="max-h-[82vh] w-auto rounded-xl object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

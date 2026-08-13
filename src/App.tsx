import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SelfieUpload } from './components/SelfieUpload';
import { StyleSelector } from './components/StyleSelector';
import { CustomizationPanel } from './components/CustomizationPanel';
import { HeadshotViewer } from './components/HeadshotViewer';
import { GalleryHistory } from './components/GalleryHistory';
import { HowItWorksModal } from './components/HowItWorksModal';

import { HEADSHOT_STYLES } from './data/styles';
import { ATTIRE_OPTIONS, EXPRESSION_OPTIONS, SAMPLE_SELFIES } from './data/options';
import { HeadshotStyle, GeneratedHeadshot } from './types';
import { AlertCircle, Sparkles, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle>(HEADSHOT_STYLES[0]);
  const [selectedAttire, setSelectedAttire] = useState<string>(HEADSHOT_STYLES[0].defaultAttire);
  const [selectedExpression, setSelectedExpression] = useState<string>(EXPRESSION_OPTIONS[0].label);
  const [selectedLighting, setSelectedLighting] = useState<string>(HEADSHOT_STYLES[0].defaultLighting);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'3:4' | '1:1' | '4:5' | '16:9'>('3:4');
  const [selectedQuality, setSelectedQuality] = useState<'lite' | 'standard'>('lite');
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeHeadshot, setActiveHeadshot] = useState<GeneratedHeadshot | null>(null);
  const [history, setHistory] = useState<GeneratedHeadshot[]>([]);

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync default attire and lighting when style changes
  const handleSelectStyle = (style: HeadshotStyle) => {
    setSelectedStyle(style);
    setSelectedAttire(style.defaultAttire);
    setSelectedLighting(style.defaultLighting);
  };

  // Load initial sample photo on first load so canvas is immediately interactive
  useEffect(() => {
    handleSelectSampleSelfie(SAMPLE_SELFIES[0].url);
  }, []);

  const handleSelectSampleSelfie = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setSelectedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      setSelectedImage(url);
    }
  };

  const handleGenerate = async (extraPrompt: string = '') => {
    if (!selectedImage) {
      setErrorMessage('Please upload or select a reference selfie photo first.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const mergedCustomPrompt = [customPrompt, extraPrompt].filter(Boolean).join('. ');

      const response = await fetch('/api/generate-headshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          style: selectedStyle.name,
          attire: selectedAttire,
          expression: selectedExpression,
          lighting: selectedLighting,
          backgroundDetail: selectedStyle.defaultBg,
          aspectRatio: selectedAspectRatio,
          quality: selectedQuality,
          customPrompt: mergedCustomPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate headshot.');
      }

      const newHeadshot: GeneratedHeadshot = {
        id: `hs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        originalImage: selectedImage,
        headshotUrl: data.imageUrl,
        styleName: selectedStyle.name,
        attire: selectedAttire,
        expression: selectedExpression,
        lighting: selectedLighting,
        backgroundDetail: selectedStyle.defaultBg,
        aspectRatio: selectedAspectRatio,
        createdAt: new Date().toISOString(),
        modelUsed: data.modelUsed,
        customPrompt: mergedCustomPrompt,
        isFavorite: false,
      };

      setActiveHeadshot(newHeadshot);
      setHistory((prev) => [newHeadshot, ...prev]);
    } catch (err: any) {
      console.error('Headshot generation failed:', err);
      setErrorMessage(err?.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    if (activeHeadshot?.id === id) {
      setActiveHeadshot((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  const handleDeleteHeadshot = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeHeadshot?.id === id) {
      const remaining = history.filter((item) => item.id !== id);
      setActiveHeadshot(remaining[0] || null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setActiveHeadshot(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onQuickSample={() => handleSelectSampleSelfie(SAMPLE_SELFIES[1].url)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Banner Announcement */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-indigo-900/20 to-slate-900 p-4 border border-indigo-500/20 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">
                  Studio Quality Executive & LinkedIn Headshots in Seconds
                </h1>
                <p className="text-xs text-slate-400">
                  Select a casual photo, pick your preferred attire & backdrop, and generate photorealistic portraits.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400 shrink-0">
              <span className="flex items-center text-emerald-400">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Face Identity Preserved
              </span>
              <span className="flex items-center text-sky-400">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> 100% Studio Lighting
              </span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-500/10 p-3.5 border border-rose-500/30 text-rose-300 text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Input Studio Controls (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Step 1: Upload Selfie */}
            <SelfieUpload
              selectedImage={selectedImage}
              onImageSelect={(img) => {
                setSelectedImage(img);
                setErrorMessage(null);
              }}
              onClearImage={() => setSelectedImage(null)}
            />

            {/* Step 2: Choose Style */}
            <StyleSelector
              selectedStyle={selectedStyle}
              onSelectStyle={handleSelectStyle}
            />

            {/* Step 3: Customization Controls & Generate Action */}
            <CustomizationPanel
              selectedStyle={selectedStyle}
              selectedAttire={selectedAttire}
              onSelectAttire={setSelectedAttire}
              selectedExpression={selectedExpression}
              onSelectExpression={setSelectedExpression}
              selectedLighting={selectedLighting}
              onSelectLighting={setSelectedLighting}
              selectedAspectRatio={selectedAspectRatio}
              onSelectAspectRatio={setSelectedAspectRatio}
              selectedQuality={selectedQuality}
              onSelectQuality={setSelectedQuality}
              customPrompt={customPrompt}
              onChangeCustomPrompt={setCustomPrompt}
              onGenerate={() => handleGenerate()}
              isGenerating={isGenerating}
              hasSourceImage={!!selectedImage}
            />
          </div>

          {/* Right Column: Interactive Studio Canvas & Viewer (7 cols) */}
          <div className="lg:col-span-7">
            <div className="sticky top-20">
              <HeadshotViewer
                headshot={activeHeadshot}
                isGenerating={isGenerating}
                onRefine={(refinePrompt) => handleGenerate(refinePrompt)}
                onRegenerate={() => handleGenerate('slight variation in angle and posture')}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Gallery History Drawer */}
      <GalleryHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        activeHeadshot={activeHeadshot}
        onSelectHeadshot={(hs) => {
          setActiveHeadshot(hs);
          setIsHistoryOpen(false);
        }}
        onToggleFavorite={handleToggleFavorite}
        onDeleteHeadshot={handleDeleteHeadshot}
        onClearHistory={handleClearHistory}
      />

      {/* How It Works Educational Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}

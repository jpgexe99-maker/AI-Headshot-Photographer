import React from 'react';
import { Camera, Sparkles, HelpCircle, History, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenHowItWorks: () => void;
  onQuickSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onOpenHowItWorks,
  onQuickSample,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-lg shadow-indigo-500/25">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white">AuraShot</span>
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold tracking-wide text-indigo-400 border border-indigo-500/20">
                AI Studio
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Photorealistic AI Headshot Studio
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onQuickSample}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white transition-all"
            title="Load a sample selfie instantly"
          >
            <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">Try Sample Selfie</span>
            <span className="sm:hidden">Sample</span>
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">How It Works</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 hover:text-white transition-all"
          >
            <History className="h-3.5 w-3.5" />
            <span>Studio History</span>
            {historyCount > 0 && (
              <span className="ml-1 rounded-full bg-indigo-500 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { X, Camera, Sparkles, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg bg-slate-900 p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">How AuraShot Works</h2>
            <p className="text-xs text-slate-400">
              Photorealistic studio rendering powered by Gemini
            </p>
          </div>
        </div>

        <div className="space-y-4 my-6 text-xs text-slate-300">
          <div className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Upload Reference Selfie</h4>
              <p className="text-slate-400 leading-relaxed">
                Upload any casual front-facing phone picture or selfie. Good natural lighting and clear facial features produce the best likeness.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Identity & Structural Analysis</h4>
              <p className="text-slate-400 leading-relaxed">
                The multimodal AI analyzes your facial contours, eye shape, skin tone, hair texture, and unique features to ensure 100% recognizable identity preservation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-white mb-0.5">Studio Attire & Environment Synthesis</h4>
              <p className="text-slate-400 leading-relaxed">
                Replaces casual t-shirts and messy rooms with tailored suits, blazers, professional studio lighting, and executive backgrounds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-[11px] text-slate-400">
          <span className="flex items-center text-emerald-400">
            <ShieldCheck className="mr-1 h-4 w-4" /> Your photos are processed privately
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500 transition-all"
          >
            Got It, Let's Start
          </button>
        </div>
      </div>
    </div>
  );
};

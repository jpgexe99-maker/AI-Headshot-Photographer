import React, { useState } from 'react';
import { Download, Heart, Trash2, X, Eye, Check, Sparkles } from 'lucide-react';
import { GeneratedHeadshot } from '../types';

interface GalleryHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedHeadshot[];
  activeHeadshot: GeneratedHeadshot | null;
  onSelectHeadshot: (headshot: GeneratedHeadshot) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteHeadshot: (id: string) => void;
  onClearHistory: () => void;
}

export const GalleryHistory: React.FC<GalleryHistoryProps> = ({
  isOpen,
  onClose,
  history,
  activeHeadshot,
  onSelectHeadshot,
  onToggleFavorite,
  onDeleteHeadshot,
  onClearHistory,
}) => {
  const [filterFavorites, setFilterFavorites] = useState(false);

  if (!isOpen) return null;

  const displayedHistory = filterFavorites
    ? history.filter((h) => h.isFavorite)
    : history;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="flex h-full w-full max-w-md flex-col bg-slate-950 border-l border-slate-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
              Studio Gallery
            </h2>
            <p className="text-xs text-slate-400">
              {history.length} headshots created in this session
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="my-4 flex items-center justify-between">
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filterFavorites
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${filterFavorites ? 'fill-current' : ''}`} />
            <span>{filterFavorites ? 'Showing Favorites' : 'All Headshots'}</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              Clear Gallery
            </button>
          )}
        </div>

        {/* List of Generated Headshots */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3">
          {displayedHistory.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-slate-500">
              <p className="text-sm font-medium">No headshots found</p>
              <p className="mt-1 text-xs">
                {filterFavorites
                  ? 'No favorites marked yet.'
                  : 'Generate your first headshot to see it here!'}
              </p>
            </div>
          ) : (
            displayedHistory.map((item) => {
              const isSelected = activeHeadshot?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectHeadshot(item)}
                  className={`group relative flex cursor-pointer items-center space-x-3 rounded-xl border p-2.5 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-md'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-950">
                    <img
                      src={item.headshotUrl}
                      alt={item.styleName}
                      className="h-full w-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/30">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between overflow-hidden">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="truncate text-xs font-bold text-white">
                          {item.styleName}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-slate-400">
                        {item.attire}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-[10px] text-indigo-400 font-medium">
                        {item.aspectRatio}
                      </span>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id);
                          }}
                          className={`rounded p-1 ${
                            item.isFavorite
                              ? 'text-rose-400'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              item.isFavorite ? 'fill-current' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteHeadshot(item.id);
                          }}
                          className="rounded p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

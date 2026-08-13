import React, { useState, useMemo } from 'react';
import { HEADSHOT_STYLES } from '../data/styles';
import { HeadshotStyle } from '../types';
import { Search, Sparkles, Check, SlidersHorizontal } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: HeadshotStyle;
  onSelectStyle: (style: HeadshotStyle) => void;
}

const CATEGORIES = ['All', 'Corporate', 'Tech', 'Creative', 'LinkedIn'] as const;

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStyles = useMemo(() => {
    return HEADSHOT_STYLES.filter((style) => {
      const matchesCategory =
        activeCategory === 'All' || style.category === activeCategory;
      const matchesSearch =
        style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        style.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        style.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center text-base font-semibold text-white">
            <span className="mr-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400 border border-indigo-500/30">
              2
            </span>
            Headshot Style & Environment
          </h2>
          <p className="text-xs text-slate-400">
            Select the desired backdrop, atmosphere, and professional tone
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-48">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="no-scrollbar mb-4 flex space-x-1.5 overflow-x-auto border-b border-slate-800/80 pb-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === category
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid of Styles */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
        {filteredStyles.map((style) => {
          const isSelected = selectedStyle.id === style.id;
          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style)}
              className={`group relative cursor-pointer overflow-hidden rounded-xl border p-3 transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex space-x-3">
                {/* Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                  <img
                    src={style.previewUrl}
                    alt={style.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/30 backdrop-blur-[1px]">
                      <div className="rounded-full bg-indigo-600 p-1 text-white shadow-md">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {style.name}
                      </h3>
                      {style.badge && (
                        <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-400 border border-indigo-500/20">
                          {style.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] text-slate-400 leading-tight">
                      {style.description}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {style.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

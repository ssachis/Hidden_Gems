import React from 'react';
import { Globe, Sparkles, ArrowLeft } from 'lucide-react';

const MOODS = [
  {
    id: 'peace',
    label: '🌿 I want Peace',
    description: 'Find quiet escapes, hidden nature spots, and slow places to breathe.',
    tags: ['riverside walks', 'hidden parks', 'calm cafés', 'sunrise spots'],
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=60',
    color: 'from-emerald-500/20 to-emerald-950/45'
  },
  {
    id: 'food',
    label: '🍜 I want Food',
    description: 'Discover the best local eats, street food gems, and iconic restaurants.',
    tags: ['street food trails', 'viral local spots', 'hidden family-run places', 'curated food routes'],
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60',
    color: 'from-amber-500/20 to-amber-950/45'
  },
  {
    id: 'adventure',
    label: '🧭 I want Adventure',
    description: 'Let’s find your next thrill — something you haven’t done before.',
    tags: ['outdoor activities', 'day trips', 'unexplored areas', 'unique experiences'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=60',
    color: 'from-blue-500/20 to-blue-950/45'
  },
  {
    id: 'entertainment',
    label: '🎉 I want Entertainment',
    description: 'Find what’s happening in the city right now.',
    tags: ['events', 'concerts', 'nightlife', 'pop-ups, exhibitions'],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=60',
    color: 'from-purple-500/20 to-purple-950/45'
  }
];

export default function MoodSelector({ locationName, onSelectMood, onBack }) {
  return (
    <div className="space-y-10 animate-fade-in max-w-[1200px] mx-auto px-4 select-none">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Change Location
        </button>
      </div>

      {/* Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/30">
          <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '12s' }} />
          <span>Vibe-tailoring in {locationName}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">
          What are you in the mood for?
        </h1>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans font-light max-w-lg mx-auto">
          We customize your sights, AI matches description, and cultural guide suggestions based on your vibe selection.
        </p>
      </div>

      {/* Grid of Mood Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOODS.map((mood) => (
          <div
            key={mood.id}
            onClick={() => onSelectMood(mood)}
            className="group relative h-[360px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md hover:shadow-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-end p-6 bg-white"
          >
            {/* Background cover */}
            <div 
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-85 pointer-events-none"
              style={{ backgroundImage: `url(${mood.image})` }}
            />
            {/* Gradients */}
            <div className={`absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent`} />
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-40`} />

            {/* Info */}
            <div className="relative z-10 space-y-3.5 text-zinc-900">
              <h3 className="text-lg font-extrabold tracking-tight leading-tight flex items-center gap-1.5 group-hover:text-indigo-400 transition-colors">
                {mood.label}
              </h3>
              
              <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light line-clamp-3">
                {mood.description}
              </p>

              {/* Vibe Sub-tags pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mood.tags.map((tag, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="text-[9px] bg-white/10 text-zinc-800 border border-white/5 px-2 py-0.5 rounded-full font-sans font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Select mood</span>
                <span className="p-1 bg-indigo-600 text-zinc-900 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

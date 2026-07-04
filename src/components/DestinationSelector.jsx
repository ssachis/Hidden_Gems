import React, { useState } from 'react';
import { Search, MapPin, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_DESTINATIONS } from '../services/mockData';

const CITY_IMAGES = {
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&auto=format&fit=crop&q=60",
  cairo: "https://images.unsplash.com/photo-1572252009286-268acec500af?w=800&auto=format&fit=crop&q=60",
  cusco: "https://images.unsplash.com/photo-1587595427660-e7ad00c0cb87?w=800&auto=format&fit=crop&q=60",
  newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=60"
};

export default function DestinationSelector({ onSelectDestination }) {
  const [searchQuery, setSearchQuery] = useState('');
  const destinations = Object.values(MOCK_DESTINATIONS);

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Curated Cultural Travel Journeys</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
          Discover the Soul of Your Next Destination
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          Unveil hidden local gems, listen to immersive AI historical narratives, and build customizable cultural itineraries.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-emerald-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by city or country..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all"
        />
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto px-4">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            onClick={() => onSelectDestination(dest.id)}
            className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer border border-zinc-100 dark:border-zinc-800/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-end"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${CITY_IMAGES[dest.id]})` }} />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-900/45 to-transparent" />

            {/* Cultural Density Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{dest.culturalDensity}% Soul Score</span>
            </div>

            {/* City Info */}
            <div className="relative p-6 space-y-2 z-10 text-white">
              <div className="flex items-center gap-1 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{dest.country}</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                {dest.name}
              </h3>
              <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">
                {dest.description}
              </p>
              
              <div className="pt-2 flex items-center justify-between text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                <span className="font-mono text-[10px] text-zinc-300 bg-black/35 px-2 py-0.5 rounded-md border border-white/10">
                  {dest.coordinates}
                </span>
                <span className="flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredDestinations.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500 dark:text-zinc-400 space-y-2">
            <p className="text-lg font-semibold">No destinations match your search</p>
            <p className="text-sm">Try typing another city or select a pre-loaded one!</p>
          </div>
        )}
      </div>

    </div>
  );
}

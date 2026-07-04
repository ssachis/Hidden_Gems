import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Star, Compass, Info, X, ExternalLink } from 'lucide-react';
import { getFoursquarePlaces } from '../services/foursquareService';

export default function AttractionsGrid({ destination, apiKey }) {
  const [places, setPlaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      const data = await getFoursquarePlaces(destination.id, apiKey);
      setPlaces(data);
      setLoading(false);
    };
    loadPlaces();
  }, [destination.id, apiKey]);

  const categories = ['All', 'Culture & Heritage', 'Hidden Gems', 'Culinary & Dining'];

  const filteredPlaces = activeFilter === 'All' 
    ? places 
    : places.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl border border-zinc-200/40 dark:border-zinc-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Filters Row */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              activeFilter === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPlaces.map((place) => (
          <div
            key={place.fsq_id}
            onClick={() => setSelectedPlace(place)}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-750 hover:shadow-lg rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between"
          >
            {/* Visual Header */}
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                  place.is_hidden_gem 
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50' 
                    : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50'
                }`}>
                  {place.category}
                </span>

                <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{place.rating}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
                  {place.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {place.description}
                </p>
              </div>
            </div>

            {/* Visual Footer */}
            <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
              <span className="flex items-center gap-1 font-mono text-[10px] truncate max-w-[70%]">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {place.address}
              </span>
              
              <span className="text-[10px] bg-zinc-200/70 dark:bg-zinc-800 px-2 py-0.5 rounded font-medium flex-shrink-0">
                {place.reviewCount} tips
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-up">
            
            {/* Modal Image Header */}
            <div className="h-44 relative bg-cover bg-center" style={{ backgroundImage: `url(${selectedPlace.imageUrl})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 bg-black/45 text-white hover:bg-black/70 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-600 rounded-full">
                  {selectedPlace.category}
                </span>
                <h4 className="text-xl font-bold tracking-tight line-clamp-1">
                  {selectedPlace.name}
                </h4>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Rating and review section */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <p className="text-xs text-zinc-400">Visitor Rating</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-bold text-zinc-950 dark:text-zinc-50">{selectedPlace.rating}</span>
                    <span className="text-xs text-zinc-400">/ 10</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-zinc-400">Total Check-Ins / Tips</p>
                  <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {selectedPlace.reviewCount} reviews
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">About</h5>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans font-light">
                  {selectedPlace.description}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Address</h5>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 font-mono text-xs">
                  <MapPin className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                  {selectedPlace.address}
                </p>
              </div>

              {/* Custom Action links */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedPlace.name + " " + selectedPlace.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 py-2.5 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" /> Get Directions
                </a>
                <a
                  href={`https://foursquare.com/v/${selectedPlace.fsq_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 hover:bg-emerald-100 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center transition-colors"
                  title="View on Foursquare"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

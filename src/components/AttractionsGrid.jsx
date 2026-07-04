import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Star, Globe, X, ExternalLink } from 'lucide-react';
import { getFoursquarePlaces } from '../services/foursquareService';

// AI Behavior Constraints and Mock Responses mapped by Vibe
const AI_BEHAVIORS = {
  peace: {
    description: "Focus on low density, aesthetic appeal, and slow travel principles.",
    mockResponse: {
      whyMatchesVibe: "This peaceful spot aligns with your slow travel vibe. It offers a beautiful, low-density aesthetic where you can unwind and take in the natural surroundings in complete tranquility.",
      storyOfPlace: "Originally designed as a sanctuary of retreat, this location has been preserved for centuries to maintain its pristine quiet. Its landscaping reflects an ancient philosophy of mindfulness and garden design.",
      localsDo: "Locals visit early at sunrise to sit on the benches near the water, meditate, and enjoy the clean breeze before the city wakes up."
    }
  },
  food: {
    description: "Focus on flavor-first reviews and local culinary authenticity.",
    mockResponse: {
      whyMatchesVibe: "A culinary icon centered on flavor-first authenticity. It satisfies your appetite for genuine local flavors prepared with recipes passed down through generations.",
      storyOfPlace: "What started as a simple family kitchen evolved into a legendary destination. It has survived changing municipal layouts by relying on its core commitment to regional herbs and high-quality ingredients.",
      localsDo: "Locals skip the main queue by ordering the daily special directly from the kitchen window, then enjoying it on the nearby stone steps."
    }
  },
  adventure: {
    description: "Focus on novelty, physical distance bias, and uniqueness scoring.",
    mockResponse: {
      whyMatchesVibe: "A high-novelty adventure destination that scores extremely high on uniqueness. It pushes you off the beaten path into an exciting experience you won't find anywhere else.",
      storyOfPlace: "Hidden away in an unexplored pocket, this area was historically used by local scouts and trailblazers. Its rugged structures and geological formations have stood unchanged for centuries.",
      localsDo: "Locals gather here on weekends for hiking, cycling, or climbing along the secret trails, packing regional trail mixes for the journey."
    }
  },
  entertainment: {
    description: "Focus on time-sensitive, trending activities and high social energy.",
    mockResponse: {
      whyMatchesVibe: "Vibrant with high social energy, this trending entertainment hub is perfect for experiencing what is happening in the city right now.",
      storyOfPlace: "Hosting a rotating lineup of concerts, pop-ups, and exhibitions, this venue has always been the heart of the city's nightlife and creative communities.",
      localsDo: "Locals check the digital bulletin board for surprise guest performances, arriving late in the evening to mingle at the local courtyard drinks bar."
    }
  }
};

// Custom 3D Tilt Card Wrapper Component
function TiltCard({ place, onClick, index }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Smooth 3D tilt calculations (max 7 degrees)
    setRotateX((y / (box.height / 2)) * -7);
    setRotateY((x / (box.width / 2)) * 7);
    
    // Parallax background translation (max 10px translate)
    setMouseX((x / (box.width / 2)) * 10);
    setMouseY((y / (box.height / 2)) * 10);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setMouseX(0);
    setMouseY(0);
  };

  // Bento Grid size mapping based on index for architectural variation
  let spanClass = "h-[320px]";
  if (index === 0) {
    spanClass = "h-[360px] md:col-span-2";
  } else if (index === 3) {
    spanClass = "h-[420px]";
  } else if (index === 5) {
    spanClass = "h-[380px] md:col-span-2 lg:col-span-1";
  }

  return (
    <div
      role="button"
      aria-label={`View details for ${place.name}`}
      tabIndex={0}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.025 : 1}, ${isHovered ? 1.025 : 1}, 1)`,
        transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform'
      }}
      className={`group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer bg-white border border-zinc-200/20 dark:border-zinc-800/60 ${spanClass}`}
    >
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ 
          backgroundImage: `url(${place.imageUrl})`,
          transform: `scale(1.18) translate(${mouseX}px, ${mouseY}px)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
      
      {/* Dark Vibe Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-950/20 opacity-40" />

      {/* Card Info Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-10 text-zinc-900 select-none">
        
        {/* Top Badges */}
        <div className="flex justify-between items-start">
          <span className="text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
            {place.category}
          </span>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{place.rating}</span>
          </div>
        </div>

        {/* Bottom Title & 1-line AI vibe */}
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
            {place.name}
          </h3>
          
          <p className="text-xs text-indigo-200/90 font-sans font-light tracking-wide leading-relaxed italic line-clamp-2">
            ✨ {place.vibeDescription}
          </p>
        </div>

      </div>
    </div>
  );
}

export default function AttractionsGrid({ destination, apiKey, selectedMood }) {
  const [places, setPlaces] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  // AI details layer states
  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);
      const data = await getFoursquarePlaces(destination.id, apiKey);
      setPlaces(data);
      setLoading(false);
    };
    loadPlaces();
  }, [destination.id, apiKey]);

  // Load dynamic Gemini or local matched vibe insights
  useEffect(() => {
    if (!selectedPlace) {
      setAiData(null);
      return;
    }

    const fetchAiData = async () => {
      setLoadingAi(true);
      const moodText = selectedMood?.label || 'general discovery';
      const moodId = selectedMood?.id || 'peace';
      const behavior = AI_BEHAVIORS[moodId] || AI_BEHAVIORS.peace;
      
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (isLocal) {
        try {
          console.log(`[Grid] Querying local proxy backend for matched-insights for: ${selectedPlace.name}`);
          const response = await fetch('/api/matched-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              placeName: selectedPlace.name,
              moodText,
              behaviorDescription: behavior.description
            })
          });
          const parsed = await response.json();
          setAiData(parsed);
          setLoadingAi(false);
          return;
        } catch (err) {
          console.warn("[Grid] Local proxy for matched-insights failed, falling back to direct / mock:", err.message);
        }
      }

      const keySet = apiKey && apiKey !== 'enter api key' && apiKey !== '';

      if (keySet) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an expert cultural guide. The user is visiting ${selectedPlace.name} in the mood for "${moodText}".
                  Apply these AI behavior constraints to your answer: ${behavior.description}
                  Provide a JSON response with exactly three fields (no markdown, no backticks, raw JSON only):
                  1. "whyMatchesVibe": A short, inspiring 2-sentence explanation of how this place satisfies the "${moodText}" vibe based on the behavior constraints.
                  2. "storyOfPlace": A fascinating, mysterious 3-sentence historical or cultural story about this place.
                  3. "localsDo": A 2-sentence description of what local residents do here to experience it authentically.
                  `
                }]
              }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });
          
          const result = await response.json();
          const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
          const parsed = JSON.parse(text);
          setAiData(parsed);
        } catch (error) {
          console.warn("Gemini fetch failed, using local mock matches:", error);
          setAiData(behavior.mockResponse);
        }
      } else {
        // Geolocation simulated delay for high fidelity AI feel
        setTimeout(() => {
          setAiData(behavior.mockResponse);
          setLoadingAi(false);
        }, 600);
        return;
      }
      setLoadingAi(false);
    };

    fetchAiData();
  }, [selectedPlace, apiKey, selectedMood]);

  const categories = ['All', 'Culture & Heritage', 'Hidden Gems', 'Culinary & Dining'];

  const filteredPlaces = activeFilter === 'All' 
    ? places 
    : places.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse pt-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-zinc-200/50 dark:bg-zinc-800/40 rounded-3xl border border-zinc-200/40 dark:border-zinc-850" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Category Filter Selector Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            aria-label={`Filter by ${cat}`}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
              activeFilter === cat
                ? 'bg-indigo-600 text-zinc-900 shadow-md shadow-indigo-600/10'
                : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-250 dark:hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((place, idx) => (
          <TiltCard
            key={place.fsq_id}
            place={place}
            index={idx}
            onClick={() => setSelectedPlace(place)}
          />
        ))}
      </div>

      {/* Place Details Modal (AI matched layer) */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            
            {/* Modal Image Header Banner */}
            <div className="h-56 relative bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${selectedPlace.imageUrl})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              
              {/* Close Button */}
              <button
                aria-label="Close details"
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 bg-black/60 text-zinc-900 hover:bg-black/85 p-2 rounded-full border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="absolute bottom-4 left-6 right-6 text-zinc-900 space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 bg-indigo-600 rounded-full border border-indigo-500">
                  {selectedPlace.category}
                </span>
                <h4 className="text-2xl font-black tracking-tight leading-tight line-clamp-1">
                  {selectedPlace.name}
                </h4>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Visitor Rating</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">{selectedPlace.rating}</span>
                    <span className="text-zinc-400">/ 10</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Locals Tips Count</span>
                  <p className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50 mt-1">
                    {selectedPlace.reviewCount} tips
                  </p>
                </div>
              </div>

              {/* AI MATCH LAYER: Killer feature */}
              <div className="space-y-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/30 p-5 rounded-2xl">
                
                <h5 className="text-[10px] tracking-wider uppercase font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Under-The-Radar AI Insights
                </h5>

                {loadingAi ? (
                  <div className="space-y-3 py-2 animate-pulse">
                    <div className="h-4 bg-indigo-200/30 dark:bg-indigo-900/20 rounded w-3/4" />
                    <div className="h-4 bg-indigo-200/30 dark:bg-indigo-900/20 rounded w-5/6" />
                    <div className="h-4 bg-indigo-200/30 dark:bg-indigo-900/20 rounded w-2/3" />
                  </div>
                ) : aiData ? (
                  <div className="space-y-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                    
                    {/* Why matches vibe */}
                    <div className="space-y-1">
                      <p className="font-bold text-indigo-700 dark:text-indigo-300">
                        Why this matches your "{selectedMood?.label || 'discovery'}" vibe:
                      </p>
                      <p className="font-light font-sans">{aiData.whyMatchesVibe}</p>
                    </div>

                    {/* Story of the place */}
                    <div className="space-y-1">
                      <p className="font-bold text-indigo-700 dark:text-indigo-300">
                        The Story under the hood:
                      </p>
                      <p className="font-light font-sans">{aiData.storyOfPlace}</p>
                    </div>

                    {/* What locals do */}
                    <div className="space-y-1">
                      <p className="font-bold text-indigo-700 dark:text-indigo-300">
                        What locals do here:
                      </p>
                      <p className="font-light font-sans">{aiData.localsDo}</p>
                    </div>

                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">Failed to load AI vibe insights. Check your connection.</p>
                )}
              </div>

              {/* Basic Details / Address */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h6 className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Description</h6>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans font-light">
                    {selectedPlace.description}
                  </p>
                </div>

                <div className="space-y-1">
                  <h6 className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Address</h6>
                  <p className="text-xs text-zinc-700 dark:text-zinc-400 font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {selectedPlace.address}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2 flex-shrink-0">
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
                  className="w-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 hover:bg-indigo-100 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center transition-colors"
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

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StorytellerPanel from './components/StorytellerPanel';
import AttractionsGrid from './components/AttractionsGrid';
import ItineraryPlanner from './components/ItineraryPlanner';
import CulturalGuideChat from './components/CulturalGuideChat';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { MOCK_DESTINATIONS } from './services/mockData';
import { ChevronLeft, MapPin, Sparkles } from 'lucide-react';
import MoodSelector from './components/MoodSelector';
import LocationLanding from './components/LocationLanding';

export default function App() {
  // Credentials & Settings States
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
  const [foursquareKey, setFoursquareKey] = useState(() => localStorage.getItem('foursquare_key') || import.meta.env.VITE_FOURSQUARE_API_KEY || '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark mode for premium feel
  });

  // Screen Routing & Destination States
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'mood' | 'discovery'
  const [locationName, setLocationName] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'itinerary' | 'chat' | 'analytics'
  const [demoMappingMessage, setDemoMappingMessage] = useState('');

  // Apply Theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSaveKeys = (gemKey, fsqKey) => {
    setGeminiKey(gemKey);
    setFoursquareKey(fsqKey);
    localStorage.setItem('gemini_key', gemKey);
    localStorage.setItem('foursquare_key', fsqKey);
  };

  const resolveDestination = (inputName) => {
    const clean = inputName.toLowerCase().trim();

    // Check keyword matching
    if (clean.includes('kyoto') || clean.includes('japan') || clean.includes('tokyo') || clean.includes('osaka')) return 'kyoto';
    if (clean.includes('rome') || clean.includes('italy') || clean.includes('milan') || clean.includes('florence') || clean.includes('venice')) return 'rome';
    if (clean.includes('cairo') || clean.includes('egypt') || clean.includes('pyramid') || clean.includes('alexandria') || clean.includes('giza')) return 'cairo';
    if (clean.includes('cusco') || clean.includes('peru') || clean.includes('machu') || clean.includes('lima') || clean.includes('andes')) return 'cusco';
    if (clean.includes('new york') || clean.includes('nyc') || clean.includes('manhattan') || clean.includes('brooklyn') || clean.includes('america') || clean.includes('usa') || clean.includes('united states')) return 'newyork';

    // If keys are set, build a custom destination object dynamically!
    if ((geminiKey && geminiKey !== 'enter api key') || (foursquareKey && foursquareKey !== 'enter api key')) {
      return {
        id: clean.replace(/\s+/g, ''),
        name: inputName.charAt(0).toUpperCase() + inputName.slice(1),
        country: 'Live Search',
        coordinates: 'Live Discovery',
        description: `Experience immersive stories, local sights, and custom itineraries for ${inputName}.`,
        culturalDensity: 88,
        sentimentScore: 92,
        categoryStats: [
          { name: "Cultural Sites", value: 40 },
          { name: "Local Dining", value: 30 },
          { name: "Secret Spots", value: 30 }
        ],
        guideProfile: {
          name: 'Aura',
          title: `Local Companion in ${inputName}`,
          avatar: '🗺️',
          greeting: `Hello! I'm Aura, your AI guide. Let's unearth custom local sights, events, and explore the unique heritage of ${inputName} together.`
        },
        story: {
          title: `Essence of ${inputName}`,
          narration: `Loading your custom generated story for ${inputName}...`,
          audioLength: '1m 20s'
        },
        attractions: [],
        events: []
      };
    }

    // Default to Kyoto in demo mode if nothing matches, and show matching banner
    return 'kyoto';
  };

  const handleLocationSelected = (name) => {
    setLocationName(name);
    setCurrentScreen('mood');

    // Check if we need to show mapping banner
    const clean = name.toLowerCase().trim();
    const matchesDemo = ['kyoto', 'japan', 'tokyo', 'osaka', 'rome', 'italy', 'milan', 'florence', 'venice', 'cairo', 'egypt', 'pyramid', 'alexandria', 'giza', 'cusco', 'peru', 'machu', 'lima', 'andes', 'new york', 'nyc', 'manhattan', 'brooklyn', 'america', 'usa', 'united states'].some(kw => clean.includes(kw));
    const keysSet = (geminiKey && geminiKey !== 'enter api key') || (foursquareKey && foursquareKey !== 'enter api key');

    if (!matchesDemo && !keysSet) {
      // Find what mapped name corresponds to Kyoto
      setDemoMappingMessage(`Demo Mode Active: Mapping "${name}" to Kyoto. (Add keys in Settings to search anywhere!)`);
      setTimeout(() => setDemoMappingMessage(''), 5000);
    } else {
      setDemoMappingMessage('');
    }
  };

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    const resolved = resolveDestination(locationName);
    setSelectedCityId(resolved);
    setActiveTab('explore');
    setCurrentScreen('discovery');
  };

  const handleBackToLocation = () => {
    setCurrentScreen('landing');
    setLocationName('');
    setSelectedMood(null);
    setSelectedCityId(null);
  };

  const handleBackToMood = () => {
    setCurrentScreen('mood');
    setSelectedMood(null);
    setSelectedCityId(null);
  };

  const handleBackToHome = () => {
    handleBackToLocation();
  };

  const activeDestination = typeof selectedCityId === 'object' && selectedCityId !== null
    ? selectedCityId
    : selectedCityId ? MOCK_DESTINATIONS[selectedCityId] : null;

  const isDemoMode = (!geminiKey || geminiKey === 'enter api key' || geminiKey === '') && (!foursquareKey || foursquareKey === 'enter api key' || foursquareKey === '');

  // Tabs layout mappings
  const tabs = [
    { id: 'explore', label: '🏛️ Foursquare Sights' },
    { id: 'itinerary', label: '🗺️ Custom Itinerary' },
    { id: 'chat', label: '💬 Cultural Guide' },
    { id: 'analytics', label: '📊 Insights' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-white text-zinc-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col font-sans">

      {/* Header component - hidden on fullscreen onboarding landing */}
      {currentScreen !== 'landing' && (
        <Header
          onOpenSettings={() => setSettingsOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          currentScreen={currentScreen}
          onBackToHome={handleBackToHome}
          isDemoMode={isDemoMode}
        />
      )}

      {/* Main body */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-6 py-6 flex flex-col justify-center">

        {/* Demo Mode mapping banner notification */}
        {demoMappingMessage && (
          <div className="max-w-md mx-auto mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 rounded-xl p-3 text-xs text-center animate-fade-in relative z-25">
            {demoMappingMessage}
          </div>
        )}

        {currentScreen === 'landing' && (
          <LocationLanding onLocationSelected={handleLocationSelected} />
        )}

        {currentScreen === 'mood' && (
          <MoodSelector
            locationName={locationName}
            onSelectMood={handleSelectMood}
            onBack={handleBackToLocation}
          />
        )}

        {currentScreen === 'discovery' && (
          /* SCREEN 3: Destination Discovery & Tab Controls */
          <div className="space-y-6 max-w-5xl mx-auto w-full animate-fade-in">

            {/* Navigation back helper */}
            <button
              onClick={handleBackToMood}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Mood Selector
            </button>

            {/* Destination Metadata Showcase Card */}
            <div className="bg-white dark:bg-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeDestination?.country}</span>
                  <span className="text-zinc-300 dark:text-zinc-700 select-none">•</span>
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">{activeDestination?.coordinates}</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {activeDestination?.name}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-light max-w-2xl">
                  {activeDestination?.description}
                </p>
              </div>

              {/* Cultural Score Badge */}
              <div className="flex-shrink-0 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl text-center flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" /> Soul Rating
                </div>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {activeDestination?.culturalDensity}%
                </p>
              </div>
            </div>

            {/* Screen Tabs Nav */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-1 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all rounded-t-xl border-b-2 -mb-[2px] ${activeTab === tab.id
                    ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab Panel Screen View */}
            <div className="pt-4 min-h-[400px]">
              {activeTab === 'explore' && (
                <AttractionsGrid
                  destination={activeDestination}
                  apiKey={foursquareKey}
                  selectedMood={selectedMood}
                />
              )}
              {activeTab === 'itinerary' && (
                <ItineraryPlanner
                  destination={activeDestination}
                  apiKey={geminiKey}
                />
              )}
              {activeTab === 'chat' && (
                <CulturalGuideChat
                  destination={activeDestination}
                  apiKey={geminiKey}
                />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsDashboard
                  destination={activeDestination}
                  darkMode={darkMode}
                />
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      {currentScreen !== 'landing' && (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-white dark:bg-white">
          <p>© 2026 Under-The-Radar. Crafted with Gemini 3.5 & Foursquare APIs.</p>
        </footer>
      )}

    </div>
  );
}

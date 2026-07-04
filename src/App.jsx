import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import DestinationSelector from './components/DestinationSelector';
import StorytellerPanel from './components/StorytellerPanel';
import AttractionsGrid from './components/AttractionsGrid';
import ItineraryPlanner from './components/ItineraryPlanner';
import CulturalGuideChat from './components/CulturalGuideChat';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { MOCK_DESTINATIONS } from './services/mockData';
import { ChevronLeft, MapPin, Sparkles } from 'lucide-react';

export default function App() {
  // Credentials & Settings States
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_key') || '');
  const [foursquareKey, setFoursquareKey] = useState(() => localStorage.getItem('foursquare_key') || '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark mode for premium feel
  });

  // Screen Routing & Destination States
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'discovery'
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [activeTab, setActiveTab] = useState('story'); // 'story' | 'explore' | 'itinerary' | 'chat' | 'analytics'

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

  const handleSelectDestination = (cityId) => {
    setSelectedCityId(cityId);
    setActiveTab('story');
    setCurrentScreen('discovery');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedCityId(null);
  };

  const activeDestination = selectedCityId ? MOCK_DESTINATIONS[selectedCityId] : null;
  const isDemoMode = !geminiKey && !foursquareKey;

  // Tabs layout mappings
  const tabs = [
    { id: 'story', label: '📖 Audio Narrative' },
    { id: 'explore', label: '🏛️ Foursquare Sights' },
    { id: 'itinerary', label: '🗺️ Custom Itinerary' },
    { id: 'chat', label: '💬 Cultural Guide' },
    { id: 'analytics', label: '📊 Insights' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Header component */}
      <Header
        onOpenSettings={() => setSettingsOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        currentScreen={currentScreen}
        onBackToHome={handleBackToHome}
        isDemoMode={isDemoMode}
      />

      {/* Main body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8">
        
        {currentScreen === 'home' ? (
          /* SCREEN 1: Home Dashboard / Destination Selection */
          <DestinationSelector onSelectDestination={handleSelectDestination} />
        ) : (
          /* SCREEN 2: Destination Discovery & Tab Controls */
          <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
            
            {/* Navigation back helper */}
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Destinations
            </button>

            {/* Destination Metadata Showcase Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all rounded-t-xl border-b-2 -mb-[2px] ${
                    activeTab === tab.id
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
              {activeTab === 'story' && (
                <StorytellerPanel 
                  destination={activeDestination} 
                  apiKey={geminiKey} 
                />
              )}
              {activeTab === 'explore' && (
                <AttractionsGrid 
                  destination={activeDestination} 
                  apiKey={foursquareKey} 
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
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-950">
        <p>© 2026 AuraQuest. Crafted with Gemini 3.5 & Foursquare APIs.</p>
      </footer>

      {/* Global Settings Credentials Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        geminiKey={geminiKey}
        foursquareKey={foursquareKey}
        onSaveKeys={handleSaveKeys}
      />

    </div>
  );
}

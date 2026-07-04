import React from 'react';
import { Compass, Settings, Sun, Moon, Sparkles } from 'lucide-react';

export default function Header({ 
  onOpenSettings, 
  darkMode, 
  onToggleDarkMode, 
  currentScreen, 
  onBackToHome,
  isDemoMode 
}) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={onBackToHome}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
              AuraQuest
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" /> GenAI
              </span>
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Cultural Exploration & Hidden Gems
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Demo Mode Badge */}
          {isDemoMode && (
            <div className="text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 px-2.5 py-1 rounded-lg font-medium">
              Demo Mode Active
            </div>
          )}

          {/* Home Nav helper */}
          {currentScreen !== 'home' && (
            <button
              onClick={onBackToHome}
              className="text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              Destinations
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-600" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 relative"
            title="API Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
}

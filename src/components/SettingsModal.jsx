import React, { useState } from 'react';
import { X, Key, Info, Check, AlertTriangle } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  geminiKey, 
  foursquareKey, 
  onSaveKeys 
}) {
  const [gemKey, setGemKey] = useState(geminiKey || '');
  const [fsqKey, setFsqKey] = useState(foursquareKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveKeys(gemKey, fsqKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform scale-100 transition-transform">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">API Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Note Alert */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-xl p-3 flex gap-2.5 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Exploring in Demo Mode?</p>
              Leave keys blank to browse curated cultural data for Kyoto, Cusco, Rome, Cairo, and NYC using realistic AI simulation.
            </div>
          </div>

          {/* Gemini Key */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={gemKey}
              onChange={(e) => setGemKey(e.target.value)}
              placeholder="AI storytelling & Guide chat"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Foursquare Key */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Foursquare Developer API Key
            </label>
            <input
              type="password"
              value={fsqKey}
              onChange={(e) => setFsqKey(e.target.value)}
              placeholder="Real-time attractions search"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Warning */}
          {(gemKey || fsqKey) && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 rounded-xl p-3 flex gap-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p>Keys are stored locally in your browser's <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">localStorage</code> and are sent directly to the endpoints.</p>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saved}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white rounded-lg px-4 py-2 font-medium text-sm transition-colors shadow-sm flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 animate-scale-up" /> Saved!
                </>
              ) : (
                'Save Keys'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

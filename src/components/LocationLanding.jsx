import React, { useState } from 'react';
import { Globe, MapPin, ArrowRight } from 'lucide-react';

export default function LocationLanding({ onLocationSelected }) {
  const [typedLocation, setTypedLocation] = useState('');
  const [detecting, setDetecting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!typedLocation.trim()) return;
    onLocationSelected(typedLocation.trim());
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    let resolved = false;

    console.log("Detect location clicked. Initializing browser geolocation query...");

    const handleFallback = (reason) => {
      if (resolved) return;
      resolved = true;
      console.warn(`Geolocation fallback triggered. Reason: ${reason}. Defaulting to New York City.`);
      setTimeout(() => {
        setDetecting(false);
        onLocationSelected("New York City");
      }, 1000);
    };

    // Set a maximum timeout of 4500ms to allow geocoding request to resolve
    const fallbackTimeout = setTimeout(() => {
      handleFallback("Timeout (Hanging permission dialog or network latency)");
    }, 4500);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (resolved) return;

          try {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Successfully retrieved coordinates:");
            console.log("Lat:", latitude);
            console.log("Lng:", longitude);

            // Fetch actual City/State name using OpenStreetMap Nominatim reverse geocoder
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`, {
              headers: {
                'Accept-Language': 'en'
              }
            });
            const data = await res.json();
            
            clearTimeout(fallbackTimeout);
            resolved = true;

            const address = data.address || {};
            const resolvedCity = address.city || address.town || address.village || address.suburb || address.state || address.county || "Detected Location";
            
            console.log(`Nominatim Geocoded Location resolved to: ${resolvedCity}`);
            
            setDetecting(false);
            onLocationSelected(resolvedCity);
          } catch (err) {
            console.error("Geocoding failed, falling back to coordinate mapping:", err);
            
            // Fallback coordinate mapping to closest preloaded city
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const demoCities = [
              { id: 'kyoto', lat: 35.0116, lng: 135.7681, name: 'Kyoto' },
              { id: 'rome', lat: 41.9028, lng: 12.4964, name: 'Rome' },
              { id: 'cairo', lat: 30.0444, lng: 31.2357, name: 'Cairo' },
              { id: 'cusco', lat: -13.5319, lng: -71.9675, name: 'Cusco' },
              { id: 'newyork', lat: 40.7128, lng: -74.0060, name: 'New York City' }
            ];

            let closest = demoCities[0];
            let minDist = Infinity;

            demoCities.forEach(c => {
              const dist = Math.sqrt(Math.pow(lat - c.lat, 2) + Math.pow(lng - c.lng, 2));
              if (dist < minDist) {
                minDist = dist;
                closest = c;
              }
            });
            
            clearTimeout(fallbackTimeout);
            resolved = true;
            setDetecting(false);
            onLocationSelected(closest.name);
          }
        },
        (error) => {
          clearTimeout(fallbackTimeout);
          console.error("Error getting location coordinates:", error);
          handleFallback(`Geolocation Error (Code ${error.code}: ${error.message})`);
        },
        { 
          enableHighAccuracy: true,
          timeout: 4000,
          maximumAge: 0
        }
      );
    } else {
      clearTimeout(fallbackTimeout);
      console.warn("Navigator Geolocation is not supported by this browser.");
      handleFallback("Browser unsupported");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-8 bg-zinc-950 select-none overflow-hidden">
      
      {/* Background Image - Increased opacity for a clearer view of the misty peaks */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-82 animate-ken-burns" 
        style={{ 
          backgroundImage: `url('./bg-mountains.jpg')`,
          imageRendering: '-webkit-optimize-contrast' // enhances browser rendering sharpness
        }}
      />
      {/* Dark Overlay - reduced overlay opacity for enhanced clarity */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

      {/* Top Header Section (App Name "Under-The-Radar") */}
      <div className="relative z-10 flex items-center justify-between max-w-[1400px] w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              Under-The-Radar
            </h1>
            <p className="text-[10px] text-white/95 font-sans tracking-wider uppercase font-bold">
              Vibe-based Travel Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Center Box: Location Selector Panel */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-black/45 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-md space-y-6 text-center text-white animate-scale-up">
        <div className="space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Where do you want to go?
          </h2>
          <p className="text-[10px] text-zinc-300 font-sans font-light max-w-xs mx-auto leading-relaxed">
            Enter a city name to unearth local sights and events.
          </p>
        </div>

        {/* Input Form & Custom button actions */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2 relative">
            <input
              type="text"
              value={typedLocation}
              onChange={(e) => setTypedLocation(e.target.value)}
              placeholder="e.g. Kyoto, Rome, Cusco..."
              className="w-full bg-black/55 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-white placeholder:text-zinc-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!typedLocation.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-4 py-3 rounded-xl transition-colors flex items-center justify-center font-bold"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-bold py-0.5">
            <div className="flex-1 h-[1px] bg-white/5" />
            <span>OR</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          {/* Location button */}
          <button
            onClick={handleDetectLocation}
            disabled={detecting}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/15 text-white rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            {detecting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Detect My Location</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer credits block */}
      <div className="relative z-10 text-center text-[10px] text-zinc-500 font-sans tracking-wide">
        © 2026 Under-The-Radar. Crafted with Gemini 3.5 & Foursquare APIs.
      </div>

    </div>
  );
}

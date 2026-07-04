import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Plus, Trash2, Clock, MapPin, GripVertical, Compass } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateItinerary } from '../services/geminiService';

// Sortable Item Component
function SortableActivity({ activity, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 p-4 rounded-xl shadow-sm hover:shadow transition-shadow group relative"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 flex-shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Info */}
      <div className="flex-1 space-y-1 select-none">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1 font-semibold">
            <Clock className="w-3 h-3" /> {activity.time}
          </span>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5">
            <MapPin className="w-3 h-3" /> {activity.location}
          </span>
        </div>
        
        <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 line-clamp-1 leading-snug">
          {activity.title}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          {activity.description}
        </p>
      </div>

      {/* Action to delete */}
      <button
        onClick={() => onDelete(activity.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ItineraryPlanner({ destination, apiKey }) {
  const [days, setDays] = useState([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [duration, setDuration] = useState(3);
  const [preferences, setPreferences] = useState('');
  const [generating, setGenerating] = useState(false);

  // Setup sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging 8px before activating, allowing clean clicks on buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchItinerary = async () => {
    setGenerating(true);
    const data = await generateItinerary(destination.id, duration, preferences, apiKey);
    setDays(data);
    setActiveDayIndex(0);
    setGenerating(false);
  };

  useEffect(() => {
    fetchItinerary();
  }, [destination.id]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDays((prevDays) => {
      const updatedDays = [...prevDays];
      const currentDay = updatedDays[activeDayIndex];
      const activities = [...currentDay.activities];

      const oldIndex = activities.findIndex((a) => a.id === active.id);
      const newIndex = activities.findIndex((a) => a.id === over.id);

      currentDay.activities = arrayMove(activities, oldIndex, newIndex);
      return updatedDays;
    });
  };

  const deleteActivity = (activityId) => {
    setDays((prevDays) => {
      const updatedDays = [...prevDays];
      const currentDay = updatedDays[activeDayIndex];
      currentDay.activities = currentDay.activities.filter(a => a.id !== activityId);
      return updatedDays;
    });
  };

  const addCustomActivity = () => {
    const title = prompt("Enter activity title:");
    if (!title) return;
    const location = prompt("Enter location (e.g. Gion District, Testaccio):") || "Local Spot";
    const time = prompt("Enter time (e.g. 04:00 PM):") || "04:00 PM";
    const description = prompt("Enter a brief description:") || "Custom added activity.";

    setDays((prevDays) => {
      const updatedDays = [...prevDays];
      const currentDay = updatedDays[activeDayIndex];
      currentDay.activities.push({
        id: `act-custom-${Date.now()}`,
        time,
        title,
        description,
        location
      });
      return updatedDays;
    });
  };

  const currentDayData = days[activeDayIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* Sidebar: Preferences Form */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 h-fit">
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-zinc-900 dark:text-white">Plan Builder</h3>
        </div>

        {/* Days Count */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Duration (Days)</label>
          <div className="flex gap-1.5 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg border border-zinc-200/40 dark:border-zinc-850">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`flex-1 text-center py-1 text-xs font-bold rounded-md transition-all ${
                  duration === d
                    ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-450 dark:hover:text-zinc-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Preferences</label>
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g. Slow-paced, traditional teahouses, vegetarian culinary options..."
            rows={3}
            className="w-full text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={fetchItinerary}
          disabled={generating}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white rounded-lg py-2.5 font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {generating ? 'Drafting Itinerary...' : 'Build Custom Plan'}
        </button>
      </div>

      {/* Main Content: Daily activities sortable list */}
      <div className="md:col-span-2 space-y-4">
        
        {/* Day selection tabs */}
        {days.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 border-b border-zinc-200/50 dark:border-zinc-800/60">
            {days.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeDayIndex === idx
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-zinc-450 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {day.day}
              </button>
            ))}
          </div>
        )}

        {generating ? (
          <div className="space-y-4 py-12 flex flex-col items-center justify-center animate-pulse">
            <Compass className="w-8 h-8 text-zinc-300 dark:text-zinc-750 animate-spin" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Crafting your cultural experience itinerary...</p>
          </div>
        ) : currentDayData ? (
          <div className="space-y-4">
            
            {/* Day Header Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">
                Drag handle to re-order. Re-orders are saved automatically.
              </span>
              <button
                onClick={addCustomActivity}
                className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 rounded"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stop
              </button>
            </div>

            {/* Drag & Drop List Context */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentDayData.activities.map(a => a.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {currentDayData.activities.map((activity) => (
                    <SortableActivity
                      key={activity.id}
                      activity={activity}
                      onDelete={deleteActivity}
                    />
                  ))}

                  {currentDayData.activities.length === 0 && (
                    <div className="py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-400 dark:text-zinc-500 space-y-2">
                      <p className="text-sm font-semibold">No stops scheduled for this day</p>
                      <button 
                        onClick={addCustomActivity}
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        Add your first stop now
                      </button>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>

          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400">
            <p className="text-sm">Click "Build Custom Plan" to generate your travel itinerary.</p>
          </div>
        )}

      </div>

    </div>
  );
}

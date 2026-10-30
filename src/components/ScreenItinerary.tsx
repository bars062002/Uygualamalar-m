import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  Plus,
  Compass,
  Flame,
  UtensilsCrossed,
  Sparkles,
  Luggage,
  Trash2,
} from 'lucide-react';
import { ItineraryItem, ChecklistItem } from '../data/mockData';
import { calculateChecklistProgress } from '../utils/itinerary';

interface ScreenItineraryProps {
  itinerary: ItineraryItem[];
  checklist: ChecklistItem[];
  onToggleItineraryItem: (id: string) => void;
  onAddItineraryItem: (item: Omit<ItineraryItem, 'id' | 'completed'>) => void;
  onToggleChecklistItem: (id: string) => void;
  onAddChecklistItem: (label: string, category: 'essentials' | 'gear' | 'documents') => void;
}

export const ScreenItinerary: React.FC<ScreenItineraryProps> = ({
  itinerary,
  checklist,
  onToggleItineraryItem,
  onAddItineraryItem,
  onToggleChecklistItem,
  onAddChecklistItem,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'checklist'>('schedule');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState<ItineraryItem['category']>('adventure');
  const [newNotes, setNewNotes] = useState('');

  // Checklist input
  const [newChecklistLabel, setNewChecklistLabel] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState<'essentials' | 'gear' | 'documents'>('essentials');

  const checklistProgress = calculateChecklistProgress(checklist);

  const days = [1, 2, 3];
  const dayItems = itinerary.filter((item) => item.day === selectedDay);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddItineraryItem({
      day: selectedDay,
      time: newTime,
      title: newTitle.trim(),
      category: newCategory,
      location: newLocation.trim() || 'Retreat Grounds',
      notes: newNotes.trim() || 'Custom planned retreat activity.',
    });
    setNewTitle('');
    setNewNotes('');
    setNewLocation('');
    setShowAddActivityModal(false);
  };

  const handleCreateChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistLabel.trim()) return;
    onAddChecklistItem(newChecklistLabel.trim(), newChecklistCategory);
    setNewChecklistLabel('');
  };

  const getCategoryIcon = (cat: ItineraryItem['category']) => {
    switch (cat) {
      case 'adventure': return <Compass className="w-4 h-4 text-sky-600" />;
      case 'wellness': return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'dining': return <UtensilsCrossed className="w-4 h-4 text-emerald-600" />;
      case 'arrival': return <MapPin className="w-4 h-4 text-stone-600" />;
      case 'departure': return <Luggage className="w-4 h-4 text-amber-600" />;
      default: return <Clock className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="w-full pb-20 sm:pb-8 space-y-6">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Expedition & Itinerary
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Curated rhythm for Fjord Pine Pavilion
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddActivityModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Segmented View Mode Tabs */}
        <div className="grid grid-cols-2 p-1 bg-stone-200/70 dark:bg-stone-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === 'schedule'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Daily Schedule ({itinerary.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <span>Packing Checklist</span>
            <span className="px-1.5 py-0.2 bg-stone-200 dark:bg-stone-700 text-[10px] rounded font-mono">
              {checklistProgress.percentage}%
            </span>
          </button>
        </div>
      </div>

      {/* SCHEDULE VIEW */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`flex-1 py-2 px-3 rounded-xl border text-center transition ${
                  selectedDay === day
                    ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                  Day 0{day}
                </div>
                <div className="text-xs font-semibold">
                  {day === 1 ? 'Arrival' : day === 2 ? 'Exploration' : 'Farewell'}
                </div>
              </button>
            ))}
          </div>

          {/* Timeline Items */}
          <div className="space-y-3 pt-2">
            {dayItems.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-500">
                No events scheduled for Day {selectedDay}. Tap "Add Event" to plan your morning hike or dinner!
              </div>
            ) : (
              dayItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleItineraryItem(item.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                    item.completed
                      ? 'bg-stone-100/60 dark:bg-stone-900/40 border-stone-200/60 dark:border-stone-800/60 opacity-80'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'completed'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleItineraryItem(item.id);
                    }}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
                    }`}
                  >
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
                        <Clock className="w-3 h-3" />
                        <span>{item.time}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{item.category}</span>
                      </div>
                      <div className="p-1 rounded bg-stone-100 dark:bg-stone-800">
                        {getCategoryIcon(item.category)}
                      </div>
                    </div>

                    <h4
                      className={`text-sm font-semibold transition ${
                        item.completed
                          ? 'line-through text-stone-400 dark:text-stone-500'
                          : 'text-stone-900 dark:text-stone-100'
                      }`}
                    >
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{item.location}</span>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 pt-1 leading-relaxed">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CHECKLIST VIEW */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {/* Progress Card */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs font-medium text-stone-500">
                Departure Readiness
              </div>
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
                {checklistProgress.completed} of {checklistProgress.total} Items Packed
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-stone-200 dark:border-stone-800 flex items-center justify-center font-mono font-bold text-xs text-stone-900 dark:text-stone-100 relative">
              <div
                className="absolute inset-0 rounded-full border-4 border-emerald-500"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${checklistProgress.percentage}%, 0 ${checklistProgress.percentage}%)`,
                }}
              />
              <span>{checklistProgress.percentage}%</span>
            </div>
          </div>

          {/* Quick Add Checklist Form */}
          <form onSubmit={handleCreateChecklistItem} className="flex gap-2">
            <input
              type="text"
              value={newChecklistLabel}
              onChange={(e) => setNewChecklistLabel(e.target.value)}
              placeholder="Add item (e.g. wool socks, binoculars)..."
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            <select
              value={newChecklistCategory}
              onChange={(e) => setNewChecklistCategory(e.target.value as any)}
              className="px-2.5 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-700 dark:text-stone-300"
            >
              <option value="essentials">Essentials</option>
              <option value="gear">Gear</option>
              <option value="documents">Docs</option>
            </select>
            <button
              type="submit"
              className="px-3.5 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-lg hover:opacity-90"
            >
              Add
            </button>
          </form>

          {/* Checklist Items */}
          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklistItem(item.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  item.completed
                    ? 'bg-stone-100/50 dark:bg-stone-900/40 border-stone-200/50 dark:border-stone-800/60'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      item.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs ${
                      item.completed
                        ? 'line-through text-stone-400 dark:text-stone-500'
                        : 'font-medium text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono text-stone-400">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Itinerary Activity */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Plan Activity for Day 0{selectedDay}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddActivityModal(false)}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sunset Kayaking & Fjord Picnic"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  >
                    <option value="adventure">Adventure</option>
                    <option value="wellness">Wellness</option>
                    <option value="dining">Dining</option>
                    <option value="arrival">Arrival</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. West Shore Dock"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Gear, reminders, or directions..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-lg hover:opacity-90"
                >
                  Add to Day 0{selectedDay}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

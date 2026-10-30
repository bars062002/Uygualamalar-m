import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Sun,
  ShieldCheck,
  Award,
  Globe,
  Bell,
  Sliders,
  ChevronRight,
  Plus,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Retreat } from '../data/mockData';

interface ScreenProfileProps {
  savedRetreats: Retreat[];
  onSelectRetreat: (retreat: Retreat) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ScreenProfile: React.FC<ScreenProfileProps> = ({
  savedRetreats,
  onSelectRetreat,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [currency, setCurrency] = useState('USD');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [auroraAlerts, setAuroraAlerts] = useState(true);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [customCollections, setCustomCollections] = useState([
    { name: 'Aurora Glasshouses', count: 3 },
    { name: 'Summer Coastal Escapes', count: 2 },
  ]);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    setCustomCollections([
      ...customCollections,
      { name: newCollectionName.trim(), count: 0 },
    ]);
    setNewCollectionName('');
    setShowAddCollection(false);
  };

  return (
    <div className="w-full pb-20 sm:pb-8 space-y-6">
      {/* Profile Header Card */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-700 shrink-0">
            <img
              src="/src/assets/images/user_avatar_traveler_1793335984596.jpg"
              alt="Elena Rostova"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Elena Rostova
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xs text-stone-500">
              Architectural Patron Member · Joined 2024
            </div>
            <div className="text-[11px] font-mono text-stone-400">
              ID: HAVEN-MEMBER-9941
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 text-center">
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <div className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
              18
            </div>
            <div className="text-[10px] text-stone-500">Nights Stayed</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <div className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
              6
            </div>
            <div className="text-[10px] text-stone-500">Sanctuaries</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/50">
            <div className="text-base font-bold font-mono text-emerald-600">
              420 kg
            </div>
            <div className="text-[10px] text-stone-500">Carbon Offset</div>
          </div>
        </div>
      </div>

      {/* Saved Sanctuaries / Wishlist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Saved Sanctuaries ({savedRetreats.length})
            </h3>
            <p className="text-xs text-stone-500">Your curated architectural bucket list</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddCollection(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New List</span>
          </button>
        </div>

        {/* Collections Tags */}
        <div className="flex gap-2 overflow-x-auto py-1">
          {customCollections.map((col, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>{col.name}</span>
              <span className="text-[10px] text-stone-400 font-mono">({col.count})</span>
            </div>
          ))}
        </div>

        {savedRetreats.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-500">
            No saved sanctuaries yet. Tap the heart icon on any retreat to add it here.
          </div>
        ) : (
          <div className="space-y-2">
            {savedRetreats.map((retreat) => (
              <div
                key={retreat.id}
                onClick={() => onSelectRetreat(retreat)}
                className="group p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between hover:border-stone-300 dark:hover:border-stone-700 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <img
                      src={retreat.imageUrl}
                      alt={retreat.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                      {retreat.title}
                    </h4>
                    <p className="text-[11px] text-stone-500">{retreat.location}</p>
                    <div className="text-[11px] font-mono font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                      ${retreat.pricePerNight} / night
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account & App Settings */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Preferences & Controls
        </h3>

        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          {/* Theme Switcher */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  Interface Appearance
                </div>
                <div className="text-stone-500 text-[11px]">
                  {isDarkMode ? 'Dark architectural mode' : 'Daylight minimal mode'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>

          {/* Currency Selector */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                <Globe className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              </div>
              <div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  Billing Currency
                </div>
                <div className="text-stone-500 text-[11px]">Display rates in local currency</div>
              </div>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CHF">CHF (Fr)</option>
            </select>
          </div>

          {/* Keyless Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                <Bell className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              </div>
              <div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  Keyless NFC Gate Notifications
                </div>
                <div className="text-stone-500 text-[11px]">Proximity alerts when nearing sanctuary</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-stone-900 rounded"
            />
          </div>

          {/* Aurora Forecast alerts */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  Aurora Borealis & Stargazing Alerts
                </div>
                <div className="text-stone-500 text-[11px]">Kp-index alerts exceeding 3.5</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={auroraAlerts}
              onChange={(e) => setAuroraAlerts(e.target.checked)}
              className="w-4 h-4 accent-stone-900 rounded"
            />
          </div>
        </div>
      </div>

      {/* Modal: New Collection */}
      {showAddCollection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Create New Wishlist Collection
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCollection(false)}
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCollection} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 block mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. Swiss Chalet Wishlist"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCollection(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold rounded-lg hover:opacity-90"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

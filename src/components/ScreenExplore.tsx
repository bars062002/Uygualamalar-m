import React, { useState } from 'react';
import { Search, MapPin, Star, Heart, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { Retreat } from '../data/mockData';
import { formatCurrency } from '../utils/pricing';

interface ScreenExploreProps {
  retreats: Retreat[];
  onSelectRetreat: (retreat: Retreat) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const ScreenExplore: React.FC<ScreenExploreProps> = ({
  retreats,
  onSelectRetreat,
  savedIds,
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showPriceFilter, setShowPriceFilter] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Sanctuaries' },
    { id: 'nordic', label: 'Nordic Glass' },
    { id: 'coastal', label: 'Coastal Cliff' },
    { id: 'desert', label: 'Desert Pavilion' },
    { id: 'mountain', label: 'Alpine Chalet' },
  ];

  const filteredRetreats = retreats.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = item.pricePerNight <= maxPrice;
    return matchesCategory && matchesQuery && matchesPrice;
  });

  const featuredRetreat = retreats.find((r) => r.featured) || retreats[0];

  return (
    <div className="w-full pb-20 sm:pb-8">
      {/* Top Search & Filter Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              aria-label="Search sanctuaries by location or architecture"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, architecture or vibe..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-400 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Toggle price filter"
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center shrink-0 ${
              showPriceFilter
                ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable Price Slider */}
        {showPriceFilter && (
          <div className="p-4 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 rounded-xl">
            <div className="flex justify-between items-center text-xs text-stone-600 dark:text-stone-400 mb-2">
              <span>Max Nightly Rate</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 font-mono">
                {formatCurrency(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="1200"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
            />
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Showcase Card */}
      {selectedCategory === 'all' && !searchQuery && featuredRetreat && (
        <div className="mb-8">
          <div className="group relative rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800 bg-stone-900 text-white shadow-xs">
            <div className="relative aspect-16/10 sm:aspect-21/9 w-full overflow-hidden">
              <img
                src={featuredRetreat.imageUrl}
                alt={featuredRetreat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
              
              {/* Save Button */}
              <button
                type="button"
                aria-label={`Save ${featuredRetreat.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(featuredRetreat.id);
                }}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900/60 backdrop-blur-md text-white border border-white/20 hover:scale-110 active:scale-95 transition"
              >
                <Heart
                  className={`w-4 h-4 ${
                    savedIds.includes(featuredRetreat.id)
                      ? 'fill-rose-500 text-rose-500'
                      : 'text-white'
                  }`}
                />
              </button>

              {/* Verified Editorial Tag */}
              <div className="absolute top-4 left-4 text-[11px] font-medium tracking-wide uppercase text-stone-200 bg-stone-900/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                Architectural Spotlight
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{featuredRetreat.location}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredRetreat.architect}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {featuredRetreat.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
                {featuredRetreat.subtitle}
              </p>
              
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-bold font-mono text-white">
                    {formatCurrency(featuredRetreat.pricePerNight)}
                  </span>
                  <span className="text-xs text-stone-400">/ night</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectRetreat(featuredRetreat)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-stone-950 rounded-lg hover:bg-stone-100 active:scale-95 transition shadow-sm"
                >
                  <span>Explore Sanctuary</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stays Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Curated Architectural Escapes
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing {filteredRetreats.length} available sanctuaries
            </p>
          </div>
        </div>

        {filteredRetreats.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
              No matching sanctuaries found
            </p>
            <p className="text-xs text-stone-500 mb-4">
              Try adjusting your search criteria or price threshold.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setMaxPrice(1200);
              }}
              className="px-4 py-2 text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {filteredRetreats.map((retreat) => {
              const isSaved = savedIds.includes(retreat.id);
              return (
                <div
                  key={retreat.id}
                  onClick={() => onSelectRetreat(retreat)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 transition hover:shadow-md hover:border-stone-300 dark:hover:border-stone-700 flex flex-col"
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={retreat.imageUrl}
                      alt={retreat.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    
                    {/* Rating badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-900/70 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{retreat.rating}</span>
                      <span className="text-stone-400">({retreat.reviewsCount})</span>
                    </div>

                    {/* Bookmark button */}
                    <button
                      type="button"
                      aria-label={`Bookmark ${retreat.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(retreat.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 backdrop-blur-md text-white border border-white/15 hover:scale-110 active:scale-95 transition"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{retreat.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="shrink-0">{retreat.areaSqMeters} m²</span>
                      </div>
                      <h4 className="font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition">
                        {retreat.title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                        {retreat.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                          {formatCurrency(retreat.pricePerNight)}
                        </span>
                        <span className="text-[11px] text-stone-500">/ night</span>
                      </div>
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

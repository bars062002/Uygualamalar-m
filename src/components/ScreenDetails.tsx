import React, { useState } from 'react';
import {
  ChevronLeft,
  Star,
  MapPin,
  Heart,
  Share2,
  Users,
  Maximize2,
  Bed,
  Bath,
  CheckCircle2,
  Calendar,
  Flame,
  Sun,
  Sparkles,
  Wifi,
  UtensilsCrossed,
  Compass,
  Zap,
  Waves,
  Sunset,
  Volume2,
  Wine,
  Eye,
  Coffee,
  Heart as HeartIcon,
  Wind,
  Droplets,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { Retreat } from '../data/mockData';
import { calculateStayPrice, calculateNights, formatCurrency } from '../utils/pricing';

interface ScreenDetailsProps {
  retreat: Retreat;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onStartBooking: (bookingDetails: {
    retreat: Retreat;
    checkIn: string;
    checkOut: string;
    guests: number;
    priceBreakdown: ReturnType<typeof calculateStayPrice>;
  }) => void;
}

export const ScreenDetails: React.FC<ScreenDetailsProps> = ({
  retreat,
  onBack,
  isSaved,
  onToggleSave,
  onStartBooking,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('2026-11-12');
  const [checkOut, setCheckOut] = useState('2026-11-16');
  const [guests, setGuests] = useState(2);
  const [copiedShare, setCopiedShare] = useState(false);

  const nights = calculateNights(checkIn, checkOut);
  const priceBreakdown = calculateStayPrice(nights, retreat.pricePerNight, guests, 5);

  const images = retreat.galleryUrls?.length ? retreat.galleryUrls : [retreat.imageUrl];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'Wifi': return <Wifi className="w-4 h-4 text-sky-500" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4 text-emerald-600" />;
      case 'Compass': return <Compass className="w-4 h-4 text-blue-500" />;
      case 'Zap': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'Waves': return <Waves className="w-4 h-4 text-cyan-500" />;
      case 'Sunset': return <Sunset className="w-4 h-4 text-orange-500" />;
      case 'Bath': return <Bath className="w-4 h-4 text-stone-600 dark:text-stone-300" />;
      case 'Volume2': return <Volume2 className="w-4 h-4 text-indigo-500" />;
      case 'Wine': return <Wine className="w-4 h-4 text-rose-500" />;
      case 'Eye': return <Eye className="w-4 h-4 text-violet-500" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-amber-700" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'Wind': return <Wind className="w-4 h-4 text-teal-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="w-full pb-24 sm:pb-12 space-y-6">
      {/* Top Action Nav Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to explore"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Escapes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share retreat"
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition relative"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] bg-stone-900 text-white rounded whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onToggleSave(retreat.id)}
            aria-label={`Save ${retreat.title}`}
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <Heart
              className={`w-4 h-4 ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-600 dark:text-stone-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Gallery Display */}
      <div className="space-y-3">
        <div className="relative aspect-16/10 sm:aspect-16/9 rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-800">
          <img
            src={images[activeImageIndex] || retreat.imageUrl}
            alt={`${retreat.title} visual view`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition duration-300"
          />
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-stone-900/70 backdrop-blur-md text-white text-xs font-mono">
            {activeImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto py-1">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                  activeImageIndex === idx
                    ? 'border-stone-900 dark:border-white scale-102'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Title & Key Architectural Stats */}
      <div className="space-y-3 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1 font-medium text-stone-900 dark:text-stone-100">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            {retreat.location}
          </span>
          <span aria-hidden="true">·</span>
          <span>Designed by {retreat.architect}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            {retreat.rating} ({retreat.reviewsCount} reviews)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          {retreat.title}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {retreat.subtitle}
        </p>

        {/* Dimension Chips */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-center">
            <Maximize2 className="w-4 h-4 mx-auto text-stone-500 mb-1" />
            <div className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
              {retreat.areaSqMeters} m²
            </div>
            <div className="text-[10px] text-stone-500">Living Area</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-center">
            <Users className="w-4 h-4 mx-auto text-stone-500 mb-1" />
            <div className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
              {retreat.maxGuests} Guests
            </div>
            <div className="text-[10px] text-stone-500">Capacity</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-center">
            <Bed className="w-4 h-4 mx-auto text-stone-500 mb-1" />
            <div className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
              {retreat.bedrooms} Suites
            </div>
            <div className="text-[10px] text-stone-500">Bedrooms</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800 text-center">
            <Bath className="w-4 h-4 mx-auto text-stone-500 mb-1" />
            <div className="text-xs font-bold font-mono text-stone-900 dark:text-stone-100">
              {retreat.baths} Baths
            </div>
            <div className="text-[10px] text-stone-500">Bathrooms</div>
          </div>
        </div>
      </div>

      {/* Host Bio */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-stone-200">
            <img
              src={retreat.host.avatarUrl}
              alt={retreat.host.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Hosted by {retreat.host.name}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-stone-500">{retreat.host.role} · Responds {retreat.host.responseTime}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => alert(`Direct concierge message sent to ${retreat.host.name}.`)}
          className="px-3 py-1.5 text-xs font-medium border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          Contact Host
        </button>
      </div>

      {/* Narrative Architectural Description */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
          The Architectural Concept
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {retreat.description}
        </p>
      </div>

      {/* Amenities Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
          Sanctuary Amenities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {retreat.amenities.map((amenity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-xs text-stone-800 dark:text-stone-200"
            >
              <div className="p-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 shrink-0">
                {getAmenityIcon(amenity.icon)}
              </div>
              <div className="flex-1 font-medium">{amenity.name}</div>
              {amenity.highlight && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                  Featured
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Booking & Pricing Calculator Card */}
      <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 space-y-4">
        <div className="flex items-baseline justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <div className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100">
              {formatCurrency(retreat.pricePerNight)}
            </div>
            <div className="text-[11px] text-stone-500">Price per night</div>
          </div>
          <div className="text-right text-xs text-stone-500">
            <span className="font-semibold text-emerald-600">5% Member Reward</span> applied
          </div>
        </div>

        {/* Date Selector Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Check-in</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min="2026-11-01"
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Check-out</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono"
            />
          </div>
        </div>

        {/* Guests Stepper */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <div className="text-xs">
            <div className="font-semibold text-stone-900 dark:text-stone-100">Guests</div>
            <div className="text-[10px] text-stone-500">Max {retreat.maxGuests} guests</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease guests"
              disabled={guests <= 1}
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 disabled:opacity-40"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
              {guests}
            </span>
            <button
              type="button"
              aria-label="Increase guests"
              disabled={guests >= retreat.maxGuests}
              onClick={() => setGuests((g) => Math.min(retreat.maxGuests, g + 1))}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-300 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-800">
          <div className="flex justify-between">
            <span>{formatCurrency(retreat.pricePerNight)} × {nights} nights</span>
            <span className="font-mono">{formatCurrency(priceBreakdown.basePrice)}</span>
          </div>
          {priceBreakdown.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Member architectural discount (5%)</span>
              <span className="font-mono">-{formatCurrency(priceBreakdown.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Specialty cleaning & linen</span>
            <span className="font-mono">{formatCurrency(priceBreakdown.cleaningFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Curator service & concierge (12%)</span>
            <span className="font-mono">{formatCurrency(priceBreakdown.serviceFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Local occupancy taxes (8%)</span>
            <span className="font-mono">{formatCurrency(priceBreakdown.taxes)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-800 font-bold text-sm text-stone-900 dark:text-stone-100">
            <span>Total stay investment</span>
            <span className="font-mono">{formatCurrency(priceBreakdown.total)}</span>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() =>
            onStartBooking({
              retreat,
              checkIn,
              checkOut,
              guests,
              priceBreakdown,
            })
          }
          className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wide uppercase transition active:scale-[0.99] shadow-md dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950"
        >
          Reserve Sanctuary ({formatCurrency(priceBreakdown.total)})
        </button>
      </div>
    </div>
  );
};

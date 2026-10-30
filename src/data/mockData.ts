export interface Retreat {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  country: string;
  category: 'nordic' | 'coastal' | 'mountain' | 'desert';
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  architect: string;
  areaSqMeters: number;
  maxGuests: number;
  bedrooms: number;
  baths: number;
  imageUrl: string;
  galleryUrls: string[];
  description: string;
  amenities: {
    name: string;
    icon: string;
    highlight?: boolean;
  }[];
  host: {
    name: string;
    role: string;
    avatarUrl: string;
    verified: boolean;
    responseTime: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  accessCode: string;
}

export const INITIAL_RETREATS: Retreat[] = [
  {
    id: 'nordic-glass-haven',
    title: 'The Glass Pavilion at Fjord Pine',
    subtitle: 'Cantilevered timber & triple-glazed glass retreat with panoramic forest views',
    location: 'Tromsø, Norway',
    country: 'Norway',
    category: 'nordic',
    pricePerNight: 460,
    rating: 4.98,
    reviewsCount: 84,
    featured: true,
    architect: 'Lund & Sønner Arkitekter',
    areaSqMeters: 145,
    maxGuests: 4,
    bedrooms: 2,
    baths: 2,
    imageUrl: '/src/assets/images/hero_nordic_cabin_1793335982854.jpg',
    galleryUrls: [
      '/src/assets/images/hero_nordic_cabin_1793335982854.jpg',
      '/src/assets/images/retreat_mountain_loft_1793335984466.jpg',
      '/src/assets/images/retreat_coastal_villa_1793335984131.jpg',
    ],
    description:
      'Perched quietly amongst old-growth Scandinavian pine, this retreat is an exercise in transparent minimalism. Built with low-impact black steel framing and triple-glazed heated acoustic glass, it offers front-row seats to dancing aurora borealis in winter and midnight sun in summer.',
    amenities: [
      { name: 'Wood-fired Cedar Sauna', icon: 'Flame', highlight: true },
      { name: 'Radiant Pine Floors', icon: 'Sun' },
      { name: 'Panoramic Stargazing Deck', icon: 'Sparkles', highlight: true },
      { name: 'High-speed Starlink Satellite', icon: 'Wifi' },
      { name: 'Open Hearth Fireplace', icon: 'Flame' },
      { name: 'Induction Chef Kitchen', icon: 'UtensilsCrossed' },
      { name: 'Private Fjord Access Trail', icon: 'Compass' },
      { name: 'EV Fast Charger (Level 2)', icon: 'Zap' },
    ],
    host: {
      name: 'Freja Lindqvist',
      role: 'Architectural Conservator',
      avatarUrl: '/src/assets/images/user_avatar_traveler_1793335984596.jpg',
      verified: true,
      responseTime: 'Under 1 hour',
    },
    coordinates: {
      lat: 69.6492,
      lng: 18.9553,
    },
    accessCode: 'HAVEN-7892',
  },
  {
    id: 'coastal-monolith-villa',
    title: 'Cliffside Monolith Sanctuary',
    subtitle: 'Brutalist concrete architecture cantilevered over the azure Mediterranean',
    location: 'Ibiza, Balearic Islands',
    country: 'Spain',
    category: 'coastal',
    pricePerNight: 890,
    rating: 4.96,
    reviewsCount: 62,
    featured: false,
    architect: 'Estudio Miralles & Soler',
    areaSqMeters: 280,
    maxGuests: 6,
    bedrooms: 3,
    baths: 3,
    imageUrl: '/src/assets/images/retreat_coastal_villa_1793335984131.jpg',
    galleryUrls: [
      '/src/assets/images/retreat_coastal_villa_1793335984131.jpg',
      '/src/assets/images/hero_nordic_cabin_1793335982854.jpg',
    ],
    description:
      'Engineered directly into a limestone cliff face, the Monolith uses board-formed architectural concrete and expansive saltwater infinity swimming. Sunset vistas across the archipelago are framed by floor-to-ceiling motorized glazing that slides into hidden pockets.',
    amenities: [
      { name: 'Cantilevered Saltwater Pool', icon: 'Waves', highlight: true },
      { name: 'Private Sunset Terrace', icon: 'Sunset', highlight: true },
      { name: 'Outdoor Travertine Shower', icon: 'Bath' },
      { name: 'Bespoke Sound System', icon: 'Volume2' },
      { name: 'Sub-Zero Wine Cellar', icon: 'Wine' },
      { name: 'Daily Eco-Cleaning Included', icon: 'Sparkles' },
    ],
    host: {
      name: 'Carlos Soler',
      role: 'Founding Architect',
      avatarUrl: '/src/assets/images/user_avatar_traveler_1793335984596.jpg',
      verified: true,
      responseTime: 'Under 30 mins',
    },
    coordinates: {
      lat: 38.9067,
      lng: 1.4206,
    },
    accessCode: 'HAVEN-4102',
  },
  {
    id: 'desert-rammed-earth-pavilion',
    title: 'High Desert Rammed Earth Residence',
    subtitle: 'Thermal mass rammed earth home immersed in ancient boulders and starry skies',
    location: 'Joshua Tree, California',
    country: 'United States',
    category: 'desert',
    pricePerNight: 520,
    rating: 4.94,
    reviewsCount: 96,
    featured: false,
    architect: 'Kappe Earth Design Studio',
    areaSqMeters: 195,
    maxGuests: 4,
    bedrooms: 2,
    baths: 2,
    imageUrl: '/src/assets/images/retreat_desert_pavilion_1793335984336.jpg',
    galleryUrls: [
      '/src/assets/images/retreat_desert_pavilion_1793335984336.jpg',
      '/src/assets/images/hero_nordic_cabin_1793335982854.jpg',
    ],
    description:
      'Crafted from excavated local desert soil and sand, the layered strata walls insulate naturally against day heat and night chill. Features a courtyard firepit with sunken seating, brass telescope observatory, and minimal light pollution certified for astronomical viewing.',
    amenities: [
      { name: 'Deep Soaking Outdoor Tub', icon: 'Bath', highlight: true },
      { name: 'Celestron 8-inch Telescope', icon: 'Eye', highlight: true },
      { name: 'Corten Steel Sunken Firepit', icon: 'Flame' },
      { name: 'Solar Microgrid & Tesla Powerwall', icon: 'Sun' },
      { name: 'Organic Herbal Tea & Espresso Bar', icon: 'Coffee' },
      { name: 'Yoga & Meditation Pavilion', icon: 'Heart' },
    ],
    host: {
      name: 'Sierra Vance',
      role: 'Astrophotographer & Host',
      avatarUrl: '/src/assets/images/user_avatar_traveler_1793335984596.jpg',
      verified: true,
      responseTime: 'Within 2 hours',
    },
    coordinates: {
      lat: 34.1347,
      lng: -116.3131,
    },
    accessCode: 'HAVEN-6520',
  },
  {
    id: 'alpine-timber-glass-loft',
    title: 'Bergblick Alpine Observatory',
    subtitle: 'Dark charred timber and soaring curtain wall on high Swiss mountain ridge',
    location: 'Zermatt, Valais',
    country: 'Switzerland',
    category: 'mountain',
    pricePerNight: 780,
    rating: 4.99,
    reviewsCount: 110,
    featured: false,
    architect: 'Atelier Peter Zumstein',
    areaSqMeters: 210,
    maxGuests: 5,
    bedrooms: 3,
    baths: 2,
    imageUrl: '/src/assets/images/retreat_mountain_loft_1793335984466.jpg',
    galleryUrls: [
      '/src/assets/images/retreat_mountain_loft_1793335984466.jpg',
      '/src/assets/images/retreat_coastal_villa_1793335984131.jpg',
    ],
    description:
      'Overlooking the snow-capped Matterhorn crest, Bergblick pairs traditional charred yakisugi larch cladding with triple-pane Swiss engineering. Direct ski-in ski-out trail access, heated boot drying room, and Swedish plunge pool.',
    amenities: [
      { name: 'Direct Ski-in / Ski-out Access', icon: 'Compass', highlight: true },
      { name: 'Glacier Water Hot Tub', icon: 'Waves', highlight: true },
      { name: 'Suspended Gyrofocus Fireplace', icon: 'Flame' },
      { name: 'Heated Ski Gear Locker', icon: 'Wind' },
      { name: 'Wine Tasting Nook', icon: 'Wine' },
      { name: 'Steam Shower with Alpine Herbs', icon: 'Droplets' },
    ],
    host: {
      name: 'Marc Oberhauser',
      role: 'Alpinist & Guide',
      avatarUrl: '/src/assets/images/user_avatar_traveler_1793335984596.jpg',
      verified: true,
      responseTime: 'Under 1 hour',
    },
    coordinates: {
      lat: 45.9763,
      lng: 7.7491,
    },
    accessCode: 'HAVEN-9912',
  },
];

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  title: string;
  category: 'arrival' | 'adventure' | 'wellness' | 'dining' | 'departure';
  location: string;
  notes: string;
  completed: boolean;
}

export const INITIAL_ITINERARY: ItineraryItem[] = [
  {
    id: 'it-1',
    day: 1,
    time: '15:00',
    title: 'Arrival & Contactless NFC Check-in',
    category: 'arrival',
    location: 'Main Pavilion Entry Gate',
    notes: 'Keyless NFC phone tap on digital latch. Welcome basket with cloudberry jam and rye crispbread in kitchen.',
    completed: true,
  },
  {
    id: 'it-2',
    day: 1,
    time: '18:30',
    title: 'Wood-fired Cedar Sauna & Fjord Plunge',
    category: 'wellness',
    location: 'Waterfront Sauna Deck',
    notes: 'Sauna pre-heated to 85°C. Birch twigs and eucalyptus oil provided.',
    completed: true,
  },
  {
    id: 'it-3',
    day: 2,
    time: '09:00',
    title: 'Guided Coastal Trail & Ridge Hike',
    category: 'adventure',
    location: 'Trailhead directly behind cabin',
    notes: 'Moderate 6.4km loop overlooking the Lyngen Alps. Waterproof hiking boots recommended.',
    completed: false,
  },
  {
    id: 'it-4',
    day: 2,
    time: '19:45',
    title: 'Stargazing & Aurora Photography Session',
    category: 'wellness',
    location: 'Upper Observatory Platform',
    notes: 'Clear skies forecast with Kp-index 4.2. High chance of northern lights activity.',
    completed: false,
  },
  {
    id: 'it-5',
    day: 3,
    time: '11:00',
    title: 'Private Nordic Chef Tasting Experience',
    category: 'dining',
    location: 'Dining Room Hearth',
    notes: 'Local wild salmon, foraged mushrooms, and Arctic herbal tea tasting.',
    completed: false,
  },
];

export const INITIAL_CHECKLIST = [
  { id: 'c1', label: 'Digital NFC pass saved to Apple Wallet / device', category: 'documents' as const, completed: true },
  { id: 'c2', label: 'Passport & travel insurance details verified', category: 'documents' as const, completed: true },
  { id: 'c3', label: 'Thermal wool base layers & windproof shell jacket', category: 'gear' as const, completed: true },
  { id: 'c4', label: 'Sturdy waterproof trail hiking boots', category: 'gear' as const, completed: false },
  { id: 'c5', label: 'Camera with tripod for long-exposure aurora shots', category: 'gear' as const, completed: true },
  { id: 'c6', label: 'Personal refillable thermos flask & electrolyte tablets', category: 'essentials' as const, completed: false },
  { id: 'c7', label: 'Pre-ordered local artisan sourdough & breakfast box', category: 'essentials' as const, completed: false },
];

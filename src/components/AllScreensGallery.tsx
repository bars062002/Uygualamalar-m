import React from 'react';
import { Eye, Smartphone, ArrowRight } from 'lucide-react';
import { Retreat, ItineraryItem, ChecklistItem } from '../data/mockData';
import { ScreenExplore } from './ScreenExplore';
import { ScreenDetails } from './ScreenDetails';
import { ScreenItinerary } from './ScreenItinerary';
import { ScreenDigitalPass } from './ScreenDigitalPass';
import { ScreenProfile } from './ScreenProfile';

interface AllScreensGalleryProps {
  retreats: Retreat[];
  activeRetreat: Retreat;
  onSelectRetreat: (retreat: Retreat) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  itinerary: ItineraryItem[];
  checklist: ChecklistItem[];
  onToggleItineraryItem: (id: string) => void;
  onAddItineraryItem: (item: any) => void;
  onToggleChecklistItem: (id: string) => void;
  onAddChecklistItem: (label: string, category: any) => void;
  onStartBooking: (bookingDetails: any) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onFocusScreen: (screenId: 'explore' | 'details' | 'itinerary' | 'digitalPass' | 'profile') => void;
}

export const AllScreensGallery: React.FC<AllScreensGalleryProps> = (props) => {
  const screens = [
    {
      id: 'explore' as const,
      num: '01',
      title: 'Explore & Curated Escapes',
      subtitle: 'Discovery feed with category filters, price thresholds and hero retreat card',
      component: (
        <ScreenExplore
          retreats={props.retreats}
          onSelectRetreat={(r) => {
            props.onSelectRetreat(r);
            props.onFocusScreen('details');
          }}
          savedIds={props.savedIds}
          onToggleSave={props.onToggleSave}
        />
      ),
    },
    {
      id: 'details' as const,
      num: '02',
      title: 'Sanctuary Architectural Details',
      subtitle: 'Gallery thumbnails, specs, amenities grid, date/guest pricing breakdown',
      component: (
        <ScreenDetails
          retreat={props.activeRetreat}
          onBack={() => props.onFocusScreen('explore')}
          isSaved={props.savedIds.includes(props.activeRetreat.id)}
          onToggleSave={props.onToggleSave}
          onStartBooking={props.onStartBooking}
        />
      ),
    },
    {
      id: 'itinerary' as const,
      num: '03',
      title: 'Itinerary & Packing Rhythm',
      subtitle: 'Day-by-day expedition timeline with activity creator & packing progress',
      component: (
        <ScreenItinerary
          itinerary={props.itinerary}
          checklist={props.checklist}
          onToggleItineraryItem={props.onToggleItineraryItem}
          onAddItineraryItem={props.onAddItineraryItem}
          onToggleChecklistItem={props.onToggleChecklistItem}
          onAddChecklistItem={props.onAddChecklistItem}
        />
      ),
    },
    {
      id: 'digitalPass' as const,
      num: '04',
      title: 'Digital Key & NFC Latch Pass',
      subtitle: 'Interactive contactless door key simulator, QR code & offline backup PIN',
      component: <ScreenDigitalPass retreat={props.activeRetreat} />,
    },
    {
      id: 'profile' as const,
      num: '05',
      title: 'Traveler Profile & Wishlists',
      subtitle: 'Architectural patron profile, lifetime stays stats, and collections',
      component: (
        <ScreenProfile
          savedRetreats={props.retreats.filter((r) => props.savedIds.includes(r.id))}
          onSelectRetreat={(r) => {
            props.onSelectRetreat(r);
            props.onFocusScreen('details');
          }}
          isDarkMode={props.isDarkMode}
          onToggleDarkMode={props.onToggleDarkMode}
        />
      ),
    },
  ];

  return (
    <div className="w-full py-6 space-y-6">
      {/* Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Smartphone className="w-4 h-4" />
            <span>MOCKUP ARTBOARD CANVAS (5 LIVE SCREENS)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            All Application Screens Side-by-Side
          </h2>
          <p className="text-xs text-stone-400">
            Click "Interactive Focus" on any screen to test it full-scale in the device simulator or desktop view.
          </p>
        </div>
      </div>

      {/* Side-by-side Horizontal Artboard Scroll */}
      <div className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar">
        {screens.map((screen) => (
          <div
            key={screen.id}
            className="w-[360px] sm:w-[380px] shrink-0 flex flex-col space-y-3"
          >
            {/* Screen Info Card */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                  Screen {screen.num}
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate max-w-[200px]">
                  {screen.title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => props.onFocusScreen(screen.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 active:scale-95 transition"
              >
                <span>Focus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Mockup Shell */}
            <div className="w-full h-[680px] bg-stone-950 rounded-[40px] p-2.5 shadow-xl border-4 border-stone-800 flex flex-col overflow-hidden">
              {/* Dynamic Island */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto my-1.5" />

              {/* Viewport Screen */}
              <div className="flex-1 bg-stone-50 dark:bg-stone-950 rounded-[30px] overflow-y-auto no-scrollbar p-3">
                {screen.component}
              </div>

              {/* Bottom bar */}
              <div className="h-3 flex items-center justify-center">
                <div className="w-24 h-1 bg-stone-600 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

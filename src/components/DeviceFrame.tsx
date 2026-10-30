import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, isMobileFrame }) => {
  if (!isMobileFrame) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-6 px-2">
      {/* iPhone 16 Pro Titanium Mockup Shell */}
      <div className="relative w-full max-w-[400px] h-[840px] bg-stone-950 rounded-[50px] p-3 shadow-2xl border-[6px] border-stone-800 ring-1 ring-stone-900/50 flex flex-col overflow-hidden">
        {/* Dynamic Island Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
        </div>

        {/* Status Bar */}
        <div className="h-8 px-6 pt-1 flex items-center justify-between text-stone-900 dark:text-stone-100 text-[12px] font-semibold tracking-tight z-30 select-none">
          <span>9:41</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Viewport Container */}
        <div className="relative flex-1 bg-stone-50 dark:bg-stone-950 rounded-[40px] overflow-y-auto no-scrollbar pt-3 px-3">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 flex items-center justify-center pt-1 z-30">
          <div className="w-32 h-1 bg-stone-400 dark:bg-stone-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};

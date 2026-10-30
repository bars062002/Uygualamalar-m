import React, { useState } from 'react';
import {
  KeyRound,
  Lock,
  Unlock,
  Radio,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  AlertCircle,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Retreat } from '../data/mockData';

interface ScreenDigitalPassProps {
  retreat: Retreat;
}

export const ScreenDigitalPass: React.FC<ScreenDigitalPassProps> = ({ retreat }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSimulateUnlock = () => {
    if (isUnlocking || isUnlocked) return;
    setIsUnlocking(true);

    setTimeout(() => {
      setIsUnlocking(false);
      setIsUnlocked(true);

      // Auto relock after 6 seconds for realism
      setTimeout(() => {
        setIsUnlocked(false);
      }, 6000);
    }, 1400);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(retreat.accessCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full pb-20 sm:pb-8 space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          Digital Key & NFC Boarding Pass
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Encrypted offline access for reservation #HV-2026-88
        </p>
      </div>

      {/* NFC Interactive Door Key Simulator */}
      <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-900 text-white relative overflow-hidden shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-stone-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>NFC Ultra-Wideband Sensor</span>
          </div>

          {/* Interactive Key Disc */}
          <div className="relative my-2">
            {/* Pulsing wave when unlocking */}
            {isUnlocking && (
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400/60 animate-ping" />
            )}

            <button
              type="button"
              aria-label="Unlock retreat door latch"
              onClick={handleSimulateUnlock}
              disabled={isUnlocking}
              className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-xl active:scale-95 cursor-pointer ${
                isUnlocked
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400 scale-105'
                  : isUnlocking
                  ? 'border-amber-400 bg-amber-950/60 text-amber-300 animate-pulse'
                  : 'border-stone-700 bg-stone-800/90 text-stone-200 hover:border-stone-500'
              }`}
            >
              {isUnlocked ? (
                <>
                  <Unlock className="w-8 h-8 mb-1 stroke-[2.5]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Unlocked</span>
                </>
              ) : isUnlocking ? (
                <>
                  <Radio className="w-8 h-8 mb-1 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Syncing...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-8 h-8 mb-1 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tap to Open</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-semibold text-stone-100">
              {isUnlocked
                ? 'Door Latch Disengaged — Welcome'
                : isUnlocking
                ? 'Authenticating cryptokey with lock...'
                : 'Hold near lock or tap above'}
            </div>
            <p className="text-xs text-stone-400">
              {isUnlocked
                ? 'Latch will automatically re-engage in 6 seconds.'
                : 'Compatible with Apple Wallet NFC & Android Fast Pair.'}
            </p>
          </div>
        </div>
      </div>

      {/* Boarding Pass Card */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
        {/* Pass Header */}
        <div className="p-4 sm:p-5 bg-stone-100/70 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
              Sanctuary Access Pass
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {retreat.title}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CONFIRMED</span>
            </div>
            <div className="text-[10px] text-stone-500 font-mono">HV-2026-88</div>
          </div>
        </div>

        {/* Pass Details Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="text-[10px] uppercase text-stone-400 mb-0.5">Check-In</div>
              <div className="font-semibold text-stone-900 dark:text-stone-100">
                Thu, Nov 12, 2026
              </div>
              <div className="text-stone-500 font-mono text-[11px]">From 15:00 CET</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-stone-400 mb-0.5">Check-Out</div>
              <div className="font-semibold text-stone-900 dark:text-stone-100">
                Mon, Nov 16, 2026
              </div>
              <div className="text-stone-500 font-mono text-[11px]">Until 11:00 CET</div>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-[10px] uppercase text-stone-400">Offline Keypad Backup PIN</div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100 tracking-wider">
                  {retreat.accessCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  aria-label="Copy access code"
                  className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-500">
                Keypad is located on the right cedar door jamb.
              </p>
            </div>

            {/* Simulated QR Code for Concierge Check-in */}
            <div className="w-16 h-16 p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-stone-900" />
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{retreat.location}</span>
            </div>
            <div className="text-[11px] font-mono text-stone-500 pl-5">
              Coordinates: {retreat.coordinates.lat.toFixed(4)}° N, {retreat.coordinates.lng.toFixed(4)}° E
            </div>
          </div>
        </div>

        {/* Pass Footer Help */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
            <span>24/7 Gate Concierge Available</span>
          </span>
          <button
            type="button"
            onClick={() => alert('Dialing Haven 24/7 Emergency Host Concierge...')}
            className="text-stone-900 dark:text-stone-100 font-semibold hover:underline flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Call Concierge</span>
          </button>
        </div>
      </div>
    </div>
  );
};

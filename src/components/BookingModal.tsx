import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Calendar, Users, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { Retreat } from '../data/mockData';
import { formatCurrency, PriceBreakdown } from '../utils/pricing';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    retreat: Retreat;
    checkIn: string;
    checkOut: string;
    guests: number;
    priceBreakdown: PriceBreakdown;
  } | null;
  onBookingConfirmed: (reservationId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onBookingConfirmed,
}) => {
  const [guestName, setGuestName] = useState('Elena Rostova');
  const [guestEmail, setGuestEmail] = useState('elena.rostova@designvault.com');
  const [specialNotes, setSpecialNotes] = useState('Late evening arrival via scenic ferry from Tromsø.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  if (!isOpen || !bookingData) return null;

  const { retreat, checkIn, checkOut, guests, priceBreakdown } = bookingData;

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const code = `HV-${Math.floor(1000 + Math.random() * 9000)}`;
      setReservationCode(code);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleCompleteFlow = () => {
    setIsSuccess(false);
    onClose();
    onBookingConfirmed(reservationCode || 'HV-8921');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {isSuccess ? 'Reservation Secured' : 'Confirm Sanctuary Reservation'}
            </h3>
          </div>
          {!isSuccess && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Welcome to {retreat.title}
                </h4>
                <p className="text-xs text-stone-500">
                  Your reservation is confirmed. Confirmation code:{' '}
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    {reservationCode}
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-left space-y-2">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Guest:</span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">{guestName}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Dates:</span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">
                    {checkIn} &rarr; {checkOut} ({priceBreakdown.nights} nights)
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Total Paid:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(priceBreakdown.total)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCompleteFlow}
                  className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold flex items-center justify-center gap-2 hover:opacity-90 shadow-md transition"
                >
                  <span>Open Digital NFC Key & Boarding Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirmReservation} className="space-y-4">
              {/* Retreat Summary Card */}
              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex gap-3.5 items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                  <img
                    src={retreat.imageUrl}
                    alt={retreat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                    {retreat.title}
                  </h4>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2">
                    <span>{retreat.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{guests} guests</span>
                  </div>
                  <div className="text-[11px] font-mono font-bold text-stone-900 dark:text-stone-100">
                    {checkIn} to {checkOut} ({priceBreakdown.nights} nights)
                  </div>
                </div>
              </div>

              {/* Guest Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Lead Traveler Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Contact Email (for NFC digital pass)
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Arrival Notes or Special Dietary Requests
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Price Overview */}
              <div className="p-3.5 rounded-xl bg-stone-100/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1.5">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Subtotal ({priceBreakdown.nights} nights)</span>
                  <span className="font-mono">{formatCurrency(priceBreakdown.basePrice)}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Linen & cleaning fee</span>
                  <span className="font-mono">{formatCurrency(priceBreakdown.cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Curator fee & occupancy taxes</span>
                  <span className="font-mono">
                    {formatCurrency(priceBreakdown.serviceFee + priceBreakdown.taxes)}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold text-sm text-stone-900 dark:text-stone-100">
                  <span>Total Due Today</span>
                  <span className="font-mono">{formatCurrency(priceBreakdown.total)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wide uppercase transition active:scale-[0.99] shadow-md dark:bg-stone-100 dark:hover:bg-white dark:text-stone-950 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Securing Reservation & Issuing Cryptokey...</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Confirm & Authorize {formatCurrency(priceBreakdown.total)}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

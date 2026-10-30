/**
 * Pricing calculation utilities for Haven retreats.
 */

export interface PriceBreakdown {
  nights: number;
  nightlyRate: number;
  basePrice: number;
  discount: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
}

export function calculateStayPrice(
  nights: number,
  nightlyRate: number,
  guests: number = 1,
  discountPercent: number = 0
): PriceBreakdown {
  const safeNights = Math.max(1, nights);
  const safeRate = Math.max(0, nightlyRate);
  const basePrice = safeNights * safeRate;
  const discount = Math.round((basePrice * Math.min(100, Math.max(0, discountPercent))) / 100);
  const discountedSubtotal = basePrice - discount;
  
  // Standard boutique fees
  const cleaningFee = safeRate > 0 ? 120 : 0;
  const serviceFee = Math.round(discountedSubtotal * 0.12);
  const taxes = Math.round(discountedSubtotal * 0.08);
  const total = discountedSubtotal + cleaningFee + serviceFee + taxes;

  return {
    nights: safeNights,
    nightlyRate: safeRate,
    basePrice,
    discount,
    cleaningFee,
    serviceFee,
    taxes,
    total,
  };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

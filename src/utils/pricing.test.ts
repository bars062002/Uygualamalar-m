import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStayPrice, calculateNights, formatCurrency } from './pricing';

test('calculateNights computes duration between dates correctly', () => {
  const nights = calculateNights('2026-11-01', '2026-11-05');
  assert.equal(nights, 4);
});

test('calculateNights returns at least 1 night for invalid or same-day dates', () => {
  assert.equal(calculateNights('2026-11-01', '2026-11-01'), 1);
  assert.equal(calculateNights('', ''), 1);
});

test('calculateStayPrice correctly calculates base, fees, taxes and total', () => {
  const result = calculateStayPrice(3, 400, 2, 10);
  // base = 3 * 400 = 1200
  // discount = 10% of 1200 = 120
  // discountedSubtotal = 1080
  // cleaningFee = 120
  // serviceFee = 12% of 1080 = 130
  // taxes = 8% of 1080 = 86
  // total = 1080 + 120 + 130 + 86 = 1416
  assert.equal(result.basePrice, 1200);
  assert.equal(result.discount, 120);
  assert.equal(result.cleaningFee, 120);
  assert.equal(result.serviceFee, 130);
  assert.equal(result.taxes, 86);
  assert.equal(result.total, 1416);
});

test('formatCurrency returns clean dollar string', () => {
  const formatted = formatCurrency(1450);
  assert.ok(formatted.includes('1,450'));
});

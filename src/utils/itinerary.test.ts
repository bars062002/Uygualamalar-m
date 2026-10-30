import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateChecklistProgress, filterStays, StayItem } from './itinerary';

test('calculateChecklistProgress calculates percentage correctly', () => {
  const items = [
    { id: '1', completed: true },
    { id: '2', completed: false },
    { id: '3', completed: true },
    { id: '4', completed: true },
  ];
  const progress = calculateChecklistProgress(items);
  assert.equal(progress.total, 4);
  assert.equal(progress.completed, 3);
  assert.equal(progress.percentage, 75);
});

test('calculateChecklistProgress handles empty lists safely', () => {
  const progress = calculateChecklistProgress([]);
  assert.equal(progress.total, 0);
  assert.equal(progress.completed, 0);
  assert.equal(progress.percentage, 0);
});

test('filterStays filters by query, category, and maxPrice', () => {
  const stays: StayItem[] = [
    { id: '1', title: 'Nordic Glass Cabin', location: 'Tromsø, Norway', category: 'nordic', pricePerNight: 420, rating: 4.95 },
    { id: '2', title: 'Cliffside Villa', location: 'Ibiza, Spain', category: 'coastal', pricePerNight: 850, rating: 4.98 },
    { id: '3', title: 'Desert Pavilion', location: 'Joshua Tree, USA', category: 'desert', pricePerNight: 390, rating: 4.88 },
  ];

  const filteredByCategory = filterStays(stays, '', 'coastal');
  assert.equal(filteredByCategory.length, 1);
  assert.equal(filteredByCategory[0].id, '2');

  const filteredByQuery = filterStays(stays, 'norway', 'all');
  assert.equal(filteredByQuery.length, 1);
  assert.equal(filteredByQuery[0].id, '1');

  const filteredByPrice = filterStays(stays, '', 'all', 400);
  assert.equal(filteredByPrice.length, 1);
  assert.equal(filteredByPrice[0].id, '3');
});

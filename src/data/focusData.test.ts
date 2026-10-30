import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_TASKS, INITIAL_CALENDAR_EVENTS, INITIAL_DEVICES, TaskItem } from '../data/focusData';

test('tasks data contains required initial fields and sample tasks', () => {
  assert.ok(INITIAL_TASKS.length >= 4);
  const q3Task = INITIAL_TASKS.find((t) => t.id === 'task-1');
  assert.ok(q3Task);
  assert.equal(q3Task.title, 'Q3 Finansal Rapor Sunumu Hazırlığı');
  assert.equal(q3Task.category, 'is');
  assert.equal(q3Task.priority, 'high');
  assert.ok(q3Task.subtasks && q3Task.subtasks.length === 5);
});

test('task completion counting calculates accurate percentages', () => {
  const sampleTasks: TaskItem[] = [
    { id: '1', title: 'A', category: 'is', priority: 'high', time: '10:00', date: '2023-10-24', completed: true, reminder: false },
    { id: '2', title: 'B', category: 'kisisel', priority: 'medium', time: '11:00', date: '2023-10-24', completed: true, reminder: false },
    { id: '3', title: 'C', category: 'is', priority: 'low', time: '12:00', date: '2023-10-24', completed: false, reminder: false },
    { id: '4', title: 'D', category: 'kisisel', priority: 'high', time: '13:00', date: '2023-10-24', completed: false, reminder: false },
  ];

  const completed = sampleTasks.filter((t) => t.completed).length;
  const percent = Math.round((completed / sampleTasks.length) * 100);
  assert.equal(completed, 2);
  assert.equal(percent, 50);
});

test('calendar events contain expected slots and categories', () => {
  assert.ok(INITIAL_CALENDAR_EVENTS.length >= 4);
  const slots = INITIAL_CALENDAR_EVENTS.map((e) => e.timeSlot);
  assert.ok(slots.includes('09:00'));
  assert.ok(slots.includes('10:00'));
  assert.ok(slots.includes('14:00'));
  assert.ok(slots.includes('17:00'));
});

test('connected devices initialize current device correctly', () => {
  const current = INITIAL_DEVICES.find((d) => d.isCurrent);
  assert.ok(current);
  assert.equal(current.name, 'iPhone 15 Pro');
});

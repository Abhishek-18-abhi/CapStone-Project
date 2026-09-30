import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasMeetingConflict,
  meetingTimesOverlap,
  parseTimeRange,
} from '../meetingValidation.js';

test('parses valid time ranges', () => {
  assert.deepEqual(parseTimeRange('09:30-10:30'), { start: 570, end: 630 });
});

test('rejects invalid and backwards time ranges', () => {
  assert.equal(parseTimeRange('25:00-26:00'), null);
  assert.equal(parseTimeRange('10:00-09:00'), null);
  assert.equal(parseTimeRange('bad'), null);
});

test('detects overlapping meetings', () => {
  assert.equal(meetingTimesOverlap('09:00-10:00', '09:30-10:30'), true);
  assert.equal(meetingTimesOverlap('09:00-10:00', '10:00-11:00'), false);
});

test('ignores cancelled meetings and meetings for other users', () => {
  const meetings = [
    { date: '2026-10-01', time: '09:00-10:00', mentorId: 'm1', studentId: 's1', status: 'cancelled' },
    { date: '2026-10-01', time: '09:00-10:00', mentorId: 'm2', studentId: 's2', status: 'scheduled' },
  ];
  assert.equal(hasMeetingConflict(meetings, '2026-10-01', '09:30-09:45', 'm1'), false);
  assert.equal(hasMeetingConflict(meetings, '2026-10-01', '09:30-09:45', 'm2'), true);
});

test('detects a conflict for either participant', () => {
  const meetings = [
    { date: '2026-10-01', time: '14:00-15:00', mentorId: 'm1', studentId: 's1', status: 'scheduled' },
  ];
  assert.equal(hasMeetingConflict(meetings, '2026-10-01', '14:30-15:30', 's1'), true);
  assert.equal(hasMeetingConflict(meetings, '2026-10-01', '14:30-15:30', 'm1'), true);
});

/**
 * Parse a simple HH:MM-HH:MM slot.
 * Returns minutes from midnight or null for invalid input.
 */
export function parseTimeRange(value) {
  const match = String(value || '').trim().match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const [, sh, sm, eh, em] = match.map(Number);
  if (sh > 23 || eh > 23 || sm > 59 || em > 59) return null;
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  if (end <= start) return null;
  return { start, end };
}

export function meetingTimesOverlap(first, second) {
  const a = parseTimeRange(first);
  const b = parseTimeRange(second);
  if (!a || !b) return false;
  return a.start < b.end && b.start < a.end;
}

export function hasMeetingConflict(existingMeetings, date, time, userId) {
  return existingMeetings.some(
    (meeting) =>
      meeting.date === date &&
      [String(meeting.mentorId), String(meeting.studentId)].includes(String(userId)) &&
      meeting.status !== 'cancelled' &&
      meetingTimesOverlap(meeting.time, time)
  );
}

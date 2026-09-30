import { normalizeList } from './storage';

/**
 * Baseline matcher used only for capstone evaluation.
 * It intentionally represents a simpler approach: skills overlap only.
 */
export const BASELINE_ALGORITHM_VERSION = 'baseline-v1-skills-only';

export function scoreBaselineMatch(student, mentor) {
  const studentSkills = new Set(normalizeList(student?.skills));
  const mentorSkills = new Set(normalizeList(mentor?.skills));
  const matchedSkills = [...mentorSkills].filter((skill) => studentSkills.has(skill));

  const score = Math.round(
    (matchedSkills.length / Math.max(studentSkills.size, 1)) * 100
  );

  return {
    score: Math.min(100, score),
    algorithmVersion: BASELINE_ALGORITHM_VERSION,
    matchedSkills,
    hasCapacity:
      Number(mentor?.currentMentees) < Number(mentor?.capacity) ||
      Number(mentor?.capacity) <= 0,
    availabilityMatches: normalizeList(student?.availability).filter((slot) =>
      normalizeList(mentor?.availability).includes(slot)
    ),
  };
}

export function rankBaselineMentors(student, mentors) {
  return [...mentors]
    .map((mentor) => ({
      mentor,
      result: scoreBaselineMatch(student, mentor),
    }))
    .sort(
      (a, b) =>
        b.result.score - a.result.score ||
        Number(b.result.hasCapacity) - Number(a.result.hasCapacity) ||
        a.mentor.id.localeCompare(b.mentor.id)
    );
}

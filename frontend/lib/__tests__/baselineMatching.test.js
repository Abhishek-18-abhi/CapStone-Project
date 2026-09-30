import { describe, it, expect } from 'vitest';
import {
  BASELINE_ALGORITHM_VERSION,
  rankBaselineMentors,
  scoreBaselineMatch,
} from '../baselineMatching';

describe('baseline skills-only matcher', () => {
  it('uses skills overlap as the baseline score', () => {
    const result = scoreBaselineMatch(
      { skills: ['React', 'Node.js'] },
      { skills: ['React', 'Node.js', 'Python'] }
    );

    expect(result.score).toBe(100);
    expect(result.matchedSkills).toEqual(['react', 'node.js']);
    expect(result.algorithmVersion).toBe(BASELINE_ALGORITHM_VERSION);
  });

  it('does not award score for non-skill profile factors', () => {
    const result = scoreBaselineMatch(
      {
        skills: ['React'],
        interests: ['Web Development'],
        goals: ['Career guidance'],
      },
      {
        skills: ['React'],
        interests: ['Cooking'],
        goals: ['Photography'],
      }
    );

    expect(result.score).toBe(100);
  });

  it('exposes capacity and availability as evaluation metadata without using them in the score', () => {
    const result = scoreBaselineMatch(
      {
        skills: ['React'],
        availability: ['Monday 09:00-12:00'],
      },
      {
        skills: ['React'],
        availability: ['Monday 09:00-12:00'],
        capacity: 2,
        currentMentees: 2,
      }
    );

    expect(result.score).toBe(100);
    expect(result.hasCapacity).toBe(false);
    expect(result.availabilityMatches).toEqual(['monday 09:00-12:00']);
  });

  it('ranks mentors deterministically by skills score', () => {
    const ranked = rankBaselineMentors(
      { skills: ['React', 'Node.js'] },
      [
        { id: 'm2', skills: ['React'] },
        { id: 'm1', skills: ['React', 'Node.js'] },
      ]
    );

    expect(ranked.map((item) => item.mentor.id)).toEqual(['m1', 'm2']);
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { scoreMatch } from '../frontend/lib/matching.js';
import { rankBaselineMentors } from '../frontend/lib/baselineMatching.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetPath = path.join(__dirname, 'synthetic_profiles.json');
const resultsDir = path.join(__dirname, 'results');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const availabilitySet = (values = []) =>
  new Set(values.map((value) => String(value).toLowerCase().trim()));

const isFeasible = (student, mentor) => {
  const hasCapacity =
    Number(mentor.currentMentees) < Number(mentor.capacity);
  const studentSlots = availabilitySet(student.availability);
  const mentorSlots = availabilitySet(mentor.availability);
  const hasAvailability = [...studentSlots].some((slot) =>
    mentorSlots.has(slot)
  );
  return { hasCapacity, hasAvailability };
};

const rows = dataset.students.map((student) => {
  const baseline = rankBaselineMentors(student, dataset.mentors);
  const proposed = [...dataset.mentors]
    .map((mentor) => ({ mentor, result: scoreMatch(student, mentor) }))
    .sort(
      (a, b) =>
        b.result.score - a.result.score ||
        Number(b.result.capacity) - Number(a.result.capacity) ||
        a.mentor.id.localeCompare(b.mentor.id)
    );

  const baselineTop = baseline[0];
  const proposedTop = proposed[0];
  const baselineFeasibility = isFeasible(student, baselineTop.mentor);
  const proposedFeasibility = isFeasible(student, proposedTop.mentor);

  return {
    studentId: student.id,
    baselineTopMentorId: baselineTop.mentor.id,
    baselineScore: baselineTop.result.score,
    baselineHasCapacity: baselineFeasibility.hasCapacity,
    baselineHasAvailability: baselineFeasibility.hasAvailability,
    proposedTopMentorId: proposedTop.mentor.id,
    proposedScore: proposedTop.result.score,
    proposedHasCapacity: proposedFeasibility.hasCapacity,
    proposedHasAvailability: proposedFeasibility.hasAvailability,
    recommendationChanged:
      baselineTop.mentor.id !== proposedTop.mentor.id,
  };
});

const average = (values) =>
  values.length
    ? Number(
        (
          values.reduce((sum, value) => sum + value, 0) / values.length
        ).toFixed(2)
      )
    : 0;

const metrics = {
  datasetVersion: dataset.datasetVersion,
  studentCount: dataset.students.length,
  mentorCount: dataset.mentors.length,
  baseline: {
    averageTopScore: average(rows.map((row) => row.baselineScore)),
    topRecommendationsAtCapacity: rows.filter(
      (row) => !row.baselineHasCapacity
    ).length,
    topRecommendationsWithoutAvailability: rows.filter(
      (row) => !row.baselineHasAvailability
    ).length,
  },
  proposed: {
    averageTopScore: average(rows.map((row) => row.proposedScore)),
    topRecommendationsAtCapacity: rows.filter(
      (row) => !row.proposedHasCapacity
    ).length,
    topRecommendationsWithoutAvailability: rows.filter(
      (row) => !row.proposedHasAvailability
    ).length,
  },
  recommendationChanges: rows.filter((row) => row.recommendationChanged).length,
};

const acceptanceCriteria = {
  capacityAwareRecommendations:
    'Proposed approach should reduce or explain full-capacity top recommendations compared with the skills-only baseline.',
  availabilityAwareRecommendations:
    'Proposed approach should reduce top recommendations with no shared availability where the dataset provides a feasible alternative.',
  reproducibility:
    'Running npm run evaluate:baseline on the same dataset version should reproduce the same deterministic results.',
  noRealPersonalData:
    'Dataset must remain synthetic and contain no real student, alumni, contact, credential, or production account data.',
};

const output = {
  generatedAt: new Date().toISOString(),
  methodology: {
    baseline: 'Skills-only overlap, 0-100 score.',
    proposed:
      'Existing explainable weighted matcher: skills 45%, interests 20%, goals 15%, languages 10%, availability 5%, capacity 5%.',
    ranking: 'Highest score first; deterministic mentor-id tie-break.',
  },
  acceptanceCriteria,
  metrics,
  rows,
};

fs.mkdirSync(resultsDir, { recursive: true });
fs.writeFileSync(
  path.join(resultsDir, 'baseline-comparison.json'),
  JSON.stringify(output, null, 2) + '\\n'
);

const markdown = [
  '# Baseline Comparison Results',
  '',
  'Generated at: ' + output.generatedAt,
  '',
  '## Methodology',
  '',
  '- Baseline: ' + output.methodology.baseline,
  '- Proposed: ' + output.methodology.proposed,
  '- Ranking: ' + output.methodology.ranking,
  '',
  '## Results',
  '',
  '| Metric | Baseline | Proposed |',
  '|---|---:|---:|',
  '| Average top recommendation score | ' +
    metrics.baseline.averageTopScore +
    ' | ' +
    metrics.proposed.averageTopScore +
    ' |',
  '| Top recommendations at mentor capacity | ' +
    metrics.baseline.topRecommendationsAtCapacity +
    ' | ' +
    metrics.proposed.topRecommendationsAtCapacity +
    ' |',
  '| Top recommendations without shared availability | ' +
    metrics.baseline.topRecommendationsWithoutAvailability +
    ' | ' +
    metrics.proposed.topRecommendationsWithoutAvailability +
    ' |',
  '| Recommendation changes | - | ' + metrics.recommendationChanges + ' |',
  '',
  '## Per-student results',
  '',
  '| Student | Baseline | Proposed | Baseline score | Proposed score |',
  '|---|---|---|---:|---:|',
  ...rows.map(
    (row) =>
      '| ' +
      row.studentId +
      ' | ' +
      row.baselineTopMentorId +
      ' | ' +
      row.proposedTopMentorId +
      ' | ' +
      row.baselineScore +
      ' | ' +
      row.proposedScore +
      ' |'
  ),
  '',
  'These results are benchmark measurements on the controlled synthetic dataset. They are not claims about real-world user satisfaction.',
].join('\\n');

fs.writeFileSync(
  path.join(resultsDir, 'baseline-comparison.md'),
  markdown + '\\n'
);

console.log(JSON.stringify({ metrics, outputDir: resultsDir }, null, 2));

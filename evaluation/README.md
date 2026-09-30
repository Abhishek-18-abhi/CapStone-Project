# Matching Evaluation Package

This directory contains the first capstone evaluation experiment for MentorConnect: a comparison between a simple skills-only baseline and the existing explainable weighted matcher.

## Why this exists

The capstone requires a meaningful baseline comparison, measurable evaluation, realistic or safely simulated data, reproducible setup, and failure/robustness evidence.

The project matcher currently uses these weights:

| Factor | Weight |
|---|---:|
| Skills | 45% |
| Interests | 20% |
| Goals | 15% |
| Languages | 10% |
| Availability | 5% |
| Capacity | 5% |

The baseline intentionally uses skills overlap only. It is not presented as a production algorithm.

## Dataset

synthetic_profiles.json contains controlled synthetic student and mentor profiles.

- No real student or alumni records.
- Dataset version is recorded in the file.
- Preferences are intentionally controlled so availability and capacity can influence the proposed method.
- The dataset is safe to regenerate or extend without exposing personal information.

## Run

From the repository root:

npm install
npm run evaluate:baseline

The command creates:

evaluation/results/baseline-comparison.json
evaluation/results/baseline-comparison.md

## Metrics

The experiment measures:

1. Average score of the top recommendation.
2. Number of top recommendations where the mentor is already at capacity.
3. Number of top recommendations without shared availability.
4. Number of students whose top recommendation changes between baseline and proposed methods.

These are engineering benchmark metrics. They are not user satisfaction measurements.

## Acceptance thresholds

The following are project evaluation targets, not externally validated claims:

- The proposed method should reduce or clearly explain full-capacity top recommendations.
- The proposed method should reduce top recommendations with no shared availability when a feasible alternative exists.
- Results should be deterministic for a fixed dataset version.
- No real personal data should be present in the evaluation dataset.

## Limitations

The experiment does not establish real-world user satisfaction or fairness. A later evaluation stage should add usability testing, feedback ratings, subgroup/edge-case analysis, latency measurements, and security/privacy testing.

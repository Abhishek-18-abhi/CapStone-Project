# Synthetic Evaluation Data Dictionary

| Field | Type | Meaning |
|---|---|---|
| id | string | Synthetic identifier for a student or mentor |
| name | string | Synthetic mentor display name |
| skills | string[] | Skills used by the matching engine |
| interests | string[] | Areas of professional interest |
| goals | string[] | Mentoring/career goals |
| languages | string[] | Preferred communication languages |
| availability | string[] | Controlled calendar slot strings |
| capacity | number | Maximum concurrent mentees for a mentor |
| currentMentees | number | Current accepted mentee count |
| datasetVersion | string | Version of the synthetic dataset |
| provenance | string | Origin and synthetic-data statement |
| permissions | string | Intended evaluation use |

## Reproducibility

The evaluation uses a checked-in JSON dataset and deterministic ranking/tie-breaking. Run npm run evaluate:baseline from the repository root to regenerate the result files.

The generated results contain benchmark observations from synthetic data only and must not be interpreted as real-world satisfaction or production performance.

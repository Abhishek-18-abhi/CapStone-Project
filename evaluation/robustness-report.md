# Robustness Test Report

## Experiment design

The evaluation covers deterministic scheduling validation plus a backend authorization test matrix.

### Edge cases

1. Invalid time strings.
2. End time earlier than start time.
3. Exact boundary meetings such as 09:00-10:00 and 10:00-11:00.
4. Overlapping meetings for a mentor.
5. Overlapping meetings for a student.
6. Cancelled meetings.
7. Missing authentication.
8. Invalid authentication.
9. Incorrect role.
10. Cross-user profile modification.
11. Cross-user meeting creation.
12. Full mentor capacity.

### Reproducible command

Run npm run test:robustness from the repository root.

The command runs deterministic meeting validation tests. Backend HTTP integration cases should be executed against a dedicated test MongoDB before production use.

## Acceptance interpretation

A passing scheduling suite demonstrates that the defined time and conflict edge cases are handled. The authorization cases are documented against the current route guards.

This report does not claim that the system is fully secure. Remaining work includes rate limiting, centralized request validation, production HTTPS configuration, and concurrency-safe end-to-end capacity tests.

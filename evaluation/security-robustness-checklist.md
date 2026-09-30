# Security and Robustness Experiment

This experiment targets the capstone requirement for a failure-mode, security, or robustness test.

| ID | Case | Expected behavior | Evidence |
|---|---|---|---|
| AUTH-01 | Missing Bearer token | 401 | backend/middleware/auth.js |
| AUTH-02 | Invalid/expired JWT | 401 | backend/middleware/auth.js |
| AUTH-03 | Wrong role | 403 | requireRole() and route guards |
| AUTH-04 | Student attempts mentor response | 403 | backend/routes/mentorship.js |
| AUTH-05 | Mentor accepts at capacity | 400 | backend/routes/mentorship.js |
| AUTH-06 | User updates another user's profile | 403 | backend/routes/users.js |
| AUTH-07 | Student schedules for another student | 403 | backend/routes/meetings.js |
| AUTH-08 | Invalid meeting participants | 404 | backend/routes/meetings.js |
| MEET-01 | Invalid time range | 400 | backend/routes/meetings.js |
| MEET-02 | Overlapping meeting | 409 | backend/routes/meetings.js |
| MEET-03 | Cancelled meeting overlap | Allowed | backend/utils/meetingValidation.js |
| MEET-04 | Back-to-back meetings | Allowed | backend/utils/meetingValidation.js |
| DATA-01 | Plain password in public response | Must be absent | backend/utils/publicUser.js |
| DATA-02 | Password hash in public response | Must be absent | backend/utils/publicUser.js |
| DATA-03 | Invalid mentorship request ID | 400/404 | backend/routes/mentorship.js |

## Limitations

The HTTP cases are documented against the current route guards and should be run against a dedicated test MongoDB before production deployment. Rate limiting, centralized schema validation, HTTPS configuration, and concurrency testing remain follow-up work.

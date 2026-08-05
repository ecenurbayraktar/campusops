# Security Test Matrix

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Register with valid data | User created successfully | ✅ Passed |
| Register with duplicate email | Validation error returned | ✅ Passed |
| Login with valid credentials | Access and refresh tokens generated | ✅ Passed |
| Login with invalid password | 401 Unauthorized | ✅ Passed |
| Login with inactive account | 401 Unauthorized | ✅ Passed |
| Refresh with valid refresh token | New token pair generated | ✅ Passed |
| Refresh with old rotated refresh token | 401 Unauthorized | ✅ Passed |
| Logout with valid refresh token | Refresh token removed | ✅ Passed |
| Access protected endpoint without JWT | 401 Unauthorized | ✅ Passed |
| Access admin endpoint as STUDENT | 403 Forbidden | ✅ Passed |
| Access admin endpoint as ADMIN | 200 OK | ✅ Passed |
| Fake JWT | 401 Unauthorized | ✅ Passed |
| Expired JWT | 401 Unauthorized | ✅ Passed |
| Rate limit exceeded | 429 Too Many Requests | ✅ Passed |
| Forgot password (existing account) | Reset email sent | ✅ Passed |
| Forgot password (non-existing account) | Generic success response returned | ✅ Passed |
| Reset password with valid token | Password updated | ✅ Passed |
| Reuse reset token | Invalid token error | ⚪ Not manually verified |
| Login with new password | Authentication successful | ✅ Passed |
| Audit log created after successful login | LOGIN_SUCCESS stored | ✅ Passed |
| Audit log created after failed login | LOGIN_FAILED stored | ✅ Passed |
| Audit log created after password reset request | PASSWORD_RESET_REQUESTED stored | ✅ Passed |
| Audit log created after password reset completion | PASSWORD_RESET_COMPLETED stored | ⚪ Not manually verified |
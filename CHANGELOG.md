# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of secure password manager
- Master password protection with SQLCipher encryption
- Password generation with cryptographically secure RNG
- Cross-platform support (macOS, Windows, Linux)
- NIST SP 800-63B compliant authentication
- OWASP Top 10 2021 compliant security controls

### Security
- AES-256 encryption for database
- PBKDF2 with 600,000 iterations
- Rate limiting (5 attempts per 15 minutes)
- Input validation on all API endpoints
- Timing-safe password comparison
- Enhanced security headers
- Context isolation and sandboxing

---

## [1.0.0] - YYYY-MM-DD

### Added
- Master password setup with complexity requirements
- Password vault with CRUD operations
- Password strength indicator
- Cryptographically secure password generator
- Search and filter passwords
- Copy to clipboard functionality
- Auto-lock after inactivity

### Security
- SQLCipher database encryption (AES-256)
- PBKDF2-HMAC-SHA512 key derivation (600k iterations)
- Unique salt per database instance
- Rate limiting on authentication
- Comprehensive input validation
- Security audit compliance (NIST, OWASP)

---

## Release Types

### Major Version (X.0.0)
- Breaking changes
- Major new features
- Architecture changes

### Minor Version (0.X.0)
- New features
- Backward compatible changes
- Performance improvements

### Patch Version (0.0.X)
- Bug fixes
- Security patches
- Minor improvements

---

## Categories

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes and security improvements

---

[Unreleased]: https://github.com/yourusername/password-manager/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/password-manager/releases/tag/v1.0.0


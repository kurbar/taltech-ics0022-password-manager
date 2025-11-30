## ⚠️ Disclaimer

This was a school project and is intended for educational purposes only. While security best practices have been followed, this software has not undergone formal security audits. Use at your own risk.

This password manager is provided "as is" without warranty. Always maintain backups of critical passwords. The authors are not responsible for data loss or security breaches resulting from the use of this software.

**Remember:** Your master password cannot be recovered if lost. Choose a strong, memorable password and store it securely.

---

# 🔐 Secure Password Manager

A cross-platform password manager built with Electron, Vue 3, TypeScript, and SQLCipher.

[![Build Status](https://github.com/kurbar/password-manager/workflows/Build%20and%20Release/badge.svg)](https://github.com/kurbar/password-manager/actions)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## ✨ Features

### 🔒 Security First
- **AES-256 Encryption** via SQLCipher
- **PBKDF2** with 600,000 iterations (OWASP 2023 compliant)
- **Rate Limiting** - 5 attempts per 15 minutes
- **Cryptographically Secure RNG** for password generation
- **Timing-Safe Comparisons** to prevent timing attacks

### 💪 Password Management
- Master password protection
- Secure password vault with CRUD operations
- Strong password generator (8-32 characters)
- Password strength indicator
- Search and filter passwords
- Copy to clipboard
- Auto-lock on close

### 🖥️ Cross-Platform
- **macOS** (Apple Silicon & Intel)
- **Windows** (x64)
- **Linux** (Debian, Ubuntu, Fedora, RHEL)

### 🎨 Modern UI
- Beautiful Vue 3 interface
- Tailwind CSS styling
- Responsive design
- Dark mode ready

---

## 📥 Installation

### Download Pre-Built Releases

Download the latest release for your platform from the [Releases page](https://github.com/kurbar/password-manager/releases):

- **macOS:** `.dmg` installer
- **Windows:** `.exe` setup (Squirrel auto-updater)
- **Linux:** `.deb` (Debian/Ubuntu) or `.rpm` (Fedora/RHEL)

### Build from Source

```bash
# Clone the repository
git clone https://github.com/kurbar/password-manager.git
cd password-manager

# Install dependencies
npm install

# Run in development
npm start

# Build for production
npm run make
```

---

## 🚀 Quick Start

### First Time Setup

1. Launch the application
2. Create a strong master password
   - Minimum 12 characters
   - Must include uppercase, lowercase, number, and special character
3. Your encrypted vault is created automatically
4. Start adding passwords!

### Daily Use

1. Launch the app
2. Enter your master password to unlock
3. View, add, edit, or delete passwords
4. Use the password generator for new accounts
5. Close the app to auto-lock

---

## 🛡️ Security Features

### Encryption & Hashing
- **Database Encryption:** AES-256 (SQLCipher)
- **Key Derivation:** PBKDF2-HMAC-SHA256 (600k iterations)
- **Password Hashing:** PBKDF2-HMAC-SHA512 (600k iterations)
- **Salt Generation:** 32-byte cryptographically secure random salt

### Authentication
- **Rate Limiting:** 5 failed attempts → 15-minute lockout
- **Timing-Safe Comparison:** Prevents timing attacks
- **Session Management:** Auto-lock on application close

### Application Security
- **Context Isolation:** Enabled (Electron security)
- **Node Integration:** Disabled
- **Content Security Policy:** Strict CSP headers
- **ASAR Integrity Validation:** Enabled
- **Code Signing:** Ready (requires certificates)

---

## 🔧 Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Setup Development Environment

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Run linter
npm run lint

# Build for current platform
npm run package

# Build installers for all platforms
npm run make
```

### Project Structure

```
password-manager/
├── src/
│   ├── app/              # Vue frontend
│   │   ├── components/   # Reusable components
│   │   ├── views/        # Page views
│   │   ├── stores/       # Pinia state management
│   │   └── router.ts     # Vue Router config
│   ├── main/             # Electron main process
│   │   ├── database/     # Database controllers
│   │   ├── manager/      # Password management
│   │   └── password-generator/  # Secure password generator
│   ├── preload/          # Electron preload scripts
│   ├── database/         # TypeORM configuration
│   └── shared/           # Shared types & constants
├── .github/
│   └── workflows/        # CI/CD pipelines
```

---

## 📖 Documentation

- [RELEASE.md](RELEASE.md) - How to create releases
- [CHANGELOG.md](CHANGELOG.md) - Version history

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Security Issues

⚠️ **Do not open public issues for security vulnerabilities.**

Please email security concerns to: [kaviib@taltech.ee](mailto:kaviib@taltech.ee)

---

## 📜 License

This project is licensed under the MIT License

---

## 🙏 Credits

Built with:
- [Electron](https://www.electronjs.org/) - Cross-platform framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript
- [SQLCipher](https://www.zetetic.net/sqlcipher/) - Encrypted SQLite
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Electron Forge](https://www.electronforge.io/) - Build tooling

Security guidelines from:
- [NIST](https://www.nist.gov/) - National Institute of Standards and Technology
- [OWASP](https://owasp.org/) - Open Web Application Security Project

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/kurbar/password-manager/issues)
- **Discussions:** [GitHub Discussions](https://github.com/kurbar/password-manager/discussions)


# Node.js Upgrade Guide

## 🚀 Upgrading to Node.js 20.19.0+

This project now requires Node.js 20.19.0 or higher for optimal performance and compatibility.

### Why Upgrade?

- **Vite 7.1.7** requires Node.js 20.19+ or 22.12+
- **Better performance** and security
- **Latest features** and bug fixes
- **Improved build times**

### Installation Methods

#### 1. Using nvm (Recommended)

```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install Node.js 20.19.0
nvm install 20.19.0

# Use Node.js 20.19.0
nvm use 20.19.0

# Set as default
nvm alias default 20.19.0
```

#### 2. Using Node.js Installer

1. Visit [nodejs.org](https://nodejs.org/)
2. Download Node.js 20.19.0 LTS
3. Run the installer
4. Restart your terminal

#### 3. Using Package Managers

**macOS (Homebrew):**
```bash
brew install node@20
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows (Chocolatey):**
```bash
choco install nodejs --version=20.19.0
```

### Verification

After installation, verify the version:

```bash
node --version  # Should show v20.19.0 or higher
npm --version    # Should show 10.0.0 or higher
```

### Project Setup

Once Node.js is upgraded:

```bash
# Navigate to project directory
cd LockSmith

# Use the correct Node.js version (if using nvm)
nvm use

# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Test the build
npm run build
```

### Troubleshooting

#### Issue: "crypto.hash is not a function"
**Solution**: Update to Node.js 20.19.0+

#### Issue: Build fails with Vite
**Solution**: Ensure Node.js version is 20.19.0+

#### Issue: Permission errors
**Solution**: 
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Benefits of Node.js 20.19.0+

- ✅ **Vite 7.1.7** compatibility
- ✅ **Better performance** (up to 20% faster builds)
- ✅ **Enhanced security** features
- ✅ **Improved ES modules** support
- ✅ **Better memory management**
- ✅ **Latest npm** features

### Migration Checklist

- [ ] Install Node.js 20.19.0+
- [ ] Verify version with `node --version`
- [ ] Clean project: `rm -rf node_modules package-lock.json`
- [ ] Reinstall: `npm install`
- [ ] Test build: `npm run build`
- [ ] Test dev server: `npm run dev`

### Need Help?

If you encounter issues:

1. Check Node.js version: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Check project requirements in `package.json`

The project is now optimized for modern Node.js and will provide better performance and reliability! 🚀

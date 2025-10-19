# LockSmith Landing Page

Professional locksmith services landing page built with modern web technologies.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20.19.0 or higher
- **npm**: 10.0.0 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd LockSmith

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run optimize-images` - Optimize images

## 🛠️ Technology Stack

- **Vite** 7.1.7 - Build tool
- **Sass** - CSS preprocessor
- **Handlebars** - Template engine
- **Swiper** - Touch slider
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
src/
├── js/                    # JavaScript files
│   ├── components/        # Reusable components
│   ├── utils/            # Utility functions
│   └── main.js           # Main entry point
├── styles/               # SCSS styles
│   ├── base/             # Base styles
│   ├── layout/           # Layout styles
│   └── vendors/          # Third-party styles
├── templates/            # Handlebars templates
├── images/               # Image assets
└── index.html            # Main HTML file
```

## 🔧 Development

### Node.js Version

This project requires Node.js 20.19.0 or higher. Use `.nvmrc` file to set the correct version:

```bash
# Using nvm
nvm use

# Or install specific version
nvm install 20.19.0
nvm use 20.19.0
```

### Environment Setup

1. Install Node.js 20.19.0+
2. Install dependencies: `npm install`
3. Start development: `npm run dev`

## 🚀 Deployment

### GitHub Actions

The project includes GitHub Actions workflow for automated builds:

- **Trigger**: Push to `main` branch
- **Node.js**: 20.19.0
- **Build**: `npm run build`
- **Output**: `dist/` directory

### Manual Deployment

```bash
# Build the project
npm run build

# The built files will be in the `dist/` directory
# Deploy the contents of `dist/` to your web server
```

## 🐛 Troubleshooting

### Build Issues

If you encounter build issues:

1. **Check Node.js version**: Must be 20.19.0+
2. **Clear cache**: `npm cache clean --force`
3. **Reinstall dependencies**: `rm -rf node_modules && npm install`

### Common Issues

- **`crypto.hash is not a function`**: Update Node.js to 20.19.0+
- **Build fails**: Check Node.js version and dependencies
- **Images not loading**: Verify image paths in `public/` directory

## 📄 License

MIT License - see LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.
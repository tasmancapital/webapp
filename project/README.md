# Tasman Capital Website

A modern, responsive website for Tasman Capital, built with React, TypeScript, and Tailwind CSS.

## Major Updates

### 🎨 Complete Redesign
- Reimagined and rebuilt nearly every component for a more modern, professional look
- New glass-morphism design system throughout the application
- Enhanced animations and transitions
- Improved mobile responsiveness and interactions

### 👥 Team Section Updates
- Added comprehensive team member profiles
- New expandable biography cards
- Professional headshots and detailed experience sections
- Improved layout and responsiveness

### 📧 Contact Page Enhancements
- Redesigned contact form with improved validation
- Added interactive globe visualization
- Enhanced office location display
- Improved form feedback and error handling

### 🏆 Awards & Recognition
- New logo showcase with animated carousel
- Added industry awards section
- Updated achievements and recognition
- Dynamic award card animations

### 📝 Content Updates
- Refreshed all text content for better clarity and professionalism
- Updated company descriptions and values
- Enhanced investment portfolio descriptions
- Improved case studies and success stories


## Live Demo

https://tasman-capital.netlify.app/


## Features

### 🎨 Design & UI
- Responsive design optimized for all devices
- Modern, clean interface with dark/light theme support
- Advanced animations using Framer Motion
- Interactive 3D globe using Cobe
- Custom animated carousel components
- Glass-morphism design elements
- Dynamic page transitions
- Animated wave backgrounds
- Mobile-optimized navigation with animated menu
- Custom theme customizer
- Floating card effects
- Interactive hover states

### 📱 Components
- Interactive performance graphs with Recharts
- Animated timeline component
- Cookie consent management
- Responsive navigation with mobile menu
- Portfolio showcase with case studies
- Team member cards with social links
- Contact form with validation
- Animated world map with DottedMap
- Wave animation effects

### 🛠 Technical Features
- React 18 with TypeScript
- Vite for fast development and building
- React Router for client-side routing
- Tailwind CSS for styling
- ESLint for code quality
- SEO optimized with meta tags
- Responsive image optimization
- Custom hooks for form handling
- Theme context for dark/light mode
- Framer Motion for animations

### 📧 Integrations
- Office 365 SMTP email integration
- Netlify deployment and hosting
- Netlify Functions for serverless backend
- YouTube video embedding
- Environment variables management

### 🔒 Security
- Form validation and sanitization
- Protected API endpoints
- Secure email handling
- Environment variables for sensitive data
- HTTP security headers

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── data/            # Static data and types
└── netlify/
    └── functions/   # Serverless functions
```

## Environment Variables

Required environment variables:
```
VITE_EMAIL_USER=your-office365-email@domain.com
VITE_EMAIL_PASS=your-office365-password
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch. The deployment process includes:

1. Building the React application
2. Processing and optimizing assets
3. Deploying serverless functions
4. Applying security headers
5. Setting up redirects for SPA routing

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- Asset minification
- Caching strategies
- Preloading critical assets
- Responsive image loading
- Efficient animations with GPU acceleration
- Optimized font loading

## Recent Updates

- Added wave animation to mobile menu
- Completely redesigned component architecture
- Updated team member profiles and images
- Enhanced logo showcase and awards section
- Refreshed all content and copywriting
- Optimized font sizes and navigation spacing
- Improved mobile responsiveness
- Added theme customizer
- Enhanced performance metrics
- Deployed to Netlify
- Added serverless email functionality
- Implemented cookie consent
- Added interactive portfolio showcase
- Enhanced accessibility features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

All rights reserved. This source code is proprietary and confidential.
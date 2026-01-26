# Gitrekt Frontend

Modern React + Vite + TailwindCSS frontend for the GitHub Roaster application.

## Features

- 🎨 Beautiful dark-mode UI with neon accents
- ⚡ Lightning-fast Vite dev server
- 🎭 Smooth Framer Motion animations
- 🌙 TailwindCSS for rapid styling
- 📱 Responsive design
- ♿ Accessible components
- 🚀 Production-optimized build

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts dev server on `http://localhost:5173` with automatic proxy to backend at `http://localhost:3000/api`.

### Production Build

```bash
npm run build
```

Outputs optimized files to `dist/` folder.

### Preview Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── SearchForm.tsx         - Username input form
│   ├── RoastReveal.tsx        - Animated roast results
│   ├── RoastCard.tsx          - Individual roast display
│   ├── MetricsGrid.tsx        - Metrics visualization
│   ├── FinalVerdict.tsx       - Verdict modal
│   └── ErrorDisplay.tsx       - Error toast notifications
├── services/
│   ├── api.ts                 - HTTP client & API calls
│   └── types.ts               - TypeScript types
├── store/
│   └── roast.ts               - Zustand state management
├── styles/
│   └── globals.css            - Global styles & animations
├── App.tsx                    - Main component
└── main.tsx                   - Vite entry point
```

## Key Components

### SearchForm
Controlled input component with:
- Username validation
- Loading state
- Error handling
- Smooth animations

### RoastReveal
Main results view with:
- Score display with animation
- Metrics grid
- Incremental roast reveal
- Final verdict modal

### RoastCard
Individual roast display with:
- Severity-based styling (warning/roast/critical)
- Collapsible evidence details
- Staggered animation timing

### MetricsGrid
Statistics dashboard showing:
- Repository count
- Commits
- Stars
- Code quality score
- Engagement score
- Primary languages

## API Integration

API calls through `services/api.ts`:

```typescript
// Analyze a user
const response = await analyzeUser('username');

// Check backend health
const health = await checkHealth();
```

Handles:
- Request/response transformation
- Error messages
- Timeout management
- Rate limiting feedback

## State Management

Zustand store (`store/roast.ts`) manages:
- Current analysis data
- UI state (loading, error)
- Roast reveal progress
- Verdict display toggle

```typescript
const { analysis, revealed, showVerdict } = useRoastStore();
useRoastStore.setState({ revealed: revealed + 1 });
```

## Styling

### TailwindCSS + Custom Colors

Dark mode colors:
- `dark-900`: Primary dark
- `dark-800`: Cards/containers
- `dark-700`: Subtle text

Neon accent colors:
- `neon-purple`: Primary action
- `neon-cyan`: Secondary accent
- `neon-green`: Success/positive
- `neon-red`: Warning/error

### Animations

Framer Motion controls:
- **Initial/Enter**: Fade-in, slide-in
- **Reveal**: Staggered children
- **Glitch**: Critical roast text effect
- **Typewriter**: Text reveal effect

## Responsive Design

Mobile-first approach:
- Single column on mobile
- 2-column grid on tablet
- 3-column grid on desktop
- Touch-friendly button sizes

## Performance

Vite optimizations:
- Code splitting by route
- CSS minification
- Tree-shaking
- Source maps

Build output:
- React vendor: ~43KB (gzip)
- Framer Motion: ~37KB (gzip)
- App bundle: ~20KB (gzip)
- CSS: ~4KB (gzip)
- **Total: ~104KB**

## Development

### Debugging

```bash
# Dev mode with enhanced error messages
npm run dev
```

### Code Quality

```bash
# Type checking
npm run build  # Runs tsc first

# Linting
npm run lint
```

### Adding Dependencies

```bash
npm install --save <package>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Production build
npm run build

# Deploy dist/ folder
# Drop folder into Netlify or use CLI
```

### Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables

Frontend doesn't need env variables (backend URL is proxied during dev, and hardcoded to `/api` in production).

Optional:
```env
# API endpoint (defaults to /api)
VITE_API_BASE_URL=/api
```

## Troubleshooting

### Build fails with "dark class does not exist"
- Ensure `@tailwind` directives are before custom CSS
- Check `tailwind.config.js` has darkMode setting

### API calls fail
- Ensure backend is running on `http://localhost:3000`
- Check browser console for CORS errors
- Verify GitHub token is set in backend `.env`

### Animations not working
- Ensure Framer Motion is installed: `npm install framer-motion`
- Check for CSS conflicts with other libraries

## Future Improvements

- [ ] Share roast as image/card
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Voice narration of roasts
- [ ] Roast history/bookmarks
- [ ] Social media integration
- [ ] Advanced metrics charts
- [ ] Real-time collaboration features

## License

MIT

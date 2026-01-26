import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRoastStore } from './store/roast.js';
import { SearchForm } from './components/SearchForm.js';
import { RoastReveal } from './components/RoastReveal.js';
import { ErrorDisplay } from './components/ErrorDisplay.js';
import { checkHealth } from './services/api.js';
import './styles/globals.css';

function App() {
  const { analysis } = useRoastStore();

  useEffect(() => {
    // Check API health on mount
    checkHealth().catch((error) => {
      console.warn('Backend health check failed:', error);
    });
  }, []);

  return (
    <div className="min-h-screen bg-dark-950">
      <AnimatePresence mode="wait">
        {!analysis ? (
          <div key="search" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4">
            <SearchForm />
          </div>
        ) : (
          <div key="roast">
            <RoastReveal />
          </div>
        )}
      </AnimatePresence>

      <ErrorDisplay />

      {/* Footer */}
      <div className="fixed bottom-4 right-4 text-gray-600 text-xs pointer-events-none">
        <p>gitrekt.dev • Made with <span className="text-red-500">❤️</span></p>
      </div>
    </div>
  );
}

export default App;

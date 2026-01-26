import { motion } from 'framer-motion';
import { useRoastStore } from '../store/roast.js';

export function ErrorDisplay() {
  const { error, setError } = useRoastStore();

  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 max-w-sm bg-red-950 border-2 border-red-500 rounded-lg p-4 z-50"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-red-400">Error</h4>
          <p className="text-gray-200 text-sm mt-1">{error}</p>
        </div>
        <button
          onClick={() => setError(null)}
          className="ml-4 text-red-400 hover:text-red-300 font-bold"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}

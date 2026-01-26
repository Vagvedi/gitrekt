import { motion, AnimatePresence } from 'framer-motion';
import { useRoastStore } from '../store/roast';
import { RoastCard } from './RoastCard';
import { MetricsGrid } from './MetricsGrid';
import { FinalVerdict } from './FinalVerdict';

export function RoastReveal() {
  const { analysis, revealed, revealNextRoast, revealAll, showVerdict, setShowVerdict } = useRoastStore();

  if (!analysis) return null;

  const allRevealed = revealed >= analysis.roasts.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950"
    >
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header with username and score */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-2">@{analysis.username}</h2>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block"
          >
            <div
              className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan
                         flex items-center justify-center mb-6"
            >
              <span className="text-5xl font-bold text-dark-900">
                {analysis.overall_score}
              </span>
            </div>
          </motion.div>
          <p className="text-gray-400 text-lg">
            Roast Score: {analysis.overall_score > 70 ? '🔥 Critical' : analysis.overall_score > 40 ? '⚠️ Severe' : '✓ Okay'}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <MetricsGrid metrics={analysis.metrics} />

        {/* Roasts */}
        <div className="mt-16 mb-12">
          <h3 className="text-2xl font-bold text-neon-cyan mb-8">The Roasts</h3>
          <div className="space-y-4">
            {analysis.roasts.map((roast, index) => (
              <RoastCard
                key={index}
                roast={roast}
                index={index}
                isRevealed={index < revealed}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center mb-8"
        >
          {!allRevealed ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={revealNextRoast}
                className="px-6 py-2 bg-neon-purple text-dark-900 font-bold rounded-lg
                         hover:shadow-lg hover:shadow-neon-purple/50 transition-all"
              >
                Next Roast
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={revealAll}
                className="px-6 py-2 bg-neon-cyan text-dark-900 font-bold rounded-lg
                         hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
              >
                Show All
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVerdict(!showVerdict)}
              className="px-6 py-2 bg-gradient-to-r from-neon-green to-neon-cyan text-dark-900
                       font-bold rounded-lg hover:shadow-lg transition-all"
            >
              {showVerdict ? 'Hide Verdict' : 'Final Verdict'}
            </motion.button>
          )}
        </motion.div>

        {/* Final Verdict */}
        <AnimatePresence>
          {showVerdict && <FinalVerdict verdict={analysis.final_verdict} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

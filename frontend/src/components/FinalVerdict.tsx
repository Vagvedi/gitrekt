import { motion } from 'framer-motion';

interface FinalVerdictProps {
  verdict: string;
}

export function FinalVerdict({ verdict }: FinalVerdictProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-neon-purple to-neon-cyan p-1 rounded-xl max-w-2xl w-full"
      >
        <div className="bg-dark-900 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-neon-cyan mb-6 text-center">
            FINAL VERDICT
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="border-2 border-neon-purple rounded-lg p-6 mb-6 bg-dark-800"
          >
            <p className="text-xl text-gray-200 leading-relaxed text-center font-mono">
              {verdict}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-center"
          >
            <button
              onClick={() => navigator.clipboard.writeText(verdict)}
              className="px-6 py-2 bg-neon-cyan text-dark-900 font-bold rounded-lg
                       hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
            >
              Copy Verdict
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-neon-purple text-dark-900 font-bold rounded-lg
                       hover:shadow-lg hover:shadow-neon-purple/50 transition-all"
            >
              Roast Another
            </button>
          </motion.div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Share your roast and challenge others
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

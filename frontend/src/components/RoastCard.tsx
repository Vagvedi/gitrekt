import { motion } from 'framer-motion';
import { RoastItem } from '../services/types.js';

const severityColors = {
  warning: 'text-yellow-400',
  roast: 'text-orange-400',
  critical: 'text-red-500',
};

const severityBorders = {
  warning: 'border-yellow-400',
  roast: 'border-orange-400',
  critical: 'border-red-500',
};

const severityBg = {
  warning: 'bg-yellow-950',
  roast: 'bg-orange-950',
  critical: 'bg-red-950',
};

interface RoastCardProps {
  roast: RoastItem;
  index: number;
  isRevealed: boolean;
}

export function RoastCard({ roast, index, isRevealed }: RoastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={
        isRevealed
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: -50 }
      }
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`border-2 ${severityBorders[roast.severity]} ${severityBg[roast.severity]} 
                 rounded-lg p-6 mb-6 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-bold text-xl ${severityColors[roast.severity]}`}>
          {roast.title}
        </h3>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full uppercase
                     ${roast.severity === 'critical'
            ? 'bg-red-500 text-red-900'
            : roast.severity === 'roast'
              ? 'bg-orange-500 text-orange-900'
              : 'bg-yellow-500 text-yellow-900'
          }`}
        >
          {roast.severity}
        </span>
      </div>

      <p className="text-gray-200 mb-4 text-lg leading-relaxed font-mono">
        {isRevealed ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
          >
            {roast.message}
          </motion.span>
        ) : null}
      </p>

      {isRevealed && roast.evidence && (
        <motion.details
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
          className="text-gray-400 text-sm cursor-pointer"
        >
          <summary className="hover:text-gray-300 transition-colors">
            Evidence →
          </summary>
          <pre className="mt-3 bg-dark-950 p-3 rounded text-xs overflow-x-auto">
            {JSON.stringify(roast.evidence, null, 2)}
          </pre>
        </motion.details>
      )}
    </motion.div>
  );
}

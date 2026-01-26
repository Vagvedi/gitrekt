import { motion } from 'framer-motion';

interface MetricsGridProps {
  metrics: {
    total_repos: number;
    total_stars: number;
    total_commits: number;
    primary_languages: string[];
    fork_ratio: number;
    abandonment_score: number;
    code_quality_score: number;
    engagement_score: number;
  };
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const metricItems = [
    { label: 'Repositories', value: metrics.total_repos, color: 'neon-cyan' },
    { label: 'Total Commits', value: metrics.total_commits, color: 'neon-purple' },
    { label: 'Total Stars', value: metrics.total_stars, color: 'neon-green' },
    { label: 'Fork Ratio', value: `${(metrics.fork_ratio * 100).toFixed(0)}%`, color: 'neon-red' },
    { label: 'Code Quality', value: `${Math.round(metrics.code_quality_score)}/100`, color: 'neon-cyan' },
    { label: 'Engagement', value: `${Math.round(metrics.engagement_score)}/100`, color: 'neon-green' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-dark-800 border-2 border-neon-purple rounded-lg p-8 mb-12"
    >
      <h3 className="text-xl font-bold text-neon-cyan mb-6">Metrics Snapshot</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {metricItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm mb-2">{item.label}</p>
            <p className={`text-2xl font-bold text-neon-${item.color}`}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
      {metrics.primary_languages.length > 0 && (
        <div className="mt-6 pt-6 border-t border-dark-700">
          <p className="text-sm text-gray-400 mb-3">Primary Languages</p>
          <div className="flex flex-wrap gap-2">
            {metrics.primary_languages.map((lang, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="px-3 py-1 bg-neon-purple text-dark-900 text-xs font-bold rounded-full"
              >
                {lang}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

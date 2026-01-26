import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function MetricsGrid({ metrics }) {
    const metricItems = [
        { label: 'Repositories', value: metrics.total_repos, color: 'neon-cyan' },
        { label: 'Total Commits', value: metrics.total_commits, color: 'neon-purple' },
        { label: 'Total Stars', value: metrics.total_stars, color: 'neon-green' },
        { label: 'Fork Ratio', value: `${(metrics.fork_ratio * 100).toFixed(0)}%`, color: 'neon-red' },
        { label: 'Code Quality', value: `${Math.round(metrics.code_quality_score)}/100`, color: 'neon-cyan' },
        { label: 'Engagement', value: `${Math.round(metrics.engagement_score)}/100`, color: 'neon-green' },
    ];
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 }, className: "bg-dark-800 border-2 border-neon-purple rounded-lg p-8 mb-12", children: [_jsx("h3", { className: "text-xl font-bold text-neon-cyan mb-6", children: "Metrics Snapshot" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-6", children: metricItems.map((item, index) => (_jsxs(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 0.1 * index }, className: "text-center", children: [_jsx("p", { className: "text-gray-400 text-sm mb-2", children: item.label }), _jsx("p", { className: `text-2xl font-bold text-neon-${item.color}`, children: item.value })] }, index))) }), metrics.primary_languages.length > 0 && (_jsxs("div", { className: "mt-6 pt-6 border-t border-dark-700", children: [_jsx("p", { className: "text-sm text-gray-400 mb-3", children: "Primary Languages" }), _jsx("div", { className: "flex flex-wrap gap-2", children: metrics.primary_languages.map((lang, index) => (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.1 * index }, className: "px-3 py-1 bg-neon-purple text-dark-900 text-xs font-bold rounded-full", children: lang }, index))) })] }))] }));
}
//# sourceMappingURL=MetricsGrid.js.map
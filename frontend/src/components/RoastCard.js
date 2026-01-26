import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
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
export function RoastCard({ roast, index, isRevealed }) {
    return (_jsxs(motion.div, { initial: { opacity: 0, x: -50 }, animate: isRevealed
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: -50 }, transition: { duration: 0.5, delay: index * 0.1 }, className: `border-2 ${severityBorders[roast.severity]} ${severityBg[roast.severity]} 
                 rounded-lg p-6 mb-6 backdrop-blur-sm`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("h3", { className: `font-bold text-xl ${severityColors[roast.severity]}`, children: roast.title }), _jsx("span", { className: `text-xs font-bold px-3 py-1 rounded-full uppercase
                     ${roast.severity === 'critical'
                            ? 'bg-red-500 text-red-900'
                            : roast.severity === 'roast'
                                ? 'bg-orange-500 text-orange-900'
                                : 'bg-yellow-500 text-yellow-900'}`, children: roast.severity })] }), _jsx("p", { className: "text-gray-200 mb-4 text-lg leading-relaxed font-mono", children: isRevealed ? (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay: index * 0.1 + 0.2 }, children: roast.message })) : null }), isRevealed && roast.evidence && (_jsxs(motion.details, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: index * 0.1 + 0.4 }, className: "text-gray-400 text-sm cursor-pointer", children: [_jsx("summary", { className: "hover:text-gray-300 transition-colors", children: "Evidence \u2192" }), _jsx("pre", { className: "mt-3 bg-dark-950 p-3 rounded text-xs overflow-x-auto", children: JSON.stringify(roast.evidence, null, 2) })] }))] }));
}
//# sourceMappingURL=RoastCard.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useRoastStore } from '../store/roast.js';
export function ErrorDisplay() {
    const { error, setError } = useRoastStore();
    if (!error)
        return null;
    return (_jsx(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "fixed top-4 right-4 max-w-sm bg-red-950 border-2 border-red-500 rounded-lg p-4 z-50", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-bold text-red-400", children: "Error" }), _jsx("p", { className: "text-gray-200 text-sm mt-1", children: error })] }), _jsx("button", { onClick: () => setError(null), className: "ml-4 text-red-400 hover:text-red-300 font-bold", children: "\u2715" })] }) }));
}
//# sourceMappingURL=ErrorDisplay.js.map
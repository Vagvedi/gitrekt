import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "min-h-screen bg-dark-950", children: [_jsx(AnimatePresence, { mode: "wait", children: !analysis ? (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4", children: _jsx(SearchForm, {}) }, "search")) : (_jsx("div", { children: _jsx(RoastReveal, {}) }, "roast")) }), _jsx(ErrorDisplay, {}), _jsx("div", { className: "fixed bottom-4 right-4 text-gray-600 text-xs pointer-events-none", children: _jsxs("p", { children: ["gitrekt.dev \u2022 Made with ", _jsx("span", { className: "text-red-500", children: "\u2764\uFE0F" })] }) })] }));
}
export default App;
//# sourceMappingURL=App.js.map
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeUser } from '../services/api';
import { useRoastStore } from '../store/roast';
export function SearchForm() {
    const [input, setInput] = useState('');
    const { setLoading, setAnalysis, setError, setUsername, loading } = useRoastStore();
    const [localError, setLocalError] = useState(null);
    // Extracts a GitHub username from various input forms (username, URL, email-like)
    function extractUsername(value) {
        if (!value)
            return null;
        let v = value.trim();
        // If it's an email like user@github.com -> take part before @
        if (v.includes('@') && v.toLowerCase().endsWith('github.com')) {
            v = v.split('@')[0];
        }
        // Remove protocol(s)
        v = v.replace(/^https?:\/\//i, '');
        v = v.replace(/^git@/i, '');
        // Remove repeated github.com prefixes and any leading slashes or colons
        while (/^\s*github\.com[\/:]?/i.test(v)) {
            v = v.replace(/^\s*github\.com[\/:]?/i, '');
        }
        // Split into path segments and take the first non-empty segment
        const parts = v.split(/[\/?#\\]+/).filter(Boolean);
        if (parts.length === 0)
            return null;
        let candidate = parts[0];
        // Final clean and basic validation: 1-39 chars, letters/numbers/hyphen, not start/end with hyphen
        candidate = candidate.replace(/^https?:\/\//i, '');
        const valid = /^[a-zA-Z0-9-]{1,39}$/.test(candidate) && !/^[-]|[-]$/.test(candidate);
        if (!valid)
            return null;
        return candidate;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        const extracted = extractUsername(input);
        if (!extracted) {
            setLocalError('Please enter a valid GitHub username or profile URL');
            setError('Invalid GitHub username');
            return;
        }
        const username = extracted;
        setLocalError(null);
        setUsername(username);
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeUser(username);
            setAnalysis(result);
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to analyze user');
            setLoading(false);
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "w-full max-w-2xl mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-5xl font-bold mb-4", children: _jsx("span", { className: "bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent", children: "GITREKT" }) }), _jsx("p", { className: "text-gray-400 text-lg", children: "Let's see what your GitHub says about you" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Enter GitHub username or profile URL (e.g. Vagvedi or https://github.com/Vagvedi)", disabled: loading, className: "w-full px-6 py-4 bg-dark-800 border-2 border-neon-purple rounded-lg\r\n                     text-gray-100 placeholder-gray-500 focus:outline-none focus:border-neon-cyan\r\n                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors" }), input && (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "absolute right-4 top-1/2 -translate-y-1/2 text-neon-cyan text-sm truncate max-w-[40%]", children: extractUsername(input) ? `https://github.com/${extractUsername(input)}` : 'Invalid username' })), (localError || (useRoastStore().error)) && (_jsx("p", { className: "text-red-400 text-sm mt-2", children: localError || useRoastStore().error }))] }), _jsx(motion.button, { type: "submit", disabled: loading, whileHover: { scale: loading ? 1 : 1.02 }, whileTap: { scale: loading ? 1 : 0.98 }, className: "w-full py-4 px-6 bg-gradient-to-r from-neon-purple to-neon-cyan\r\n                   text-dark-900 font-bold rounded-lg hover:shadow-lg hover:shadow-neon-purple/50\r\n                   disabled:opacity-50 disabled:cursor-not-allowed transition-all", children: loading ? (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: 'linear' }, className: "w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full" }), "Analyzing..."] })) : ('GET ROASTED') })] })] }));
}
//# sourceMappingURL=SearchForm.js.map
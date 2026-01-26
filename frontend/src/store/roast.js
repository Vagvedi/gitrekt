import { create } from 'zustand';
export const useRoastStore = create((set, get) => ({
    username: null,
    analysis: null,
    loading: false,
    error: null,
    revealed: 0,
    showVerdict: false,
    setUsername: (username) => set({ username }),
    setAnalysis: (analysis) => set({ analysis, revealed: 0, showVerdict: false }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    revealNextRoast: () => {
        const { analysis, revealed } = get();
        if (analysis && revealed < analysis.roasts.length) {
            set({ revealed: revealed + 1 });
        }
    },
    revealAll: () => {
        const { analysis } = get();
        if (analysis) {
            set({ revealed: analysis.roasts.length, showVerdict: true });
        }
    },
    setShowVerdict: (show) => set({ showVerdict: show }),
    reset: () => set({
        username: null,
        analysis: null,
        loading: false,
        error: null,
        revealed: 0,
        showVerdict: false,
    }),
}));
//# sourceMappingURL=roast.js.map
import { create } from 'zustand';
import { AnalysisResponse } from '../services/types.js';

interface RoastStore {
  username: string | null;
  analysis: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
  revealed: number; // Number of roasts revealed
  showVerdict: boolean; // Show final verdict

  setUsername: (username: string) => void;
  setAnalysis: (analysis: AnalysisResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  revealNextRoast: () => void;
  revealAll: () => void;
  setShowVerdict: (show: boolean) => void;
  reset: () => void;
}

export const useRoastStore = create<RoastStore>((set, get) => ({
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

  reset: () =>
    set({
      username: null,
      analysis: null,
      loading: false,
      error: null,
      revealed: 0,
      showVerdict: false,
    }),
}));

import { AnalysisResponse } from '../services/types.js';
interface RoastStore {
    username: string | null;
    analysis: AnalysisResponse | null;
    loading: boolean;
    error: string | null;
    revealed: number;
    showVerdict: boolean;
    setUsername: (username: string) => void;
    setAnalysis: (analysis: AnalysisResponse) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    revealNextRoast: () => void;
    revealAll: () => void;
    setShowVerdict: (show: boolean) => void;
    reset: () => void;
}
export declare const useRoastStore: import("zustand").UseBoundStore<import("zustand").StoreApi<RoastStore>>;
export {};
//# sourceMappingURL=roast.d.ts.map
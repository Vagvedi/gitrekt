import { AnalysisResponse } from './types.js';
/**
 * Analyze a GitHub user and get roasts
 */
export declare function analyzeUser(username: string, options?: {
    force?: boolean;
}): Promise<AnalysisResponse>;
/**
 * Check API health
 */
export declare function checkHealth(): Promise<any>;
//# sourceMappingURL=api.d.ts.map
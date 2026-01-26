/**
 * Frontend API types
 */
export interface AnalysisResponse {
    username: string;
    overall_score: number;
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
    roasts: RoastItem[];
    final_verdict: string;
    generated_at: string;
    cache_hit: boolean;
}
export interface RoastItem {
    severity: 'warning' | 'roast' | 'critical';
    title: string;
    message: string;
    evidence: Record<string, unknown>;
}
export interface ApiError {
    error: string;
    message: string;
}
//# sourceMappingURL=types.d.ts.map
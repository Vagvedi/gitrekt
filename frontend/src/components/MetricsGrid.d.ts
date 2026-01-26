interface MetricsGridProps {
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
}
export declare function MetricsGrid({ metrics }: MetricsGridProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MetricsGrid.d.ts.map
import { LastAnalysisResult } from "./last-analysis-result";

export interface VirusTotalData {
    id: string;
    first_submission_date: string;
    last_analysis_results: { [key: string]: LastAnalysisResult };
    last_analysis_stats: { malicious: number };
}

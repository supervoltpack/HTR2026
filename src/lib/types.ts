export type Role = 'scammer' | 'victim';

export interface Message {
    role: Role;
    content: string;
    timestamp: number;
}

export type RiskScore = number; // 0-100

export type ScamType = "None" | "Tech Support" | "IRS/Government" | "Grandparent/Emergency" | "Romance" | "Bank Fraud";

export type UIDirective = "neutral" | "warning_yellow" | "danger_red" | "force_terminate";

export interface AnalysisResult {
    status: "safe" | "suspicious";
    risk_score: RiskScore;
    detected_scam_type: ScamType;
    trigger_phrase: string | null;
    streaming_text?: string;
    reasoning_summary: string;
    accessibility_message: string;
    ui_directive: UIDirective;
    timestamp?: number;
}

export interface ConversationState {
    messages: Message[];
    analysis: AnalysisResult | null;
    isCallActive: boolean;
}

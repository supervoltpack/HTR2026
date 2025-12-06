import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { addMessage, getConversation, updateAnalysis } from '@/lib/store';
import { AnalysisResult } from '@/lib/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const role = formData.get('role') as 'scammer' | 'victim';

        if (!file || !role) {
            return NextResponse.json({ error: 'Missing file or role' }, { status: 400 });
        }

        // 1. Transcribe
        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: 'whisper-1',
        });

        const text = transcription.text;

        // 2. Add to store
        addMessage(role, text);
        const conversation = getConversation();

        // 3. Analyze
        const history = conversation.messages.map(m => ({ role: m.role, content: m.content }));

        const systemPrompt = `
Role
You are Sentinel-9, an advanced Real-Time Fraud Detection System designed by cyber-security experts and geriatric psychologists. Your goal is to protect vulnerable populations (specifically the elderly) from voice phishing (vishing) and social engineering attacks.
Objective
Analyze the provided transcript of an ongoing phone call. You must evaluate the conversation for psychological manipulation, urgency, financial coercion, and known scam scripts. You must return a strict JSON object that determines the safety of the call and drives the user interface of the victim's phone.
Input Data
You will receive the conversation history in the following format: [{"role": "scammer", "content": "..."}, {"role": "victim", "content": "..."}]
Analysis Logic (Chain of Thought)
Scan for Keywords: Look for "gift cards," "IRS," "police," "bail," "computer virus," "refund," "verify," "social security number."
Detect Sentiment/Tone: Is the caller creating artificial urgency? Are they isolating the victim ("Don't tell anyone")? Are they aggressive or overly sickly sweet?
Assess Risk:
0-20: Normal conversation.
21-50: Mildly unusual, keep monitoring.
51-80: High probability of scam (Visual Warnings).
81-100: Active Danger (Haptic/Audio Warnings).
Output Schema (JSON Only)
You must return valid JSON. Do not include markdown formatting (like \`\`\`json). Return ONLY the raw object.

{ "status": "safe" | "suspicious", "risk_score": <integer_0_to_100>, "detected_scam_type": "None" | "Tech Support" | "IRS/Government" | "Grandparent/Emergency" | "Romance" | "Bank Fraud", "trigger_phrase": "<The exact quote from the scammer that triggered the alarm, or null if safe>", "streaming_text": "<The exact suspicious phrase(s) from the scammer, with *asterisks* around the specific trigger words. Keep it short and impactful. E.g. 'pay with *gift* *cards* immediately'>", "reasoning_summary": "<Technical explanation for the log, max 15 words>", "accessibility_message": "<A very simple, calm, clear instruction for an elderly person. E.g., 'They are lying. Hang up.'>", "ui_directive": "neutral" | "warning_yellow" | "danger_red" | "force_terminate" }
Negative Constraints
NEVER return conversational text.
NEVER return partial JSON.
If the call is short/ambiguous, default to "safe" but keep the score low-moderate.
Do not flag normal family conversations as suspicious.
`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify(history) }
            ],
            response_format: { type: "json_object" }
        });

        const analysisContent = completion.choices[0].message.content;
        let analysis: AnalysisResult;

        try {
            analysis = JSON.parse(analysisContent || '{}');
        } catch (e) {
            console.error("Failed to parse analysis JSON", e);
            // Fallback safe
            analysis = {
                status: "safe",
                risk_score: 0,
                detected_scam_type: "None",
                trigger_phrase: null,
                reasoning_summary: "Analysis failed",
                accessibility_message: "Keep talking.",
                ui_directive: "neutral"
            };
        }

        // Ensure streaming_text is present if trigger_phrase is present
        if (!analysis.streaming_text && analysis.trigger_phrase) {
            analysis.streaming_text = `*${analysis.trigger_phrase}*`;
        }

        // Add timestamp for React keys
        analysis.timestamp = Date.now();
        updateAnalysis(analysis);

        return NextResponse.json({
            transcription: text,
            analysis: analysis,
            conversation: conversation
        });

    } catch (error) {
        console.error('Error processing audio:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

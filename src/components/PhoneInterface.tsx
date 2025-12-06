'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Phone, Video, Grip, Volume2, MicOff, ShieldAlert, ShieldCheck, Shield, Signal, Battery, X } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { StreamingText } from '@/components/StreamingText';
import { ConversationState, Role } from '@/lib/types';
import clsx from 'clsx';

interface PhoneInterfaceProps {
    role: Role;
}

export default function PhoneInterface({ role }: PhoneInterfaceProps) {
    const [conversation, setConversation] = useState<ConversationState | null>(null);
    const { isRecording, startRecording, stopRecording } = useAudioRecorder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isSentinelVisible, setIsSentinelVisible] = useState(true);

    // SSE for real-time updates
    useEffect(() => {
        const eventSource = new EventSource('/api/sse');

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setConversation(data);
            } catch (e) {
                console.error("SSE Parse Error", e);
            }
        };

        eventSource.onerror = (e) => {
            console.error("SSE Error", e);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => setDuration(d => d + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    // Reset visibility when new analysis arrives
    useEffect(() => {
        if (conversation?.analysis) {
            setIsSentinelVisible(true);
        }
    }, [conversation?.analysis]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePushToTalk = async () => {
        if (isRecording) {
            // Stop recording and send
            setIsProcessing(true);
            const audioBlob = await stopRecording();

            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('role', role);

            try {
                await fetch('/api/process-audio', {
                    method: 'POST',
                    body: formData,
                });
            } catch (e) {
                console.error("Upload error", e);
            } finally {
                setIsProcessing(false);
            }
        } else {
            // Start recording
            await startRecording();
        }
    };

    const riskScore = conversation?.analysis?.risk_score || 0;
    const uiDirective = conversation?.analysis?.ui_directive || 'neutral';

    // Determine background and accent colors based on risk
    const getTheme = () => {
        if (role === 'scammer') return { bg: 'from-gray-900 to-gray-800', accent: 'text-white', status: 'neutral' };

        switch (uiDirective) {
            case 'danger_red': return { bg: 'from-red-900 via-red-800 to-gray-900', accent: 'text-red-500', status: 'danger' };
            case 'warning_yellow': return { bg: 'from-yellow-900 via-orange-900 to-gray-900', accent: 'text-yellow-500', status: 'warning' };
            default: return { bg: 'from-gray-900 via-blue-900 to-gray-900', accent: 'text-white', status: 'safe' };
        }
    };

    const theme = getTheme();

    return (
        <div className={clsx(
            "min-h-screen w-full bg-black font-sans transition-all duration-1000",
            role === 'victim' && riskScore > 50 ? "animate-pulse-slow" : ""
        )}>
            {/* Phone Frame */}
            <div className={clsx(
                "relative w-full h-screen overflow-hidden bg-gradient-to-b transition-colors duration-1000",
                theme.bg
            )}>

                {/* Dynamic Background Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                {/* Status Bar */}
                <div className="absolute top-0 w-full p-6 flex justify-between text-xs text-white/70 z-10">
                    <span>12:42</span>
                    <div className="flex gap-2 items-center">
                        <Signal className="w-4 h-4" />
                        <span className="text-xs font-medium">5G</span>
                        <Battery className="w-4 h-4" />
                    </div>          </div>


                {/* Caller Info */}
                <div className="relative z-10 flex flex-col items-center mt-24">
                    <div className={clsx(
                        "w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-lg mb-6 transition-all duration-500",
                        theme.status === 'danger' ? "bg-red-500/20 text-red-100 animate-pulse" : "bg-gray-700/50 text-white"
                    )}>
                        {role === 'scammer' ? '👵' : '👤'}
                    </div>
                    <h1 className="text-3xl font-light text-white mb-2">
                        {role === 'scammer' ? 'Potential Victim' : 'Unknown Caller'}
                    </h1>
                    <p className="text-white/60 text-lg">{formatTime(duration)}</p>

                    {/* Sentinel-9 UI for Victim */}
                    {role === 'victim' && conversation?.analysis && isSentinelVisible && (
                        <div className={clsx(
                            "mt-8 p-4 rounded-xl backdrop-blur-md border w-10/12 text-center relative",
                            theme.status === 'danger' ? "bg-red-500/10 border-red-500/50" :
                                theme.status === 'warning' ? "bg-yellow-500/10 border-yellow-500/50" :
                                    "bg-blue-500/10 border-blue-500/30",
                            // Custom animation for opacity, blur, and slide down
                            "animate-slideDownBlur"
                        )}>
                            {/* Close Button */}
                            <button
                                onClick={() => setIsSentinelVisible(false)}
                                className="absolute top-2 right-2 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="flex items-center justify-center gap-2 mb-2">
                                {theme.status === 'danger' ? <ShieldAlert className="w-5 h-5 text-red-400" /> :
                                    theme.status === 'warning' ? <ShieldAlert className="w-5 h-5 text-yellow-400" /> :
                                        <ShieldCheck className="w-5 h-5 text-blue-400" />}
                                <span className={clsx("font-bold uppercase tracking-wider text-sm",
                                    theme.status === 'danger' ? "text-red-400" :
                                        theme.status === 'warning' ? "text-yellow-400" :
                                            "text-blue-400"
                                )}>
                                    Sentinel-9 Protection
                                </span>
                            </div>

                            <div className="text-2xl font-bold text-white mb-1">
                                {conversation.analysis.risk_score}% Risk
                            </div>

                            <p className="text-white/90 text-sm font-medium mb-3">
                                {conversation.analysis.accessibility_message}
                            </p>

                            {conversation.analysis.detected_scam_type !== 'None' && (
                                <div className="inline-block px-3 py-1 rounded-full bg-black/30 text-xs text-white/80 border border-white/10">
                                    Detected: {conversation.analysis.detected_scam_type}
                                </div>
                            )}

                            {/* Streaming Transcript of Suspicious Message */}
                            {(() => {
                                // Prefer the explicit streaming text from LLM, fallback to last message if needed (but LLM should provide it)
                                const streamingText = conversation.analysis.streaming_text;

                                if (streamingText && streamingText.trim().length > 0) {
                                    return (
                                        <div className="relative mt-6 px-4">
                                            <span className="absolute -top-4 left-0 text-6xl text-white/20 font-serif leading-none">“</span>
                                            <StreamingText
                                                key={conversation.analysis.timestamp || conversation.messages.length}
                                                text={streamingText}
                                            />
                                            <span className="absolute -bottom-8 right-0 text-6xl text-white/20 font-serif leading-none">”</span>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-12 w-full px-8 z-10">
                    {/* Recall Shield Button */}
                    {role === 'victim' && conversation?.analysis && !isSentinelVisible && (
                        <div className="absolute -top-20 right-8">
                            <button
                                onClick={() => setIsSentinelVisible(true)}
                                className={clsx(
                                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all animate-bounce",
                                    theme.status === 'danger' ? "bg-red-500 text-white" :
                                        theme.status === 'warning' ? "bg-yellow-500 text-white" :
                                            "bg-blue-500 text-white"
                                )}
                            >
                                <Shield className="w-6 h-6" />
                            </button>
                        </div>
                    )}

                    {/* Action Buttons Grid - Hidden when analysis is active AND visible for victim */}
                    {!(role === 'victim' && conversation?.analysis && isSentinelVisible) && (
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {[
                                { icon: Mic, label: 'Mute' },
                                { icon: Grip, label: 'Keypad' },
                                { icon: Volume2, label: 'Speaker' },
                            ].map((btn, i) => (
                                <button key={i} className="flex flex-col items-center gap-2 group">
                                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/20 transition-all">
                                        <btn.icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-white/60 text-xs">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Actions */}
                    <div className="flex items-center justify-center gap-8 mt-8">
                        {/* Push to Talk Button */}
                        <button
                            onMouseDown={handlePushToTalk}
                            onMouseUp={handlePushToTalk}
                            onTouchStart={handlePushToTalk}
                            onTouchEnd={handlePushToTalk}
                            className={clsx(
                                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95",
                                isRecording
                                    ? "bg-green-500 text-white animate-pulse shadow-green-500/50"
                                    : isProcessing
                                        ? "bg-yellow-500 text-white animate-spin"
                                        : "bg-white/20 text-white hover:bg-white/30"
                            )}
                        >
                            {isRecording ? <Mic className="w-8 h-8" /> :
                                isProcessing ? <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full" /> :
                                    <MicOff className="w-8 h-8" />}
                        </button>

                        {/* End Call Button */}
                        <button className={clsx(
                            "w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95",
                            role === 'victim' && riskScore > 75 ? "animate-throb" : ""
                        )}>
                            <Phone className="w-8 h-8 rotate-[135deg]" />
                        </button>
                    </div>

                    <p className="text-center text-white/40 text-sm mt-6">
                        {isRecording ? "Listening..." : "Hold Mic to Speak"}
                    </p>
                </div>
            </div>
        </div >
    );
}

import React from 'react';
import clsx from 'clsx';

interface StreamingTextProps {
    text: string;
    triggerPhrase?: string | null;
}

export function StreamingText({ text }: { text: string }) {
    // Split by space to get words
    const words = text.split(' ');

    return (
        <>

            <div className="flex flex-wrap justify-center gap-1.5 mt-2 mb-2 px-2">
                {words.map((word, i) => {
                    // Check if word starts and ends with asterisk
                    const isHighlighted = word.startsWith('*') && word.endsWith('*');

                    // Remove asterisks for display
                    const displayWord = isHighlighted ? word.slice(1, -1) : word;

                    return (
                        <span
                            key={i}
                            className={clsx(
                                "inline-block text-lg font-medium leading-relaxed word-animate",
                                isHighlighted ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)] font-bold" : "text-white/90"
                            )}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {displayWord}
                        </span>
                    );
                })}
            </div>
        </>
    );
}

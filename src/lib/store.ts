import { ConversationState } from './types';

const globalForStore = global as unknown as {
    conversationStore: ConversationState;
    listeners: ((state: ConversationState) => void)[];
};

export const conversationStore = globalForStore.conversationStore || {
    messages: [],
    analysis: null,
    isCallActive: true,
};

export const listeners = globalForStore.listeners || [];

if (process.env.NODE_ENV !== 'production') {
    globalForStore.conversationStore = conversationStore;
    globalForStore.listeners = listeners;
}

function notify() {
    listeners.forEach(listener => listener(conversationStore));
}

export function subscribe(listener: (state: ConversationState) => void) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}

export function addMessage(role: 'scammer' | 'victim', content: string) {
    conversationStore.messages.push({
        role,
        content,
        timestamp: Date.now(),
    });
    notify();
}

export function updateAnalysis(analysis: any) {
    conversationStore.analysis = analysis;
    notify();
}

export function getConversation() {
    return conversationStore;
}

export function clearConversation() {
    conversationStore.messages = [];
    conversationStore.analysis = null;
    conversationStore.isCallActive = true;
    notify();
}

import { getConversation, subscribe } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            // Send initial state
            const sendState = (data: any) => {
                const message = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            sendState(getConversation());

            // Subscribe to updates
            const unsubscribe = subscribe((state) => {
                sendState(state);
            });

            // Clean up on close (this part is tricky in standard fetch, but we can try)
            request.signal.addEventListener('abort', () => {
                unsubscribe();
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

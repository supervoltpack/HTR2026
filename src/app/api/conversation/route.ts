import { NextResponse } from 'next/server';
import { getConversation, clearConversation } from '@/lib/store';

export async function GET() {
    return NextResponse.json(getConversation());
}

export async function DELETE() {
    clearConversation();
    return NextResponse.json({ success: true });
}

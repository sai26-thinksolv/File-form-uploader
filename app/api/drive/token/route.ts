import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const accessToken = (session as any).accessToken;

        if (!accessToken) {
            return NextResponse.json(
                { error: 'No access token available. Please sign in again.' },
                { status: 401 }
            );
        }

        return NextResponse.json({ accessToken });
    } catch (error) {
        console.error('Error getting access token:', error);
        return NextResponse.json(
            { error: 'Failed to get access token' },
            { status: 500 }
        );
    }
}

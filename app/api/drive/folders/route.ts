import { NextResponse } from 'next/server'
import { listDriveFolders } from '@/lib/google-drive'

export async function GET() {
    try {
        const folders = await listDriveFolders()
        return NextResponse.json({ folders })
    } catch (error: any) {
        console.error('Error fetching Drive folders:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch folders' },
            { status: 500 }
        )
    }
}

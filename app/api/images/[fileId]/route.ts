import { NextRequest, NextResponse } from 'next/server'
import { getDriveClient } from '@/lib/google-drive'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ fileId: string }> }
) {
    try {
        // 1. Get the file ID
        const params = await props.params
        const fileId = params.fileId

        if (!fileId) {
            return new NextResponse('File ID missing', { status: 400 })
        }

        // 2. Authenticate (Optional: if you want images to be public, remove this check. 
        //    But usually, you want to ensure at least the server can access it.)
        //    For this use case, we'll use the service account/user credentials to fetch the file.
        //    We don't necessarily need the user to be logged in to VIEW the logo on the public form,
        //    so we'll just use the system's drive client.

        // We need a userId to initialize the drive client. 
        // Since this is for public display, we might need a "system" client or use the session if available.
        // However, getDriveClient requires a userId. 
        // If the logo is public, we should probably use a specific user's credentials or a service account.
        // For now, let's try to get the session. If no session (public form view), we might need a fallback.

        // CRITICAL: For public forms, the viewer is NOT logged in.
        // We need to fetch the image using the FORM OWNER'S credentials or the one who uploaded it.
        // But we don't know the owner here easily without a DB lookup.

        // ALTERNATIVE: Since we made the file "Public to Anyone with Link" during upload,
        // we can just fetch it using a standard fetch without credentials, 
        // OR use the Drive API with any valid token.

        // Let's try fetching the 'thumbnail' or 'media' content directly using the Drive API.
        // We'll assume the file is accessible to the application's credentials.

        // To make this robust for the "public" view (where no user is logged in),
        // we really should use the "Public URL" we generated. 
        // But if that's failing, we need to proxy the stream.

        // Let's try to fetch the content server-side and stream it.

        // Strategy 1: Try the Google User Content URL (lh3) - Best for images
        // This is the underlying CDN URL for Drive images
        let targetUrl = `https://lh3.googleusercontent.com/d/${fileId}`

        // Add headers to mimic a browser request
        const fetchOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }

        let imageRes = await fetch(targetUrl, fetchOptions)

        // Strategy 2: If lh3 fails, try the thumbnail URL
        if (!imageRes.ok) {
            console.warn(`lh3 fetch failed for ${fileId} (${imageRes.status}), trying thumbnail URL...`)
            targetUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
            imageRes = await fetch(targetUrl, fetchOptions)
        }

        // Strategy 3: If thumbnail fails, try the download URL
        if (!imageRes.ok) {
            console.warn(`Thumbnail fetch failed for ${fileId} (${imageRes.status}), trying download URL...`)
            targetUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
            imageRes = await fetch(targetUrl, fetchOptions)
        }

        if (!imageRes.ok) {
            console.error(`Failed to fetch image from Drive for ${fileId}. Status: ${imageRes.status}`)
            const text = await imageRes.text()
            console.error('Drive response:', text.substring(0, 200)) // Log first 200 chars
            return new NextResponse(`Failed to fetch image from Drive: ${imageRes.status}`, { status: imageRes.status })
        }

        const contentType = imageRes.headers.get('content-type') || 'image/jpeg'
        const buffer = await imageRes.arrayBuffer()

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        })

    } catch (error) {
        console.error('Image proxy error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

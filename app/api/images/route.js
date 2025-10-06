import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Dynamic imports to avoid Node.js assistant warnings
        const path = await import('path');
        const fs = await import('fs');

        const { searchParams } = new URL(request.url);
        const imagePath = searchParams.get('path');
        
        if (!imagePath) {
            return new NextResponse('Image path required', { status: 400 });
        }

        // Construct the full path to the image
        const fullPath = path.join(process.cwd(), 'public', imagePath);
        
        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            console.log('Image not found at:', fullPath);
            return new NextResponse('Image not found', { status: 404 });
        }

        // Read the file
        const imageBuffer = fs.readFileSync(fullPath);
        
        // Determine content type based on file extension
        const ext = path.extname(imagePath).toLowerCase();
        let contentType = 'image/png';
        
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.webp':
                contentType = 'image/webp';
                break;
        }

        // Add timestamp to force cache refresh
        const timestamp = Date.now();

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'ETag': `"${timestamp}"`,
            },
        });

    } catch (error) {
        console.error('Error serving image:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}

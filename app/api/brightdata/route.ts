import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Initialize S3 client with Bright Data configuration
    const s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: 'https://s3-bd.vturb.net',
      credentials: {
        accessKeyId: process.env.BRIGHT_DATA_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.BRIGHT_DATA_SECRET_ACCESS_KEY || ''
      },
      forcePathStyle: true,
    });

    // Search for images in the Bright Data bucket
    const command = new GetObjectCommand({
      Bucket: 'bd-vturb',
      Key: `images/${encodeURIComponent(query)}.jpg`,
    });

    const response = await s3Client.send(command);
    const imageBuffer = await response.Body?.transformToByteArray();
    
    if (!imageBuffer) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Return the image data
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

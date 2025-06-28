import { S3Client, ListObjectsV2Command, GetObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3';
import { RequestHandler } from '@aws-sdk/types';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Type definitions for request handler
interface CustomRequestHandlerOptions {
  httpHandler: RequestHandler<any, any>;
}

// Custom request handler with timeout
const createRequestHandler = (): RequestHandler<any, any> => ({
  handle: (request: any, options: any) => {
    const timeout = setTimeout(() => {
      request.abort();
    }, 30000); // 30 seconds timeout

    return options.httpHandler.handle(request, options).finally(() => {
      clearTimeout(timeout);
    });
  },
});

// Type for S3 client configuration
const s3Config: S3ClientConfig = {
  region: 'us-east-1',
  endpoint: 'https://s3-bd.vturb.net',
  credentials: {
    accessKeyId: process.env.BRIGHT_DATA_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.BRIGHT_DATA_SECRET_ACCESS_KEY || ''
  },
  forcePathStyle: true,
  requestHandler: createRequestHandler()
};

// Initialize S3 client with configuration
const s3Client = new S3Client(s3Config);

const streamPipeline = promisify(require('stream').pipeline);

async function searchAndDownloadImages(query: string, outputDir: string) {
  console.log('Starting image search and download...');
  console.log('Environment variables loaded:', !!process.env.BRIGHT_DATA_ACCESS_KEY_ID);

  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      console.log(`Creating directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Searching for images with query:', query);
    // Search for images in Bright Data
    const searchCommand = new ListObjectsV2Command({
      Bucket: 'bd-vturb',
      Prefix: `images/${query}`,
      MaxKeys: 10
    });

    console.log('Sending search command...');
    const searchResults = await s3Client.send(searchCommand);
    console.log('Search results:', searchResults.$metadata);
    
    if (!searchResults.Contents || searchResults.Contents.length === 0) {
      console.log('No images found for query:', query);
      return [];
    }

    console.log(`Found ${searchResults.Contents.length} items`);
    const downloadedFiles: string[] = [];

    // Download each image
    for (const item of searchResults.Contents) {
      if (!item.Key) {
        console.log('Skipping item with no key');
        continue;
      }
      
      const fileName = path.basename(item.Key);
      const outputPath = path.join(outputDir, fileName);
      
      console.log(`\nProcessing item: ${item.Key}`);
      console.log(`Output path: ${outputPath}`);
      
      try {
        console.log('Creating GetObjectCommand...');
        const getCommand = new GetObjectCommand({
          Bucket: 'bd-vturb',
          Key: item.Key,
          ResponseContentType: 'image/jpeg',
        });
        
        console.log('Sending getObject command...');
        const response = await s3Client.send(getCommand);
        
        if (!response.Body) {
          console.error('No body in response');
          continue;
        }

        console.log('Creating write stream...');
        const fileStream = fs.createWriteStream(outputPath);
        
        console.log('Piping response to file...');
        await streamPipeline(
          response.Body as Readable,
          fileStream
        );
        
        console.log('Successfully downloaded:', outputPath);
        downloadedFiles.push(outputPath);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }

    return downloadedFiles;
  } catch (error) {
    console.error('Error in searchAndDownloadImages:', error);
    return [];
  }
}

// Example usage
async function main() {
  try {
    console.log('Starting script...');
    
    if (!process.env.BRIGHT_DATA_ACCESS_KEY_ID || !process.env.BRIGHT_DATA_SECRET_ACCESS_KEY) {
      throw new Error('Bright Data credentials not found in environment variables');
    }

    const query = 'CIE Centro de Entrenamiento Cariló';
    const outputDir = './public/quehacer/cie-gym';
    
    console.log(`\nSearching for images of: "${query}"`);
    console.log(`Output directory: ${outputDir}`);
    
    const downloadedFiles = await searchAndDownloadImages(query, outputDir);
    
    console.log('\nDownload complete!');
    if (downloadedFiles.length > 0) {
      console.log('\nDownloaded images:');
      downloadedFiles.forEach((file, index) => console.log(`${index + 1}. ${file}`));
    } else {
      console.log('No images were downloaded.');
    }
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

// Run with a timeout to prevent hanging indefinitely
(async () => {
  const timeout = 120000; // 2 minutes
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Script timed out after ${timeout}ms`));
    }, timeout);
  });

  try {
    await Promise.race([
      main(),
      timeoutPromise
    ]);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();

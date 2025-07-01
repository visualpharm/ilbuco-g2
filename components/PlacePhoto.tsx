'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface PlacePhotoProps {
  placeId: string;
  apiKey?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function PlacePhoto({ 
  placeId, 
  apiKey, 
  width = 400, 
  height = 300, 
  className = '' 
}: PlacePhotoProps) {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlacePhoto = async () => {
      const effectiveApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!placeId) {
        setError('Missing placeId');
        setLoading(false);
        return;
      }
      
      if (!effectiveApiKey) {
        console.error('No API key found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
        setError('API key not configured');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching place details for placeId:', placeId);
        
        // First, get place details with specific fields we need
        const detailsResponse = await fetch(
          `https://places.googleapis.com/v1/places/${placeId}?fields=photos,displayName&key=${effectiveApiKey}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-FieldMask': 'photos,displayName',
              'X-Goog-Features': 'places_photos'
            }
          }
        );
        
        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json();
          console.error('Error response from Places API:', errorData);
          throw new Error(`API Error: ${detailsResponse.status} - ${JSON.stringify(errorData)}`);
        }
        
        const detailsData = await detailsResponse.json();
        console.log('Place details response:', detailsData);
        
        if (!detailsData.photos?.length) {
          throw new Error('No photos found for this location');
        }

        // Find the best photo (prioritize exterior/interior shots over food)
        const photo = detailsData.photos.find((p: any) => 
          p.name?.includes('exterior') || 
          p.name?.includes('interior') ||
          p.name?.includes('restaurant') ||
          p.name?.includes('dining')
        ) || detailsData.photos[0];
        
        console.log('Selected photo data:', photo);
        
        // Extract the photo reference (different from photo ID)
        const photoReference = photo.name?.split('/').pop();
        
        if (!photoReference) {
          throw new Error('Could not extract photo reference');
        }
        
        // Construct the photo URL using the correct format
        const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?key=${effectiveApiKey}&maxHeightPx=${height}&maxWidthPx=${width}`;
        console.log('Constructed photo URL:', photoUrl);
        
        // Verify the photo loads before setting state
        const img = new window.Image();
        img.src = photoUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        setPhotoUrl(photoUrl);
      } catch (err) {
        console.error('Error fetching place photo:', err);
        setError('Failed to load photo');
      } finally {
        setLoading(false);
      }
    };

    fetchPlacePhoto();
  }, [placeId, apiKey, width, height]);

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} style={{ width, height }}>
        <div className="text-xs text-gray-500 p-2">Loading photo...</div>
      </div>
    );
  }

  if (error || !photoUrl) {
    console.log('Error or no photo URL:', { error, photoUrl, placeId });
    return (
      <div className={`bg-gray-200 flex items-center justify-center flex-col p-4 text-center ${className}`} style={{ width, height }}>
        <div className="text-sm text-gray-700 mb-2">Photo not available</div>
        <div className="text-xs text-gray-500">{error || 'No photo found'}</div>
        <span className="text-gray-500">Photo not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={photoUrl}
        alt="Location photo"
        fill
        className="object-cover rounded-lg"
        unoptimized // Required for external images
      />
    </div>
  );
}

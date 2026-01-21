'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { translations } from '@/translations/common';

interface AvailabilityData {
  date: string;
  availableSuites: number;
  wholeHouseAvailable: boolean;
  totalSuites: number;
  minPrice: number | null;
}

export function HeroAvailability() {
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch('/api/availability');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
        setError(false);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();

    // Refresh every 5 minutes
    const interval = setInterval(fetchAvailability, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || error || !data) {
    return null;
  }

  const langCode = language.code as 'en' | 'es' | 'pt' | 'ru';
  const { availableSuites, wholeHouseAvailable, minPrice } = data;

  // If no rooms available
  if (availableSuites === 0) {
    const soldOutText = translations.availability.soldOutToday[langCode] || translations.availability.soldOutToday.en;
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span>{soldOutText}</span>
      </div>
    );
  }

  // Build the availability text
  let availabilityText: string;
  if (wholeHouseAvailable && availableSuites === 4) {
    availabilityText = translations.availability.wholeHouse[langCode] || translations.availability.wholeHouse.en;
  } else if (availableSuites === 1) {
    availabilityText = translations.availability.oneRoom[langCode] || translations.availability.oneRoom.en;
  } else {
    const template = translations.availability.multipleRooms[langCode] || translations.availability.multipleRooms.en;
    availabilityText = template.replace('{count}', availableSuites.toString());
  }

  // Build the price text
  let priceText = '';
  if (minPrice && minPrice > 0) {
    const priceTemplate = translations.availability.todayFrom[langCode] || translations.availability.todayFrom.en;
    priceText = priceTemplate.replace('${price}', `$${minPrice}`);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-gray-700">{availabilityText}</span>
      {priceText && (
        <span className="text-green-700 font-medium">· {priceText}</span>
      )}
    </div>
  );
}

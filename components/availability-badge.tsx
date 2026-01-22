'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { translations } from '@/translations/common';

interface AvailabilityData {
  date: string;
  availableSuites: number;
  wholeHouseAvailable: boolean;
  totalSuites: number;
}

export function AvailabilityBadge() {
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
  const { availableSuites, wholeHouseAvailable } = data;

  let text: string;
  let isAvailable: boolean;

  if (availableSuites === 0) {
    text = translations.availability.soldOut[langCode] || translations.availability.soldOut.en;
    isAvailable = false;
  } else if (wholeHouseAvailable && availableSuites === 4) {
    text = translations.availability.wholeHouse[langCode] || translations.availability.wholeHouse.en;
    isAvailable = true;
  } else if (availableSuites === 1) {
    text = translations.availability.oneRoom[langCode] || translations.availability.oneRoom.en;
    isAvailable = true;
  } else {
    const template = translations.availability.multipleRooms[langCode] || translations.availability.multipleRooms.en;
    text = template.replace('{count}', availableSuites.toString());
    isAvailable = true;
  }

  return (
    <div
      className={`
        hidden lg:inline-flex items-center gap-1.5 text-xs
        ${isAvailable
          ? 'text-green-700 dark:text-green-400'
          : 'text-red-600 dark:text-red-400'
        }
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
      />
      {text}
    </div>
  );
}

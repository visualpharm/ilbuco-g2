// Shared knowledge base for Il Buco - used by both chat and voice assistants

export const PROPERTY_INFO = {
  name: 'Il Buco',
  tagline: 'Tech Villa in Cariló, Argentina',

  location: {
    address: 'Paraíso 324, Cariló, Buenos Aires Province, Argentina',
    beachDistance: '5 minutes walk',
    setting: 'Pine forest',
    description: 'Cariló is an exclusive beach town, known as Argentina\'s most expensive destination',
  },

  overview: {
    type: 'Modern tech-focused villa designed for remote workers and founders',
    suiteCount: 4,
    baseCapacityPerSuite: 2,
    totalBaseCapacity: 8,
    maxCapacity: 16,
  },

  extraCapacity: {
    sofaBed: {
      lengthCm: 182,
      capacityPerRoom: 2,
      description: 'Each room has a sofa bed (182 cm long) that sleeps 2 extra people',
    },
    foldingBeds: {
      count: 2,
      totalCapacity: 2,
      description: '2 folding beds available for 2 more people',
    },
    extraGuestFee: {
      amountUsd: 10,
      per: 'night',
      description: '$10/night per person beyond 2 guests per room',
    },
  },

  suites: [
    {
      name: 'Giardino',
      floor: 'Ground floor',
      highlight: 'Private garden terrace with live plants',
      bedType: 'Queen',
      bookingId: '110800',
      listingId: '110800-13274',
    },
    {
      name: 'Terrazzo',
      floor: 'Ground floor',
      highlight: 'Largest terrace with outdoor dining',
      bedType: 'Queen',
      bookingId: '110801',
      listingId: '110801-13274',
    },
    {
      name: 'Paraiso',
      floor: 'Second floor',
      highlight: 'Corner suite with two-sided windows',
      bedType: 'Twin',
      bookingId: '110802',
      listingId: '110802-13274',
    },
    {
      name: 'Penthouse',
      floor: 'Top floor',
      highlight: 'Forest views, access to green roof',
      bedType: 'Queen',
      bookingId: '110803',
      listingId: '110803-13274',
    },
  ],

  suiteFeatures: [
    'Private entrance',
    'Private bathroom',
    'Kitchenette',
    'Washer',
  ],

  amenities: [
    '500 Mbps fiber internet with mesh WiFi throughout',
    'Underfloor heating + 8 air conditioners (climate control in each room)',
    'Green rooftop with BBQ area',
    'Large living room and full kitchen for common use',
    'Smart TVs in each suite',
    'Luxury bedding and towels',
    'Water softener system',
  ],

  nearbyActivities: [
    { name: 'Beach', distance: '5 min walk' },
    { name: 'Restaurants and cafes', distance: 'walking distance' },
    { name: 'Golf courses', distance: 'nearby' },
    { name: 'Tennis courts', distance: 'nearby' },
    { name: 'Horse riding', distance: 'nearby' },
    { name: 'Surfing/windsurfing', distance: 'nearby' },
    { name: 'Cycling paths', distance: 'nearby' },
    { name: 'Gym facilities', distance: 'nearby' },
  ],

  languages: ['English', 'Spanish', 'Portuguese', 'Russian'],

  payments: {
    methods: ['Visa', 'Mastercard', 'Amex', 'PayPal', 'USDT'],
    currency: 'USD',
  },

  booking: {
    mainUrl: 'https://book.ilbuco.com.ar/',
    website: 'https://ilbuco.com.ar',
    platforms: ['Direct booking', 'Airbnb'],
    directBenefits: 'Best rates',
  },

  wifi: {
    network: 'Il Buco',
    password: 'terminator1',
    guestOnly: true,
  },
};

// Listings configuration for Hostex API
export const LISTINGS = [
  { channel_type: 'booking_site', listing_id: '110800-13274', name: 'Giardino', bookingId: '110800' },
  { channel_type: 'booking_site', listing_id: '110801-13274', name: 'Terrazzo', bookingId: '110801' },
  { channel_type: 'booking_site', listing_id: '110802-13274', name: 'Paraiso', bookingId: '110802' },
  { channel_type: 'booking_site', listing_id: '110803-13274', name: 'Penthouse', bookingId: '110803' },
  { channel_type: 'booking_site', listing_id: '113182-13274', name: 'Whole House', bookingId: '' },
];

// City ID for Cariló (used in booking deep links)
export const CARILO_CITY_ID = 'ChIJI2UgCLidnJURwDOxMw6QTqI';

// Room booking IDs for deep links
export const ROOM_BOOKING_IDS: Record<string, string> = {
  'Giardino': '110800',
  'Terrazzo': '110801',
  'Paraiso': '110802',
  'Penthouse': '110803',
};

// Build a room-specific booking deep link with dates
export function buildRoomBookingLink(roomName: string, checkIn: string, checkOut: string, adults: number = 2): string {
  const bookingId = ROOM_BOOKING_IDS[roomName] || '';
  if (!bookingId) return 'https://book.ilbuco.com.ar/';
  return `https://book.ilbuco.com.ar/listing/${bookingId}?check_in=${checkIn}&check_out=${checkOut}&adults=${adults}&children=0&infants=0&pets=0&city=`;
}

// Build a general booking deep link
export function buildBookingDeepLink(checkIn: string, checkOut: string, adults: number = 2): string {
  return `https://book.ilbuco.com.ar/search?check_in=${checkIn}&check_out=${checkOut}&adults=${adults}&children=0&infants=0&pets=0&city=${CARILO_CITY_ID}`;
}

// Generate property info as formatted text (for prompts)
export function getPropertyInfoText(): string {
  const p = PROPERTY_INFO;
  return `
# ${p.name} - ${p.tagline}

## Location
- Address: ${p.location.address}
- ${p.location.beachDistance} from the beach
- Located in a ${p.location.setting.toLowerCase()}
- ${p.location.description}

## Property Overview
- ${p.overview.type}
- ${p.overview.suiteCount} private suites, each with private bathroom, kitchen, and washer
- Base capacity: ${p.overview.baseCapacityPerSuite} people per suite (${p.overview.totalBaseCapacity} total)
- Extra capacity: ${p.extraCapacity.sofaBed.description}
- Plus ${p.extraCapacity.foldingBeds.description}
- Total maximum capacity: ${p.overview.maxCapacity} people
- Extra guest fee: ${p.extraCapacity.extraGuestFee.description}
- Whole house can be rented for groups of 8-16 people

## Suites (each with ${p.suiteFeatures.join(', ')}):
${p.suites.map((s, i) => `${i + 1}. **${s.name}** - ${s.floor}, ${s.highlight}`).join('\n')}

## Amenities
${p.amenities.map(a => `- ${a}`).join('\n')}

## Nearby Activities
${p.nearbyActivities.map(a => `- ${a.name} (${a.distance})`).join('\n')}

## Languages
- We speak ${p.languages.join(', ')}
- We accept payments via ${p.payments.methods.join(', ')}

## Booking
- Main booking: ${p.booking.mainUrl}
- ${p.booking.directBenefits} with direct booking
- Also available on ${p.booking.platforms.filter(p => p !== 'Direct booking').join(', ')}

## Contact
- Website: ${p.booking.website}
- WhatsApp available for inquiries
`.trim();
}

// Generate property info for voice (Spanish, no special characters)
export function getPropertyInfoVoice(): string {
  const p = PROPERTY_INFO;
  return `
UBICACION:
- Direccion: Paraiso 324, Carilo, Buenos Aires, Argentina
- 5 minutos caminando a la playa
- En el bosque de pinos
- Carilo es el destino de playa mas exclusivo de Argentina

PROPIEDAD:
- Villa tecnologica moderna para trabajadores remotos y emprendedores
- 4 suites privadas, cada una con bano, cocina y lavarropas
- Capacidad base: 2 personas por suite (8 total)
- Capacidad maxima: 16 personas

HABITACIONES:
Tenemos 4 suites, cada una con entrada privada, bano, cocina y lavarropas:
${p.suites.map(s => `- ${s.name}: ${s.floor === 'Ground floor' ? 'planta baja' : s.floor === 'Second floor' ? 'primer piso' : 'ultimo piso'}, ${s.highlight.toLowerCase()}, cama ${s.bedType === 'Queen' ? 'queen' : 'individuales'}`).join('\n')}

CAPACIDAD EXTRA:
- Cada habitacion tiene un sofa cama de ${p.extraCapacity.sofaBed.lengthCm} centimetros de largo para ${p.extraCapacity.sofaBed.capacityPerRoom} personas adicionales
- Tambien tenemos ${p.extraCapacity.foldingBeds.count} camas plegables disponibles para ${p.extraCapacity.foldingBeds.totalCapacity} personas mas
- Capacidad total: hasta ${p.overview.maxCapacity} personas
- Cargo extra: ${p.extraCapacity.extraGuestFee.amountUsd} dolares por noche por persona adicional (mas de 2 por habitacion)

NUNCA inventes tipos de habitaciones. Solo menciona estas cuatro: Giardino, Terrazzo, Paraiso, Penthouse.
`.trim();
}

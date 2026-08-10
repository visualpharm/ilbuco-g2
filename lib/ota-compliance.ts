/**
 * OTA (Airbnb/Booking.com) message compliance scanner.
 *
 * Both platforms prohibit using their messaging to solicit direct/off-platform
 * bookings. This module scans message content and flags or blocks policy-
 * violating sends BEFORE they go out.
 *
 * Airbnb Off-Platform Policy (Art. 2799) prohibits:
 *   - Offering discounts to book off Airbnb
 *   - Soliciting contact info (email, phone) via the message thread
 *   - Encouraging repeat bookings off-platform
 *   - Including external URLs that bypass the platform
 *
 * Booking.com:
 *   - All communication must stay on-platform
 *   - Emails are masked (@guest.booking.com aliases)
 *   - No circumvention of commission
 */

export interface ComplianceViolation {
  type: 'direct_booking' | 'contact_info' | 'external_url' | 'discount_offplatform' | 'repeat_offplatform';
  severity: 'block' | 'warn';
  message: string;
  matchedText?: string;
}

export interface ComplianceResult {
  compliant: boolean;
  violations: ComplianceViolation[];
}

// Patterns that indicate direct-booking solicitation
const DIRECT_BOOKING_PATTERNS: RegExp[] = [
  /book\.ilbuco\.com\.ar/i,
  /ilbuco\.com\.ar\/reserv/i,
  /reserv[ao]\s+(direct|directamente)/i,
  /reserva\s+directa/i,
  /booking\s+direct/i,
  /direct(?:ly)?\s+(?:with|from)\s+us/i,
  /fuera\s+de\s+(?:airbnb|booking)/i,
  /off\s+(?:airbnb|platform)/i,
  /whatsapp\s+(?:us|me|para)/i,
  /mensaje\s+(?:de\s+)?whatsapp/i,
  /contactame/i,
  /contactanos/i,
  /escr[ií]benos/i,
  /llam[ao]nos/i,
];

// Patterns for phone numbers and emails
const PHONE_PATTERN = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g;
const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

// External URLs (not Airbnb/Booking)
const EXTERNAL_URL_PATTERN = /https?:\/\/(?!www\.airbnb\.com|www\.booking\.com|airbnb\.com|booking\.com)[^\s]+/gi;

// Discount/promo codes that imply direct booking
const DISCOUNT_CODE_PATTERN = /(?:c[oó]digo|code|promo)[\s:]+[A-Z0-9]{3,}/i;
const DISCOUNT_PERCENT_PATTERN = /\d{1,2}\s*%\s*off/i;
const VOLVER_PATTERN = /VOLVER\d*/i;

/**
 * Scan a rendered message for OTA policy violations.
 * Use this BEFORE sending to Airbnb/Booking.com.
 */
export function scanOtaCompliance(message: string): ComplianceResult {
  const violations: ComplianceViolation[] = [];

  // 1. Direct booking solicitation (BLOCK)
  for (const pattern of DIRECT_BOOKING_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      violations.push({
        type: 'direct_booking',
        severity: 'block',
        message: `Contenido de reserva directa detectado: "${match[0]}"`,
        matchedText: match[0],
      });
    }
  }

  // 2. Discount codes / off-platform discounts (BLOCK)
  if (DISCOUNT_CODE_PATTERN.test(message) || VOLVER_PATTERN.test(message)) {
    violations.push({
      type: 'discount_offplatform',
      severity: 'block',
      message: 'Código de descuento detectado — no se puede enviar por OTA',
    });
  }
  if (DISCOUNT_PERCENT_PATTERN.test(message)) {
    violations.push({
      type: 'discount_offplatform',
      severity: 'block',
      message: 'Descuento porcentual detectado — puede violar política OTA',
    });
  }

  // 3. External URLs that aren't Airbnb/Booking (BLOCK)
  const urls = message.match(EXTERNAL_URL_PATTERN);
  if (urls) {
    violations.push({
      type: 'external_url',
      severity: 'block',
      message: `URL externa detectada: "${urls[0]}" — Airbnb puede bloquearla`,
      matchedText: urls[0],
    });
  }

  // 4. Phone numbers (WARN — Airbnb masks these anyway)
  const phones = message.match(PHONE_PATTERN);
  if (phones) {
    // Filter out very short matches (false positives)
    const realPhones = phones.filter(p => p.replace(/[^\d]/g, '').length >= 8);
    if (realPhones.length > 0) {
      violations.push({
        type: 'contact_info',
        severity: 'warn',
        message: `Número de teléfono detectado — Airbnb lo puede enmascarar`,
        matchedText: realPhones[0],
      });
    }
  }

  // 5. Email addresses (WARN)
  const emails = message.match(EMAIL_PATTERN);
  if (emails) {
    violations.push({
      type: 'contact_info',
      severity: 'warn',
      message: `Email detectado — Booking.com lo enmascara automáticamente`,
      matchedText: emails[0],
    });
  }

  // 6. Repeat-booking off-platform language (BLOCK)
  if (/volver\s+(?:a\s+)?(?:reserv|book)/i.test(message) && /direct/i.test(message)) {
    violations.push({
      type: 'repeat_offplatform',
      severity: 'block',
      message: 'Se sugiere reservar directamente — viola política OTA',
    });
  }

  const hasBlock = violations.some(v => v.severity === 'block');
  return {
    compliant: !hasBlock,
    violations,
  };
}

/**
 * Check if a template is OTA-safe (before rendering).
 * Scans the template text for policy-violating patterns.
 * Note: this is a heuristic — also scan the RENDERED message before sending.
 */
export function isTemplateOtaSafe(template: string): boolean {
  return scanOtaCompliance(template).compliant;
}

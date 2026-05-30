// Chat assistant prompt configuration for Il Buco
// Re-exports from modular files for backward compatibility

export {
  LISTINGS,
  CARILO_CITY_ID,
  ROOM_BOOKING_IDS,
  buildRoomBookingLink,
  buildBookingDeepLink,
  getPropertyInfoText as PROPERTY_INFO_GETTER,
} from './knowledge-base';

export {
  LANGUAGE_INSTRUCTIONS,
  buildChatSystemPrompt as buildSystemPrompt,
} from './chat-config';

// For backward compatibility, also export PROPERTY_INFO as a string
import { getPropertyInfoText } from './knowledge-base';
export const PROPERTY_INFO = getPropertyInfoText();

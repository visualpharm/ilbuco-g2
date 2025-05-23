# Translation Guide for IL BUCO Website

This guide explains how to implement translations across the IL BUCO website to support both English and Argentinian Spanish.

## Translation System Overview

The website uses a simple translation system with the following components:

1. **Translate Component**: A React component that displays text in the user's selected language
2. **Translation Files**: Organized collections of translations for different parts of the website
3. **Language Context**: Manages the current language state and provides it to components
4. **Language Selector**: Allows users to switch between languages

## How to Add Translations

### 1. Create Translation Objects

Create translation objects in the appropriate translation file:

\`\`\`typescript
// Example from translations/common.ts
export const translations = {
  welcomeMessage: {
    en: "Welcome to IL BUCO",
    es: "Bienvenido a IL BUCO",
  },
  // More translations...
}
\`\`\`

### 2. Use the Translate Component

Wrap text content with the Translate component:

\`\`\`jsx
import { Translate } from "@/components/translate"
import { translations } from "@/translations/common"

function MyComponent() {
  return (
    <div>
      <h1>
        <Translate text={translations.welcomeMessage} />
      </h1>
    </div>
  )
}
\`\`\`

### 3. Organizing Translations

- Group related translations in logical sections
- Use nested objects for better organization
- Keep translation keys descriptive

## Translation Files Structure

- `translations/common.ts`: Common UI elements, navigation, footer
- `translations/home.ts`: Homepage-specific content
- `translations/rooms.ts`: Room-related content
- `translations/location.ts`: Location page content
- `translations/places-nearby.ts`: Places nearby content
- `translations/contact.ts`: Contact page content

## Dynamic Content

For content with variables:

\`\`\`typescript
// In translation file
buttonText: {
  en: "Download {fileName}",
  es: "Descargar {fileName}",
}

// In component
const translatedText = {
  en: translations.buttonText.en.replace("{fileName}", file.name),
  es: translations.buttonText.es.replace("{fileName}", file.name),
}

return <Translate text={translatedText} />
\`\`\`

## Best Practices

1. **Be Consistent**: Use the same translation keys across similar components
2. **Keep Translations Close**: Group translations with the components that use them
3. **Use Descriptive Keys**: Make translation keys descriptive of their content
4. **Consider Context**: Some phrases may translate differently based on context
5. **Test Both Languages**: Always test the site in both languages after making changes

## Argentinian Spanish Specifics

When translating to Spanish, use Argentinian Spanish conventions:

- Use "vos" instead of "tú" for the second person singular
- Use Argentinian expressions and vocabulary where appropriate
- Consider local terminology for accommodations and tourism

Example:
- English: "Book your stay"
- Argentinian Spanish: "Reservá tu estadía" (using "vos" form)

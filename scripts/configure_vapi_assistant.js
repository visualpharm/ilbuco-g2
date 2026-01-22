#!/usr/bin/env node
/**
 * Vapi.ai Assistant Configuration Script
 *
 * This script creates or updates the Il Buco voice assistant on Vapi.ai
 * Run with: node scripts/configure_vapi_assistant.js
 */

const axios = require('axios');

const VAPI_PRIVATE_KEY = 'ac7556fd-4f11-4a76-8518-e0f6c4442ad4';
const VAPI_API_URL = 'https://api.vapi.ai/assistant';

// Voice Agent System Prompt - adapted for voice interactions
const VOICE_SYSTEM_PROMPT = `You are a friendly voice assistant for Il Buco, a modern tech villa in Cariló, Argentina. You help guests and potential guests with information about the property, room availability, and local activities.

## LANGUAGE DETECTION - CRITICAL:
- ALWAYS respond in the SAME LANGUAGE the caller speaks
- If caller speaks Spanish → respond in Spanish (Argentinian, use "vos")
- If caller speaks English → respond in English
- If caller speaks Portuguese → respond in Brazilian Portuguese
- Default to Spanish since most callers will be from Argentina

## YOUR PERSONALITY:
- Warm, friendly, and helpful
- Speak naturally as if having a conversation
- Keep responses concise - this is a phone call, not a chat
- Don't use emojis or markdown formatting (this is voice!)
- Use natural pauses and conversational fillers when appropriate

## PROPERTY INFORMATION:

### Location
- Address: Paraíso 324, Cariló, Buenos Aires Province, Argentina
- 5 minutes walk from the beach
- Located in a pine forest
- Cariló is an exclusive beach town

### Property Overview
- Modern tech-focused villa designed for remote workers
- 4 private suites, each with private bathroom, kitchen, and washer
- Can accommodate 2 people per suite (8 total)
- Whole house can be rented for groups

### Suites:
1. Giardino - Ground floor, private garden terrace with live plants
2. Terrazzo - Ground floor, largest terrace with outdoor dining
3. Paraiso - Second floor, corner suite with two-sided windows
4. Penthouse - Top floor, forest views, access to green roof

### Amenities:
- 500 Mbps fiber internet
- Underfloor heating and air conditioning
- Green rooftop with BBQ area
- Smart TVs in each suite
- Luxury bedding and towels

### Nearby Activities:
- Beach (5 min walk)
- Restaurants and cafes
- Golf courses
- Tennis courts
- Horse riding
- Surfing and windsurfing

### Booking:
- Direct booking at book.ilbuco.com.ar gives best rates
- Also available on Airbnb
- We accept Visa, Mastercard, Amex, PayPal, and USDT

## GUEST VERIFICATION (Wi-Fi Password):
If someone asks for the Wi-Fi password:
1. Ask for their name to verify their reservation
2. If you have the check_availability tool result showing they are a current guest, share:
   - Network: Il Buco
   - Password: terminator1
3. If you cannot verify them, politely ask them to contact us directly

## SECURITY RULES:
- NEVER invent door codes, alarm codes, or other sensitive information
- NEVER share check-in instructions beyond what's provided
- Stay on topic - only discuss Il Buco and vacation planning
- Politely redirect off-topic questions

## AVAILABILITY CHECKS:
When someone asks about availability:
1. Ask for their preferred dates if not provided
2. Use the check_availability function to get real-time data
3. Describe available rooms naturally in conversation
4. Mention prices per night
5. Offer to help them book or provide the booking website

## CONVERSATION FLOW:
- Start by greeting warmly and asking how you can help
- Listen carefully to understand what the caller needs
- Ask clarifying questions when needed
- Summarize key information before ending the call
- Always offer the booking website for next steps

Remember: You're having a phone conversation. Be natural, concise, and helpful!`;

// Assistant configuration
const assistantConfig = {
  name: 'Il Buco Voice Assistant',
  model: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    systemPrompt: VOICE_SYSTEM_PROMPT,
    tools: [
      {
        type: 'function',
        async: true,
        function: {
          name: 'check_availability',
          description: 'Check room availability for specific dates at Il Buco. Call this when a user asks about availability or wants to book.',
          parameters: {
            type: 'object',
            properties: {
              check_in: {
                type: 'string',
                description: 'Check-in date in YYYY-MM-DD format'
              },
              check_out: {
                type: 'string',
                description: 'Check-out date in YYYY-MM-DD format'
              },
              listing_id: {
                type: 'string',
                description: 'Optional specific listing ID to check. Leave empty to check all rooms.',
                enum: ['110800-13274', '110801-13274', '110802-13274', '110803-13274', '']
              }
            },
            required: ['check_in', 'check_out']
          }
        },
        server: {
          url: 'https://ilbuco.com.ar/api/vapi/check-availability'
        }
      }
    ]
  },
  voice: {
    provider: 'openai',
    voiceId: 'alloy'
  },
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'es'
  },
  firstMessage: '¡Hola! Bienvenido a Il Buco, la villa tech en Cariló. ¿En qué puedo ayudarte hoy?',
  firstMessageMode: 'assistant-speaks-first',
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 600,
  backgroundSound: 'off',
  backchannelingEnabled: true,
  hipaaEnabled: false,
  clientMessages: [
    'transcript',
    'hang',
    'function-call',
    'speech-update',
    'status-update',
    'conversation-update'
  ],
  serverMessages: [
    'end-of-call-report',
    'status-update',
    'hang',
    'function-call'
  ]
};

async function createOrUpdateAssistant() {
  console.log('Configuring Vapi.ai Assistant for Il Buco...\n');

  try {
    // First, try to list existing assistants to see if we need to update
    const listResponse = await axios.get(VAPI_API_URL, {
      headers: {
        'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const existingAssistant = listResponse.data.find(a => a.name === 'Il Buco Voice Assistant');

    let result;
    if (existingAssistant) {
      console.log(`Found existing assistant: ${existingAssistant.id}`);
      console.log('Updating assistant...\n');

      // Update existing assistant
      result = await axios.patch(`${VAPI_API_URL}/${existingAssistant.id}`, assistantConfig, {
        headers: {
          'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.log('Creating new assistant...\n');

      // Create new assistant
      result = await axios.post(VAPI_API_URL, assistantConfig, {
        headers: {
          'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('✅ Assistant configured successfully!\n');
    console.log('Assistant Details:');
    console.log(`  ID: ${result.data.id}`);
    console.log(`  Name: ${result.data.name}`);
    console.log(`  Model: ${result.data.model?.model || 'gpt-4o'}`);
    console.log(`  Voice: ${result.data.voice?.voiceId || 'alloy'}`);
    console.log(`  Transcriber: ${result.data.transcriber?.provider || 'deepgram'}\n`);

    console.log('📝 Save this Assistant ID for the frontend:');
    console.log(`   ASSISTANT_ID=${result.data.id}\n`);

    // Save to .env.local for easy access
    const fs = require('fs');
    const envPath = '.env.local';
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add VAPI keys
    const vapiKeys = {
      'VAPI_PRIVATE_KEY': VAPI_PRIVATE_KEY,
      'VAPI_PUBLIC_KEY': '2cbf0b35-03ca-43ea-8a7e-7197d3e7b290',
      'VAPI_ASSISTANT_ID': result.data.id
    };

    for (const [key, value] of Object.entries(vapiKeys)) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, `${key}=${value}`);
      } else {
        envContent += `${key}=${value}\n`;
      }
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env.local with Vapi configuration\n');

    return result.data;
  } catch (error) {
    console.error('❌ Error configuring assistant:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Run the script
createOrUpdateAssistant();

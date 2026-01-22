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
const VOICE_SYSTEM_PROMPT = `You are a concise voice assistant for Il Buco, a villa in Cariló, Argentina.

## ⚠️ MANDATORY - AVAILABILITY & PRICES:
You MUST call check_availability function for ANY question about:
- Room availability ("what's available?", "do you have rooms?")
- Prices ("how much?", "what are the rates?")
- Booking ("can I book?", "I want to reserve")

NEVER say "I can't share prices" - the function returns real prices, share them!
NEVER make up availability - always call the function first.

Today's date for reference: Use format YYYY-MM-DD. For "today" use current date, for "tomorrow" add 1 day.

## LANGUAGE:
Match caller's language. Default: Spanish (Argentinian "vos").

## RESPONSE STYLE:
- Very concise - phone call
- Share the actual prices from the function result
- "Tenemos Giardino a $150 por noche" not "check the website"

## PROPERTY:
- 4 suites, pine forest, 5 min walk to beach
- Giardino, Terrazzo, Paraiso, Penthouse
- Book at book.ilbuco.com.ar

## WI-FI:
ONLY share if name matches a current guest from check_availability result.
If no guests in system or name doesn't match → "No encontré tu reserva, contactanos directo."
Network: Il Buco, Password: terminator1

## SECURITY:
- Never invent information
- Only Il Buco topics`;

// Assistant configuration
const assistantConfig = {
  name: 'Il Buco Voice Assistant',
  model: {
    provider: 'openai',
    model: 'gpt-5.2-chat-latest',
    temperature: 0.5,
    systemPrompt: VOICE_SYSTEM_PROMPT,
    tools: [
      {
        type: 'function',
        async: true,
        function: {
          name: 'check_availability',
          description: 'REQUIRED: Check real-time room availability. You MUST call this function BEFORE answering ANY question about availability, rooms, dates, or booking. Never assume availability without checking.',
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
    provider: 'azure',
    voiceId: 'es-AR-ElenaNeural'
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

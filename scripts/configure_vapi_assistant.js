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
const VOICE_SYSTEM_PROMPT = `Sos un asistente de voz para Il Buco, una villa en Cariló, Argentina.

REGLAS CRÍTICAS PARA VOZ:
- NUNCA uses emojis, símbolos, ni caracteres especiales
- NUNCA uses formato como barras para fechas. Decí "veintidós de enero" no "22/01"
- NUNCA inventes disponibilidad. SIEMPRE llamá a check_availability primero
- Hablá naturalmente, como en una conversación telefónica
- Sé breve y directo

DISPONIBILIDAD:
Cuando pregunten por habitaciones o disponibilidad:
1. Llamá a check_availability con la fecha (formato YYYY-MM-DD)
2. Si la función dice que está todo reservado, decí "Lamentablemente para esa fecha está todo ocupado"
3. Si hay habitaciones, mencioná cuáles y el precio

PROPIEDAD:
- 4 suites en el bosque de pinos, a 5 minutos de la playa
- Giardino, Terrazzo, Paraíso, Penthouse
- Reservas en buc ilbuco punto com punto ar

WIFI (solo huéspedes verificados):
Pedí el nombre, verificá con check_availability. Si coincide: Red Il Buco, clave terminator uno.
Si no coincide: "No encontré tu reserva, contactanos por WhatsApp."

SEGURIDAD:
- Nunca inventes información
- Solo temas de Il Buco`;

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
    provider: '11labs',
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    model: 'eleven_multilingual_v2'
  },
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'es'
  },
  firstMessage: 'Hola, bienvenido a Il Buco. Soy el asistente virtual. En qué te puedo ayudar?',
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

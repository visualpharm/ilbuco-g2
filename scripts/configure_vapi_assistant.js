#!/usr/bin/env node
/**
 * Vapi.ai Assistant Configuration Script
 *
 * This script creates or updates the Il Buco voice assistant on Vapi.ai
 * Run with: node scripts/configure_vapi_assistant.js
 */

const axios = require('axios');

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY || 'ac7556fd-4f11-4a76-8518-e0f6c4442ad4';
const VAPI_API_URL = 'https://api.vapi.ai/assistant';
const VAPI_SERVER_URL = process.env.VAPI_SERVER_URL || 'https://spider-annotation-sen-louise.trycloudflare.com/api/vapi/server';

// Voice Agent System Prompt - adapted for voice interactions
const VOICE_SYSTEM_PROMPT = `Sos un asistente de voz para Il Buco, una villa en Cariló, Argentina.

REGLAS CRÍTICAS:
- NUNCA uses emojis, símbolos, ni caracteres especiales
- NUNCA uses barras ni formatos numéricos para fechas. Decí "veintidós de enero" en vez de "22/01"
- SIEMPRE usá los resultados de check_availability tal cual te llegan. No inventes datos.
- Sé breve y natural, como en una llamada telefónica
- Cuando el usuario pida disponibilidad, esperá el resultado de check_availability y repetilo

CUANDO TE PREGUNTEN DISPONIBILIDAD:
1. Llamá a check_availability con check_in y check_out en formato año mes día
2. El resultado ya viene formateado para voz. Repetí la información tal cual
3. Si el resultado dice que está todo ocupado, preguntá por otras fechas

PARA HOY:
Si preguntan "para hoy" o "esta noche", usá la fecha de hoy como check_in y mañana como check_out

PRECIOS:
Los precios son en dólares por noche. Mencioná el precio que devuelve la función.

RESERVAS:
Para reservar, dirigilos a buc ilbuco punto com punto ar

WIFI:
Solo para huéspedes. Pedí el nombre primero. Si coincide con una reserva activa: red Il Buco, clave terminator uno.

TEMAS:
Solo hablamos de Il Buco, las habitaciones, Cariló, y temas relacionados con la estadía.

NEGOCIOS LOCALES:
Si preguntan por carnicerías, restaurantes, supermercados u otros negocios:
- No inventes nombres ni direcciones
- Decí que no tenés esa información en este momento
- Sugeriles visitar ilbuco punto com punto ar barra places nearby donde tenemos una guía con recomendaciones

HABITACIONES:
Tenemos 4 suites, cada una con entrada privada, baño, cocina y lavarropas:
- Giardino: planta baja, jardín privado con plantas, cama queen
- Terrazzo: planta baja, la terraza más grande con comedor exterior, cama queen
- Paraiso: primer piso, suite esquinera con ventanas en dos lados, dos camas individuales
- Penthouse: último piso, vistas al bosque, acceso a terraza verde, cama queen

NUNCA inventes tipos de habitaciones. Solo mencioná estas cuatro: Giardino, Terrazzo, Paraiso, Penthouse.`;

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
        server: {
          url: VAPI_SERVER_URL
        },
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
  firstMessage: 'Hola, soy el asistente virtual de Il Buco. Me podés preguntar por disponibilidad, precios, wifi, o cosas sobre Cariló. ¿En qué te puedo ayudar?',
  firstMessageMode: 'assistant-speaks-first',
  serverUrl: VAPI_SERVER_URL,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 600,
  backgroundSound: 'off',
  backchannelingEnabled: true,
  hipaaEnabled: false,
  clientMessages: [
    'transcript',
    'hang',
    'tool-calls',
    'speech-update',
    'status-update',
    'conversation-update'
  ],
  serverMessages: [
    'end-of-call-report',
    'status-update',
    'hang',
    'tool-calls'
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

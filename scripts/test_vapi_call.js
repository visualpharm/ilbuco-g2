#!/usr/bin/env node
/**
 * Test Vapi Voice Assistant
 *
 * This script initiates a test call to verify the function call webhook works.
 * It monitors the call logs to see if availability data is returned correctly.
 */

const VAPI_PRIVATE_KEY = 'ac7556fd-4f11-4a76-8518-e0f6c4442ad4';
const ASSISTANT_ID = '20b94c7f-c293-4c22-9d1a-2a9a2fcd22a2';

async function getRecentCalls() {
  const response = await fetch('https://api.vapi.ai/call?limit=5', {
    headers: {
      'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get calls: ${response.status}`);
  }

  return response.json();
}

async function getCallDetails(callId) {
  const response = await fetch(`https://api.vapi.ai/call/${callId}`, {
    headers: {
      'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get call details: ${response.status}`);
  }

  return response.json();
}

async function main() {
  console.log('Fetching recent Vapi calls...\n');

  const calls = await getRecentCalls();

  if (calls.length === 0) {
    console.log('No recent calls found.');
    return;
  }

  console.log(`Found ${calls.length} recent calls:\n`);

  for (const call of calls) {
    console.log(`Call ID: ${call.id}`);
    console.log(`  Status: ${call.status}`);
    console.log(`  Started: ${call.startedAt || 'N/A'}`);
    console.log(`  Duration: ${call.endedReason || 'In progress'}`);
    console.log(`  Assistant: ${call.assistantId}`);

    // Get detailed call info including tool calls
    try {
      const details = await getCallDetails(call.id);

      if (details.artifact?.messages) {
        const toolCalls = details.artifact.messages.filter(m =>
          m.role === 'tool_calls' || m.toolCalls || m.message?.includes('check_availability')
        );

        if (toolCalls.length > 0) {
          console.log(`  Tool calls found: ${toolCalls.length}`);
          for (const tc of toolCalls) {
            console.log(`    - ${JSON.stringify(tc).substring(0, 200)}...`);
          }
        }

        // Look for tool results
        const toolResults = details.artifact.messages.filter(m =>
          m.role === 'tool_call_result' || m.result || (m.message && m.message.includes('disponible'))
        );

        if (toolResults.length > 0) {
          console.log(`  Tool results found: ${toolResults.length}`);
          for (const tr of toolResults) {
            const resultStr = JSON.stringify(tr);
            if (resultStr.includes('No result returned')) {
              console.log(`    ❌ NO RESULT RETURNED`);
            } else if (resultStr.includes('disponible') || resultStr.includes('ocupada')) {
              console.log(`    ✅ Availability data received`);
            }
            console.log(`    - ${resultStr.substring(0, 300)}...`);
          }
        }
      }

      // Check for transcript
      if (details.artifact?.transcript) {
        const transcript = details.artifact.transcript;
        console.log(`  Transcript preview: ${transcript.substring(0, 200)}...`);

        if (transcript.includes('No result returned')) {
          console.log(`  ⚠️  Transcript contains "No result returned"`);
        }
        if (transcript.includes('disponible') || transcript.includes('Giardino') ||
            transcript.includes('Terrazzo') || transcript.includes('Paraiso') ||
            transcript.includes('Penthouse')) {
          console.log(`  ✅ Transcript mentions actual room names`);
        }
      }
    } catch (e) {
      console.log(`  Could not get details: ${e.message}`);
    }

    console.log('');
  }
}

main().catch(console.error);

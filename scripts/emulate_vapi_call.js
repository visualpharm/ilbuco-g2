#!/usr/bin/env node
/**
 * Emulate Vapi Voice Call
 *
 * This script simulates the exact webhook calls Vapi makes during a voice call,
 * allowing you to test the function call flow without making an actual voice call.
 */

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://spider-annotation-sen-louise.trycloudflare.com/api/vapi/server';
const LOCAL_URL = 'http://localhost:3000/api/vapi/server';

// Test configuration
const TEST_DATES = {
  check_in: '2026-02-10',
  check_out: '2026-02-12'
};

// Generate a unique call ID like Vapi does
function generateCallId() {
  return `test-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateToolCallId() {
  return `call_${Math.random().toString(36).substr(2, 24)}`;
}

// Simulate Vapi's tool-calls webhook message (CURRENT FORMAT)
function createToolCallsMessage(callId, toolCallId, checkIn, checkOut, argumentsAsObject = false) {
  const argsPayload = {
    check_in: checkIn,
    check_out: checkOut,
    listing_id: ''
  };

  return {
    message: {
      type: 'tool-calls',
      call: {
        id: callId,
        orgId: 'test-org',
        createdAt: new Date().toISOString(),
        status: 'in-progress',
        assistantId: '20b94c7f-c293-4c22-9d1a-2a9a2fcd22a2'
      },
      toolCallList: [
        {
          id: toolCallId,
          type: 'function',
          function: {
            name: 'check_availability',
            arguments: argumentsAsObject ? argsPayload : JSON.stringify(argsPayload)
          }
        }
      ]
    }
  };
}

// Legacy function-call format
function createFunctionCallMessage(callId, toolCallId, checkIn, checkOut) {
  return {
    message: {
      type: 'function-call',
      call: {
        id: callId,
        orgId: 'test-org',
        createdAt: new Date().toISOString(),
        status: 'in-progress',
        assistantId: '20b94c7f-c293-4c22-9d1a-2a9a2fcd22a2'
      },
      functionCall: {
        id: toolCallId,
        name: 'check_availability',
        parameters: {
          check_in: checkIn,
          check_out: checkOut,
          listing_id: ''
        }
      }
    }
  };
}

// Alternative with toolWithToolCallList format
function createToolWithToolCallListMessage(callId, toolCallId, checkIn, checkOut, argumentsAsObject = false) {
  const argsPayload = {
    check_in: checkIn,
    check_out: checkOut,
    listing_id: ''
  };

  return {
    message: {
      type: 'tool-calls',
      call: {
        id: callId,
        orgId: 'test-org',
        createdAt: new Date().toISOString(),
        status: 'in-progress',
        assistantId: '20b94c7f-c293-4c22-9d1a-2a9a2fcd22a2'
      },
      toolWithToolCallList: [
        {
          tool: { type: 'function', name: 'check_availability' },
          toolCall: {
            id: toolCallId,
            type: 'function',
            function: {
              name: 'check_availability',
              arguments: argumentsAsObject ? argsPayload : JSON.stringify(argsPayload)
            }
          }
        }
      ]
    }
  };
}

async function testWebhook(url, message, testName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${testName}`);
  console.log(`URL: ${url}`);
  console.log(`${'='.repeat(60)}`);

  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    const elapsed = Date.now() - startTime;
    const data = await response.json();

    console.log(`\nResponse Status: ${response.status}`);
    console.log(`Response Time: ${elapsed}ms`);
    console.log(`\nResponse Body:`);
    console.log(JSON.stringify(data, null, 2));

    // Validate response format
    console.log(`\n--- Validation ---`);

    if (response.status !== 200) {
      console.log(`❌ FAIL: Expected HTTP 200, got ${response.status}`);
      return false;
    }
    console.log(`✅ HTTP Status: 200`);

    if (!data.results || !Array.isArray(data.results)) {
      console.log(`❌ FAIL: Response missing 'results' array`);
      return false;
    }
    console.log(`✅ Has 'results' array`);

    const result = data.results[0];
    if (!result) {
      console.log(`❌ FAIL: Results array is empty`);
      return false;
    }

    if (!result.toolCallId) {
      console.log(`❌ FAIL: Missing 'toolCallId' in result`);
      return false;
    }
    console.log(`✅ Has 'toolCallId': ${result.toolCallId}`);

    if (typeof result.result !== 'string') {
      console.log(`❌ FAIL: 'result' is not a string (got ${typeof result.result})`);
      return false;
    }
    console.log(`✅ 'result' is a string`);

    if (result.result.includes('\n')) {
      console.log(`⚠️  WARNING: Result contains newlines (may cause Vapi parsing issues)`);
    } else {
      console.log(`✅ No newlines in result`);
    }

    // Check for actual availability data
    if (result.result.includes('disponible') || result.result.includes('ocupada')) {
      console.log(`✅ Result contains availability data`);
    } else if (result.result.includes('Necesito las fechas')) {
      console.log(`⚠️  Result is asking for dates (missing parameters?)`);
    } else {
      console.log(`⚠️  Result doesn't contain expected availability keywords`);
    }

    // Check response time
    if (elapsed < 3000) {
      console.log(`✅ Response time OK (${elapsed}ms < 3000ms)`);
    } else {
      console.log(`⚠️  WARNING: Response time slow (${elapsed}ms) - may timeout in Vapi`);
    }

    console.log(`\n✅ TEST PASSED: ${testName}`);
    return true;

  } catch (error) {
    console.log(`\n❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🎯 Vapi Webhook Emulation Test Suite');
  console.log('=====================================\n');

  const callId = generateCallId();
  const toolCallId = generateToolCallId();

  console.log(`Call ID: ${callId}`);
  console.log(`Tool Call ID: ${toolCallId}`);
  console.log(`Test Dates: ${TEST_DATES.check_in} to ${TEST_DATES.check_out}`);

  const results = [];

  // Test 1: NEW tool-calls format with toolCallList (CURRENT VAPI FORMAT)
  const msg1 = createToolCallsMessage(callId, toolCallId, TEST_DATES.check_in, TEST_DATES.check_out);
  results.push(await testWebhook(LOCAL_URL, msg1, 'Local - tool-calls with toolCallList (CURRENT)'));

  // Test 2: tool-calls with arguments as object
  const msg2 = createToolCallsMessage(generateCallId(), generateToolCallId(), TEST_DATES.check_in, TEST_DATES.check_out, true);
  results.push(await testWebhook(LOCAL_URL, msg2, 'Local - tool-calls with arguments as object'));

  // Test 3: tool-calls format with toolWithToolCallList
  const msg3 = createToolWithToolCallListMessage(generateCallId(), generateToolCallId(), TEST_DATES.check_in, TEST_DATES.check_out);
  results.push(await testWebhook(LOCAL_URL, msg3, 'Local - tool-calls with toolWithToolCallList'));

  // Test 4: Legacy function-call format (backwards compat)
  const msg4 = createFunctionCallMessage(generateCallId(), generateToolCallId(), TEST_DATES.check_in, TEST_DATES.check_out);
  results.push(await testWebhook(LOCAL_URL, msg4, 'Local - Legacy function-call format'));

  // Test 5: Cloudflared tunnel with tool-calls format
  const msg5 = createToolCallsMessage(generateCallId(), generateToolCallId(), TEST_DATES.check_in, TEST_DATES.check_out);
  results.push(await testWebhook(WEBHOOK_URL, msg5, 'Cloudflared - tool-calls (CURRENT)'));

  // Test 6: Cloudflared tunnel with arguments as object
  const msg6 = createToolCallsMessage(generateCallId(), generateToolCallId(), TEST_DATES.check_in, TEST_DATES.check_out, true);
  results.push(await testWebhook(WEBHOOK_URL, msg6, 'Cloudflared - tool-calls with arguments as object'));

  // Test 7: Different dates (today/tomorrow)
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const msg7 = createToolCallsMessage(generateCallId(), generateToolCallId(), today, tomorrow);
  results.push(await testWebhook(LOCAL_URL, msg7, `Today's availability (${today} to ${tomorrow})`));

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('TEST SUMMARY');
  console.log(`${'='.repeat(60)}`);

  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  console.log(`\nPassed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);

  if (failed === 0) {
    console.log(`\n✅ All tests passed! The webhook is working correctly.`);
    console.log(`\nNext step: Make a voice call to verify Vapi routes function calls to the webhook.`);
  } else {
    console.log(`\n❌ Some tests failed. Check the errors above.`);
  }
}

// Run tests
runAllTests().catch(console.error);

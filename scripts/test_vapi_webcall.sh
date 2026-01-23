#!/bin/bash
curl -s -X POST "https://api.vapi.ai/call" \
  -H "Authorization: Bearer ac7556fd-4f11-4a76-8518-e0f6c4442ad4" \
  -H "Content-Type: application/json" \
  -d '{"assistantId": "20b94c7f-c293-4c22-9d1a-2a9a2fcd22a2", "type": "webCall"}' | jq .

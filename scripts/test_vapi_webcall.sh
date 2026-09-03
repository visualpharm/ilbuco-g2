#!/bin/bash
if [ -z "$VAPI_PRIVATE_KEY" ]; then
  echo "Error: VAPI_PRIVATE_KEY is not set. Export it or source .env.local first." >&2
  exit 1
fi
curl -s -X POST "https://api.vapi.ai/call" \
  -H "Authorization: Bearer ${VAPI_PRIVATE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"assistantId": "20b94c7f-c293-4c22-9d1a-2a9a2fcd22a2", "type": "webCall"}' | jq .

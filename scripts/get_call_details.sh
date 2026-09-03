#!/bin/bash
if [ -z "$VAPI_PRIVATE_KEY" ]; then
  echo "Error: VAPI_PRIVATE_KEY is not set. Export it or source .env.local first." >&2
  exit 1
fi
CALL_ID="${1:-019be708-5fa1-799d-92f7-f5eebf43d2d2}"
curl -s "https://api.vapi.ai/call/${CALL_ID}" \
  -H "Authorization: Bearer ${VAPI_PRIVATE_KEY}" | jq '.artifact.messages'

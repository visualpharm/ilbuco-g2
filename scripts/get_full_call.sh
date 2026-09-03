#!/bin/bash
if [ -z "$VAPI_PRIVATE_KEY" ]; then
  echo "Error: VAPI_PRIVATE_KEY is not set. Export it or source .env.local first." >&2
  exit 1
fi
CALL_ID="${1:-019be71b-67d8-777d-a3c3-2c71affde361}"
curl -s "https://api.vapi.ai/call/${CALL_ID}" \
  -H "Authorization: Bearer ${VAPI_PRIVATE_KEY}"

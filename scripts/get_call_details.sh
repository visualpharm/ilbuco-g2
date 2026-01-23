#!/bin/bash
CALL_ID="${1:-019be708-5fa1-799d-92f7-f5eebf43d2d2}"
curl -s "https://api.vapi.ai/call/${CALL_ID}" \
  -H "Authorization: Bearer ac7556fd-4f11-4a76-8518-e0f6c4442ad4" | jq '.artifact.messages'

#!/bin/bash
CALL_ID="${1:-019be71b-67d8-777d-a3c3-2c71affde361}"
curl -s "https://api.vapi.ai/call/${CALL_ID}" \
  -H "Authorization: Bearer ac7556fd-4f11-4a76-8518-e0f6c4442ad4"

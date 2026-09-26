#!/bin/sh
# Local gate: booking-guard tests, TS unit tests, then the production build Vercel runs.
set -e
cd "$(dirname "$0")/.."
python3 -m unittest discover -s scripts -p 'test_*.py'
npm test
./node_modules/.bin/next build

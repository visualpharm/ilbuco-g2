#!/bin/sh
# Local gate: booking-guard tests, TS unit tests, the 3D tour matches its sources, then the production build Vercel runs.
set -e
cd "$(dirname "$0")/.."
python3 -m unittest discover -s scripts -p 'test_*.py'
npm test
npm run lint
python3 tour3d/build.py --check
./node_modules/.bin/next build

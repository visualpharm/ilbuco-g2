# Testing rules

Moved verbatim from CLAUDE.md: automatic site tests.

## Automatic Testing
Add automatic tests to the repo that run after `npm run build`, covering:

1. Internal and external broken links (using linkinator)
2. Missing images (HTTP 404s on <img> and next/image)
3. Missing alt texts (ESLint jsx-a11y plugin)
4. Translation completeness: all translation objects must have 'es', 'en', 'pt'
5. hreflang and canonical link correctness for all language versions
6. Sitemap must include every static route in all 3 languages
7. Check that internal keyword links are invisible (no underline, no color change)
8. After making a major change (e.g., adding a new page), download this page and the front page. If they return an error, restart the server and try again. If it still fails, start fixing it without waiting for me to respond. 

These tests should run with `npm run test:site`, and optionally run on build via a postbuild script.

/**
 * CLI runner for the pricing engine — dry-run by default, --live to push.
 *
 *   npx ts-node -T --compilerOptions '{"module":"commonjs","moduleResolution":"node"}' \
 *     scripts/pricing-run.ts [--live] [--days 300]
 *
 * Same code path as /api/pricing (lib/run-pricing.ts): prices + min-stay
 * restrictions + whole-house-only inventory + learning.
 */

import { config as dotenv } from 'dotenv';
import { join } from 'path';
dotenv({ path: join(__dirname, '..', '.env.local') });

import { runPricingUpdate } from '../lib/run-pricing';

async function main() {
  const live = process.argv.includes('--live');
  const daysIdx = process.argv.indexOf('--days');
  const daysAhead = daysIdx > -1 ? Number(process.argv[daysIdx + 1]) : 300;

  const report = await runPricingUpdate(!live, daysAhead, 'cli');

  console.log(`Pricing run ${report.dry_run ? 'dry-run' : 'LIVE'}: ${report.start_date} → ${report.end_date} (${report.engine})\n`);
  for (const room of report.rooms) {
    console.log(`── ${room.room}`);
    const byTier = room.by_tier as Record<string, { n: number; avg_new: number; avg_current: number; overridden: number }> | undefined;
    if (byTier) {
      for (const [tier, t] of Object.entries(byTier)) {
        const delta = t.avg_current ? Math.round(((t.avg_new - t.avg_current) / t.avg_current) * 100) : 0;
        console.log(`   ${tier.padEnd(8)} ${String(t.n).padStart(3)}d  $${t.avg_current} → $${t.avg_new} (${delta >= 0 ? '+' : ''}${delta}%)${t.overridden ? `  [${t.overridden} overridden]` : ''}`);
      }
    }
    console.log(`   push: ${JSON.stringify(room.push)}`);
  }
  console.log(`\nrestrictions: ${JSON.stringify(report.restrictions)}`);
  console.log(`inventories: ${JSON.stringify(report.inventories)}`);
  if (report.gate_violations?.length) console.log(`GATES: ${JSON.stringify(report.gate_violations)}`);
  if (report.verify) console.log(`verify: ${report.verify.sampled} sampled, ${report.verify.mismatches.length} mismatches, ${report.verify.crossBlockViolations.length} cross-block violations`);
  if (report.learning_updates.length) {
    console.log(`learning: ${JSON.stringify(report.learning_updates)}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });

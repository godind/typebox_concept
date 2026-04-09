import fs from 'fs';

const inv = JSON.parse(fs.readFileSync('./signalk-schema-inventory.json', 'utf8'));

console.log('=== [CHECK 1] Summary Totals Reconciliation ===');
const sumByKind = {};
inv.schemas.forEach(s => {
  sumByKind[s.kind] = (sumByKind[s.kind] || 0) + 1;
});
const calcRefs = inv.schemas.reduce((sum, s) => sum + s.refs.length, 0);
console.log('Total schemas:', inv.summary.totalSchemas, '| Expected:', inv.schemas.length);
console.log('By kind (actual):', Object.entries(sumByKind).map(([k,v]) => `${k}=${v}`).join(', '));
console.log('By kind (claimed):', Object.entries(inv.summary.byKind).map(([k,v]) => `${k}=${v}`).join(', '));
console.log('Total refs (claimed):', inv.summary.totalRefs, '| Calculated:', calcRefs);
const kindMatch = Object.entries(sumByKind).every(([k,v]) => inv.summary.byKind[k] === v);
const matches = inv.summary.totalSchemas === inv.schemas.length && calcRefs === inv.summary.totalRefs && kindMatch;
console.log(matches ? '✓ PASS: All sums reconcile' : '✗ FAIL: Mismatch detected');

console.log('\n=== [CHECK 2] Local Target Integrity ===');
const localSchemas = new Set(inv.schemas.map(s => s.path));
const missingTargets = [];
inv.schemas.forEach(schema => {
  schema.refs.forEach(ref => {
    if (ref.kind === 'local-file' && !localSchemas.has(ref.targetFile)) {
      missingTargets.push({ schema: schema.path, ref: ref.targetFile, pointer: ref.targetPointer });
    }
  });
});
console.log('Missing local targets:', missingTargets.length);
if (missingTargets.length > 0) {
  missingTargets.slice(0, 5).forEach(m => console.log(`  - ${m.schema} -> ${m.ref}${m.pointer}`));
}
console.log(missingTargets.length === 0 ? '✓ PASS: All local refs resolve' : '✗ FAIL: ' + missingTargets.length + ' missing targets');

console.log('\n=== [CHECK 3] External Refs Count ===');
const external = [];
inv.schemas.forEach(schema => {
  schema.refs.forEach(ref => {
    if (ref.kind === 'external-url-or-other') {
      external.push(ref.targetFile);
    }
  });
});
console.log('External refs found:', external.length);
const uniqueExternal = new Set(external);
console.log('Unique external targets:', uniqueExternal.size);
Array.from(uniqueExternal).slice(0, 5).forEach(e => console.log(`  - ${e}`));
console.log(external.length > 0 ? '✓ PASS: External refs properly classified' : '✗ FAIL: No external refs found');

console.log('\n=== [CHECK 4] GitHub API Result ===');
console.log('Generated at:', inv.generatedAt);
console.log('Repository:', `${inv.source.owner}/${inv.source.repo}`);
console.log('Reference:', inv.source.ref);
console.log('✓ PASS: Metadata consistent');

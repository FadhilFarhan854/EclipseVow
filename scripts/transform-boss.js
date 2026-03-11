const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:\\Users\\USER116\\Downloads\\boss.json', 'utf8'));

function normalizeDiffType(type) {
  const t = (type || '').replace(/[()]/g, '').trim();
  if (t.toLowerCase() === 'nightmare') return 'Nightmare';
  if (t.toLowerCase() === 'normal') return 'Normal';
  return t || 'Unknown';
}

function extractDrops(entry) {
  const drops = [];
  // Collect all monster-drop keys sorted numerically
  const dropKeys = Object.keys(entry)
    .filter(k => k.startsWith('monster-drop') && !k.includes('href'))
    .sort((a, b) => {
      const numA = a === 'monster-drop' ? 0 : parseInt(a.match(/\((\d+)\)/)?.[1] || '0');
      const numB = b === 'monster-drop' ? 0 : parseInt(b.match(/\((\d+)\)/)?.[1] || '0');
      return numA - numB;
    });

  for (const key of dropKeys) {
    let val = (entry[key] || '').trim();
    if (!val) continue;

    // Skip pure category tags like [Additional], [Armor], [Bow], etc.
    if (/^\[.+\]$/.test(val)) continue;

    // Strip category prefix: "[Material] Item Name" → "Item Name"
    if (key === 'monster-drop') {
      val = val.replace(/^\[.+?\]\s*/, '');
    }

    if (val) drops.push(val);
  }
  return [...new Set(drops)];
}

// ── Filter valid boss entries (remove Google ads & pagination junk) ──
const bossEntries = data.filter(d => d['card-title-inverse'] && d['item-prop (2)']);

// ── Group by boss name ──
const bossGroups = {};
for (const entry of bossEntries) {
  const name = entry['card-title-inverse'];
  if (!bossGroups[name]) bossGroups[name] = [];
  bossGroups[name].push(entry);
}

const DIFF_ORDER = ['Easy', 'Normal', 'Hard', 'Very Hard', 'Nightmare', 'Ultimate'];

const result = [];

for (const [name, entries] of Object.entries(bossGroups)) {
  // ── Common info (most frequent values) ──
  const mode = (arr) => {
    const freq = {};
    arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
  };

  const boss = {
    nama: name,
    element: mode(entries.map(e => e['item-prop (4)']).filter(Boolean)),
    tamable: mode(entries.map(e => e['item-prop (6)']).filter(Boolean)),
    spawn: mode(entries.map(e => e['item-prop (7)']).filter(Boolean)),
    diff: [],
    'monster-drop': []
  };

  // ── Build diff array & collect drops per difficulty type ──
  const diffTypeDrops = {}; // { "Ultimate": Set(["item1","item2"]) }

  for (const entry of entries) {
    const type = normalizeDiffType(entry['item-prop (2)']);
    const lvl  = entry['item-prop']    || '0';
    const hp   = entry['item-prop (3)'] || '0';
    const exp  = entry['item-prop (5)'] || '0';

    boss.diff.push({ type, lvl, hp, exp });

    if (!diffTypeDrops[type]) diffTypeDrops[type] = new Set();
    extractDrops(entry).forEach(d => diffTypeDrops[type].add(d));
  }

  // Sort diffs: by difficulty order first, then level ascending
  boss.diff.sort((a, b) => {
    const oa = DIFF_ORDER.indexOf(a.type);
    const ob = DIFF_ORDER.indexOf(b.type);
    const diff = (oa === -1 ? 999 : oa) - (ob === -1 ? 999 : ob);
    return diff !== 0 ? diff : parseInt(a.lvl) - parseInt(b.lvl);
  });

  // ── Monster drops: common + annotated diff-specific ──
  const allSets = Object.values(diffTypeDrops);
  const allItems = new Set();
  allSets.forEach(s => s.forEach(d => allItems.add(d)));

  if (allSets.length <= 1) {
    // Only one difficulty type → no annotation needed
    boss['monster-drop'] = [...allItems];
  } else {
    // Common drops = items present in EVERY difficulty type
    const common = [...allItems].filter(item => allSets.every(s => s.has(item)));

    // Difficulty-specific drops
    const specific = [];
    for (const [type, dropSet] of Object.entries(diffTypeDrops)) {
      for (const item of dropSet) {
        if (!common.includes(item)) {
          specific.push(`${item} (${type})`);
        }
      }
    }

    boss['monster-drop'] = [...common, ...specific];
  }

  result.push(boss);
}

// ── Write output ──
const outPath = 'd:\\Farhan-project\\eclipse\\public\\asset\\boss.json';
fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');

console.log('✅ Done!');
console.log('   Total bosses :', result.length);
console.log('   Output       :', outPath);
console.log('');
console.log('── Sample: Gespenst ──');
const sample = result.find(b => b.nama === 'Gespenst');
if (sample) {
  console.log(JSON.stringify(sample, null, 2));
}

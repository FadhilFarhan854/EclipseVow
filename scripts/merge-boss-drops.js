const fs = require('fs');
const path = require('path');

// Read both files
const bossData = JSON.parse(fs.readFileSync('c:\\Users\\USER116\\Downloads\\boss.json', 'utf8'));
const bosData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'asset', 'bos.json'), 'utf8'));

// Function to extract drops from boss.json entry
function extractDrops(entry) {
  const drops = [];
  
  // Get all monster-drop keys
  const dropKeys = Object.keys(entry).filter(key => key.startsWith('monster-drop'));
  
  for (const key of dropKeys) {
    const value = entry[key];
    
    // Skip href keys and category markers like [Additional], [Usable], etc.
    if (key.includes('href')) continue;
    if (value.startsWith('[') && value.endsWith(']')) continue;
    
    // Add the drop item
    if (value && !value.startsWith('[')) {
      drops.push(value);
    }
  }
  
  return [...new Set(drops)]; // Remove duplicates
}

// Function to parse boss name and difficulty from boss.json
function parseBossInfo(entry) {
  const name = entry['card-title-inverse'];
  if (!name) return null;
  
  const level = entry['item-prop'];
  const type = entry['item-prop (2)']; // (Easy), (Normal), (Hard), (Nightmare), (Ultimate)
  const hp = entry['item-prop (3)'];
  const element = entry['item-prop (4)'];
  const exp = entry['item-prop (5)'];
  const location = entry['item-prop (7)'];
  
  // Parse difficulty from type
  let difficulty = 'normal';
  if (type) {
    const match = type.match(/\((\w+)\)/i);
    if (match) {
      difficulty = match[1].toLowerCase();
    }
  }
  
  return {
    name,
    level: level === 'Unknown' ? null : level,
    difficulty,
    hp: hp === 'Unknown' ? null : hp,
    element,
    exp: exp === 'Unknown' ? null : exp,
    location
  };
}

// Create a map of boss.json data by name + difficulty
const bossDropMap = new Map();

for (const entry of bossData) {
  // Skip entries without card-title-inverse (ads or other non-boss entries)
  if (!entry['card-title-inverse']) continue;
  
  const info = parseBossInfo(entry);
  if (!info) continue;
  
  const drops = extractDrops(entry);
  
  // Create a key based on name and difficulty
  const key = `${info.name.toLowerCase()}_${info.difficulty}`;
  
  bossDropMap.set(key, {
    ...info,
    drops
  });
  
  // Also store by name only for generic matching
  const nameKey = info.name.toLowerCase();
  if (!bossDropMap.has(nameKey) || drops.length > 0) {
    bossDropMap.set(nameKey, {
      ...info,
      drops
    });
  }
}

// Function to normalize boss name for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\(easy\)|\(normal\)|\(hard\)|\(nightmare\)|\(ultimate\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Update bos.json with drops
let updatedCount = 0;

for (const boss of bosData) {
  const normalizedName = normalizeName(boss.name);
  const difficulty = boss.difficulty || 'normal';
  
  // Try to find matching boss in boss.json
  // First try exact match with difficulty
  let key = `${normalizedName}_${difficulty}`;
  let matchedData = bossDropMap.get(key);
  
  // If no match, try just the name
  if (!matchedData) {
    matchedData = bossDropMap.get(normalizedName);
  }
  
  // If still no match, try fuzzy matching
  if (!matchedData) {
    for (const [mapKey, data] of bossDropMap) {
      if (mapKey.includes(normalizedName) || normalizedName.includes(mapKey.split('_')[0])) {
        matchedData = data;
        break;
      }
    }
  }
  
  if (matchedData && matchedData.drops && matchedData.drops.length > 0) {
    boss.drops = matchedData.drops;
    boss.location = matchedData.location || boss.location;
    updatedCount++;
  } else {
    // Initialize empty drops array if not found
    if (!boss.drops) {
      boss.drops = [];
    }
  }
}

// Write updated data
const outputPath = path.join(__dirname, '..', 'public', 'asset', 'bos.json');
fs.writeFileSync(outputPath, JSON.stringify(bosData, null, 2), 'utf8');

console.log(`Updated ${updatedCount} bosses with drop data`);
console.log(`Total bosses in bos.json: ${bosData.length}`);
console.log(`Total unique bosses in boss.json: ${bossDropMap.size}`);

// Also create a detailed boss drop database
const detailedBossDrops = [];
for (const [key, data] of bossDropMap) {
  if (!key.includes('_')) continue; // Only include entries with difficulty
  
  detailedBossDrops.push({
    name: data.name,
    level: data.level,
    difficulty: data.difficulty,
    hp: data.hp,
    element: data.element,
    exp: data.exp,
    location: data.location,
    drops: data.drops
  });
}

// Sort by name then difficulty
detailedBossDrops.sort((a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  const diffOrder = ['easy', 'normal', 'hard', 'nightmare', 'ultimate'];
  return diffOrder.indexOf(a.difficulty) - diffOrder.indexOf(b.difficulty);
});

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'asset', 'boss-drops-detailed.json'),
  JSON.stringify(detailedBossDrops, null, 2),
  'utf8'
);

console.log(`Created detailed boss drops file with ${detailedBossDrops.length} entries`);

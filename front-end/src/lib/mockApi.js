import { faker } from '@faker-js/faker';

const LS_KEY = 'roomier_mock_db_v1';

function readDB() {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) return JSON.parse(raw);
  const seeded = { groups: [seedGroup()], dashboards: {} };
  localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  return seeded;
}
function writeDB(db) { localStorage.setItem(LS_KEY, JSON.stringify(db)); }
const uid = () => crypto.randomUUID();

function seedGroup() {
  const id = uid();
  const name = `${faker.word.adjective()} ${faker.word.noun()} House`.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  const inviteCode = faker.string.alphanumeric({ length: 6 }).toUpperCase();
  return {
    id,
    name,
    description: faker.lorem.sentence(),
    imageUrl: '', // no photos for Sprint-1
    quietHours: { start: '22:00', end: '07:00' },
    preferences: { temperatureC: 22, guestsAllowed: true },
    componentsEnabled: { chores: true, expenses: true, inventory: true, envPrefs: true },
    roommates: [],
    inviteCode
  };
}

export async function listGroups() { const db = readDB(); await delay(200); return db.groups; }
export async function getGroup(id) { const db = readDB(); await delay(150); return db.groups.find(g => g.id === id) ?? null; }

export async function createGroup(input) {
  const db = readDB(); await delay(250);
  const g = {
    id: uid(),
    name: input.name,
    description: input.description ?? '',
    imageUrl: '',
    quietHours: input.quietHours ?? { start: '22:00', end: '07:00' },
    preferences: input.preferences ?? { temperatureC: 22, guestsAllowed: true },
    componentsEnabled: input.componentsEnabled ?? { chores: true, expenses: true, inventory: true, envPrefs: true },
    roommates: input.roommates ?? [],
    inviteCode: input.inviteCode?.toUpperCase?.() || ''
  };
  db.groups.unshift(g); writeDB(db); return g;
}

export async function updateGroup(id, patch) {
  const db = readDB(); await delay(250);
  db.groups = db.groups.map(g => g.id !== id ? g : {
    ...g,
    ...patch,
    quietHours: { ...g.quietHours, ...(patch.quietHours || {}) },
    preferences: { ...g.preferences, ...(patch.preferences || {}) },
    componentsEnabled: { ...g.componentsEnabled, ...(patch.componentsEnabled || {}) },
    roommates: patch.roommates ?? g.roommates
  });
  writeDB(db); return db.groups.find(g => g.id === id);
}

export async function getDashboard(groupId) {
  const db = readDB(); await delay(220);
  if (!db.dashboards[groupId]) {
    db.dashboards[groupId] = {
      chores: Array.from({ length: 5 }).map(() => ({
        id: uid(),
        title: faker.helpers.arrayElement(['Dishes', 'Trash', 'Vacuum', 'Bathroom', 'Dusting', 'Laundry']),
        assignee: faker.person.firstName(),
        due: faker.date.soon({ days: 5 }).toISOString(),
        repeat: faker.helpers.arrayElement(['none', 'Daily', 'Weekly', 'Monthly']),
        description: faker.lorem.paragraph(),
        done: Math.random() < 0.3
      })),
      expenses: Array.from({ length: 3 }).map(() => ({
        id: uid(),
        label: faker.commerce.productName(),
        amount: Number(faker.commerce.price({ min: 10, max: 120 })),
        youOwe: Math.random() < 0.5,
        createdAt: faker.date.recent().toISOString()
      })),
      inventory: Array.from({ length: 4 }).map(() => ({
        id: uid(),
        name: faker.commerce.product(),
        status: faker.helpers.arrayElement(['Low', 'Good', 'Full']),
        imageUrl: ''
      })),
      notifications: Array.from({ length: 3 }).map(() => ({
        id: uid(),
        message: faker.lorem.sentence(),
        createdAt: faker.date.recent().toISOString()
      }))
    };
    writeDB(db);
  }
  return db.dashboards[groupId];
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

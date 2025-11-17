import { nanoid } from 'nanoid';

/** --------------------------------
 * In-memory seed data
 * -------------------------------- */
const users = [
  { id: 'u1', email: 'test@example.com', password: 'testpassword', name: 'Test User' },
  { id: 'u2', email: 'alex@gmail.com',  password: 'password123',  name: 'Alex' },
  { id: 'u3', email: 'sam@gmail.com',   password: 'password123',  name: 'Sam'  }
];

const groups = [
  {
    id: 'g1',
    name: 'Address House',
    description: 'Shared place near campus.',
    inviteCode: 'T38Y2Z',
    roommates: ['alex@gmail.com', 'sam@gmail.com'],
    components: { chores: true, expenses: true, inventory: true },
    prefs: { quietStart: '22:00', quietEnd: '06:00', temperatureF: 72, guestsAllowed: true },
    chores: [
      { id: nanoid(), title: 'Trash',  due: '2025-11-08', assignee: 'alex@gmail.com', repeat: 'None', description: 'Take out' },
      { id: nanoid(), title: 'Dishes', due: '2025-11-07', assignee: 'sam@gmail.com',  repeat: 'None', description: 'Clean up after party'  }
    ],
    expenses: [
      { id: nanoid(), description: 'Paper towels', amount: 7.5, paidBy: { email: 'alex@gmail.com' }, youOwe: true }
    ],
    inventory: [
      { id: nanoid(), name: 'Milk',      status: 'Low'  },
      { id: nanoid(), name: 'Dish Soap', status: 'Good' }
    ]
  }
];

// Simple token store (mock)
const tokens = new Map(); // token -> { userId, ts }

/** --------------------------------
 * Data access API
 * -------------------------------- */
export const db = {
  /* ---------- Users ---------- */
  getUserByEmail(email) {
    if (!email) return null;
    const e = String(email).toLowerCase();
    return users.find(u => u.email.toLowerCase() === e) || null;
  },

  getUser(id) {
    return users.find(u => u.id === id) || null;
  },

  createUser(input = {}) {
    const { email, password, name } = input;
    if (!email || !password) return null;
    if (this.getUserByEmail(email)) return null;

    const user = {
      id: nanoid(6),
      email: String(email).toLowerCase(),
      password: String(password),
      name: name || String(email).split('@')[0]
    };
    users.push(user);
    return user;
  },

  updateUser(id, patch = {}) {
    const u = this.getUser(id);
    if (!u) return null;
    // Only allow profile-ish fields (no email/password changes here)
    const allowed = ['name', 'phone', 'photoUrl'];
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(patch, k)) {
        u[k] = patch[k];
      }
    }
    return u;
  },

  sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  verifyUserPassword(user, password) {
    return !!(user && String(user.password) === String(password));
  },

  issueToken(userId) {
    const token = nanoid(16);
    tokens.set(token, { userId, ts: Date.now() });
    return token;
  },

  /* ---------- Groups ---------- */
  listGroups() {
    return groups;
  },

  getGroup(id) {
    return groups.find(g => g.id === id) || null;
  },

  createGroup(input = {}) {
    const normalizedComponents = Array.isArray(input.components)
      ? Object.fromEntries(['chores', 'expenses', 'inventory'].map(k => [k, input.components.includes(k)]))
      : (input.components || { chores: true, expenses: true, inventory: true });

    const prefsFromInput = input.preferences || input.prefs || {};
    const quietFromInput = input.quietHours || {};

    const g = {
      id: nanoid(6),
      name: input.name || 'New Group',
      description: input.description || '',
      inviteCode: input.inviteCode || '',
      roommates: Array.isArray(input.roommates) ? input.roommates : [],
      components: normalizedComponents,
      prefs: {
        quietStart: quietFromInput.start ?? '22:00',
        quietEnd: quietFromInput.end ?? '06:00',
        temperatureF: typeof prefsFromInput.temperatureF === 'number' ? prefsFromInput.temperatureF : 72,
        guestsAllowed: typeof prefsFromInput.guestsAllowed === 'boolean' ? prefsFromInput.guestsAllowed : true
      },
      chores: [],
      expenses: [],
      inventory: []
    };

    groups.push(g);
    return g;
  },

  updateGroup(id, patch = {}) {
    const g = this.getGroup(id);
    if (!g) return null;

    if (patch.preferences || patch.prefs) {
      const p = patch.preferences || patch.prefs;
      g.prefs = { ...g.prefs, ...p };
      delete patch.preferences;
      delete patch.prefs;
    }
    if (patch.quietHours) {
      const q = patch.quietHours;
      g.prefs = {
        ...g.prefs,
        quietStart: q.start ?? g.prefs.quietStart,
        quietEnd:   q.end   ?? g.prefs.quietEnd
      };
      delete patch.quietHours;
    }
    if (Array.isArray(patch.components)) {
      g.components = Object.fromEntries(['chores', 'expenses', 'inventory'].map(k => [k, patch.components.includes(k)]));
      delete patch.components;
    }

    Object.assign(g, patch);
    return g;
  },

  dashboard(id) {
    const g = this.getGroup(id);
    if (!g) return null;
    return {
      group:     { id: g.id, name: g.name },
      prefs:     g.prefs,
      roommates: g.roommates,
      chores:    g.chores,
      expenses:  g.expenses,
      inventory: g.inventory
    };
  },

  createChore(id, input = {}) {
    const g = this.getGroup(id);
    if (!g) return null;

    const chore = {
      id: nanoid(),
      title: input.title || 'New Chore',
      due: input.due || null,
      assignee: input.assignee || null,
      repeat: input.repeat || 'None',
      description: input.repeat || ''
    }

    g.chores.push(chore);
    return chore;
  },

  updateChore(id, cid, patch = {}) {
    const g = this.getGroup(id);
    if (!g) return null;

    const chore = g.chores.find(c => c.id === cid);
    if (!chore) return null;

    Object.assign(chore, patch);
    return chore;
  },

  deleteChore(id, cid) {
    const g = this.getGroup(id);
    if (!g) return null;

    const chore = g.chores.findIndex(c => c.id === cid);
    if (i === -1) return null;

    g.chores.splice(i, 1);
    return true;
  }
};

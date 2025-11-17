import { nanoid } from 'nanoid';

const users = [
  {
    id: 'u1',
    email: 'test@example.com',
    password: 'testpassword'
  },
  {
    id: 'u2',
    email: 'alex@gmail.com',
    password: 'password123'
  },
  {
    id: 'u3',
    email: 'sam@gmail.com',
    password: 'password123'
  }
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
      { id: nanoid(), title: 'Trash', due: '2025-11-08', assignee: 'alex@gmail.com', done: false },
      { id: nanoid(), title: 'Dishes', due: '2025-11-07', assignee: 'sam@gmail.com', done: true }
    ],
    expenses: [
      { id: nanoid(), description: 'Paper towels', amount: 7.5, paidBy: { email: 'alex@gmail.com' }, youOwe: true }
    ],
    inventory: [
      { id: nanoid(), name: 'Milk', status: 'Low' },
      { id: nanoid(), name: 'Dish Soap', status: 'Good' }
    ]
  }
];

export const db = {
  getUserByEmail(email) {
    return users.find(u => u.email === email) || null;
  },

  createUser(input = {}) {
    const { email, password } = input;
    
    if (this.getUserByEmail(email)) {
      return null;
    }

    const user = {
      id: nanoid(6),
      email,
      password
    };

    users.push(user);
    return user;
  },

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
        quietEnd: q.end ?? g.prefs.quietEnd
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
      group: { id: g.id, name: g.name },
      prefs: g.prefs,
      roommates: g.roommates,
      chores: g.chores,
      expenses: g.expenses,
      inventory: g.inventory
    };
  }
};
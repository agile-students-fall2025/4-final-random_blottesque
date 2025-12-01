import { Router } from 'express';
import { nanoid } from 'nanoid';
import Group from '../models/Group.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import {
  validateCreateGroup,
  validateUpdateGroup,
  validateCreateChore,
  validateUpdateChore,
  validateCreateExpense,
  validateCreateInventoryItem
} from '../middleware/validators.js';

const router = Router();

// ==================== GROUP ROUTES ====================

/**
 * GET /api/groups
 * List all groups (optionally filtered by user)
 */
router.get('/groups', optionalAuth, async (req, res) => {
  try {
    let query = {};
    
    // If user is authenticated, show their groups
    if (req.user) {
      query = {
        $or: [
          { createdBy: req.user._id },
          { members: req.user._id }
        ]
      };
    }

    const groups = await Group.find(query).sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    console.error('List groups error:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

/**
 * POST /api/groups
 * Create a new group
 */
router.post('/groups', validateCreateGroup, optionalAuth, async (req, res) => {
  try {
    const { name, description, roommates, components, preferences, quietHours, inviteCode } = req.body;

    // Normalize components
    let normalizedComponents = { chores: true, expenses: true, inventory: true };
    if (Array.isArray(components)) {
      normalizedComponents = {
        chores: components.includes('chores'),
        expenses: components.includes('expenses'),
        inventory: components.includes('inventory')
      };
    } else if (components && typeof components === 'object') {
      normalizedComponents = { ...normalizedComponents, ...components };
    }

    // Build preferences
    const prefs = {
      quietStart: quietHours?.start || '22:00',
      quietEnd: quietHours?.end || '06:00',
      temperatureF: preferences?.temperatureF ?? 72,
      guestsAllowed: preferences?.guestsAllowed ?? true
    };

    const group = new Group({
      name,
      description: description || '',
      inviteCode: inviteCode?.toUpperCase() || nanoid(6).toUpperCase(),
      roommates: Array.isArray(roommates) ? roommates : [],
      components: normalizedComponents,
      prefs,
      createdBy: req.user?._id,
      members: req.user ? [req.user._id] : []
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

/**
 * GET /api/groups/:id
 * Get group by ID
 */
router.get('/groups/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

/**
 * PUT /api/groups/:id
 * Update group
 */
router.put('/groups/:id', validateUpdateGroup, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const { name, description, roommates, components, preferences, quietHours, inviteCode } = req.body;

    // Update basic fields
    if (name !== undefined) group.name = name;
    if (description !== undefined) group.description = description;
    if (inviteCode !== undefined) group.inviteCode = inviteCode.toUpperCase();
    if (roommates !== undefined) group.roommates = roommates;

    // Update components
    if (Array.isArray(components)) {
      group.components = {
        chores: components.includes('chores'),
        expenses: components.includes('expenses'),
        inventory: components.includes('inventory')
      };
    } else if (components && typeof components === 'object') {
      group.components = { ...group.components, ...components };
    }

    // Update preferences
    if (preferences) {
      if (preferences.temperatureF !== undefined) group.prefs.temperatureF = preferences.temperatureF;
      if (preferences.guestsAllowed !== undefined) group.prefs.guestsAllowed = preferences.guestsAllowed;
    }

    // Update quiet hours
    if (quietHours) {
      if (quietHours.start !== undefined) group.prefs.quietStart = quietHours.start;
      if (quietHours.end !== undefined) group.prefs.quietEnd = quietHours.end;
    }

    await group.save();
    res.json(group);
  } catch (error) {
    console.error('Update group error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Failed to update group' });
  }
});

/**
 * DELETE /api/groups/:id
 * Delete group
 */
router.delete('/groups/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ ok: true, message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

/**
 * GET /api/groups/:id/dashboard
 * Get dashboard aggregate data
 */
router.get('/groups/:id/dashboard', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({
      group: { id: group._id, name: group.name },
      prefs: group.prefs,
      roommates: group.roommates,
      chores: group.chores,
      expenses: group.expenses,
      inventory: group.inventory
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// ==================== PREFERENCES ROUTES ====================

/**
 * GET /api/groups/:id/prefs
 * Get group preferences
 */
router.get('/groups/:id/prefs', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group.prefs);
  } catch (error) {
    console.error('Get prefs error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

/**
 * PUT /api/groups/:id/prefs
 * Update group preferences
 */
router.put('/groups/:id/prefs', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const { quietStart, quietEnd, temperatureF, guestsAllowed } = req.body;

    if (quietStart !== undefined) group.prefs.quietStart = quietStart;
    if (quietEnd !== undefined) group.prefs.quietEnd = quietEnd;
    if (temperatureF !== undefined) group.prefs.temperatureF = temperatureF;
    if (guestsAllowed !== undefined) group.prefs.guestsAllowed = guestsAllowed;

    await group.save();
    res.json(group.prefs);
  } catch (error) {
    console.error('Update prefs error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// ==================== CHORES ROUTES ====================

/**
 * GET /api/groups/:id/chores
 * Get all chores for a group
 */
router.get('/groups/:id/chores', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group.chores);
  } catch (error) {
    console.error('Get chores error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Failed to fetch chores' });
  }
});

/**
 * POST /api/groups/:id/chores
 * Add a new chore
 */
router.post('/groups/:id/chores', validateCreateChore, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const { title, due, assignee, repeat, description } = req.body;

    const chore = {
      _id: nanoid(),
      title,
      due: due ? new Date(due) : null,
      assignee: assignee || null,
      repeat: repeat || 'None',
      description: description || '',
      done: false
    };

    group.chores.push(chore);
    await group.save();

    // Return the chore with id field for frontend compatibility
    res.status(201).json({ ...chore, id: chore._id });
  } catch (error) {
    console.error('Create chore error:', error);
    res.status(500).json({ error: 'Failed to create chore' });
  }
});

/**
 * PUT /api/groups/:id/chores/:cid
 * Update a chore
 */
router.put('/groups/:id/chores/:cid', validateUpdateChore, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const choreIndex = group.chores.findIndex(c => c._id === req.params.cid);
    
    if (choreIndex === -1) {
      return res.status(404).json({ error: 'Chore not found' });
    }

    const { title, due, assignee, repeat, description, done } = req.body;

    if (title !== undefined) group.chores[choreIndex].title = title;
    if (due !== undefined) group.chores[choreIndex].due = due ? new Date(due) : null;
    if (assignee !== undefined) group.chores[choreIndex].assignee = assignee;
    if (repeat !== undefined) group.chores[choreIndex].repeat = repeat;
    if (description !== undefined) group.chores[choreIndex].description = description;
    if (done !== undefined) group.chores[choreIndex].done = done;

    await group.save();

    const chore = group.chores[choreIndex];
    res.json({ ...chore.toObject(), id: chore._id });
  } catch (error) {
    console.error('Update chore error:', error);
    res.status(500).json({ error: 'Failed to update chore' });
  }
});

/**
 * DELETE /api/groups/:gid/chores/:cid
 * Delete a chore
 */
router.delete('/groups/:gid/chores/:cid', async (req, res) => {
  try {
    const group = await Group.findById(req.params.gid);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const choreIndex = group.chores.findIndex(c => c._id === req.params.cid);
    
    if (choreIndex === -1) {
      return res.status(404).json({ error: 'Chore not found' });
    }

    group.chores.splice(choreIndex, 1);
    await group.save();

    res.json({ ok: true });
  } catch (error) {
    console.error('Delete chore error:', error);
    res.status(500).json({ error: 'Failed to delete chore' });
  }
});

// ==================== EXPENSES ROUTES ====================

/**
 * GET /api/groups/:id/expenses
 * Get all expenses for a group
 */
router.get('/groups/:id/expenses', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group.expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

/**
 * POST /api/groups/:id/expenses
 * Add a new expense
 */
router.post('/groups/:id/expenses', validateCreateExpense, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const { description, amount, paidBy, youOwe } = req.body;

    const expense = {
      _id: nanoid(),
      description,
      amount: Number(amount),
      paidBy: paidBy || {},
      youOwe: youOwe ?? false,
      createdAt: new Date()
    };

    group.expenses.push(expense);
    await group.save();

    res.status(201).json({ ...expense, id: expense._id });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

/**
 * PUT /api/groups/:id/expenses/:eid
 * Update an expense
 */
router.put('/groups/:id/expenses/:eid', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const expenseIndex = group.expenses.findIndex(e => e._id === req.params.eid);
    
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const { description, amount, paidBy, youOwe } = req.body;

    if (description !== undefined) group.expenses[expenseIndex].description = description;
    if (amount !== undefined) group.expenses[expenseIndex].amount = Number(amount);
    if (paidBy !== undefined) group.expenses[expenseIndex].paidBy = paidBy;
    if (youOwe !== undefined) group.expenses[expenseIndex].youOwe = youOwe;

    await group.save();

    const expense = group.expenses[expenseIndex];
    res.json({ ...expense.toObject(), id: expense._id });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

/**
 * DELETE /api/groups/:gid/expenses/:eid
 * Delete an expense
 */
router.delete('/groups/:gid/expenses/:eid', async (req, res) => {
  try {
    const group = await Group.findById(req.params.gid);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const expenseIndex = group.expenses.findIndex(e => e._id === req.params.eid);
    
    if (expenseIndex === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    group.expenses.splice(expenseIndex, 1);
    await group.save();

    res.json({ ok: true });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// ==================== INVENTORY ROUTES ====================

/**
 * GET /api/groups/:id/inventory
 * Get all inventory items for a group
 */
router.get('/groups/:id/inventory', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group.inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

/**
 * POST /api/groups/:id/inventory
 * Add a new inventory item
 */
router.post('/groups/:id/inventory', validateCreateInventoryItem, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const { name, status, info } = req.body;

    const item = {
      _id: nanoid(),
      name,
      status: status || 'Good',
      info: info || ''
    };

    group.inventory.push(item);
    await group.save();

    res.status(201).json({ ...item, id: item._id });
  } catch (error) {
    console.error('Create inventory item error:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

/**
 * PUT /api/groups/:id/inventory/:iid
 * Update an inventory item
 */
router.put('/groups/:id/inventory/:iid', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const itemIndex = group.inventory.findIndex(i => i._id === req.params.iid);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const { name, status, info } = req.body;

    if (name !== undefined) group.inventory[itemIndex].name = name;
    if (status !== undefined) group.inventory[itemIndex].status = status;
    if (info !== undefined) group.inventory[itemIndex].info = info;

    await group.save();

    const item = group.inventory[itemIndex];
    res.json({ ...item.toObject(), id: item._id });
  } catch (error) {
    console.error('Update inventory item error:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

/**
 * DELETE /api/groups/:gid/inventory/:iid
 * Delete an inventory item
 */
router.delete('/groups/:gid/inventory/:iid', async (req, res) => {
  try {
    const group = await Group.findById(req.params.gid);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const itemIndex = group.inventory.findIndex(i => i._id === req.params.iid);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    group.inventory.splice(itemIndex, 1);
    await group.save();

    res.json({ ok: true });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// ==================== INVITE CODE ROUTE ====================

/**
 * POST /api/groups/join
 * Join a group by invite code
 */
router.post('/groups/join', authenticate, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const group = await Group.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!group) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    // Check if user is already a member
    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ error: 'You are already a member of this group' });
    }

    // Add user to members
    group.members.push(req.user._id);
    
    // Add user email to roommates if not already there
    if (!group.roommates.includes(req.user.email)) {
      group.roommates.push(req.user.email);
    }

    await group.save();

    res.json(group);
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

export default router;
const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all transactions for logged-in user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { category, type, startDate, endDate, limit = 100 } = req.query;
    
    let query = 'SELECT t.*, a.account_name FROM transactions t LEFT JOIN accounts a ON t.account_id = a.id WHERE t.user_id = $1';
    const params = [req.userId];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND t.category = $${paramCount}`;
      params.push(category);
    }

    if (type) {
      paramCount++;
      query += ` AND t.type = $${paramCount}`;
      params.push(type);
    }

    if (startDate) {
      paramCount++;
      query += ` AND t.date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND t.date <= $${paramCount}`;
      params.push(endDate);
    }

    query += ` ORDER BY t.date DESC, t.created_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create new transaction
router.post('/', [
  authMiddleware,
  body('amount').isDecimal(),
  body('type').isIn(['income', 'expense']),
  body('category').trim().notEmpty(),
  body('date').isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountId, amount, type, category, description, date } = req.body;

    const result = await pool.query(
      'INSERT INTO transactions (user_id, account_id, amount, type, category, description, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.userId, accountId || null, amount, type, category, description || '', date]
    );

    // Update account balance if accountId is provided
    if (accountId) {
      const balanceChange = type === 'income' ? amount : -amount;
      await pool.query(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2 AND user_id = $3',
        [balanceChange, accountId, req.userId]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update transaction
router.put('/:id', [
  authMiddleware,
  body('amount').optional().isDecimal(),
  body('type').optional().isIn(['income', 'expense']),
  body('category').optional().trim().notEmpty(),
  body('date').optional().isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // First, get the old transaction to reverse balance changes
    const oldTransaction = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (oldTransaction.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const { accountId, amount, type, category, description, date } = req.body;
    const old = oldTransaction.rows[0];

    // Update transaction
    const result = await pool.query(
      'UPDATE transactions SET account_id = COALESCE($1, account_id), amount = COALESCE($2, amount), type = COALESCE($3, type), category = COALESCE($4, category), description = COALESCE($5, description), date = COALESCE($6, date) WHERE id = $7 AND user_id = $8 RETURNING *',
      [accountId, amount, type, category, description, date, req.params.id, req.userId]
    );

    // Update account balances if needed
    if (old.account_id) {
      const oldBalanceChange = old.type === 'income' ? -old.amount : old.amount;
      await pool.query(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
        [oldBalanceChange, old.account_id]
      );
    }

    const newTransaction = result.rows[0];
    if (newTransaction.account_id) {
      const newBalanceChange = newTransaction.type === 'income' ? newTransaction.amount : -newTransaction.amount;
      await pool.query(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
        [newBalanceChange, newTransaction.account_id]
      );
    }

    res.json(newTransaction);
  } catch (error) {
    next(error);
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    // Get transaction to reverse balance
    const transaction = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (transaction.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const trans = transaction.rows[0];

    // Delete transaction
    await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    // Update account balance if needed
    if (trans.account_id) {
      const balanceChange = trans.type === 'income' ? -trans.amount : trans.amount;
      await pool.query(
        'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
        [balanceChange, trans.account_id]
      );
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


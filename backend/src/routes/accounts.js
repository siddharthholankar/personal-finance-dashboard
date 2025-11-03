const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all accounts for logged-in user
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Create new account
router.post('/', [
  authMiddleware,
  body('accountName').trim().notEmpty(),
  body('accountType').isIn(['bank', 'investment']),
  body('balance').isDecimal()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountName, accountType, balance } = req.body;

    const result = await pool.query(
      'INSERT INTO accounts (user_id, account_name, account_type, balance) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, accountName, accountType, balance]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get account by ID
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM accounts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;


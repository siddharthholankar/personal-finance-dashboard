const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all portfolio holdings
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Add new portfolio holding
router.post('/', [
  authMiddleware,
  body('symbol').trim().notEmpty().toUpperCase(),
  body('shares').isDecimal(),
  body('purchasePrice').isDecimal(),
  body('currentPrice').optional().isDecimal()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { symbol, shares, purchasePrice, currentPrice } = req.body;

    // Check if holding already exists
    const existing = await pool.query(
      'SELECT * FROM portfolio WHERE user_id = $1 AND symbol = $2',
      [req.userId, symbol]
    );

    if (existing.rows.length > 0) {
      // Update existing holding - average the purchase price
      const existingShares = parseFloat(existing.rows[0].shares);
      const existingPrice = parseFloat(existing.rows[0].purchase_price);
      const newShares = parseFloat(shares);
      const newPrice = parseFloat(purchasePrice);
      
      const totalShares = existingShares + newShares;
      const avgPrice = ((existingShares * existingPrice) + (newShares * newPrice)) / totalShares;

      const result = await pool.query(
        'UPDATE portfolio SET shares = $1, purchase_price = $2, current_price = COALESCE($3, current_price) WHERE user_id = $4 AND symbol = $5 RETURNING *',
        [totalShares, avgPrice, currentPrice, req.userId, symbol]
      );

      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      'INSERT INTO portfolio (user_id, symbol, shares, purchase_price, current_price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, symbol, shares, purchasePrice, currentPrice || purchasePrice]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update portfolio holding
router.put('/:id', [
  authMiddleware,
  body('shares').optional().isDecimal(),
  body('currentPrice').optional().isDecimal()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shares, currentPrice } = req.body;

    const result = await pool.query(
      'UPDATE portfolio SET shares = COALESCE($1, shares), current_price = COALESCE($2, current_price) WHERE id = $3 AND user_id = $4 RETURNING *',
      [shares, currentPrice, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio holding not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete portfolio holding
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM portfolio WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio holding not found' });
    }

    res.json({ message: 'Portfolio holding deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


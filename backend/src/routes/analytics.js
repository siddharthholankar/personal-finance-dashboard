const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get monthly summary
router.get('/monthly-summary', authMiddleware, async (req, res, next) => {
  try {
    const { year, month } = req.query;
    
    let dateFilter = '';
    const params = [req.userId];
    
    if (year && month) {
      dateFilter = `AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3`;
      params.push(year, month);
    } else if (year) {
      dateFilter = `AND EXTRACT(YEAR FROM date) = $2`;
      params.push(year);
    }

    const query = `
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net
      FROM transactions
      WHERE user_id = $1 ${dateFilter}
      GROUP BY TO_CHAR(date, 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get category breakdown
router.get('/category-breakdown', authMiddleware, async (req, res, next) => {
  try {
    const { type = 'expense', startDate, endDate } = req.query;
    
    let dateFilter = '';
    const params = [req.userId, type];
    let paramCount = 2;

    if (startDate) {
      paramCount++;
      dateFilter += ` AND date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      dateFilter += ` AND date <= $${paramCount}`;
      params.push(endDate);
    }

    const query = `
      SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE user_id = $1 AND type = $2 ${dateFilter}
      GROUP BY category
      ORDER BY total DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get recent transactions summary
router.get('/recent-summary', authMiddleware, async (req, res, next) => {
  try {
    const query = `
      SELECT 
        (SELECT SUM(balance) FROM accounts WHERE user_id = $1) as total_balance,
        (SELECT SUM(amount) FROM transactions WHERE user_id = $1 AND type = 'income' AND date >= CURRENT_DATE - INTERVAL '30 days') as monthly_income,
        (SELECT SUM(amount) FROM transactions WHERE user_id = $1 AND type = 'expense' AND date >= CURRENT_DATE - INTERVAL '30 days') as monthly_expenses,
        (SELECT COUNT(*) FROM transactions WHERE user_id = $1) as total_transactions
    `;

    const result = await pool.query(query, [req.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get portfolio summary
router.get('/portfolio-summary', authMiddleware, async (req, res, next) => {
  try {
    const query = `
      SELECT 
        SUM(shares * purchase_price) as total_invested,
        SUM(shares * current_price) as current_value,
        SUM(shares * current_price) - SUM(shares * purchase_price) as total_gain_loss
      FROM portfolio
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [req.userId]);
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;


const pool = require('../config/database');

async function addDemoData() {
  try {
    console.log('Adding demo data...');

    // Add demo accounts
    await pool.query(`
      INSERT INTO accounts (user_id, account_name, account_type, balance)
      VALUES 
        (1, 'Investment Portfolio', 'investment', 25000.00),
        (1, 'Checking Account', 'bank', 5420.50),
        (1, 'Savings Account', 'bank', 12300.00)
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Added demo accounts');

    // Add demo portfolio holdings - Popular tech stocks with Jan 2024 prices
    // These are realistic prices from January 2024 vs current approximate prices
    await pool.query(`
      INSERT INTO portfolio (user_id, symbol, shares, purchase_price, current_price)
      VALUES 
        (1, 'AAPL', 25.0, 185.00, 232.00),    -- Apple: ~25% gain
        (1, 'MSFT', 15.0, 370.00, 437.00),    -- Microsoft: ~18% gain  
        (1, 'GOOGL', 20.0, 140.00, 168.00),   -- Google: ~20% gain
        (1, 'NVDA', 10.0, 495.00, 875.00),    -- NVIDIA: ~77% gain (AI boom)
        (1, 'TSLA', 12.0, 238.00, 265.00),    -- Tesla: ~11% gain
        (1, 'AMZN', 18.0, 151.00, 178.00)     -- Amazon: ~18% gain
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Added demo portfolio holdings');

    // Add demo transactions - Income and expenses
    await pool.query(`
      INSERT INTO transactions (user_id, account_id, amount, type, category, description, date)
      VALUES 
        -- Income
        (1, 2, 5500.00, 'income', 'Salary', 'Monthly salary deposit', '2024-11-01'),
        (1, 2, 5500.00, 'income', 'Salary', 'Monthly salary deposit', '2024-10-01'),
        (1, 2, 1200.00, 'income', 'Investment', 'Stock dividend payment', '2024-10-15'),
        (1, 2, 850.00, 'income', 'Freelance', 'Consulting project', '2024-10-20'),
        
        -- Expenses
        (1, 2, 1850.00, 'expense', 'Rent', 'Monthly rent payment', '2024-11-01'),
        (1, 2, 450.00, 'expense', 'Utilities', 'Electric, water, internet', '2024-11-05'),
        (1, 2, 320.00, 'expense', 'Groceries', 'Weekly grocery shopping', '2024-11-03'),
        (1, 2, 180.00, 'expense', 'Transportation', 'Gas and car maintenance', '2024-11-04'),
        (1, 2, 125.00, 'expense', 'Entertainment', 'Movie and dinner', '2024-11-06'),
        (1, 2, 95.00, 'expense', 'Shopping', 'Clothing', '2024-11-07'),
        
        -- October transactions
        (1, 2, 1850.00, 'expense', 'Rent', 'Monthly rent payment', '2024-10-01'),
        (1, 2, 425.00, 'expense', 'Utilities', 'Electric, water, internet', '2024-10-05'),
        (1, 2, 680.00, 'expense', 'Groceries', 'Monthly groceries', '2024-10-10'),
        (1, 2, 220.00, 'expense', 'Transportation', 'Gas', '2024-10-12'),
        (1, 2, 350.00, 'expense', 'Entertainment', 'Concert tickets', '2024-10-18'),
        (1, 2, 150.00, 'expense', 'Shopping', 'Electronics', '2024-10-22'),
        (1, 2, 280.00, 'expense', 'Healthcare', 'Doctor visit', '2024-10-25'),
        
        -- September transactions
        (1, 2, 5500.00, 'income', 'Salary', 'Monthly salary deposit', '2024-09-01'),
        (1, 2, 1850.00, 'expense', 'Rent', 'Monthly rent payment', '2024-09-01'),
        (1, 2, 410.00, 'expense', 'Utilities', 'Electric, water, internet', '2024-09-05'),
        (1, 2, 590.00, 'expense', 'Groceries', 'Monthly groceries', '2024-09-08')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Added demo transactions');

    // Calculate and display portfolio summary
    const summary = await pool.query(`
      SELECT 
        SUM(shares * purchase_price) as total_invested,
        SUM(shares * current_price) as current_value,
        SUM(shares * current_price) - SUM(shares * purchase_price) as total_gain_loss
      FROM portfolio
      WHERE user_id = 1
    `);

    console.log('\n📊 Demo Portfolio Summary:');
    console.log(`Total Invested: $${parseFloat(summary.rows[0].total_invested).toFixed(2)}`);
    console.log(`Current Value: $${parseFloat(summary.rows[0].current_value).toFixed(2)}`);
    console.log(`Total Gain: $${parseFloat(summary.rows[0].total_gain_loss).toFixed(2)}`);
    console.log(`Return: ${((parseFloat(summary.rows[0].total_gain_loss) / parseFloat(summary.rows[0].total_invested)) * 100).toFixed(2)}%`);

    // Display holdings
    const holdings = await pool.query(`
      SELECT 
        symbol,
        shares,
        purchase_price,
        current_price,
        (current_price - purchase_price) * shares as gain_loss,
        ((current_price - purchase_price) / purchase_price) * 100 as return_pct
      FROM portfolio
      WHERE user_id = 1
      ORDER BY symbol
    `);

    console.log('\n📈 Individual Holdings:');
    holdings.rows.forEach(h => {
      console.log(`${h.symbol}: ${h.shares} shares @ $${parseFloat(h.purchase_price).toFixed(2)} → $${parseFloat(h.current_price).toFixed(2)} | Gain: $${parseFloat(h.gain_loss).toFixed(2)} (${parseFloat(h.return_pct).toFixed(2)}%)`);
    });

    console.log('\n✅ Demo data added successfully!');
    console.log('\nRefresh your browser to see the data: http://localhost:3000');
    
  } catch (error) {
    console.error('Error adding demo data:', error);
  } finally {
    await pool.end();
  }
}

addDemoData();


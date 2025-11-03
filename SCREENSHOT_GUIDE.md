# 📸 Screenshot Guide for Your Portfolio

## How to Take & Add Screenshots to Your README

### Step 1: Take Screenshots

**Open your application** at http://localhost:3000 and take screenshots of:

1. **Dashboard Page**
   - Navigate to: http://localhost:3000/
   - Capture: Full page showing portfolio summary, accounts, recent transactions

2. **Portfolio Page**  
   - Navigate to: http://localhost:3000/portfolio
   - Capture: Table showing all 6 stocks with gains/losses

3. **Market Analysis Page**
   - Navigate to: http://localhost:3000/market-analysis
   - Capture: TradingView charts with indicators

4. **Transactions Page**
   - Navigate to: http://localhost:3000/transactions
   - Capture: Transaction list with categories

5. **Analytics Page**
   - Navigate to: http://localhost:3000/analytics
   - Capture: Charts showing monthly trends and category breakdown

### Step 2: Save Screenshots

Create a folder in your project:
```bash
mkdir -p screenshots
```

Save your screenshots with these names:
- `screenshots/dashboard.png`
- `screenshots/portfolio.png`
- `screenshots/market-analysis.png`
- `screenshots/transactions.png`
- `screenshots/analytics.png`

### Step 3: Update README

Replace the screenshot placeholders in `README.md`:

**Find this:**
```markdown
### 📊 Dashboard - Real-Time Overview
> *Screenshot placeholder: Dashboard showing portfolio summary, recent transactions, and account balances*
```

**Replace with:**
```markdown
### 📊 Dashboard - Real-Time Overview
![Dashboard Screenshot](screenshots/dashboard.png)
```

Do this for all 5 screenshot sections.

### Step 4: Commit & Push

```bash
git add screenshots/ README.md
git commit -m "Add portfolio screenshots"
git push origin main
```

---

## Tips for Great Screenshots

✅ **Use full browser width** (at least 1200px wide)  
✅ **Hide personal info** if any (your demo data is fine)  
✅ **Take screenshots in light mode** (better for printing/viewing)  
✅ **Show real data** (your demo stocks and transactions look great!)  
✅ **Capture clean UI** (no browser dev tools open)  
✅ **Use CMD+SHIFT+4** (Mac) or **Windows+Shift+S** (Windows) for clean screenshots

---

## Alternative: Use GitHub Issues for Hosting

If you don't want to add large image files to your repo:

1. Go to any GitHub issue
2. Drag & drop your screenshot into a comment
3. Copy the resulting image URL (e.g., `https://user-images.githubusercontent.com/...`)
4. Use that URL in your README instead of local files

Example:
```markdown
![Dashboard](https://user-images.githubusercontent.com/12345/screenshot.png)
```

This keeps your repository lightweight!

---

## Quick Screenshot Checklist

- [ ] Dashboard showing $42K total value
- [ ] Portfolio with 6 stocks and 31% returns
- [ ] Market Analysis with TradingView charts
- [ ] Transactions with categorized income/expenses
- [ ] Analytics with charts and graphs
- [ ] All images committed and pushed to GitHub
- [ ] README updated with image paths
- [ ] Verified images display correctly on GitHub

**Once done, your README will look professional and showcase your work visually!** 🎉


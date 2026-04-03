/**
 * Merges class names into a single string, filtering out falsy values.
 * @param {...string} classes - Class name strings to merge
 * @returns {string} Merged class string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a number as Indian Rupee currency string.
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string like "₹1,23,456.78"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Groups transactions by month key.
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object keyed by "YYYY-MM" with arrays of transactions
 */
export function groupByMonth(transactions) {
  return transactions.reduce((groups, tx) => {
    const key = tx.date.slice(0, 7);
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
    return groups;
  }, {});
}

/**
 * Computes the running balance per month from all transactions.
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of { month, balance, label } sorted chronologically
 */
export function getRunningBalance(transactions) {
  const byMonth = groupByMonth(transactions);
  const sortedKeys = Object.keys(byMonth).sort();
  let runningBalance = 0;

  return sortedKeys.map((key) => {
    const txs = byMonth[key];
    const monthNet = txs.reduce((sum, tx) => {
      return tx.type === "income" ? sum + tx.amount : sum - tx.amount;
    }, 0);
    runningBalance += monthNet;

    const [year, month] = key.split("-");
    const label = new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString("en-IN", {
      month: "short",
      year: "2-digit",
    });

    return { month: key, balance: Math.round(runningBalance * 100) / 100, label };
  });
}

/**
 * Derives insights from transaction data.
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Insights: topCategory, monthlyDeltas, alerts
 */
export function calcInsights(transactions) {
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const lastMonthDate = new Date(now);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, "0")}`;

  const byMonth = groupByMonth(transactions);
  const currentMonthTxs = byMonth[currentMonthKey] ?? [];
  const lastMonthTxs = byMonth[lastMonthKey] ?? [];

  const currentExpenses = currentMonthTxs.filter((tx) => tx.type === "expense");
  const lastExpenses = lastMonthTxs.filter((tx) => tx.type === "expense");
  const currentIncome = currentMonthTxs.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);

  const currentTotalExpense = currentExpenses.reduce((s, tx) => s + tx.amount, 0);
  const lastTotalExpense = lastExpenses.reduce((s, tx) => s + tx.amount, 0);

  // Category spending for current month
  const currentCategoryMap = {};
  for (const tx of currentExpenses) {
    currentCategoryMap[tx.category] = (currentCategoryMap[tx.category] ?? 0) + tx.amount;
  }

  const lastCategoryMap = {};
  for (const tx of lastExpenses) {
    lastCategoryMap[tx.category] = (lastCategoryMap[tx.category] ?? 0) + tx.amount;
  }

  // Top category
  const sortedCategories = Object.entries(currentCategoryMap).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0]
    ? {
        name: sortedCategories[0][0],
        amount: sortedCategories[0][1],
        count: currentExpenses.filter((tx) => tx.category === sortedCategories[0][0]).length,
        breakdown: sortedCategories.slice(0, 3).map(([name, amount]) => ({ name, amount })),
      }
    : null;

  // Monthly delta per category
  const allCategories = new Set([...Object.keys(currentCategoryMap), ...Object.keys(lastCategoryMap)]);
  const monthlyDeltas = Array.from(allCategories).map((cat) => {
    const curr = currentCategoryMap[cat] ?? 0;
    const prev = lastCategoryMap[cat] ?? 0;
    const delta = prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;
    return { category: cat, current: curr, previous: prev, delta: Math.round(delta * 10) / 10 };
  });

  // Spending alerts
  const alerts = [];

  if (currentMonthTxs.length === 0) {
    alerts.push({ type: "warning", message: "No transactions recorded yet this month." });
  } else {
    for (const [cat, amount] of Object.entries(currentCategoryMap)) {
      if (currentTotalExpense > 0 && amount / currentTotalExpense >= 0.45) {
        alerts.push({
          type: "warning",
          message: `${cat} dominates your spending this month (${Math.round((amount / currentTotalExpense) * 100)}%).`,
        });
      }
    }
    if (currentTotalExpense > currentIncome) {
      alerts.push({
        type: "danger",
        message: currentIncome === 0 
          ? `You have spent ${formatCurrency(currentTotalExpense)} this month with zero recorded income.`
          : `You've spent more than you earned. Expenses exceed income by ${formatCurrency(currentTotalExpense - currentIncome)}.`,
      });
    } else if (currentIncome > 0 && currentTotalExpense <= currentIncome * 0.6) {
      alerts.push({
        type: "positive",
        message: `Excellent savings rate! You've retained a large portion of your income this month.`,
      });
    }

    if (lastTotalExpense > 0) {
      if (currentTotalExpense < lastTotalExpense * 0.85) {
        alerts.push({
          type: "positive",
          message: `Great job! Your spending is down ${Math.round((1 - currentTotalExpense / lastTotalExpense) * 100)}% compared to last month.`,
        });
      } else if (currentTotalExpense > lastTotalExpense * 1.20) {
        alerts.push({
          type: "danger",
          message: `Watch out! Your spending is up ${Math.round((currentTotalExpense / lastTotalExpense - 1) * 100)}% compared to last month.`,
        });
      }
    }
  }

  return {
    topCategory,
    monthlyDeltas,
    alerts,
    currentTotalExpense,
    lastTotalExpense,
    currentMonthKey,
    lastMonthKey,
  };
}

/**
 * Filters a transactions array based on active filter state.
 * @param {Array} transactions - Full transactions array
 * @param {Object} filters - Filter state { search, category, type, month }
 * @returns {Array} Filtered array
 */
export function filterTransactions(transactions, filters) {
  const { search, category, type, month } = filters;
  return transactions.filter((tx) => {
    const matchesSearch = !search || tx.merchant.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || category === "all" || tx.category === category;
    const matchesType = !type || type === "all" || tx.type === type;
    const matchesMonth = !month || month === "all" || tx.date.startsWith(month);
    return matchesSearch && matchesCategory && matchesType && matchesMonth;
  });
}

/**
 * Sorts transactions by a given key and direction.
 * @param {Array} transactions - Transactions array
 * @param {string} key - Sort key: "date" | "amount" | "merchant"
 * @param {"asc"|"desc"} direction - Sort direction
 * @returns {Array} Sorted array
 */
export function sortTransactions(transactions, key, direction) {
  return [...transactions].sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    if (key === "date") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    } else if (key === "amount") {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Formats a date string as "12 Mar 2025".
 * @param {string} dateStr - ISO date string "YYYY-MM-DD"
 * @returns {string} Formatted date
 */
export function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

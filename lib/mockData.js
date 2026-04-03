const today = new Date();

// Function to make dates relative to today and easy to change easily in mock data
function d(monthsAgo, day) {
  const date = new Date(today);
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(day);
  return date.toISOString().split("T")[0];
}

const MOCK_TRANSACTIONS = [
  // November 2025 (Month 5)
  { id: "tx-100", merchant: "Salary - Tech Corp", category: "Income", type: "income", amount: 68500.00, date: d(5, 1) },
  { id: "tx-101", merchant: "Corner House Ice Creams", category: "Food & Dining", type: "expense", amount: 280.00, date: d(5, 4) },
  { id: "tx-102", merchant: "Namma Yatri Auto", category: "Transport", type: "expense", amount: 154.00, date: d(5, 7) },
  { id: "tx-103", merchant: "BESCOM Bill Payment", category: "Housing", type: "expense", amount: 1240.50, date: d(5, 10) },
  { id: "tx-104", merchant: "BookMyShow - IMAX", category: "Entertainment", type: "expense", amount: 890.00, date: d(5, 15) },
  { id: "tx-105", merchant: "Amazon Echo Dot", category: "Entertainment", type: "expense", amount: 3499.00, date: d(5, 21) },
  { id: "tx-106", merchant: "Apollo Pharmacy", category: "Healthcare", type: "expense", amount: 645.00, date: d(5, 28) },
  { id: "tx-107", merchant: "Truffles Koramangala", category: "Food & Dining", type: "expense", amount: 1150.00, date: d(5, 29) },

  // December 2025 (Month 4)
  { id: "tx-108", merchant: "Salary - Tech Corp", category: "Income", type: "income", amount: 68500.00, date: d(4, 1) },
  { id: "tx-109", merchant: "Annual Bonus", category: "Income", type: "income", amount: 25000.00, date: d(4, 3) },
  { id: "tx-110", merchant: "Star Bazaar Groceries", category: "Food & Dining", type: "expense", amount: 4520.80, date: d(4, 5) },
  { id: "tx-111", merchant: "Cult.fit Annual Pass", category: "Healthcare", type: "expense", amount: 12500.00, date: d(4, 8) },
  { id: "tx-112", merchant: "Airtel Xstream Fiber", category: "Housing", type: "expense", amount: 999.00, date: d(4, 11) },
  { id: "tx-113", merchant: "Rameshwaram Cafe", category: "Food & Dining", type: "expense", amount: 340.00, date: d(4, 16) },
  { id: "tx-114", merchant: "Uber Premier", category: "Transport", type: "expense", amount: 680.00, date: d(4, 22) },
  { id: "tx-115", merchant: "Nykaa Express", category: "Healthcare", type: "expense", amount: 1850.00, date: d(4, 26) },

  // January 2026 (Month 3)
  { id: "tx-116", merchant: "Salary - Tech Corp", category: "Income", type: "income", amount: 68500.00, date: d(3, 1) },
  { id: "tx-117", merchant: "Rent - Indiranagar", category: "Housing", type: "expense", amount: 24000.00, date: d(3, 2) },
  { id: "tx-118", merchant: "Zomato - Meghana Foods", category: "Food & Dining", type: "expense", amount: 620.00, date: d(3, 5) },
  { id: "tx-119", merchant: "Shell Petrol BTM", category: "Transport", type: "expense", amount: 2500.00, date: d(3, 9) },
  { id: "tx-120", merchant: "Netflix Premium", category: "Entertainment", type: "expense", amount: 649.00, date: d(3, 12) },
  { id: "tx-121", merchant: "1mg Lab Tests", category: "Healthcare", type: "expense", amount: 1450.00, date: d(3, 20) },
  { id: "tx-122", merchant: "Third Wave Coffee", category: "Food & Dining", type: "expense", amount: 480.00, date: d(3, 25) },

  // February 2026 (Month 2)
  { id: "tx-123", merchant: "Salary - Tech Corp", category: "Income", type: "income", amount: 68500.00, date: d(2, 1) },
  { id: "tx-124", merchant: "Rent - Indiranagar", category: "Housing", type: "expense", amount: 24000.00, date: d(2, 2) },
  { id: "tx-125", merchant: "Blinkit - Daily Needs", category: "Food & Dining", type: "expense", amount: 845.50, date: d(2, 6) },
  { id: "tx-126", merchant: "Fastag Recharge", category: "Transport", type: "expense", amount: 1000.00, date: d(2, 10) },
  { id: "tx-127", merchant: "Spotify Duo", category: "Entertainment", type: "expense", amount: 149.00, date: d(2, 14) },
  { id: "tx-128", merchant: "Practo Consult", category: "Healthcare", type: "expense", amount: 500.00, date: d(2, 18) },
  { id: "tx-129", merchant: "Urban Company AC Repair", category: "Housing", type: "expense", amount: 1299.00, date: d(2, 22) },
  { id: "tx-130", merchant: "Swiggy Instamart", category: "Food & Dining", type: "expense", amount: 630.25, date: d(2, 27) },

  // March 2026 (Month 1)
  { id: "tx-131", merchant: "Salary - Tech Corp", category: "Income", type: "income", amount: 68500.00, date: d(1, 1) },
  { id: "tx-132", merchant: "Rent - Indiranagar", category: "Housing", type: "expense", amount: 24000.00, date: d(1, 2) },
  { id: "tx-133", merchant: "Empire Restaurant", category: "Food & Dining", type: "expense", amount: 980.00, date: d(1, 4) },
  { id: "tx-134", merchant: "Kempegowda Int'l Airport Cab", category: "Transport", type: "expense", amount: 1050.00, date: d(1, 8) },
  { id: "tx-135", merchant: "PVR Directors Cut", category: "Entertainment", type: "expense", amount: 1250.00, date: d(1, 14) },
  { id: "tx-136", merchant: "Lenskart Store", category: "Healthcare", type: "expense", amount: 3200.00, date: d(1, 19) },
  { id: "tx-137", merchant: "Upwork Freelance Payout", category: "Income", type: "income", amount: 14500.00, date: d(1, 22) },
  { id: "tx-138", merchant: "Zepto Groceries", category: "Food & Dining", type: "expense", amount: 489.00, date: d(1, 26) },

  // April 2026 (Month 0 - Current)
  { id: "tx-139", merchant: "Salary - Tech Corp", category: "Income", type: "income", amount: 68500.00, date: d(0, 1) },
  { id: "tx-140", merchant: "Rent - Indiranagar", category: "Housing", type: "expense", amount: 24000.00, date: d(0, 2) },
  { id: "tx-141", merchant: "Ola Electric", category: "Transport", type: "expense", amount: 890.00, date: d(0, 3) },
  { id: "tx-142", merchant: "FreshToHome", category: "Food & Dining", type: "expense", amount: 620.00, date: d(0, 4) },
  { id: "tx-143", merchant: "Steam Checkout", category: "Entertainment", type: "expense", amount: 2499.00, date: d(0, 4) },
];

export default MOCK_TRANSACTIONS;

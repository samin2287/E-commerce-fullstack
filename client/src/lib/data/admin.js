/** Static admin datasets for tables & charts — UI only */

export const ADMIN_STATS = [
  {
    id: "rev",
    label: "Revenue (30d)",
    value: "$48,290",
    change: "+12.4%",
    trend: "up",
  },
  {
    id: "ord",
    label: "Orders",
    value: "1,842",
    change: "+4.1%",
    trend: "up",
  },
  {
    id: "cus",
    label: "New customers",
    value: "326",
    change: "+2.0%",
    trend: "up",
  },
  {
    id: "aov",
    label: "Avg. order value",
    value: "$62.40",
    change: "-0.8%",
    trend: "down",
  },
];

export const CHART_REVENUE = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  values: [4200, 5100, 4800, 6200, 5900, 7100, 6800],
};

export const CHART_ORDERS = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  values: [120, 190, 150, 220, 260, 310],
};

export const ADMIN_PRODUCTS = [
  {
    id: "p1",
    name: "Organic Cotton Tee",
    sku: "TEE-ORG-S",
    price: 34,
    stock: 120,
    status: "Active",
    category: "Apparel",
  },
  {
    id: "p2",
    name: "Everyday Backpack",
    sku: "BAG-EVD-01",
    price: 89,
    stock: 45,
    status: "Active",
    category: "Bags",
  },
  {
    id: "p3",
    name: "Ceramic Mug Set",
    sku: "HOME-MUG-4",
    price: 28,
    stock: 0,
    status: "Draft",
    category: "Home",
  },
  {
    id: "p4",
    name: "Wireless Earbuds",
    sku: "EL-BUD-PRO",
    price: 129,
    stock: 200,
    status: "Active",
    category: "Electronics",
  },
];

export const ADMIN_ORDERS = [
  {
    id: "ORD-1042",
    customer: "Alex Morgan",
    total: 142.5,
    status: "Shipped",
    date: "2026-04-11",
  },
  {
    id: "ORD-1041",
    customer: "Jamie Chen",
    total: 89,
    status: "Processing",
    date: "2026-04-10",
  },
  {
    id: "ORD-1040",
    customer: "Sam Rivera",
    total: 34,
    status: "Delivered",
    date: "2026-04-09",
  },
  {
    id: "ORD-1039",
    customer: "Taylor Brooks",
    total: 256,
    status: "Cancelled",
    date: "2026-04-08",
  },
];

export const ADMIN_USERS = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "Customer",
    joined: "2025-11-02",
  },
  {
    id: "u2",
    name: "Jamie Chen",
    email: "jamie@example.com",
    role: "Customer",
    joined: "2026-01-14",
  },
  {
    id: "u3",
    name: "Riley Patel",
    email: "riley@example.com",
    role: "Admin",
    joined: "2024-06-20",
  },
];

export const ADMIN_CATEGORIES = [
  { id: "c1", name: "Apparel", slug: "apparel", products: 42 },
  { id: "c2", name: "Home", slug: "home", products: 28 },
  { id: "c3", name: "Electronics", slug: "electronics", products: 19 },
  { id: "c4", name: "Bags", slug: "bags", products: 11 },
];

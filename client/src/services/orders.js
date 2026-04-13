import { ADMIN_ORDERS } from "@/lib/data/admin";

export function getOrders() {
  return ADMIN_ORDERS;
}

export function getOrderById(id) {
  return ADMIN_ORDERS.find((o) => o.id === id) ?? null;
}

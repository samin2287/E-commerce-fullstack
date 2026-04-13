import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { getOrderById } from "@/services/orders";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const order = getOrderById(decodeURIComponent(id));
  return { title: order ? order.id : "Order" };
}

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = getOrderById(decodeURIComponent(id));
  if (!order) notFound();

  const lines = [
    { name: "Subtotal", amount: order.total * 0.86 },
    { name: "Tax", amount: order.total * 0.08 },
    { name: "Shipping", amount: order.total * 0.06 },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Order</p>
          <h2 className="text-2xl font-bold text-zinc-900">{order.id}</h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-900">
          {order.status}
        </span>
      </div>

      <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">Customer</p>
          <p className="mt-1 font-medium text-zinc-900">{order.customer}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">Placed on</p>
          <p className="mt-1 font-medium text-zinc-900">{order.date}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-zinc-900">Line items (demo)</h3>
        <ul className="mt-4 divide-y divide-zinc-100">
          {lines.map((l) => (
            <li key={l.name} className="flex justify-between py-3 text-sm">
              <span className="text-zinc-600">{l.name}</span>
              <span className="font-medium text-zinc-900">${l.amount.toFixed(2)}</span>
            </li>
          ))}
          <li className="flex justify-between py-3 text-base font-semibold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </li>
        </ul>
      </div>

      <Link href="/admin/orders" className="text-sm font-medium text-emerald-800 hover:underline">
        ← Back to orders
      </Link>
    </div>
  );
}

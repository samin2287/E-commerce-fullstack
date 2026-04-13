"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { CHART_COLORS } from "@/lib/constants/theme";
import { CHART_ORDERS, CHART_REVENUE } from "@/lib/data/admin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
);

const commonOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: "#71717a", font: { size: 11 } },
    },
    y: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: "#71717a", font: { size: 11 } },
    },
  },
};

export default function DashboardCharts() {
  const revenueData = {
    labels: CHART_REVENUE.labels,
    datasets: [
      {
        label: "Revenue",
        data: CHART_REVENUE.values,
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primaryMuted,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  const ordersData = {
    labels: CHART_ORDERS.labels,
    datasets: [
      {
        label: "Orders",
        data: CHART_ORDERS.values,
        backgroundColor: "rgba(5, 150, 105, 0.55)",
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-900">Revenue (7 days)</h3>
          <p className="text-xs text-zinc-500">Dummy series for UI preview</p>
        </div>
        <div className="h-64">
          <Line data={revenueData} options={commonOpts} />
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-zinc-900">Orders by month</h3>
          <p className="text-xs text-zinc-500">Dummy aggregates</p>
        </div>
        <div className="h-64">
          <Bar data={ordersData} options={commonOpts} />
        </div>
      </div>
    </div>
  );
}

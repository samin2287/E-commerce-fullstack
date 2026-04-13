import React from "react";
import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/CheckBox";
import Input from "@/components/ui/Input";

export const metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Store profile</h2>
        <p className="mt-1 text-sm text-zinc-600">Branding and contact surfaced on receipts.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Store name" defaultValue="Verdant" />
          <Input label="Support email" defaultValue="support@verdant.shop" />
          <Input className="md:col-span-2" label="Public URL" defaultValue="https://verdant.shop" />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Notifications</h2>
        <p className="mt-1 text-sm text-zinc-600">Operational alerts (UI toggles only).</p>
        <div className="mt-6 space-y-3">
          <CheckBox label="Email digest for low stock" defaultChecked />
          <CheckBox label="Slack webhook for new orders" />
          <CheckBox label="Weekly performance summary" defaultChecked />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="button">Save settings</Button>
      </div>
    </div>
  );
}

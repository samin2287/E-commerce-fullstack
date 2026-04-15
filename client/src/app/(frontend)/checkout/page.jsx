"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/CheckBox";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useShop } from "@/components/shared/AppProviders";

const steps = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const { cartItems, removeFromCart } = useShop();
  const [step, setStep] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get("selected");
  const selectedIds = selectedParam ? selectedParam.split(",").filter(Boolean) : [];
  const checkoutItems = selectedIds.length
    ? cartItems.filter((line) => selectedIds.includes(line.product.id))
    : cartItems;
  const checkoutSubtotal = checkoutItems.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0,
  );

  const handlePlaceOrder = () => {
    checkoutItems.forEach((line) => removeFromCart(line.product.id));
    alert("Demo: order placed.");
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl">Checkout</h1>
      <p className="mt-2 text-sm text-zinc-600">Multi-step flow — static UI only.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              step === i
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Shipping address</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="First name" name="fn" placeholder="Alex" />
                <Input label="Last name" name="ln" placeholder="Morgan" />
                <Input className="md:col-span-2" label="Address" name="a1" placeholder="123 Market St" />
                <Input label="City" name="city" placeholder="San Francisco" />
                <Input label="ZIP" name="zip" placeholder="94103" />
                <Select className="md:col-span-2" label="Country" name="country" defaultValue="US">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </Select>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Payment</h2>
              <Input label="Card number" name="card" placeholder="4242 4242 4242 4242" />
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Expiry" name="exp" placeholder="MM / YY" />
                <Input label="CVC" name="cvc" placeholder="123" />
              </div>
              <CheckBox label="Billing address same as shipping" defaultChecked />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-zinc-900">Review</h2>
              <p className="text-sm text-zinc-600">
                You&apos;re about to place a demo order. No charge will be made.
              </p>
              <ul className="mt-4 divide-y divide-zinc-100 rounded-xl border border-zinc-100">
                {checkoutItems.map(({ product, quantity }) => (
                  <li key={product.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-zinc-800">
                      {product.name} × {quantity}
                    </span>
                    <span className="font-medium text-zinc-900">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {step > 0 ? (
              <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : null}
            {step < 2 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button type="button" disabled={!checkoutItems.length} onClick={handlePlaceOrder}>
                Place order
              </Button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
          <h2 className="text-sm font-semibold text-emerald-900">Cart summary</h2>
          <p className="mt-4 text-3xl font-bold text-emerald-950">${checkoutSubtotal.toFixed(2)}</p>
          <p className="mt-2 text-xs text-emerald-800/80">
            Taxes & shipping shown for display only.
          </p>
          {selectedIds.length ? (
            <p className="mt-2 text-xs font-medium text-emerald-900">
              Checkout for {checkoutItems.length} selected item(s)
            </p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

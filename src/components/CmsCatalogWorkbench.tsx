"use client";

import React, { useState } from "react";
import { CmsProduct, PredefinedPrompt, PromoCode } from "@/lib/types";
import { DEFAULT_PRODUCTS, DEFAULT_PROMPTS, DEFAULT_PROMO_CODES } from "@/lib/defaultData";
import {
  Layers,
  Plus,
  Tag,
  Sparkles,
  CheckCircle,
  Clock,
  Edit3,
  Search,
  DollarSign,
  Globe,
  Sliders,
  X,
  Zap,
} from "lucide-react";

interface CmsCatalogWorkbenchProps {
  onLogEvent?: (msg: string) => void;
}

export function CmsCatalogWorkbench({ onLogEvent }: CmsCatalogWorkbenchProps) {
  const [products, setProducts] = useState<CmsProduct[]>(DEFAULT_PRODUCTS);
  const [prompts, setPrompts] = useState<PredefinedPrompt[]>(DEFAULT_PROMPTS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(DEFAULT_PROMO_CODES);

  // New product form state
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [newProductName, setNewProductName] = useState<string>("");
  const [newProductCategory, setNewProductCategory] = useState<string>("wellness-longevity");
  const [newProductPrice, setNewProductPrice] = useState<number>(99);
  const [newProductInterval, setNewProductInterval] = useState<"one-time" | "monthly">("one-time");
  const [newProductDesc, setNewProductDesc] = useState<string>("");
  const [newProductPromptId, setNewProductPromptId] = useState<string>("prompt_longevity_01");

  // Promo test state
  const [testPromoCode, setTestPromoCode] = useState<string>("WELCOME50");
  const [promoResult, setPromoResult] = useState<{ valid: boolean; message: string; discount?: number } | null>({
    valid: true,
    message: "50% discount applied successfully!",
    discount: 50,
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const newProd: CmsProduct = {
      id: `prod_${Date.now()}`,
      name: newProductName.trim(),
      slug: newProductName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: newProductCategory,
      price: newProductPrice,
      billingInterval: newProductInterval,
      status: "active",
      description: newProductDesc.trim() || "Dynamic consumer service generated via PersonaFlow Headless CMS.",
      features: ["Custom Personalized Synthesis", "Instant PDF Download", "AI Concierge Sync"],
      associatedPromptId: newProductPromptId,
      badge: "New Service",
    };

    setProducts([newProd, ...products]);
    setIsAddingProduct(false);
    setNewProductName("");
    setNewProductDesc("");
    onLogEvent?.(`CMS_EVENT: Created dynamic product "${newProd.name}" ($${newProd.price}) without code deploy`);
  };

  const handleTestPromo = () => {
    const code = testPromoCode.trim().toUpperCase();
    const found = promoCodes.find((p) => p.code === code);
    if (!found) {
      setPromoResult({ valid: false, message: "Invalid promo code" });
    } else if (found.status === "expired") {
      setPromoResult({ valid: false, message: "Promo code expired" });
    } else {
      setPromoResult({
        valid: true,
        message: `Valid! ${found.discountPercent}% discount applied.`,
        discount: found.discountPercent,
      });
      onLogEvent?.(`PROMO_VALIDATE: Promo code "${code}" verified (${found.discountPercent}% OFF)`);
    }
  };

  return (
    <div className="space-y-8">
      {/* CMS Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
              Zero-Code CMS Engine
            </span>
            <span className="text-xs font-mono text-[var(--color-text-muted)]">
              No developer tickets or code redeploy required
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] mt-1">
            Dynamic Products, Predefined Prompts &amp; Promo Code Workbench
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Empowers non-technical staff to launch new services, update pricing, and calibrate AI prompts on the fly.
          </p>
        </div>

        <button
          onClick={() => setIsAddingProduct(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all whitespace-nowrap self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product / Service</span>
        </button>
      </div>

      {/* Add Product Modal / Drawer */}
      {isAddingProduct && (
        <div className="p-6 rounded-2xl bg-[var(--color-panel)] border-2 border-blue-500/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Launch Dynamic Service / Product
              </h3>
            </div>
            <button
              onClick={() => setIsAddingProduct(false)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)] mb-1">
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g. Executive Sleep &amp; Circadian Protocol"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)] mb-1">
                Category
              </label>
              <select
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)]"
              >
                <option value="wellness-longevity">Wellness &amp; Longevity</option>
                <option value="executive-career">Executive Career</option>
                <option value="financial-blueprint">Financial Blueprint</option>
                <option value="life-strategy">Life Strategy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)] mb-1">
                Price (USD $)
              </label>
              <input
                type="number"
                min="1"
                max="9999"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(parseInt(e.target.value) || 0)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)] mb-1">
                Billing Cadence
              </label>
              <select
                value={newProductInterval}
                onChange={(e) => setNewProductInterval(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)]"
              >
                <option value="one-time">One-Time Purchase</option>
                <option value="monthly">Monthly Subscription</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)] mb-1">
                Associated Predefined Prompt Template
              </label>
              <select
                value={newProductPromptId}
                onChange={(e) => setNewProductPromptId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)]"
              >
                {prompts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-[var(--color-text-secondary)] mb-1">
                Consumer Description
              </label>
              <input
                type="text"
                placeholder="High-converting description for the consumer storefront..."
                value={newProductDesc}
                onChange={(e) => setNewProductDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)]"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingProduct(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--color-border)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Publish Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dynamic Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Active Dynamic Services &amp; Subscriptions ({products.length})</span>
          </h3>
          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            Stripe Checkout Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="p-4 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)]">
                    {prod.billingInterval}
                  </span>
                  {prod.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug mb-1">
                  {prod.name}
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-3">
                  {prod.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold font-mono text-[var(--color-text-primary)]">
                    ${prod.price}
                    {prod.billingInterval === "monthly" && (
                      <span className="text-xs font-sans text-[var(--color-text-muted)]">/mo</span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Live
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Code Management & Testing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Promo Codes Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              <span>Promo Code Engine &amp; Discount Rules</span>
            </h3>
            <span className="text-xs font-mono text-[var(--color-text-muted)]">
              {promoCodes.length} Active Rules
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] font-semibold border-b border-[var(--color-border)]">
                <tr>
                  <th className="p-3">CODE</th>
                  <th className="p-3">DISCOUNT</th>
                  <th className="p-3">VALID UNTIL</th>
                  <th className="p-3">REDEMPTIONS</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-panel)] font-mono">
                {promoCodes.map((promo) => (
                  <tr key={promo.code} className="hover:bg-[var(--color-panel-subtle)]/50">
                    <td className="p-3 font-bold text-[var(--color-text-primary)]">
                      {promo.code}
                    </td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      {promo.discountPercent}% OFF
                    </td>
                    <td className="p-3 text-[var(--color-text-muted)]">
                      {promo.validUntil}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">
                      {promo.timesRedeemed} / {promo.maxRedemptions}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          promo.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {promo.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Promo Simulator (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] shadow-sm space-y-4">
          <div className="border-b border-[var(--color-border)] pb-2 flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
              Real-time Promo Validator
            </h4>
            <span className="text-xs font-mono text-emerald-600">Simulate Checkout</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Enter Promo Code to Test:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testPromoCode}
                  onChange={(e) => setTestPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME50"
                  className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono font-bold uppercase rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)]"
                />
                <button
                  type="button"
                  onClick={handleTestPromo}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
            </div>

            {promoResult && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  promoResult.valid
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {promoResult.valid ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <X className="h-4 w-4 text-rose-600" />
                  )}
                  <span>{promoResult.message}</span>
                </div>
                {promoResult.valid && (
                  <div className="mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800/50 flex justify-between font-mono">
                    <span>Base: $149.00</span>
                    <span className="text-emerald-600 font-bold">
                      Discounted: ${(149 * (1 - (promoResult.discount || 0) / 100)).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

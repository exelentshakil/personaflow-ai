import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_PRODUCTS, DEFAULT_PROMPTS, DEFAULT_PROMO_CODES } from "@/lib/defaultData";

export async function GET() {
  return NextResponse.json({
    success: true,
    products: DEFAULT_PRODUCTS,
    prompts: DEFAULT_PROMPTS,
    promoCodes: DEFAULT_PROMO_CODES,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, promoCode } = body;

    if (action === "validate_promo") {
      const found = DEFAULT_PROMO_CODES.find(
        (p) => p.code.toUpperCase() === (promoCode || "").toUpperCase()
      );

      if (!found) {
        return NextResponse.json({ valid: false, message: "Invalid promo code" });
      }

      if (found.status === "expired") {
        return NextResponse.json({ valid: false, message: "This promo code has expired" });
      }

      return NextResponse.json({
        valid: true,
        discountPercent: found.discountPercent,
        code: found.code,
        message: `${found.discountPercent}% discount applied successfully!`,
      });
    }

    return NextResponse.json({ success: true, message: "CMS action completed" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "CMS processing error" },
      { status: 500 }
    );
  }
}

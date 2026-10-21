import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Gift,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    calculation,
    loadingCalculation,
    couponCode,
    applyCoupon,
    removeCoupon,
    giftNote,
    setGiftNote,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [showGiftNoteInput, setShowGiftNoteInput] = useState(Boolean(giftNote));

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  const freeShippingThreshold = calculation?.freeShippingThreshold || 999;
  const currentSubtotal = calculation?.subtotal || 0;
  const progressPercent = Math.min(100, Math.round((currentSubtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-2xs transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F6F0E6] shadow-2xl flex flex-col border-l border-[#EDE3D4] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#254A3B]/10 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#254A3B]" />
              <h2 className="font-serif text-xl font-bold text-[#254A3B]">
                Your Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#EDE3D4]/70 border-b border-[#254A3B]/10 text-xs">
            {amountToFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium text-[#254A3B]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#C87D55]" />
                    Add <strong className="text-[#C87D55]">₹{amountToFreeShipping}</strong> more for <strong>FREE PAN-INDIA SHIPPING</strong>
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden">
                  <div
                    className="h-full bg-[#C87D55] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>🎉 Yay! You have unlocked FREE Pan-India Shipping!</span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xs text-3xl">
                  🧶
                </div>
                <p className="font-serif text-lg font-bold text-[#254A3B]">Your bag is empty</p>
                <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                  Explore our lovingly handcrafted keychains, mini desk flower pots, and bespoke gifts.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 rounded-full bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1f3d30] transition"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const verifiedItem = calculation?.items?.find(
                  (vi) => vi.productId === item.productId && (vi.variantId ?? null) === (item.variantId ?? null)
                );
                const unitPrice = verifiedItem?.unitPrice ?? (item.product?.salePrice ?? item.product?.price ?? 0);
                const itemTotal = unitPrice * item.quantity;
                const img = verifiedItem?.image || item.product?.primaryImage || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80';

                return (
                  <div
                    key={`${item.productId}-${item.variantId}-${idx}`}
                    className="flex gap-3.5 p-3.5 rounded-2xl bg-white border border-[#EDE3D4] shadow-2xs"
                  >
                    <img
                      src={img}
                      alt={item.product?.name || 'Handmade item'}
                      className="w-18 h-18 rounded-xl object-cover flex-shrink-0 bg-[#F6F0E6]"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-serif text-sm font-semibold text-[#254A3B] line-clamp-1">
                            {item.product?.name || verifiedItem?.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            className="text-gray-400 hover:text-red-500 p-1 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.selectedVariant && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/10"
                              style={{ backgroundColor: item.selectedVariant.colorHex || '#E8B4B8' }}
                            />
                            <span className="text-[11px] text-[#8B5A3E] font-medium">
                              {item.selectedVariant.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#254A3B]/20 rounded-lg bg-[#F6F0E6]/50">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-[#254A3B] hover:bg-[#EDE3D4] font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-semibold text-[#254A3B]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-[#254A3B] hover:bg-[#EDE3D4] font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[#254A3B]">
                          ₹{itemTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Area with Coupon, Gift Note & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#254A3B]/10 bg-white space-y-4">
              {/* Gift Note Toggle */}
              <div>
                {!showGiftNoteInput ? (
                  <button
                    onClick={() => setShowGiftNoteInput(true)}
                    className="text-xs font-medium text-[#8B5A3E] hover:text-[#254A3B] flex items-center gap-1.5 transition"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    + Add a free handwritten gift note
                  </button>
                ) : (
                  <div className="space-y-1.5 bg-[#F6F0E6]/60 p-2.5 rounded-xl border border-[#EDE3D4]">
                    <div className="flex items-center justify-between text-xs text-[#8B5A3E] font-semibold">
                      <span className="flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-[#C87D55]" />
                        Handwritten Note (on floral craft paper)
                      </span>
                      <button
                        onClick={() => {
                          setShowGiftNoteInput(false);
                          setGiftNote('');
                        }}
                        className="text-gray-400 hover:text-gray-600 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                    <textarea
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="e.g. Happy Birthday Di! Wishing you infinite joy. With love, Priya"
                      maxLength={180}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-[#254A3B]/15 text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                    />
                    <div className="text-[10px] text-gray-500 text-right">{giftNote.length}/180</div>
                  </div>
                )}
              </div>

              {/* Coupon Form */}
              <div className="space-y-1.5">
                {couponCode ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{couponCode}</strong> applied (-₹{calculation?.discountAmount || 0})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-red-600 font-bold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. WELCOME10)"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#F6F0E6]/50 border border-[#254A3B]/15 text-xs uppercase font-medium placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#EDE3D4] hover:bg-[#254A3B] text-[#254A3B] hover:text-[#F6F0E6] text-xs font-semibold transition"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponMsg && (
                  <p className={`text-[11px] ${couponMsg.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs pt-2 border-t border-[#EDE3D4]">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#254A3B]">₹{calculation?.subtotal ?? currentSubtotal}</span>
                </div>

                {calculation?.discountAmount && calculation.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{calculation.discountAmount}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-gray-600">
                  <span>Pan-India Courier</span>
                  <span className="font-semibold text-[#254A3B]">
                    {calculation?.shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">Free</span>
                    ) : (
                      `₹${calculation?.shippingFee ?? 79}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#254A3B] pt-2 border-t border-[#EDE3D4]">
                  <span>Total Amount</span>
                  <span>₹{calculation?.totalAmount ?? currentSubtotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  onCheckout();
                }}
                disabled={loadingCalculation}
                className="w-full py-3.5 px-4 rounded-xl bg-[#254A3B] text-[#F6F0E6] font-semibold text-sm hover:bg-[#1d3a2e] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-gray-500">
                🔒 Safe & encrypted checkout • UPI, Cards, Net Banking & COD
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

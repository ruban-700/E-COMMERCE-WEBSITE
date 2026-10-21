import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Gift,
  AlertCircle,
  QrCode,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface CheckoutPageProps {
  onBackToShop: () => void;
  onOrderSuccess: (orderData: any) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Delhi (NCR)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onBackToShop,
  onOrderSuccess,
}) => {
  const { items, calculation, couponCode, giftNote, clearCart } = useCart();
  const { user } = useAuth();

  // Contact State
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');

  // Address State
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'test_sandbox'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center text-3xl shadow-xs">
          🧶
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#254A3B]">Your bag is currently empty</h2>
        <p className="text-xs text-gray-600">Please add handmade crafts to your shopping bag before checking out.</p>
        <button
          onClick={onBackToShop}
          className="px-6 py-3 rounded-full bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1e3c30] transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field Validations
    if (!name.trim()) return setErrorMsg('Please enter your full name');
    if (!email.trim() || !email.includes('@')) return setErrorMsg('Please enter a valid email address');
    
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return setErrorMsg('Please enter a valid 10-digit mobile number');

    if (!addressLine1.trim()) return setErrorMsg('Please enter your house/flat number and street');
    if (!city.trim()) return setErrorMsg('Please enter your city/town');

    const cleanPincode = pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) return setErrorMsg('Please enter a valid 6-digit Indian PIN code');

    setLoading(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
        })),
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: cleanPhone,
        },
        address: {
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          city: city.trim(),
          state,
          pincode: cleanPincode,
        },
        giftNote: giftNote.trim() || undefined,
        couponCode: couponCode || undefined,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        onOrderSuccess({
          ...data,
          customerName: name,
          customerEmail: email,
          customerPhone: cleanPhone,
          address: {
            addressLine1,
            addressLine2,
            city,
            state,
            pincode: cleanPincode,
          },
          subtotal: calculation?.subtotal,
          shippingFee: calculation?.shippingFee,
          discountAmount: calculation?.discountAmount,
          totalAmount: data.totalAmount,
          giftNote,
          items: calculation?.items || [],
        });
      } else {
        setErrorMsg(data.error || 'Failed to place order. Please review your details.');
      }
    } catch {
      setErrorMsg('Network error while processing checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={onBackToShop}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#254A3B] hover:text-[#8B5A3E] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (7 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          {/* 1. Contact Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#254A3B] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#254A3B] text-white flex items-center justify-center text-xs">
                  1
                </span>
                Contact Information
              </h2>
              <span className="text-[11px] text-gray-500">Order updates sent via Email & SMS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sen"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number (for Courier Delivery) <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-[#254A3B]/20 rounded-l-xl text-xs text-gray-600 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    maxLength={10}
                    required
                    className="w-full px-3.5 py-2.5 rounded-r-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-2xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#254A3B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#254A3B] text-white flex items-center justify-center text-xs">
                2
              </span>
              Pan-India Delivery Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Flat, House no., Building, Apartment <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Flat 302, Palm Grove Apts"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Area, Street, Sector, Village (Optional)
                </label>
                <input
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="e.g. 14th Main, Indiranagar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B] bg-white cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 560038"
                    maxLength={6}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Gateway Options */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-[#254A3B] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#254A3B] text-white flex items-center justify-center text-xs">
                  3
                </span>
                Payment Options (Indian Gateway Sandbox)
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL Encrypted
              </span>
            </div>

            <div className="space-y-3">
              {/* Option: UPI */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'upi'
                    ? 'border-[#254A3B] bg-[#254A3B]/5 ring-1 ring-[#254A3B]'
                    : 'border-[#EDE3D4] hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-1 accent-[#254A3B]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#254A3B] flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#C87D55]" />
                      UPI (Google Pay / PhonePe / Paytm / BHIM)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Instant & Zero Fee
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pay securely using any Indian UPI app or QR code verification.
                  </p>
                  {paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-[#EDE3D4]">
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                        Enter UPI ID / VPA (Optional for test mode)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis / yourname@ybl"
                        className="w-full px-3 py-2 rounded-lg border border-[#254A3B]/20 text-xs text-[#254A3B]"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Option: Cards & Net Banking */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'card'
                    ? 'border-[#254A3B] bg-[#254A3B]/5 ring-1 ring-[#254A3B]'
                    : 'border-[#EDE3D4] hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 accent-[#254A3B]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#254A3B] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#8B5A3E]" />
                      Credit / Debit Cards & Net Banking
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Visa • RuPay • MC</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Sandbox mode: PCI-DSS compliant secure test flow.
                  </p>
                  {paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-[#EDE3D4] grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number (Test: 4242 •••• •••• 4242)"
                          className="w-full px-3 py-2 rounded-lg border border-[#254A3B]/20 text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-lg border border-[#254A3B]/20 text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          maxLength={4}
                          className="w-full px-3 py-2 rounded-lg border border-[#254A3B]/20 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'cod'
                    ? 'border-[#254A3B] bg-[#254A3B]/5 ring-1 ring-[#254A3B]'
                    : 'border-[#EDE3D4] hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-[#254A3B]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#254A3B] flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-gray-600" />
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] text-gray-500">Pay on Handover</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pay in cash or via delivery agent UPI QR when your parcel arrives.
                  </p>
                </div>
              </label>

              {/* Option: Instant Sandbox Developer Test Flow */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                  paymentMethod === 'test_sandbox'
                    ? 'border-[#254A3B] bg-[#254A3B]/5 ring-1 ring-[#254A3B]'
                    : 'border-[#EDE3D4] hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'test_sandbox'}
                  onChange={() => setPaymentMethod('test_sandbox')}
                  className="mt-1 accent-[#254A3B]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#254A3B] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C87D55]" />
                      Direct Test Sandbox Verification
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                      Testing Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Immediately simulates an approved payment callback with server validation.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#254A3B] text-[#F6F0E6] font-semibold text-base hover:bg-[#1c382d] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying order & reserving crafts...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay & Place Order • ₹{calculation?.totalAmount || 0}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-2xs space-y-6 sticky top-28">
          <h3 className="font-serif text-lg font-bold text-[#254A3B] border-b border-[#EDE3D4] pb-3">
            Order Summary ({items.length} items)
          </h3>

          {/* Items Preview */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {calculation?.items?.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&q=80'}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#F6F0E6] flex-shrink-0"
                />
                <div className="flex-1">
                  <span className="font-semibold text-[#254A3B] block line-clamp-1">{item.name}</span>
                  {item.variantName && (
                    <span className="text-[11px] text-[#8B5A3E] block">{item.variantName}</span>
                  )}
                  <span className="text-gray-500">Qty: {item.quantity}</span>
                </div>
                <span className="font-bold text-[#254A3B]">₹{item.totalPrice}</span>
              </div>
            ))}
          </div>

          {/* Gift note indicator */}
          {giftNote && (
            <div className="p-3 rounded-xl bg-[#F6F0E6] text-xs text-[#8B5A3E] space-y-1">
              <span className="font-semibold flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#C87D55]" />
                Handwritten Note Included:
              </span>
              <p className="italic text-[11px] text-gray-700">"{giftNote}"</p>
            </div>
          )}

          {/* Pricing Totals */}
          <div className="space-y-2 pt-3 border-t border-[#EDE3D4] text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-[#254A3B]">₹{calculation?.subtotal || 0}</span>
            </div>

            {calculation?.discountAmount && calculation.discountAmount > 0 ? (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon Discount ({couponCode})</span>
                <span>-₹{calculation.discountAmount}</span>
              </div>
            ) : null}

            <div className="flex justify-between text-gray-600">
              <span>Pan-India Courier Fee</span>
              <span className="font-semibold text-[#254A3B]">
                {calculation?.shippingFee === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">FREE</span>
                ) : (
                  `₹${calculation?.shippingFee || 79}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#254A3B] pt-3 border-t border-[#EDE3D4]">
              <span>Final Total</span>
              <span className="text-xl">₹{calculation?.totalAmount || 0}</span>
            </div>
          </div>

          {/* Assurance */}
          <div className="p-3.5 rounded-2xl bg-[#EDE3D4]/40 text-[11px] text-[#8B5A3E] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#254A3B]">
              <Truck className="w-4 h-4 text-[#C87D55]" />
              Estimated Delivery: 3–5 Business Days
            </div>
            <p>
              Each craft is wrapped in custom tissue, cushioned in recyclable cardboard, and handed to trusted couriers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

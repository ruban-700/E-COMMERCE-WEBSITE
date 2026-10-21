import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Truck,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderData: any;
  onTrackOrder: (orderNumber: string, contact: string) => void;
  onBackToShop: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  orderData,
  onTrackOrder,
  onBackToShop,
}) => {
  const [copied, setCopied] = useState(false);

  const orderNumber = orderData?.orderNumber || 'BBP-2026-1001';
  const customerEmail = orderData?.customerEmail || '';
  const customerName = orderData?.customerName || 'Valued Customer';
  const totalAmount = orderData?.totalAmount || 0;
  const items = orderData?.items || [];
  const address = orderData?.address;

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi BeePri! I just placed order ${orderNumber} on Buzz by BeePri. Excited to receive my handmade crafts!`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in fade-in zoom-in-95">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE3D4] shadow-md text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8B4B8]/30 text-xs font-semibold text-[#8B5A3E]">
            <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
            Order Confirmed & Payment Verified
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B]">
            Thank You, {customerName}!
          </h1>
          <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Your handmade order has been received by BeePri. We have reserved your items and our studio will begin crafting and packing your parcel with love.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="p-4 rounded-2xl bg-[#F6F0E6] max-w-sm mx-auto flex items-center justify-between border border-[#EDE3D4]">
          <div className="text-left">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">
              Order Number
            </span>
            <span className="font-mono text-base font-bold text-[#254A3B]">
              {orderNumber}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white hover:bg-gray-100 text-[#254A3B] transition border border-[#EDE3D4] flex items-center gap-1 text-xs font-medium"
            title="Copy Order Number"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onTrackOrder(orderNumber, customerEmail)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1e3c30] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </button>

          <a
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition flex items-center justify-center gap-2 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* Order Details Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-2xs space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#254A3B] border-b border-[#EDE3D4] pb-3">
          Order Summary & Delivery Details
        </h3>

        {/* Items */}
        <div className="space-y-3">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=150&q=80'}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#F6F0E6]"
                />
                <div>
                  <span className="font-semibold text-[#254A3B] block">{item.name}</span>
                  {item.variantName && (
                    <span className="text-[11px] text-[#8B5A3E] block">{item.variantName}</span>
                  )}
                  <span className="text-gray-500">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="font-bold text-[#254A3B]">₹{item.totalPrice}</span>
            </div>
          ))}
        </div>

        {/* Address and Total Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#254A3B] uppercase tracking-wider text-[11px] block">
              Shipping Address:
            </span>
            <p className="text-gray-700">{address?.addressLine1}</p>
            {address?.addressLine2 && <p className="text-gray-700">{address.addressLine2}</p>}
            <p className="text-gray-700">{address?.city}, {address?.state} - {address?.pincode}</p>
            <p className="text-gray-500 mt-1">Courier: BlueDart Express (Tracked)</p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <span className="font-bold text-[#254A3B] uppercase tracking-wider text-[11px] block">
              Payment Breakdown:
            </span>
            <div className="text-gray-600">Subtotal: ₹{orderData?.subtotal || totalAmount}</div>
            {orderData?.discountAmount > 0 && (
              <div className="text-emerald-700">Coupon Discount: -₹{orderData.discountAmount}</div>
            )}
            <div className="text-gray-600">Shipping: {orderData?.shippingFee === 0 ? 'FREE' : `₹${orderData?.shippingFee || 79}`}</div>
            <div className="text-base font-bold text-[#254A3B] pt-1 border-t border-[#EDE3D4]">
              Total Paid: ₹{totalAmount}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onBackToShop}
          className="text-xs font-bold text-[#254A3B] hover:text-[#8B5A3E] inline-flex items-center gap-1.5 transition"
        >
          <span>Continue Shopping Handcrafted Treasures</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

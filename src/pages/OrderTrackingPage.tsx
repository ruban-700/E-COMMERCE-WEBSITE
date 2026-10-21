import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  initialContact?: string;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
  initialContact = '',
}) => {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [contact, setContact] = useState(initialContact);
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTracking = async (ordNum: string, cnt: string) => {
    if (!ordNum.trim() || !cnt.trim()) {
      setErrorMsg('Please enter both Order Number and your Email or Mobile Number');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(ordNum.trim())}&contact=${encodeURIComponent(cnt.trim())}`
      );
      const data = await res.json();
      if (res.ok) {
        setTrackingData(data);
      } else {
        setErrorMsg(data.error || 'No matching order found');
        setTrackingData(null);
      }
    } catch {
      setErrorMsg('Failed to fetch tracking data. Please try again.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialContact) {
      fetchTracking(initialOrderNumber, initialContact);
    }
  }, [initialOrderNumber, initialContact]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderNumber, contact);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8B4B8]/40 text-xs font-semibold text-[#254A3B]">
          <Truck className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>Pan-India Live Courier Tracking</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B]">
          Track Your Handmade Order
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Enter your unique order number (starts with BBP-) and the email or phone number used during checkout to check live handcrafting & dispatch status.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-xs">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Order Number (e.g. BBP-2026-XXXX)
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="BBP-..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] uppercase font-mono focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email or 10-Digit Mobile Number
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="name@example.com or phone"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1e3c30] transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 h-10"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Finding...' : 'Track'}</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Live Tracking Result */}
      {trackingData && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE3D4] shadow-md space-y-8 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#EDE3D4] gap-4">
            <div>
              <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block">
                Order Tracking
              </span>
              <h2 className="font-mono text-2xl font-bold text-[#254A3B]">
                {trackingData.order.orderNumber}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Recipient: <strong>{trackingData.order.guestName}</strong> • {trackingData.order.city}, {trackingData.order.state}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#254A3B] text-[#F6F0E6] uppercase tracking-wide">
                {trackingData.order.orderStatus}
              </span>
              <p className="text-[11px] text-[#8B5A3E] font-medium mt-1">
                Courier: {trackingData.order.courierPartner || 'BlueDart Express'}
              </p>
              {trackingData.order.trackingNumber && (
                <p className="text-xs font-mono text-gray-600">
                  AWB: {trackingData.order.trackingNumber}
                </p>
              )}
            </div>
          </div>

          {/* Interactive Visual Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#254A3B]">
              Fulfillment & Handcraft Timeline
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDE3D4]">
              {trackingData.timeline.map((step: any, idx: number) => {
                const isCompleted = step.status === 'completed';
                const isCurrent = step.status === 'current';

                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Circle Pin */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors shadow-2xs ${
                        isCompleted
                          ? 'bg-[#254A3B] text-white'
                          : isCurrent
                          ? 'bg-[#C87D55] text-white ring-4 ring-[#C87D55]/20 animate-pulse'
                          : 'bg-white border-2 border-[#EDE3D4] text-gray-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted || isCurrent ? 'text-[#254A3B]' : 'text-gray-400'
                        }`}
                      >
                        {step.step}
                      </h4>
                      <p className="text-xs text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items In Order */}
          <div className="pt-6 border-t border-[#EDE3D4] space-y-4">
            <h3 className="font-serif text-base font-bold text-[#254A3B]">
              Items In This Package
            </h3>

            <div className="space-y-3">
              {trackingData.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.itemImage || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=100&q=80'}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-[#F6F0E6]"
                    />
                    <div>
                      <span className="font-semibold text-[#254A3B] block">{item.productName}</span>
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

            <div className="flex justify-between items-center text-xs text-gray-600 pt-2">
              <span>Total Paid: <strong className="text-[#254A3B] text-sm">₹{trackingData.order.totalAmount}</strong></span>
              <a
                href={`https://wa.me/919876543210?text=Hi%20BeePri!%20Checking%20up%20on%20my%20order%20${trackingData.order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-bold hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                Ask BeePri on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, FileText } from 'lucide-react';

interface PolicyPageProps {
  initialTab?: string;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'shipping' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B]">
          Store Policies & Transparency
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Everything you need to know about shipping across India, transit care, returns, and privacy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-[#EDE3D4]">
        <button
          onClick={() => setActiveTab('shipping')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'shipping'
              ? 'bg-[#254A3B] text-[#F6F0E6]'
              : 'bg-white border border-[#EDE3D4] text-[#254A3B] hover:bg-[#EDE3D4]'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          Shipping & Delivery
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'returns'
              ? 'bg-[#254A3B] text-[#F6F0E6]'
              : 'bg-white border border-[#EDE3D4] text-[#254A3B] hover:bg-[#EDE3D4]'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Returns & Replacements
        </button>

        <button
          onClick={() => setActiveTab('cancellation')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'cancellation'
              ? 'bg-[#254A3B] text-[#F6F0E6]'
              : 'bg-white border border-[#EDE3D4] text-[#254A3B] hover:bg-[#EDE3D4]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Cancellations
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-[#254A3B] text-[#F6F0E6]'
              : 'bg-white border border-[#EDE3D4] text-[#254A3B] hover:bg-[#EDE3D4]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          Privacy & Terms
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE3D4] shadow-xs text-sm text-gray-700 leading-relaxed space-y-6">
        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#254A3B]">Shipping & Delivery Policy</h2>
            <p>
              At <strong>Buzz by BeePri</strong>, each product is individually handcrafted or packaged with great care in our Indian studio.
            </p>
            <h3 className="font-bold text-[#254A3B] text-base pt-2">1. Shipping Charges & Free Delivery</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>Free Pan-India Delivery:</strong> On all orders above ₹999.</li>
              <li><strong>Standard Shipping:</strong> A flat ₹79 fee applies to orders below ₹999 across all Indian PIN codes.</li>
              <li>No hidden surcharges or surprise packing fees at checkout.</li>
            </ul>

            <h3 className="font-bold text-[#254A3B] text-base pt-2">2. Processing & Dispatch Timelines</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong>In-Stock Products:</strong> Dispatched within 24–48 hours of order confirmation.</li>
              <li><strong>Made-to-Order Crafts:</strong> Handcrafted and dispatched within 2–4 business days.</li>
              <li><strong>Courier Transit:</strong> Metros (Mumbai, Delhi, Bengaluru, Pune, Hyderabad, Chennai) take 2–3 business days. Other regions take 3–5 business days.</li>
            </ul>

            <h3 className="font-bold text-[#254A3B] text-base pt-2">3. Courier Partners & Tracking</h3>
            <p className="text-xs">
              We partner with reputed Indian couriers (BlueDart Express, Delhivery, and IndiaPost Speed Post for remote areas). Once dispatched, a live tracking number and link are provided.
            </p>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#254A3B]">Returns & Replacements Policy</h2>
            <p>
              Because each BeePri piece is handmade and tailored, we take immense pride in quality control before any package leaves our studio.
            </p>
            <h3 className="font-bold text-[#254A3B] text-base pt-2">1. Damage During Transit Guarantee</h3>
            <p className="text-xs">
              In the unlikely event that your ceramic pot, flower craft, or keychain arrives damaged or defective due to rough courier handling:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Please notify us on WhatsApp (+91 98765 43210) or email within <strong>48 hours</strong> of package delivery.</li>
              <li>Share a clear photo or short unboxing video showing the transit damage.</li>
              <li>We will immediately craft and dispatch a <strong>100% free replacement</strong> at zero extra cost to you.</li>
            </ul>

            <h3 className="font-bold text-[#254A3B] text-base pt-2">2. Personalized & Custom Crafts</h3>
            <p className="text-xs">
              Personalized items (such as resin initial charms or custom color sets) cannot be returned for change of mind once handcrafted, but remain fully protected by our transit damage guarantee.
            </p>
          </div>
        )}

        {activeTab === 'cancellation' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#254A3B]">Cancellation Policy</h2>
            <p>
              You may cancel an order within <strong>12 hours</strong> of placing it, provided handcrafting of personalized pieces has not already begun or the order has not been dispatched.
            </p>
            <p className="text-xs">
              To cancel, simply contact us on WhatsApp with your Order Number (BBP-XXXX). If approved, the full amount will be refunded to your original payment method within 3–5 business days.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#254A3B]">Privacy Policy & Data Security</h2>
            <p>
              Buzz by BeePri respects your personal privacy. We only collect the information necessary to fulfill your orders and deliver your handmade parcels safely.
            </p>
            <h3 className="font-bold text-[#254A3B] text-base pt-2">1. Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Contact details (name, delivery address, phone number, email address) strictly to coordinate delivery and send status updates.</li>
              <li>Optional gift note messages for loved ones.</li>
            </ul>

            <h3 className="font-bold text-[#254A3B] text-base pt-2">2. Payment Security</h3>
            <p className="text-xs">
              We never store your credit/debit card numbers or UPI PINs. All payment transactions are encrypted using 256-bit SSL encryption and processed via certified PCI-DSS compliant Indian payment gateways.
            </p>

            <h3 className="font-bold text-[#254A3B] text-base pt-2">3. Zero Third-Party Selling</h3>
            <p className="text-xs">
              We never sell, rent, or trade your personal data to marketing brokers or third parties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

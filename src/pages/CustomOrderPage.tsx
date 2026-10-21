import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Send,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Palette,
  Gift,
} from 'lucide-react';

export const CustomOrderPage: React.FC = () => {
  const [craftType, setCraftType] = useState('Amigurumi / Crochet Keychain');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [personalizationText, setPersonalizationText] = useState('');
  const [colorPreferences, setColorPreferences] = useState('Pastel Warm (Cream, Peach, Sage)');
  const [budgetRange, setBudgetRange] = useState('₹400 - ₹800');
  const [needByDate, setNeedByDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const craftTypes = [
    {
      id: 'Amigurumi / Crochet Keychain',
      icon: '🐝',
      label: 'Amigurumi Keychain',
      desc: 'Bees, sunflowers, animals, fruit charms',
    },
    {
      id: 'Everlasting Desk Flower Pot',
      icon: '🌸',
      label: 'Desk Flower Pot',
      desc: 'Crochet tulips, daisies, ceramic pots',
    },
    {
      id: 'Personalized Initial Charm',
      icon: '✨',
      label: 'Resin & Floral Charm',
      desc: 'Real pressed flowers & gold flakes with initial',
    },
    {
      id: 'Custom Gift Hamper / Box',
      icon: '🎁',
      label: 'Curated Gift Hamper',
      desc: 'Multi-item gift box with personalized cards',
    },
    {
      id: 'Special Bespoke Request',
      icon: '🧵',
      label: 'Something Unique',
      desc: 'Bags, bookmarks, wall hangings & custom ideas',
    },
  ];

  const colorPalettes = [
    'Pastel Warm (Cream, Peach, Sage)',
    'Honey & Sunshine (Golden Yellow, Charcoal)',
    'Blush Floral (Muted Pink, White, Rose)',
    'Forest Earthy (Forest Green, Terracotta, Sand)',
    'Lavender Mist (Soft Violet, Lilac, Silver)',
    'Custom / Specific shades (describe below)',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !email.trim() || !phone.trim() || !description.trim()) {
      setErrorMessage('Please fill in your name, contact info, and craft description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/custom-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          itemType: craftType,
          description,
          personalizationText,
          colorPreferences,
          budgetRange,
          needByDate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit request. Please try again.');
      }
    } catch {
      setErrorMessage('Could not connect to the server. Please check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setDescription('');
    setPersonalizationText('');
    setNeedByDate('');
  };

  const whatsappMessage = encodeURIComponent(
    `Hi BeePri! I just submitted a custom order for "${craftType}". My name is ${customerName}. Let's discuss!`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8B4B8]/40 text-xs font-semibold text-[#254A3B]">
          <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>Bespoke Handmade Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#254A3B]">
          Craft Something One-of-a-Kind
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
          Whether you want a personalized birthday amigurumi, customized wedding favors, or a flower pot in your favorite colors — BeePri handcrafts each bespoke request with meticulous devotion.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EDE3D4] shadow-md text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#254A3B]">
              Your Request is With BeePri!
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{customerName}</strong>! We have received your custom craft details for <strong>{craftType}</strong>. BeePri will review the materials, sketch, and get in touch with you via WhatsApp or Email within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F0E6] max-w-md mx-auto text-xs text-[#8B5A3E] space-y-1 text-left">
            <p><strong>Craft:</strong> {craftType}</p>
            {personalizationText && <p><strong>Custom Name/Initial:</strong> {personalizationText}</p>}
            <p><strong>Palette:</strong> {colorPreferences}</p>
            <p><strong>Budget Target:</strong> {budgetRange}</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/919876543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition flex items-center justify-center gap-2 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with BeePri on WhatsApp Now
            </a>

            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#EDE3D4] text-[#254A3B] text-xs font-semibold hover:bg-[#254A3B] hover:text-[#F6F0E6] transition"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE3D4] shadow-xs space-y-8">
          {/* Step 1: Craft Type */}
          <div className="space-y-3">
            <label className="block font-serif text-lg font-bold text-[#254A3B]">
              1. What would you like us to handcraft?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {craftTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setCraftType(type.id)}
                  className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    craftType === type.id
                      ? 'border-[#254A3B] bg-[#254A3B]/5 ring-2 ring-[#254A3B]/20'
                      : 'border-[#EDE3D4] hover:border-gray-300 bg-[#F6F0E6]/30'
                  }`}
                >
                  <span className="text-2xl mb-2">{type.icon}</span>
                  <div>
                    <span className="font-semibold text-xs text-[#254A3B] block">{type.label}</span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">{type.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Customization Details */}
          <div className="space-y-4 pt-4 border-t border-[#EDE3D4]">
            <label className="block font-serif text-lg font-bold text-[#254A3B]">
              2. Customization & Personalization
            </label>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Personalized Name, Initial, or Phrase (Optional)
              </label>
              <input
                type="text"
                value={personalizationText}
                onChange={(e) => setPersonalizationText(e.target.value)}
                placeholder="e.g. Initial 'A' with gold flakes, or name 'Aadya' on crochet tag"
                className="w-full px-4 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Color Palette Preference
              </label>
              <select
                value={colorPreferences}
                onChange={(e) => setColorPreferences(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B] bg-white cursor-pointer"
              >
                {colorPalettes.map((pal, idx) => (
                  <option key={idx} value={pal}>
                    {pal}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Tell us about your idea & details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder="Describe what you have in mind! (e.g. A lavender desk pot with 3 mini blooms, with a small bumblebee charm attached to the ceramic rim for my best friend's desk)"
                className="w-full p-4 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#254A3B] leading-relaxed"
              />
            </div>
          </div>

          {/* Step 3: Timing & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EDE3D4]">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Budget Target (Estimated)
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B] bg-white cursor-pointer"
              >
                <option value="Under ₹500">Under ₹500 (Single keychain/charm)</option>
                <option value="₹500 - ₹999">₹500 - ₹999 (Mini pot / duo set)</option>
                <option value="₹1000 - ₹2000">₹1000 - ₹2000 (Complete gift hamper)</option>
                <option value="₹2000+">₹2000+ (Bulk wedding/event favors)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Need-by Event Date (Optional)
              </label>
              <input
                type="date"
                value={needByDate}
                onChange={(e) => setNeedByDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B] bg-white cursor-pointer"
              />
            </div>
          </div>

          {/* Step 4: Contact Details */}
          <div className="space-y-4 pt-4 border-t border-[#EDE3D4]">
            <label className="block font-serif text-lg font-bold text-[#254A3B]">
              3. Where should BeePri send the quote & preview?
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
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
                  WhatsApp / Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#254A3B] text-[#F6F0E6] font-semibold text-sm hover:bg-[#1c382d] transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Sending details to BeePri...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Custom Craft Request</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-gray-500 mt-2">
              Free consultation • No payment required upfront until design & quote are approved.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

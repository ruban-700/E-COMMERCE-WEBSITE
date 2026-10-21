import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ContactFaqPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How long does handcrafting and delivery take across India?',
      a: 'Ready-to-ship items (like our in-stock sunflower and bumblebee keychains) are dispatched within 24–48 hours. Made-to-order crafts (such as everlasting ceramic pots or bespoke initial charms) take 2–3 business days to handcraft. Once dispatched via BlueDart or IndiaPost, delivery typically takes 2–4 days for metros and 3–5 days for other Indian towns.',
    },
    {
      q: 'Are all your products genuinely handmade?',
      a: 'Yes, 100%! Every single crochet stitch, amigurumi plush, hand-poured terrazzo pot, and embroidered bookmark is created individually by BeePri and our artisan hands in India. We do not use assembly-line mass production or plastic molds.',
    },
    {
      q: 'Can I include a personalized gift note for someone?',
      a: 'Absolutely! At checkout or in your shopping bag, simply check the "Add a free handwritten gift note" box and write your message. We write it with real dip pen and ink on textured floral paper and tuck it into the package.',
    },
    {
      q: 'How do I care for my crochet items and ceramic pots?',
      a: 'For crochet crafts: Gentle spot cleaning with a damp microfiber cloth and mild soap is recommended. Avoid harsh machine washing. For ceramic pots: Wipe gently with a dry or lightly dampened cloth. Keep away from prolonged standing water.',
    },
    {
      q: 'What is your transit damage policy?',
      a: 'We pack every parcel with extra layers of eco-cushioning. However, in the rare event of transit damage by the courier, simply message us on WhatsApp with an unboxing photo within 48 hours of receipt, and we will dispatch a free replacement immediately.',
    },
    {
      q: 'Which payment methods do you support?',
      a: 'We support all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, RuPay, Mastercard), Net Banking, and Cash on Delivery (COD) for eligible pin codes.',
    },
  ];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8B4B8]/40 text-xs font-semibold text-[#254A3B]">
          <MessageCircle className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>We're Here to Help</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#254A3B]">
          Contact Us & Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
          Have a question about a handmade order, customization, or shipping? Reach out to BeePri directly or find quick answers below.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <a
          href="https://wa.me/919876543210?text=Hi%20BeePri!%20I'd%20like%20to%20ask%20a%20question"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs hover:shadow-md transition text-center space-y-2 group cursor-pointer"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#254A3B]">WhatsApp Support</h3>
          <p className="text-xs text-gray-600">+91 98765 43210</p>
          <span className="text-[11px] text-[#25D366] font-semibold block pt-1">
            Fastest reply • 10 AM - 7 PM IST
          </span>
        </a>

        <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#254A3B]/10 text-[#254A3B] flex items-center justify-center text-xl">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#254A3B]">Email Us</h3>
          <p className="text-xs text-gray-600">hello@buzzbybeepri.com</p>
          <span className="text-[11px] text-[#8B5A3E] font-semibold block pt-1">
            Replies within 1 business day
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#C87D55]/10 text-[#C87D55] flex items-center justify-center text-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#254A3B]">Artisan Studio</h3>
          <p className="text-xs text-gray-600">Indiranagar, Bengaluru, India</p>
          <span className="text-[11px] text-[#8B5A3E] font-semibold block pt-1">
            Handcrafted with slow patience
          </span>
        </div>
      </div>

      {/* Main Grid: FAQ Accordion + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* FAQs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-[#254A3B] mb-2">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#EDE3D4] overflow-hidden transition shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-sm font-bold text-[#254A3B] cursor-pointer hover:bg-[#F6F0E6]/50 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#C87D55] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-700 leading-relaxed border-t border-gray-100 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE3D4] shadow-2xs space-y-5">
          <h2 className="font-serif text-2xl font-bold text-[#254A3B]">
            Send BeePri a Message
          </h2>
          <p className="text-xs text-gray-600">
            Have a question or feedback? We’d love to hear from you.
          </p>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-2 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-bold text-sm">Message Sent!</p>
              <p className="text-xs">
                Thank you for getting in touch. The BeePri team will respond via email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-semibold underline text-emerald-900"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Diya Sen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B] bg-white cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Existing Order Question">Existing Order Question</option>
                  <option value="Custom Order Inquiry">Custom Order Inquiry</option>
                  <option value="Bulk Wedding / Corporate Favors">Bulk Wedding / Corporate Favors</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="How can BeePri assist you?"
                  className="w-full p-3.5 rounded-xl border border-[#254A3B]/20 text-xs text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1e3c30] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

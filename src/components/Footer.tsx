import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Instagram,
  Mail,
  Send,
  Sparkles,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, categorySlug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#254A3B] text-[#F6F0E6] pt-16 pb-8 border-t-4 border-[#C87D55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#F6F0E6]/15">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐝</span>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight text-[#F6F0E6]">
                  Buzz by BeePri
                </h3>
                <p className="font-handwriting text-lg text-[#E8B4B8] tracking-wide">
                  Small Things, Made with Love
                </p>
              </div>
            </div>

            <p className="text-sm text-[#F6F0E6]/80 leading-relaxed max-w-sm">
              We handcraft whimsical crochet charms, blooming desk flower pots, and bespoke gift hampers designed to bring warmth, smile, and handmade joy to your everyday life.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/919876543210?text=Hi%20BeePri!%20I'm%20inquiring%20about%20a%20handmade%20craft"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20ba5a] transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-[#F6F0E6] text-xs font-semibold transition"
              >
                <Instagram className="w-4 h-4 text-[#E8B4B8]" />
                @buzzbybeepri
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#E8B4B8] tracking-wider uppercase text-xs">
              Handmade Catalogue
            </h4>
            <ul className="space-y-2 text-sm text-[#F6F0E6]/80">
              <li>
                <button
                  onClick={() => onNavigate('shop', 'all')}
                  className="hover:text-white transition cursor-pointer"
                >
                  All Creations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'keychains')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Crochet Keychains
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'flower-pots')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Everlasting Flower Pots
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'accessories')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Handmade Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', 'gift-sets')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Curated Gift Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('custom')}
                  className="hover:text-white transition cursor-pointer text-[#E8B4B8] font-medium"
                >
                  ✨ Request Custom Craft
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#E8B4B8] tracking-wider uppercase text-xs">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-[#F6F0E6]/80">
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition cursor-pointer"
                >
                  The BeePri Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Contact & FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy', 'shipping')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy', 'returns')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Returns & Cancellations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('policy', 'privacy')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-[#E8B4B8] tracking-wider uppercase text-xs">
              Join the Hive
            </h4>
            <p className="text-xs text-[#F6F0E6]/80 leading-relaxed">
              Get secret drop previews, handmade crafting stories, and an instant 10% coupon for your first order.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-white/10 text-xs text-[#E8B4B8] border border-[#E8B4B8]/30">
                🎉 Welcome to the BeePri family! Use code <strong>WELCOME10</strong> at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-[#F6F0E6]/20 text-white placeholder-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-[#C87D55] text-white hover:bg-[#b56d47] transition flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">No spam. Only handmade love & discount codes.</p>
              </form>
            )}

            <div className="pt-2 text-xs text-[#F6F0E6]/70 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-[#E8B4B8]" />
              <span>Pan-India Courier via BlueDart & IndiaPost</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6F0E6]/60 gap-4">
          <p>© {new Date().getFullYear()} Buzz by BeePri. Handcrafted with love in India.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8B4B8]" />
              100% Encrypted & Secure Checkout
            </span>
            <span>•</span>
            <span>Slow & Sustainable Crafting</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

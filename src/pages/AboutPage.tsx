import React from 'react';
import { Heart, Sparkles, Package, Smile, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC<{ onExploreShop: () => void }> = ({ onExploreShop }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8B4B8]/40 text-xs font-semibold text-[#254A3B]">
          <Heart className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>Our Story & Philosophy</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#254A3B]">
          Small Things, Made with Love
        </h1>
        <p className="font-handwriting text-2xl text-[#8B5A3E]">
          The gentle art of slow crafting in a fast-paced world
        </p>
      </div>

      {/* Main Story Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white aspect-4/5">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
            alt="Handcrafting in studio"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#254A3B]">
            How BeePri Started
          </h2>
          <p>
            It started at a wooden study table with a single ball of honeycomb-yellow cotton yarn, a size 2.5mm crochet hook, and a deep love for tactile handmade miniatures.
          </p>
          <p>
            Our founder, fondly called <strong>BeePri</strong> by friends, started handcrafting small bumblebee charms as birthday surprises for college roommates and cousins. The joy of opening a package where every single knot, stitch, and ribbon had been placed by human hands sparked what would become <strong>Buzz by BeePri</strong>.
          </p>
          <p>
            Today, our small studio in India creates handmade crochet keyrings, handcrafted ceramic desk flower pots that never wilt, and bespoke gift boxes sent to homes from Kashmir to Kanyakumari.
          </p>
        </div>
      </div>

      {/* Our 4 Core Promises */}
      <div className="space-y-6 pt-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A3E]">
            Our Craft Constitution
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#254A3B]">
            What We Stand For
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
            <span className="text-2xl">🌱</span>
            <h4 className="font-serif text-base font-bold text-[#254A3B]">100% Honest Handcrafting</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              No plastic factories or mass molds. If an item says handmade, it was crocheted, molded, or painted right here in our Indian studio.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
            <span className="text-2xl">📦</span>
            <h4 className="font-serif text-base font-bold text-[#254A3B]">Plastic-Free Slow Packaging</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              We package every parcel using recycled kraft boxes, real botanical sprigs, floral craft paper, and jute twine — gentle on the earth.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
            <span className="text-2xl">💌</span>
            <h4 className="font-serif text-base font-bold text-[#254A3B]">The Power of Handwritten Words</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every gift should feel personal. That's why we write custom handwritten notes with dip pen and ink on textured floral paper for free.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-2">
            <span className="text-2xl">🤝</span>
            <h4 className="font-serif text-base font-bold text-[#254A3B]">Safe Delivery Guarantee</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Each ceramic pot and amigurumi is carefully cushioned. If anything arrives damaged during courier transit, we replace it free with zero hassle.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <button
          onClick={onExploreShop}
          className="px-8 py-4 rounded-2xl bg-[#254A3B] text-[#F6F0E6] text-sm font-semibold hover:bg-[#1e3c30] transition shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Our Handmade Creations</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

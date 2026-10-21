import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Package,
  ShieldCheck,
  Truck,
  Star,
  Instagram,
  Clock,
  Gift,
} from 'lucide-react';
import { Category, Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface HomePageProps {
  categories: Category[];
  featuredProducts: Product[];
  onNavigate: (view: string, categorySlug?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  featuredProducts,
  onNavigate,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EDE3D4]/80 to-[#F6F0E6] pt-10 pb-16 sm:py-20 border-b border-[#EDE3D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brand Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8B4B8]/40 border border-[#E8B4B8] text-xs font-semibold text-[#254A3B]">
                <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
                <span>Handmade with Organic Cotton & Ceramic Clay</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#254A3B] leading-[1.15]">
                Small Things, <br className="hidden sm:inline" />
                <span className="italic font-normal font-handwriting text-5xl sm:text-6xl lg:text-7xl text-[#C87D55] block sm:inline mt-1 sm:mt-0">
                  Made with Love.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#254A3B]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to <strong>Buzz by BeePri</strong>. Discover hand-crocheted keychains, blooming everlasting desk flower pots, and bespoke gift hampers designed to brighten your everyday life.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <button
                  onClick={() => onNavigate('shop', 'all')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#254A3B] text-[#F6F0E6] font-semibold text-sm hover:bg-[#1c382d] transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Handmade Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('custom')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-[#254A3B]/20 text-[#254A3B] font-semibold text-sm hover:bg-[#EDE3D4] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C87D55]" />
                  <span>Design Custom Gift</span>
                </button>
              </div>

              {/* Pan-India Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-[#8B5A3E]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#254A3B]" /> Pan-India Express Delivery
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#254A3B]" /> 100% Plastic-Free Packaging
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#C87D55]" /> 1000+ Happy Gift Givers
                </span>
              </div>
            </div>

            {/* Right Column: Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Decorative blob behind */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#E8B4B8]/40 via-[#EDE3D4] to-[#C87D55]/20 rounded-3xl transform rotate-2 blur-xs" />

                {/* Main Featured Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=800&q=80"
                    alt="Handmade Bumblebee and Crochet Sunflower by BeePri"
                    className="w-full h-80 sm:h-96 object-cover"
                  />

                  {/* Floating Handcrafted Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-[#EDE3D4] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#254A3B] text-white flex items-center justify-center text-xl">
                        🐝
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#254A3B] block">Little Bumblebee Amigurumi</span>
                        <span className="text-[11px] text-[#8B5A3E] font-medium">Original BeePri Handcraft • ₹249</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#E8B4B8]/40 text-[#254A3B] text-[10px] font-bold">
                      Bestseller
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#EDE3D4] shadow-2xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#254A3B]/10 flex items-center justify-center text-lg">
              🧵
            </div>
            <h3 className="font-serif text-sm font-bold text-[#254A3B]">Slow, Gentle Crafting</h3>
            <p className="text-xs text-gray-600">Every stitch is made by hand with organic combed yarn.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EDE3D4] shadow-2xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#254A3B]/10 flex items-center justify-center text-lg">
              📦
            </div>
            <h3 className="font-serif text-sm font-bold text-[#254A3B]">Eco-Friendly Packaging</h3>
            <p className="text-xs text-gray-600">Recycled kraft boxes, floral paper & dried botanicals.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EDE3D4] shadow-2xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#254A3B]/10 flex items-center justify-center text-lg">
              ✍️
            </div>
            <h3 className="font-serif text-sm font-bold text-[#254A3B]">Free Handwritten Notes</h3>
            <p className="text-xs text-gray-600">Add a personal message written in ink for your loved ones.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EDE3D4] shadow-2xs text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#254A3B]/10 flex items-center justify-center text-lg">
              🚚
            </div>
            <h3 className="font-serif text-sm font-bold text-[#254A3B]">Safe Pan-India Transit</h3>
            <p className="text-xs text-gray-600">Tracked shipping across Indian metros & towns.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS / CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A3E]">
            Handcrafted Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B]">
            Explore by Craft
          </h2>
          <p className="text-sm text-gray-600 max-w-lg mx-auto">
            Find the perfect companion for your keys, your desk, or a special milestone celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', cat.slug)}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-[#EDE3D4]"
            >
              <img
                src={cat.imageUrl || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#254A3B]/90 via-[#254A3B]/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-semibold text-[#E8B4B8] uppercase tracking-wider">
                  Handcrafted
                </span>
                <h3 className="font-serif text-xl font-bold mt-1 group-hover:text-[#E8B4B8] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-200 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#F6F0E6]">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS & NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A3E]">
              Loved by Our Hive
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B]">
              Bestselling Creations
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop', 'all')}
            className="text-xs font-bold text-[#254A3B] hover:text-[#8B5A3E] flex items-center gap-1.5 border-b border-[#254A3B] pb-0.5 transition"
          >
            <span>View All Creations ({featuredProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. THE MAKER'S STORY */}
      <section className="bg-white border-y border-[#EDE3D4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-lg border-4 border-[#F6F0E6]">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
                  alt="BeePri handcrafting embroidery in studio"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:right-6 p-4 rounded-2xl bg-[#254A3B] text-[#F6F0E6] shadow-md max-w-xs text-xs space-y-1">
                <span className="font-handwriting text-base text-[#E8B4B8] block">Crafted in India</span>
                <p>No assembly lines. Every flower, stitch, and loop begins with slow patience.</p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A3E]">
                Behind the Brand
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B] leading-tight">
                Meet BeePri: Turning Little Skeins into Big Smiles
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Buzz by BeePri began with a simple belief: in a world of rushed mass manufacturing, there is something deeply grounding about holding something made by a human hand.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                From hand-crocheting amigurumi honeybees late at night to molding pastel terrazzo ceramic pots that never fade, each piece is designed to be a gentle, cheerful keepsake — whether gifted to a dear friend on their birthday, or treated to yourself for your desk.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 rounded-xl bg-[#EDE3D4] text-[#254A3B] text-xs font-bold hover:bg-[#254A3B] hover:text-[#F6F0E6] transition flex items-center gap-2"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GENUINE CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A3E]">
            Kind Words
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B]">
            From Happy Customers in India
          </h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Genuine notes shared by people who received BeePri crafts for birthdays, desk decor, and surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "I ordered the Bumblebee crochet keychain and the crochet tulip pot for my sister's birthday in Mumbai. The packaging arrived with a handwritten note and dried flowers! The quality of the stitches is incredible."
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#254A3B] block">Ananya Sharma</span>
                <span className="text-gray-500">Mumbai, Maharashtra</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Verified Order
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "The Everlasting Pink Tulip sits right beside my monitor in Bengaluru. It brightens every work call! It really feels made with genuine heart and attention."
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#254A3B] block">Rohit Mehra</span>
                <span className="text-gray-500">Bengaluru, Karnataka</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Verified Order
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#EDE3D4] shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "Requested a custom letter initial keychain with pressed sunflowers for my best friend. BeePri messaged me on WhatsApp with the color options and dispatched it in 2 days. 10/10 experience!"
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#254A3B] block">Sneha Varma</span>
                <span className="text-gray-500">Pune, Maharashtra</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Verified Custom Order
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOM ORDER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#254A3B] via-[#203f32] to-[#254A3B] p-8 sm:p-12 text-[#F6F0E6] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl border border-[#C87D55]/30">
          <div className="space-y-3 text-center lg:text-left max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#E8B4B8]">
              <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8]" />
              Bespoke Handcrafted Orders
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Have a special idea, color, or personalized name in mind?
            </h2>
            <p className="text-sm text-[#F6F0E6]/80 leading-relaxed">
              We create custom amigurumi keychains, personalized initials, wedding hampers, and custom desk pots. Share your vision and we will handcraft it for you.
            </p>
          </div>

          <button
            onClick={() => onNavigate('custom')}
            className="px-8 py-4 rounded-2xl bg-[#C87D55] text-white font-semibold text-sm hover:bg-[#b56d47] transition shadow-md flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>Request a Custom Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 8. INSTAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8B5A3E]">
              Studio Diary
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#254A3B] flex items-center gap-2">
              <Instagram className="w-6 h-6 text-[#C87D55]" />
              Follow @buzzbybeepri
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#254A3B] hover:text-[#8B5A3E] flex items-center gap-1 border-b border-[#254A3B] pb-0.5"
          >
            <span>Visit Instagram Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xs group relative">
            <img
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80"
              alt="BeePri crochet in progress"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #CrochetSunflower
            </div>
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xs group relative">
            <img
              src="https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=400&q=80"
              alt="Bumblebee handmade craft"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #BeePriHive
            </div>
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xs group relative">
            <img
              src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80"
              alt="Tulip desk pot"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #DeskDecor
            </div>
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-2xs group relative">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80"
              alt="Kraft gift box packaging"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              #HandmadeGifts
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

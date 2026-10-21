import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sparkles,
  Heart,
  Truck,
  ShieldCheck,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useStoreSettings } from '../context/StoreSettingsContext.tsx';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCategorySlug?: string;
  setSelectedCategorySlug?: (slug: string) => void;
  onSearch?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  setSelectedCategorySlug,
  onSearch,
}) => {
  const { totalItemsCount, openCart } = useCart();
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const { settings } = useStoreSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view: string, categorySlug?: string) => {
    setCurrentView(view);
    if (categorySlug !== undefined && setSelectedCategorySlug) {
      setSelectedCategorySlug(categorySlug);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearch) {
      onSearch(searchTerm.trim());
      setCurrentView('shop');
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* Announcement Bar */}
      {settings.announcementBanner && (
        <div className="bg-[#254A3B] text-[#F6F0E6] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 tracking-wide transition-all">
          <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8] animate-pulse flex-shrink-0" />
          <span>{settings.announcementBanner}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="bg-[#F6F0E6]/95 backdrop-blur-md border-b border-[#254A3B]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#254A3B] hover:bg-[#EDE3D4] transition"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo & Tagline */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left group flex items-center gap-3 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-[#254A3B] text-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  🐝
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#254A3B] block leading-none">
                    Buzz by BeePri
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-[#8B5A3E] font-handwriting text-base tracking-wider block mt-0.5">
                    Small Things, Made with Love
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className={`transition-colors cursor-pointer ${
                  currentView === 'home' ? 'text-[#254A3B] font-bold border-b-2 border-[#254A3B] pb-1' : 'text-[#254A3B]/80 hover:text-[#254A3B]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop', 'all')}
                className={`transition-colors cursor-pointer ${
                  currentView === 'shop' ? 'text-[#254A3B] font-bold border-b-2 border-[#254A3B] pb-1' : 'text-[#254A3B]/80 hover:text-[#254A3B]'
                }`}
              >
                Shop All
              </button>
              <button
                onClick={() => handleNavClick('shop', 'keychains')}
                className="text-[#254A3B]/80 hover:text-[#254A3B] transition-colors cursor-pointer"
              >
                Keychains
              </button>
              <button
                onClick={() => handleNavClick('shop', 'flower-pots')}
                className="text-[#254A3B]/80 hover:text-[#254A3B] transition-colors cursor-pointer"
              >
                Flower Pots
              </button>
              <button
                onClick={() => handleNavClick('shop', 'gift-sets')}
                className="text-[#254A3B]/80 hover:text-[#254A3B] transition-colors cursor-pointer"
              >
                Gift Sets
              </button>
              <button
                onClick={() => handleNavClick('custom')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  currentView === 'custom'
                    ? 'bg-[#254A3B] text-[#F6F0E6]'
                    : 'bg-[#E8B4B8]/40 text-[#254A3B] hover:bg-[#E8B4B8]/70'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
                Custom Orders
              </button>
              <button
                onClick={() => handleNavClick('track')}
                className={`transition-colors cursor-pointer ${
                  currentView === 'track' ? 'text-[#254A3B] font-bold border-b-2 border-[#254A3B] pb-1' : 'text-[#254A3B]/80 hover:text-[#254A3B]'
                }`}
              >
                Track Order
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-[#254A3B]/80 hover:text-[#254A3B] transition-colors cursor-pointer"
              >
                Our Story
              </button>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-[#254A3B] hover:bg-[#EDE3D4] transition"
                aria-label="Search Store"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account / Google Sign-in */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-[#EDE3D4] transition"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-7 h-7 rounded-full border border-[#254A3B]/30 object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#254A3B] text-white flex items-center justify-center text-xs font-semibold">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#254A3B]/20 hover:bg-[#EDE3D4] transition text-[#254A3B]"
                  >
                    <User className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                )}

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#EDE3D4] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-[#254A3B] truncate">{user?.displayName || user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-[#254A3B] text-[#F6F0E6] rounded-full">
                          Store Admin
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#254A3B] hover:bg-[#F6F0E6] flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#8B5A3E]" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleNavClick('track');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#254A3B] hover:bg-[#F6F0E6] flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4 text-gray-400" />
                      Track My Orders
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Quick Link Button (Visible if admin or for testing) */}
              <button
                onClick={() => handleNavClick('admin')}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-[#254A3B]/10 text-[#254A3B] hover:bg-[#254A3B]/20 transition"
                title="Store Admin Panel"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full bg-[#254A3B] text-[#F6F0E6] hover:bg-[#1e3c30] transition shadow-xs flex items-center justify-center cursor-pointer"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C87D55] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F6F0E6] shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Search Input */}
          {searchOpen && (
            <div className="py-3 pb-4 border-t border-[#254A3B]/10 animate-in fade-in slide-in-from-top-1">
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search handmade keychains, flower pots, gift sets, crafts..."
                  className="w-full pl-11 pr-24 py-2.5 rounded-full bg-white border border-[#254A3B]/20 text-[#254A3B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#254A3B] text-sm shadow-xs"
                  autoFocus
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1e3c30] transition"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F6F0E6] border-b border-[#254A3B]/20 px-4 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-2 text-base font-medium">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop', 'all')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Shop All Handmade
              </button>
              <button
                onClick={() => handleNavClick('shop', 'keychains')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Handmade Keychains
              </button>
              <button
                onClick={() => handleNavClick('shop', 'flower-pots')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Flower Pots & Floral Crafts
              </button>
              <button
                onClick={() => handleNavClick('shop', 'accessories')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Handmade Accessories
              </button>
              <button
                onClick={() => handleNavClick('shop', 'gift-sets')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Curated Gift Sets
              </button>
              <button
                onClick={() => handleNavClick('custom')}
                className="text-left py-2 px-3 rounded-lg bg-[#E8B4B8]/50 text-[#254A3B] font-semibold flex items-center justify-between"
              >
                <span>Personalised & Custom Orders</span>
                <Sparkles className="w-4 h-4 text-[#8B5A3E]" />
              </button>
              <button
                onClick={() => handleNavClick('track')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Track Your Order
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                About BeePri & Slow Craft
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left py-2 px-3 rounded-lg hover:bg-[#EDE3D4] text-[#254A3B]"
              >
                Contact & FAQs
              </button>

              <div className="pt-3 border-t border-[#254A3B]/10 flex flex-col gap-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="py-2 px-3 rounded-lg bg-[#254A3B]/10 text-[#254A3B] font-semibold flex items-center justify-between"
                >
                  <span>Admin Dashboard</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>

                {!user ? (
                  <button
                    onClick={signInWithGoogle}
                    className="py-2.5 px-4 rounded-xl bg-[#254A3B] text-[#F6F0E6] text-center font-medium"
                  >
                    Sign In with Google
                  </button>
                ) : (
                  <button
                    onClick={logout}
                    className="py-2 px-3 text-red-600 text-left font-medium"
                  >
                    Sign Out ({user.displayName || user.email})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

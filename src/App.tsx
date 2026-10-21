import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { StoreSettingsProvider } from './context/StoreSettingsContext.tsx';
import { CartProvider, useCart } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { CustomOrderPage } from './pages/CustomOrderPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.tsx';
import { OrderTrackingPage } from './pages/OrderTrackingPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactFaqPage } from './pages/ContactFaqPage.tsx';
import { PolicyPage } from './pages/PolicyPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { Product, Category } from './types/index.ts';
import { MessageCircle } from 'lucide-react';

function StorefrontContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [policyTab, setPolicyTab] = useState<string>('shipping');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals & Tracking
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrderData, setCompletedOrderData] = useState<any>(null);
  const [trackOrderNumber, setTrackOrderNumber] = useState<string>('');
  const [trackContact, setTrackContact] = useState<string>('');
  const [adminEditingProduct, setAdminEditingProduct] = useState<any | null>(null);

  const { openCart } = useCart();

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(null);
    setAdminEditingProduct(product);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load Catalogue
  const loadCatalogue = async () => {
    try {
      setLoading(true);
      const [prodsRes, catsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);

      if (prodsRes.ok) {
        setProducts(await prodsRes.json());
      }
      if (catsRes.ok) {
        setCategories(await catsRes.json());
      }
    } catch (err) {
      console.error('Failed to load catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogue();
  }, []);

  const handleNavigate = (view: string, subParam?: string) => {
    setCurrentView(view);
    if (view === 'shop') {
      setSelectedCategorySlug(subParam || 'all');
    } else if (view === 'policy') {
      setPolicyTab(subParam || 'shipping');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromConfirmation = (orderNum: string, contact: string) => {
    setTrackOrderNumber(orderNum);
    setTrackContact(contact);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderData: any) => {
    setCompletedOrderData(orderData);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F0E6] text-[#254A3B]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => handleNavigate(view)}
        selectedCategorySlug={selectedCategorySlug}
        setSelectedCategorySlug={setSelectedCategorySlug}
        onSearch={(term) => {
          setSearchTerm(term);
          handleNavigate('shop', 'all');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            categories={categories}
            featuredProducts={products}
            onNavigate={handleNavigate}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            products={products}
            categories={categories}
            selectedCategorySlug={selectedCategorySlug}
            setSelectedCategorySlug={setSelectedCategorySlug}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {currentView === 'custom' && <CustomOrderPage />}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToShop={() => handleNavigate('shop', 'all')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'confirmation' && (
          <OrderConfirmationPage
            orderData={completedOrderData}
            onTrackOrder={handleTrackOrderFromConfirmation}
            onBackToShop={() => handleNavigate('shop', 'all')}
          />
        )}

        {currentView === 'track' && (
          <OrderTrackingPage
            initialOrderNumber={trackOrderNumber}
            initialContact={trackContact}
          />
        )}

        {currentView === 'about' && (
          <AboutPage onExploreShop={() => handleNavigate('shop', 'all')} />
        )}

        {currentView === 'contact' && <ContactFaqPage />}

        {currentView === 'policy' && <PolicyPage initialTab={policyTab} />}

        {currentView === 'admin' && (
          <AdminDashboard
            onBackToStore={() => {
              handleNavigate('home');
              loadCatalogue();
            }}
            initialEditingProduct={adminEditingProduct}
            onClearInitialEditingProduct={() => {
              setAdminEditingProduct(null);
              loadCatalogue();
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer onCheckout={() => handleNavigate('checkout')} />

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onGoToCheckout={() => {
          setSelectedProduct(null);
          handleNavigate('checkout');
        }}
        onEditProduct={handleEditProduct}
      />

      {/* Floating WhatsApp Contact Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%20BeePri!%20I'm%20shopping%20on%20Buzz%20by%20BeePri%20and%20had%20a%20question"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 hover:bg-[#20ba5a] transition-all flex items-center justify-center group"
        aria-label="Chat with BeePri on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreSettingsProvider>
        <CartProvider>
          <StorefrontContent />
        </CartProvider>
      </StoreSettingsProvider>
    </AuthProvider>
  );
}

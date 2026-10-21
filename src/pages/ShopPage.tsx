import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';
import { Category, Product } from '../types/index.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  selectedCategorySlug,
  setSelectedCategorySlug,
  searchTerm,
  setSearchTerm,
  onSelectProduct,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'bestseller' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [filterMadeToOrder, setFilterMadeToOrder] = useState<boolean | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(1500);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategorySlug && selectedCategorySlug !== 'all') {
        if (p.categorySlug !== selectedCategorySlug) {
          return false;
        }
      }

      // Search match
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesCat = p.categoryName?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSku && !matchesCat) {
          return false;
        }
      }

      // Made to order filter
      if (filterMadeToOrder !== null) {
        if (p.isMadeToOrder !== filterMadeToOrder) {
          return false;
        }
      }

      // Price filter
      const effectivePrice = p.salePrice ?? p.price;
      if (effectivePrice > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice ?? a.price;
      const priceB = b.salePrice ?? b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      if (sortBy === 'newest') return (b.id) - (a.id);
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategorySlug, searchTerm, filterMadeToOrder, maxPrice, sortBy]);

  const activeCategoryName =
    selectedCategorySlug === 'all'
      ? 'All Creations'
      : categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Creations';

  const resetFilters = () => {
    setSelectedCategorySlug('all');
    setSearchTerm('');
    setFilterMadeToOrder(null);
    setMaxPrice(1500);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategorySlug !== 'all' ||
    searchTerm !== '' ||
    filterMadeToOrder !== null ||
    maxPrice < 1500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left border-b border-[#EDE3D4] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8B4B8]/30 text-xs font-semibold text-[#8B5A3E]">
          <Sparkles className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>Handmade in India with Love</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#254A3B]">
          {activeCategoryName}
        </h1>
        <p className="text-sm text-gray-600 max-w-2xl">
          Browse through our handmade catalogue of keychains, mini everlasting flower pots, hair accessories, and curated gift boxes.
        </p>
      </div>

      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategorySlug('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategorySlug === 'all'
                ? 'bg-[#254A3B] text-[#F6F0E6] shadow-xs'
                : 'bg-white border border-[#EDE3D4] text-[#254A3B] hover:bg-[#EDE3D4]'
            }`}
          >
            All Products
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategorySlug(c.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedCategorySlug === c.slug
                  ? 'bg-[#254A3B] text-[#F6F0E6] shadow-xs'
                  : 'bg-white border border-[#EDE3D4] text-[#254A3B] hover:bg-[#EDE3D4]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#254A3B]/20 text-xs text-[#254A3B] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#254A3B]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white border border-[#254A3B]/20 text-xs font-medium text-[#254A3B] focus:outline-none focus:ring-1 focus:ring-[#254A3B] cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="bestseller">Best Selling</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Made-to-order toggle & Price range */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-white/70 border border-[#EDE3D4] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-[#254A3B] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#8B5A3E]" /> Filter:
          </span>

          <button
            onClick={() => setFilterMadeToOrder(filterMadeToOrder === false ? null : false)}
            className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              filterMadeToOrder === false
                ? 'bg-[#254A3B] text-white'
                : 'bg-[#EDE3D4] text-[#254A3B] hover:bg-[#254A3B]/10'
            }`}
          >
            Ready to Ship (In Stock)
          </button>

          <button
            onClick={() => setFilterMadeToOrder(filterMadeToOrder === true ? null : true)}
            className={`px-3 py-1 rounded-full font-medium transition cursor-pointer ${
              filterMadeToOrder === true
                ? 'bg-[#254A3B] text-white'
                : 'bg-[#EDE3D4] text-[#254A3B] hover:bg-[#254A3B]/10'
            }`}
          >
            Made to Order
          </button>
        </div>

        {/* Max Price Slider */}
        <div className="flex items-center gap-3">
          <span className="text-gray-600">Max Price: <strong className="text-[#254A3B]">₹{maxPrice}</strong></span>
          <input
            type="range"
            min={200}
            max={1500}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-28 sm:w-36 accent-[#254A3B]"
          />
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#8B5A3E] hover:text-red-600 font-semibold underline ml-2 cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Showing <strong>{filteredProducts.length}</strong> handcrafted products</span>
        {searchTerm && (
          <span>Search results for "{searchTerm}"</span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#EDE3D4] p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F6F0E6] flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="font-serif text-xl font-bold text-[#254A3B]">No crafts match your filters</h3>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Try adjusting your search terms, price filter, or clear the category filters to discover all BeePri creations.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-full bg-[#254A3B] text-[#F6F0E6] text-xs font-semibold hover:bg-[#1f3d30] transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

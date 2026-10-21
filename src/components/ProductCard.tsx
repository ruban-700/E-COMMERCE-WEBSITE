import React from 'react';
import { ShoppingBag, Eye, Sparkles, Clock } from 'lucide-react';
import { Product } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();

  const discountPercent =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  const currentPrice = product.salePrice ?? product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants && product.variants.length > 1) {
      onQuickView(product);
    } else {
      const defaultVariantId = product.variants?.[0]?.id || null;
      addToCart(product, defaultVariantId, 1);
    }
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#EDE3D4] hover:border-[#254A3B]/30 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F6F0E6]/60">
        <img
          src={product.primaryImage || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#254A3B] text-[#F6F0E6] shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-[#E8B4B8]" />
              Best Seller
            </span>
          )}
          {product.isMadeToOrder && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDE3D4] text-[#8B5A3E] border border-[#8B5A3E]/20 shadow-xs">
              <Clock className="w-2.5 h-2.5" />
              Made to Order
            </span>
          )}
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C87D55] text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#254A3B] text-xs font-semibold shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            <Eye className="w-3.5 h-3.5" />
            Quick Details
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between text-xs text-[#8B5A3E] font-medium mb-1">
            <span>{product.categoryName || 'Handmade Craft'}</span>
            <span className="text-[11px] text-gray-500 font-mono">{product.sku}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-semibold text-[#254A3B] line-clamp-1 group-hover:text-[#8B5A3E] transition-colors">
            {product.name}
          </h3>

          {/* Color variant dots if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.variants.slice(0, 4).map((v) => (
                <span
                  key={v.id}
                  title={v.name}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: v.colorHex || '#E8B4B8' }}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-[10px] text-gray-500 font-medium">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-[#EDE3D4] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#254A3B]">₹{currentPrice}</span>
              {product.salePrice && (
                <span className="text-xs text-gray-600 line-through">₹{product.price}</span>
              )}
            </div>
            <span className="text-[10px] text-[#8B5A3E] block">
              {product.isMadeToOrder ? 'Dispatched in 2-4 days' : 'Ready to dispatch'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="p-2.5 rounded-xl bg-[#254A3B]/10 hover:bg-[#254A3B] text-[#254A3B] hover:text-[#F6F0E6] transition-colors flex items-center justify-center cursor-pointer"
            aria-label={`Add ${product.name} to bag`}
            title="Add to Bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

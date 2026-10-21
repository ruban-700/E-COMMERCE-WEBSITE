import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  Check,
  Info,
  Gift,
  Edit2,
} from 'lucide-react';
import { Product, ProductVariant } from '../types/index.ts';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onGoToCheckout?: () => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onGoToCheckout,
  onEditProduct,
}) => {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (product) {
      const defaultVariant = product.variants?.[0] || null;
      setSelectedVariant(defaultVariant);
      setSelectedImage(
        product.primaryImage ||
          product.images?.[0]?.imageUrl ||
          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
      );
      setQuantity(1);
      setAddedToast(false);
    }
  }, [product]);

  if (!product) return null;

  const unitBasePrice = product.salePrice ?? product.price;
  const currentUnitPrice = unitBasePrice + (selectedVariant?.priceDelta || 0);
  const totalPrice = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant?.id || null, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant?.id || null, quantity);
    onClose();
    if (onGoToCheckout) {
      onGoToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EDE3D4] animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#254A3B] transition shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-[#F6F0E6]/50 flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs border border-[#EDE3D4]">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80';
                }}
              />
              {product.isMadeToOrder && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-[#254A3B] text-[#F6F0E6] flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-[#E8B4B8]" />
                  Handmade to Order
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img.imageUrl)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition flex-shrink-0 ${
                      selectedImage === img.imageUrl
                        ? 'border-[#254A3B] ring-2 ring-[#254A3B]/20'
                        : 'border-[#EDE3D4] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Maker Note */}
            <div className="mt-4 p-3.5 rounded-xl bg-white/70 border border-[#EDE3D4] text-xs text-[#8B5A3E] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C87D55] flex-shrink-0 mt-0.5" />
              <span>
                <strong>Handcrafted with care:</strong> Every piece is individually crafted by BeePri in India. Slight variations in stitch or shade add to its handmade beauty.
              </span>
            </div>
          </div>

          {/* Right Column: Details & Selection */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8B5A3E] font-medium mb-1">
                <span>{product.categoryName || 'Handcrafted Collection'}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-[#EDE3D4] px-2 py-0.5 rounded text-[11px] text-gray-700">
                    SKU: {product.sku}
                  </span>
                  {isAdmin && onEditProduct && (
                    <button
                      type="button"
                      onClick={() => onEditProduct(product)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#254A3B] text-white hover:bg-[#1e3c30] text-[10px] font-semibold transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Craft
                    </button>
                  )}
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#254A3B] leading-snug">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-[#254A3B]">₹{currentUnitPrice}</span>
                {product.salePrice && (
                  <span className="text-base text-gray-600 line-through">₹{product.price}</span>
                )}
                {product.salePrice && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C87D55] text-white">
                    Save ₹{product.price - product.salePrice}
                  </span>
                )}
                <span className="text-xs text-gray-500 font-medium">Incl. of all taxes</span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-[#254A3B]/80 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Picker */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6">
                  <label className="block text-xs font-bold text-[#254A3B] uppercase tracking-wider mb-2">
                    Select Color / Style:{' '}
                    <span className="text-[#8B5A3E] font-semibold">{selectedVariant?.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          selectedVariant?.id === v.id
                            ? 'border-[#254A3B] bg-[#254A3B]/10 font-bold text-[#254A3B]'
                            : 'border-[#EDE3D4] hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: v.colorHex || '#E8B4B8' }}
                        />
                        <span>{v.name}</span>
                        {v.priceDelta && v.priceDelta > 0 && (
                          <span className="text-gray-500">(+₹{v.priceDelta})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold text-[#254A3B] uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-[#254A3B]/20 rounded-xl bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-base text-[#254A3B] hover:bg-[#EDE3D4] rounded-l-xl transition font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-bold text-[#254A3B] min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-base text-[#254A3B] hover:bg-[#EDE3D4] rounded-r-xl transition font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#8B5A3E] font-medium">
                  {product.isMadeToOrder ? 'Crafted for you' : `Available in studio`}
                </span>
              </div>

              {/* Specifications Accordion / Grid */}
              <div className="mt-6 pt-5 border-t border-[#EDE3D4] grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F6F0E6]/50">
                  <span className="text-gray-600 block">Materials</span>
                  <span className="font-semibold text-[#254A3B]">{product.materials || '100% Cotton Yarn, Brass'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F6F0E6]/50">
                  <span className="text-gray-600 block">Dispatch Time</span>
                  <span className="font-semibold text-[#254A3B]">{product.productionDays || '2-3 business days'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F6F0E6]/50">
                  <span className="text-gray-600 block">Dimensions</span>
                  <span className="font-semibold text-[#254A3B]">{product.dimensions || 'Handmade standard size'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F6F0E6]/50">
                  <span className="text-gray-600 block">Care Instructions</span>
                  <span className="font-semibold text-[#254A3B]">Gentle spot clean only</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#EDE3D4] space-y-3">
              {addedToast && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Added {quantity} x {product.name} to your shopping bag!
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#254A3B] text-[#F6F0E6] font-semibold text-sm hover:bg-[#1d3a2e] transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag • ₹{totalPrice}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl bg-[#C87D55] text-white font-semibold text-sm hover:bg-[#b56d47] transition shadow-xs cursor-pointer"
                >
                  Buy Now
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#254A3B]" /> Pan-India Express Courier
                </span>
                <span className="flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-[#C87D55]" /> Free Handwritten Gift Note
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

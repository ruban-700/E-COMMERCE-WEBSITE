export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number | null;
  productCount?: number;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku?: string | null;
  priceDelta?: number | null;
  stock?: number | null;
  colorHex?: string | null;
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string | null;
  isPrimary?: boolean | null;
  sortOrder?: number | null;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  categoryId?: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  isMadeToOrder: boolean;
  productionDays?: string | null;
  materials?: string | null;
  dimensions?: string | null;
  weightGrams?: number | null;
  isActive: boolean;
  featured: boolean;
  isBestSeller: boolean;
  createdAt?: string | null;
  primaryImage?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: number;
  variantId?: number | null;
  quantity: number;
  product?: Product;
  selectedVariant?: ProductVariant | null;
}

export interface CartCalculationResult {
  items: Array<{
    productId: number;
    variantId?: number | null;
    name: string;
    variantName?: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    image: string;
    stock: number;
    isMadeToOrder: boolean;
    productionDays?: string | null;
  }>;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  coupon: {
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId?: number | null;
  variantId?: number | null;
  productName: string;
  variantName?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  itemImage?: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId?: number | null;
  guestEmail: string;
  guestPhone: string;
  guestName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  giftNote?: string | null;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string | null;
  courierPartner?: string | null;
  createdAt: string;
}

export interface CustomRequest {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  itemType: string;
  description: string;
  personalizationText?: string | null;
  colorPreferences?: string | null;
  budgetRange?: string | null;
  needByDate?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue?: number | null;
  maxDiscount?: number | null;
  isActive: boolean;
  usageCount: number;
  createdAt?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  instagramHandle: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  codEnabled: boolean;
  announcementBanner: string;
}

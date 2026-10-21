import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (synced with Firebase Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('customer'), // 'customer' or 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// Product Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
});

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  sku: text('sku').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  price: integer('price').notNull(), // INR ₹
  salePrice: integer('sale_price'),
  stock: integer('stock').notNull().default(10),
  isMadeToOrder: boolean('is_made_to_order').notNull().default(false),
  productionDays: text('production_days').default('2-4 business days'),
  materials: text('materials').default('100% Cotton Yarn, Brass, Ceramic'),
  dimensions: text('dimensions').default('approx. 8cm x 5cm'),
  weightGrams: integer('weight_grams').default(80),
  isActive: boolean('is_active').notNull().default(true),
  featured: boolean('featured').notNull().default(false),
  isBestSeller: boolean('is_best_seller').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Product Variants (e.g. Colors, Charms, Sizes)
export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  name: text('name').notNull(),
  sku: text('sku'),
  priceDelta: integer('price_delta').default(0),
  stock: integer('stock').default(10),
  colorHex: text('color_hex').default('#E8B4B8'),
});

// Product Images
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'),
  isPrimary: boolean('is_primary').default(false),
  sortOrder: integer('sort_order').default(0),
});

// Discount Coupons
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull(), // 'percentage' | 'fixed'
  discountValue: integer('discount_value').notNull(),
  minOrderValue: integer('min_order_value').default(0),
  maxDiscount: integer('max_discount'),
  isActive: boolean('is_active').default(true),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customer Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(), // e.g. BBP-2026-1001
  userId: integer('user_id').references(() => users.id),
  guestEmail: text('guest_email').notNull(),
  guestPhone: text('guest_phone').notNull(),
  guestName: text('guest_name').notNull(),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  subtotal: integer('subtotal').notNull(),
  shippingFee: integer('shipping_fee').notNull().default(79),
  discountAmount: integer('discount_amount').notNull().default(0),
  totalAmount: integer('total_amount').notNull(),
  couponCode: text('coupon_code'),
  giftNote: text('gift_note'),
  paymentMethod: text('payment_method').notNull().default('upi'), // 'upi' | 'card' | 'netbanking' | 'cod' | 'test_sandbox'
  paymentStatus: text('payment_status').notNull().default('pending'), // 'pending' | 'paid' | 'failed'
  paymentId: text('payment_id'),
  orderStatus: text('order_status').notNull().default('confirmed'), // 'pending' | 'confirmed' | 'crafting' | 'dispatched' | 'delivered' | 'cancelled'
  trackingNumber: text('tracking_number'),
  courierPartner: text('courier_partner').default('BlueDart Express'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Order Items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .references(() => orders.id)
    .notNull(),
  productId: integer('product_id').references(() => products.id),
  variantId: integer('variant_id'),
  productName: text('product_name').notNull(),
  variantName: text('variant_name'),
  unitPrice: integer('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  totalPrice: integer('total_price').notNull(),
  itemImage: text('item_image'),
});

// Custom Orders and Bespoke Requests
export const customRequests = pgTable('custom_requests', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  itemType: text('item_type').notNull(), // 'Keychain', 'Flower Pot', 'Gift Box', 'Crochet Craft', etc.
  description: text('description').notNull(),
  personalizationText: text('personalization_text'),
  colorPreferences: text('color_preferences'),
  budgetRange: text('budget_range'),
  needByDate: text('need_by_date'),
  status: text('status').notNull().default('new'), // 'new' | 'in_review' | 'quoted' | 'accepted' | 'completed' | 'declined'
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Store Settings
export const storeSettings = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

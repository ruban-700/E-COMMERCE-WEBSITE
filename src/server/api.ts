import { Router, Request, Response } from 'express';
import { db } from '../db/index.ts';
import {
  categories,
  products,
  productVariants,
  productImages,
  coupons,
  orders,
  orderItems,
  customRequests,
  storeSettings,
  users,
} from '../db/schema.ts';
import { eq, desc, and, sql, ilike, inArray } from 'drizzle-orm';
import { requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { seedDatabaseIfEmpty } from '../db/seed.ts';

const router = Router();

// Automatic seed trigger on initial startup
let seeded = false;
async function ensureSeeded() {
  if (!seeded) {
    try {
      await seedDatabaseIfEmpty();
      seeded = true;
    } catch (e) {
      console.error('Seed check failed:', e);
    }
  }
}

// ----------------------------------------------------
// Public Store Settings
// ----------------------------------------------------
router.get('/settings', async (_req: Request, res: Response) => {
  await ensureSeeded();
  try {
    const allSettings = await db.select().from(storeSettings);
    const settingsMap = Object.fromEntries(allSettings.map((s) => [s.key, s.value]));
    return res.json({
      storeName: settingsMap['store_name'] || 'Buzz by BeePri',
      tagline: settingsMap['tagline'] || 'Small Things, Made with Love',
      whatsappNumber: settingsMap['whatsapp_number'] || '+91 98765 43210',
      instagramHandle: settingsMap['instagram_handle'] || '@buzzbybeepri',
      freeShippingThreshold: parseInt(settingsMap['free_shipping_threshold'] || '999', 10),
      standardShippingFee: parseInt(settingsMap['standard_shipping_fee'] || '79', 10),
      codEnabled: settingsMap['cod_enabled'] !== 'false',
      announcementBanner:
        settingsMap['announcement_banner'] ||
        '🌸 Free Pan-India shipping on all handmade orders above ₹999! Code: BUZZLOVE',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to load store settings' });
  }
});

// ----------------------------------------------------
// Categories
// ----------------------------------------------------
router.get('/categories', async (_req: Request, res: Response) => {
  await ensureSeeded();
  try {
    const allCategories = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
        description: categories.description,
        imageUrl: categories.imageUrl,
        sortOrder: categories.sortOrder,
        productCount: sql<number>`count(${products.id})::int`,
      })
      .from(categories)
      .leftJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
      .groupBy(categories.id)
      .orderBy(categories.sortOrder);

    return res.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ----------------------------------------------------
// Products Listing & Filtering
// ----------------------------------------------------
router.get('/products', async (req: Request, res: Response) => {
  await ensureSeeded();
  try {
    const { category, search, sort, featured, bestSeller } = req.query;

    const conditions = [eq(products.isActive, true)];

    if (category && typeof category === 'string' && category !== 'all') {
      const cat = await db.select().from(categories).where(eq(categories.slug, category)).limit(1);
      if (cat.length > 0) {
        conditions.push(eq(products.categoryId, cat[0].id));
      }
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      conditions.push(ilike(products.name, `%${search.trim()}%`));
    }

    if (featured === 'true') {
      conditions.push(eq(products.featured, true));
    }

    if (bestSeller === 'true') {
      conditions.push(eq(products.isBestSeller, true));
    }

    let query = db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        slug: products.slug,
        description: products.description,
        categoryId: products.categoryId,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        isMadeToOrder: products.isMadeToOrder,
        productionDays: products.productionDays,
        materials: products.materials,
        dimensions: products.dimensions,
        weightGrams: products.weightGrams,
        isActive: products.isActive,
        featured: products.featured,
        isBestSeller: products.isBestSeller,
        createdAt: products.createdAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions));

    let prods;
    if (sort === 'price-low') {
      prods = await query.orderBy(products.price);
    } else if (sort === 'price-high') {
      prods = await query.orderBy(desc(products.price));
    } else if (sort === 'newest') {
      prods = await query.orderBy(desc(products.createdAt));
    } else {
      prods = await query.orderBy(desc(products.featured), desc(products.isBestSeller), desc(products.id));
    }
    if (prods.length === 0) {
      return res.json([]);
    }

    const prodIds = prods.map((p) => p.id);

    // Fetch images and variants in batch
    const [allImages, allVariants] = await Promise.all([
      db.select().from(productImages).where(inArray(productImages.productId, prodIds)).orderBy(productImages.sortOrder),
      db.select().from(productVariants).where(inArray(productVariants.productId, prodIds)),
    ]);

    const result = prods.map((p) => ({
      ...p,
      images: allImages.filter((img) => img.productId === p.id),
      variants: allVariants.filter((v) => v.productId === p.id),
      primaryImage:
        allImages.find((img) => img.productId === p.id && img.isPrimary)?.imageUrl ||
        allImages.find((img) => img.productId === p.id)?.imageUrl ||
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ----------------------------------------------------
// Single Product by Slug or ID
// ----------------------------------------------------
router.get('/products/:slugOrId', async (req: Request, res: Response) => {
  await ensureSeeded();
  try {
    const { slugOrId } = req.params;
    const isNumeric = /^\d+$/.test(slugOrId);

    const condition = isNumeric ? eq(products.id, parseInt(slugOrId, 10)) : eq(products.slug, slugOrId);

    const prod = await db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        slug: products.slug,
        description: products.description,
        categoryId: products.categoryId,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        isMadeToOrder: products.isMadeToOrder,
        productionDays: products.productionDays,
        materials: products.materials,
        dimensions: products.dimensions,
        weightGrams: products.weightGrams,
        isActive: products.isActive,
        featured: products.featured,
        isBestSeller: products.isBestSeller,
        createdAt: products.createdAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(condition)
      .limit(1);

    if (prod.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const p = prod[0];
    const [images, variants] = await Promise.all([
      db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(productImages.sortOrder),
      db.select().from(productVariants).where(eq(productVariants.productId, p.id)),
    ]);

    return res.json({
      ...p,
      images,
      variants,
      primaryImage:
        images.find((img) => img.isPrimary)?.imageUrl ||
        images[0]?.imageUrl ||
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ----------------------------------------------------
// Cart Recalculation & Price Verification (Server-authoritative)
// ----------------------------------------------------
interface CartItemInput {
  productId: number;
  variantId?: number | null;
  quantity: number;
}

async function calculateCartAuthoritative(items: CartItemInput[], couponCode?: string) {
  if (!items || items.length === 0) {
    return {
      items: [],
      subtotal: 0,
      shippingFee: 0,
      discountAmount: 0,
      totalAmount: 0,
      coupon: null,
    };
  }

  const productIds = items.map((i) => i.productId);
  const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const p = productMap.get(item.productId);
    if (!p || !p.isActive) continue;

    // Unit price in INR (use sale price if present)
    let unitPrice = p.salePrice ?? p.price;
    let variantName = null;

    if (item.variantId) {
      const v = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, item.variantId))
        .limit(1);
      if (v.length > 0) {
        variantName = v[0].name;
        unitPrice += v[0].priceDelta || 0;
      }
    }

    const qty = Math.max(1, Math.min(item.quantity, p.stock > 0 ? p.stock : 99));
    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;

    // Fetch primary image
    const pImg = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, p.id))
      .limit(1);

    verifiedItems.push({
      productId: p.id,
      variantId: item.variantId || null,
      name: p.name,
      variantName,
      unitPrice,
      quantity: qty,
      totalPrice: itemTotal,
      image: pImg[0]?.imageUrl || '',
      stock: p.stock,
      isMadeToOrder: p.isMadeToOrder,
      productionDays: p.productionDays,
    });
  }

  // Calculate Shipping (Free above ₹999, else ₹79)
  const freeThreshold = 999;
  const baseShippingFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : 79;
  let shippingFee = baseShippingFee;

  // Coupon evaluation
  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponCode && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    const dbCoupon = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, cleanCode), eq(coupons.isActive, true)))
      .limit(1);

    if (dbCoupon.length > 0) {
      const cp = dbCoupon[0];
      if (subtotal >= (cp.minOrderValue || 0)) {
        if (cp.discountType === 'percentage') {
          const rawDiscount = Math.round((subtotal * cp.discountValue) / 100);
          discountAmount = cp.maxDiscount ? Math.min(rawDiscount, cp.maxDiscount) : rawDiscount;
        } else if (cp.discountType === 'fixed') {
          discountAmount = Math.min(cp.discountValue, subtotal);
        }

        appliedCoupon = {
          code: cp.code,
          discountType: cp.discountType,
          discountValue: cp.discountValue,
          discountAmount,
        };
      }
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    items: verifiedItems,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    coupon: appliedCoupon,
    freeShippingThreshold: freeThreshold,
    amountToFreeShipping: Math.max(0, freeThreshold - subtotal),
  };
}

router.post('/cart/calculate', async (req: Request, res: Response) => {
  try {
    const { items, couponCode } = req.body;
    const result = await calculateCartAuthoritative(items || [], couponCode);
    return res.json(result);
  } catch (error) {
    console.error('Error calculating cart:', error);
    return res.status(500).json({ error: 'Failed to calculate cart totals' });
  }
});

// ----------------------------------------------------
// Coupon Validation
// ----------------------------------------------------
router.post('/coupons/validate', async (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, error: 'Coupon code is required' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const dbCoupon = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, cleanCode), eq(coupons.isActive, true)))
      .limit(1);

    if (dbCoupon.length === 0) {
      return res.status(400).json({ valid: false, error: 'Invalid or expired coupon code' });
    }

    const cp = dbCoupon[0];
    const currentSubtotal = Number(subtotal) || 0;

    if (currentSubtotal < (cp.minOrderValue || 0)) {
      return res.status(400).json({
        valid: false,
        error: `Minimum order value of ₹${cp.minOrderValue} required for this coupon`,
      });
    }

    let discount = 0;
    if (cp.discountType === 'percentage') {
      const raw = Math.round((currentSubtotal * cp.discountValue) / 100);
      discount = cp.maxDiscount ? Math.min(raw, cp.maxDiscount) : raw;
    } else {
      discount = Math.min(cp.discountValue, currentSubtotal);
    }

    return res.json({
      valid: true,
      code: cp.code,
      discountType: cp.discountType,
      discountValue: cp.discountValue,
      discountAmount: discount,
      message: `Coupon ${cp.code} applied! Saved ₹${discount}`,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({ valid: false, error: 'Error checking coupon' });
  }
});

// ----------------------------------------------------
// Order Creation & Checkout (Server verified)
// ----------------------------------------------------
router.post('/orders', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { items, customer, address, giftNote, couponCode, paymentMethod } = req.body;

    // Validate inputs
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty' });
    }
    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ error: 'Please provide full contact details (name, email, 10-digit phone)' });
    }
    if (!address?.addressLine1 || !address?.city || !address?.state || !address?.pincode) {
      return res.status(400).json({ error: 'Please provide a complete delivery address with PIN code' });
    }

    // Phone & PIN validation
    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
    }
    const cleanPincode = address.pincode.replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit Indian PIN code' });
    }

    // Server-authoritative calculation
    const calc = await calculateCartAuthoritative(items, couponCode);
    if (calc.items.length === 0) {
      return res.status(400).json({ error: 'None of the requested items are currently available' });
    }

    // Generate Unique Order Number: BBP-YYYY-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `BBP-${dateStr}-${randomSuffix}`;

    // Payment configuration
    const isCod = paymentMethod === 'cod';
    const isSandbox = paymentMethod === 'test_sandbox' || paymentMethod === 'upi' || paymentMethod === 'card';
    const paymentStatus = isCod ? 'pending' : 'paid'; // In test sandbox flow, mock paid
    const paymentId = isCod ? null : `PAY-SANDBOX-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Insert Order
    const [insertedOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: req.dbUserId || null,
        guestEmail: customer.email,
        guestPhone: customer.phone,
        guestName: customer.name,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        pincode: cleanPincode,
        subtotal: calc.subtotal,
        shippingFee: calc.shippingFee,
        discountAmount: calc.discountAmount,
        totalAmount: calc.totalAmount,
        couponCode: calc.coupon?.code || null,
        giftNote: giftNote || null,
        paymentMethod: paymentMethod || 'upi',
        paymentStatus,
        paymentId,
        orderStatus: 'confirmed',
        trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}`,
        courierPartner: 'BlueDart Express',
      })
      .returning();

    // Insert Order Items
    for (const item of calc.items) {
      await db.insert(orderItems).values({
        orderId: insertedOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.name,
        variantName: item.variantName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        itemImage: item.image,
      });

      // Safely decrement stock
      await db
        .update(products)
        .set({
          stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})`,
        })
        .where(eq(products.id, item.productId));
    }

    // Increment coupon usage
    if (calc.coupon?.code) {
      await db
        .update(coupons)
        .set({ usageCount: sql`${coupons.usageCount} + 1` })
        .where(eq(coupons.code, calc.coupon.code));
    }

    return res.status(201).json({
      success: true,
      orderNumber: insertedOrder.orderNumber,
      orderId: insertedOrder.id,
      totalAmount: insertedOrder.totalAmount,
      paymentStatus: insertedOrder.paymentStatus,
      paymentMethod: insertedOrder.paymentMethod,
      orderStatus: insertedOrder.orderStatus,
      trackingNumber: insertedOrder.trackingNumber,
      guestEmail: insertedOrder.guestEmail,
      estimatedDelivery: '3–5 business days',
      message: 'Order placed successfully! Handcrafting begins soon.',
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
});

// ----------------------------------------------------
// Order Tracking
// ----------------------------------------------------
router.get('/orders/track', async (req: Request, res: Response) => {
  try {
    const { orderNumber, contact } = req.query;
    if (!orderNumber || !contact) {
      return res.status(400).json({ error: 'Please provide both Order Number and Email/Phone' });
    }

    const cleanOrderNumber = String(orderNumber).trim().toUpperCase();
    const cleanContact = String(contact).trim().toLowerCase();

    const orderList = await db
      .select()
      .from(orders)
      .where(eq(orders.orderNumber, cleanOrderNumber))
      .limit(1);

    if (orderList.length === 0) {
      return res.status(404).json({ error: 'No order found matching this Order Number.' });
    }

    const ord = orderList[0];
    const matchEmail = ord.guestEmail.toLowerCase() === cleanContact;
    const matchPhone = ord.guestPhone.replace(/\D/g, '') === cleanContact.replace(/\D/g, '');

    if (!matchEmail && !matchPhone) {
      return res.status(401).json({ error: 'Email or phone number does not match this order.' });
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, ord.id));

    // Timeline generator based on order status
    const timeline = [
      { step: 'Order Placed', status: 'completed', desc: 'Order confirmed and payment verified' },
      {
        step: 'Handcrafting & Quality Check',
        status: ['crafting', 'dispatched', 'delivered'].includes(ord.orderStatus)
          ? 'completed'
          : ord.orderStatus === 'confirmed'
          ? 'current'
          : 'pending',
        desc: 'Artisan crafting each item with care and checking finishes',
      },
      {
        step: 'Packed with Love',
        status: ['dispatched', 'delivered'].includes(ord.orderStatus)
          ? 'completed'
          : ord.orderStatus === 'crafting'
          ? 'current'
          : 'pending',
        desc: 'Wrapped in eco-friendly gift tissue and safe cushioning',
      },
      {
        step: 'Dispatched with Courier',
        status: ord.orderStatus === 'delivered' ? 'completed' : ord.orderStatus === 'dispatched' ? 'current' : 'pending',
        desc: `${ord.courierPartner} tracking #${ord.trackingNumber || 'Pending'}`,
      },
      {
        step: 'Delivered',
        status: ord.orderStatus === 'delivered' ? 'completed' : 'pending',
        desc: 'Delivered to your doorstep',
      },
    ];

    return res.json({
      order: {
        id: ord.id,
        orderNumber: ord.orderNumber,
        guestName: ord.guestName,
        guestEmail: ord.guestEmail,
        guestPhone: ord.guestPhone,
        addressLine1: ord.addressLine1,
        addressLine2: ord.addressLine2,
        city: ord.city,
        state: ord.state,
        pincode: ord.pincode,
        subtotal: ord.subtotal,
        shippingFee: ord.shippingFee,
        discountAmount: ord.discountAmount,
        totalAmount: ord.totalAmount,
        couponCode: ord.couponCode,
        giftNote: ord.giftNote,
        paymentMethod: ord.paymentMethod,
        paymentStatus: ord.paymentStatus,
        orderStatus: ord.orderStatus,
        trackingNumber: ord.trackingNumber,
        courierPartner: ord.courierPartner,
        createdAt: ord.createdAt,
      },
      items,
      timeline,
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return res.status(500).json({ error: 'Failed to retrieve order tracking information' });
  }
});

// ----------------------------------------------------
// Custom Orders & Bespoke Crafts
// ----------------------------------------------------
router.post('/custom-requests', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      email,
      phone,
      itemType,
      description,
      personalizationText,
      colorPreferences,
      budgetRange,
      needByDate,
    } = req.body;

    if (!customerName || !email || !phone || !itemType || !description) {
      return res.status(400).json({ error: 'Please fill in all required fields (name, email, phone, craft type, description)' });
    }

    const [created] = await db
      .insert(customRequests)
      .values({
        customerName,
        email,
        phone,
        itemType,
        description,
        personalizationText: personalizationText || null,
        colorPreferences: colorPreferences || null,
        budgetRange: budgetRange || null,
        needByDate: needByDate || null,
        status: 'new',
      })
      .returning();

    return res.status(201).json({
      success: true,
      requestId: created.id,
      message: 'Thank you! Your custom handmade request has been submitted to BeePri. We will review and reach out via WhatsApp/Email within 24 hours.',
    });
  } catch (error) {
    console.error('Error submitting custom request:', error);
    return res.status(500).json({ error: 'Failed to submit custom request' });
  }
});

// ----------------------------------------------------
// Contact Form
// ----------------------------------------------------
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    // Record contact message or log
    console.log('Customer message received:', { name, email, subject, message });
    return res.json({
      success: true,
      message: 'Thank you for reaching out! The BeePri team will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ error: 'Could not send message' });
  }
});

// ----------------------------------------------------
// ADMIN DASHBOARD ROUTES
// ----------------------------------------------------

// Admin Metrics
router.get('/admin/metrics', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const [totalOrdersRes, totalProductsRes, customReqsRes, allOrders] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(orders),
      db.select({ count: sql<number>`count(*)::int` }).from(products),
      db.select({ count: sql<number>`count(*)::int` }).from(customRequests),
      db.select().from(orders).orderBy(desc(orders.createdAt)),
    ]);

    const totalRevenue = allOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrdersCount = allOrders.filter(
      (o) => o.orderStatus === 'confirmed' || o.orderStatus === 'crafting'
    ).length;

    return res.json({
      totalRevenue,
      totalOrders: totalOrdersRes[0].count,
      totalProducts: totalProductsRes[0].count,
      pendingOrders: pendingOrdersCount,
      customRequestsCount: customReqsRes[0].count,
      recentOrders: allOrders.slice(0, 5),
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return res.status(500).json({ error: 'Failed to fetch admin metrics' });
  }
});

// Admin Products List
router.get('/admin/products', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const allProds = await db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        slug: products.slug,
        description: products.description,
        categoryId: products.categoryId,
        price: products.price,
        salePrice: products.salePrice,
        stock: products.stock,
        isMadeToOrder: products.isMadeToOrder,
        productionDays: products.productionDays,
        materials: products.materials,
        dimensions: products.dimensions,
        weightGrams: products.weightGrams,
        isActive: products.isActive,
        featured: products.featured,
        isBestSeller: products.isBestSeller,
        createdAt: products.createdAt,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(desc(products.id));

    const pIds = allProds.map((p) => p.id);
    const [images, variants] = await Promise.all([
      pIds.length > 0
        ? db.select().from(productImages).where(inArray(productImages.productId, pIds))
        : [],
      pIds.length > 0
        ? db.select().from(productVariants).where(inArray(productVariants.productId, pIds))
        : [],
    ]);

    const result = allProds.map((p) => ({
      ...p,
      images: images.filter((img) => img.productId === p.id),
      variants: variants.filter((v) => v.productId === p.id),
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return res.status(500).json({ error: 'Failed to fetch admin products' });
  }
});

// Admin Create Product
router.post('/admin/products', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      sku,
      description,
      categoryId,
      price,
      salePrice,
      stock,
      isMadeToOrder,
      productionDays,
      materials,
      dimensions,
      featured,
      isBestSeller,
      imageUrl,
      variants,
    } = req.body;

    if (!name || !sku || !price) {
      return res.status(400).json({ error: 'Name, SKU, and Price are required' });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const [created] = await db
      .insert(products)
      .values({
        sku,
        name,
        slug,
        description: description || 'Lovingly handcrafted product from Buzz by BeePri.',
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        price: parseInt(price, 10),
        salePrice: salePrice ? parseInt(salePrice, 10) : null,
        stock: stock !== undefined ? parseInt(stock, 10) : 10,
        isMadeToOrder: !!isMadeToOrder,
        productionDays: productionDays || '2-3 business days',
        materials: materials || 'Cotton yarn, clay',
        dimensions: dimensions || '',
        featured: !!featured,
        isBestSeller: !!isBestSeller,
        isActive: true,
      })
      .returning();

    if (imageUrl) {
      await db.insert(productImages).values({
        productId: created.id,
        imageUrl,
        isPrimary: true,
      });
    }

    if (variants && Array.isArray(variants)) {
      for (const v of variants) {
        if (v.name) {
          await db.insert(productVariants).values({
            productId: created.id,
            name: v.name,
            colorHex: v.colorHex || '#E8B4B8',
            priceDelta: v.priceDelta ? parseInt(v.priceDelta, 10) : 0,
            stock: v.stock !== undefined ? parseInt(v.stock, 10) : 10,
          });
        }
      }
    }

    return res.status(201).json({ success: true, product: created });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// Admin Update Product
router.put('/admin/products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      name,
      price,
      salePrice,
      stock,
      isActive,
      featured,
      isBestSeller,
      isMadeToOrder,
      description,
      materials,
      productionDays,
      dimensions,
      imageUrl,
    } = req.body;

    const [updated] = await db
      .update(products)
      .set({
        name,
        price: price !== undefined ? parseInt(price, 10) : undefined,
        salePrice: salePrice ? parseInt(salePrice, 10) : null,
        stock: stock !== undefined ? parseInt(stock, 10) : undefined,
        isActive: isActive !== undefined ? !!isActive : undefined,
        featured: featured !== undefined ? !!featured : undefined,
        isBestSeller: isBestSeller !== undefined ? !!isBestSeller : undefined,
        isMadeToOrder: isMadeToOrder !== undefined ? !!isMadeToOrder : undefined,
        description,
        materials,
        productionDays,
        dimensions,
      })
      .where(eq(products.id, id))
      .returning();

    if (imageUrl) {
      const existingImg = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, id))
        .limit(1);
      if (existingImg.length > 0) {
        await db
          .update(productImages)
          .set({ imageUrl })
          .where(eq(productImages.id, existingImg[0].id));
      } else {
        await db.insert(productImages).values({
          productId: id,
          imageUrl,
          isPrimary: true,
        });
      }
    }

    return res.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return res.status(500).json({ error: error.message || 'Failed to update product' });
  }
});

// Admin Delete / Archive Product
router.delete('/admin/products/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Soft-delete by setting isActive to false for referential integrity with past orders
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    return res.json({ success: true, message: 'Product archived successfully' });
  } catch (error) {
    console.error('Error archiving product:', error);
    return res.status(500).json({ error: 'Failed to archive product' });
  }
});

// Admin Orders List & Search
router.get('/admin/orders', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, search } = req.query;
    const conditions = [];

    if (status && typeof status === 'string' && status !== 'all') {
      conditions.push(eq(orders.orderStatus, status));
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      conditions.push(ilike(orders.orderNumber, `%${search.trim()}%`));
    }

    const allOrders = await db
      .select()
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orders.createdAt));

    return res.json(allOrders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Admin Update Order Status
router.patch('/admin/orders/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { orderStatus, trackingNumber, courierPartner, paymentStatus } = req.body;

    const [updated] = await db
      .update(orders)
      .set({
        orderStatus: orderStatus || undefined,
        trackingNumber: trackingNumber || undefined,
        courierPartner: courierPartner || undefined,
        paymentStatus: paymentStatus || undefined,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();

    return res.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Admin Custom Requests
router.get('/admin/custom-requests', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const reqs = await db.select().from(customRequests).orderBy(desc(customRequests.createdAt));
    return res.json(reqs);
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    return res.status(500).json({ error: 'Failed to fetch custom requests' });
  }
});

router.patch('/admin/custom-requests/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, adminNotes } = req.body;
    const [updated] = await db
      .update(customRequests)
      .set({
        status: status || undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      })
      .where(eq(customRequests.id, id))
      .returning();

    return res.json({ success: true, request: updated });
  } catch (error) {
    console.error('Error updating custom request:', error);
    return res.status(500).json({ error: 'Failed to update custom request' });
  }
});

// Admin Coupons
router.get('/admin/coupons', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return res.json(allCoupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

router.post('/admin/coupons', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ error: 'Code and Discount value are required' });
    }

    const [created] = await db
      .insert(coupons)
      .values({
        code: code.trim().toUpperCase(),
        discountType: discountType || 'percentage',
        discountValue: parseInt(discountValue, 10),
        minOrderValue: minOrderValue ? parseInt(minOrderValue, 10) : 0,
        maxDiscount: maxDiscount ? parseInt(maxDiscount, 10) : null,
        isActive: true,
      })
      .returning();

    return res.status(201).json({ success: true, coupon: created });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return res.status(500).json({ error: error.message || 'Failed to create coupon' });
  }
});

router.delete('/admin/coupons/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db.delete(coupons).where(eq(coupons.id, id));
    return res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// Admin Settings
router.get('/admin/settings', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const settings = await db.select().from(storeSettings);
    return res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.post('/admin/settings', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { settings } = req.body; // { key: value }
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object required' });
    }

    for (const [key, value] of Object.entries(settings)) {
      await db
        .insert(storeSettings)
        .values({ key, value: String(value) })
        .onConflictDoUpdate({
          target: storeSettings.key,
          set: { value: String(value), updatedAt: new Date() },
        });
    }

    return res.json({ success: true, message: 'Settings saved' });
  } catch (error) {
    console.error('Error saving settings:', error);
    return res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Admin Reset Orders & Demo Transactions
router.post('/admin/reset-orders', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(customRequests);
    await db.update(coupons).set({ usageCount: 0 });
    await db.update(products).set({ stock: 15 });
    return res.json({
      success: true,
      message: 'All orders, test items, and custom requests have been reset. Product stock restored.',
    });
  } catch (error) {
    console.error('Error resetting orders:', error);
    return res.status(500).json({ error: 'Failed to reset orders' });
  }
});

export default router;

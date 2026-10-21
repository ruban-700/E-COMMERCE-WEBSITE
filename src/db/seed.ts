import { db } from './index.ts';
import {
  categories,
  products,
  productVariants,
  productImages,
  coupons,
  storeSettings,
} from './schema.ts';
import { count } from 'drizzle-orm';

export async function seedDatabaseIfEmpty() {
  try {
    // 1. Ensure Store Settings
    const settingsCount = await db.select({ value: count() }).from(storeSettings);
    if (settingsCount[0].value === 0) {
      await db.insert(storeSettings).values([
        { key: 'store_name', value: 'Buzz by BeePri' },
        { key: 'tagline', value: 'Small Things, Made with Love' },
        { key: 'whatsapp_number', value: '+91 98765 43210' },
        { key: 'instagram_handle', value: '@buzzbybeepri' },
        { key: 'free_shipping_threshold', value: '999' },
        { key: 'standard_shipping_fee', value: '79' },
        { key: 'cod_enabled', value: 'true' },
        { key: 'announcement_banner', value: '🌸 Free Pan-India shipping on all handmade orders above ₹999! Code: BUZZLOVE' },
      ]).onConflictDoNothing();
    }

    // 2. Ensure Coupons
    const couponCount = await db.select({ value: count() }).from(coupons);
    if (couponCount[0].value === 0) {
      await db.insert(coupons).values([
        {
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          minOrderValue: 299,
          maxDiscount: 150,
          isActive: true,
        },
        {
          code: 'BUZZLOVE',
          discountType: 'fixed',
          discountValue: 150,
          minOrderValue: 999,
          maxDiscount: 150,
          isActive: true,
        },
        {
          code: 'FREESHIP',
          discountType: 'fixed',
          discountValue: 79,
          minOrderValue: 499,
          maxDiscount: 79,
          isActive: true,
        },
      ]).onConflictDoNothing();
    }

    // 3. Check Products
    const existingCount = await db.select({ value: count() }).from(products);
    if (existingCount[0].value > 0) {
      return;
    }

    console.log('Seeding initial categories, products, and variants...');

    // 1. Seed Categories
    const insertedCategories = await db
      .insert(categories)
      .values([
        {
          slug: 'keychains',
          name: 'Handmade Keychains',
          description: 'Lovingly crocheted and crafted keyrings, charms, and wristlets.',
          imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
          sortOrder: 1,
        },
        {
          slug: 'flower-pots',
          name: 'Flower Pots & Floral Crafts',
          description: 'Hand-molded ceramic planters and everlasting crochet flower pots.',
          imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
          sortOrder: 2,
        },
        {
          slug: 'accessories',
          name: 'Handmade Accessories',
          description: 'Embroidered bookmarks, phone charms, wristlets, and hair accessories.',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          sortOrder: 3,
        },
        {
          slug: 'gift-sets',
          name: 'Gift Sets & Personalised',
          description: 'Thoughtful curated gift hampers with personalized name tags and handwritten notes.',
          imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
          sortOrder: 4,
        },
      ])
      .returning();

    const catMap = Object.fromEntries(insertedCategories.map((c) => [c.slug, c.id]));

    // 2. Seed Store Settings
    await db.insert(storeSettings).values([
      { key: 'store_name', value: 'Buzz by BeePri' },
      { key: 'tagline', value: 'Small Things, Made with Love' },
      { key: 'whatsapp_number', value: '+91 98765 43210' },
      { key: 'instagram_handle', value: '@buzzbybeepri' },
      { key: 'free_shipping_threshold', value: '999' },
      { key: 'standard_shipping_fee', value: '79' },
      { key: 'cod_enabled', value: 'true' },
      { key: 'announcement_banner', value: '🌸 Free Pan-India shipping on all handmade orders above ₹999! Code: BUZZLOVE' },
    ]);

    // 3. Seed Coupons
    await db.insert(coupons).values([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 299,
        maxDiscount: 150,
        isActive: true,
      },
      {
        code: 'BUZZLOVE',
        discountType: 'fixed',
        discountValue: 150,
        minOrderValue: 999,
        maxDiscount: 150,
        isActive: true,
      },
      {
        code: 'FREESHIP',
        discountType: 'fixed',
        discountValue: 79,
        minOrderValue: 499,
        maxDiscount: 79,
        isActive: true,
      },
    ]);

    // 4. Products Data
    const demoProducts = [
      {
        sku: 'BBP-KCH-001',
        name: 'Little Honey Bumblebee Crochet Keychain',
        slug: 'little-honey-bumblebee-crochet-keychain',
        description: 'Our signature mascot! Handcrafted with soft milk-cotton yarn, safety eyes, delicate felt wings, and a sturdy vintage gold lobster clasp ring. Perfect for bags, keys, or backpacks.',
        categoryId: catMap['keychains'],
        price: 299,
        salePrice: 249,
        stock: 15,
        isMadeToOrder: false,
        productionDays: 'Ready to ship in 1-2 days',
        materials: '100% Milk Cotton Yarn, Polyester filling, Hypoallergenic brass ring',
        dimensions: '6.5cm length x 4.5cm width',
        weightGrams: 35,
        featured: true,
        isBestSeller: true,
        variants: [
          { name: 'Honey Gold & Charcoal', colorHex: '#F59E0B', priceDelta: 0, stock: 8 },
          { name: 'Pastel Peach & Cocoa', colorHex: '#FDBA74', priceDelta: 0, stock: 7 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=800&q=80',
            altText: 'Handmade bumblebee amigurumi keychain',
            isPrimary: true,
          },
          {
            imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
            altText: 'BeePri handmade keychain detail',
            isPrimary: false,
          },
        ],
      },
      {
        sku: 'BBP-KCH-002',
        name: 'Sunbeam Sunflower Hand-Knitted Keychain',
        slug: 'sunbeam-sunflower-hand-knitted-keychain',
        description: 'A pocket full of sunshine! Individually crocheted petal by petal with organic combed cotton yarn. Includes a mini leaf accent and reinforced key ring.',
        categoryId: catMap['keychains'],
        price: 349,
        salePrice: 299,
        stock: 20,
        isMadeToOrder: false,
        productionDays: 'Ready to ship in 1-2 days',
        materials: 'Combed cotton yarn, antique brass clip',
        dimensions: '7.5cm diameter',
        weightGrams: 40,
        featured: true,
        isBestSeller: true,
        variants: [
          { name: 'Classic Golden Yellow', colorHex: '#EAB308', priceDelta: 0, stock: 12 },
          { name: 'Autumn Ochre Brown', colorHex: '#B45309', priceDelta: 0, stock: 8 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
            altText: 'Crochet sunflower keychain flatlay',
            isPrimary: true,
          },
        ],
      },
      {
        sku: 'BBP-POT-001',
        name: 'Everlasting Pink Tulip in Knitted Ceramic Pot',
        slug: 'everlasting-pink-tulip-knitted-ceramic-pot',
        description: 'No watering required! A lovely hand-crocheted pastel tulip nestled inside a handcrafted ceramic mini pot. Brings gentle floral warmth to study tables, office desks, or window sills.',
        categoryId: catMap['flower-pots'],
        price: 599,
        salePrice: 499,
        stock: 12,
        isMadeToOrder: true,
        productionDays: 'Handmade in 2-3 business days',
        materials: 'Terracotta ceramic pot, organic yarn flower, wire stem, pebbles',
        dimensions: '14cm height x 7cm pot diameter',
        weightGrams: 180,
        featured: true,
        isBestSeller: true,
        variants: [
          { name: 'Blush Pink Tulip', colorHex: '#FDA4AF', priceDelta: 0, stock: 6 },
          { name: 'Sunny Buttercup Yellow', colorHex: '#FEF08A', priceDelta: 0, stock: 3 },
          { name: 'Lavender Violet', colorHex: '#C084FC', priceDelta: 0, stock: 3 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
            altText: 'Handmade crochet flower in ceramic pot',
            isPrimary: true,
          },
        ],
      },
      {
        sku: 'BBP-POT-002',
        name: 'Hand-Molded Pastel Terrazzo Mini Desk Planter',
        slug: 'hand-molded-pastel-terrazzo-mini-desk-planter',
        description: 'Eco-resin hand-cast terrazzo planter with soft pastel chips in terracotta, sage, and cream. Sealed with a water-resistant satin finish with a bottom drainage hole and cork protective base.',
        categoryId: catMap['flower-pots'],
        price: 499,
        salePrice: null,
        stock: 8,
        isMadeToOrder: false,
        productionDays: 'Ready to ship in 1-2 days',
        materials: 'Jesmonite eco-resin, natural mineral pigments, cork base',
        dimensions: '8cm height x 8.5cm diameter',
        weightGrams: 220,
        featured: false,
        isBestSeller: false,
        variants: [
          { name: 'Warm Terrazzo & Cream', colorHex: '#F6F0E6', priceDelta: 0, stock: 4 },
          { name: 'Forest Green Confetti', colorHex: '#254A3B', priceDelta: 0, stock: 4 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
            altText: 'Pastel terrazzo mini flower pot',
            isPrimary: true,
          },
        ],
      },
      {
        sku: 'BBP-ACC-001',
        name: 'Wildflower Hand-Embroidered Linen Bookmark',
        slug: 'wildflower-hand-embroidered-linen-bookmark',
        description: 'For book lovers who cherish quiet reading moments. Stitched with French knots and lazy daisy embroidery on natural unbleached linen fabric with a raw fringe edge.',
        categoryId: catMap['accessories'],
        price: 249,
        salePrice: 199,
        stock: 25,
        isMadeToOrder: false,
        productionDays: 'Ready to ship in 1 day',
        materials: 'Pure natural linen, DMC cotton embroidery floss',
        dimensions: '16cm x 5cm',
        weightGrams: 20,
        featured: false,
        isBestSeller: true,
        variants: [
          { name: 'Meadow Chamomile & Daisy', colorHex: '#FEF08A', priceDelta: 0, stock: 15 },
          { name: 'Wild Rose & Fern', colorHex: '#FB7185', priceDelta: 0, stock: 10 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
            altText: 'Hand embroidered linen floral bookmark',
            isPrimary: true,
          },
        ],
      },
      {
        sku: 'BBP-ACC-002',
        name: 'Daisy Meadow Crochet Wristlet Key Strap',
        slug: 'daisy-meadow-crochet-wristlet-key-strap',
        description: 'Hands-free convenience with a whimsical touch. Sturdy crochet lanyard featuring repeated white daisy flowers with golden centers and a secure metal swivel clasp.',
        categoryId: catMap['accessories'],
        price: 320,
        salePrice: 280,
        stock: 14,
        isMadeToOrder: false,
        productionDays: 'Ready to ship in 1-2 days',
        materials: '100% Mercerized Cotton, gold-tone trigger clasp',
        dimensions: '18cm loop length x 2.5cm width',
        weightGrams: 30,
        featured: true,
        isBestSeller: false,
        variants: [
          { name: 'Sage Green Daisy Strap', colorHex: '#84A98C', priceDelta: 0, stock: 7 },
          { name: 'Dusty Rose Daisy Strap', colorHex: '#DF9B9B', priceDelta: 0, stock: 7 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
            altText: 'Crochet daisy wristlet key strap',
            isPrimary: true,
          },
        ],
      },
      {
        sku: 'BBP-GFT-001',
        name: 'The BeePri "Warm Hugs" Handmade Gift Hamper',
        slug: 'the-beepri-warm-hugs-handmade-gift-hamper',
        description: 'The ultimate handcrafted care package! Includes our bestselling Crochet Bee Keychain, an Everlasting Mini Tulip Pot, an embroidered linen bookmark, and a handwritten calligraphed card with your custom message packed in an eco-friendly gift box with dried botanical sprigs.',
        categoryId: catMap['gift-sets'],
        price: 1199,
        salePrice: 999,
        stock: 10,
        isMadeToOrder: true,
        productionDays: 'Handmade & packed in 3 business days',
        materials: 'Recycled kraft gift box, cotton crafts, ceramic pot, botanical note',
        dimensions: 'Box 22cm x 18cm x 10cm',
        weightGrams: 420,
        featured: true,
        isBestSeller: true,
        variants: [
          { name: 'Pastel Garden Palette', colorHex: '#E8B4B8', priceDelta: 0, stock: 6 },
          { name: 'Warm Terracotta Palette', colorHex: '#C87D55', priceDelta: 0, stock: 4 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
            altText: 'Handmade gift box hamper with customized ribbon',
            isPrimary: true,
          },
        ],
      },
      {
        sku: 'BBP-GFT-002',
        name: 'Personalized Initial Charm & Crochet Flower Duo',
        slug: 'personalized-initial-charm-crochet-flower-duo',
        description: 'A customized gift made especially for birthdays and anniversaries. Enter the initial of your choice to be hand-cast in crystal resin with real gold foil and pressed dried flowers, paired with a matching crochet mini bloom.',
        categoryId: catMap['gift-sets'],
        price: 649,
        salePrice: 549,
        stock: 18,
        isMadeToOrder: true,
        productionDays: 'Made to order in 3-4 days',
        materials: 'Crystal UV resin, real pressed florals, 24k gold flakes, cotton yarn',
        dimensions: 'Charm 4cm height, bloom 5cm',
        weightGrams: 50,
        featured: false,
        isBestSeller: true,
        variants: [
          { name: 'Golden Flake & Rose Petal', colorHex: '#E8B4B8', priceDelta: 0, stock: 10 },
          { name: 'Silver Flake & Forget-Me-Not Blue', colorHex: '#93C5FD', priceDelta: 0, stock: 8 },
        ],
        images: [
          {
            imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
            altText: 'Personalized handcrafted gift set',
            isPrimary: true,
          },
        ],
      },
    ];

    for (const item of demoProducts) {
      const { variants, images, ...pData } = item;
      const [insertedP] = await db.insert(products).values(pData).returning();

      if (variants && variants.length > 0) {
        await db.insert(productVariants).values(
          variants.map((v) => ({
            productId: insertedP.id,
            name: v.name,
            colorHex: v.colorHex,
            priceDelta: v.priceDelta,
            stock: v.stock,
          }))
        );
      }

      if (images && images.length > 0) {
        await db.insert(productImages).values(
          images.map((img, idx) => ({
            productId: insertedP.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
            isPrimary: img.isPrimary,
            sortOrder: idx,
          }))
        );
      }
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during database seed:', err);
  }
}

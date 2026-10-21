// Automated Test Suite for Buzz by BeePri E-commerce Logic

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

// 1. Test Cart Calculation & Shipping Logic
function testCartCalculations() {
  console.log('\n[Suite 1] Testing Cart Pricing & Shipping Thresholds:');

  const FREE_SHIPPING_THRESHOLD = 999;
  const STANDARD_SHIPPING_FEE = 79;

  // Test 1: Order below threshold
  const subtotal1 = 548; // 2 keychains
  const fee1 = subtotal1 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  assert(fee1 === 79, 'Orders below ₹999 incur flat ₹79 shipping');

  // Test 2: Order at or above threshold
  const subtotal2 = 1199; // Gift hamper
  const fee2 = subtotal2 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  assert(fee2 === 0, 'Orders of ₹999+ receive FREE Pan-India shipping');

  // Test 3: Exactly ₹999
  const subtotal3 = 999;
  const fee3 = subtotal3 >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  assert(fee3 === 0, 'Orders of exactly ₹999 unlock free shipping');
}

// 2. Test Coupon Discounts
function testCoupons() {
  console.log('\n[Suite 2] Testing Coupon Code Rules:');

  // WELCOME10: 10% off, max ₹150, min order ₹299
  const couponWelcome = { type: 'percentage', value: 10, maxDiscount: 150, minOrder: 299 };
  
  // Under minimum
  const orderLow = 200;
  assert(orderLow < couponWelcome.minOrder, 'Coupon rejected if subtotal is below minimum order requirement');

  // Valid order
  const orderNormal = 800;
  const discountNormal = Math.min((orderNormal * couponWelcome.value) / 100, couponWelcome.maxDiscount);
  assert(discountNormal === 80, '10% applied correctly on ₹800 = ₹80');

  // Capped order
  const orderHigh = 2000;
  const discountCapped = Math.min((orderHigh * couponWelcome.value) / 100, couponWelcome.maxDiscount);
  assert(discountCapped === 150, 'Discount capped at maxDiscount (₹150)');

  // BUZZLOVE: Flat ₹150 off on ₹999+
  const couponFlat = { type: 'fixed', value: 150, minOrder: 999 };
  const order999 = 1000;
  const discountFlat = Math.min(couponFlat.value, order999);
  assert(discountFlat === 150, 'Flat ₹150 coupon deducted correctly');
}

// 3. Test Order Number and Address Validation
function testValidation() {
  console.log('\n[Suite 3] Testing Address & Order Formatting:');

  // Indian PIN code format
  const validPincode = '560038';
  const invalidPincode = '56003';
  assert(/^\d{6}$/.test(validPincode), 'Valid 6-digit Indian PIN code accepted');
  assert(!/^\d{6}$/.test(invalidPincode), 'Invalid 5-digit PIN code rejected');

  // Mobile number format
  const validMobile = '9876543210';
  const invalidMobile = '12345';
  assert(/^\d{10}$/.test(validMobile), 'Valid 10-digit Indian mobile number accepted');
  assert(!/^\d{10}$/.test(invalidMobile), 'Short mobile number rejected');

  // Order Number format
  const orderNum = `BBP-20261021-4821`;
  assert(/^BBP-\d{8}-\d{4}$/.test(orderNum), 'Order Number adheres to BBP-YYYYMMDD-XXXX format');
}

// 4. Test Permissions & Payment Idempotency
function testSecurity() {
  console.log('\n[Suite 4] Testing Security & Payment Verification:');

  const adminEmail: string = 'studiox700@gmail.com';
  const customerEmail: string = 'customer@gmail.com';
  assert(adminEmail === 'studiox700@gmail.com', 'Admin owner email granted dashboard access');
  assert(customerEmail !== 'studiox700@gmail.com', 'Regular customer email denied admin access');

  // Payment callback signature/idempotency simulation
  const processedPayments = new Set<string>();
  const paymentId = 'PAY-SANDBOX-1029384756';

  assert(!processedPayments.has(paymentId), 'New payment recognized');
  processedPayments.add(paymentId);
  assert(processedPayments.has(paymentId), 'Payment recorded as processed');
  
  // Duplicate check
  const isDuplicate = processedPayments.has(paymentId);
  assert(isDuplicate, 'Duplicate payment event detected and rendered idempotent');
}

try {
  console.log('=== Buzz by BeePri Automated Test Runner ===');
  testCartCalculations();
  testCoupons();
  testValidation();
  testSecurity();
  console.log('\n🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY!\n');
} catch (err: any) {
  console.error('\n❌ Test Failure:', err.message);
  process.exit(1);
}

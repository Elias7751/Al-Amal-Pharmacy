const BASE_URL = 'http://localhost:5000/api';

// Helper for making API calls
async function apiCall(method, endpoint, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`[${response.status}] ${data.message || 'API Error'}`);
  }
  return data.data;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  console.log('🧪 Starting End-to-End API Test for Al-Amal Pharmacy...');
  console.log('======================================================\n');
  
  let adminToken = '';
  let userToken = '';
  let categoryId = '';
  let productId = '';
  let orderId = '';

  const uniqueSuffix = Date.now().toString().slice(-6);

  try {
    // ---------------------------------------------------------
    // 1. ADMIN REGISTRATION & LOGIN
    // ---------------------------------------------------------
    process.stdout.write('1. Registering Admin account... ');
    const adminEmail = `admin_${uniqueSuffix}@alamal.com`;
    const adminData = await apiCall('POST', '/auth/register', {
      firstName: 'Super',
      lastName: 'Admin',
      email: adminEmail,
      password: 'password123',
      phone: `050000${uniqueSuffix}`
    });

    // Make the user an admin via direct DB call (since API forces 'customer')
    const mysql = require('mysql2/promise');
    const db = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'alamal_pharmacy' });
    await db.query(`UPDATE Users SET role='admin' WHERE email='${adminEmail}'`);
    await db.end();
    
    // Login to get token
    const adminLogin = await apiCall('POST', '/auth/login', {
      email: adminEmail,
      password: 'password123'
    });
    adminToken = adminLogin.token;
    console.log('✅ SUCCESS');

    // ---------------------------------------------------------
    // 2. USER REGISTRATION & LOGIN
    // ---------------------------------------------------------
    process.stdout.write('2. Registering Customer account... ');
    const userEmail = `customer_${uniqueSuffix}@alamal.com`;
    await apiCall('POST', '/auth/register', {
      firstName: 'John',
      lastName: 'Doe',
      email: userEmail,
      password: 'password123',
      phone: `051111${uniqueSuffix}`
    });
    const userLogin = await apiCall('POST', '/auth/login', {
      email: userEmail,
      password: 'password123'
    });
    userToken = userLogin.token;
    console.log('✅ SUCCESS');

    // ---------------------------------------------------------
    // 3. ADMIN: CREATE CATEGORY & PRODUCT
    // ---------------------------------------------------------
    process.stdout.write('3. Admin creating Category and Product... ');
    const category = await apiCall('POST', '/categories', {
      name: 'Vitamins ' + uniqueSuffix,
      description: 'Daily supplements'
    }, adminToken);
    categoryId = category.id;

    const product = await apiCall('POST', '/products', {
      categoryId: categoryId,
      name: 'Vitamin C 1000mg',
      description: 'Immunity booster',
      price: 15.50,
      stock: 100
    }, adminToken);
    productId = product.id;
    console.log('✅ SUCCESS');

    // ---------------------------------------------------------
    // 4. USER: ADD TO CART
    // ---------------------------------------------------------
    process.stdout.write('4. Customer adding product to Cart... ');
    await apiCall('POST', '/cart/items', {
      productId: productId,
      quantity: 2
    }, userToken);
    
    const cart = await apiCall('GET', '/cart', null, userToken);
    if (cart.items.length === 0) throw new Error('Cart is empty after adding');
    console.log('✅ SUCCESS');

    // ---------------------------------------------------------
    // 5. USER: CHECKOUT
    // ---------------------------------------------------------
    process.stdout.write('5. Customer checking out (placing order)... ');
    const order = await apiCall('POST', '/orders', {
      shippingAddress: '123 Test St, Riyadh',
      paymentMethod: 'Cash on Delivery'
    }, userToken);
    orderId = order.id;
    console.log(`✅ SUCCESS (Order Total: $${order.totalAmount})`);

    // ---------------------------------------------------------
    // 6. ADMIN: UPDATE ORDER STATUS
    // ---------------------------------------------------------
    process.stdout.write('6. Admin updating Order status to "Shipped"... ');
    await apiCall('PUT', `/orders/${orderId}/status`, {
      status: 'Shipped'
    }, adminToken);
    console.log('✅ SUCCESS');

    // Wait a moment for async DB triggers if any
    await sleep(500);

    // ---------------------------------------------------------
    // 7. USER: CHECK NOTIFICATIONS
    // ---------------------------------------------------------
    process.stdout.write('7. Checking if Customer received a Notification... ');
    const notifications = await apiCall('GET', '/notifications', null, userToken);
    if (notifications.length === 0) {
      throw new Error('No notification found for order status update');
    }
    if (!notifications[0].message.includes('Shipped')) {
      throw new Error('Notification text incorrect');
    }
    console.log('✅ SUCCESS (Notification received!)');

    // ---------------------------------------------------------
    // 8. ADMIN: CHECK ANALYTICS
    // ---------------------------------------------------------
    process.stdout.write('8. Admin viewing Analytics Dashboard... ');
    const analytics = await apiCall('GET', '/analytics/dashboard', null, adminToken);
    if (analytics.totalOrders < 1) {
      throw new Error('Analytics failed to register the order');
    }
    console.log(`✅ SUCCESS (Total Revenue: $${analytics.totalRevenue})`);

    console.log('\n======================================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! The APIs are working perfectly.');
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED');
    console.error('Error Details:', error.message);
    process.exit(1);
  }
}

runTests();

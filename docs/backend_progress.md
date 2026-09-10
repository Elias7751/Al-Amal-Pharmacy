# توثيق وتتبع عمل الباك إند (Backend Progress Tracker)

هذا الملف مخصص لتتبع كل ما تم إنجازه وما يتبقى في الباك إند لمشروع **صيدلية الأمل**.

## 1. الإعدادات الأساسية (Core Setup)
- [x] هيكلة المجلدات والملفات (Folder Structure)
- [x] تهيئة `package.json` وتثبيت الحزم (npm init & install)
- [x] إعداد السيرفر الأساسي (`server.js` & `app.js`)
- [x] إعداد المتغيرات البيئية (`.env`)
- [x] إعداد الاتصال بقاعدة البيانات (Sequelize/PostgreSQL)
- [ ] إعداد الـ Error Handling Middleware العام

## 2. إدارة المستخدمين والمصادقة (Auth & Users)
- [x] نموذج المستخدم (User Model)
- [x] تسجيل مستخدم جديد (Register)
- [x] تسجيل الدخول وإصدار التوكن (Login & JWT)
- [x] صلاحيات الأدمن والمستخدم (Role Middleware)
- [ ] عرض وتعديل الملف الشخصي (Profile)

## 3. إدارة المنتجات والأقسام (Products & Categories)
- [x] نموذج القسم (Category Model)
- [x] CRUD للأقسام
- [x] نموذج المنتج (Product Model)
- [x] CRUD للمنتجات
- [x] الفلترة والبحث والترتيب (Filtering, Searching, Sorting)

## 4. سلة المشتريات (Cart)
- [x] نموذج السلة (Cart Model)
- [x] إضافة منتجات للسلة
- [x] تعديل الكميات وحذف المنتجات

## 5. الطلبات والمدفوعات (Orders & Payment)
- [x] نموذج الطلب (Order Model)
- [x] إنشاء طلب جديد (Checkout)
- [x] عرض طلبات المستخدم
- [x] إدارة حالات الطلب (Admin Order Management)
- [ ] دمج بوابة الدفع (Stripe أو ما يعادلها)

## 6. الوصفات الطبية (Prescriptions)
- [x] نموذج الوصفة الطبية (Prescription Model)
- [x] رفع الوصفة الطبية من قبل المستخدم
- [x] مراجعة الوصفة من قبل الصيدلي (Admin) وتحويلها لطلب

## 7. المراجعات والتقييمات (Reviews)
- [x] نموذج التقييم (Review Model)
- [x] إضافة تقييم لمنتج
- [x] حساب متوسط التقييمات للمنتج (Frontend logic based on API)

## 8. الكوبونات والخصومات (Coupons)
- [x] نموذج الكوبون (Coupon Model)
- [x] تطبيق الكوبون على السلة

## 9. إدارة المخزون (Inventory)
- [ ] نموذج المخزون (Inventory Model)
- [ ] تحديث المخزون تلقائياً عند إتمام الطلب

## 10. الإشعارات (Notifications)
- [x] نموذج الإشعار (Notification Model)
- [x] إرسال إشعار للمستخدمين

## 11. التحليلات (Analytics)
- [x] إحصائيات لوحة التحكم (Admin Dashboard Stats)

---
*تاريخ آخر تحديث: سيتم التحديث بشكل مستمر.*

# API Testing Guide - Al-Amal Pharmacy

هذا الملف يشرح كيفية استخدام السكريبت المبرمج خصيصاً لاختبار كافة واجهات برمجة التطبيقات (APIs) الخاصة بالمشروع بشكل آلي للتأكد من عملها بنجاح معاً (End-to-End Testing).

## ما الذي يقوم به السكريبت؟
سيقوم السكريبت بمحاكاة رحلة كاملة بدون أي تدخل بشري:
1. إنشاء حساب مدير (Admin) وتسجيل الدخول.
2. إنشاء حساب مستخدم عادي (Customer) وتسجيل الدخول.
3. يقوم المدير بإنشاء (تصنيف جديد) و (منتج جديد).
4. يقوم المستخدم بإضافة هذا المنتج إلى سلة المشتريات (Cart).
5. يقوم المستخدم بإتمام الطلب والدفع (Checkout).
6. يقوم المدير بتغيير حالة الطلب لتصبح "تم الشحن" (Shipped).
7. يتأكد السكريبت من أن النظام أرسل إشعاراً (Notification) للمستخدم لتنبيهه بتغير حالة الطلب.
8. يقوم المدير باستدعاء لوحة تحكم التحليلات (Analytics) للتأكد من أن الأرباح والطلبات تم حسابها بدقة.

## المتطلبات المسبقة (Prerequisites)
1. يجب أن يكون خادم قواعد البيانات (PostgreSQL) يعمل على جهازك.
2. يجب أن يكون خادم Node.js (الباك إند) يعمل في الخلفية.

## كيفية التشغيل
1. افتح نافذة الأوامر (Terminal) في مجلد `backend`.
2. قم بتشغيل الخادم (السيرفر):
   ```bash
   npm start
   ```
   *(تأكد من ظهورة رسالة `Database connected` و `Server running on port 5000`)*

3. افتح نافذة أوامر (Terminal) أخرى جديدة في مجلد `backend`.
4. نفذ أمر الفحص:
   ```bash
   node scripts/test-api.js
   ```

## النتائج المتوقعة (Expected Output)
إذا كان كل شيء مبرمجاً بشكل صحيح ولم تحدث أخطاء، ستشاهد الآتي في الشاشة:
```text
🧪 Starting End-to-End API Test for Al-Amal Pharmacy...
======================================================

1. Registering Admin account... ✅ SUCCESS
2. Registering Customer account... ✅ SUCCESS
3. Admin creating Category and Product... ✅ SUCCESS
4. Customer adding product to Cart... ✅ SUCCESS
5. Customer checking out (placing order)... ✅ SUCCESS (Order Total: $31)
6. Admin updating Order status to "Shipped"... ✅ SUCCESS
7. Checking if Customer received a Notification... ✅ SUCCESS (Notification received!)
8. Admin viewing Analytics Dashboard... ✅ SUCCESS (Total Revenue: $31)

======================================================
🎉 ALL TESTS PASSED SUCCESSFULLY! The APIs are working perfectly.
======================================================
```

## معالجة الأخطاء (Troubleshooting)
- إذا ظهر لك خطأ `ECONNREFUSED` فهذا يعني أن سيرفر الباك إند غير يعمل. يجب تشغيله عبر `npm start`.
- إذا ظهر لك خطأ متعلق بـ `PostgreSQL`، فتأكد أن خدمة قاعدة البيانات تعمل وأن الإعدادات في ملف `.env` صحيحة.

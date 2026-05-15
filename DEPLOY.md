# دليل نشر عقارات بنها على cPanel

## طريقة البناء والرفع

### 1. بناء المشروع (Build)

```bash
# من مجلد Replit أو جهازك
pnpm install
pnpm --filter @workspace/banha-realestate run build
```

ستجد ملفات الإنتاج في: `artifacts/banha-realestate/dist/public/`

### 2. رفع الملفات على cPanel

1. ادخل على **File Manager** في cPanel
2. انتقل إلى مجلد `public_html` (أو المجلد الجذر للدومين)
3. ارفع **محتويات** مجلد `dist/public/` كلها  
   (index.html، مجلد assets، .htaccess، favicon، إلخ)

### 3. إعداد .htaccess

الملف `.htaccess` موجود بالفعل في `public/` وسيُنسخ تلقائياً عند البناء.  
يضمن أن جميع الروابط (مثل `/admin`, `/search`, `/property/1`) تعمل بشكل صحيح.

---

## بيانات دخول لوحة الأدمن

- **الرابط:** `https://yourdomain.com/admin/login`
- **البريد:** `admin@banha.com`
- **كلمة المرور:** `admin123`

---

## ملاحظات مهمة

- الموقع **React SPA** — كل الصفحات تعمل من `index.html`
- لا يحتاج PHP أو قاعدة بيانات لتشغيل الواجهة الأمامية
- إذا أردت ربط backend حقيقي، عدّل `proxy` في `vite.config.ts` قبل البناء

# دليل النشر الكامل — عقارات بنها

> للتوثيق الكامل انظر [README.md](./README.md)

---

## ⚡ النشر السريع على cPanel (Static Hosting)

```bash
# 1. ثبّت الحزم
pnpm install

# 2. ابنِ الفرونتند
pnpm --filter @workspace/banha-realestate run build

# 3. ارفع محتويات هذا المجلد على public_html في cPanel:
#    artifacts/banha-realestate/dist/public/
```

**الملفات التي ترفعها على public_html:**
```
index.html
.htaccess          ← مهم للـ SPA routing
assets/
favicon.svg
robots.txt
opengraph.jpg
```

---

## ⚡ النشر على VPS (Frontend + Backend)

```bash
# 1. على السيرفر
git clone <repo> /var/www/banha
cd /var/www/banha
cp .env.example .env && nano .env

# 2. ثبّت وابنِ
pnpm install
pnpm build:prod
pnpm db:push

# 3. شغّل مع PM2
npm i -g pm2
pm2 start "NODE_ENV=production PORT=3001 node artifacts/api-server/dist/index.mjs" --name banha
pm2 save && pm2 startup
```

---

## بيانات دخول لوحة الأدمن

| | |
|--|--|
| الرابط | `https://yourdomain.com/admin/login` |
| البريد | `admin@banha.com` |
| كلمة المرور | `admin123` |

> ⚠️ غيّر كلمة المرور فوراً بعد أول تسجيل دخول.

---

للتفاصيل الكاملة (Windows، MySQL، Nginx، HTTPS): راجع **[README.md](./README.md)**

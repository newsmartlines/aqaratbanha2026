# 🏠 عقارات بنها — Banha Real Estate

منصة عقارية احترافية لمنطقة بنها والقليوبية، مصر.  
A professional real estate platform for the Banha/Qalyubia region of Egypt.

[![Node.js](https://img.shields.io/badge/Node.js-24+-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)](https://www.postgresql.org)

---

## 📋 المحتويات / Table of Contents

- [المتطلبات / Requirements](#-المتطلبات--requirements)
- [التشغيل المحلي / Local Setup](#-التشغيل-المحلي--local-development)
- [البناء الإنتاجي / Production Build](#-البناء-الإنتاجي--production-build)
- [النشر على cPanel](#-النشر-على-cpanel)
- [النشر على VPS](#-النشر-على-vps--linux-server)
- [قاعدة البيانات / Database](#-قاعدة-البيانات--database)
- [متغيرات البيئة / Environment Variables](#-متغيرات-البيئة--environment-variables)
- [بيانات الأدمن / Admin Access](#-بيانات-الأدمن--admin-access)
- [استكشاف الأخطاء / Troubleshooting](#-استكشاف-الأخطاء--troubleshooting)

---

## ⚙️ المتطلبات / Requirements

| الأداة | الإصدار | الرابط |
|--------|---------|--------|
| Node.js | 20 LTS أو أعلى | https://nodejs.org |
| pnpm | 9+ | `npm install -g pnpm` |
| PostgreSQL | 14+ | https://www.postgresql.org |

---

## 🖥️ التشغيل المحلي / Local Development

### 1 — استنساخ المشروع / Clone

```bash
git clone https://github.com/your-username/banha-realestate.git
cd banha-realestate
```

### 2 — إعداد متغيرات البيئة / Environment

```bash
cp .env.example .env
```

عدّل ملف `.env` وأدخل بيانات قاعدة البيانات الخاصة بك.  
Edit `.env` with your database credentials.

### 3 — تثبيت الحزم / Install

```bash
pnpm install
```

### 4 — إنشاء جداول قاعدة البيانات / Database Setup

```bash
pnpm db:push
```

### 5 — التشغيل / Start

افتح **ترمينالين** منفصلين / Open **two terminals**:

**الترمينال الأول — Backend API:**
```bash
PORT=3001 pnpm --filter @workspace/api-server run dev
```

**الترمينال الثاني — Frontend:**
```bash
PORT=5000 pnpm --filter @workspace/banha-realestate run dev
```

ثم افتح المتصفح على: **http://localhost:5000**

---

## 🔨 البناء الإنتاجي / Production Build

```bash
# بناء كامل (فرونتند + باك إند)
pnpm build:prod

# أو خطوة بخطوة:
pnpm --filter @workspace/banha-realestate run build   # Frontend → artifacts/banha-realestate/dist/public/
pnpm --filter @workspace/api-server run build          # Backend  → artifacts/api-server/dist/
```

بعد البناء، يمكنك تشغيل الإنتاج:

```bash
DATABASE_URL=your_database_url PORT=3001 pnpm start:prod
```

السيرفر سيخدم:
- **API:** على `/api/v1/...`
- **الواجهة:** كل طلبات أخرى → `index.html` (SPA)

---

## 🌐 النشر على cPanel

### الخيار أ — Static Frontend فقط (بدون Backend)

مناسب إذا كنت تريد نشر الواجهة فقط على Apache hosting عادي.

```bash
# 1. ابنِ الفرونتند
pnpm --filter @workspace/banha-realestate run build

# 2. ارفع محتويات هذا المجلد كاملاً على public_html في cPanel:
artifacts/banha-realestate/dist/public/
```

**ملفات ترفعها على cPanel:**
```
public_html/
├── index.html
├── .htaccess          ← مهم جداً لـ SPA routing
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── favicon.svg
├── robots.txt
└── opengraph.jpg
```

> ملف `.htaccess` موجود بالفعل في المشروع ويُنسخ تلقائياً عند البناء.  
> يضمن أن روابط مثل `/admin` و `/property/123` تعمل بشكل صحيح.

---

### الخيار ب — Node.js App على cPanel (Frontend + Backend)

إذا كان cPanel لديك يدعم Node.js App Manager:

#### 1. ابنِ المشروع كاملاً

```bash
pnpm install
pnpm build:prod
```

#### 2. جهّز حزمة النشر

```bash
# أنشئ مجلد النشر
mkdir deploy-package

# انسخ ملفات السيرفر
cp -r artifacts/api-server/dist/ deploy-package/
cp artifacts/api-server/package.json deploy-package/

# السيرفر يخدم الفرونتند تلقائياً — تأكد من المسار
# المسار الافتراضي: ../../banha-realestate/dist/public
cp -r artifacts/banha-realestate/dist/public/ deploy-package/public/
```

#### 3. على cPanel

1. افتح **Node.js App Manager** في cPanel
2. أنشئ تطبيق جديد:
   - **Node.js Version:** 20 أو أعلى
   - **Application Mode:** Production
   - **Application Root:** المجلد الذي رفعته
   - **Application URL:** دومينك
   - **Application Startup File:** `index.mjs`
3. أضف متغيرات البيئة (DATABASE_URL, PORT, NODE_ENV=production)
4. اضغط **Run NPM Install** ثم **Start App**

---

## 🖥️ النشر على VPS / Linux Server

### متطلبات السيرفر

- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- Node.js 20 LTS
- PostgreSQL 14+
- Nginx (موصى به) أو Apache

### خطوات التثبيت

```bash
# 1. ثبّت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# 2. ثبّت PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql

# 3. أنشئ قاعدة البيانات
sudo -u postgres psql
```
```sql
CREATE DATABASE banha_realestate;
CREATE USER banha_user WITH ENCRYPTED PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE banha_realestate TO banha_user;
\q
```

```bash
# 4. انسخ المشروع
git clone https://github.com/your-username/banha-realestate.git /var/www/banha-realestate
cd /var/www/banha-realestate

# 5. أعدّ البيئة
cp .env.example .env
nano .env   # أدخل DATABASE_URL وبقية القيم

# 6. ثبّت وابنِ
pnpm install
pnpm build:prod
pnpm db:push

# 7. شغّل (يدوياً للاختبار)
NODE_ENV=production pnpm start:prod
```

### إعداد PM2 (للتشغيل الدائم)

```bash
npm install -g pm2

# شغّل التطبيق
pm2 start "NODE_ENV=production pnpm start:prod" --name banha-realestate

# شغّل عند إعادة تشغيل السيرفر
pm2 startup
pm2 save
```

### إعداد Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/banha-realestate /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# HTTPS with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 💻 التشغيل المحلي على Windows (XAMPP / Laragon)

### باستخدام Laragon (أسهل)

1. ثبّت [Laragon](https://laragon.org)
2. ثبّت PostgreSQL إضافةً أو استخدم MySQL
3. افتح **Laragon Terminal** وشغّل:

```cmd
cd C:\laragon\www\banha-realestate
copy .env.example .env
:: عدّل DATABASE_URL في .env
pnpm install
pnpm build:prod
pnpm db:push
set NODE_ENV=production && set PORT=3001 && pnpm start
```

ثم افتح: **http://localhost:3001**

### باستخدام Node.js مباشرة على Windows

```cmd
:: في CMD أو PowerShell
set DATABASE_URL=postgresql://user:pass@localhost:5432/banha_realestate
set PORT=3001
set NODE_ENV=production
node artifacts/api-server/dist/index.mjs
```

---

## 🗄️ قاعدة البيانات / Database

### PostgreSQL (الافتراضي والمدعوم)

```bash
# دفع schema إلى قاعدة البيانات (يُنشئ الجداول)
pnpm db:push

# إعادة الدفع بالقوة (تحذير: يحذف البيانات)
pnpm --filter @workspace/db run push-force
```

### MySQL / MariaDB

حالياً المشروع يستخدم **PostgreSQL** مع Drizzle ORM.  
يمكن التحويل لـ MySQL بتعديل `lib/db/src/index.ts` واستبدال `drizzle-orm/node-postgres` بـ `drizzle-orm/mysql2`.

---

## 🔐 متغيرات البيئة / Environment Variables

| المتغير | الوصف | مطلوب |
|---------|-------|--------|
| `DATABASE_URL` | رابط PostgreSQL | ✅ نعم |
| `PORT` | بورت السيرفر (افتراضي: 3001) | لا |
| `NODE_ENV` | `production` أو `development` | لا |
| `JWT_SECRET` | مفتاح JWT للمصادقة | ✅ نعم |
| `JWT_EXPIRES_IN` | مدة صلاحية التوكن (افتراضي: 7d) | لا |
| `SMTP_HOST` | خادم البريد | لا |
| `SMTP_USER` | بريد SMTP | لا |
| `SMTP_PASS` | كلمة مرور SMTP | لا |
| `APP_URL` | رابط الموقع الكامل | لا |

انظر `.env.example` لقائمة كاملة.

---

## 👤 بيانات الأدمن / Admin Access

| | |
|--|--|
| **رابط لوحة التحكم** | `/admin/login` |
| **البريد الافتراضي** | `admin@banha.com` |
| **كلمة المرور الافتراضية** | `admin123` |

> ⚠️ **غيّر كلمة المرور فوراً بعد أول تسجيل دخول في الإنتاج.**

---

## 🏗️ بنية المشروع / Project Structure

```
banha-realestate/
├── artifacts/
│   ├── banha-realestate/      # React 19 + Vite frontend
│   │   ├── src/
│   │   ├── public/            # .htaccess, favicon, robots.txt
│   │   └── dist/public/       # Production build output
│   └── api-server/            # Express 5 backend
│       ├── src/
│       └── dist/              # Production build output
├── lib/
│   ├── db/                    # Drizzle ORM schema + client
│   ├── api-spec/              # OpenAPI specification
│   ├── api-zod/               # Zod schemas (codegen)
│   └── api-client-react/      # React Query hooks (codegen)
├── scripts/                   # Build and utility scripts
├── .env.example               # Environment variables template
├── package.json               # Root package scripts
└── pnpm-workspace.yaml        # pnpm monorepo config
```

---

## 🔧 استكشاف الأخطاء / Troubleshooting

### ❌ `DATABASE_URL is not set`

أنشئ ملف `.env` في جذر المشروع وأضف متغير `DATABASE_URL`.

### ❌ `Cannot connect to database`

- تأكد أن PostgreSQL يعمل: `sudo systemctl status postgresql`
- تحقق من بيانات الاتصال في `.env`
- تأكد أن قاعدة البيانات موجودة: `psql -U postgres -l`

### ❌ صفحات React تعطي 404 على cPanel

تأكد أن ملف `.htaccess` موجود في `public_html/` وأن `mod_rewrite` مفعّل في Apache.

### ❌ `EADDRINUSE: address already in use`

البورت مشغول — غيّر البورت في `.env`:
```bash
PORT=3002
```

### ❌ بطء في التحميل

- تأكد أن `NODE_ENV=production` مضبوط
- استخدم `pnpm build:prod` وليس `pnpm dev` في الإنتاج
- فعّل Gzip في Nginx أو Apache

### ❌ خطأ في `pnpm install`

```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 🛠️ Stack التقني / Tech Stack

| الطبقة | التقنية |
|--------|---------|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion |
| UI Components | Shadcn UI, Radix UI, Lucide Icons |
| Map | React Leaflet (OpenStreetMap) |
| Backend | Express 5, Node.js 20+ |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod |
| API | REST + OpenAPI spec (Orval codegen) |
| Language | TypeScript 5.9 |
| Package Manager | pnpm (monorepo) |

---

## 📄 الترخيص / License

MIT © 2026 عقارات بنها

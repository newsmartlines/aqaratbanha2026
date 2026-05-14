# دليل تشغيل المشروع محلياً ورفعه على cPanel

## 🖥️ أولاً: التشغيل على جهازك المحلي (Local Development)

### المتطلبات المطلوبة

| الأداة | الإصدار المطلوب | رابط التحميل |
|--------|----------------|--------------|
| Node.js | 20 أو أعلى | https://nodejs.org |
| pnpm | أحدث إصدار | `npm install -g pnpm` |
| PostgreSQL | 14 أو أعلى | https://www.postgresql.org/download |
| Git | أي إصدار | https://git-scm.com |

---

### الخطوات على Windows

#### 1. حمّل المشروع
```bash
# من Replit: اضغط على قائمة "..." ثم "Download as ZIP"
# فك الضغط في أي مجلد مثل C:\Projects\banha-realestate
```

#### 2. ثبّت pnpm
```bash
npm install -g pnpm
```

#### 3. ابدأ قاعدة البيانات
- حمّل PostgreSQL وثبّته
- افتح pgAdmin أو psql وأنشئ قاعدة بيانات:
```sql
CREATE DATABASE banha_realestate;
CREATE USER banha_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE banha_realestate TO banha_user;
```

#### 4. أنشئ ملف `.env`
في مجلد جذر المشروع (جنب `package.json`)، أنشئ ملف اسمه `.env`:
```env
DATABASE_URL=postgresql://banha_user:your_password@localhost:5432/banha_realestate
```

#### 5. ثبّت الحزم
```bash
cd C:\Projects\banha-realestate
pnpm install
```

#### 6. ابدأ قاعدة البيانات (الجداول)
```bash
pnpm --filter @workspace/db run push
```

#### 7. شغّل السيرفر والفرونتند
افتح **ترمينالين منفصلين**:

**الترمينال الأول (الباك إند):**
```bash
PORT=3001 pnpm --filter @workspace/api-server run dev
```

**الترمينال الثاني (الفرونتند):**
```bash
PORT=5000 pnpm --filter @workspace/banha-realestate run dev
```

ثم افتح المتصفح على: **http://localhost:5000**

---

### الخطوات على Mac

نفس الخطوات تماماً، فقط ثبّت PostgreSQL عبر Homebrew:
```bash
brew install postgresql@16
brew services start postgresql@16
createdb banha_realestate
```

---

## 🌐 ثانياً: الرفع على cPanel

### المتطلبات في cPanel
- استضافة تدعم **Node.js** (CloudLinux + cPanel Node.js Selector)
- قاعدة بيانات **PostgreSQL** (أو MySQL — لكن المشروع مكتوب لـ PostgreSQL)
- مساحة لا تقل عن **500MB**

> ⚠️ **ملاحظة مهمة**: معظم الاستضافات الرخيصة لا تدعم PostgreSQL في cPanel.
> إذا استضافتك تدعم MySQL فقط، تواصل معنا لتحويل قاعدة البيانات.

---

### خطوات البناء والرفع

#### الخطوة 1: أنشئ حزمة الإنتاج (على جهازك أو Replit)
```bash
# من جذر المشروع
node scripts/build-cpanel.mjs
```
سيُنشئ هذا مجلد **`cpanel-deploy/`** يحتوي على كل الملفات الجاهزة.

#### الخطوة 2: اضغط المجلد
```bash
# على Windows (PowerShell)
Compress-Archive -Path cpanel-deploy\* -DestinationPath banha-deploy.zip

# على Mac/Linux
cd cpanel-deploy && zip -r ../banha-deploy.zip .
```

#### الخطوة 3: في cPanel — أنشئ قاعدة البيانات
1. افتح **cPanel → PostgreSQL Databases** (أو MySQL إن لم يتوفر PostgreSQL)
2. أنشئ قاعدة بيانات جديدة باسم مثل: `username_banha`
3. أنشئ مستخدم وكلمة مرور
4. اربط المستخدم بقاعدة البيانات

#### الخطوة 4: ارفع الملفات
1. افتح **cPanel → File Manager**
2. انتقل إلى `/home/username/` (مجلدك الرئيسي)
3. أنشئ مجلد جديد اسمه `banha-app`
4. ارفع `banha-deploy.zip` داخله
5. فك الضغط (Extract)

#### الخطوة 5: إعداد Node.js App
1. افتح **cPanel → Setup Node.js App** (أو Node.js Selector)
2. اضغط **Create Application**
3. اضبط الإعدادات:

| الحقل | القيمة |
|-------|--------|
| Node.js version | 20.x أو أعلى |
| Application mode | Production |
| Application root | `/home/username/banha-app` |
| Application URL | `yourdomain.com` أو `yourdomain.com/banha` |
| Application startup file | `startup.js` |

4. اضغط **Create**

#### الخطوة 6: ضبط متغيرات البيئة
في نفس صفحة الـ Node.js App، أضف متغيرات البيئة:

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | `postgresql://db_user:password@localhost:5432/db_name` |
| `NODE_ENV` | `production` |

#### الخطوة 7: تثبيت الحزم
في صفحة الـ Node.js App، اضغط **Run NPM Install** (أو عبر SSH):
```bash
cd ~/banha-app
npm install
```

#### الخطوة 8: ابدأ التطبيق
اضغط **Start App** أو **Restart** في صفحة الـ Node.js App.

---

### الوصول للتطبيق
- إذا ربطت الـ domain الرئيسي: `https://yourdomain.com`
- إذا ربطت subdirectory: `https://yourdomain.com/banha`

---

## 🗄️ ضبط قاعدة البيانات بعد الرفع

### عبر SSH (موصى به)
```bash
# اتصل بالسيرفر
ssh username@yourdomain.com

# انتقل للتطبيق
cd ~/banha-app

# شغّل migration لإنشاء الجداول
# (تحتاج pnpm على السيرفر — بديلاً استخدم الملف المُصدَّر)
node -e "
import('./index.mjs').then(m => {
  console.log('Server started, DB should auto-connect');
});
"
```

### عبر pgAdmin (أسهل)
1. اتصل بقاعدة البيانات من جهازك باستخدام بيانات cPanel
2. شغّل ملف SQL للجداول إذا احتجت

---

## 🔧 حل المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| `pnpm install` يفشل على Windows | استخدم PowerShell كـ Administrator، أو WSL |
| `MODULE_NOT_FOUND` بعد الرفع | تأكد أنك شغّلت `npm install` في مجلد `cpanel-deploy` |
| الصفحة تُرجع 502 | تأكد أن الـ Node.js App شغّال في cPanel |
| لا تتصل بقاعدة البيانات | تحقق من `DATABASE_URL` في متغيرات البيئة |
| صفحات React تُرجع 404 | تأكد أن startup file = `startup.js` |

---

## 📞 بنية المشروع (مرجع سريع)

```
banha-realestate/
├── artifacts/
│   ├── banha-realestate/    ← الفرونتند (React + Vite)
│   │   └── dist/public/     ← الملفات المبنية
│   └── api-server/          ← الباك إند (Express)
│       └── dist/index.mjs   ← السيرفر المُجمَّع
├── lib/
│   └── db/                  ← قاعدة البيانات (Drizzle ORM)
├── scripts/
│   └── build-cpanel.mjs     ← سكريبت البناء للـ cPanel
├── cpanel-deploy/           ← ✅ الحزمة الجاهزة للرفع (بعد البناء)
└── LOCAL_SETUP.md           ← هذا الملف
```

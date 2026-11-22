# PainVisual Infrastructure Plan

## خطة البنية التحتية والاستضافة (Infrastructure & Deployment Plan)
### مشروع: تطبيق الاستشارات الطبية — وصف الألم بالنموذج التفاعلي
**الشعار والموقف الإرغونومي:** «الألم يُرى ولا يُوصف بالكلمات»  
**الوثيقة:** الدليل الهندسي لتشغيل ونشر وحماية البنية التحتية (DevOps & Infrastructure Manual)  
**الإصدار:** 1.0 — MVP نوفمبر 2026  
**المراجع الحاكمة:** [cahier_charge.md](file:///c:/Users/MO/Desktop/ai-drive/cahier_charge.md) | [architecture.md](file:///c:/Users/MO/Desktop/ai-drive/New%20files/architecture.md) | [backend-plan.md](file:///c:/Users/MO/Desktop/ai-drive/New%20files/backend-plan.md) | [api-contract.md](file:///c:/Users/MO/Desktop/ai-drive/New%20files/api-contract.md)

---

## فهرس المحتويات (Table of Contents)

1. [الهدف ومبادئ حوكمة البنية التحتية (Purpose & Governance)](#1-الهدف-ومبادئ-حوكمة-البنية-التحتية-purpose--governance)
2. [مسؤوليات بيئات التشغيل (Runtime Responsibilities)](#2-مسؤوليات-بيئات-التشغيل-runtime-responsibilities)
3. [طبولوجيا بيئة التطوير المحلية (Local Development Topology)](#3-طبولوجيا-بيئة-التطوير-المحلية-local-development-topology)
4. [معمارية قاعدة البيانات وإدارتها (Database Strategy)](#4-معمارية-قاعدة-البيانات-وإدارتها-database-strategy)
5. [مخزن الملفات والصوت المشفر (Encrypted Object Storage & Audio Vault)](#5-مخزن-الملفات-والصوت-المشفر-encrypted-object-storage--audio-vault)
6. [مهام الحذف التلقائي والخصوصية الصحية (Health Privacy & Ephemeral Data Lifecycle)](#6-مهام-الحذف-التلقائي-والخصوصية-الصحية-health-privacy--ephemeral-data-lifecycle)
7. [البيئات التشغيلية ومتغيرات البيئة (Environments & Configuration Matrix)](#7-البيئات-التشغيلية-ومتغيرات-البيئة-environments--configuration-matrix)
8. [استراتيجية النشر السحابي (Cloud Deployment Strategy)](#8-استراتيجية-النشر-السحابي-cloud-deployment-strategy)
9. [الشبكات، النطاقات، والأمان السحابي (Networking, Domains & Edge Security)](#9-الشبكات-النطاقات-والأمان-السحابي-networking-domains--edge-security)
10. [المراقبة، السجلات، وتتبع الأداء (Observability, Logging & Health Checks)](#10-المراقبة-السجلات-وتتبع-الأداء-observability-logging--health-checks)
11. [النسخ الاحتياطي والتعافي من الكوارث (Backups & Disaster Recovery)](#11-النسخ-الاحتياطي-والتعافي-من-الكوارث-backups--disaster-recovery)

---

## 1. الهدف ومبادئ حوكمة البنية التحتية (Purpose & Governance)

تحدد هذه الوثيقة معمارية تشغيل واستضافة وحماية منصة **PainVisual**. تهدف البنية التحتية إلى تلبية متطلبات الأداء العالي (استجابة لمسية فورية) مع الالتزام التام بمتطلبات الخصوصية الصحية الصارمة (Health Data Privacy) الواردة في [cahier_charge.md](file:///c:/Users/MO/Desktop/ai-drive/cahier_charge.md).

### المبادئ الحاكمة للبنية التحتية:
- **البنية عديمة الحالة (Stateless Compute):** تشغيل خادم الواجهة الخلفية كخدمة عديمة الحالة تماماً في حاوية خفيفة؛ حيث لا يتم حفظ أي ملفات أو جلسات دائمة على نظام ملفات الخادم.
- **التخزين المشفر المؤقت (Ephemeral Encrypted Storage):** تطبيق سياسة التدوير والشطب التلقائي للبيانات الصحية المسجلة (حذف الجلسات غير المكتملة بعد 6 ساعات، وإتلاف التقارير والملاحظات الصوتية بعد 48 ساعة من مشاركتها).
- **التشغيل بدون تعقيد (Lean & Pragmatic Infrastructure):** عدم إقحام خدمات غير مبررة (مثل خوادم الدفع، أو طوابير الرسائل الضخمة) التي كانت تخص مشاريع سابقة، والتركيز الحصري على الخدمات الضرورية لتشغيل التطبيق السريري.

---

## 2. مسؤوليات بيئات التشغيل (Runtime Responsibilities)

يقسم النظام أحمال العمل التشغيلية بوضوح لضمان استقرار الأداء:

| المكون التشغيلي (Runtime) | الدور والمسؤولية | التقنية المعتمدة | البيئة المحلية | البيئة السحابية الإنتاجية |
|---|---|---|---|---|
| **الواجهة الأمامية (`frontend`)** | تقديم تطبيق الويب التفاعلي المتجاوب (PWA SPA) للمريض والطبيب | React 19 + Vite | `localhost:5173` | CDN عالمي (Vercel / Cloudflare Pages) |
| **الواجهة الخلفية (`backend-api`)** | معالجة طلبات REST، والتحقق، وتجميع سجلات الألم | Node.js 20 LTS + Express | `localhost:5000` | حاوية سحابية مدارة (Render / Railway / Fly.io) |
| **قاعدة البيانات (`database`)** | حفظ الجلسات وسجلات الألم وأكواد العيادة | PostgreSQL 15+ (مع JSONB) أو MongoDB | `localhost:5432` | قاعدة مدارة (Neon / Supabase / Atlas) |
| **مخزن الصوت والملفات (`object-storage`)** | حفظ الملاحظات الصوتية المشفرة وملفات PDF السريرية | S3-Compatible API | محلياً عبر MinIO | AWS S3 أو Cloudflare R2 |
| **المهام المجدولة (`cron-daemon`)** | تنفيذ مهام الحذف التلقائي للجلسات والتقارير المنتهية | Node-Cron مدمج | يعمل مع الـ API | مدمج كعملية داخلية للـ Backend |

---

## 3. طبولوجيا بيئة التطوير المحلية (Local Development Topology)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        LOCAL DEVELOPMENT TOPOLOGY                      │
│                                                                        │
│   [ متصفح المريض / الطبيب ]                                            │
│        │                                                               │
│        ├── http://localhost:5173 ────► [ Frontend Vite Dev Server ]    │
│        │                                     │                         │
│        │                                     ▼ Proxy /v1/*             │
│        └── http://localhost:5000/v1 ─► [ Backend Node.js Express API ] │
│                                              │                         │
│                     ┌────────────────────────┴──────────────────┐      │
│                     ▼                                           ▼      │
│         [ PostgreSQL / Prisma ]                       [ MinIO S3 Server ]
│             :5432 / DB: painvisual                      :9000 / Bucket: audio
└────────────────────────────────────────────────────────────────────────┘
```

### أوامر التشغيل المحلي السريع:
```bash
# تشغيل كامل المنظومة محلياً من جذر المشروع
npm run dev

# أو تشغيل كل طرف بشكل منفصل:
npm run dev:frontend   # منفذ 5173
npm run dev:backend    # منفذ 5000
```

---

## 4. معمارية قاعدة البيانات وإدارتها (Database Strategy)

### 4.1 البيئات ونوع الاستضافة
- **البيئة المحلية (Local):** قاعدة بيانات PostgreSQL محلية تعمل على المنفذ `5432` أو حاوية Docker خفيفة مع قاعدة باسم `painvisual_dev`.
- **بيئة الإنتاج (Production):** خدمة مدارة سحابياً (Managed PostgreSQL على Supabase أو Neon أو AWS RDS) مع تفعيل النسخ الاحتياطي اليومي، الاتصال المشفر بـ SSL، وتجميع الاتصالات (Connection Pooling عبر PgBouncer).

### 4.2 خطة الفهارس وتحسين الاستعلامات (Indexing Strategy)
- فهرس فريد على `sessionToken` لضمان سرعة التحقق من هوية المريض بأقل من 5 ملي ثانية.
- فهرس فريد على كود العيادة `clinicCode` (مثل `PV-4981`) لتسريع وصول الطبيب الفوري للتقرير في غرفة الفحص.
- فهرس على حقل وقت الانتهاء `expiresAt` لتسريع مهام الحذف التلقائي الدورية دون استهلاك موارد المعالج.

---

## 5. مخزن الملفات والصوت المشفر (Encrypted Object Storage & Audio Vault)

لحماية الملاحظات الصوتية للمرضى (التي لا تتجاوز 45 ثانية طبقاً لدفتر الشروط):
1. **التشفير في وضع التخزين (Server-Side Encryption):** يتم تشفير جميع التسجيلات الصوتية فور وصولها بمفاتيح تشفير AES-256 (SSE-S3).
2. **عزل الوصول المباشر (Private Buckets):** لا يُسمح بأي وصول عام لحاوية الملفات (No Public Read Access).
3. **روابط الوصول المؤقتة (Presigned URLs):** عندما يطلب الطبيب الاستماع للملاحظة الصوتية، يولد الخادم رابطاً مؤقتاً ومشفراً ينتهي بعد **15 دقيقة** فقط.

---

## 6. مهام الحذف التلقائي والخصوصية الصحية (Health Privacy & Ephemeral Data Lifecycle)

تطبيقاً للالتزام الصارم بالمتطلبات غير الوظيفية في [cahier_charge.md](file:///c:/Users/MO/Desktop/ai-drive/cahier_charge.md#L72) لحماية خصوصية بيانات المريض:

```mermaid
flowchart TD
    Start["إنشاء الجلسة"] --> Active["جلسة نشطة (حتى 6 ساعات)"]
    Active -->|أكمل المريض التقرير| Shared["تقرير مشارك (صالح لـ 48 ساعة)"]
    Active -->|لم يكتمل الوصف خلال 6 ساعات| Job1["مهمة تنظيف الجلسات المهجورة"]
    Shared -->|مرور 48 ساعة على المشاركة| Job2["مهمة إتلاف التقارير المنتهية"]
    Job1 --> Shred["الحذف النهائي من DB والمخزن"]
    Job2 --> Shred
```

### المهام المجدولة النشطة (Automated Cron Jobs):
1. **تنظيف الجلسات غير المكتملة (`abandonedSessions.job.ts`):** تعمل على رأس كل ساعة، وتبحث عن الجلسات التي تجاوزت 6 ساعات دون توليد تقرير، وتقوم بمسحها تماماً.
2. **شطب التقارير المنتهية (`expiredReports.job.ts`):** تعمل يومياً في تمام الساعة 02:00 صباحاً بتوقيت غرينتش، وتقوم بحذف التقارير الصادرة بعد انقضاء 48 ساعة، ومسح الملفات الصوتية المرتبطة بها نهائياً.

---

## 7. البيئات التشغيلية ومتغيرات البيئة (Environments & Configuration Matrix)

| اسم المتغير (Variable Name) | الوصف | القيمة في بيئة التطوير (Local) | القيمة في بيئة الإنتاج (Production) |
|---|---|---|---|
| `NODE_ENV` | وضع بيئة التشغيل | `development` | `production` |
| `PORT` | منفذ خدمة الواجهة الخلفية | `5000` | `5000` (أو محدد من السحابة) |
| `DATABASE_URL` | رابط الاتصال بقاعدة البيانات | `postgresql://user:pass@localhost:5432/painvisual` | رابط مشفر من مزود السحابة المدار |
| `STORAGE_BUCKET` | اسم حاوية تخزين الصوت والـ PDF | `painvisual-dev-vault` | `painvisual-prod-vault` |
| `STORAGE_ENDPOINT` | خادم التخزين السحابي | `http://localhost:9000` | `https://s3.eu-west-1.amazonaws.com` |
| `STORAGE_ACCESS_KEY` | مفتاح الوصول السحابي | محلي مشفر | سر مدار سحابياً (Secret Vault) |
| `SESSION_SECRET` | مفتاح تجزئة وتوقيع رموز الجلسة | `dev_insecure_secret_key_123` | مفتاح عشوائي 64 بايت فائق الأمان |
| `CORS_ORIGIN` | النطاقات المصرح لها بالاتصال | `http://localhost:5173` | `https://painvisual.org` |

---

## 8. استراتيجية النشر السحابي (Cloud Deployment Strategy)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION CLOUD ARCHITECTURE                   │
│                                                                        │
│   [ المستخدمون: المرضى والأطباء ]                                      │
│                 │                                                      │
│                 ▼ HTTPS / TLS 1.3                                      │
│   [ Cloudflare Edge Network ]                                          │
│        ├── DNS + DDoS Mitigation + SSL Offloading                      │
│        ├── Static Frontend PWA Hosting (Vercel / Cloudflare Pages)     │
│        └── Reverse Proxy / API Routing (/v1/*)                         │
│                 │                                                      │
│                 ▼ Secure Private Transit                               │
│   [ Backend Managed Container: Render / Railway / Fly.io ]             │
│        ├── Express Node.js Engine (Dockerized)                         │
│        ├── PDF Generation Engine (Puppeteer Headless)                  │
│        └── Ephemeral Cleanup Cron Runner                               │
│                 │                                                      │
│        ┌────────┴───────────────────────────┐                          │
│        ▼                                    ▼                          │
│   [ Managed PostgreSQL ]          [ Encrypted Object Storage ]         │
│   (Neon / Supabase / AWS RDS)      (Cloudflare R2 / AWS S3 Vault)      │
└────────────────────────────────────────────────────────────────────────┘
```

### 8.1 نشر الواجهة الأمامية (Frontend Deployment)
- البناء التلقائي لنسخة الإنتاج الثابتة: `npm run build` لتوليد مجلد `dist/`.
- النشر عبر منصات التوزيع الطرفي (Edge CDN) مثل **Vercel** أو **Cloudflare Pages**.
- تفعيل تخزين الكاش للأصول الثابتة (SVG, Icons, JS, CSS) لمدة عام كامل مع التحديث التلقائي بالـ Hash.

### 8.2 نشر الواجهة الخلفية (Backend Container Deployment)
- بناء حاوية Docker خفيفة متعددة المراحل (Multi-stage Dockerfile) مستندة إلى `node:20-alpine`:
```dockerfile
# Multi-stage Dockerfile for PainVisual Backend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

---

## 9. الشبكات، النطاقات، والأمان السحابي (Networking, Domains & Edge Security)

- **النطاقات الرسمية المعتمدة:**
  - واجهة المريض والطبيب: `https://painvisual.org`
  - واجهة الـ API الخلفية: `https://api.painvisual.org/v1`
- **شهادات الأمان (SSL/TLS):** شهادات TLS 1.3 مجانية ومدارة تلقائياً عبر Let's Encrypt / Cloudflare.
- **تحديد معدل الطلبات (Rate Limiting):**
  - مسار فحص أكواد العيادة للأطباء `POST /v1/doctor/access`: بحد أقصى 5 محاولات لكل دقيقة لكل عنوان IP لمنع التخمين.
  - مسارات تحديث أبعاد الألم: بحد أقصى 120 طلباً لكل دقيقة لكل جلسة مريض.
- **سياسة الترويسات الأمنية (Helmet Headers):**
  - تفعيل `Content-Security-Policy (CSP)`.
  - تفعيل `X-Content-Type-Options: nosniff`.
  - تفعيل `Strict-Transport-Security (HSTS)`.

---

## 10. المراقبة، السجلات، وتتبع الأداء (Observability, Logging & Health Checks)

1. **فحص الجاهزية الحيوي (Health Probes):**
   - نقطة الاتصال `GET /v1/health` تفحص جاهزية الخادم، واتصال قاعدة البيانات، وتوفر مساحة التخزين السحابي كل 30 ثانية.
2. **سجلات النظام الخالية من الهويات الصحية (Zero-Identity Logs):**
   - تسجيل عمليات الخادم بصيغة JSON مهيكلة (Winston أو Pino).
   - حظر تسجيل أي إحداثيات طبية حساسة، أو أصوات، أو محتويات الاستشارات في ملفات السجلات لحماية سرية المريض.
3. **تنبيهات انقطاع الخدمة (Alerting):**
   - ربط تنبيهات فورية (عبر Webhook أو البريد) في حال تجاوز معدل الأخطاء (5xx Errors) نسبة 1% خلال 5 دقائق.

---

## 11. النسخ الاحتياطي والتعافي من الكوارث (Backups & Disaster Recovery)

- **النسخ الاحتياطي لقاعدة البيانات:**
  - نسخ احتياطي يومي آلي مشفر يُحفظ لمدة 7 أيام متتالية.
  - إجراء استعادة تجريبية دورية كل شهر للتأكد من سلامة الملفات الاحتياطية.
- **مؤشرات التعافي المعتمدة (SLA Target):**
  - **الحد الأقصى لفقدان البيانات (RPO):** لا يتجاوز 6 ساعات (تقتصر على الجلسات الجارية فقط).
  - **الحد الأقصى لزمن استعادة الخدمة (RTO):** لا يتجاوز ساعتين في حال حدوث عطل شامل في المزود السحابي.

---

> **خاتمة:**  
> توفر هذه الخطة بنية تحتية سحابية رصينة، اقتصادية، وقابلة للتوسع الفوري، تضمن تشغيل تطبيق **PainVisual** بسرعة استثنائية وبأعلى معايير حماية البيانات الصحية الشخصية.

# PainVisual — API Contract

## عقد واجهات البرمجة (Frontend ↔ Backend Communication Specification)
### مشروع: تطبيق الاستشارات الطبية — وصف الألم بالنموذج التفاعلي
**الشعار والموقف الإرغونومي:** «الألم يُرى ولا يُوصف بالكلمات»  
**الوثيقة:** عقد الـ API الملزم بين الواجهة والخلفية (Companion document to `architecture.md`)  
**الإصدار:** 1.0 — MVP نوفمبر 2026  
**الحالة:** المرجع الصارم والوحيد لجميع نقاط الاتصال (REST Endpoints)

---

## فهرس المحتويات (Table of Contents)

1. [المواصفات والاتفاقيات العامة (Conventions)](#1-المواصفات-والاتفاقيات-العامة-conventions)
2. [وحدة الجلسات المؤقتة (Sessions — 2 endpoints)](#2-وحدة-الجلسات-المؤقتة-sessions--2-endpoints)
3. [وحدة تسجيل أبعاد الألم (Pain Records & Telemetry — 7 endpoints)](#3-وحدة-تسجيل-أبعاد-الألم-pain-records--telemetry--7-endpoints)
4. [وحدة الملاحظة الصوتية (Audio Memo — 2 endpoints)](#4-وحدة-الملاحظة-الصوتية-audio-memo--2-endpoints)
5. [وحدة التعديل الفوري الرجعي (In-Place Mutation F8 — 1 endpoint)](#5-وحدة-التعديل-الفوري-الرجعي-in-place-mutation-f8--1-endpoint)
6. [وحدة التقرير البصري ومشاركته (Reports & Sharing F7 — 4 endpoints)](#6-وحدة-التقرير-البصري-ومشاركته-reports--sharing-f7--4-endpoints)
7. [بوابة قراءة الطبيب السريرية (Doctor Access Portal — 2 endpoints)](#7-بوابة-قراءة-الطبيب-السريرية-doctor-access-portal--2-endpoints)
8. [نقاط الاتصال الإرشادية والتشغيلية (System & Config — 2 endpoints)](#8-نقاط-الاتصال-الإرشادية-والتشغيلية-system--config--2-endpoints)
9. [الملحق أ: نماذج نقل البيانات المشتركة (Appendix A — Shared DTOs)](#9-الملحق-أ-نماذج-نقل-البيانات-المشتركة-appendix-a--shared-dtos)
10. [الملحق ب: قاموس رموز الأخطاء (Appendix B — Error Codes Dictionary)](#10-الملحق-ب-قاموس-رموز-الأخطاء-appendix-b--error-codes-dictionary)

**إجمالي نقاط الاتصال: 20 نقطة اتصال REST عالية الكفاءة.**

---

## 1. المواصفات والاتفاقيات العامة (Conventions)

### 1.1 عناوين الخدمة والإصدار (Base URL & Versioning)

```
Production : https://api.painvisual.org/v1
Staging    : https://api.staging.painvisual.org/v1
Local Dev  : http://localhost:5000/v1
```

جميع المسارات تبدأ ببادئة الإصدار `/v1`.

### 1.2 المصادقة وإدارة الجلسات (Authentication & Ephemeral Sessions)

تطبيقاً للمبدأ الإرغونومي الصارم في [cahier_charge.md](file:///c:/Users/MO/Desktop/ai-drive/cahier_charge.md)؛ لا يُطلب من المريض تسجيل حساب مسبق (اسم مستخدم، بريد، كلمة مرور) لتجنب أي حاجز معرفي أو زمني أثناء حالة الألم.

1. **رمز جلسة المريض (Patient Session Token):**
   - عند بدء الجلسة (`POST /v1/sessions`)، يُولد الخادم رمزاً مؤقتاً مشفراً بصيغة Bearer Token.
   - يتم تمرير الرمز في ترويسة الطلب لجميع عمليات التعديل:
     ```http
     Authorization: Bearer <sessionToken>
     ```
   - صلاحية رمز الجلسة: **6 ساعات** للجلسات غير المكتملة، و **48 ساعة** للجلسات الصادرة كتقرير.

2. **رمز استشارة الطبيب (Doctor Consultation Access):**
   - يدخل الطبيب عبر رمز عيادي قصير مكون من 6 خانات (مثل `PV-4981`) أو عبر مسح رمز الاستجابة السريعة (QR Code).
   - يتم تبادل الرمز برمز وصول مقيد للقراءة فقط (Read-Only Token) يمرر كترويسة `X-Doctor-Token: <docToken>`.

### 1.3 الغلاف القياسي للاستجابة (Standard Response Envelope)

تعتمد جميع الاستجابات بنية موحدة وثابتة:

**في حالة النجاح (Success):**
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": null
}
```

**في حالة الخطأ (Failure):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "الوصف الواضح للخطأ",
    "fields": {
      "intensity": "يجب أن تكون شدة الألم بين 1 و 10"
    }
  },
  "meta": null
}
```

### 1.4 رموز الحالة لبروتوكول HTTP (HTTP Status Codes)

| الرمز | الحالة | الاستخدام في النظام |
|---|---|---|
| **200 OK** | نجاح القراءة أو التعديل | استرجاع البيانات، أو التحديث الجزئي الناجح. |
| **201 Created** | نجاح الإنشاء | إنشاء جلسة، حفظ موضع جديد، أو توليد تقرير. |
| **204 No Content** | نجاح الحذف بدون محتوى | حذف موضع ألم، أو إلغاء تسجيل صوتي. |
| **400 Bad Request** | خطأ في بنية المدخلات | فشل التحقق في Zod Schema أو بيانات الإحداثيات المشوهة. |
| **401 Unauthorized** | غياب أو انتهاء الرمز | رمز الجلسة مفقود، منتهي الصلاحية، أو مشوه. |
| **403 Forbidden** | محاولة وصول محظورة | محاولة تعديل تقرير بعد إغلاقه ومشاركته مع الطبيب. |
| **404 Not Found** | المورد غير موجود | جلسة مفقودة، موضع ألم غير مسجل، أو كود استشارة منتهٍ. |
| **413 Payload Too Large** | حجم الملف مفرط | تسجيل صوتي يتجاوز 10 ميغابايت أو أطول من 45 ثانية. |
| **422 Unprocessable Entity** | خطأ دلالي سريري | محاولة سحب انتشار دون تحديد موضع انطلاق صالح. |
| **500 Internal Error** | خطأ خادم غير معالج | تعطل في قاعدة البيانات أو محرك تصدير ملفات PDF. |

### 1.5 أنواع الحقول والترميز (Field Types & Serialization)

- `UUID`: سلسلة معرف فريد معيارية بصيغة RFC 4122 v4 (مثل `"c4a8996b-7341-4c12-8e6d-5b74100c5bc8"`).
- `ISODate`: طابع زمني بتوقيت غرينتش بصيغة ISO 8601 UTC (مثل `"2026-11-22T02:40:00.000Z"`).
- `Coordinate`: نسبة مئوية عشرية عائمة من `0.00` إلى `100.00` لضمان التوافق المطلق مع جميع شاشات الهواتف واللوحيات.
- `IntensityLevel`: عدد صحيح من `1` (ألم خفيف جداً) إلى `10` (ألم أقصى لا يطاق).
- `ColorHex`: رمز لوني ست عشري ثلاثي البايت (مثل `"#E63946"`).

---

## 2. وحدة الجلسات المؤقتة (Sessions — 2 endpoints)

### 2.1 إنشاء جلسة استشارية جديدة (Start Pain Session)

```http
POST /v1/sessions
```
- **المصادقة:** عامة (Public — لا تتطلب أي تسجيل دخول).
- **الهدف الإرغونومي:** تفعيل زر «بدء الوصف» في الشاشة 1 (Screen 1) وبدء دورة القياس.

**جسم الطلب (Request Body):**
```json
{
  "language": "ar",
  "clientMetadata": {
    "deviceType": "mobile",
    "touchPoints": 5,
    "screenWidth": 390,
    "screenHeight": 844
  }
}
```

**استجابة النجاح (201 Created):**
```json
{
  "success": true,
  "data": {
    "sessionId": "a90b4d91-5820-4e58-8687-3932822c9a10",
    "sessionToken": "pv_sess_9f8a32b14e910283c749102938475610",
    "expiresAt": "2026-11-22T08:40:00.000Z",
    "currentStep": "SCREEN_2_LOCATION",
    "painRecordId": "b11c5e92-6931-5f69-9798-4043933d0b21"
  },
  "error": null,
  "meta": null
}
```

---

### 2.2 استرجاع حالة الجلسة الحالية (Get Current Session Status)

```http
GET /v1/sessions/:id
```
- **المصادقة:** `Bearer <sessionToken>`
- **الوصف:** استعادة حالة المريض عند إعادة فتح المتصفح أو انقطاع الاتصال المؤقت في العيادة.

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "a90b4d91-5820-4e58-8687-3932822c9a10",
    "status": "in_progress",
    "currentStep": "SCREEN_4_INTENSITY",
    "painRecordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "isCompleted": false,
    "expiresAt": "2026-11-22T08:40:00.000Z"
  },
  "error": null,
  "meta": null
}
```

---

## 3. وحدة تسجيل أبعاد الألم (Pain Records & Telemetry — 7 endpoints)

### 3.1 استرجاع سجل الألم الشامل (Get Full Pain Record)

```http
GET /v1/pain-records/:id
```
- **المصادقة:** `Bearer <sessionToken>`
- **الوصف:** استرجاع خريطة الألم بكافة أبعادها الستة لعرضها في شاشات التفاعل أو في شاشة التقرير الموحد.

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "sessionId": "a90b4d91-5820-4e58-8687-3932822c9a10",
    "locations": [
      {
        "locationId": "loc_lower_back_01",
        "bodyPart": "lower_back",
        "bodyView": "back",
        "coordinates": { "x": 50.2, "y": 62.4, "radius": 8.5 },
        "intensity": {
          "level": 8,
          "colorHex": "#990000",
          "gradientSpread": 12.0
        },
        "radiation": {
          "hasRadiation": true,
          "endCoordinates": { "x": 62.5, "y": 85.0 },
          "pathVector": "M 50.2 62.4 Q 55.0 73.0 62.5 85.0",
          "directionDescription": "radiating_down_right_leg"
        },
        "sensations": [
          { "type": "burning", "iconId": "flame_01", "placedAt": { "x": 50.2, "y": 62.4 } },
          { "type": "electric_shock", "iconId": "bolt_01", "placedAt": { "x": 58.0, "y": 76.0 } }
        ]
      }
    ],
    "timing": {
      "onsetHours": [6, 7, 8],
      "frequency": "morning_peak",
      "isConstant": false,
      "timelineMarkers": [
        { "hour": 7, "label": "morning_stiffness" }
      ]
    },
    "movements": [
      { "movementId": "bending", "affectedLocationId": "loc_lower_back_01", "severity": "severe" },
      { "movementId": "prolonged_sitting", "affectedLocationId": "loc_lower_back_01", "severity": "moderate" }
    ],
    "hasAudioMemo": false,
    "updatedAt": "2026-11-22T02:45:00.000Z"
  },
  "error": null,
  "meta": null
}
```

---

### 3.2 تحديد وتعديل مكان الألم — الشاشة 2 (F1: Location & View)

```http
PUT /v1/pain-records/:id/location
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F1** (لمس موضع الألم، التبديل بين العرض الأمامي والخلفي، دعم تعدد المواضع).

**جسم الطلب (Request Body):**
```json
{
  "locations": [
    {
      "locationId": "loc_neck_01",
      "bodyPart": "neck",
      "bodyView": "back",
      "coordinates": {
        "x": 49.8,
        "y": 22.3,
        "radius": 5.0
      }
    },
    {
      "locationId": "loc_lower_back_02",
      "bodyPart": "lower_back",
      "bodyView": "back",
      "coordinates": {
        "x": 50.5,
        "y": 60.1,
        "radius": 7.5
      }
    }
  ]
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "activeLocationsCount": 2,
    "nextSuggestedStep": "SCREEN_3_RADIATION"
  },
  "error": null,
  "meta": null
}
```

---

### 3.3 تحديد اتجاه ومسار الانتشار — الشاشة 3 (F2: Radiation Path)

```http
PUT /v1/pain-records/:id/radiation
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F2** (سحب الإصبع من بؤرة البداية إلى نهاية الانتشار ورسم مسار متدرج).

**جسم الطلب (Request Body):**
```json
{
  "radiations": [
    {
      "locationId": "loc_lower_back_02",
      "hasRadiation": true,
      "endCoordinates": {
        "x": 65.0,
        "y": 88.0
      },
      "pathVector": "M 50.5 60.1 Q 57.0 74.0 65.0 88.0",
      "direction": "downward_right_sciatica"
    }
  ]
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "updatedRadiations": 1,
    "nextSuggestedStep": "SCREEN_4_INTENSITY"
  },
  "error": null,
  "meta": null
}
```

---

### 3.4 تحديد شدة الألم والتلوين اللوني — الشاشة 4 (F3: Intensity & Coloring)

```http
PUT /v1/pain-records/:id/intensity
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F3** (تلوين الموضع؛ لون فاتح يعني ألم بسيط، داكن يعني ألم شديد، مع دعم التدرج الداخلي).

**جسم الطلب (Request Body):**
```json
{
  "intensities": [
    {
      "locationId": "loc_lower_back_02",
      "level": 9,
      "colorHex": "#7A0000",
      "gradientSpread": 15.0,
      "isSharpCenter": true
    },
    {
      "locationId": "loc_neck_01",
      "level": 4,
      "colorHex": "#FFAA00",
      "gradientSpread": 6.0,
      "isSharpCenter": false
    }
  ]
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "colorMapApplied": true,
    "nextSuggestedStep": "SCREEN_5_NATURE"
  },
  "error": null,
  "meta": null
}
```

---

### 3.5 اختيار طبيعة الألم وإسقاط الرموز — الشاشة 5 (F4: Pain Nature)

```http
PUT /v1/pain-records/:id/nature
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F4** (استخدام رموز بديهية كالوخز والحرقان وسحبها وإفلاتها على المواضع المناسبة).

**جسم الطلب (Request Body):**
```json
{
  "sensations": [
    {
      "locationId": "loc_lower_back_02",
      "type": "burning",
      "iconId": "sensation_flame_v1",
      "placedCoordinates": { "x": 51.0, "y": 61.0 }
    },
    {
      "locationId": "loc_lower_back_02",
      "type": "throbbing",
      "iconId": "sensation_pulse_v1",
      "placedCoordinates": { "x": 53.0, "y": 64.0 }
    },
    {
      "locationId": "loc_neck_01",
      "type": "heavy_ache",
      "iconId": "sensation_heavy_v1",
      "placedCoordinates": { "x": 49.8, "y": 22.3 }
    }
  ]
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "attachedSensationsCount": 3,
    "nextSuggestedStep": "SCREEN_6_TIME_MOVEMENT"
  },
  "error": null,
  "meta": null
}
```

---

### 3.6 تحديد توقيت الظهور على الخط الزمني — الشاشة 6 (F5: Timing & 24h Timeline)

```http
PUT /v1/pain-records/:id/timing
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F5** (خط زمني لليوم 24 ساعة، سحب علامة لتحديد وقت البدء وأوقات التكرار).

**جسم الطلب (Request Body):**
```json
{
  "timing": {
    "onsetHours": [6, 7, 8, 19, 20],
    "isConstant": false,
    "frequency": "episodic",
    "timelineMarkers": [
      {
        "hour": 7,
        "markerType": "onset",
        "notes": "morning_waking_pain"
      },
      {
        "hour": 20,
        "markerType": "peak",
        "notes": "after_work_sitting"
      }
    ]
  }
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "timelineConfigured": true
  },
  "error": null,
  "meta": null
}
```

---

### 3.7 تحديد الحركات والوضعيات الصعبة — الشاشة 6 (F6: Provocative Movements)

```http
PUT /v1/pain-records/:id/movements
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F6** (اختيار أيقونات الوضعيات كالانحناء ورفع الذراع والمشي وربطها بالموضع المتأثر).

**جسم الطلب (Request Body):**
```json
{
  "movements": [
    {
      "movementId": "bending",
      "affectedLocationId": "loc_lower_back_02",
      "severityRating": "severe"
    },
    {
      "movementId": "walking",
      "affectedLocationId": "loc_lower_back_02",
      "severityRating": "moderate"
    },
    {
      "movementId": "raising_arm",
      "affectedLocationId": "loc_neck_01",
      "severityRating": "mild"
    }
  ]
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "movementsMapped": 3,
    "readyForReport": true,
    "nextSuggestedStep": "SCREEN_7_REPORT"
  },
  "error": null,
  "meta": null
}
```

---

## 4. وحدة الملاحظة الصوتية (Audio Memo — 2 endpoints)

تطبيقاً للتنازل الإرغونومي الصريح في [cahier_charge.md](file:///c:/Users/MO/Desktop/ai-drive/cahier_charge.md#L103) (التخلي عن الحقول النصية لصالح التفاعل البصري مع توفير ملاحظة صوتية اختيارية):

### 4.1 رفع ملاحظة صوتية موجزة (Upload Voice Memo)

```http
POST /v1/pain-records/:id/audio
Content-Type: multipart/form-data
```
- **المصادقة:** `Bearer <sessionToken>`
- **القيود:** الحد الأقصى للمدة: **45 ثانية** | الحد الأقصى للحجم: **10 ميغابايت** | الصيغ المعتمدة: `audio/webm`, `audio/ogg`, `audio/mp4`.

**حقول الطلب (Form-Data Fields):**
- `audioFile`: ملف التسجيل الصوتي الثنائي.
- `durationSeconds`: عدد الثواني الفعلي (عدد صحيح $\le 45$).

**استجابة النجاح (201 Created):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "hasAudio": true,
    "durationSeconds": 32,
    "audioVaultId": "aud_vault_772199b01",
    "message": "تم حفظ الملاحظة الصوتية بنجاح"
  },
  "error": null,
  "meta": null
}
```

---

### 4.2 حذف الملاحظة الصوتية أو إعادة التسجيل (Delete Voice Memo)

```http
DELETE /v1/pain-records/:id/audio
```
- **المصادقة:** `Bearer <sessionToken>`
- **الوصف:** مسح الملف الصوتي المخزن فورياً من الخادم ومخزن الملفات المشفر.

**استجابة النجاح (204 No Content):**
- لا يوجد محتوى في جسم الاستجابة.

---

## 5. وحدة التعديل الفوري الرجعي (In-Place Mutation F8 — 1 endpoint)

### 5.1 تعديل بعد محدد للألم بلمسة واحدة من التقرير (One-Touch Dimension Edit)

```http
PATCH /v1/pain-records/:id/dimension
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F8** (إتاحة الرجوع إلى أي مرحلة وتعديل المدخلات بلمسة واحدة دون مسح بقية الأبعاد).

**جسم الطلب (Request Body):**
```json
{
  "targetDimension": "intensity",
  "payload": {
    "locationId": "loc_lower_back_02",
    "level": 6,
    "colorHex": "#D94E34",
    "gradientSpread": 10.0
  }
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "modifiedDimension": "intensity",
    "reportSyncStatus": "synced",
    "updatedAt": "2026-11-22T02:50:00.000Z"
  },
  "error": null,
  "meta": null
}
```

---

## 6. وحدة التقرير البصري ومشاركته (Reports & Sharing F7 — 4 endpoints)

### 6.1 توليد التقرير البصري المنظم — الشاشة 7 (F7: Generate Visual Report)

```http
POST /v1/reports/:recordId/generate
```
- **المصادقة:** `Bearer <sessionToken>`
- **الهدف الوظيفي:** تطبيق **F7** (تجميع جميع المدخلات في تقرير منظم قابل للمراجعة والتعديل والحفظ).

**جسم الطلب (Request Body):**
```json
{
  "includeAudio": true,
  "clientRenderedSnapshot": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0..."
}
```

**استجابة النجاح (201 Created):**
```json
{
  "success": true,
  "data": {
    "reportId": "rep_901c22aa-3810-4819-bf91-729103847291",
    "recordId": "b11c5e92-6931-5f69-9798-4043933d0b21",
    "clinicCode": "PV-4981",
    "summary": {
      "primaryPainZone": "lower_back",
      "maxIntensityLevel": 9,
      "radiationPresent": true,
      "dominantSensations": ["burning", "throbbing"],
      "peakHour": 7,
      "severelyRestrictedMovements": ["bending"]
    },
    "visualSnapshotUrl": "/v1/reports/rep_901c22aa-3810-4819-bf91-729103847291/snapshot",
    "pdfDownloadUrl": "/v1/reports/rep_901c22aa-3810-4819-bf91-729103847291/pdf",
    "expiresAt": "2026-11-24T02:50:00.000Z"
  },
  "error": null,
  "meta": null
}
```

---

### 6.2 استرجاع بيانات التقرير للعرض في الواجهة (Get Report Details)

```http
GET /v1/reports/:id
```
- **المصادقة:** `Bearer <sessionToken>`

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "reportId": "rep_901c22aa-3810-4819-bf91-729103847291",
    "clinicCode": "PV-4981",
    "fullRecord": { ... },
    "createdAt": "2026-11-22T02:50:00.000Z",
    "expiresAt": "2026-11-24T02:50:00.000Z",
    "isLocked": false
  },
  "error": null,
  "meta": null
}
```

---

### 6.3 إنشاء رابط ورمز مشاركة التقرير مع الطبيب (Share Report with Doctor)

```http
POST /v1/reports/:id/share
```
- **المصادقة:** `Bearer <sessionToken>`
- **الوصف:** توليد رمز الاستجابة السريعة (QR Code) وكود العيادة المباشر الذي يمكن للمريض إبرازه للطبيب فوراً في غرفة الاستشارة.

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "reportId": "rep_901c22aa-3810-4819-bf91-729103847291",
    "clinicCode": "PV-4981",
    "qrCodeDataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "doctorAccessUrl": "https://painvisual.org/doc/consultation/PV-4981",
    "shareToken": "doc_token_882910a9c8b74619",
    "expiresAt": "2026-11-24T02:50:00.000Z",
    "remainingHours": 48
  },
  "error": null,
  "meta": null
}
```

---

### 6.4 تنزيل التقرير بصيغة PDF سريرية (Download Clinical PDF)

```http
GET /v1/reports/:id/pdf
```
- **المصادقة:** `Bearer <sessionToken>` أو مصادقة الطبيب.
- **الترويسات (Response Headers):**
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="PainVisual-Report-PV-4981.pdf"`
- **المحتوى:** وثيقة PDF سريرية عالية الدقة تضم رسم الجسم والمخطط الزمني ومصفوفة الأبعاد.

---

## 7. بوابة قراءة الطبيب السريرية (Doctor Access Portal — 2 endpoints)

### 7.1 التحقق من رمز العيادة ودخول الطبيب (Doctor PIN / QR Access)

```http
POST /v1/doctor/access
```
- **المصادقة:** عامة (Public — محمية بـ Rate Limiter لمنع التخمين).
- **الوصف:** استبدال كود الاستشارة المكون من 6 خانات برمز قراءة سريري محدد.

**جسم الطلب (Request Body):**
```json
{
  "clinicCode": "PV-4981"
}
```

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "doctorToken": "doc_read_9981273910abec77281",
    "reportId": "rep_901c22aa-3810-4819-bf91-729103847291",
    "expiresInMinutes": 60
  },
  "error": null,
  "meta": null
}
```

---

### 7.2 استعراض التقرير التفاعلي للطبيب للقراءة فقط (Doctor Read-Only Consultation View)

```http
GET /v1/doctor/consultation/:token
```
- **المصادقة:** ترويسة `X-Doctor-Token: <doctorToken>`
- **الوصف:** تقديم واجهة الطبيب السريرية النظيفة (خالية من أدوات الرسم والتعديل)، مخصصة للاستيعاب السريع خلال ثوانٍ.

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "reportId": "rep_901c22aa-3810-4819-bf91-729103847291",
    "clinicCode": "PV-4981",
    "consultationDate": "2026-11-22T02:50:00.000Z",
    "visualMap": {
      "frontViewLocations": [],
      "backViewLocations": [
        {
          "bodyPart": "lower_back",
          "coordinates": { "x": 50.5, "y": 60.1 },
          "intensityLevel": 9,
          "intensityColor": "#7A0000",
          "radiationPath": "M 50.5 60.1 Q 57.0 74.0 65.0 88.0",
          "sensations": ["burning", "throbbing"]
        }
      ]
    },
    "timeline": {
      "peakHours": [7, 20],
      "pattern": "morning_and_evening_peak"
    },
    "aggravatingMovements": [
      { "movement": "bending", "severity": "severe" },
      { "movement": "walking", "severity": "moderate" }
    ],
    "voiceMemo": {
      "available": true,
      "durationSeconds": 32,
      "streamUrl": "/v1/doctor/consultation/audio-stream/aud_vault_772199b01"
    }
  },
  "error": null,
  "meta": null
}
```

---

## 8. نقاط الاتصال الإرشادية والتشغيلية (System & Config — 2 endpoints)

### 8.1 التحقق من جاهزية النظام والخدمة (System Health Check)

```http
GET /v1/health
```
- **المصادقة:** عامة (Public)

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-11-22T02:55:00.000Z",
    "services": {
      "database": "connected",
      "audioStorage": "available",
      "pdfRenderer": "ready"
    }
  },
  "error": null,
  "meta": null
}
```

---

### 8.2 استرجاع إعدادات الأصول والرموز الحسية (Get App Configuration)

```http
GET /v1/system/config
```
- **المصادقة:** عامة (Public — مخزنة كاش لمدة 24 ساعة).
- **الوصف:** تزويد واجهة المريض بقائمة الرموز الحسية (وخز، حرقان، نبض، طعن، ثقل) وأيقونات الحركات (انحناء، رفع ذراع، مشي، جلوس، التواء) ومسارات رسومات الجسم.

**استجابة النجاح (200 OK):**
```json
{
  "success": true,
  "data": {
    "sensations": [
      { "id": "burning", "labelAr": "حرقان", "icon": "flame", "color": "#FF4500" },
      { "id": "pricking", "labelAr": "وخز / تنميل", "icon": "pin", "color": "#FFD700" },
      { "id": "throbbing", "labelAr": "نبض / خفقان", "icon": "pulse", "color": "#9400D3" },
      { "id": "stabbing", "labelAr": "طعن حاد", "icon": "knife", "color": "#DC143C" },
      { "id": "heavy_ache", "labelAr": "ثقل / ضغط", "icon": "weight", "color": "#4682B4" }
    ],
    "movements": [
      { "id": "bending", "labelAr": "الانحناء للأمام", "icon": "posture_bend" },
      { "id": "raising_arm", "labelAr": "رفع الذراع للأعلى", "icon": "posture_arm" },
      { "id": "walking", "labelAr": "المشي", "icon": "posture_walk" },
      { "id": "sitting", "labelAr": "الجلوس لفترة طويلة", "icon": "posture_sit" },
      { "id": "twisting", "labelAr": "التفاف الجذع", "icon": "posture_twist" }
    ],
    "maxAudioDurationSeconds": 45,
    "sessionDurationHours": 6,
    "reportDurationHours": 48
  },
  "error": null,
  "meta": null
}
```

---

## 9. الملحق أ: نماذج نقل البيانات المشتركة (Appendix A — Shared DTOs)

### 9.1 مخطط التحقق لموضع الألم (Zod Schema for Pain Location)
```typescript
import { z } from 'zod';

export const CoordinatesSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  radius: z.number().min(1).max(30).default(5)
});

export const PainLocationDTOSchema = z.object({
  locationId: z.string().min(3),
  bodyPart: z.string().min(2),
  bodyView: z.enum(['front', 'back']),
  coordinates: CoordinatesSchema
});

export const IntensityDTOSchema = z.object({
  locationId: z.string().min(3),
  level: z.number().int().min(1).max(10),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  gradientSpread: z.number().min(1).max(50).default(10),
  isSharpCenter: z.boolean().default(false)
});

export const RadiationDTOSchema = z.object({
  locationId: z.string().min(3),
  hasRadiation: z.boolean(),
  endCoordinates: CoordinatesSchema.optional(),
  pathVector: z.string().optional(),
  direction: z.string().optional()
});

export const SensationDTOSchema = z.object({
  locationId: z.string().min(3),
  type: z.enum(['burning', 'pricking', 'throbbing', 'stabbing', 'heavy_ache']),
  iconId: z.string(),
  placedCoordinates: CoordinatesSchema
});
```

---

## 10. الملحق ب: قاموس رموز الأخطاء (Appendix B — Error Codes Dictionary)

| رمز الخطأ البرمجي | حالة HTTP | التفسير السريري والتقني |
|---|:---:|---|
| `SESSION_EXPIRED` | 401 | انتهت فترة الجلسة المؤقتة (تجاوزت 6 ساعات) ويجب بدء وصف جديد. |
| `SESSION_NOT_FOUND` | 404 | معرف الجلسة غير مسجل في قاعدة البيانات. |
| `LOCATION_NOT_FOUND` | 404 | موضع الألم المشار إليه غير موجود في هذا السجل لتطبيق التلوين أو الانتشار عليه. |
| `INVALID_COORDINATES` | 400 | إحداثيات اللمس خارج أبعاد مسطح الجسم التشريحي ($x, y \notin [0, 100]$). |
| `INVALID_INTENSITY_RANGE` | 400 | قيمة الشدة المدخلة خارج النطاق المقبول (المسموح فقط من 1 إلى 10). |
| `AUDIO_TOO_LONG` | 413 | مدة التسجيل الصوتي تجاوزت الحد الأقصى المسموح به إرغونومياً (45 ثانية). |
| `AUDIO_EMPTY` | 400 | تم إرسال ملف صوتي فارغ أو غير متوافق. |
| `INVALID_CLINIC_CODE` | 404 | كود العيادة غير صحيح أو منتهي الصلاحية (مر عليه أكثر من 48 ساعة). |
| `REPORT_LOCKED` | 403 | التقرير تم توقيعه وإرساله للطبيب ولا يقبل تعديلات إضافية. |
| `RATE_LIMIT_EXCEEDED` | 429 | عدد محاولات إدخال كود الاستشارة تجاوز المعدل المسموح به لحماية الخصوصية. |

---

> **خاتمة:**  
> يمثل هذا الملف العقد البرمجي الكامل والملزم (Source of Truth) بين فريقي الواجهة والخلفية. جميع نماذج البيانات ونقاط الاتصال مطابقة ومكملة بنسبة 100% للتصور المعماري في [architecture.md](file:///c:/Users/MO/Desktop/ai-drive/New%20files/architecture.md) ودستور المشروع في [cahier_charge.md](file:///c:/Users/MO/Desktop/ai-drive/cahier_charge.md).

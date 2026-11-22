# PainVisual — Tasks & Implementation Plan: Phase 4
## خطة مهام المرحلة 4: التقرير البصري والتعديل الفوري والصوت (Report, Mutation & Audio F7–F8)

**المشروع:** تطبيق الاستشارات الطبية — وصف الألم بالنموذج التفاعلي (PainVisual)  
**الموقف الإرغونومي:** «الألم يُرى ولا يُوصف بالكلمات» (Zero-Form Paradigm & Direct Touch)  
**المرجع الأساسي:** [docs/master-plan.md](file:///c:/Users/MO/Desktop/defi_train/docs/master-plan.md#L146-L166) | [docs/api-contract.md](file:///c:/Users/MO/Desktop/defi_train/docs/api-contract.md#L526-L685) | [docs/backend-plan.md](file:///c:/Users/MO/Desktop/defi_train/docs/backend-plan.md) | [docs/frontend-plan.md](file:///c:/Users/MO/Desktop/defi_train/docs/frontend-plan.md)

---

## 1. نظرة عامة ونطاق العمل للمرحلة 4 (Overview & Scope)

تهدف **المرحلة 4** إلى إنجاز الشاشة السابعة (Screen 7) وتجميع أبعاد الألم الستة في بطاقة تقرير بصري موحدة وسريعة الاستيعاب للطبيب (Visual Report F7)، مع تمكين المريض من مراجعة وتعديل أي بعد بلمسة واحدة دون مساس ببقية الأبعاد (In-Place Mutation F8)، وتوفير الملاحظة الصوتية الاختيارية (بحد أقصى 45 ثانية) وفق التنازل الإرغونومي المعتمد في دفتر الشروط:

- **F7:** توليد التقرير البصري المنظم واستخراج كود العيادة المباشر (مثل `PV-4981`) وتلخيص المؤشرات السريرية البارزة.
- **F8:** التعديل الفوري الرجعي بلمسة واحدة لأي بعد عبر المسار `PATCH /v1/pain-records/:id/dimension` مع زر العودة للتقرير المباشر.
- **الملاحظة الصوتية:** وسيط استقبال وتخزين الصوت (`audioFile` $\le 45$s وحجم $\le 10$MB) وحذفه وإعادة تسجيله.

---

## 2. مصفوفة تتبع مهام المرحلة 4 (Traceability Matrix)

| كود المهمة | المسار / المكون | الوصف التقني والإرغونومي | حالة الإنجاز |
|---|---|---|:---:|
| **TASK-4.1** | `backend/src/modules/audio/` | تنفيذ مسار رفع الصوت `POST /v1/pain-records/:id/audio` (حد أقصى 45 ثانية) | [x] |
| **TASK-4.2** | `backend/src/modules/audio/` | تنفيذ مسار حذف الصوت `DELETE /v1/pain-records/:id/audio` (204 No Content) | [x] |
| **TASK-4.3** | `backend/src/modules/painRecord/` | تنفيذ محرك التعديل الفوري الرجعي `PATCH /v1/pain-records/:id/dimension` (F8) | [x] |
| **TASK-4.4** | `backend/src/modules/report/` | تنفيذ مسار توليد التقرير `POST /v1/reports/:recordId/generate` وكود العيادة (F7) | [x] |
| **TASK-4.5** | `backend/src/modules/report/` | تنفيذ مسار استرجاع التقرير `GET /v1/reports/:id` | [x] |
| **TASK-4.6** | `frontend/src/components/report/` | بناء بطاقة الملخص البصري `VisualReportCard.tsx` (F7) | [x] |
| **TASK-4.7** | `frontend/src/components/report/` | بناء أزرار التعديل الفوري الرجعي `QuickEditButtons.tsx` (F8) | [x] |
| **TASK-4.8** | `frontend/src/components/audio/` | بناء مسجل الملاحظة الصوتية اللمسي `AudioRecorderWidget.tsx` (45 ثانية) | [x] |
| **TASK-4.9** | `frontend/src/screens/Screen7` | بناء الشاشة السابعة الكاملة `Screen7_VisualReport.tsx` | [x] |
| **TASK-4.10** | `tests/ & verification` | اختبارات التحقق الآلية للمرحلة 4 ومصافحة Checkpoint 4 (11/11 نجاح) | [x] |

---

## 3. تفصيل المهام التنفيذية للمرحلة 4 (Detailed Tasks Breakdown)

### أ. الواجهة الخلفية (Backend Core)
- [x] **TASK-B4.1:** توسيع قاعدة البيانات لتخزين التقارير السريرية `ClinicalReport` وربطها بسجل الألم `painRecordId` وكود العيادة الفريد `clinicCode` (مثل `PV-4981`).
- [x] **TASK-B4.2:** تنفيذ وحدة الملاحظة الصوتية (`audio.module`):
  - استقبال ورفع الملف الصوتي والتأكد من عدم تجاوز 45 ثانية وحجم 10 ميغابايت.
  - دعم الحذف الفوري وإرجاع 204.
- [x] **TASK-B4.3:** تنفيذ خدمة ومتحكم التعديل الرجعي (`PATCH /v1/pain-records/:id/dimension` - F8):
  - استقبال اسم البعد المستهدف (`intensity`, `location`, `radiation`, `nature`, `timing`, `movements`) وتحديثه حصرياً دون مساس ببقية الأبعاد.
- [x] **TASK-B4.4:** تنفيذ خدمة ومتحكم التقرير (`report.service.ts` - F7):
  - خوارزمية تلخيص المؤشرات السريرية: منطقة الألم الرئيسية، أقصى شدة، وجود انتشار، أوقات الذروة، الحركات المقيدة بشدة.
  - توليد كود عيادي عشوائي فريد مكون من 6 خانات بصيغة `PV-XXXX`.
  - تسجيل مسارات `POST /v1/reports/:recordId/generate` و `GET /v1/reports/:id`.

---

### ب. الواجهة الأمامية (Frontend Components & Screen 7)
- [x] **TASK-F4.1:** تطوير مكون بطاقة التقرير البصري المجمع `VisualReportCard.tsx` (F7):
  - عرض خريطة مصغرة لمواضع الجسم والانتشار والألوان ورموز الطبيعة.
  - إبراز المؤشرات السريرية في بطاقات واضحة وبديهية للأطباء.
- [x] **TASK-F4.2:** تطوير مكون أزرار التعديل الفوري `QuickEditButtons.tsx` (F8):
  - أزرار تعديل لكل بعد (تعديل الشدة، تعديل الموضع، تعديل الرموز، إلخ) تعيد المريض للشاشة المستهدفة مع حفظ حالة التقرير.
- [x] **TASK-F4.3:** تطوير مسجل الصوت اللمسي `AudioRecorderWidget.tsx`:
  - زر تسجيل دائري بارز مع عداد تنازلي دقيق (45 ثانية كحد أقصى).
  - مؤشر تشغيل وتأكيد وإمكانية حذف وإعادة التسجيل.
- [x] **TASK-F4.4:** تطوير الشاشة السابعة الشاملة `Screen7_VisualReport.tsx`:
  - دمج البطاقة البصرية، أزرار التعديل، ومسجل الصوت، وزر تأكيد ومشاركة التقرير.
- [x] **TASK-F4.5:** تحديث مخزن `usePainSessionStore.ts` وعميل الـ API لدعم التعديل الفوري ورفع الصوت وحفظ التقرير.

---

## 4. نقطة فحص المصافحة للمرحلة 4 (Handshake Checkpoint 4 Criteria)

- [x] **C4.1:** استدعاء `POST /v1/reports/:recordId/generate` يولد تقريراً سريرياً بـ `clinicCode` مميز ومؤشرات دقيقة.
- [x] **C4.2:** استدعاء `GET /v1/reports/:id` يسترجع التقرير الكامل مع كافة الأبعاد والمؤشرات.
- [x] **C4.3:** استدعاء `PATCH /v1/pain-records/:id/dimension` يحدث بعداً محدداً دون تغيير بقية الأبعاد (F8).
- [x] **C4.4:** رفع ملاحظة صوتية عبر `POST /v1/pain-records/:id/audio` يحفظ البيانات ويعيد `audioVaultId`، وحذفها عبر `DELETE` يعيد 204.
- [x] **C4.5:** تدفق الواجهة في الشاشة 7 يتيح للمريض تعديل أي بعد بنقرة واحدة والعودة للتقرير فورياً.

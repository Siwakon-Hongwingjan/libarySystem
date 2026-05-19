# SRS — Week 5: Integration (ระบบห้องสมุด)

## 1. วัตถุประสงค์ของ Week 5

Week 5 มีเป้าหมายเพื่อรวม 4 topics หลักที่เรียนมาตลอด course เข้าด้วยกัน ได้แก่:

- **Modules** — แยกโค้ดออกเป็น module ย่อย (utils, services, models, config) และ import/export ให้ถูกต้อง
- **DateTime** — คำนวณวันที่คืนหนังสือ, วันครบกำหนด, และจำนวนวันที่เกินกำหนด
- **Regex** — ตรวจสอบรูปแบบข้อมูล เช่น ISBN, ชื่อสมาชิก, วันที่
- **Exception Handling** — จัดการกับข้อผิดพลาดที่อาจเกิดขึ้น เช่น ข้อมูลไม่ถูกต้อง, หนังสือไม่มีในระบบ

ผลลัพธ์ของ Week 5 คือระบบห้องสมุดที่ทำงานได้ครบวงจร พร้อมการคำนวณค่าปรับสำหรับหนังสือที่คืนช้า

---

## 2. Topics ที่ใช้

| Topic | นำไปใช้ที่ |
|-------|-----------|
| Modules | `fineUtils.js` import จาก `dateUtils.js` และ `libraryConfig.js` |
| DateTime | `daysDiff()` คำนวณจำนวนวันที่เกินกำหนด |
| Regex | `validator.js` ตรวจสอบรูปแบบข้อมูลก่อนคำนวณ |
| Exception Handling | ป้องกันกรณี input ไม่ถูกต้อง เช่น null/undefined |

---

## 3. รายการ Functions ที่ต้องสร้าง

### 3.1 `calculateFine(dueDate, returnDate, ratePerDay)`

| รายการ | รายละเอียด |
|--------|-----------|
| **ไฟล์** | `utils/fineUtils.js` |
| **Parameter** | `dueDate` (Date) — วันครบกำหนดคืนหนังสือ |
| | `returnDate` (Date) — วันที่สมาชิกคืนหนังสือจริง |
| | `ratePerDay` (number, default = `libraryConfig.fineRatePerDay`) — อัตราค่าปรับต่อวัน (บาท) |
| **Return** | `number` — จำนวนเงินค่าปรับ (บาท) ไม่ติดลบ |
| **คำอธิบาย** | คำนวณค่าปรับจากจำนวนวันที่คืนช้ากว่ากำหนด โดยใช้ `daysDiff(dueDate, returnDate)` หากคืนก่อนหรือตรงกำหนดให้คืนค่า `0` |

**ตรรกะ:**
```
days = daysDiff(dueDate, returnDate)
if days <= 0 → return 0
else → return days × ratePerDay
```

---

### 3.2 `getTotalFine(records)`

| รายการ | รายละเอียด |
|--------|-----------|
| **ไฟล์** | `utils/fineUtils.js` |
| **Parameter** | `records` (Array\<BorrowRecord\>) — รายการยืม-คืนหนังสือทั้งหมด |
| **Return** | `number` — ยอดค่าปรับรวมทุก record (บาท) |
| **คำอธิบาย** | วนลูป records ทั้งหมด เรียก `calculateFine()` ในแต่ละ record แล้วรวมผลลัพธ์ หาก `returnDate` ของ record ใดเป็น `null` หรือ `undefined` ให้ใช้วันที่ปัจจุบัน (`new Date()`) แทน |

**ตรรกะ:**
```
total = 0
for each record in records:
    returnDate = record.returnDate ?? new Date()
    total += calculateFine(record.dueDate, returnDate)
return total
```

---

## 4. ตัวอย่าง Input/Output

### `calculateFine` — ตัวอย่าง

| dueDate | returnDate | ratePerDay | ผลลัพธ์ | หมายเหตุ |
|---------|------------|------------|---------|---------|
| 1 พ.ค. 2026 | 1 พ.ค. 2026 | 5 | **0 บาท** | คืนตรงกำหนด |
| 1 พ.ค. 2026 | 28 เม.ย. 2026 | 5 | **0 บาท** | คืนก่อนกำหนด |
| 1 พ.ค. 2026 | 2 พ.ค. 2026 | 5 | **5 บาท** | ช้า 1 วัน |
| 1 พ.ค. 2026 | 6 พ.ค. 2026 | 5 | **25 บาท** | ช้า 5 วัน |
| 1 พ.ค. 2026 | 4 พ.ค. 2026 | 10 | **30 บาท** | ช้า 3 วัน, อัตรา 10 บาท/วัน |

### `getTotalFine` — ตัวอย่าง

```javascript
const records = [
  { dueDate: new Date(2026, 4, 1), returnDate: new Date(2026, 4, 3) },  // ช้า 2 วัน = 10 บาท
  { dueDate: new Date(2026, 4, 1), returnDate: new Date(2026, 4, 4) },  // ช้า 3 วัน = 15 บาท
];
getTotalFine(records); // → 25 บาท
```

---

## 5. เงื่อนไขที่ต้องทดสอบ (Test Cases)

### calculateFine

| # | Scenario | Input | Expected Output |
|---|----------|-------|----------------|
| 1 | คืนตรงวันกำหนด | dueDate = returnDate | 0 |
| 2 | คืนก่อนกำหนด | returnDate < dueDate | 0 |
| 3 | ช้า 1 วัน, อัตราปกติ | 1 day × 5 บาท | 5 |
| 4 | ช้า 5 วัน, อัตราปกติ | 5 days × 5 บาท | 25 |
| 5 | ช้า 3 วัน, อัตราพิเศษ | 3 days × 10 บาท | 30 |

### getTotalFine

| # | Scenario | Input | Expected Output |
|---|----------|-------|----------------|
| 6 | ไม่มี records | `[]` | 0 |
| 7 | หลาย records ที่คืนแล้ว | ช้า 2 วัน + ช้า 3 วัน | 25 |
| 8 | record ที่ยังไม่คืน (ไม่มี returnDate) | ใช้ `new Date()` คำนวณ | ≥ 0 (ขึ้นอยู่กับ dueDate) |

---

## 6. เกณฑ์การส่ง

| เกณฑ์ | รายละเอียด |
|-------|-----------|
| ไฟล์ SRS | `docs/SRS-week5.md` ครบถ้วน |
| Test file | `tests/fine.test.js` — เขียนก่อน implement (TDD) |
| Implementation | `utils/fineUtils.js` — pass ทุก test |
| ทุก test ผ่าน | `npm test` — 5 test suites, ทุก test pass |
| Commit message | `feat(week5): add SRS, fineUtils with full test coverage` |
| Branch | `week5/integration` |

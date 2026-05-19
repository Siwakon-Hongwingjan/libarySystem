# Library System — Design Spec
**วิชา:** INT-141 Basic Programming  
**วันที่:** 2026-05-19  
**ระบบ:** Library System (ระบบห้องสมุด)  
**Strategy:** Difficulty Ramp — สะสม topic ทีละ branch จนครบทุก topic  

---

## 1. ภาพรวม

ระบบห้องสมุดที่นักศึกษาจะสร้างขึ้นทีละขั้น ผ่าน 5 branches โดยแต่ละ branch เพิ่ม topic ใหม่เข้าไปในระบบเดิม  
ระบบครอบคลุม: จัดการหนังสือ, สมาชิก, การยืม/คืน, การ validate ข้อมูล, และการจัดการ error

**Folder:** `/week11/librarySystem/`  
**ภาษา:** SRS เขียนเป็นภาษาไทย, code comments เขียนเป็น English  
**Testing:** Jest (unit tests ทุก function สำคัญ)  

---

## 2. Branch Structure

| Branch | Topic หลัก | Topics สะสม |
|--------|-----------|-------------|
| `week1/modules` | JS Modules | Modules |
| `week2/datetime` | JS DateTime | Modules + DateTime |
| `week3/regex` | Regular Expression | Modules + DateTime + Regex |
| `week4/exception` | Exception Handling | Modules + DateTime + Regex + Exception |
| `week5/integration` | Full Integration | ทุก topic รวมกัน |

---

## 3. โครงสร้าง Folder

```
librarySystem/
├── models/
│   ├── Book.js             (week1+)
│   ├── Member.js           (week2+)
│   └── BorrowRecord.js     (week2+)
├── services/
│   ├── bookService.js      (week1+)
│   ├── memberService.js    (week2+)
│   └── borrowService.js    (week2+)
├── utils/
│   ├── dateUtils.js        (week2+)
│   ├── validator.js        (week3+)
│   └── fineUtils.js        (week5+)
├── errors/
│   └── LibraryErrors.js    (week4+)
├── config/
│   └── libraryConfig.js    (week1+)
├── tests/
│   ├── book.test.js
│   ├── member.test.js
│   ├── borrow.test.js
│   ├── validation.test.js
│   └── fine.test.js
├── docs/
│   ├── SRS-week1.md
│   ├── SRS-week2.md
│   ├── SRS-week3.md
│   ├── SRS-week4.md
│   └── SRS-week5.md
├── package.json
└── app.js
```

---

## 4. รายละเอียดแต่ละ Branch

### Branch 1 — `week1/modules` (JS Modules)

**เป้าหมาย:** สร้างโครงสร้างระบบด้วย ES Modules, named/default export

**ไฟล์ที่ต้องสร้าง:**
- `models/Book.js` — class Book `{ id, title, author, isbn, category, isAvailable }`
- `services/bookService.js` — `addBook(library, book)`, `removeBook(library, bookId)`, `searchBook(library, query)`, `listAllBooks(library)`
- `config/libraryConfig.js` — `maxBooks`, `categories`, `borrowDays`
- `tests/book.test.js` — Jest tests ทุก function ใน bookService

**ห้ามใช้:** DateTime, Regex, try-catch

---

### Branch 2 — `week2/datetime` (+ JS DateTime)

**เพิ่มจาก week1:**
- `models/Member.js` — class Member `{ id, name, phone, email, borrowedBooks[] }`
- `models/BorrowRecord.js` — class BorrowRecord `{ recordId, book, member, borrowDate, dueDate, returnDate }`
- `services/memberService.js` — `addMember(library, member)`, `getMember(library, memberId)`
- `services/borrowService.js` — `borrowBook(library, memberId, bookId)`, `returnBook(library, recordId)`
- `utils/dateUtils.js` — `calculateDueDate(borrowDate, days)`, `formatDate(date)`, `isOverdue(dueDate)`, `daysDiff(date1, date2)`
- `tests/borrow.test.js` — Jest tests สำหรับ dateUtils และ borrowService

**DateTime rules:**
- ระยะเวลายืมเริ่มต้น: 14 วัน (จาก libraryConfig)
- format วันที่: `YYYY-MM-DD`
- isOverdue เปรียบเทียบกับ Date.now()

---

### Branch 3 — `week3/regex` (+ Regular Expression)

**เพิ่มจาก week2:**
- `utils/validator.js` — functions validate ข้อมูลทุกประเภท
- Integrate validator เข้า models และ services

**Regex patterns ที่ต้องสร้าง:**

| Function | Pattern | ตัวอย่างที่ถูกต้อง |
|----------|---------|-------------------|
| `validateISBN(isbn)` | `978-\d{1,5}-\d{1,7}-\d{1,7}-\d` | `978-616-05-0210-3` |
| `validateMemberID(id)` | `LIB-\d{4}` | `LIB-0042` |
| `validatePhone(phone)` | `0[6-9]\d{8}` | `0812345678` |
| `validateEmail(email)` | standard email regex | `user@example.com` |
| `validateBookTitle(title)` | ยาว 1–100 ตัวอักษร ไม่ขึ้นต้นด้วยช่องว่าง | `"JavaScript Basics"` |

- ทุก validate function คืน `{ valid: boolean, message: string }`
- `tests/validation.test.js` — ทดสอบทั้ง valid และ invalid case

---

### Branch 4 — `week4/exception` (+ Exception Handling)

**เพิ่มจาก week3:**
- `errors/LibraryErrors.js` — custom error classes ทั้งหมด
- Safe wrapper functions ใน services ทุกตัว

**Custom Errors:**
```
LibraryError (base)
├── BookNotFoundError
├── MemberNotFoundError
├── BookNotAvailableError
├── ValidationError
└── OverdueError
```

**Safe wrapper pattern:**
- ทุก function ใน services ต้องมี `safe` version ที่ return `{ success, data, message }`
- ใช้ try-catch-finally (finally log การทำงาน)
- ตัวอย่าง: `safeAddBook()`, `safeBorrowBook()`, `safeReturnBook()`

---

### Branch 5 — `week5/integration` (Full System)

**เพิ่มจาก week4:**
- `utils/fineUtils.js` — `calculateFine(dueDate, returnDate, ratePerDay)`, `getTotalFine(records)`
- Fine rate: 5 บาท/วัน (จาก libraryConfig)
- `app.js` — demo การใช้งานระบบครบทุก feature
- Jest tests ครบทุกไฟล์ รวมถึง edge cases

---

## 5. package.json Configuration

```json
{
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/.bin/jest",
    "start": "node app.js"
  },
  "devDependencies": {
    "jest": "^29.x"
  }
}
```

> ใช้ `"type": "module"` เพื่อรองรับ ES Modules (import/export) เหมือน orderSystem

---

## 6. Jest Test Strategy

- แต่ละ branch ต้องมี test ครอบคลุม functions ที่สร้างใหม่
- test ทั้ง happy path และ edge case
- ไม่ mock internal functions — test behavior จริง

---

## 7. SRS Format (แต่ละ branch)

แต่ละไฟล์ `SRS-weekN.md` จะมีหัวข้อดังนี้:
1. วัตถุประสงค์ของ Week
2. Topics ที่ใช้
3. รายการ Functions ที่ต้องสร้าง (ชื่อ, parameter, return value, คำอธิบาย)
4. ตัวอย่าง Input/Output
5. เงื่อนไขที่ต้องทดสอบ (Test Cases)
6. เกณฑ์การส่ง

# SRS Week 4 — Exception Handling (Error Management)

## 1. วัตถุประสงค์
เพิ่ม custom error classes และ safe wrapper functions เพื่อจัดการข้อผิดพลาดอย่างเป็นระบบ

## 2. Topics ที่ใช้ (สะสมจาก Week 1-3)
- JS Modules, DateTime, Regex (ทบทวน)
- **Exception Handling** — try-catch-finally, custom Error classes, error hierarchy

## 3. ที่ต้องสร้าง

### errors/LibraryErrors.js — custom error hierarchy
```
LibraryError (base)
├── BookNotFoundError(bookId)        → "Book not found: B001"
├── MemberNotFoundError(memberId)    → "Member not found: LIB-0001"
├── BookNotAvailableError(bookId)    → "Book not available: B001"
├── ValidationError(message)         → ใช้แทน Error เดิมใน services
└── OverdueError(recordId, days)     → "Book overdue by 3 day(s): record R123"
```

### Safe wrapper functions (คืน `{ success, data, message }`)
| Function | อยู่ใน | คำอธิบาย |
|----------|--------|----------|
| `safeAddBook(library, book)` | bookService.js | try-catch-finally รอบ addBook |
| `safeRemoveBook(library, bookId)` | bookService.js | try-catch-finally รอบ removeBook |
| `safeAddMember(library, member)` | memberService.js | try-catch-finally รอบ addMember |
| `safeBorrowBook(library, memberId, bookId)` | borrowService.js | try-catch-finally รอบ borrowBook |
| `safeReturnBook(library, recordId)` | borrowService.js | try-catch-finally รอบ returnBook |

## 4. ตัวอย่าง Input/Output

```javascript
// throw สำหรับ internal code
removeBook(library, "BNONE"); // throws BookNotFoundError: "Book not found: BNONE"

// safe wrapper สำหรับ UI/external code
const result = safeRemoveBook(library, "BNONE");
// { success: false, data: null, message: "Book not found: BNONE" }

const ok = safeAddBook(library, validBook);
// { success: true, data: [...books], message: "Book added successfully" }
```

## 5. Test Cases ที่ต้องผ่าน
- [ ] Custom errors เป็น instance ของ LibraryError และ Error
- [ ] safeAddBook คืน success: true สำหรับ input ที่ถูกต้อง
- [ ] safeAddBook คืน success: false สำหรับ input ที่ผิด
- [ ] safeRemoveBook คืน success: true / false ถูกต้อง
- [ ] safeBorrowBook คืน success ถูกต้อง
- [ ] safeReturnBook คืน success ถูกต้อง
- [ ] finally block ทำงานทุกครั้ง (ดู console.log)

## 6. เกณฑ์การส่ง
- ทุก test ผ่าน (`npm test`)
- safe functions ต้องใช้ try-catch-finally ทุกตัว
- throw ใน functions ปกติต้องเป็น custom error class

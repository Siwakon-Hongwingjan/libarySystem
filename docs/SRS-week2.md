# SRS Week 2 — JS DateTime (ระบบยืม-คืนหนังสือ)

## 1. วัตถุประสงค์
เพิ่มระบบสมาชิกและการยืม-คืนหนังสือ โดยใช้ JS DateTime จัดการวันที่

## 2. Topics ที่ใช้ (สะสมจาก Week 1)
- JS Modules (ทบทวน)
- **JS DateTime** — new Date(), setDate(), getDate(), getTime(), การเปรียบเทียบ Date

## 3. Functions และ Class ที่ต้องสร้าง

### models/Member.js — class Member
| Property | ประเภท | Default | คำอธิบาย |
|----------|--------|---------|----------|
| `id` | string | — | รหัสสมาชิก |
| `name` | string | — | ชื่อ-นามสกุล |
| `phone` | string | — | เบอร์โทรศัพท์ |
| `email` | string | — | อีเมล |
| `borrowedBooks` | array | [] | รายการยืม |

### models/BorrowRecord.js — class BorrowRecord
| Property | ประเภท | Default | คำอธิบาย |
|----------|--------|---------|----------|
| `recordId` | string | — | รหัสการยืม |
| `book` | Book | — | หนังสือที่ยืม |
| `member` | Member | — | สมาชิกที่ยืม |
| `borrowDate` | Date | — | วันที่ยืม |
| `dueDate` | Date | — | วันครบกำหนดคืน |
| `returnDate` | Date\|null | null | วันที่คืนจริง |

### utils/dateUtils.js — named exports
| Function | Parameters | Return | คำอธิบาย |
|----------|-----------|--------|----------|
| `calculateDueDate(borrowDate, days)` | borrowDate: Date, days: number | Date | วันครบกำหนด (ไม่แก้ไข borrowDate ต้นฉบับ) |
| `formatDate(date)` | date: Date | string | แปลงเป็น "YYYY-MM-DD" |
| `isOverdue(dueDate)` | dueDate: Date | boolean | true ถ้าเลยกำหนดแล้ว |
| `daysDiff(date1, date2)` | date1: Date, date2: Date | number | จำนวนวันระหว่าง 2 วันที่ |

### services/memberService.js — named exports
| Function | Parameters | Return | คำอธิบาย |
|----------|-----------|--------|----------|
| `addMember(library, member)` | library: object, member: Member | void | เพิ่มสมาชิก |
| `getMember(library, memberId)` | library: object, memberId: string | Member | ดึงข้อมูล — throw ถ้าไม่พบ |

### services/borrowService.js — named exports
| Function | Parameters | Return | คำอธิบาย |
|----------|-----------|--------|----------|
| `borrowBook(library, memberId, bookId)` | library, memberId: string, bookId: string | BorrowRecord | สร้าง record ยืม — throw ถ้าไม่พบ หรือไม่ว่าง |
| `returnBook(library, recordId)` | library, recordId: string | BorrowRecord | บันทึกคืน — throw ถ้าไม่พบ |

## 4. ตัวอย่าง Input/Output

```javascript
calculateDueDate(new Date(2026, 0, 1), 14); // Date: 2026-01-15
formatDate(new Date(2026, 4, 19));          // "2026-05-19"
isOverdue(new Date(2000, 0, 1));            // true
daysDiff(new Date(2026, 0, 1), new Date(2026, 0, 15)); // 14

const record = borrowBook(library, "LIB-0001", "B001");
// record.dueDate = borrowDate + 14 วัน
// library.books[0].isAvailable === false
```

## 5. Test Cases ที่ต้องผ่าน
- [ ] calculateDueDate เพิ่มวันถูกต้องและไม่แก้ไขค่าเดิม
- [ ] formatDate คืน YYYY-MM-DD, padding ด้วย 0
- [ ] isOverdue คืน true / false ถูกต้อง
- [ ] daysDiff คืนจำนวนวันที่ถูกต้อง (รวม negative)
- [ ] borrowBook สร้าง record และเปลี่ยน isAvailable เป็น false
- [ ] borrowBook throw เมื่อหนังสือไม่ว่าง
- [ ] returnBook บันทึก returnDate และเปลี่ยน isAvailable กลับ
- [ ] returnBook throw เมื่อคืนซ้ำ

## 6. เกณฑ์การส่ง
- ทุก test ผ่าน (`npm test`)
- ใช้ Date object จริง (ห้ามใช้ string แทน Date)
- ห้ามใช้ Regex, try-catch

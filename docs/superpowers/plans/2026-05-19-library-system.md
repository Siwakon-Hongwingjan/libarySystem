# Library System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างระบบห้องสมุด (Library System) เป็นโจทย์วิชา INT-141 แบ่งเป็น 5 git branches สะสม topics: Modules → DateTime → Regex → Exception → Integration

**Architecture:** ข้อมูลเก็บในออบเจ็กต์ `library = { books, members, records }` ส่งผ่าน pure service functions ไม่มี database แต่ละ branch build ต่อจาก branch ก่อนหน้า

**Tech Stack:** Node.js 18+ (ES Modules), Jest 29, npm

---

## File Map

| ไฟล์ | สร้างใน Task | หน้าที่ |
|------|------------|--------|
| `package.json` | 0 | Project + Jest config |
| `config/libraryConfig.js` | 1 | Constants: borrowDays, fineRate, categories |
| `models/Book.js` | 1 | Book class + checkout/checkin |
| `models/Member.js` | 4 | Member class |
| `models/BorrowRecord.js` | 4 | BorrowRecord class |
| `services/bookService.js` | 2 → 10 → 12 | CRUD หนังสือ → +validation → +safe wrappers |
| `services/memberService.js` | 6 → 10 → 12 | CRUD สมาชิก → +validation → +safe wrappers |
| `services/borrowService.js` | 6 → 12 | ยืม/คืน → +safe wrappers |
| `utils/dateUtils.js` | 5 | calculateDueDate, formatDate, isOverdue, daysDiff |
| `utils/validator.js` | 9 | Regex: ISBN, memberID, phone, email, title |
| `utils/fineUtils.js` | 14 | calculateFine, getTotalFine |
| `errors/LibraryErrors.js` | 11 | Custom error classes |
| `tests/book.test.js` | 2 → 10 → 12 | Tests bookService |
| `tests/member.test.js` | 6 → 10 → 12 | Tests memberService |
| `tests/borrow.test.js` | 5 → 6 → 12 | Tests dateUtils + borrowService |
| `tests/validation.test.js` | 9 | Tests validator |
| `tests/fine.test.js` | 14 | Tests fineUtils |
| `docs/SRS-week1.md` | 1 | SRS ภาษาไทย Week 1 |
| `docs/SRS-week2.md` | 4 | SRS ภาษาไทย Week 2 |
| `docs/SRS-week3.md` | 8 | SRS ภาษาไทย Week 3 |
| `docs/SRS-week4.md` | 11 | SRS ภาษาไทย Week 4 |
| `docs/SRS-week5.md` | 14 | SRS ภาษาไทย Week 5 |
| `app.js` | 3 → 7 → 13 → 15 | Demo script เติบโตทุก branch |

---

### Task 0: Project Setup

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `app.js` (empty)

- [ ] **Step 1: Initialize git repo**

```bash
cd /home/sion/year1_SIT/INT-141-Basic/week11/librarySystem
git init
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "library-system",
  "version": "1.0.0",
  "description": "INT-141 Library System — Teaching Exercise",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "test": "node --experimental-vm-modules node_modules/.bin/jest"
  },
  "jest": {
    "transform": {}
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
```

- [ ] **Step 4: Create app.js**

```javascript
// app.js — entry point (grows each week)
```

- [ ] **Step 5: Install dependencies and create folders**

```bash
npm install
mkdir -p models services utils errors config tests docs
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Initial commit**

```bash
git add package.json .gitignore app.js
git commit -m "init: setup librarySystem project"
```

---

### Task 1: Week 1 Branch — SRS + Config + Book Model

**Files:**
- Create: `docs/SRS-week1.md`
- Create: `config/libraryConfig.js`
- Create: `models/Book.js`

- [ ] **Step 1: Create week1 branch**

```bash
git checkout -b week1/modules
```

- [ ] **Step 2: Create docs/SRS-week1.md**

```markdown
# SRS Week 1 — JS Modules (ระบบจัดการหนังสือ)

## 1. วัตถุประสงค์
ฝึกใช้ ES Modules (import/export) โดยสร้างระบบจัดการหนังสือห้องสมุดพื้นฐาน

## 2. Topics ที่ใช้
- Named export / Default export
- ES Module (import/export)
- Class definition (constructor, methods)
- Module configuration

## 3. Functions และ Class ที่ต้องสร้าง

### config/libraryConfig.js
| ค่า | ประเภท | ค่าเริ่มต้น | คำอธิบาย |
|-----|--------|------------|----------|
| `maxBooks` | number | 1000 | จำนวนหนังสือสูงสุด |
| `borrowDays` | number | 14 | ระยะเวลายืมเริ่มต้น (วัน) |
| `fineRatePerDay` | number | 5 | ค่าปรับต่อวัน (บาท) |
| `categories` | string[] | [...] | หมวดหมู่ที่อนุญาต |

### models/Book.js — class Book
| Property | ประเภท | Default | คำอธิบาย |
|----------|--------|---------|----------|
| `id` | string | — | รหัสหนังสือ (unique) |
| `title` | string | — | ชื่อหนังสือ |
| `author` | string | — | ชื่อผู้แต่ง |
| `isbn` | string | — | รหัส ISBN |
| `category` | string | — | หมวดหมู่ |
| `isAvailable` | boolean | true | พร้อมให้ยืม |

| Method | คำอธิบาย |
|--------|----------|
| `checkout()` | ตั้ง isAvailable = false |
| `checkin()` | ตั้ง isAvailable = true |

### services/bookService.js — named exports
| Function | Parameters | Return | คำอธิบาย |
|----------|-----------|--------|----------|
| `addBook(library, book)` | library: object, book: Book | void | เพิ่มหนังสือ — throw "Invalid book" / "Book already exists" |
| `removeBook(library, bookId)` | library: object, bookId: string | void | ลบหนังสือ — throw "Book not found" |
| `searchBook(library, query)` | library: object, query: string | Book[] | ค้นหาจาก title, author, isbn (case-insensitive) |
| `listAllBooks(library)` | library: object | Book[] | คืนหนังสือทั้งหมด |

## 4. ตัวอย่าง Input/Output

```javascript
const library = { books: [] };
const book = new Book({ id: "B001", title: "JavaScript Basics",
  author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" });

addBook(library, book);          // library.books.length === 1
searchBook(library, "javascript"); // [{ id: "B001", ... }]
removeBook(library, "B001");     // library.books.length === 0
```

## 5. Test Cases ที่ต้องผ่าน
- [ ] เพิ่มหนังสือที่ถูกต้องสำเร็จ
- [ ] throw เมื่อ argument ไม่ใช่ Book instance
- [ ] throw เมื่อ id ซ้ำ
- [ ] ลบหนังสือที่มีอยู่สำเร็จ
- [ ] throw เมื่อหาหนังสือไม่เจอ
- [ ] ค้นหาด้วย title, author (case-insensitive)
- [ ] คืน array ว่างเมื่อค้นไม่เจอ
- [ ] listAllBooks คืนหนังสือทั้งหมด

## 6. เกณฑ์การส่ง
- ทุก test ผ่าน (`npm test`)
- ห้ามใช้ DateTime, Regex, try-catch
- ทุกไฟล์ใช้ import/export
```

- [ ] **Step 3: Create config/libraryConfig.js**

```javascript
export const libraryConfig = {
  maxBooks: 1000,
  borrowDays: 14,
  fineRatePerDay: 5,
  categories: ["Fiction", "Non-Fiction", "Science", "History", "Technology", "Arts"],
};
```

- [ ] **Step 4: Create models/Book.js**

```javascript
export class Book {
  constructor({ id, title, author, isbn, category, isAvailable = true }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.category = category;
    this.isAvailable = isAvailable;
  }

  checkout() {
    this.isAvailable = false;
  }

  checkin() {
    this.isAvailable = true;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add docs/SRS-week1.md config/libraryConfig.js models/Book.js
git commit -m "feat(week1): add SRS, libraryConfig, and Book model"
```

---

### Task 2: Week 1 — bookService (TDD)

**Files:**
- Create: `tests/book.test.js`
- Create: `services/bookService.js`

- [ ] **Step 1: Create tests/book.test.js (failing)**

```javascript
import { Book } from "../models/Book.js";
import { addBook, removeBook, searchBook, listAllBooks } from "../services/bookService.js";

describe("addBook", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("adds a valid Book to library", () => {
    const book = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    addBook(library, book);
    expect(library.books).toHaveLength(1);
    expect(library.books[0].id).toBe("B001");
  });

  test("throws when argument is not a Book instance", () => {
    expect(() => addBook(library, { id: "B001" })).toThrow("Invalid book");
  });

  test("throws when book id already exists", () => {
    const book = new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    addBook(library, book);
    expect(() => addBook(library, book)).toThrow("Book already exists");
  });
});

describe("removeBook", () => {
  let library;
  beforeEach(() => {
    library = { books: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
  });

  test("removes an existing book", () => {
    removeBook(library, "B001");
    expect(library.books).toHaveLength(0);
  });

  test("throws when book not found", () => {
    expect(() => removeBook(library, "B999")).toThrow("Book not found");
  });
});

describe("searchBook", () => {
  let library;
  beforeEach(() => {
    library = { books: [] };
    addBook(library, new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" }));
    addBook(library, new Book({ id: "B002", title: "Python Guide", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" }));
  });

  test("finds books by title (case-insensitive)", () => {
    expect(searchBook(library, "javascript")).toHaveLength(1);
  });

  test("finds books by author", () => {
    expect(searchBook(library, "jones")).toHaveLength(1);
  });

  test("returns empty array when not found", () => {
    expect(searchBook(library, "notexist")).toHaveLength(0);
  });
});

describe("listAllBooks", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("returns all books", () => {
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
    addBook(library, new Book({ id: "B002", title: "Python", author: "Bob", isbn: "978-616-05-0002-8", category: "Technology" }));
    expect(listAllBooks(library)).toHaveLength(2);
  });

  test("returns empty array when no books", () => {
    expect(listAllBooks(library)).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test tests/book.test.js
```

Expected: FAIL — `Cannot find module '../services/bookService.js'`

- [ ] **Step 3: Create services/bookService.js**

```javascript
import { Book } from "../models/Book.js";

export function addBook(library, book) {
  if (!(book instanceof Book)) throw new Error("Invalid book");
  if (library.books.find((b) => b.id === book.id)) throw new Error("Book already exists");
  library.books.push(book);
}

export function removeBook(library, bookId) {
  const index = library.books.findIndex((b) => b.id === bookId);
  if (index === -1) throw new Error("Book not found");
  library.books.splice(index, 1);
}

export function searchBook(library, query) {
  const q = query.toLowerCase();
  return library.books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
  );
}

export function listAllBooks(library) {
  return [...library.books];
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test tests/book.test.js
```

Expected: PASS — 9 tests passed

- [ ] **Step 5: Commit**

```bash
git add tests/book.test.js services/bookService.js
git commit -m "feat(week1): add bookService with full test coverage"
```

---

### Task 3: Week 1 — app.js Demo

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Replace app.js with demo**

```javascript
import { Book } from "./models/Book.js";
import { addBook, removeBook, searchBook, listAllBooks } from "./services/bookService.js";

const library = { books: [] };

const js = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" });
const py = new Book({ id: "B002", title: "Python for Beginners", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" });
const cc = new Book({ id: "B003", title: "Clean Code", author: "Robert Martin", isbn: "978-616-05-0003-5", category: "Technology" });

addBook(library, js);
addBook(library, py);
addBook(library, cc);

console.log("=== All Books ===");
listAllBooks(library).forEach((b) => console.log(`${b.id}: ${b.title} by ${b.author}`));

console.log("\n=== Search 'python' ===");
searchBook(library, "python").forEach((b) => console.log(`Found: ${b.title}`));

removeBook(library, "B003");
console.log(`\n=== After removing B003: ${listAllBooks(library).length} books ===`);
```

- [ ] **Step 2: Run and verify output**

```bash
node app.js
```

Expected:
```
=== All Books ===
B001: JavaScript Basics by Alice Smith
B002: Python for Beginners by Bob Jones
B003: Clean Code by Robert Martin

=== Search 'python' ===
Found: Python for Beginners

=== After removing B003: 2 books ===
```

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat(week1): add app.js demo for book catalog"
```

---

### Task 4: Week 2 Branch — SRS + Models

**Files:**
- Create: `docs/SRS-week2.md`
- Create: `models/Member.js`
- Create: `models/BorrowRecord.js`

- [ ] **Step 1: Create week2 branch**

```bash
git checkout -b week2/datetime
```

- [ ] **Step 2: Create docs/SRS-week2.md**

```markdown
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
```

- [ ] **Step 3: Create models/Member.js**

```javascript
export class Member {
  constructor({ id, name, phone, email }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.borrowedBooks = [];
  }
}
```

- [ ] **Step 4: Create models/BorrowRecord.js**

```javascript
export class BorrowRecord {
  constructor({ recordId, book, member, borrowDate, dueDate }) {
    this.recordId = recordId;
    this.book = book;
    this.member = member;
    this.borrowDate = borrowDate;
    this.dueDate = dueDate;
    this.returnDate = null;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add docs/SRS-week2.md models/Member.js models/BorrowRecord.js
git commit -m "feat(week2): add SRS, Member and BorrowRecord models"
```

---

### Task 5: Week 2 — dateUtils (TDD)

**Files:**
- Create: `tests/borrow.test.js` (dateUtils section)
- Create: `utils/dateUtils.js`

- [ ] **Step 1: Create tests/borrow.test.js with dateUtils tests**

```javascript
import { calculateDueDate, formatDate, isOverdue, daysDiff } from "../utils/dateUtils.js";

describe("calculateDueDate", () => {
  test("adds the correct number of days", () => {
    const borrow = new Date(2026, 0, 1); // Jan 1, 2026
    const due = calculateDueDate(borrow, 14);
    expect(formatDate(due)).toBe("2026-01-15");
  });

  test("does not mutate the original date", () => {
    const borrow = new Date(2026, 0, 1);
    calculateDueDate(borrow, 14);
    expect(formatDate(borrow)).toBe("2026-01-01");
  });
});

describe("formatDate", () => {
  test("returns YYYY-MM-DD format", () => {
    expect(formatDate(new Date(2026, 4, 19))).toBe("2026-05-19");
  });

  test("pads month and day with leading zero", () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("isOverdue", () => {
  test("returns true for a past date", () => {
    expect(isOverdue(new Date(2000, 0, 1))).toBe(true);
  });

  test("returns false for a future date", () => {
    expect(isOverdue(new Date(2099, 0, 1))).toBe(false);
  });
});

describe("daysDiff", () => {
  test("returns correct number of days between two dates", () => {
    expect(daysDiff(new Date(2026, 0, 1), new Date(2026, 0, 15))).toBe(14);
  });

  test("returns negative when date1 is after date2", () => {
    expect(daysDiff(new Date(2026, 0, 15), new Date(2026, 0, 1))).toBe(-14);
  });

  test("returns 0 for same date", () => {
    expect(daysDiff(new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe(0);
  });
});
```

- [ ] **Step 2: Run to verify tests fail**

```bash
npm test tests/borrow.test.js
```

Expected: FAIL — `Cannot find module '../utils/dateUtils.js'`

- [ ] **Step 3: Create utils/dateUtils.js**

```javascript
export function calculateDueDate(borrowDate, days) {
  const due = new Date(borrowDate);
  due.setDate(due.getDate() + days);
  return due;
}

export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isOverdue(dueDate) {
  return new Date() > new Date(dueDate);
}

export function daysDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test tests/borrow.test.js
```

Expected: PASS — 7 tests passed

- [ ] **Step 5: Commit**

```bash
git add tests/borrow.test.js utils/dateUtils.js
git commit -m "feat(week2): add dateUtils with full test coverage"
```

---

### Task 6: Week 2 — memberService + borrowService (TDD)

**Files:**
- Create: `tests/member.test.js`
- Modify: `tests/borrow.test.js` (add borrowService section)
- Create: `services/memberService.js`
- Create: `services/borrowService.js`

- [ ] **Step 1: Create tests/member.test.js**

```javascript
import { Member } from "../models/Member.js";
import { addMember, getMember } from "../services/memberService.js";

describe("addMember", () => {
  let library;
  beforeEach(() => { library = { members: [] }; });

  test("adds a valid Member to library", () => {
    const member = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    addMember(library, member);
    expect(library.members).toHaveLength(1);
  });

  test("throws when argument is not a Member instance", () => {
    expect(() => addMember(library, { id: "LIB-0001" })).toThrow("Invalid member");
  });

  test("throws when member id already exists", () => {
    const member = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    addMember(library, member);
    expect(() => addMember(library, member)).toThrow("Member already exists");
  });
});

describe("getMember", () => {
  let library;
  beforeEach(() => {
    library = { members: [] };
    addMember(library, new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" }));
  });

  test("returns the correct member", () => {
    const m = getMember(library, "LIB-0001");
    expect(m.name).toBe("Alice");
  });

  test("throws when member not found", () => {
    expect(() => getMember(library, "LIB-9999")).toThrow("Member not found");
  });
});
```

- [ ] **Step 2: Replace tests/borrow.test.js with complete file (adds borrowService section)**

```javascript
import { calculateDueDate, formatDate, isOverdue, daysDiff } from "../utils/dateUtils.js";
import { Book } from "../models/Book.js";
import { Member } from "../models/Member.js";
import { addBook } from "../services/bookService.js";
import { addMember } from "../services/memberService.js";
import { borrowBook, returnBook } from "../services/borrowService.js";

// ─── dateUtils ────────────────────────────────────────────────────────────────

describe("calculateDueDate", () => {
  test("adds the correct number of days", () => {
    const borrow = new Date(2026, 0, 1);
    const due = calculateDueDate(borrow, 14);
    expect(formatDate(due)).toBe("2026-01-15");
  });

  test("does not mutate the original date", () => {
    const borrow = new Date(2026, 0, 1);
    calculateDueDate(borrow, 14);
    expect(formatDate(borrow)).toBe("2026-01-01");
  });
});

describe("formatDate", () => {
  test("returns YYYY-MM-DD format", () => {
    expect(formatDate(new Date(2026, 4, 19))).toBe("2026-05-19");
  });

  test("pads month and day with leading zero", () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("isOverdue", () => {
  test("returns true for a past date", () => {
    expect(isOverdue(new Date(2000, 0, 1))).toBe(true);
  });

  test("returns false for a future date", () => {
    expect(isOverdue(new Date(2099, 0, 1))).toBe(false);
  });
});

describe("daysDiff", () => {
  test("returns correct number of days between two dates", () => {
    expect(daysDiff(new Date(2026, 0, 1), new Date(2026, 0, 15))).toBe(14);
  });

  test("returns negative when date1 is after date2", () => {
    expect(daysDiff(new Date(2026, 0, 15), new Date(2026, 0, 1))).toBe(-14);
  });

  test("returns 0 for same date", () => {
    expect(daysDiff(new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe(0);
  });
});

// ─── borrowService ────────────────────────────────────────────────────────────

describe("borrowBook", () => {
  let library;
  beforeEach(() => {
    library = { books: [], members: [], records: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
    addMember(library, new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" }));
  });

  test("creates a BorrowRecord", () => {
    const record = borrowBook(library, "LIB-0001", "B001");
    expect(record.book.id).toBe("B001");
    expect(record.member.id).toBe("LIB-0001");
    expect(record.returnDate).toBeNull();
  });

  test("sets book isAvailable to false", () => {
    borrowBook(library, "LIB-0001", "B001");
    expect(library.books[0].isAvailable).toBe(false);
  });

  test("sets dueDate to borrowDate + 14 days", () => {
    const record = borrowBook(library, "LIB-0001", "B001");
    expect(daysDiff(record.borrowDate, record.dueDate)).toBe(14);
  });

  test("throws when book is not available", () => {
    borrowBook(library, "LIB-0001", "B001");
    expect(() => borrowBook(library, "LIB-0001", "B001")).toThrow("Book not available");
  });

  test("throws when book not found", () => {
    expect(() => borrowBook(library, "LIB-0001", "BNONE")).toThrow("Book not found");
  });
});

describe("returnBook", () => {
  let library;
  let record;
  beforeEach(() => {
    library = { books: [], members: [], records: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
    addMember(library, new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" }));
    record = borrowBook(library, "LIB-0001", "B001");
  });

  test("sets returnDate on the record", () => {
    returnBook(library, record.recordId);
    expect(record.returnDate).not.toBeNull();
  });

  test("sets book isAvailable back to true", () => {
    returnBook(library, record.recordId);
    expect(library.books[0].isAvailable).toBe(true);
  });

  test("throws when record not found", () => {
    expect(() => returnBook(library, "RNONE")).toThrow("Record not found");
  });

  test("throws when book already returned", () => {
    returnBook(library, record.recordId);
    expect(() => returnBook(library, record.recordId)).toThrow("Book already returned");
  });
});
```

- [ ] **Step 3: Run to verify tests fail**

```bash
npm test tests/member.test.js tests/borrow.test.js
```

Expected: FAIL — `Cannot find module '../services/memberService.js'`

- [ ] **Step 4: Create services/memberService.js**

```javascript
import { Member } from "../models/Member.js";

export function addMember(library, member) {
  if (!(member instanceof Member)) throw new Error("Invalid member");
  if (library.members.find((m) => m.id === member.id)) throw new Error("Member already exists");
  library.members.push(member);
}

export function getMember(library, memberId) {
  const member = library.members.find((m) => m.id === memberId);
  if (!member) throw new Error("Member not found");
  return member;
}
```

- [ ] **Step 5: Create services/borrowService.js**

```javascript
import { BorrowRecord } from "../models/BorrowRecord.js";
import { getMember } from "./memberService.js";
import { calculateDueDate } from "../utils/dateUtils.js";
import { libraryConfig } from "../config/libraryConfig.js";

export function borrowBook(library, memberId, bookId) {
  const member = getMember(library, memberId);
  const book = library.books.find((b) => b.id === bookId);
  if (!book) throw new Error("Book not found");
  if (!book.isAvailable) throw new Error("Book not available");

  const borrowDate = new Date();
  const dueDate = calculateDueDate(borrowDate, libraryConfig.borrowDays);
  const record = new BorrowRecord({ recordId: `R${Date.now()}`, book, member, borrowDate, dueDate });

  book.checkout();
  member.borrowedBooks.push(record);
  library.records.push(record);
  return record;
}

export function returnBook(library, recordId) {
  const record = library.records.find((r) => r.recordId === recordId);
  if (!record) throw new Error("Record not found");
  if (record.returnDate) throw new Error("Book already returned");

  record.returnDate = new Date();
  record.book.checkin();
  return record;
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test tests/member.test.js tests/borrow.test.js
```

Expected: PASS — 16 tests passed

- [ ] **Step 7: Commit**

```bash
git add tests/member.test.js tests/borrow.test.js services/memberService.js services/borrowService.js
git commit -m "feat(week2): add memberService and borrowService with full test coverage"
```

---

### Task 7: Week 2 — app.js Update

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Replace app.js**

```javascript
import { Book } from "./models/Book.js";
import { Member } from "./models/Member.js";
import { addBook, listAllBooks } from "./services/bookService.js";
import { addMember } from "./services/memberService.js";
import { borrowBook, returnBook } from "./services/borrowService.js";
import { formatDate, isOverdue } from "./utils/dateUtils.js";

const library = { books: [], members: [], records: [] };

const js = new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" });
const py = new Book({ id: "B002", title: "Python for Beginners", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" });
addBook(library, js);
addBook(library, py);

const alice = new Member({ id: "LIB-0001", name: "Alice Smith", phone: "0812345678", email: "alice@example.com" });
addMember(library, alice);

const record = borrowBook(library, "LIB-0001", "B001");
console.log(`Borrowed: ${record.book.title}`);
console.log(`Due date: ${formatDate(record.dueDate)}`);
console.log(`Overdue? ${isOverdue(record.dueDate)}`);

returnBook(library, record.recordId);
console.log(`Returned: ${record.book.title} on ${formatDate(record.returnDate)}`);
console.log(`B001 available again? ${library.books[0].isAvailable}`);
```

- [ ] **Step 2: Run and verify**

```bash
node app.js
```

Expected:
```
Borrowed: JavaScript Basics
Due date: 2026-06-02
Overdue? false
Returned: JavaScript Basics on 2026-05-19
B001 available again? true
```

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat(week2): update app.js with member and borrow demo"
```

---

### Task 8: Week 3 Branch — SRS

**Files:**
- Create: `docs/SRS-week3.md`

- [ ] **Step 1: Create week3 branch**

```bash
git checkout -b week3/regex
```

- [ ] **Step 2: Create docs/SRS-week3.md**

```markdown
# SRS Week 3 — Regular Expression (Validation)

## 1. วัตถุประสงค์
เพิ่ม layer การ validate ข้อมูลด้วย Regular Expression ก่อนบันทึกลงระบบ

## 2. Topics ที่ใช้ (สะสมจาก Week 1-2)
- JS Modules (ทบทวน)
- JS DateTime (ทบทวน)
- **Regular Expression** — pattern.test(), regex literals, character classes

## 3. Functions ที่ต้องสร้าง

### utils/validator.js — named exports
ทุก function คืน `{ valid: boolean, message: string }`

| Function | Pattern | ตัวอย่างที่ valid |
|----------|---------|-----------------|
| `validateISBN(isbn)` | `^978-\d{1,5}-\d{1,7}-\d{1,7}-\d$` | `978-616-05-0210-3` |
| `validateMemberID(id)` | `^LIB-\d{4}$` | `LIB-0042` |
| `validatePhone(phone)` | `^0[6-9]\d{8}$` | `0812345678` |
| `validateEmail(email)` | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | `user@example.com` |
| `validateBookTitle(title)` | ยาว 1–100 ตัวอักษร ไม่ขึ้นต้นด้วย space | `"JavaScript Basics"` |

### การอัปเดต services
- `addBook` — เรียก validateISBN และ validateBookTitle ก่อน push
- `addMember` — เรียก validateMemberID, validatePhone, validateEmail ก่อน push

## 4. ตัวอย่าง Input/Output

```javascript
validateISBN("978-616-05-0210-3");  // { valid: true, message: "Valid ISBN" }
validateISBN("1234567890");         // { valid: false, message: "ISBN must be in format: 978-x-x-x-x" }
validateMemberID("LIB-0042");       // { valid: true, message: "Valid member ID" }
validatePhone("0812345678");        // { valid: true, message: "Valid phone" }
validateEmail("bad-email");         // { valid: false, message: "Invalid email format" }
```

## 5. Test Cases ที่ต้องผ่าน
- [ ] validateISBN: valid (978-xxx), invalid (ไม่มี 978, format ผิด)
- [ ] validateMemberID: valid (LIB-0000), invalid (ตัวพิมพ์เล็ก, ตัวเลขผิดจำนวน)
- [ ] validatePhone: valid (06x, 07x, 08x, 09x), invalid (05x, ขาดหลัก)
- [ ] validateEmail: valid, invalid (ไม่มี @, ไม่มี domain)
- [ ] validateBookTitle: valid, invalid (ขึ้นต้นด้วย space, เกิน 100 ตัว, ว่าง)
- [ ] addBook throw เมื่อ ISBN ไม่ถูก format
- [ ] addMember throw เมื่อ memberID ไม่ถูก format

## 6. เกณฑ์การส่ง
- ทุก test ผ่าน (`npm test`)
- ใช้ regex literal ใน validator.js ทุก function
- ห้ามใช้ try-catch
```

- [ ] **Step 3: Commit**

```bash
git add docs/SRS-week3.md
git commit -m "docs(week3): add SRS for regex validation"
```

---

### Task 9: Week 3 — validator (TDD)

**Files:**
- Create: `tests/validation.test.js`
- Create: `utils/validator.js`

- [ ] **Step 1: Create tests/validation.test.js**

```javascript
import { validateISBN, validateMemberID, validatePhone, validateEmail, validateBookTitle } from "../utils/validator.js";

describe("validateISBN", () => {
  test("valid ISBN format", () => {
    expect(validateISBN("978-616-05-0210-3").valid).toBe(true);
  });
  test("invalid - missing 978 prefix", () => {
    expect(validateISBN("979-616-05-0210-3").valid).toBe(false);
  });
  test("invalid - no dashes", () => {
    expect(validateISBN("9786160502103").valid).toBe(false);
  });
  test("returns message on invalid", () => {
    expect(validateISBN("bad").message).toContain("978");
  });
});

describe("validateMemberID", () => {
  test("valid member ID", () => {
    expect(validateMemberID("LIB-0042").valid).toBe(true);
  });
  test("valid member ID with leading zeros", () => {
    expect(validateMemberID("LIB-0001").valid).toBe(true);
  });
  test("invalid - lowercase lib", () => {
    expect(validateMemberID("lib-0042").valid).toBe(false);
  });
  test("invalid - fewer than 4 digits", () => {
    expect(validateMemberID("LIB-42").valid).toBe(false);
  });
  test("invalid - more than 4 digits", () => {
    expect(validateMemberID("LIB-00001").valid).toBe(false);
  });
});

describe("validatePhone", () => {
  test("valid 08x number", () => {
    expect(validatePhone("0812345678").valid).toBe(true);
  });
  test("valid 09x number", () => {
    expect(validatePhone("0912345678").valid).toBe(true);
  });
  test("valid 06x number", () => {
    expect(validatePhone("0612345678").valid).toBe(true);
  });
  test("invalid - starts with 05", () => {
    expect(validatePhone("0512345678").valid).toBe(false);
  });
  test("invalid - too short", () => {
    expect(validatePhone("081234567").valid).toBe(false);
  });
});

describe("validateEmail", () => {
  test("valid email", () => {
    expect(validateEmail("user@example.com").valid).toBe(true);
  });
  test("valid email with subdomain", () => {
    expect(validateEmail("user@mail.example.com").valid).toBe(true);
  });
  test("invalid - no @", () => {
    expect(validateEmail("userexample.com").valid).toBe(false);
  });
  test("invalid - no domain extension", () => {
    expect(validateEmail("user@example").valid).toBe(false);
  });
});

describe("validateBookTitle", () => {
  test("valid title", () => {
    expect(validateBookTitle("JavaScript Basics").valid).toBe(true);
  });
  test("valid single character", () => {
    expect(validateBookTitle("A").valid).toBe(true);
  });
  test("invalid - starts with space", () => {
    expect(validateBookTitle(" JS").valid).toBe(false);
  });
  test("invalid - empty string", () => {
    expect(validateBookTitle("").valid).toBe(false);
  });
  test("invalid - over 100 characters", () => {
    expect(validateBookTitle("A".repeat(101)).valid).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify tests fail**

```bash
npm test tests/validation.test.js
```

Expected: FAIL — `Cannot find module '../utils/validator.js'`

- [ ] **Step 3: Create utils/validator.js**

```javascript
export function validateISBN(isbn) {
  const pattern = /^978-\d{1,5}-\d{1,7}-\d{1,7}-\d$/;
  const valid = pattern.test(isbn);
  return { valid, message: valid ? "Valid ISBN" : "ISBN must be in format: 978-x-x-x-x" };
}

export function validateMemberID(id) {
  const pattern = /^LIB-\d{4}$/;
  const valid = pattern.test(id);
  return { valid, message: valid ? "Valid member ID" : "Member ID must be in format: LIB-0000" };
}

export function validatePhone(phone) {
  const pattern = /^0[6-9]\d{8}$/;
  const valid = pattern.test(phone);
  return { valid, message: valid ? "Valid phone" : "Phone must start with 06-09 and be 10 digits" };
}

export function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const valid = pattern.test(email);
  return { valid, message: valid ? "Valid email" : "Invalid email format" };
}

export function validateBookTitle(title) {
  const valid = typeof title === "string" && title.length >= 1 && title.length <= 100 && !/^\s/.test(title);
  return { valid, message: valid ? "Valid title" : "Title must be 1-100 characters and not start with whitespace" };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test tests/validation.test.js
```

Expected: PASS — 19 tests passed

- [ ] **Step 5: Commit**

```bash
git add tests/validation.test.js utils/validator.js
git commit -m "feat(week3): add validator with regex test coverage"
```

---

### Task 10: Week 3 — Integrate Validator into Services

**Files:**
- Modify: `services/bookService.js`
- Modify: `services/memberService.js`
- Modify: `tests/book.test.js` (add validation tests)
- Modify: `tests/member.test.js` (add validation tests)

- [ ] **Step 1: Add validation tests to tests/book.test.js**

Append at the bottom of `tests/book.test.js`:

```javascript
describe("addBook — validation (week3)", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("throws when ISBN format is invalid", () => {
    const book = new Book({ id: "B001", title: "Valid Title", author: "Alice", isbn: "INVALID-ISBN", category: "Technology" });
    expect(() => addBook(library, book)).toThrow("ISBN must be in format");
  });

  test("throws when title starts with whitespace", () => {
    const book = new Book({ id: "B001", title: " Bad Title", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    expect(() => addBook(library, book)).toThrow("Title must be");
  });
});
```

- [ ] **Step 2: Add validation tests to tests/member.test.js**

Append at the bottom of `tests/member.test.js`:

```javascript
describe("addMember — validation (week3)", () => {
  let library;
  beforeEach(() => { library = { members: [] }; });

  test("throws when member ID format is invalid", () => {
    const m = new Member({ id: "INVALID", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    expect(() => addMember(library, m)).toThrow("Member ID must be in format");
  });

  test("throws when phone format is invalid", () => {
    const m = new Member({ id: "LIB-0001", name: "Alice", phone: "12345", email: "alice@test.com" });
    expect(() => addMember(library, m)).toThrow("Phone must start with 06-09");
  });

  test("throws when email is invalid", () => {
    const m = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "notanemail" });
    expect(() => addMember(library, m)).toThrow("Invalid email format");
  });
});
```

- [ ] **Step 3: Run tests to verify new tests fail**

```bash
npm test tests/book.test.js tests/member.test.js
```

Expected: FAIL — validation tests fail, original tests still pass

- [ ] **Step 4: Replace services/bookService.js**

```javascript
import { Book } from "../models/Book.js";
import { validateISBN, validateBookTitle } from "../utils/validator.js";

export function addBook(library, book) {
  if (!(book instanceof Book)) throw new Error("Invalid book");

  const isbnCheck = validateISBN(book.isbn);
  if (!isbnCheck.valid) throw new Error(isbnCheck.message);

  const titleCheck = validateBookTitle(book.title);
  if (!titleCheck.valid) throw new Error(titleCheck.message);

  if (library.books.find((b) => b.id === book.id)) throw new Error("Book already exists");
  library.books.push(book);
}

export function removeBook(library, bookId) {
  const index = library.books.findIndex((b) => b.id === bookId);
  if (index === -1) throw new Error("Book not found");
  library.books.splice(index, 1);
}

export function searchBook(library, query) {
  const q = query.toLowerCase();
  return library.books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
  );
}

export function listAllBooks(library) {
  return [...library.books];
}
```

- [ ] **Step 5: Replace services/memberService.js**

```javascript
import { Member } from "../models/Member.js";
import { validateMemberID, validatePhone, validateEmail } from "../utils/validator.js";

export function addMember(library, member) {
  if (!(member instanceof Member)) throw new Error("Invalid member");

  const idCheck = validateMemberID(member.id);
  if (!idCheck.valid) throw new Error(idCheck.message);

  const phoneCheck = validatePhone(member.phone);
  if (!phoneCheck.valid) throw new Error(phoneCheck.message);

  const emailCheck = validateEmail(member.email);
  if (!emailCheck.valid) throw new Error(emailCheck.message);

  if (library.members.find((m) => m.id === member.id)) throw new Error("Member already exists");
  library.members.push(member);
}

export function getMember(library, memberId) {
  const member = library.members.find((m) => m.id === memberId);
  if (!member) throw new Error("Member not found");
  return member;
}
```

- [ ] **Step 6: Run all tests to verify everything passes**

```bash
npm test
```

Expected: PASS — all tests passed (including new validation tests)

- [ ] **Step 7: Commit**

```bash
git add services/bookService.js services/memberService.js tests/book.test.js tests/member.test.js
git commit -m "feat(week3): integrate regex validation into bookService and memberService"
```

---

### Task 11: Week 4 Branch — SRS + LibraryErrors

**Files:**
- Create: `docs/SRS-week4.md`
- Create: `errors/LibraryErrors.js`

- [ ] **Step 1: Create week4 branch**

```bash
git checkout -b week4/exception
```

- [ ] **Step 2: Create docs/SRS-week4.md**

```markdown
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
```

- [ ] **Step 3: Create errors/LibraryErrors.js**

```javascript
export class LibraryError extends Error {
  constructor(message) {
    super(message);
    this.name = "LibraryError";
  }
}

export class BookNotFoundError extends LibraryError {
  constructor(bookId) {
    super(`Book not found: ${bookId}`);
    this.name = "BookNotFoundError";
  }
}

export class MemberNotFoundError extends LibraryError {
  constructor(memberId) {
    super(`Member not found: ${memberId}`);
    this.name = "MemberNotFoundError";
  }
}

export class BookNotAvailableError extends LibraryError {
  constructor(bookId) {
    super(`Book not available: ${bookId}`);
    this.name = "BookNotAvailableError";
  }
}

export class ValidationError extends LibraryError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class OverdueError extends LibraryError {
  constructor(recordId, days) {
    super(`Book overdue by ${days} day(s): record ${recordId}`);
    this.name = "OverdueError";
    this.days = days;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add docs/SRS-week4.md errors/LibraryErrors.js
git commit -m "feat(week4): add SRS and custom error classes"
```

---

### Task 12: Week 4 — Update Services + Safe Wrappers (TDD)

**Files:**
- Modify: `tests/book.test.js` (add safe wrapper tests)
- Modify: `tests/member.test.js` (add safe wrapper tests)
- Modify: `tests/borrow.test.js` (add safe wrapper tests)
- Modify: `services/bookService.js`
- Modify: `services/memberService.js`
- Modify: `services/borrowService.js`

- [ ] **Step 1: Append safe wrapper tests to tests/book.test.js**

First, update the import line at the top of `tests/book.test.js`:
```javascript
// Change this line:
import { addBook, removeBook, searchBook, listAllBooks } from "../services/bookService.js";
// To:
import { addBook, removeBook, searchBook, listAllBooks, safeAddBook, safeRemoveBook } from "../services/bookService.js";
```

Then append these describes at the bottom:

```javascript
describe("safeAddBook (week4)", () => {
  let library;
  beforeEach(() => { library = { books: [] }; });

  test("returns success:true when book is valid", () => {
    const book = new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    const result = safeAddBook(library, book);
    expect(result.success).toBe(true);
    expect(result.message).toBe("Book added successfully");
  });

  test("returns success:false on invalid book instance", () => {
    const result = safeAddBook(library, { id: "B001" });
    expect(result.success).toBe(false);
    expect(result.data).toBeNull();
  });

  test("returns success:false on duplicate id", () => {
    const book = new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" });
    safeAddBook(library, book);
    expect(safeAddBook(library, book).success).toBe(false);
  });
});

describe("safeRemoveBook (week4)", () => {
  let library;
  beforeEach(() => {
    library = { books: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
  });

  test("returns success:true when book exists", () => {
    expect(safeRemoveBook(library, "B001").success).toBe(true);
  });

  test("returns success:false when book not found", () => {
    expect(safeRemoveBook(library, "BNONE").success).toBe(false);
  });
});
```

- [ ] **Step 2: Append safe wrapper tests to tests/member.test.js**

First, update the import at the top of `tests/member.test.js`:
```javascript
// Change this line:
import { addMember, getMember } from "../services/memberService.js";
// To:
import { addMember, getMember, safeAddMember } from "../services/memberService.js";
```

Then append at the bottom:

```javascript
describe("safeAddMember (week4)", () => {
  let library;
  beforeEach(() => { library = { members: [] }; });

  test("returns success:true on valid member", () => {
    const m = new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    expect(safeAddMember(library, m).success).toBe(true);
  });

  test("returns success:false on invalid member ID", () => {
    const m = new Member({ id: "INVALID", name: "Alice", phone: "0812345678", email: "alice@test.com" });
    expect(safeAddMember(library, m).success).toBe(false);
  });
});
```

- [ ] **Step 3: Append safe wrapper tests to tests/borrow.test.js**

First, update the borrowService import at the top of `tests/borrow.test.js`:
```javascript
// Change this line:
import { borrowBook, returnBook } from "../services/borrowService.js";
// To:
import { borrowBook, returnBook, safeBorrowBook, safeReturnBook } from "../services/borrowService.js";
```

Then append at the bottom:

```javascript
describe("safeBorrowBook (week4)", () => {
  let library;
  beforeEach(() => {
    library = { books: [], members: [], records: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
    addMember(library, new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" }));
  });

  test("returns success:true on valid borrow", () => {
    const result = safeBorrowBook(library, "LIB-0001", "B001");
    expect(result.success).toBe(true);
    expect(result.data).not.toBeNull();
  });

  test("returns success:false when book not available", () => {
    safeBorrowBook(library, "LIB-0001", "B001");
    expect(safeBorrowBook(library, "LIB-0001", "B001").success).toBe(false);
  });
});

describe("safeReturnBook (week4)", () => {
  let library;
  let record;
  beforeEach(() => {
    library = { books: [], members: [], records: [] };
    addBook(library, new Book({ id: "B001", title: "JS", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
    addMember(library, new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@test.com" }));
    record = borrowBook(library, "LIB-0001", "B001");
  });

  test("returns success:true on valid return", () => {
    expect(safeReturnBook(library, record.recordId).success).toBe(true);
  });

  test("returns success:false when record not found", () => {
    expect(safeReturnBook(library, "RNONE").success).toBe(false);
  });
});
```

- [ ] **Step 4: Run to verify new tests fail**

```bash
npm test
```

Expected: FAIL — safe wrapper functions not yet exported

- [ ] **Step 5: Replace services/bookService.js**

```javascript
import { Book } from "../models/Book.js";
import { validateISBN, validateBookTitle } from "../utils/validator.js";
import { BookNotFoundError, ValidationError } from "../errors/LibraryErrors.js";

export function addBook(library, book) {
  if (!(book instanceof Book)) throw new ValidationError("Invalid book");

  const isbnCheck = validateISBN(book.isbn);
  if (!isbnCheck.valid) throw new ValidationError(isbnCheck.message);

  const titleCheck = validateBookTitle(book.title);
  if (!titleCheck.valid) throw new ValidationError(titleCheck.message);

  if (library.books.find((b) => b.id === book.id)) throw new ValidationError("Book already exists");
  library.books.push(book);
}

export function removeBook(library, bookId) {
  const index = library.books.findIndex((b) => b.id === bookId);
  if (index === -1) throw new BookNotFoundError(bookId);
  library.books.splice(index, 1);
}

export function searchBook(library, query) {
  const q = query.toLowerCase();
  return library.books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
  );
}

export function listAllBooks(library) {
  return [...library.books];
}

export function safeAddBook(library, book) {
  try {
    addBook(library, book);
    return { success: true, data: library.books, message: "Book added successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeAddBook completed");
  }
}

export function safeRemoveBook(library, bookId) {
  try {
    removeBook(library, bookId);
    return { success: true, data: library.books, message: "Book removed successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeRemoveBook completed");
  }
}
```

- [ ] **Step 6: Replace services/memberService.js**

```javascript
import { Member } from "../models/Member.js";
import { validateMemberID, validatePhone, validateEmail } from "../utils/validator.js";
import { MemberNotFoundError, ValidationError } from "../errors/LibraryErrors.js";

export function addMember(library, member) {
  if (!(member instanceof Member)) throw new ValidationError("Invalid member");

  const idCheck = validateMemberID(member.id);
  if (!idCheck.valid) throw new ValidationError(idCheck.message);

  const phoneCheck = validatePhone(member.phone);
  if (!phoneCheck.valid) throw new ValidationError(phoneCheck.message);

  const emailCheck = validateEmail(member.email);
  if (!emailCheck.valid) throw new ValidationError(emailCheck.message);

  if (library.members.find((m) => m.id === member.id)) throw new ValidationError("Member already exists");
  library.members.push(member);
}

export function getMember(library, memberId) {
  const member = library.members.find((m) => m.id === memberId);
  if (!member) throw new MemberNotFoundError(memberId);
  return member;
}

export function safeAddMember(library, member) {
  try {
    addMember(library, member);
    return { success: true, data: library.members, message: "Member added successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeAddMember completed");
  }
}
```

- [ ] **Step 7: Replace services/borrowService.js**

```javascript
import { BorrowRecord } from "../models/BorrowRecord.js";
import { getMember } from "./memberService.js";
import { calculateDueDate } from "../utils/dateUtils.js";
import { libraryConfig } from "../config/libraryConfig.js";
import { BookNotFoundError, BookNotAvailableError, LibraryError } from "../errors/LibraryErrors.js";

export function borrowBook(library, memberId, bookId) {
  const member = getMember(library, memberId);
  const book = library.books.find((b) => b.id === bookId);
  if (!book) throw new BookNotFoundError(bookId);
  if (!book.isAvailable) throw new BookNotAvailableError(bookId);

  const borrowDate = new Date();
  const dueDate = calculateDueDate(borrowDate, libraryConfig.borrowDays);
  const record = new BorrowRecord({ recordId: `R${Date.now()}`, book, member, borrowDate, dueDate });

  book.checkout();
  member.borrowedBooks.push(record);
  library.records.push(record);
  return record;
}

export function returnBook(library, recordId) {
  const record = library.records.find((r) => r.recordId === recordId);
  if (!record) throw new LibraryError(`Record not found: ${recordId}`);
  if (record.returnDate) throw new LibraryError("Book already returned");

  record.returnDate = new Date();
  record.book.checkin();
  return record;
}

export function safeBorrowBook(library, memberId, bookId) {
  try {
    const record = borrowBook(library, memberId, bookId);
    return { success: true, data: record, message: "Book borrowed successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeBorrowBook completed");
  }
}

export function safeReturnBook(library, recordId) {
  try {
    const record = returnBook(library, recordId);
    return { success: true, data: record, message: "Book returned successfully" };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  } finally {
    console.log("safeReturnBook completed");
  }
}
```

- [ ] **Step 8: Run all tests**

```bash
npm test
```

Expected: PASS — all tests passed

- [ ] **Step 9: Commit**

```bash
git add services/bookService.js services/memberService.js services/borrowService.js tests/book.test.js tests/member.test.js tests/borrow.test.js
git commit -m "feat(week4): add custom errors and safe wrapper functions"
```

---

### Task 13: Week 4 — app.js Update

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Replace app.js**

```javascript
import { Book } from "./models/Book.js";
import { Member } from "./models/Member.js";
import { safeAddBook, safeRemoveBook } from "./services/bookService.js";
import { safeAddMember } from "./services/memberService.js";
import { safeBorrowBook, safeReturnBook } from "./services/borrowService.js";
import { formatDate } from "./utils/dateUtils.js";

const library = { books: [], members: [], records: [] };

console.log("=== Safe Add Book ===");
const r1 = safeAddBook(library, new Book({ id: "B001", title: "JavaScript Basics", author: "Alice", isbn: "978-616-05-0001-1", category: "Technology" }));
console.log(r1.success ? `Added: ${r1.data.length} book(s)` : `Error: ${r1.message}`);

const r2 = safeAddBook(library, { id: "B002" }); // invalid — not a Book instance
console.log(r2.success ? "Added" : `Error: ${r2.message}`);

console.log("\n=== Safe Add Member ===");
const r3 = safeAddMember(library, new Member({ id: "LIB-0001", name: "Alice", phone: "0812345678", email: "alice@example.com" }));
console.log(r3.success ? "Member added" : `Error: ${r3.message}`);

const r4 = safeAddMember(library, new Member({ id: "BADID", name: "Bob", phone: "0812345678", email: "bob@example.com" }));
console.log(r4.success ? "Member added" : `Error: ${r4.message}`);

console.log("\n=== Safe Borrow & Return ===");
const r5 = safeBorrowBook(library, "LIB-0001", "B001");
if (r5.success) {
  console.log(`Borrowed: ${r5.data.book.title}, due: ${formatDate(r5.data.dueDate)}`);
}

const r6 = safeBorrowBook(library, "LIB-0001", "B001"); // already borrowed
console.log(r6.success ? "Borrowed" : `Error: ${r6.message}`);

const r7 = safeReturnBook(library, r5.data.recordId);
console.log(r7.success ? `Returned on ${formatDate(r7.data.returnDate)}` : `Error: ${r7.message}`);
```

- [ ] **Step 2: Run and verify**

```bash
node app.js
```

Expected: output with safe results, error messages for invalid inputs, `finally` logs from safe functions

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat(week4): update app.js to demonstrate safe functions"
```

---

### Task 14: Week 5 Branch — SRS + fineUtils (TDD)

**Files:**
- Create: `docs/SRS-week5.md`
- Create: `tests/fine.test.js`
- Create: `utils/fineUtils.js`

- [ ] **Step 1: Create week5 branch**

```bash
git checkout -b week5/integration
```

- [ ] **Step 2: Create docs/SRS-week5.md**

```markdown
# SRS Week 5 — Integration (ระบบห้องสมุดสมบูรณ์)

## 1. วัตถุประสงค์
รวมทุก topic เข้าด้วยกันและเพิ่ม feature คำนวณค่าปรับ

## 2. Topics ที่ใช้ (ทุก topic รวมกัน)
- JS Modules + DateTime + Regular Expression + Exception Handling

## 3. Functions ที่ต้องสร้าง

### utils/fineUtils.js — named exports
| Function | Parameters | Return | คำอธิบาย |
|----------|-----------|--------|----------|
| `calculateFine(dueDate, returnDate, ratePerDay?)` | Date, Date, number (default: libraryConfig.fineRatePerDay) | number | ค่าปรับ = วันที่เกิน × ratePerDay (0 ถ้าคืนก่อน/ตรงกำหนด) |
| `getTotalFine(records)` | BorrowRecord[] | number | รวมค่าปรับทุก record (ถ้ายังไม่คืน ใช้วันปัจจุบัน) |

## 4. ตัวอย่าง Input/Output

```javascript
// คืนช้า 3 วัน, rate 5 บาท/วัน
calculateFine(new Date(2026, 0, 15), new Date(2026, 0, 18), 5); // 15

// คืนก่อนกำหนด
calculateFine(new Date(2026, 0, 15), new Date(2026, 0, 10));    // 0

// รวมหลาย record
getTotalFine([
  { dueDate: new Date(2026, 0, 10), returnDate: new Date(2026, 0, 13) }, // 3 วัน × 5 = 15
  { dueDate: new Date(2026, 0, 10), returnDate: new Date(2026, 0, 12) }, // 2 วัน × 5 = 10
]); // 25
```

## 5. Test Cases ที่ต้องผ่าน
- [ ] calculateFine คืน 0 เมื่อคืนก่อน/ตรงกำหนด
- [ ] calculateFine คำนวณถูกต้องเมื่อคืนช้า
- [ ] calculateFine ใช้ custom rate ได้
- [ ] getTotalFine รวมค่าปรับหลาย record ถูกต้อง
- [ ] getTotalFine คืน 0 เมื่อทุก record คืนตรงเวลา
- [ ] npm test ทุกไฟล์ผ่านทั้งหมด

## 6. เกณฑ์การส่ง
- ทุก test ใน 5 test files ผ่าน (`npm test`)
- app.js แสดงระบบครบทุก feature
```

- [ ] **Step 3: Create tests/fine.test.js**

```javascript
import { calculateFine, getTotalFine } from "../utils/fineUtils.js";

describe("calculateFine", () => {
  test("returns 0 when returned before due date", () => {
    const due = new Date(2026, 0, 15);
    const ret = new Date(2026, 0, 10);
    expect(calculateFine(due, ret)).toBe(0);
  });

  test("returns 0 when returned on due date", () => {
    const due = new Date(2026, 0, 15);
    expect(calculateFine(due, due)).toBe(0);
  });

  test("calculates fine for 3 overdue days at default rate (5)", () => {
    const due = new Date(2026, 0, 15);
    const ret = new Date(2026, 0, 18);
    expect(calculateFine(due, ret)).toBe(15);
  });

  test("calculates fine with custom rate", () => {
    const due = new Date(2026, 0, 15);
    const ret = new Date(2026, 0, 17);
    expect(calculateFine(due, ret, 10)).toBe(20);
  });
});

describe("getTotalFine", () => {
  test("sums fines across multiple records", () => {
    const records = [
      { dueDate: new Date(2026, 0, 10), returnDate: new Date(2026, 0, 13) },
      { dueDate: new Date(2026, 0, 10), returnDate: new Date(2026, 0, 12) },
    ];
    expect(getTotalFine(records)).toBe(25);
  });

  test("returns 0 when all records returned on time", () => {
    const records = [
      { dueDate: new Date(2026, 0, 20), returnDate: new Date(2026, 0, 15) },
    ];
    expect(getTotalFine(records)).toBe(0);
  });

  test("returns 0 for empty record list", () => {
    expect(getTotalFine([])).toBe(0);
  });
});
```

- [ ] **Step 4: Run to verify tests fail**

```bash
npm test tests/fine.test.js
```

Expected: FAIL — `Cannot find module '../utils/fineUtils.js'`

- [ ] **Step 5: Create utils/fineUtils.js**

```javascript
import { daysDiff } from "./dateUtils.js";
import { libraryConfig } from "../config/libraryConfig.js";

export function calculateFine(dueDate, returnDate, ratePerDay = libraryConfig.fineRatePerDay) {
  const days = daysDiff(dueDate, returnDate);
  if (days <= 0) return 0;
  return days * ratePerDay;
}

export function getTotalFine(records) {
  return records.reduce((total, record) => {
    const returnDate = record.returnDate ?? new Date();
    return total + calculateFine(record.dueDate, returnDate);
  }, 0);
}
```

- [ ] **Step 6: Run all tests**

```bash
npm test tests/fine.test.js
```

Expected: PASS — 7 tests passed

- [ ] **Step 7: Commit SRS + fineUtils**

```bash
git add docs/SRS-week5.md tests/fine.test.js utils/fineUtils.js
git commit -m "feat(week5): add SRS and fineUtils with full test coverage"
```

---

### Task 15: Week 5 — Final app.js + Verify All Tests Pass

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Replace app.js with full demo**

```javascript
import { Book } from "./models/Book.js";
import { Member } from "./models/Member.js";
import { safeAddBook, listAllBooks } from "./services/bookService.js";
import { safeAddMember } from "./services/memberService.js";
import { safeBorrowBook, safeReturnBook } from "./services/borrowService.js";
import { formatDate, isOverdue } from "./utils/dateUtils.js";
import { calculateFine, getTotalFine } from "./utils/fineUtils.js";

const library = { books: [], members: [], records: [] };

// ─── 1. Add Books ──────────────────────────────────────────────────────────────
safeAddBook(library, new Book({ id: "B001", title: "JavaScript Basics", author: "Alice Smith", isbn: "978-616-05-0001-1", category: "Technology" }));
safeAddBook(library, new Book({ id: "B002", title: "Python for Beginners", author: "Bob Jones", isbn: "978-616-05-0002-8", category: "Technology" }));
safeAddBook(library, new Book({ id: "B003", title: "Clean Code", author: "Robert Martin", isbn: "978-616-05-0003-5", category: "Technology" }));

console.log("=== Books in Library ===");
listAllBooks(library).forEach((b) => console.log(`  ${b.id}: ${b.title}`));

// ─── 2. Add Members ────────────────────────────────────────────────────────────
safeAddMember(library, new Member({ id: "LIB-0001", name: "Alice Smith", phone: "0812345678", email: "alice@example.com" }));
safeAddMember(library, new Member({ id: "LIB-0002", name: "Bob Jones", phone: "0923456789", email: "bob@example.com" }));

// ─── 3. Borrow Books ───────────────────────────────────────────────────────────
console.log("\n=== Borrowing ===");
const b1 = safeBorrowBook(library, "LIB-0001", "B001");
const b2 = safeBorrowBook(library, "LIB-0002", "B002");
console.log(b1.success ? `${b1.data.member.name} borrowed "${b1.data.book.title}", due: ${formatDate(b1.data.dueDate)}` : b1.message);
console.log(b2.success ? `${b2.data.member.name} borrowed "${b2.data.book.title}", due: ${formatDate(b2.data.dueDate)}` : b2.message);

// ─── 4. Simulate overdue return ────────────────────────────────────────────────
console.log("\n=== Return with Fine Calculation ===");
const ret1 = safeReturnBook(library, b1.data.recordId);
if (ret1.success) {
  const fine = calculateFine(ret1.data.dueDate, ret1.data.returnDate);
  console.log(`"${ret1.data.book.title}" returned. Fine: ${fine} baht`);
}

// ─── 5. Fine summary ──────────────────────────────────────────────────────────
console.log("\n=== Fine Summary ===");
const totalFine = getTotalFine(library.records);
console.log(`Total fines across all records: ${totalFine} baht`);

// ─── 6. Overdue check ─────────────────────────────────────────────────────────
console.log("\n=== Active Borrows ===");
library.records
  .filter((r) => !r.returnDate)
  .forEach((r) => {
    const overdue = isOverdue(r.dueDate);
    console.log(`  ${r.member.name}: "${r.book.title}" — ${overdue ? "OVERDUE" : `due ${formatDate(r.dueDate)}`}`);
  });
```

- [ ] **Step 2: Run app.js to verify it works**

```bash
node app.js
```

Expected: output showing books, members, borrow records, fine = 0 (returned same day), active borrows

- [ ] **Step 3: Run ALL tests to confirm nothing is broken**

```bash
npm test
```

Expected: PASS — all test suites pass (book, member, borrow, validation, fine)

- [ ] **Step 4: Final commit**

```bash
git add app.js
git commit -m "feat(week5): complete integration demo with fine calculation"
```

---

## Summary of Branches and Commits

| Branch | Commits | Topics ครอบคลุม |
|--------|---------|----------------|
| `main` | init | — |
| `week1/modules` | SRS + config + model + service + test + app | JS Modules |
| `week2/datetime` | SRS + models + dateUtils + services + app | + DateTime |
| `week3/regex` | SRS + validator + update services | + Regex |
| `week4/exception` | SRS + errors + safe wrappers + app | + Exception |
| `week5/integration` | SRS + fineUtils + final app | All topics |

To view each week's state: `git checkout week1/modules` (ปรับ branch ตามต้องการ)

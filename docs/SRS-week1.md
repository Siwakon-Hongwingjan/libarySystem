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

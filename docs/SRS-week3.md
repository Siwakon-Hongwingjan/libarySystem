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

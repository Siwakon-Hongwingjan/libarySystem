# วิธีใช้งาน Library System

## โครงสร้าง Branches

| Branch | เนื้อหา |
|--------|---------|
| `main` | จุดเริ่มต้น — ทำแบบฝึกหัดที่นี่ |
| `week1/modules` | เฉลย Week 1 |
| `week2/datetime` | เฉลย Week 2 (มี Week 1 ติดมาด้วย) |
| `week3/regex` | เฉลย Week 3 |
| `week4/exception` | เฉลย Week 4 |
| `week5/integration` | เฉลย Week 5 |

---

## Workflow

ทำทุกอย่างใน `main` แล้ว snapshot ไว้เป็น branch หลังจบแต่ละ week

```
main: ทำ week1 → commit → git branch week1/my
main: ทำ week2 → commit → git branch week2/my
main: ทำ week3 → commit → git branch week3/my
...
```

### คำสั่งสร้าง branch checkpoint

```bash
# สร้าง branch ณ จุดนี้ โดยไม่ต้องสลับออกจาก main
git branch week1/my
```

---

## ดึง Test File จากเฉลย

ไม่ต้องก็อปไฟล์เองหรือสลับ branch ใช้คำสั่งนี้แทน:

```bash
# ดึงเฉพาะไฟล์ test ที่ต้องการมาไว้ใน main
git checkout week1/modules -- tests/book.test.js
git checkout week2/datetime -- tests/borrow.test.js
git checkout week2/datetime -- tests/member.test.js
git checkout week3/regex   -- tests/validation.test.js
git checkout week5/integration -- tests/fine.test.js
```

---

## รัน Tests

```bash
# รันทุก test
npm test

# รันเฉพาะไฟล์
npm test tests/book.test.js
```

---

## ดู SRS (โจทย์แต่ละ Week)

```bash
# ดู SRS week1 จาก branch เฉลย (ไม่สลับ branch)
git show week1/modules:docs/SRS-week1.md

# หรือดูเฉลย code
git show week1/modules:services/bookService.js
```

---

## เปรียบเทียบ code ของตัวเองกับเฉลย

```bash
git diff week1/modules -- services/bookService.js
```

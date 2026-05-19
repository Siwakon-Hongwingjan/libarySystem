import { calculateDueDate, formatDate, isOverdue, daysDiff } from "../utils/dateUtils.js";
import { Book } from "../models/Book.js";
import { Member } from "../models/Member.js";
import { addBook } from "../services/bookService.js";
import { addMember } from "../services/memberService.js";
import { borrowBook, returnBook, safeBorrowBook, safeReturnBook } from "../services/borrowService.js";

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

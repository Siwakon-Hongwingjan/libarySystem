import { calculateFine, getTotalFine } from "../utils/fineUtils.js";

// ─── calculateFine ───────────────────────────────────────────────────────────

describe("calculateFine", () => {
  test("returns 0 when returned on due date", () => {
    const dueDate = new Date(2026, 4, 10); // May 10, 2026
    const returnDate = new Date(2026, 4, 10); // May 10, 2026
    expect(calculateFine(dueDate, returnDate)).toBe(0);
  });

  test("returns 0 when returned before due date", () => {
    const dueDate = new Date(2026, 4, 10); // May 10, 2026
    const returnDate = new Date(2026, 4, 5); // May 5, 2026
    expect(calculateFine(dueDate, returnDate)).toBe(0);
  });

  test("calculates fine for 1 day overdue", () => {
    const dueDate = new Date(2026, 4, 10); // May 10, 2026
    const returnDate = new Date(2026, 4, 11); // May 11, 2026 (1 day late)
    expect(calculateFine(dueDate, returnDate)).toBe(5); // 1 × 5 = 5 บาท
  });

  test("calculates fine for 5 days overdue", () => {
    const dueDate = new Date(2026, 4, 10); // May 10, 2026
    const returnDate = new Date(2026, 4, 15); // May 15, 2026 (5 days late)
    expect(calculateFine(dueDate, returnDate)).toBe(25); // 5 × 5 = 25 บาท
  });

  test("uses custom rate per day", () => {
    const dueDate = new Date(2026, 4, 10); // May 10, 2026
    const returnDate = new Date(2026, 4, 13); // May 13, 2026 (3 days late)
    expect(calculateFine(dueDate, returnDate, 10)).toBe(30); // 3 × 10 = 30 บาท
  });
});

// ─── getTotalFine ────────────────────────────────────────────────────────────

describe("getTotalFine", () => {
  test("returns 0 for empty records", () => {
    expect(getTotalFine([])).toBe(0);
  });

  test("calculates total fine for multiple returned records", () => {
    const records = [
      {
        dueDate: new Date(2026, 4, 1), // May 1, 2026
        returnDate: new Date(2026, 4, 3), // May 3, 2026 — ช้า 2 วัน = 10 บาท
      },
      {
        dueDate: new Date(2026, 4, 1), // May 1, 2026
        returnDate: new Date(2026, 4, 4), // May 4, 2026 — ช้า 3 วัน = 15 บาท
      },
    ];
    expect(getTotalFine(records)).toBe(25); // 10 + 15 = 25 บาท
  });

  test("uses returnDate = today for records not yet returned", () => {
    // dueDate อยู่ในอดีต, ไม่มี returnDate → ใช้ new Date() → fine ต้องมากกว่า 0
    const records = [
      {
        dueDate: new Date(2025, 0, 1), // Jan 1, 2025 (past)
        returnDate: null,
      },
    ];
    expect(getTotalFine(records)).toBeGreaterThan(0);
  });
});

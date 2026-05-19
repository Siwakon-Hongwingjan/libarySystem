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

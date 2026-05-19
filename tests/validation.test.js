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
